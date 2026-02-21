import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { mpPayment } from '@/lib/mercadopago';
import { sendEmail } from '@/lib/email';
import { paymentConfirmationEmail } from '@/lib/email-templates';

// Verify pending payments by checking MercadoPago status
// This acts as a fallback when the webhook doesn't fire
export async function POST() {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
        }

        const userId = (session.user as any).id;

        // Find all pending payments for this user
        const pendingPayments = await prisma.payment.findMany({
            where: {
                userId,
                status: 'PENDING',
                mpPreferenceId: { not: null },
            },
            include: {
                enrollment: {
                    include: {
                        course: true,
                        user: { select: { name: true, email: true } },
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
            take: 5, // Only check last 5 pending payments
        });

        let updated = 0;

        for (const payment of pendingPayments) {
            try {
                // Search for payments linked to this preference in MercadoPago
                const searchResult = await fetch(
                    `https://api.mercadopago.com/v1/payments/search?external_reference=${payment.enrollmentId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`,
                        },
                    }
                );

                if (!searchResult.ok) continue;
                const searchData = await searchResult.json();

                const approvedPayment = searchData.results?.find(
                    (p: any) => p.status === 'approved'
                );

                if (approvedPayment) {
                    // Update payment record
                    await prisma.payment.update({
                        where: { id: payment.id },
                        data: {
                            status: 'APPROVED',
                            mpPaymentId: String(approvedPayment.id),
                        },
                    });

                    // Activate enrollment
                    await prisma.enrollment.update({
                        where: { id: payment.enrollmentId },
                        data: { status: 'ACTIVE' },
                    });

                    // Send confirmation email
                    const user = payment.enrollment?.user;
                    if (user?.email) {
                        const { subject, html } = paymentConfirmationEmail(
                            user.name || 'Alumno/a',
                            payment.enrollment!.course.name,
                            approvedPayment.transaction_amount || payment.amount
                        );
                        sendEmail({ to: user.email, subject, html }).catch(console.error);
                    }

                    updated++;
                }
            } catch (err) {
                console.error(`Error verifying payment ${payment.id}:`, err);
            }
        }

        return NextResponse.json({ verified: updated });
    } catch (error) {
        console.error('Verify payments error:', error);
        return NextResponse.json(
            { error: 'Error al verificar pagos' },
            { status: 500 }
        );
    }
}

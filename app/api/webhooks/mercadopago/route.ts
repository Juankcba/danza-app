import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { mpPayment } from '@/lib/mercadopago';
import { sendEmail } from '@/lib/email';
import { paymentConfirmationEmail } from '@/lib/email-templates';

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // MercadoPago sends different notification types
        if (body.type === 'payment') {
            const paymentId = body.data?.id;
            if (!paymentId) {
                return NextResponse.json({ received: true });
            }

            // Get payment details from MercadoPago
            const mpPaymentData = await mpPayment.get({ id: paymentId });

            const enrollmentId = mpPaymentData.external_reference;
            if (!enrollmentId) {
                return NextResponse.json({ received: true });
            }

            // Map MercadoPago status to our status
            let status: 'PENDING' | 'APPROVED' | 'REJECTED' = 'PENDING';
            if (mpPaymentData.status === 'approved') {
                status = 'APPROVED';
            } else if (
                mpPaymentData.status === 'rejected' ||
                mpPaymentData.status === 'cancelled'
            ) {
                status = 'REJECTED';
            }

            // Update the specific payment record that matches this preference
            const preferenceId = (mpPaymentData as any).preference_id;

            if (preferenceId) {
                // Update by preference ID for precise tracking
                await prisma.payment.updateMany({
                    where: {
                        enrollmentId,
                        mpPreferenceId: preferenceId,
                    },
                    data: {
                        status,
                        mpPaymentId: String(paymentId),
                    },
                });
            } else {
                // Fallback: update the latest pending payment for this enrollment
                const latestPayment = await prisma.payment.findFirst({
                    where: { enrollmentId, status: 'PENDING' },
                    orderBy: { createdAt: 'desc' },
                });
                if (latestPayment) {
                    await prisma.payment.update({
                        where: { id: latestPayment.id },
                        data: {
                            status,
                            mpPaymentId: String(paymentId),
                        },
                    });
                }
            }

            // If approved, activate enrollment and send confirmation email
            if (status === 'APPROVED') {
                const enrollment = await prisma.enrollment.update({
                    where: { id: enrollmentId },
                    data: { status: 'ACTIVE' },
                    include: {
                        user: { select: { name: true, email: true } },
                        course: true,
                    },
                });

                // Send payment confirmation email (non-blocking)
                if (enrollment.user.email) {
                    const { subject, html } = paymentConfirmationEmail(
                        enrollment.user.name || 'Alumno/a',
                        enrollment.course.name,
                        mpPaymentData.transaction_amount || enrollment.course.price
                    );
                    sendEmail({
                        to: enrollment.user.email,
                        subject,
                        html,
                    }).catch(console.error);
                }
            }
        }

        return NextResponse.json({ received: true });
    } catch (error) {
        console.error('Webhook error:', error);
        // Always return 200 to MercadoPago so it doesn't retry
        return NextResponse.json({ received: true });
    }
}

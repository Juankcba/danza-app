import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { mpPayment } from '@/lib/mercadopago';

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

            // Update payment record
            await prisma.payment.updateMany({
                where: { enrollmentId },
                data: {
                    status,
                    mpPaymentId: String(paymentId),
                },
            });

            // If approved, activate enrollment
            if (status === 'APPROVED') {
                await prisma.enrollment.update({
                    where: { id: enrollmentId },
                    data: { status: 'ACTIVE' },
                });
            }
        }

        return NextResponse.json({ received: true });
    } catch (error) {
        console.error('Webhook error:', error);
        // Always return 200 to MercadoPago so it doesn't retry
        return NextResponse.json({ received: true });
    }
}

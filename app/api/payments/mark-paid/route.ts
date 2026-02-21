import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { sendEmail } from '@/lib/email';
import { paymentConfirmationEmail } from '@/lib/email-templates';

// Admin marks an enrollment as paid (cash/transfer)
export async function POST(request: Request) {
    try {
        const session = await auth();
        if (!session?.user || (session.user as any).role !== 'ADMIN') {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
        }

        const { enrollmentId } = await request.json();

        const enrollment = await prisma.enrollment.findUnique({
            where: { id: enrollmentId },
            include: {
                course: true,
                user: { select: { name: true, email: true } },
            },
        });

        if (!enrollment) {
            return NextResponse.json({ error: 'Inscripción no encontrada' }, { status: 404 });
        }

        // Update enrollment to ACTIVE
        await prisma.enrollment.update({
            where: { id: enrollmentId },
            data: { status: 'ACTIVE' },
        });

        // Create or update payment record as manual
        const existingPayment = await prisma.payment.findFirst({
            where: { enrollmentId, status: 'PENDING' },
            orderBy: { createdAt: 'desc' },
        });

        if (existingPayment) {
            await prisma.payment.update({
                where: { id: existingPayment.id },
                data: { status: 'APPROVED', mpPaymentId: 'MANUAL' },
            });
        } else {
            await prisma.payment.create({
                data: {
                    userId: enrollment.userId,
                    enrollmentId,
                    type: 'CLASS',
                    amount: enrollment.course.price,
                    status: 'APPROVED',
                    mpPaymentId: 'MANUAL',
                },
            });
        }

        // Send confirmation email
        if (enrollment.user.email) {
            const { subject, html } = paymentConfirmationEmail(
                enrollment.user.name || 'Alumno/a',
                enrollment.course.name,
                enrollment.course.price
            );
            sendEmail({ to: enrollment.user.email, subject, html }).catch(console.error);
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Mark as paid error:', error);
        return NextResponse.json(
            { error: 'Error al marcar como pagado' },
            { status: 500 }
        );
    }
}

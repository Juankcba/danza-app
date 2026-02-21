import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { sendEmail } from '@/lib/email';
import { paymentReminderEmail, classReminderEmail } from '@/lib/email-templates';

export async function POST(request: Request) {
    try {
        const session = await auth();
        if (!session?.user || (session.user as any).role !== 'ADMIN') {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
        }

        const { type } = await request.json();

        if (type === 'payment') {
            // Send payment reminders to all users with pending enrollments
            const pendingEnrollments = await prisma.enrollment.findMany({
                where: { status: 'PENDING' },
                include: {
                    user: { select: { name: true, email: true } },
                    course: true,
                },
            });

            let sent = 0;
            for (const enrollment of pendingEnrollments) {
                if (enrollment.user.email) {
                    const { subject, html } = paymentReminderEmail(
                        enrollment.user.name || 'Alumno/a',
                        enrollment.course.name,
                        enrollment.course.price
                    );
                    await sendEmail({ to: enrollment.user.email, subject, html });
                    sent++;
                }
            }

            return NextResponse.json({
                message: `Recordatorios de pago enviados: ${sent}`,
                sent,
            });
        }

        if (type === 'class') {
            // Send class reminders to all active enrolled users
            const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
            const today = dayNames[new Date().getDay()];

            const activeEnrollments = await prisma.enrollment.findMany({
                where: { status: 'ACTIVE' },
                include: {
                    user: { select: { name: true, email: true } },
                    course: true,
                },
            });

            let sent = 0;
            for (const enrollment of activeEnrollments) {
                // Only send if the course schedule includes today
                if (
                    enrollment.user.email &&
                    enrollment.course.schedule.toLowerCase().includes(today.toLowerCase())
                ) {
                    const { subject, html } = classReminderEmail(
                        enrollment.user.name || 'Alumno/a',
                        enrollment.course.name,
                        enrollment.course.schedule,
                        today
                    );
                    await sendEmail({ to: enrollment.user.email, subject, html });
                    sent++;
                }
            }

            return NextResponse.json({
                message: `Recordatorios de clase enviados: ${sent}`,
                sent,
            });
        }

        return NextResponse.json(
            { error: 'Tipo de recordatorio inválido. Usa "payment" o "class".' },
            { status: 400 }
        );
    } catch (error) {
        console.error('Send reminders error:', error);
        return NextResponse.json(
            { error: 'Error al enviar recordatorios' },
            { status: 500 }
        );
    }
}

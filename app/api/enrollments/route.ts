import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { sendEmail } from '@/lib/email';
import { enrollmentConfirmationEmail } from '@/lib/email-templates';

export async function GET() {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
        }

        const userId = (session.user as any).id;
        const isAdmin = (session.user as any).role === 'ADMIN';

        const enrollments = await prisma.enrollment.findMany({
            where: isAdmin ? {} : { userId },
            include: {
                course: { include: { instructor: true } },
                user: { select: { id: true, name: true, email: true } },
                payment: true,
            },
            orderBy: { createdAt: 'desc' },
        });

        return NextResponse.json(enrollments);
    } catch (error) {
        console.error('Get enrollments error:', error);
        return NextResponse.json(
            { error: 'Error al obtener inscripciones' },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
        }

        const { courseId } = await request.json();
        const userId = (session.user as any).id;

        // Check if already enrolled
        const existing = await prisma.enrollment.findFirst({
            where: {
                userId,
                courseId,
                status: { in: ['PENDING', 'ACTIVE'] },
            },
        });

        if (existing) {
            return NextResponse.json(
                { error: 'Ya estás inscripto en este curso' },
                { status: 409 }
            );
        }

        // Check capacity
        const course = await prisma.course.findUnique({
            where: { id: courseId },
            include: {
                instructor: true,
                _count: { select: { enrollments: { where: { status: 'ACTIVE' } } } },
            },
        });

        if (!course) {
            return NextResponse.json(
                { error: 'Curso no encontrado' },
                { status: 404 }
            );
        }

        if (course._count.enrollments >= course.capacity) {
            return NextResponse.json(
                { error: 'El curso está lleno' },
                { status: 409 }
            );
        }

        const enrollment = await prisma.enrollment.create({
            data: {
                userId,
                courseId,
            },
            include: {
                course: { include: { instructor: true } },
            },
        });

        // Send enrollment confirmation email (non-blocking)
        const userEmail = session.user.email;
        const userName = session.user.name || 'Alumno/a';
        if (userEmail) {
            const { subject, html } = enrollmentConfirmationEmail(
                userName,
                course.name,
                course.schedule,
                course.instructor?.name || 'Por confirmar'
            );
            sendEmail({ to: userEmail, subject, html }).catch(console.error);
        }

        return NextResponse.json(enrollment, { status: 201 });
    } catch (error) {
        console.error('Create enrollment error:', error);
        return NextResponse.json(
            { error: 'Error al crear inscripción' },
            { status: 500 }
        );
    }
}

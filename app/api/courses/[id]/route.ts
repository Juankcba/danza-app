import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function GET(
    _request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const course = await prisma.course.findUnique({
            where: { id },
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

        return NextResponse.json(course);
    } catch (error) {
        console.error('Get course error:', error);
        return NextResponse.json(
            { error: 'Error al obtener curso' },
            { status: 500 }
        );
    }
}

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();
        if (!session?.user || (session.user as any).role !== 'ADMIN') {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
        }

        const { id } = await params;
        const data = await request.json();

        const course = await prisma.course.update({
            where: { id },
            data,
            include: { instructor: true },
        });

        return NextResponse.json(course);
    } catch (error) {
        console.error('Update course error:', error);
        return NextResponse.json(
            { error: 'Error al actualizar curso' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    _request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();
        if (!session?.user || (session.user as any).role !== 'ADMIN') {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
        }

        const { id } = await params;
        await prisma.course.update({
            where: { id },
            data: { active: false },
        });

        return NextResponse.json({ message: 'Curso desactivado' });
    } catch (error) {
        console.error('Delete course error:', error);
        return NextResponse.json(
            { error: 'Error al eliminar curso' },
            { status: 500 }
        );
    }
}

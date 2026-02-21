import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const instructors = await prisma.instructor.findMany({
            orderBy: { name: 'asc' },
            include: { _count: { select: { courses: true } } },
        });
        return NextResponse.json(instructors);
    } catch (error) {
        console.error('Fetch instructors error:', error);
        return NextResponse.json(
            { error: 'Error al obtener instructores' },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const { name, specialty, bio, image } = await request.json();

        if (!name || !specialty || !bio) {
            return NextResponse.json(
                { error: 'Nombre, especialidad y biografía son obligatorios' },
                { status: 400 }
            );
        }

        const instructor = await prisma.instructor.create({
            data: { name, specialty, bio, image: image || null },
        });

        return NextResponse.json(instructor, { status: 201 });
    } catch (error) {
        console.error('Create instructor error:', error);
        return NextResponse.json(
            { error: 'Error al crear instructor' },
            { status: 500 }
        );
    }
}

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const showAll = searchParams.get('all') === 'true';

        const courses = await prisma.course.findMany({
            where: showAll ? {} : { active: true },
            include: {
                instructor: true,
                _count: { select: { enrollments: { where: { status: 'ACTIVE' } } } },
            },
            orderBy: { createdAt: 'desc' },
        });

        return NextResponse.json(courses);
    } catch (error) {
        console.error('Get courses error:', error);
        return NextResponse.json(
            { error: 'Error al obtener cursos' },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const session = await auth();
        if (!session?.user || (session.user as any).role !== 'ADMIN') {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
        }

        const data = await request.json();

        const course = await prisma.course.create({
            data: {
                name: data.name,
                description: data.description,
                level: data.level,
                duration: data.duration,
                schedule: data.schedule,
                price: data.price,
                capacity: data.capacity,
                image: data.image || null,
                instructorId: data.instructorId,
                active: data.active !== undefined ? data.active : true,
            },
            include: { instructor: true },
        });

        return NextResponse.json(course, { status: 201 });
    } catch (error) {
        console.error('Create course error:', error);
        return NextResponse.json(
            { error: 'Error al crear curso' },
            { status: 500 }
        );
    }
}

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { mpPreference } from '@/lib/mercadopago';

export async function POST(request: Request) {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
        }

        const { enrollmentId } = await request.json();
        const userId = (session.user as any).id;

        const enrollment = await prisma.enrollment.findUnique({
            where: { id: enrollmentId },
            include: { course: true },
        });

        if (!enrollment || enrollment.userId !== userId) {
            return NextResponse.json(
                { error: 'Inscripción no encontrada' },
                { status: 404 }
            );
        }

        const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';

        const preference = await mpPreference.create({
            body: {
                items: [
                    {
                        id: enrollment.courseId,
                        title: `Clase: ${enrollment.course.name}`,
                        quantity: 1,
                        unit_price: enrollment.course.price,
                        currency_id: 'ARS',
                    },
                ],
                payer: {
                    email: session.user.email || '',
                },
                back_urls: {
                    success: `${baseUrl}/dashboard?payment=success`,
                    failure: `${baseUrl}/dashboard?payment=failure`,
                    pending: `${baseUrl}/dashboard?payment=pending`,
                },
                auto_return: 'approved',
                external_reference: enrollmentId,
                notification_url: `${baseUrl}/api/webhooks/mercadopago`,
            },
        });

        // Save preference in payment record
        await prisma.payment.create({
            data: {
                userId,
                enrollmentId,
                type: 'CLASS',
                amount: enrollment.course.price,
                mpPreferenceId: preference.id,
            },
        });

        return NextResponse.json({
            preferenceId: preference.id,
            initPoint: preference.init_point,
        });
    } catch (error) {
        console.error('Create preference error:', error);
        return NextResponse.json(
            { error: 'Error al crear preferencia de pago' },
            { status: 500 }
        );
    }
}

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendEmail } from '@/lib/email';
import { contactConfirmationEmail } from '@/lib/email-templates';

export async function POST(request: Request) {
    try {
        const { name, email, message } = await request.json();

        if (!name || !email || !message) {
            return NextResponse.json(
                { error: 'Todos los campos son obligatorios' },
                { status: 400 }
            );
        }

        // Save to database
        const inquiry = await prisma.contactInquiry.create({
            data: { name, email, message },
        });

        // Send confirmation email (non-blocking)
        const { subject, html } = contactConfirmationEmail(name);
        sendEmail({ to: email, subject, html }).catch(console.error);

        return NextResponse.json(inquiry, { status: 201 });
    } catch (error) {
        console.error('Contact form error:', error);
        return NextResponse.json(
            { error: 'Error al procesar la consulta' },
            { status: 500 }
        );
    }
}

// GET: Admin fetches all inquiries
export async function GET() {
    try {
        const inquiries = await prisma.contactInquiry.findMany({
            orderBy: { createdAt: 'desc' },
        });
        return NextResponse.json(inquiries);
    } catch (error) {
        console.error('Fetch inquiries error:', error);
        return NextResponse.json(
            { error: 'Error al obtener consultas' },
            { status: 500 }
        );
    }
}

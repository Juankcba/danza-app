import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { prisma } from '@/lib/prisma';
import { sendEmail } from '@/lib/email';
import { passwordRecoveryEmail } from '@/lib/email-templates';

export async function POST(request: Request) {
    try {
        const { email } = await request.json();

        if (!email) {
            return NextResponse.json(
                { error: 'El email es obligatorio' },
                { status: 400 }
            );
        }

        const user = await prisma.user.findUnique({ where: { email } });

        // Always return success to prevent email enumeration
        if (!user) {
            return NextResponse.json({
                message: 'Si el email existe, recibirás instrucciones para restablecer tu contraseña.',
            });
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour

        // Store token in the database
        await prisma.user.update({
            where: { id: user.id },
            data: {
                resetToken,
                resetTokenExpiry,
            },
        });

        // Send password recovery email
        const { subject, html } = passwordRecoveryEmail(
            user.name || 'Usuario',
            resetToken
        );
        await sendEmail({ to: email, subject, html });

        return NextResponse.json({
            message: 'Si el email existe, recibirás instrucciones para restablecer tu contraseña.',
        });
    } catch (error) {
        console.error('Password recovery error:', error);
        return NextResponse.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
        );
    }
}

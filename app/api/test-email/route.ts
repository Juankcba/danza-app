import { NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email';

export async function POST() {
  try {
    const result = await sendEmail({
      to: 'juangblade@gmail.com',
      subject: '✅ Test - Alma & Expresión - Email funcionando',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #7c3aed; text-align: center;">Alma & Expresión</h1>
          <div style="background: linear-gradient(135deg, #7c3aed, #ec4899); padding: 2px; border-radius: 12px;">
            <div style="background: #1a1a2e; border-radius: 10px; padding: 30px; text-align: center;">
              <h2 style="color: #ffffff; margin-bottom: 10px;">📧 Email de Prueba</h2>
              <p style="color: #d1d5db; font-size: 16px;">
                ¡El módulo de emails está funcionando correctamente!
              </p>
              <p style="color: #9ca3af; font-size: 14px; margin-top: 20px;">
                Enviado el: ${new Date().toLocaleString('es-AR', { timeZone: 'America/Argentina/Buenos_Aires' })}
              </p>
            </div>
          </div>
          <p style="color: #6b7280; font-size: 12px; text-align: center; margin-top: 20px;">
            Este es un correo de prueba. Podés ignorarlo.
          </p>
        </div>
      `,
    });

    if (result.success) {
      return NextResponse.json({ message: 'Email enviado correctamente', messageId: result.messageId });
    } else {
      return NextResponse.json({ error: 'Error al enviar email', details: result.error }, { status: 500 });
    }
  } catch (error) {
    console.error('Test email error:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

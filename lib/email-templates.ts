// ─────────────────────────────────────────────────────
// HTML email templates for Alma & Expresión
// ─────────────────────────────────────────────────────

const baseLayout = (content: string) => `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="margin:0; padding:0; background-color:#0a0a0a; font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0a0a0a; padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color:#1a1a1a; border-radius:16px; overflow:hidden; border:1px solid #2a2a2a;">
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#ec4899,#d97706); padding:32px; text-align:center;">
              <h1 style="margin:0; color:#fff; font-size:28px; font-weight:700; letter-spacing:-0.5px;">
                Alma & Expresión
              </h1>
              <p style="margin:4px 0 0; color:rgba(255,255,255,0.85); font-size:13px; letter-spacing:1px;">
                ESCUELA DE DANZAS
              </p>
            </td>
          </tr>
          <!-- Content -->
          <tr>
            <td style="padding:40px 32px;">
              ${content}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:24px 32px; border-top:1px solid #2a2a2a; text-align:center;">
              <p style="margin:0 0 8px; color:#666; font-size:12px;">
                Alma & Expresión · Arguello, Córdoba, Argentina
              </p>
              <a href="https://www.instagram.com/almaexpresion" style="color:#ec4899; font-size:12px; text-decoration:none;">
                @almaexpresion
              </a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

const button = (text: string, href: string) => `
  <table width="100%" cellpadding="0" cellspacing="0" style="margin:28px 0;">
    <tr>
      <td align="center">
        <a href="${href}" style="display:inline-block; background:linear-gradient(135deg,#ec4899,#db2777); color:#fff; padding:14px 36px; border-radius:50px; text-decoration:none; font-weight:600; font-size:15px;">
          ${text}
        </a>
      </td>
    </tr>
  </table>
`;

// ─────────────────────────────────────────────────────
// 1. Bienvenida - Creación de cuenta
// ─────────────────────────────────────────────────────
export function welcomeEmail(userName: string) {
  return {
    subject: '¡Bienvenido/a a Alma & Expresión! 💃',
    html: baseLayout(`
      <h2 style="margin:0 0 16px; color:#fff; font-size:22px;">¡Hola ${userName}! 🎉</h2>
      <p style="color:#ccc; font-size:15px; line-height:1.7; margin:0 0 16px;">
        Tu cuenta en <strong style="color:#ec4899;">Alma & Expresión</strong> fue creada exitosamente.
        Ahora podés inscribirte en nuestros cursos de salsa, bachata, merengue y más.
      </p>
      <p style="color:#ccc; font-size:15px; line-height:1.7; margin:0 0 8px;">
        ¿Qué podés hacer ahora?
      </p>
      <ul style="color:#ccc; font-size:14px; line-height:2; padding-left:20px; margin:0 0 8px;">
        <li>Explorar nuestros cursos disponibles</li>
        <li>Inscribirte en la clase que más te guste</li>
        <li>Realizar tu pago de forma segura con MercadoPago</li>
      </ul>
      ${button('Ver Cursos Disponibles', `${process.env.NEXTAUTH_URL}/#cursos`)}
      <p style="color:#888; font-size:13px; margin:0;">
        Si no creaste esta cuenta, podés ignorar este email.
      </p>
    `),
  };
}

// ─────────────────────────────────────────────────────
// 2. Recuperación de contraseña
// ─────────────────────────────────────────────────────
export function passwordRecoveryEmail(userName: string, resetToken: string) {
  const resetUrl = `${process.env.NEXTAUTH_URL}/restablecer-password?token=${resetToken}`;
  return {
    subject: 'Restablecer contraseña - Alma & Expresión',
    html: baseLayout(`
      <h2 style="margin:0 0 16px; color:#fff; font-size:22px;">Hola ${userName}</h2>
      <p style="color:#ccc; font-size:15px; line-height:1.7; margin:0 0 16px;">
        Recibimos una solicitud para restablecer tu contraseña. Hacé click en el botón de abajo para crear una nueva:
      </p>
      ${button('Restablecer Contraseña', resetUrl)}
      <p style="color:#888; font-size:13px; line-height:1.6; margin:0 0 8px;">
        Este enlace expira en <strong>1 hora</strong>.
      </p>
      <p style="color:#888; font-size:13px; margin:0;">
        Si no solicitaste restablecer tu contraseña, ignorá este email. Tu cuenta sigue segura.
      </p>
    `),
  };
}

// ─────────────────────────────────────────────────────
// 3. Confirmación de inscripción
// ─────────────────────────────────────────────────────
export function enrollmentConfirmationEmail(
  userName: string,
  courseName: string,
  schedule: string,
  instructorName: string
) {
  return {
    subject: `¡Inscripción confirmada! ${courseName} 🎶`,
    html: baseLayout(`
      <h2 style="margin:0 0 16px; color:#fff; font-size:22px;">¡Felicitaciones ${userName}! 🎉</h2>
      <p style="color:#ccc; font-size:15px; line-height:1.7; margin:0 0 20px;">
        Tu inscripción fue registrada exitosamente. Acá van los detalles:
      </p>
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#222; border-radius:12px; padding:20px; margin:0 0 20px;">
        <tr>
          <td style="padding:12px 20px; border-bottom:1px solid #333;">
            <span style="color:#888; font-size:13px;">Curso</span><br />
            <span style="color:#fff; font-size:16px; font-weight:600;">${courseName}</span>
          </td>
        </tr>
        <tr>
          <td style="padding:12px 20px; border-bottom:1px solid #333;">
            <span style="color:#888; font-size:13px;">Horario</span><br />
            <span style="color:#fff; font-size:15px;">${schedule}</span>
          </td>
        </tr>
        <tr>
          <td style="padding:12px 20px;">
            <span style="color:#888; font-size:13px;">Profesora</span><br />
            <span style="color:#fff; font-size:15px;">${instructorName}</span>
          </td>
        </tr>
      </table>
      ${button('Ver Mi Panel', `${process.env.NEXTAUTH_URL}/dashboard`)}
      <p style="color:#888; font-size:13px; margin:0;">
        Recordá realizar el pago para confirmar tu lugar.
      </p>
    `),
  };
}

// ─────────────────────────────────────────────────────
// 4. Pago confirmado
// ─────────────────────────────────────────────────────
export function paymentConfirmationEmail(
  userName: string,
  courseName: string,
  amount: number
) {
  return {
    subject: `Pago confirmado - $${amount.toLocaleString('es-AR')} ✅`,
    html: baseLayout(`
      <h2 style="margin:0 0 16px; color:#fff; font-size:22px;">¡Pago recibido! ✅</h2>
      <p style="color:#ccc; font-size:15px; line-height:1.7; margin:0 0 20px;">
        Hola ${userName}, tu pago fue procesado correctamente.
      </p>
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#222; border-radius:12px; padding:20px; margin:0 0 20px;">
        <tr>
          <td style="padding:12px 20px; border-bottom:1px solid #333;">
            <span style="color:#888; font-size:13px;">Curso</span><br />
            <span style="color:#fff; font-size:16px; font-weight:600;">${courseName}</span>
          </td>
        </tr>
        <tr>
          <td style="padding:12px 20px;">
            <span style="color:#888; font-size:13px;">Monto</span><br />
            <span style="color:#22c55e; font-size:20px; font-weight:700;">$${amount.toLocaleString('es-AR')}</span>
          </td>
        </tr>
      </table>
      <p style="color:#ccc; font-size:15px; line-height:1.7; margin:0 0 8px;">
        Tu lugar en la clase está <strong style="color:#22c55e;">confirmado</strong>. ¡Nos vemos en clase! 💃
      </p>
      ${button('Ir a Mi Panel', `${process.env.NEXTAUTH_URL}/dashboard`)}
    `),
  };
}

// ─────────────────────────────────────────────────────
// 5. Recordatorio de pago
// ─────────────────────────────────────────────────────
export function paymentReminderEmail(
  userName: string,
  courseName: string,
  amount: number
) {
  return {
    subject: `Recordatorio de pago - ${courseName} 💳`,
    html: baseLayout(`
      <h2 style="margin:0 0 16px; color:#fff; font-size:22px;">Hola ${userName} 👋</h2>
      <p style="color:#ccc; font-size:15px; line-height:1.7; margin:0 0 16px;">
        Te recordamos que tenés un pago pendiente para continuar con tu clase:
      </p>
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#222; border-radius:12px; padding:20px; margin:0 0 20px;">
        <tr>
          <td style="padding:12px 20px; border-bottom:1px solid #333;">
            <span style="color:#888; font-size:13px;">Curso</span><br />
            <span style="color:#fff; font-size:16px; font-weight:600;">${courseName}</span>
          </td>
        </tr>
        <tr>
          <td style="padding:12px 20px;">
            <span style="color:#888; font-size:13px;">Monto pendiente</span><br />
            <span style="color:#f59e0b; font-size:20px; font-weight:700;">$${amount.toLocaleString('es-AR')}</span>
          </td>
        </tr>
      </table>
      ${button('Pagar Ahora', `${process.env.NEXTAUTH_URL}/dashboard`)}
      <p style="color:#888; font-size:13px; margin:0;">
        Si ya realizaste el pago, podés ignorar este mensaje.
      </p>
    `),
  };
}

// ─────────────────────────────────────────────────────
// 6. Recordatorio de cursado
// ─────────────────────────────────────────────────────
export function classReminderEmail(
  userName: string,
  courseName: string,
  schedule: string,
  dayOfWeek: string
) {
  return {
    subject: `¡Hoy tenés clase! ${courseName} 💃`,
    html: baseLayout(`
      <h2 style="margin:0 0 16px; color:#fff; font-size:22px;">¡Hola ${userName}! 🎵</h2>
      <p style="color:#ccc; font-size:15px; line-height:1.7; margin:0 0 20px;">
        Te recordamos que hoy <strong style="color:#ec4899;">${dayOfWeek}</strong> tenés clase:
      </p>
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#222; border-radius:12px; padding:20px; margin:0 0 20px;">
        <tr>
          <td style="padding:12px 20px; border-bottom:1px solid #333;">
            <span style="color:#888; font-size:13px;">Curso</span><br />
            <span style="color:#fff; font-size:16px; font-weight:600;">${courseName}</span>
          </td>
        </tr>
        <tr>
          <td style="padding:12px 20px;">
            <span style="color:#888; font-size:13px;">Horario</span><br />
            <span style="color:#ec4899; font-size:18px; font-weight:600;">${schedule}</span>
          </td>
        </tr>
      </table>
      <p style="color:#ccc; font-size:15px; line-height:1.7; margin:0;">
        ¡Preparate para disfrutar del ritmo! 🔥
      </p>
    `),
  };
}

// ─────────────────────────────────────────────────────
// 7. Confirmación de consulta de contacto
// ─────────────────────────────────────────────────────
export function contactConfirmationEmail(userName: string) {
  return {
    subject: 'Recibimos tu consulta - Alma & Expresión ✉️',
    html: baseLayout(`
      <h2 style="margin:0 0 16px; color:#fff; font-size:22px;">¡Hola ${userName}! 👋</h2>
      <p style="color:#ccc; font-size:15px; line-height:1.7; margin:0 0 16px;">
        Recibimos tu consulta y te responderemos a la brevedad.
        Nuestro equipo se pondrá en contacto con vos pronto.
      </p>
      <p style="color:#ccc; font-size:15px; line-height:1.7; margin:0 0 16px;">
        Si tu consulta es urgente, también podés contactarnos por Instagram:
      </p>
      ${button('Ver nuestro Instagram', 'https://www.instagram.com/almaexpresion')}
      <p style="color:#888; font-size:13px; margin:0;">
        Gracias por comunicarte con Alma & Expresión 💃
      </p>
    `),
  };
}

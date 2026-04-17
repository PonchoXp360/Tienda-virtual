'use server';

type OrderConfirmationData = {
  to: string;
  customerName: string;
  orderId: string;
  total: number;
  items?: Array<{ name: string; quantity: number; price: number }>;
};

type EmailResult = { success: true } | { success: false; error: string };

export async function sendOrderConfirmation(data: OrderConfirmationData): Promise<EmailResult> {
  if (!process.env.RESEND_API_KEY) {
    console.warn('[Email] RESEND_API_KEY no configurada — email no enviado');
    return { success: false, error: 'Email no configurado' };
  }

  const { Resend } = await import('resend');
  const resend = new Resend(process.env.RESEND_API_KEY);

  const itemsHtml = data.items?.length
    ? `<ul>${data.items.map(i => `<li>${i.quantity}x ${i.name} — $${i.price.toFixed(2)}</li>`).join('')}</ul>`
    : '';

  try {
    await resend.emails.send({
      from: 'ChAcHaRiTaS <noreply@rpyasociados.tech>',
      to: data.to,
      subject: `✅ Pedido confirmado #${data.orderId.slice(-8).toUpperCase()}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px">
          <h1 style="color:#1a1a1a">¡Gracias por tu compra, ${data.customerName}!</h1>
          <p>Tu pedido ha sido confirmado y está siendo procesado.</p>
          <div style="background:#f5f5f5;padding:16px;border-radius:8px;margin:16px 0">
            <p><strong>Número de pedido:</strong> #${data.orderId.slice(-8).toUpperCase()}</p>
            <p><strong>Total:</strong> $${data.total.toFixed(2)} MXN</p>
            ${itemsHtml}
          </div>
          <p>Puedes ver el estado de tu pedido en tu <a href="https://ejemplotienda.rpyasociados.tech/dashboard">dashboard</a>.</p>
          <hr style="border:none;border-top:1px solid #e5e5e5;margin:24px 0"/>
          <p style="color:#666;font-size:14px">ChAcHaRiTaS · RP & Asociados · ejemplotienda.rpyasociados.tech</p>
        </div>
      `,
    });
    return { success: true };
  } catch (err) {
    console.error('[Email] Error enviando confirmación:', err);
    return { success: false, error: String(err) };
  }
}

export async function sendPasswordReset(to: string, resetUrl: string): Promise<EmailResult> {
  if (!process.env.RESEND_API_KEY) {
    console.warn('[Email] RESEND_API_KEY no configurada — email no enviado');
    return { success: false, error: 'Email no configurado' };
  }

  const { Resend } = await import('resend');
  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    await resend.emails.send({
      from: 'ChAcHaRiTaS <noreply@rpyasociados.tech>',
      to,
      subject: 'Restablecer contraseña',
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px">
          <h1>Restablecer tu contraseña</h1>
          <p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
          <a href="${resetUrl}" style="display:inline-block;background:#1a1a1a;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none">
            Restablecer contraseña
          </a>
          <p style="color:#666;font-size:14px;margin-top:24px">Este enlace expira en 1 hora.</p>
        </div>
      `,
    });
    return { success: true };
  } catch (err) {
    console.error('[Email] Error enviando reset:', err);
    return { success: false, error: String(err) };
  }
}

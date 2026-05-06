import { Resend } from 'resend';
import dotenv from 'dotenv';

dotenv.config();

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'Aroma Tales <onboarding@resend.dev>';
export const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'info.aromatales@gmail.com';

let resend = null;

if (RESEND_API_KEY) {
  resend = new Resend(RESEND_API_KEY);
  console.log('Resend email client initialised');
} else {
  console.warn('RESEND_API_KEY not found - email notifications will be skipped');
}

const buildOrderItemsRows = (order, includePrice = true) =>
  order.items
    .map((item) => {
      const product = item.product || {};
      const name = product.name || 'Product';
      const lineTotal = (item.price * item.quantity).toLocaleString();
      if (includePrice) {
        return `
          <tr>
            <td style="padding:12px;border-bottom:1px solid #2a2a2a;color:#f5f5f5;">${name}</td>
            <td style="padding:12px;border-bottom:1px solid #2a2a2a;color:#f5f5f5;text-align:center;">${item.quantity}</td>
            <td style="padding:12px;border-bottom:1px solid #2a2a2a;color:#f5f5f5;text-align:right;">PKR ${item.price.toLocaleString()}</td>
            <td style="padding:12px;border-bottom:1px solid #2a2a2a;color:#ffd700;text-align:right;">PKR ${lineTotal}</td>
          </tr>`;
      }
      return `
        <tr>
          <td style="padding:12px;border-bottom:1px solid #2a2a2a;color:#f5f5f5;">${name}</td>
          <td style="padding:12px;border-bottom:1px solid #2a2a2a;color:#f5f5f5;text-align:center;">${item.quantity}</td>
          <td style="padding:12px;border-bottom:1px solid #2a2a2a;color:#ffd700;text-align:right;">PKR ${lineTotal}</td>
        </tr>`;
    })
    .join('');

const wrapTemplate = (innerHtml) => `
  <div style="font-family:'Inter',Arial,sans-serif;max-width:640px;margin:0 auto;background:#0a0a0a;color:#f5f5f5;padding:32px;border-radius:16px;border:1px solid #1f1f1f;">
    <div style="text-align:center;margin-bottom:24px;">
      <h1 style="margin:0;color:#ffd700;font-family:'Playfair Display',serif;letter-spacing:0.04em;">AROMA TALES</h1>
      <p style="margin:4px 0 0 0;color:#a0a0a0;font-size:12px;letter-spacing:0.3em;text-transform:uppercase;">Once Upon A Scent</p>
    </div>
    ${innerHtml}
    <div style="margin-top:32px;padding-top:16px;border-top:1px solid #1f1f1f;text-align:center;color:#777;font-size:12px;">
      &copy; ${new Date().getFullYear()} Aroma Tales &middot; <a href="mailto:${ADMIN_EMAIL}" style="color:#ffd700;text-decoration:none;">${ADMIN_EMAIL}</a>
    </div>
  </div>
`;

export const sendOrderEmail = async (order) => {
  if (!resend) {
    console.log('Resend not configured - skipping admin order email');
    return null;
  }

  try {
    const itemsHtml = buildOrderItemsRows(order, true);
    const html = wrapTemplate(`
      <h2 style="color:#ffd700;margin-top:0;">New Order Received</h2>
      <p style="color:#cfcfcf;"><strong style="color:#ffd700;">Order #:</strong> ${order.orderNumber}</p>
      <p style="color:#cfcfcf;"><strong style="color:#ffd700;">Placed on:</strong> ${new Date(order.createdAt).toLocaleString()}</p>

      <h3 style="color:#ffd700;margin-top:24px;">Customer</h3>
      <p style="color:#cfcfcf;line-height:1.6;">
        <strong>${order.customer.name}</strong><br>
        ${order.customer.email}<br>
        ${order.customer.phone}<br>
        ${order.customer.address.street}<br>
        ${order.customer.address.city}${order.customer.address.postalCode ? ', ' + order.customer.address.postalCode : ''}<br>
        ${order.customer.address.country}
      </p>

      <h3 style="color:#ffd700;margin-top:24px;">Items</h3>
      <table style="width:100%;border-collapse:collapse;">
        <thead>
          <tr style="background:#141414;">
            <th style="padding:12px;text-align:left;color:#ffd700;border-bottom:2px solid #ffd700;">Product</th>
            <th style="padding:12px;text-align:center;color:#ffd700;border-bottom:2px solid #ffd700;">Qty</th>
            <th style="padding:12px;text-align:right;color:#ffd700;border-bottom:2px solid #ffd700;">Unit</th>
            <th style="padding:12px;text-align:right;color:#ffd700;border-bottom:2px solid #ffd700;">Total</th>
          </tr>
        </thead>
        <tbody>${itemsHtml}</tbody>
      </table>

      <div style="margin-top:24px;padding:20px;background:#141414;border-radius:12px;">
        <p style="margin:4px 0;color:#cfcfcf;"><strong>Payment:</strong> ${order.paymentMethod}</p>
        <p style="margin:4px 0;color:#cfcfcf;"><strong>Subtotal:</strong> PKR ${order.subtotal.toLocaleString()}</p>
        <p style="margin:4px 0;color:#cfcfcf;"><strong>Shipping:</strong> Free</p>
        <p style="margin:8px 0 0 0;font-size:18px;color:#ffd700;"><strong>Total:</strong> PKR ${order.total.toLocaleString()}</p>
      </div>

      ${order.notes ? `<p style="margin-top:16px;color:#cfcfcf;"><strong style="color:#ffd700;">Notes:</strong> ${order.notes}</p>` : ''}
    `);

    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: ADMIN_EMAIL,
      subject: `New Order: ${order.orderNumber}`,
      html,
      reply_to: order.customer.email
    });
    console.log('Admin order email sent:', result?.data?.id);
    return result;
  } catch (error) {
    console.error('Error sending admin order email:', error);
    return null;
  }
};

export const sendOrderConfirmationEmail = async (order) => {
  if (!resend) {
    console.log('Resend not configured - skipping customer order email');
    return null;
  }

  try {
    const itemsHtml = buildOrderItemsRows(order, false);
    const html = wrapTemplate(`
      <h2 style="color:#ffd700;margin-top:0;">Thank you for your order!</h2>
      <p style="color:#cfcfcf;">Dear ${order.customer.name},</p>
      <p style="color:#cfcfcf;">We've received your order and our team will contact you shortly to confirm delivery details.</p>

      <div style="margin:24px 0;padding:20px;background:#141414;border-radius:12px;">
        <p style="margin:4px 0;color:#cfcfcf;"><strong style="color:#ffd700;">Order #:</strong> ${order.orderNumber}</p>
        <p style="margin:4px 0;color:#cfcfcf;"><strong style="color:#ffd700;">Placed on:</strong> ${new Date(order.createdAt).toLocaleString()}</p>
        <p style="margin:4px 0;color:#cfcfcf;"><strong style="color:#ffd700;">Payment:</strong> ${order.paymentMethod}</p>
      </div>

      <h3 style="color:#ffd700;">Order Summary</h3>
      <table style="width:100%;border-collapse:collapse;">
        <thead>
          <tr style="background:#141414;">
            <th style="padding:12px;text-align:left;color:#ffd700;border-bottom:2px solid #ffd700;">Product</th>
            <th style="padding:12px;text-align:center;color:#ffd700;border-bottom:2px solid #ffd700;">Qty</th>
            <th style="padding:12px;text-align:right;color:#ffd700;border-bottom:2px solid #ffd700;">Total</th>
          </tr>
        </thead>
        <tbody>${itemsHtml}</tbody>
      </table>

      <div style="margin-top:24px;padding:20px;background:#141414;border-radius:12px;">
        <p style="margin:4px 0;color:#cfcfcf;"><strong>Subtotal:</strong> PKR ${order.subtotal.toLocaleString()}</p>
        <p style="margin:4px 0;color:#cfcfcf;"><strong>Shipping:</strong> Free</p>
        <p style="margin:8px 0 0 0;font-size:18px;color:#ffd700;"><strong>Total:</strong> PKR ${order.total.toLocaleString()}</p>
      </div>

      <p style="margin-top:24px;color:#cfcfcf;">Questions? Reply to this email or reach us on WhatsApp at <strong style="color:#ffd700;">+92 333 1290243</strong>.</p>
      <p style="color:#cfcfcf;">— The Aroma Tales Team</p>
    `);

    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: order.customer.email,
      subject: `Order Confirmation - ${order.orderNumber}`,
      html
    });
    console.log('Customer confirmation email sent:', result?.data?.id);
    return result;
  } catch (error) {
    console.error('Error sending customer confirmation email:', error);
    return null;
  }
};

export const sendContactEmail = async (contactData) => {
  if (!resend) {
    throw new Error('Email service is not configured');
  }

  try {
    const html = wrapTemplate(`
      <h2 style="color:#ffd700;margin-top:0;">New Contact Form Submission</h2>

      <div style="margin:24px 0;padding:20px;background:#141414;border-radius:12px;">
        <p style="margin:8px 0;color:#cfcfcf;"><strong style="color:#ffd700;">Name:</strong> ${contactData.name}</p>
        <p style="margin:8px 0;color:#cfcfcf;"><strong style="color:#ffd700;">Email:</strong> <a href="mailto:${contactData.email}" style="color:#ffd700;">${contactData.email}</a></p>
        ${contactData.phone ? `<p style="margin:8px 0;color:#cfcfcf;"><strong style="color:#ffd700;">Phone:</strong> ${contactData.phone}</p>` : ''}
      </div>

      <h3 style="color:#ffd700;">Message</h3>
      <div style="margin:16px 0;padding:20px;background:#141414;border-radius:12px;color:#cfcfcf;line-height:1.7;white-space:pre-wrap;">${contactData.message}</div>

      <p style="margin-top:24px;color:#777;font-size:12px;">Reply directly to this email to respond to ${contactData.name}.</p>
    `);

    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: ADMIN_EMAIL,
      subject: `Contact Form: ${contactData.subject || 'Inquiry'}`,
      html,
      reply_to: contactData.email
    });
    console.log('Contact email sent:', result?.data?.id);
    return result;
  } catch (error) {
    console.error('Error sending contact email:', error);
    throw error;
  }
};

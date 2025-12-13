import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create transporter (using Gmail)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'info.aromatales@gmail.com',
    pass: process.env.EMAIL_PASSWORD || process.env.GMAIL_APP_PASSWORD
  }
});

// Send order notification email
export const sendOrderEmail = async (order) => {
  try {
    const orderItemsHtml = order.items.map(item => {
      const product = item.product;
      return `
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #ddd;">${product?.name || 'Product'}</td>
          <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: center;">${item.quantity}</td>
          <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: right;">$${item.price.toFixed(2)}</td>
          <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: right;">$${(item.price * item.quantity).toFixed(2)}</td>
        </tr>
      `;
    }).join('');

    const mailOptions = {
      from: process.env.EMAIL_USER || 'info.aromatales@gmail.com',
      to: 'info.aromatales@gmail.com',
      subject: `New Order: ${order.orderNumber}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #ffd700;">New Order Received!</h2>
          <p><strong>Order Number:</strong> ${order.orderNumber}</p>
          <p><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleString()}</p>
          
          <h3 style="color: #ffd700; margin-top: 30px;">Customer Information</h3>
          <p><strong>Name:</strong> ${order.customer.name}</p>
          <p><strong>Email:</strong> ${order.customer.email}</p>
          <p><strong>Phone:</strong> ${order.customer.phone}</p>
          <p><strong>Address:</strong><br>
            ${order.customer.address.street}<br>
            ${order.customer.address.city}${order.customer.address.postalCode ? ', ' + order.customer.address.postalCode : ''}<br>
            ${order.customer.address.country}
          </p>
          
          <h3 style="color: #ffd700; margin-top: 30px;">Order Details</h3>
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <thead>
              <tr style="background: #1a1a1a; color: #ffd700;">
                <th style="padding: 10px; text-align: left; border-bottom: 2px solid #ffd700;">Product</th>
                <th style="padding: 10px; text-align: center; border-bottom: 2px solid #ffd700;">Quantity</th>
                <th style="padding: 10px; text-align: right; border-bottom: 2px solid #ffd700;">Price</th>
                <th style="padding: 10px; text-align: right; border-bottom: 2px solid #ffd700;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${orderItemsHtml}
            </tbody>
          </table>
          
          <div style="margin-top: 20px; padding: 20px; background: #1a1a1a; border-radius: 8px;">
            <p style="margin: 5px 0;"><strong>Payment Method:</strong> ${order.paymentMethod}</p>
            <p style="margin: 5px 0;"><strong>Subtotal:</strong> $${order.subtotal.toFixed(2)}</p>
            <p style="margin: 5px 0;"><strong>Shipping:</strong> Free</p>
            <p style="margin: 10px 0; font-size: 1.2em; color: #ffd700;"><strong>Total:</strong> $${order.total.toFixed(2)}</p>
          </div>
          
          ${order.notes ? `<p style="margin-top: 20px;"><strong>Notes:</strong> ${order.notes}</p>` : ''}
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Order email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending order email:', error);
    // Don't throw error - order should still be saved even if email fails
    return null;
  }
};

// Send customer order confirmation email
export const sendOrderConfirmationEmail = async (order) => {
  try {
    const orderItemsHtml = order.items.map(item => {
      const product = item.product;
      return `
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #ddd;">${product?.name || 'Product'}</td>
          <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: center;">${item.quantity}</td>
          <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: right;">$${(item.price * item.quantity).toFixed(2)}</td>
        </tr>
      `;
    }).join('');

    const mailOptions = {
      from: process.env.EMAIL_USER || 'info.aromatales@gmail.com',
      to: order.customer.email,
      subject: `Order Confirmation - ${order.orderNumber}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #ffd700;">Thank You for Your Order!</h2>
          <p>Dear ${order.customer.name},</p>
          <p>We have received your order and will process it shortly.</p>
          
          <div style="margin: 30px 0; padding: 20px; background: #1a1a1a; border-radius: 8px;">
            <p><strong>Order Number:</strong> ${order.orderNumber}</p>
            <p><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleString()}</p>
            <p><strong>Payment Method:</strong> ${order.paymentMethod}</p>
          </div>
          
          <h3 style="color: #ffd700;">Order Summary</h3>
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <thead>
              <tr style="background: #1a1a1a; color: #ffd700;">
                <th style="padding: 10px; text-align: left; border-bottom: 2px solid #ffd700;">Product</th>
                <th style="padding: 10px; text-align: center; border-bottom: 2px solid #ffd700;">Quantity</th>
                <th style="padding: 10px; text-align: right; border-bottom: 2px solid #ffd700;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${orderItemsHtml}
            </tbody>
          </table>
          
          <div style="margin-top: 20px; padding: 20px; background: #1a1a1a; border-radius: 8px;">
            <p style="margin: 5px 0;"><strong>Subtotal:</strong> $${order.subtotal.toFixed(2)}</p>
            <p style="margin: 5px 0;"><strong>Shipping:</strong> Free</p>
            <p style="margin: 10px 0; font-size: 1.2em; color: #ffd700;"><strong>Total:</strong> $${order.total.toFixed(2)}</p>
          </div>
          
          <p style="margin-top: 30px;">We will contact you soon to confirm your order and delivery details.</p>
          <p>If you have any questions, please contact us at <a href="mailto:info.aromatales@gmail.com">info.aromatales@gmail.com</a> or WhatsApp: +92 333 1290243</p>
          
          <p style="margin-top: 30px;">Best regards,<br>Aroma Tales Team</p>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Confirmation email sent to customer:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending confirmation email:', error);
    return null;
  }
};

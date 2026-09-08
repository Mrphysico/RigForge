import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create reusable transporter
const createTransporter = () => {
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const user = process.env.SMTP_USER || '';
  const pass = process.env.SMTP_PASS || '';

  if (user && pass) {
    return nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: {
        user,
        pass,
      },
    });
  }

  // Fallback test transporter if credentials are not configured
  return null;
};

export interface WelcomeEmailParams {
  toEmail: string;
  userName: string;
}

export const sendWelcomeEmail = async ({
  toEmail,
  userName,
}: WelcomeEmailParams): Promise<{ success: boolean; preview?: string; error?: string }> => {
  const recipientEmail = toEmail?.trim();
  if (!recipientEmail) {
    return { success: false, error: 'Recipient email is required' };
  }
  const recipientName = userName?.trim() || 'RigForge Builder';
  const fromAddress = process.env.SMTP_FROM || `"RigForge India" <${process.env.SMTP_USER || 'support@rigforge.in'}>`;

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #09090b; color: #f4f4f5; margin: 0; padding: 24px; }
          .container { max-width: 600px; margin: 0 auto; background: #121215; border: 1px solid #27272a; border-radius: 16px; overflow: hidden; }
          .header { background: linear-gradient(135deg, #06b6d4, #2563eb); padding: 32px 24px; text-align: center; }
          .header h1 { margin: 0; color: #09090b; font-size: 24px; font-weight: 800; letter-spacing: -0.5px; }
          .content { padding: 32px 24px; font-size: 15px; line-height: 1.6; color: #d4d4d8; }
          .greeting { font-size: 18px; font-weight: bold; color: #ffffff; margin-bottom: 16px; }
          .highlight-card { background: #18181b; border: 1px solid #27272a; border-left: 4px solid #06b6d4; border-radius: 8px; padding: 16px; margin: 24px 0; }
          .perks-list { margin: 16px 0; padding-left: 20px; }
          .perks-list li { margin-bottom: 8px; color: #e4e4e7; }
          .btn { display: inline-block; background: #06b6d4; color: #09090b; font-weight: bold; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin-top: 16px; }
          .footer { padding: 24px; text-align: center; font-size: 12px; color: #71717a; border-top: 1px solid #27272a; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>RIGFORGE INDIA</h1>
          </div>
          <div class="content">
            <div class="greeting">Hello ${recipientName},</div>
            <p>
              Your RigForge hardware account has been successfully created. Welcome to the ultimate custom PC building platform in India! You can now configure, price, and save your custom battle rigs with 100% verified component compatibility.
            </p>
            
            <div class="highlight-card">
              <strong style="color: #06b6d4;">Your RigForge Privileges:</strong>
              <ul class="perks-list">
                <li><strong>Indian Retail Catalog:</strong> Access real-time hardware prices benchmarked against MDComputers, Vedant, and PrimeABGB.</li>
                <li><strong>Direct UPI QR Payments:</strong> Zero payment gateway fees via verified UPI (Bank of India / 9819319689@nyes).</li>
                <li><strong>Official Brand Warranty:</strong> 100% genuine products with manufacturer serial warranty across India.</li>
                <li><strong>Transit Insured Courier:</strong> Express air shipping via BlueDart and Delhivery Surface Air.</li>
              </ul>
            </div>

            <p>
              Ready to construct your dream gaming or workstation PC? Launch our interactive builder today!
            </p>
            
            <div style="text-align: center;">
              <a href="http://localhost:5173/#builder" class="btn">Launch PC Builder</a>
            </div>
          </div>
          <div class="footer">
            &copy; ${new Date().getFullYear()} RigForge Technologies India. All rights reserved.<br/>
            Bengaluru & Mumbai Hubs &bull; GST Input Tax Credit Eligible
          </div>
        </div>
      </body>
    </html>
  `;

  const textContent = `
Hello ${recipientName},

Your RigForge hardware account has been successfully created. Welcome to the ultimate custom PC building platform in India! You can now configure, price, and save your custom battle rigs with 100% verified component compatibility.

Your Privileges:
- Indian Retail Catalog with real-time hardware prices
- Direct UPI QR Payments (Zero fee)
- 100% Official Indian Brand Warranty
- Transit Insured Courier (BlueDart / Delhivery)

Launch PC Builder: http://localhost:5173/#builder

RigForge Technologies India
  `;

  try {
    const transporter = createTransporter();
    
    if (transporter && process.env.SMTP_PASS) {
      const info = await transporter.sendMail({
        from: fromAddress,
        to: recipientEmail,
        subject: '🎉 Welcome to RigForge! Your Account has been Successfully Created',
        text: textContent,
        html: htmlContent,
      });

      console.log(`✉️ [Nodemailer] Welcome email sent to ${recipientEmail}. MessageId: ${info.messageId}`);
      return { success: true, preview: `Email sent to ${recipientEmail} via SMTP.` };
    } else {
      // In-memory / Console preview mode
      console.log('------------------------------------------------------------');
      console.log(`✉️ [Nodemailer Console Preview] Welcome Email Dispatched`);
      console.log(`To: ${recipientEmail}`);
      console.log(`Subject: 🎉 Welcome to RigForge! Your Account has been Successfully Created`);
      console.log(`Recipient: ${recipientName}`);
      console.log('------------------------------------------------------------');
      return { 
        success: true, 
        preview: `Welcome email queued & logged for ${recipientEmail} (Console preview active, configure SMTP_PASS in server/.env for live transmission).` 
      };
    }
  } catch (error: any) {
    console.error('⚠️ [Nodemailer Error] Could not dispatch email:', error.message);
    return { success: false, error: error.message };
  }
};

import nodemailer from "nodemailer";

export async function sendVerificationEmail(to: string, code: string) {
  // اعمل الـ transporter هون (بعد ما dotenv حمّل المتغيرات)
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  const mailOptions = {
    from: `"Qash" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Qash - Verification Code",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #D88F65;">Welcome to Qash!</h2>
        <p>Your verification code is:</p>
        <div style="background: #F4F1EA; padding: 20px; text-align: center; border-radius: 8px;">
          <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #1A1A1A;">
            ${code}
          </span>
        </div>
        <p style="color: #999; font-size: 14px; margin-top: 20px;">
          This code will expire in 10 minutes.
        </p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
}

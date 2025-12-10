import dotenv from 'dotenv'
dotenv.config()

import nodemailer from 'nodemailer'

// Helper: create transporter *when needed*
function createTransporter() {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error('❌ EMAIL_USER or EMAIL_PASS missing in env inside sendEmail.js')
    throw new Error('Email credentials not configured')
  }

  console.log('📧 Using EMAIL_USER =', process.env.EMAIL_USER)

  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  })
}

export async function sendResetEmail(to, resetLink) {
  try {
    const transporter = createTransporter()

    const info = await transporter.sendMail({
      from: `"Café Delight" <${process.env.EMAIL_USER}>`,
      to,
      subject: 'Reset your Café Delight password',
      html: `
        <div style="font-family:Arial;max-width:600px;margin:auto;padding:20px;">
          <h2>Password Reset Request</h2>
          <p>We received a request to reset your Café Delight password.</p>
          <p>Click the button below to reset your password:</p>
          <p>
            <a href="${resetLink}"
               style="background:#b45309;color:white;padding:10px 16px;
                      border-radius:6px;text-decoration:none;display:inline-block;">
              Reset Password
            </a>
          </p>
          <p>This link will expire in 15 minutes.</p>
          <p>If you did not request this, you can safely ignore this email.</p>
          <hr />
          <small>© Café Delight</small>
        </div>
      `,
    })

    console.log('✅ Reset email sent to:', to)
    console.log('📨 Message ID:', info.messageId)
  } catch (err) {
    console.error('❌ Email send error (sendResetEmail):', err)
    throw err
  }
}

import e from 'express';
import nodemailer from 'nodemailer'
import generateEmailToken from './tokenGenerator.js';

const transporter = nodemailer.createTransport({
    service: "gmail",
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const sendMail = async (email, username) => {

    const code = generateEmailToken()
    const mail = await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Verification email from RED - EXTRO',
        html: `
                <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 30px;">
                    <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                    <h2 style="color: #333;">Email Verification</h2>
                    <p style="font-size: 16px; color: #555;">
                        Hi <strong>${username}</strong>,
                    </p>
                    <p style="font-size: 16px; color: #555;">
                        Thank you for signing up. Please use the verification code below to verify your email address:
                    </p>
                    <div style="font-size: 24px; font-weight: bold; letter-spacing: 2px; color: #2c3e50; margin: 20px 0;">
                        ${code}
                    </div>
                    <p style="font-size: 14px; color: #999;">
                        This code will expire in 60 seconds. If you did not request this, please ignore this email.
                    </p>
                    <p style="font-size: 16px; color: #555;">
                        Regards,<br />
                        <strong>Your App Team</strong>
                    </p>
                    </div>
                </div>
                `
    })

    if (!mail) return false
    console.log("Message sent:", mail.messageId);
    return code

}

export default sendMail
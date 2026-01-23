import nodemailer from 'nodemailer';
import twilio from 'twilio';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD, 
  },
});

const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export const sendEmail = async (to, subject, text, html) => {
  try {
    const mailOptions = {
      from: `"ClaimDrop Team" <${process.env.GMAIL_USER}>`,
      to: Array.isArray(to) ? to.join(',') : to,
      subject: subject,
      text: text,
      html: html,
    };

    const info = await transporter.sendMail(mailOptions);

    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Nodemailer Error:', error.message);
    return { success: false, error: error.message };
  }
};

export const sendSMS = async (to, message) => {
  try {
    const response = await twilioClient.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: to,
    });

    return { success: true, sid: response.sid };
  } catch (error) {
    console.error('Twilio Error:', error.message);
    return { success: false, error: error.message };
  }
};
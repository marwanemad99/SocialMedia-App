import { createTransport } from "nodemailer";

export const sendEmail = async ({
  to = [],
  subject = "",
  text = "",
  html = "",
} = {}) => {
  const transporter = createTransport({
    service: 'gmail',
    auth: {
      user: process.env.NODE_MAILER_EMAIL,
      pass: process.env.NODE_MAILER_PASSWORD,
    },
  });

  async function main() {

    const info = await transporter.sendMail({
      from: `Social Media <${process.env.NODE_MAILER_EMAIL}>`,
      to,
      subject,
      text,
      html,
    });

    console.log("Message sent: %s", info.messageId);
    // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
  }

  main().catch(console.error);
};
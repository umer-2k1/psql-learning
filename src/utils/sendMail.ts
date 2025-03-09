import nodemailer from "nodemailer";
import dotenv from "dotenv";
const sendgridTransport = require("nodemailer-sendgrid-transport");
dotenv.config({ path: "./src/config/config.env" });
const { createTransport } = nodemailer;

const sendMail = async (
  email: string,
  subject: string,
  text: string
): Promise<void> => {
  const transport = createTransport(
    sendgridTransport({
      auth: {
        api_key: process.env.NODEMAILER_API_KEY as string,
      },
    })
  );
  await transport.sendMail({
    from: "unknowndev@gmail.com",
    to: email,
    subject,
    text,
  });
};

export default sendMail;

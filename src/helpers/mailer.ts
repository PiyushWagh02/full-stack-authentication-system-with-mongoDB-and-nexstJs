import nodemailer from "nodemailer";
import User from "../models/userModel";
import crypto from "crypto";

export const sendEmail = async ({ email, emailType, userId }: any) => {
  try {
    // ✅ Generate clean token
    const token = crypto.randomBytes(32).toString("hex");

    // ✅ Save token in DB
    if (emailType === "VERIFY") {
      await User.findByIdAndUpdate(userId, {
        verifyToken: token,
        verifyTokenExpiry: Date.now() + 3600000, // 1 hour
      });
    } else if (emailType === "RESET") {
      await User.findByIdAndUpdate(userId, {
        forgotPasswordToken: token,
        forgotPasswordTokenExpiry: Date.now() + 3600000,
      });
    }

    // ✅ Mail transport
    const transport = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: process.env.NODEMAILER_USERNAME,
        pass: process.env.NODEMAILER_PASSWORD,
      },
    });

    const path =
      emailType === "VERIFY" ? "verifyemail" : "resetpassword";

    const url = `${process.env.DOMAIN}/${path}?token=${token}`;

    // ✅ Email content
    const mailOptions = {
      from: '"Auth App" <no-reply@example.com>',
      to: email,
      subject:
        emailType === "VERIFY"
          ? "Verify your email"
          : "Reset your password",
      html: `
        <p>
          Click <a href="${url}">here</a> 
          to ${
            emailType === "VERIFY"
              ? "verify your email"
              : "reset your password"
          }.
          <br/><br/>
          Or copy and paste this link in your browser:
          <br/>
          ${url}
        </p>
      `,
    };

    console.log("Sending email to:", email);

    const response = await transport.sendMail(mailOptions);
    return response;

  } catch (error: any) {
    throw new Error(error.message);
  }
};
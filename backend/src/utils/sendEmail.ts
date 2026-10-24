import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});
console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log(
    "EMAIL_PASS:",
    process.env.EMAIL_PASS ? "Loaded" : "Missing"
);
export const sendOTPEmail = async (
    email: string,
    otp: string,
    purpose: "register" | "reset"
): Promise<void> => {

    const subject =
        purpose === "register"
            ? "Finance Manager - Verify Your Email"
            : "Finance Manager - Reset Password";

    const message =
        purpose === "register"
            ? `Your Finance Manager verification OTP is: ${otp}`
            : `Your Finance Manager password reset OTP is: ${otp}`;

    await transporter.sendMail({
        from: `"Finance Manager" <${process.env.EMAIL_USER}>`,
        to: email,
        subject,
        text: `${message}\n\nThis OTP is valid for 5 minutes.`
    });
};
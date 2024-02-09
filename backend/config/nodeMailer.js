import asyncHandler from "../middleware/asyncHandler.js";
import nodemailer from "nodemailer";

let transporter = nodemailer.createTransport({
    host: 'smtp.example.com',
    port: 587,
    secure: false,
    auth: {
        user: 'username',
        pass: 'password'
    }
});

const sendMail = asyncHandler(async (toMail, otp) => {

    let mailOptions = {
        from: '"Rubidya" <noreply@rubidya.com>',
        to: `${toMail}`,
        suject: 'Rubidya OTP',
        text: `OTP for registration is ${otp}`,
    }
    
    let info = await transporter.sendMail(mailOptions);

    console.log(`Message sent: ${info.messageId}`);

})

export default sendMail;
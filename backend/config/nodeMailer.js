import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
    host: 'smtp.zoho.in',
    port: 465,
    secure: true,
    auth: {
        user: 'info@rubidya.com',
        pass: '1@Rubidya'
    }
});

// const sendMail = asyncHandler(async (toMail, otp) => {
//     console.log("Sending mail to " + toMail);

//     let mailOptions = {
//         from: '"Rubidya" <info@rubidya.com>',
//         to: `${toMail}`,
//         suject: 'Rubidya OTP',
//         text: `OTP for registration is ${otp}`,
//     }
    
//     let info = await transporter.sendMail(mailOptions);

//     console.log(`Message sent: ${info.messageId}`);
//     return info.messageId; 

// })

// export default sendMail;
const PDFDocument = require("pdfkit")
const nodemailer = require(`nodemailer`)
const fs = require(`fs`)

// Function to send an email with the certificate  
async function sendCertificateEmail(email, fileName) {  
try {
    let transporter = nodemailer.createTransport({  
        service: 'gmail',  // Or use another email service  
        auth: {  
            user: `${process.env.EMAIL}`,  // Your email  
            pass: `${process.env.EMAIL_PASSWORD}`,  // Your password or app-specific password  
        },  
    });  

    const filePath = `./certificates/${fileName}`;  
    const mailOptions = {  
        from: `${process.env.EMAIL}`,  
        to: email,  
        subject: 'Your Certificate',  
        text: 'Congratulations! Please find your certificate attached.',  
        attachments: [  
            {  
                filename: fileName,  
                path: filePath,  
            },  
        ],  
    };  
    await transporter.sendMail(mailOptions);

} catch (error) {
    console.log(error)
}
  
}  
module.exports = sendCertificateEmail
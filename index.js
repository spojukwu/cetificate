const express = require('express');  
const fs = require('fs');  
const PDFDocument = require('pdfkit');  
const nodemailer = require('nodemailer');


const generateCertificate = require('./middlewares/generateCert');
const sendCertificateEmail = require('./middlewares/sendCertificate');

const app = express();  
app.use(express.json());  

// Ensure the certificates directory exists  
const certificatesDir = './certificates';  
if (!fs.existsSync(certificatesDir)){  
    fs.mkdirSync(certificatesDir);  
}  

// API route to generate and send a certificate  
app.post('/send-certificate', async (req, res) => {  
    const { fullName, email } = req.body;  

    if (!fullName || !email) {  
        return res.status(400).send('Name and email are required');  
    }  

    // Generate certificate  
    const fileName = `${fullName}-certificate.pdf`;  
    try {  
        await generateCertificate(fullName, fileName);  

        // Send the certificate  
        await sendCertificateEmail(email, fileName);  

        // Send response  
        res.send(`Certificate sent to ${email}`);  
    } catch (error) {  
        console.error(error);  
        res.status(500).send('Failed to generate or send the certificate');  
    }  
});  




// Additional API route to generate and download certificate directly (optional)  
app.post('/generate-certificate', async (req, res) => {  
    const { name } = req.body;  
    const fileName = `${name}-certificate.pdf`;  

    try {  
        await generateCertificate(name, fileName);  
        const filePath = `./certificates/${fileName}`;  
        res.download(filePath);  
    } catch (error) {  
        console.error(error);  
        res.status(500).send('Failed to generate certificate');  
    }  
});
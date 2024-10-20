const express = require('express'); 
const nodemailer = require('nodemailer');  
const PDFDocument = require('pdfkit');    
const fs = require('fs');
const dotenv = require(`dotenv`).config()

const connectToDatabase = require('./db');
const generateCertificate = require('./services/generateCert');
const sendCertificateEmail = require('./services/sendCertificate');
const Users = require('./models/user');



const app = express()
app.use(express.json())// Middleware to parse JSON bodies


const PORT = process.env.PORT || 8000; 

connectToDatabase();

app.listen(PORT, () => {  
    console.log(`Server running at http://localhost:${PORT}`);  
}); 



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
    const existingEmail = await Users.findOne({email});
    if(!existingEmail){
        return res.status(400).json({message: " Email not found"})
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

app.get("/get-users",  async (req,res)=>{
    try {
        const allUsers = await Users.find();
    res.send(allUsers)
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message }) 
    }
})


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

const express = require('express');  
const app = express();   

const fs = require('fs');  
const PDFDocument = require('pdfkit');  
const path = require('path');  

// Function to generate a certificate  
function generateCertificate(fullName, fileName) {  
    return new Promise((resolve, reject) => {  
        // Ensure the certificates directory exists; create it if not  
        const dir = './certificates';  
        if (!fs.existsSync(dir)) {  
            fs.mkdirSync(dir);  
        }  
        const LANDSCAPE_A4_WIDTH = 842;  
        const LANDSCAPE_A4_HEIGHT = 595;  

        const doc = new PDFDocument({  
            size: [LANDSCAPE_A4_WIDTH, LANDSCAPE_A4_HEIGHT],  
        });  

        const filePath = path.join(dir, fileName);  

        // Pipe PDF into a writable stream  
        const writeStream = fs.createWriteStream(filePath);  
        doc.pipe(writeStream);  

        const backgroundImagePath = path.join(__dirname, "images/background.jpeg");  
        doc.image(backgroundImagePath, 0, 0, {  
            width: LANDSCAPE_A4_WIDTH,  
            height: LANDSCAPE_A4_HEIGHT,  
        });  

        const logo1Path = path.join(__dirname, "images/youthrive-logo-png.png");  
        const logo2Path = path.join(__dirname, "images/careerex-logo-png.png");  

        const logoWidth = 100;  
        const logoHeight = 70;  

        const totalLogoWidth = 2 * logoWidth + 20;  
        const xStart = (LANDSCAPE_A4_WIDTH - totalLogoWidth) / 2;  
        const logoYPosition = 50;  

        doc.image(logo1Path, xStart, logoYPosition, {  
            width: logoWidth,  
            height: logoHeight,  
        });  
        doc.image(logo2Path, xStart + logoWidth + 20, logoYPosition, {  
            width: logoWidth,  
            height: logoHeight,  
        });  

        // Add content to the PDF document  
        doc.moveDown(7);  
        doc.fontSize(45).text('Certificate of Completion', { align: 'center', bold: true });  
        doc.moveDown(0);  
        doc.fontSize(25).text('This certifies that', { align: 'center' });  
        doc.moveDown(0.5);  
         
        // Draw the full name  
        const fullNameText = `${fullName}`;  
        const nameTextWidth = doc.widthOfString(fullNameText);  
        const nameX = (LANDSCAPE_A4_WIDTH - nameTextWidth) / 2; // Center the full name text  

        // Get the current Y position after writing the full name  
        doc.fontSize(27).fillColor("black").text(fullNameText, { align: "center", bold: true });  

        // Calculate the Y position for the underline after the full name has been written  
        const underlineY = doc.y + 0; // Move down slightly after the text  

        // Draw an underline below the full name  
        doc.moveTo(nameX, underlineY)  
           .lineTo(nameX + nameTextWidth, underlineY)  
           .stroke();  

        doc.moveDown(1); // Move down to space before the next text  
        doc.fontSize(25).text('has successfully completed three months intensive training with us on backend development.', { align: 'center' });  
        
        // Function to format the date  
        function formatDate(date) {  
            const options = { year: 'numeric', month: 'long', day: 'numeric' };  
            return date.toLocaleDateString(undefined, options);  
        }  

        // Add date  
        const currentDate = new Date(); // Current date  
        const formattedDate = formatDate(currentDate); // Format the date  

        doc.moveDown(2); // Add some space before the date  
        doc.fontSize(20).text(`Date: ${formattedDate}`, { align: 'left' });  
        
        doc.end();  

        // Resolve when the PDF is finished writing  
        writeStream.on('finish', () => {  
            resolve(filePath); // Optionally return the file path  
        });  

        // Reject if there is an error  
        writeStream.on('error', (err) => {  
            console.error('Error writing PDF:', err);  
            reject(err);  
        });  
        
        // Handle PDF specific errors  
        doc.on('error', (err) => {  
            console.error('PDFKit error:', err);  
            reject(err);  
        });  
    });  
}  

module.exports = generateCertificate;
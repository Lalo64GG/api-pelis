import express from 'express';
import nodemailer from 'nodemailer';
import cors from 'cors';
import https from 'https';
import fs from 'fs';
import path from 'path';

// Create Express app
const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Use CORS middleware to allow requests from specific origins
app.use(cors({
  origin: ['*'], // Add all allowed origins here
}));

// Configure Nodemailer transport
const transporter = nodemailer.createTransport({
  service: 'gmail', // You can use another service or SMTP
  auth: {
    user: '223257@ids.upchiapas.edu.mx',
    pass: 'xftq yzwy vhoj btqf'
  }
});

// Endpoint to send email
app.post('/send-email', async (req, res) => {
  const { name, email, message, datetime, movieTitle, secondName } = req.body;

  if (!name || !email || !message || !datetime || !movieTitle || !secondName) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const mailOptions = {
    from: "Let's Watch Together",
    to: email,
    subject: `Invitation to watch ${movieTitle}`,
    text: `Hello ${secondName},\n\n${name} has invited you to watch "${movieTitle}" together. Here are the details:\n\nMessage from ${name}:\n"${message}"\n\nDate and Time: ${datetime}\n\nWe hope you can join us!\n\nBest regards,\nLet's Watch Together`
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: 'Email sent successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to send email' });
  }
});

// Load SSL certificate and key
const key = fs.readFileSync('/home/ubuntu/api-pelis/ssl-certs/server.key', 'utf8');
const cert = fs.readFileSync('/home/ubuntu/api-pelis/ssl-certs/server.cert', 'utf8');

// Create HTTPS server
const server = https.createServer({ key, cert }, app);

server.listen(port, () => {
  console.log(`Server running at https://localhost:${port}`);
});

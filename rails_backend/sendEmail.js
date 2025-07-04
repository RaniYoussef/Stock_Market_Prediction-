const nodemailer = require('nodemailer');

async function sendTestEmail() {
  // 1. Create a test account (fake email service)
  let testAccount = await nodemailer.createTestAccount();

  // 2. Create a transporter
  let transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email", // Fake SMTP service
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user, // Auto-generated test user
      pass: testAccount.pass  // Auto-generated test password
    }
  });

  // 3. Send a test email
  let info = await transporter.sendMail({
    from: '"Test 👻" <test@example.com>',
    to: "your-real-email@gmail.com", // ← Change to your actual email
    subject: "Nodemailer Test",
    text: "Hello world?",
    html: "<b>Hello world?</b>"
  });

  console.log("Message sent: %s", info.messageId);
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}

// Run the function
sendTestEmail().catch(console.error);
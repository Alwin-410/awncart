const express = require("express");
const bodyParser = require("body-parser");
const { MongoClient } = require("mongodb");
const nodemailer = require("nodemailer");
const path = require("path");

const app = express();
const port = 3000;

// Middleware
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// MongoDB setup
const url = "mongodb://127.0.0.1:27017";
const client = new MongoClient(url);

let db;

// Connect MongoDB once when server starts
async function connectDB() {
  try {
    await client.connect();
    db = client.db("mydb");
    console.log("✅ Connected to MongoDB");
  } catch (err) {
    console.error("❌ MongoDB Connection Error:", err);
  }
}
connectDB();

// Home Route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "anima.html"));
});

// Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "funnyclipsman135@gmail.com",
    pass: "kkin sfwf zauy uuqj"   
  }
});

// Form Submit Route
app.post("/submit", async (req, res) => {
  try {
    const collection = db.collection("users");

    const data = {
      name: req.body.name,
      age: req.body.age,
      email: req.body.email
    };

    // Insert into MongoDB
    await collection.insertOne(data);

    // Email options
    const mailOptions = {
      from: "funnyclipsman135@gmail.com",
      to: req.body.email,
      subject: "Welcome to AwnCart 🎉",
      text: `Hello ${req.body.name},

Welcome to AwnCart — we’re excited to have you with us! 🎉

Thank you for sharing your details. We use your information to provide a personalized shopping experience.

Your data is stored securely and will never be shared.

Warm regards,  
Team AwnCart`
    };

    // Send Email
    await transporter.sendMail(mailOptions);

    res.send(`
<!DOCTYPE html>
<html>
<head>
  <title>Success</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background: #f4f6f8;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
    }
    .box {
      background: white;
      padding: 35px;
      border-radius: 10px;
      text-align: center;
      box-shadow: 0 10px 25px rgba(0,0,0,0.1);
    }
    button {
      margin-top: 20px;
      padding: 12px 24px;
      border: none;
      border-radius: 6px;
      background: #007bff;
      color: white;
      font-size: 16px;
      cursor: pointer;
    }
    button:hover {
      background: #0056b3;
    }
  </style>
</head>
<body>

  <div class="box">
    <h2>✅ Data inserted & Email sent successfully</h2>

    <button onclick="window.location.href='/propage.html'">
      Go to Next Page
    </button>
  </div>

</body>
</html>
`);

  } catch (err) {
    console.error("❌ Error:", err);
    res.status(500).send("❌ Error inserting data or sending email");
  }
});

// Start server
app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
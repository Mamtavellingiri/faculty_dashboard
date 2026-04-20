// Import modules
const express = require("express");
const cors = require("cors");
const fs = require("fs");

// Create app
const app = express();

// Middleware (IMPORTANT ORDER)
app.use(cors());
app.use(express.json());

// File to store users
const FILE = "users.json";

// Create file if not exists
if (!fs.existsSync(FILE)) {
    fs.writeFileSync(FILE, JSON.stringify([]));
}

// ================= REGISTER =================
app.post("/register", (req, res) => {
    console.log("Register request:", req.body);

    const { name, email, password } = req.body;

    const users = JSON.parse(fs.readFileSync(FILE));

    // Check if user already exists
    const exists = users.find(u => u.email === email);
    if (exists) {
        return res.send("User already exists ❌");
    }

    users.push({ name, email, password });

    fs.writeFileSync(FILE, JSON.stringify(users, null, 2));

    res.send("User registered successfully ✅");
});

// ================= LOGIN =================
app.post("/login", (req, res) => {
    console.log("Login request:", req.body);

    const { email, password } = req.body;

    const users = JSON.parse(fs.readFileSync(FILE));

    const user = users.find(
        u => u.email === email && u.password === password
    );

    if (user) {
        res.send("Login successful ✅");
    } else {
        res.status(401).send("Invalid email or password ❌");
    }
});

// Test route (IMPORTANT for checking connection)
app.get("/", (req, res) => {
    res.send("Server is working 🚀");
});

// Start server
app.listen(5000, () => {
    console.log("Server running on port 5000");
});
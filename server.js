const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'react',
    port: 3306
});

const PORT = 8081;

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

app.post('/register', (req, res) => {

    const sql = 'INSERT INTO register (name, email, password) VALUES (?, ?, ?)';
    const values = [
        req.body.name,
        req.body.email,
        req.body.password
    ];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error("Database Error:", err); // Display error in console
            return res.status(500).json({ message: "Database error", error: err });
        } else {
            console.log("Insert Success:", result);
            return res.status(201).json({ message: "User registered successfully", result });
        }
    });
});


app.post('/login', (req, res) => {

    const sql = 'SELECT * FROM register WHERE email = ? AND password = ?';
    db.query(sql, [req.body.email, req.body.password], (err, result) => {
        if (err) {
            console.error("Database Error:", err); // Display error in console
            return res.status(500).json({ message: "Database error", error: err });
        } else {
            console.log("Login Success:", result);
            if (result.length > 0) {
                return res.status(200).json({ success: true, message: "Login success", user: result[0] });
            } else {
                return res.status(401).json({ success: false, message: "Wrong password!" });
            }            
        }
    });
});


db.connect(err => {
    if (err) {
        console.error("Database Connection Failed:", err);
    } else {
        console.log("Connected to MySQL Database!");
    }
});
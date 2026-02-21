const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// =====================================================
// CONNECT TO MYSQL DATABASE (Relational)
// =====================================================
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',          // Change to your MySQL username
    password: 'admin1234',      // Change to your MySQL password
    database: 'employee_db'
});

db.connect((err) => {
    if (err) {
        console.error('❌ Error connecting to MySQL:', err.message);
    } else {
        console.log('✅ Connected to MySQL Database (Relational)');
    }
});

// =====================================================
// API ROUTES (CRUD Operations)
// =====================================================

// 1. GET ALL EMPLOYEES (Read)
app.get('/api/employees', (req, res) => {
    const sql = 'SELECT * FROM employees ORDER BY id DESC';
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

// 2. ADD NEW EMPLOYEE (Create)
app.post('/api/employees', (req, res) => {
    const { first_name, last_name, email, department, salary,  } = req.body;
    
    const sql = 'INSERT INTO employees (first_name, last_name, email, department, salary) VALUES (?, ?, ?, ?, ?)';
    
    db.query(sql, [first_name, last_name, email, department, salary], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ 
            message: 'Employee added successfully', 
            id: result.insertId 
        });
    });
});

// 3. DELETE EMPLOYEE (Delete)
app.delete('/api/employees/:id', (req, res) => {
    const sql = 'DELETE FROM employees WHERE id = ?';
    db.query(sql, [req.params.id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Employee deleted successfully' });
    });
});

// 4. UPDATE EMPLOYEE (Update)
app.put('/api/employees/:id', (req, res) => {
    const { first_name, last_name, email, department, salary } = req.body;
    const sql = 'UPDATE employees SET first_name = ?, last_name = ?, email = ?, department = ?, salary = ? WHERE id = ?';
    
    db.query(sql, [first_name, last_name, email, department, salary, req.params.id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Employee updated successfully' });
    });
});

// Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});
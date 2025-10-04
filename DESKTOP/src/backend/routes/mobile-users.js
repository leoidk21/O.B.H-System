const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../db');
const { authenticateToken } = require ('./middleware/mobile-auth');

const router = express.Router();

router.post('/signup', async (req, res) => {
    console.log('Signup request received:', req.body);
    const { first_name, last_name, email, phone, password } = req.body;

    try {
        // 1. check if users already exist
        const userCheck = await pool.query(
            'SELECT * from mobile_users WHERE email = $1',
            [email]    
        );

        if (userCheck.rows.length > 0) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // 2. Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // 3. Insert new user
        const newUser = await pool.query(
            `INSERT INTO mobile_users (first_name, last_name, email, phone, password)
            VALUES ($1, $2, $3, $4, $5) RETURNING id, first_name, last_name, email, phone, role`,
            [first_name, last_name, email, phone, hashedPassword]
        );

        const user = newUser.rows[0];

        // 4. Generate token
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '12h' }
        );

        // 5. Return token + user
        res.json({
            token,
            user: {
                id: user.id,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                role: user.role
            }
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error' });
    }
})

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const result = await pool.query(
            'SELECT * FROM mobile_users WHERE email = $1',
            [email]
        );

        // validation
        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const user = result.rows[0];

        // compare password
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // generate token
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '12h' }
        );

        console.log('User object:', user);

        res.json({ 
            token, 
            user: { 
                id: user.id,
                first_name: user.first_name, 
                last_name: user.last_name,
                email: user.email, 
                phone: user.phone,
                role: user.role 
            } 
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error' });
    }
})

router.get('/mobile-users', authenticateToken, async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT id, first_name, last_name, email, phone, role
             FROM mobile_users
             ORDER BY created_at DESC`
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error' });
    }
})

module.exports = router;
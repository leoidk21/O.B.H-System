const express = require('express');
const pool = require('../db');

const { authenticateToken: verifMobileAuth } = require('./middleware/mobile-auth');

// Create router using express.Router()
const router = express.Router();

// POST /event-plans - Create a new event plan
router.post('/event-plans', verifMobileAuth, async (req, res) => {
    try {
        console.log('📝 Received event plan creation request:', req.body);
        
        const {
            user_id,
            event_type,
            package,
            client_name,
            partner_name,
            event_date,
            event_segments,
            guest_count,
            venue,
            budget,
            proof_of_payment,
            e_signature,
        } = req.body;

        // Validate required fields
        if (!client_name || !event_date || !event_type) {
            return res.status(400).json({ 
                error: 'Missing required fields: client_name, event_date, event_type' 
            });
        }

        const result = await pool.query(
            `INSERT INTO event_plans 
                (user_id, event_type, package, client_name, partner_name, event_date, event_segments,
                guest_count, venue, budget, proof_of_payment, e_signature)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
            RETURNING *`,
            [user_id, event_type, package, client_name, partner_name, event_date, event_segments, 
             guest_count, venue, budget, proof_of_payment, e_signature]
        );

        console.log('✅ Event plan created successfully:', result.rows[0]);

        res.status(201).json({
            message: 'Event plan submitted successfully',
            event_plan: result.rows[0],
        });
    } catch (error) {
        console.error('❌ Error creating event plan:', error);
        res.status(500).json({ error: 'Server error while creating event plan' });
    }
});

// GET /event-plans - Retrieve all event plans
router.get('/event-plans', verifMobileAuth, async (req, res) => {
    try {
        console.log('📋 Fetching all event plans');
        
        const result = await pool.query(
            'SELECT * FROM event_plans ORDER BY created_at DESC'
        );

        res.json({
            message: 'Event plans retrieved successfully',
            event_plans: result.rows,
        });
    } catch (error) {
        console.error('❌ Error retrieving event plans:', error);
        res.status(500).json({ error: 'Server error while retrieving event plans' });
    }
});

// GET /event-plans/:id - Get single event plan
router.get('/event-plans/:id', verifMobileAuth, async (req, res) => {
    try {
        const { id } = req.params;
        console.log(`📋 Fetching event plan: ${id}`);
        
        const result = await pool.query(
            'SELECT * FROM event_plans WHERE id = $1',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Event plan not found' });
        }

        res.json({
            message: 'Event plan retrieved successfully',
            event_plan: result.rows[0],
        });
    } catch (error) {
        console.error('❌ Error retrieving event plan:', error);
        res.status(500).json({ error: 'Server error while retrieving event plan' });
    }
});

module.exports = router;
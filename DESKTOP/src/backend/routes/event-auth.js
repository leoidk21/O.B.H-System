const express = require('express');
const pool = require('../db');
const { authenticateToken: verifyAdminAuth } = require('./middleware/auth');

const router = express.Router();

// Get all pending event plans
router.get('/pending', verifyAdminAuth, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT ep.*, mu.full_name AS user_name
       FROM event_plans ep
       JOIN mobile_users mu ON ep.user_id = mu.id
       WHERE ep.status = 'Pending'
       ORDER BY submitted_at DESC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch pending events' });
  }
});

// Approve / Reject event
router.put('/review/:id', verifyAdminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, remarks } = req.body;
    const adminId = req.user.id; // from token

    const validStatuses = ['Approved', 'Rejected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const result = await pool.query(
      `UPDATE event_plans
       SET status = $1, remarks = $2, reviewed_at = NOW(), admin_id = $3
       WHERE id = $4 RETURNING *`,
      [status, remarks, adminId, id]
    );

    if (result.rowCount === 0)
      return res.status(404).json({ error: 'Event not found' });

    res.json({
      message: `Event ${status.toLowerCase()} successfully`,
      updated_event: result.rows[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error reviewing event plan' });
  }
});

module.exports = router;
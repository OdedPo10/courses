const express = require('express');
const db = require('../model/db');
const router = express.Router();

////////FIND USER BY EMAIL////////
router.post('/getByEmail', async (req, res) => {
  try {
    const { rows } = await db.query(
      `SELECT user_id, name, email FROM users WHERE email = $1`,
      [req.body.email]
    );
    if (rows.length) {
      return res.status(200).send(rows[0]);
    } else {
      return res.status(404).send('user does not exist');
    }
  } catch (error) {
    res.status(500).send('Failed to fetch user');
  }
});

/////////FIND USER BY ID/////////
router.post('/getById', async (req, res) => {
  try {
    const { rows } = await db.query(
      `SELECT user_id, name, email FROM users WHERE user_id = $1`,
      [req.body.user_id]
    );
    if (rows.length) {
      return res.status(200).send(rows[0]);
    } else {
      return res.status(404).send('user does not exist');
    }
  } catch (error) {
    res.status(500).send('Failed to fetch user');
  }
});

module.exports = router;

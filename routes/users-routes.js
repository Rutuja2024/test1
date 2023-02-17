import express from 'express';
import pool from '../db.js';
import bcrypt from 'bcryptjs';
import { authenticateToken } from '../middleware/authorization.js';

const router = express.Router();

//Get users
router.get('/',authenticateToken,async (req,res)=>{
    try {
        const users = await pool.query('SELECT * FROM users');
        res.json({users: users.rows});
    } catch (error) {
        res.status(500).json({error:error.message});
    }
})

//Register user
router.post('/registerUser', async (req,res) =>{
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const newUser = await pool.query('INSERT INTO users(user_name,user_email,user_password,user_gender,user_dob,user_location,user_phn,user_upiId) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *', [req.body.name, req.body.email, hashedPassword,req.body.gender,req.body.dob,req.body.location,req.body.phn,req.body.upiId]);
        res.json({users: newUser.rows[0]});
    } catch (error) {
        res.status(500).json({error:error.message});
    }
})

export default router;
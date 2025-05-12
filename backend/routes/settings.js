import express from "express";
import jwt from 'jsonwebtoken';
import db from "../db.js";
import authToken from "../middleware/authToken.js";

const router = express.Router();


router.put('/updateSettings', authToken, (req, res) => {
    const { systemName , defaultCurrency } = req.body;

    db.query('SELECT * FROM system_settings', (err, rows) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: 'Database error' });
        }

        if (rows.length === 0) {

            db.query(
                'INSERT INTO system_settings (system_name , default_currency) VALUES (?, ?, ?)',
                [systemName, defaultCurrency],
                (insertErr) => {
                    if (insertErr) {
                        console.error('Insert error:', insertErr);
                        return res.status(500).json({ message: 'Insert failed' });
                    }
                    return res.json({ message: 'Settings inserted successfully' });
                }
            );
        } else {

            db.query(
                'UPDATE system_settings SET system_name = ? , default_currency = ?',
                [systemName, defaultCurrency],
                (updateErr) => {
                    if (updateErr) {
                        console.error('Update error:', updateErr);
                        return res.status(500).json({ message: 'Update failed' });
                    }
                    return res.json({ message: 'Settings updated successfully' });
                }
            );
        }
    });
});

router.get('/fetchSettings', authToken, (req, res) => {
    db.query('SELECT system_name ,default_currency  FROM system_settings', (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: 'Database error' });
        }
        if(results.length === 0) {
            return res.status(404).json({ message: 'No settings found' });
        }
        res.json(results[0])
    })
})



export default router;
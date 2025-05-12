import express from "express";
import jwt from 'jsonwebtoken';
import db from "../db.js";
import authToken from "../middleware/authToken.js";

const router = express.Router();

router.get('/fetchSupplier', authToken, (req, res) => {
    db.query('SELECT * FROM suppliers', (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: 'Database error' });
        }
        if(results.length === 0) {
            return res.status(404).json({ message: 'No supplier found' });
        }
        res.json(results)
    })
})

router.get('/fetchSupplierCount', authToken, (req, res) => {
    db.query('SELECT count(*) AS count FROM suppliers', (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: 'Database error' });
        }

        const count = results[0].count;
        res.json({ count });
    });
});

router.delete('/deleteSupplier/:id', authToken, (req, res) => {
    const  supplierId  = req.params.id;
    db.query('DELETE FROM suppliers WHERE id = ?', [supplierId], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: 'Database error' });
        }
        if(results.affectedRows === 0) {
            return res.status(404).json({ message: 'Supplier not found' });
        }
        res.json({message: 'Supplier deleted successfully'})
    })
})

router.put('/updateSupplier/:id', authToken, (req, res) => {
    const  supplierId  = req.params.id;
    const { name,location,phone } = req.body;
    db.query('UPDATE suppliers SET name = ?, location =?, phone = ? WHERE id = ?', [name, location, phone, supplierId], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: 'Database error' });
        }
        if(results.affectedRows === 0) {
            return res.status(404).json({ message: 'Supplier not found' });
        }
        res.json({message: 'Supplier updated successfully'})
    })
})

router.post('/addSupplier', authToken, (req, res) => {
    const { code,name,location,phone } = req.body;
    db.query('INSERT INTO suppliers SET ?', { code,name,location,phone }, (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: 'Database error' });
        }
        res.json({message: 'Supplier added successfully'})
    })
})

export default router;
import express from "express";
import db from "../db.js";
import authToken from "../middleware/authToken.js";

const router = express.Router();

router.get('/fetchCustomer', authToken, (req, res) => {
    db.query('SELECT * FROM customers', (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: 'Database error' });
        }
        if(results.length === 0) {
            return res.status(404).json({ message: 'No customer found' });
        }
        res.json(results)
    })
})

router.delete('/deleteCustomer/:id', authToken, (req, res) => {
    const  customerId  = req.params.id;
    db.query('DELETE FROM customers WHERE id = ?', [customerId], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: 'Database error' });
        }
        if(results.affectedRows === 0) {
            return res.status(404).json({ message: 'Customer not found' });
        }
        res.json({message: 'Customer deleted successfully'})
    })
})

router.put('/updateCustomer/:id', authToken, (req, res) => {
    const  customerId  = req.params.id;
    const { name,location,phone } = req.body;
    db.query('UPDATE customers SET name = ?, location =?, phone = ? WHERE id = ?', [name, location, phone, customerId], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: 'Database error' });
        }
        if(results.affectedRows === 0) {
            return res.status(404).json({ message: 'Customer not found' });
        }
        res.json({message: 'Customer updated successfully'})
    })
})

router.post('/addCustomer', authToken, (req, res) => {
    const { code,name,location,phone } = req.body;
    db.query('INSERT INTO customers SET ?', { code,name,location,phone }, (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: 'Database error' });
        }
        res.json({message: 'Customer added successfully'})
    })
})

export default router;
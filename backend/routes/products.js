import express from "express";
import jwt from 'jsonwebtoken';
import db from "../db.js";
import authToken from "../middleware/authToken.js";

const router = express.Router();

router.get('/fetchProduct', authToken, (req, res) => {
    const { category_id, code } = req.query;

    let query = `
        SELECT p.*, c.name AS category_name
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
    `;

    let queryParams = [];
    if (category_id) {

        query += ' WHERE p.category_id = ?';
        queryParams.push(category_id);
    }
    if (code) {
        query += category_id ? ' AND p.code LIKE ?' : ' WHERE p.code LIKE ?';
        queryParams.push(`%${code}%`);
    }

    db.query(query, queryParams, (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: 'Database error' });
        }
        if(results.length === 0) {
            return res.status(200).json([]);
        }
        res.json(results)
    })
})

router.get('/fetchLowStock', authToken, (req, res) => {
    db.query('SELECT * FROM products WHERE stock < 100 ORDER BY stock ASC LIMIT 10', (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: 'Database error' });
        }
        res.json(results)
    })
})
router.get('/fetchHighSelling', authToken, (req, res) => {
    db.query('SELECT code,qte_sold FROM products ORDER BY qte_sold DESC LIMIT 5', (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: 'Database error' });
        }
        res.json(results)
    })
})

router.delete('/deleteProduct/:id', authToken, (req, res) => {
    const  productId  = req.params.id;
    db.query('DELETE FROM products WHERE id = ?', [productId], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: 'Database error' });
        }
        if(results.affectedRows === 0) {
            return res.status(404).json({ message: 'product not found' });
        }
        res.json({message: 'Product deleted successfully'})
    })
})

router.put('/updateProduct/:id', authToken, (req, res) => {
    const  productId  = req.params.id;
    const { name,price,category_id } = req.body;
    db.query('UPDATE products SET name = ?, price = ?, category_id = ? WHERE id = ?', [name, price, category_id, productId], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: 'Database error' });
        }
        if(results.affectedRows === 0) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.json({message: 'Product updated successfully'})
    })
})

router.post('/addProduct', authToken, (req, res) => {
    const { code,name,price,category_id } = req.body;
    db.query('INSERT INTO products SET ?', { code,name,price,category_id }, (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: 'Database error' });
        }
        res.json({message: 'Product added successfully'})
    })
})

export default router;
import express from "express";
import db from "../db.js";
import authToken from "../middleware/authToken.js";

const router = express.Router();

router.get('/fetchCategory', authToken, (req, res) => {
    db.query('SELECT * FROM categories', (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: 'Database error' });
        }
        if(results.length === 0) {
            return res.status(404).json({ message: 'No categories found' });
        }
        res.json(results)
    })
})

router.delete('/deleteCategory/:id', authToken, (req, res) => {
    const  categoryId  = req.params.id;
    db.query('DELETE FROM categories WHERE id = ?', [categoryId], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: 'Database error' });
        }
        if(results.affectedRows === 0) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.json({message: 'Category deleted successfully'})
    })
})

router.put('/updateCategory/:id', authToken, (req, res) => {
    const  categoryId  = req.params.id;
    const { name } = req.body;
    db.query('UPDATE categories SET name = ? WHERE id = ?', [name, categoryId], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: 'Database error' });
        }
        if(results.affectedRows === 0) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.json({message: 'Category updated successfully'})
    })
})

router.post('/addCategory', authToken, (req, res) => {
    const { code,name } = req.body;
    db.query('INSERT INTO categories SET ?', { code,name }, (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: 'Database error' });
        }
        res.json({message: 'Category added successfully'})
    })
})

export default router;
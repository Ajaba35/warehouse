import express from "express";
import jwt from 'jsonwebtoken';
import db from "../db.js";
import authToken from "../middleware/authToken.js";

const router = express.Router();


router.post('/addSale', authToken, (req, res) => {
    const { code, customer, product, quantity, total_price } = req.body;

    db.query('SELECT stock, qte_sold FROM products WHERE id = ?', [product], (err, results) => {
        if (err) {
            console.error('Database error (fetch stock and qte_sold):', err);
            return res.status(500).json({ message: 'Database error checking stock and qte_sold' });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const currentStock = results[0].stock;
        const currentSold = results[0].qte_sold;

        if (currentStock < quantity) {
            return res.status(400).json({ message: 'Not enough stock available' });
        }

        db.query('INSERT INTO sales SET ?', { code, customer, product, quantity, total_price }, (err, saleResults) => {
            if (err) {
                console.error('Database error (insert sale):', err);
                return res.status(500).json({ message: 'Database error inserting sale' });
            }

            db.query('UPDATE products SET stock = stock - ?, qte_sold = qte_sold + ? WHERE id = ?', [quantity, quantity, product], (err) => {
                if (err) {
                    console.error('Database error (update stock and qte_sold):', err);
                    return res.status(500).json({ message: 'Database error updating stock and qte_sold' });
                }

                res.json({ message: 'Sale added, stock and sold quantity updated successfully' });
            });
        });
    });
});


router.get('/fetchSale', authToken, (req, res) => {
    const { customerId, searchText } = req.query;
    let query = `
        SELECT 
            sales.*, 
            customers.name AS customer_name, 
            products.code AS product_code, 
            products.name AS product_name
        FROM sales
        LEFT JOIN customers ON sales.customer = customers.id
        LEFT JOIN products ON sales.product = products.id
        
    `;

    let queryParams = [];

    if (customerId) {
        query += ' WHERE sales.customer = ?';
        queryParams.push(customerId);
    }
    if (searchText) {
        query += customerId ? ' AND sales.code LIKE ?' : ' WHERE sales.code LIKE ?';
        queryParams.push(`%${searchText}%`);
    }

    db.query(query, queryParams, (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: 'Database error' });
        }
        if (results.length === 0) {
            return res.status(200).json([]);
        }
        res.json(results);
    });
});

router.delete('/deleteSale/:id', authToken, (req, res) => {
    const saleId = req.params.id;

    db.query('SELECT product, quantity FROM sales WHERE id = ?', [saleId], (err, saleResults) => {
        if (err) {
            console.error('Database error (fetch sale):', err);
            return res.status(500).json({ message: 'Database error while fetching sale' });
        }

        if (saleResults.length === 0) {
            return res.status(404).json({ message: 'Sale not found' });
        }

        const { product, quantity } = saleResults[0];

        db.query('UPDATE products SET stock = stock + ?, qte_sold = qte_sold - ? WHERE id = ?', [quantity, quantity, product], (err) => {
            if (err) {
                console.error('Database error (update stock and qte_sold):', err);
                return res.status(500).json({ message: 'Database error while updating stock and qte_sold' });
            }

            db.query('DELETE FROM sales WHERE id = ?', [saleId], (err) => {
                if (err) {
                    console.error('Database error (delete sale):', err);
                    return res.status(500).json({ message: 'Database error while deleting sale' });
                }

                res.json({ message: 'Sale deleted, stock and sold quantity restored successfully' });
            });
        });
    });
});



router.put('/updateSale/:id', authToken, (req, res) => {
    const saleId = req.params.id;
    const { customer, product, quantity, total_price } = req.body;

    db.query('SELECT quantity FROM sales WHERE id = ?', [saleId], (err, saleResults) => {
        if (err) {
            console.error('Database error (fetch sale):', err);
            return res.status(500).json({ message: 'Database error while fetching sale' });
        }

        if (saleResults.length === 0) {
            return res.status(404).json({ message: 'Sale not found' });
        }

        const oldQuantity = saleResults[0].quantity;

        db.query('SELECT stock, qte_sold FROM products WHERE id = ?', [product], (err, productResults) => {
            if (err) {
                console.error('Database error (fetch product stock):', err);
                return res.status(500).json({ message: 'Database error while fetching product stock' });
            }

            if (productResults.length === 0) {
                return res.status(404).json({ message: 'Product not found' });
            }

            const availableStock = productResults[0].stock;
            const oldQteSold = productResults[0].qte_sold;
            const newQuantityDifference = quantity - oldQuantity;


            if (newQuantityDifference > availableStock) {
                return res.status(400).json({ message: 'Insufficient stock for the requested quantity' });
            }


            db.query('UPDATE sales SET customer = ?, product = ?, quantity = ?, total_price = ? WHERE id = ?', [customer, product, quantity, total_price, saleId], (err, results) => {
                if (err) {
                    console.error('Database error (update sale):', err);
                    return res.status(500).json({ message: 'Database error while updating sale' });
                }

                if (results.affectedRows === 0) {
                    return res.status(404).json({ message: 'Sale not found' });
                }


                const stockAdjustment = newQuantityDifference;
                const qteSoldAdjustment = newQuantityDifference;

                db.query('UPDATE products SET stock = stock - ?, qte_sold = qte_sold + ? WHERE id = ?', [stockAdjustment, qteSoldAdjustment, product], (err) => {
                    if (err) {
                        console.error('Database error (update stock and qte_sold):', err);
                        return res.status(500).json({ message: 'Database error while updating stock and qte_sold' });
                    }

                    res.json({ message: 'Sale updated, stock and sold quantity adjusted successfully' });
                });
            });
        });
    });
});

router.get('/fetchTopCustomers', authToken, (req, res) => {
    let query = `SELECT 
    customers.id AS customer_id,
    customers.name AS customer_name,
    COUNT(sales.id) AS total_sales
FROM sales
LEFT JOIN customers ON sales.customer = customers.id
GROUP BY customers.id, customers.name
ORDER BY total_sales DESC
LIMIT 10`;

    db.query(query, (err, results) => {
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



export default router;
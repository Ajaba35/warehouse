import express from "express";
import db from "../db.js";
import authToken from "../middleware/authToken.js";

const router = express.Router();


router.post('/addPurchase', authToken, (req, res) => {
    const { code, supplier, product, quantity, unit_price, total_price } = req.body;

    db.query('INSERT INTO purchases SET ?', { code, supplier, product, quantity, unit_price, total_price }, (err, results) => {
        if (err) {
            console.error('Database error (insert purchase):', err);
            return res.status(500).json({ message: 'Database error on insert' });
        }

        db.query('UPDATE products SET stock = stock + ? WHERE id = ?', [quantity, product], (err, results) => {
            if (err) {
                console.error('Database error (update stock):', err);
                return res.status(500).json({ message: 'Database error on stock update' });
            }

            res.json({ message: 'Purchase added and stock updated successfully' });
        });
    });
});

router.get('/fetchPurchase', authToken, (req, res) => {
    const { supplierId, searchText } = req.query;
    let query = `
        SELECT 
            purchases.*, 
            suppliers.name AS supplier_name, 
            products.code AS product_code, 
            products.name AS product_name
        FROM purchases
        LEFT JOIN suppliers ON purchases.supplier = suppliers.id
        LEFT JOIN products ON purchases.product = products.id
        
    `;

    let queryParams = [];

    if (supplierId) {
        query += ' WHERE purchases.supplier = ?';
        queryParams.push(supplierId);
    }
    if (searchText) {
        query += supplierId ? ' AND purchases.code LIKE ?' : ' WHERE purchases.code LIKE ?';
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

router.delete('/deletePurchase/:id', authToken, (req, res) => {
    const purchaseId = req.params.id;

    db.query('SELECT product, quantity FROM purchases WHERE id = ?', [purchaseId], (err, results) => {
        if (err) {
            console.error('Database error (fetch purchase):', err);
            return res.status(500).json({ message: 'Database error fetching purchase' });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'Purchase not found' });
        }

        const { product, quantity } = results[0];

        db.query('UPDATE products SET stock = stock - ? WHERE id = ?', [quantity, product], (err, results) => {
            if (err) {
                console.error('Database error (update stock):', err);
                return res.status(500).json({ message: 'Database error updating stock' });
            }

            db.query('DELETE FROM purchases WHERE id = ?', [purchaseId], (err, results) => {
                if (err) {
                    console.error('Database error (delete purchase):', err);
                    return res.status(500).json({ message: 'Database error deleting purchase' });
                }

                res.json({ message: 'Purchase deleted and stock updated successfully' });
            });
        });
    });
});

router.put('/updatePurchase/:id', authToken, (req, res) => {
    const purchaseId = req.params.id;
    const { supplier, product, quantity, unit_price, total_price } = req.body;

    db.query('SELECT product, quantity FROM purchases WHERE id = ?', [purchaseId], (err, results) => {
        if (err) {
            console.error('Database error (fetch old purchase):', err);
            return res.status(500).json({ message: 'Database error fetching old purchase' });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'Purchase not found' });
        }

        const oldProduct = results[0].product;
        const oldQuantity = results[0].quantity;


        const updateStockTasks = [];

        if (oldProduct === product) {

            updateStockTasks.push(
                new Promise((resolve, reject) => {
                    db.query(
                        'UPDATE products SET stock = stock - ? + ? WHERE id = ?',
                        [oldQuantity, quantity, product],
                        (err) => (err ? reject(err) : resolve())
                    );
                })
            );
        } else {

            updateStockTasks.push(
                new Promise((resolve, reject) => {
                    db.query(
                        'UPDATE products SET stock = stock - ? WHERE id = ?',
                        [oldQuantity, oldProduct],
                        (err) => (err ? reject(err) : resolve())
                    );
                })
            );
            updateStockTasks.push(
                new Promise((resolve, reject) => {
                    db.query(
                        'UPDATE products SET stock = stock + ? WHERE id = ?',
                        [quantity, product],
                        (err) => (err ? reject(err) : resolve())
                    );
                })
            );
        }

        Promise.all(updateStockTasks)
            .then(() => {

                db.query(
                    'UPDATE purchases SET supplier = ?, product = ?, quantity = ?, unit_price = ?, total_price = ? WHERE id = ?',
                    [supplier, product, quantity, unit_price, total_price, purchaseId],
                    (err, results) => {
                        if (err) {
                            console.error('Database error (update purchase):', err);
                            return res.status(500).json({ message: 'Database error updating purchase' });
                        }
                        res.json({ message: 'Purchase updated and stock adjusted successfully' });
                    }
                );
            })
            .catch((err) => {
                console.error('Database error (stock adjustment):', err);
                res.status(500).json({ message: 'Database error adjusting stock' });
            });
    });
});

export default router;
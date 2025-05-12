import express from "express";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';
import db from "../db.js";
import authToken from "../middleware/authToken.js";


const router = express.Router();


router.post("/login", (req, res) => {
    const { email, password } = req.body;

    db.query("SELECT * FROM users WHERE email = ?", [email], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: "Database error" });
        }

        if (results.length === 0) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const user = results[0];

        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) {
                console.error('Bcrypt error:', err);
                return res.status(500).json({ message: 'Error comparing passwords' });
            }

            if (!isMatch) {
                return res.status(400).json({ message: "Invalid email or password" });
            }

            const payload = { id: user.id };
            const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

            res.json({ message: "Login successful", token });
        });
    });
});


router.get('/me', authToken, (req, res) => {
    const userId = req.user.id;

    db.query('SELECT id, fullname, email, password, role FROM users WHERE id = ?', [userId], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: 'Database error' });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(results[0]);
    });
});

router.put('/updateMe', authToken, (req, res) => {
    const userId = req.user.id;
    const { fullname, email, password } = req.body;

    db.query('SELECT password FROM users WHERE id = ?', [userId], async (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: 'Database error' });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        const currentHashedPassword = results[0].password;

        let query = 'UPDATE users SET fullname = ?, email = ?';
        const values = [fullname, email];

        if (password && password.trim() !== '') {
            const isSame = await bcrypt.compare(password, currentHashedPassword);
            if (!isSame) {
                const newHashedPassword = await bcrypt.hash(password, 10);
                query += ', password = ?';
                values.push(newHashedPassword);
            }
        }
        query += ' WHERE id = ?';
        values.push(userId);

        db.query(query, values, (err, updateResults) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ message: 'Database error' });
            }

            if (updateResults.affectedRows === 0) {
                return res.status(404).json({ message: 'User not found' });
            }

            res.json({ message: 'Updated successfully' });
        });
    });
});



router.get('/fetchUser', authToken, (req, res) => {
    const currentUserId = req.user.id; // Assuming the user's ID is stored in req.user.id

    db.query('SELECT * FROM users WHERE id != ?', [currentUserId], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: 'Database error' });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'No user found' });
        }
        res.json(results);
    });
});

router.delete('/deleteUser/:id', authToken, (req, res) => {
    const  userId  = req.params.id;
    db.query('DELETE FROM users WHERE id = ?', [userId], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: 'Database error' });
        }
        if(results.affectedRows === 0) {
                return res.status(404).json({ message: 'User not found' });
        }
        res.json({message: 'User deleted successfully'})
    })
})


router.put('/updateUser/:id', authToken, (req, res) => {
    const userId = req.params.id;
    const { fullname, email, password, role } = req.body;

    db.query('SELECT password FROM users WHERE id = ?', [userId], async (err, results) => {
        if (err) return res.status(500).json({ message: 'Database error' });
        if (results.length === 0) return res.status(404).json({ message: 'User not found' });

        const currentHashedPassword = results[0].password;
        let query = 'UPDATE users SET fullname = ?, email = ?, role = ?';
        const values = [fullname, email, role];


        if (password && password.trim() !== '') {
            const isSame = await bcrypt.compare(password, currentHashedPassword);
            if (!isSame) {
                const newHashed = await bcrypt.hash(password, 10);
                query += ', password = ?';
                values.push(newHashed);
            }
        }

        query += ' WHERE id = ?';
        values.push(userId);

        db.query(query, values, (err, updateResults) => {
            if (err) return res.status(500).json({ message: 'Database error' });
            if (updateResults.affectedRows === 0) return res.status(404).json({ message: 'User not found' });

            res.json({ message: 'User updated successfully' });
        });
    });
});





router.post('/addUser', authToken, async (req, res) => {
    const { fullname, email, password, role } = req.body;

    try {
        db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
            if (err) {
                console.error('Database error during email check:', err);
                return res.status(500).json({ message: 'Database error during email check' });
            }

            if (results.length > 0) {
                return res.status(400).json({ message: 'Email already exists' });
            }

            db.query('SELECT * FROM users WHERE fullname = ?', [fullname], (err, results) => {
                if (err) {
                    console.error('Database error during fullname check:', err);
                    return res.status(500).json({ message: 'Database error during fullname check' });
                }

                if (results.length > 0) {
                    return res.status(400).json({ message: 'Fullname already exists' });
                }

                const saltRounds = 10;
                bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
                    if (err) {
                        console.error('Error hashing password:', err);
                        return res.status(500).json({ message: 'Server error during password hashing' });
                    }

                    const user = { fullname, email, password: hashedPassword, role };

                    db.query('INSERT INTO users SET ?', user, (err, results) => {
                        if (err) {
                            console.error('Database error during insert:', err);
                            return res.status(500).json({ message: 'Database error' });
                        }

                        res.json({ message: 'User added successfully' });
                    });
                });
            });
        });
    } catch (err) {
        console.error('Server error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});





export default router;
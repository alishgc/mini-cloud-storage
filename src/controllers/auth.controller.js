const bcrypt = require("bcrypt");
const pool = require("../config/db");

const jwt = require("jsonwebtoken");

const register = async (req, res) => {
    const { name, email, password } = req.body;
    const normalizedEmail = email?.trim().toLowerCase();

    if (!name || !email || !password) {
        return res.status(400).json({
            message: "Name, email, password are required"
        });
    }

    try {
        
        const existingUser = await pool.query(
            `SELECT id
             FROM users
             WHERE email = $1`,
            [normalizedEmail]
        );
    
        if (existingUser.rows.length > 0) {
            return res.status(409).json({
                message: "Email is already registered"
            })
        }
    
        const passwordHash = await bcrypt.hash(password, 10);
    
        const result = await pool.query(
            `INSERT INTO users (name, email, password_hash)
             VALUES ($1, $2, $3)
             RETURNING id, name, email, created_at`,
            [name.trim(), normalizedEmail, passwordHash]
        );

        res.status(201).json({
            message: "User registered successfully",
            user: result.rows[0]
        });
    } catch (error) {
        console.error("Registration failed:", error.message);
        res.status(500).json({
            message: "Registertion failed"
        });
    }


};

const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(404).json({
            message: "Email and password are required"
        });
    }

    const normalizedEmail = email.trim().toLowerCase();

    try {
        
        const result = await pool.query(
            `SELECT * FROM users WHERE email = $1`, [normalizedEmail]
        );
    
        if (result.rows.length === 0) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }
    
        const user = result.rows[0];
    
        const passwordMatch = await bcrypt.compare(password, user.password_hash);
    
        if (!passwordMatch) {
            return res.status(401).json({
                  message: "Invalid email or password"
            });
        }

        const token = jwt.sign(
            {
                userId: user.id
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1h"
            }
        );
    
        res.json({
                message: "Login successful",
                token,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email
                }
        });
    } catch (error) {
        console.error("Login failed:", error.message);

        res.status(500).json({
            message: "Login failed"
        });
    }


};

const getCurrentUser = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT id, name, email, created_at
             FROM users
             WHERE id = $1`,
            [req.user.userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.json({
            user: result.rows[0]
        });
    } catch (error) {
        console.error("Failed to fetch user:", error.message);

        res.status(500).json({
            message: "Failed to fetch user"
        });
    }
};

module.exports = { register, login, getCurrentUser};
const pool = require("../config/db");
const path = require("path");

const fs = require("fs/promises");

const fileUpload =  async (req, res) => {

    if (!req.file) {
        return res.status(400).json({
            message: "No file uploaded"
        });
    }

    const { originalname, filename, mimetype, size, path } = req.file;
    const userId = req.user.userId;

    try {
        const result = await pool.query(
            `INSERT INTO files (user_id, original_name, stored_name, mime_type, size)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *`, [userId, originalname, filename, mimetype, size]
        );
        res.status(201).json({
            message: "File uploaded successfully",
            file: result.rows[0]
        });

    } catch (error) {

        try {
            await fs.unlink(path);
        } catch (deleteError) {
            console.error("Failed to delete orphaned file:", deleteError.message);
        }

        console.error("Failed to save file metadata:", error.message);

        res.status(500).json({
            message: "File uploaded failed"
        });
    }
};


const getFiles = async (req, res) => {

    try {
        const result = await pool.query(
            `SELECT id, original_name, stored_name, mime_type, size, created_at
            FROM files
            WHERE user_id = $1
            ORDER BY created_at DESC` , [req.user.userId]   
        );
    
        res.json({
            files: result.rows
        });

    } catch (error) {
        console.error("Failed to fetch files:", error.message);

        res.status(500).json({
            message: "Failed to fetch files"
        });
    }

};


const getFile = async (req, res) => {
    const { id } = req.params;

    try {
        
        const result = await pool.query(
            `SELECT *
            FROM files
            WHERE id = $1
            AND user_id = $2`,
            [id, req.user.userId]
        );
    
        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "File not found"
            });
        }
    
        const file = result.rows[0];
    
        const filePath = path.resolve(
            path.join("uploads", file.stored_name)
        );

        try {
            await fs.access(filePath);
        } catch (error) {
            return res.status(404).json({
                message: "File is missing from storage"
            });
        }
    
        res.sendFile(filePath);

    } catch (error) {
        console.error("Failed to retrieve file:", error.message);

        res.status(500).json({
            message: "Failed to retrive file"
        });
    }


};


const deleteFile = async (req, res) => {
    const { id } = req.params;

    try {
        
        const result = await pool.query(`
            SELECT stored_name
            FROM files
            WHERE id = $1
            `, [id]
        );
    
        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "File not found"
            });
        }
    
        const storedName = result.rows[0].stored_name;
        const filePath = path.resolve(
            path.join("uploads", storedName)
        );

        try {
            await fs.unlink(filePath);
        } catch (error) {
            if (error.code !== "ENOENT") {
                throw error;
            }
        }
    
        await pool.query(
            `DELETE FROM files
            WHERE id = $1
            AND user_id = $2`,
            [id, req.user.userId]
        );
    
        res.json({
            message: "File deleted successfully"
        });
    } catch (error) {
        console.error("Failed to delete file:", error.message);

        res.status(500).json({
            message: "Failed to delete file"
        });
    }

};

module.exports = { fileUpload, getFiles, getFile, deleteFile };
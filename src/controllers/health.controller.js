const pool = require("../config/db");

function healthCheck(req, res) {
    pool.query("SELECT NOW()")
        .then((result) => {
            res.json({
                status: "ok",
                database: "connected",
                time: result.rows[0].now
            });
        })
        .catch((error) => {
            console.error("Database health check failed:", error.message);

            res.status(500).json({
                status: "error",
                database: "disconnected"
            });
        });
}

module.exports = { healthCheck };
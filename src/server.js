require("dotenv").config();

const app = require("./app");
const pool = require("./config/db");

const PORT = process.env.PORT || 3000;

pool.query("SELECT NOW()")
    .then(() => {
        console.log("PostgreSQL connected");

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error("PostgreSQL connection failed:", error.message);
    });

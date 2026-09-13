const express = require("express");

const healthRoutes = require("./routes/health.routes");
const fileRoutes = require("./routes/file.routes");
const authRoutes = require("../src/routes/auth.routes"); 
const errorHandler = require("./middleware/error.middleware");

const app = express();

app.use(express.json());

app.use("/api/health", healthRoutes);
app.use("/api/files", fileRoutes);
app.use("/api/auth", authRoutes);

app.use(errorHandler);

module.exports = app;
const express = require("express");
const upload = require("../config/upload");
const { fileUpload, getFiles, getFile, deleteFile } = require("../controllers/file.controller");
const uploadSingleFile = require("../middleware/upload.middleware");
const authenticateToken = require("../middleware/auth.middleware");

const router = express.Router();

router.post("/upload", authenticateToken, uploadSingleFile, fileUpload);

router.get("/", authenticateToken, getFiles);

router.get("/:id", authenticateToken, getFile);

router.delete("/:id", authenticateToken, deleteFile);


module.exports = router;
const express = require("express");
const upload = require("../config/upload");
const { fileUpload, getFiles, getFile, deleteFile } = require("../controllers/file.controller");
const uploadSingleFile = require("../middleware/upload.middleware");

const router = express.Router();

router.post("/upload", uploadSingleFile, fileUpload);

router.get("/", getFiles);

router.get("/:id", getFile);

router.delete("/:id", deleteFile);


module.exports = router;
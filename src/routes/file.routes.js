const express = require("express");
const upload = require("../config/upload");
const { fileUpload, getFiles, getFile, deleteFile } = require("../controllers/file.controller");

const router = express.Router();

router.post("/upload", upload.single("file"), fileUpload);

router.get("/", getFiles);

router.get("/:id", getFile);

router.delete("/:id", deleteFile);


module.exports = router;
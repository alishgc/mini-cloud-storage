const upload = require("../config/upload")

const uploadSingleFile = (req, res, next) => {
    upload.single("file")(req, res, (error) => {
        if (error) {
            if (error.code === "LIMIT_FILE_SIZE") {
                return res.status(400).json({
                    message: "File size must not exceed 5 MB"
                });
            }

            return res.status(400).json({
                message: "File upload failed"
            });
        }

        next();
    });
};

module.exports = uploadSingleFile;
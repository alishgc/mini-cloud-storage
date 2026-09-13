const errorHandler = (error, req, res, next) => {
    console.error(error);

    const statusCode = error.statusCode || 500;

    res.status(statusCode).json({
        message: statusCode === 500
            ? "Internal Server Error"
            : error.message
    });
};

module.exports = errorHandler;
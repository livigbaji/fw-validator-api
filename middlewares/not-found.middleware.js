
module.exports = (req, res) => res.status(404).errorMessage(
    `cannot ${req.method} ${req.originalUrl}`
);
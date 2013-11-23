/**
 * Adds headers to the response to prevent clients from caching the response.
 */
module.exports = function (req, res, next) {
    res.header('Cache-Control', 'no-cache');
    res.header('Expires', '0');
    next();
};
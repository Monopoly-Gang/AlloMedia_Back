// Response handler utility
 const sendResponse = (res, statusCode, data = null, error = null) => {
    if (error) {
        return res.status(statusCode).json({ error });
    }
    if (statusCode === 204) {
        return res.status(204).send();
    }
    return res.status(statusCode).json(data);
};

module.exports = { sendResponse };
exports.success = (res, data = false) => {
    res.set('X-XSS-Protection', '1');
    res.status(data.status || 200).json({
        success: true,
        data: data.data || {},
        count: data.count || 0,
        message: data.message || "data sent"
    });
};

exports.badRequest = (res, data = false) => {
    res.set('X-XSS-Protection', '1');
    res.status(data.status || 400).json({
        success: false,
        data: data.data || {},
        message: data.message || "Bad Request",
    });
};
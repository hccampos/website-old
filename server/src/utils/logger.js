var log = function (msg) {
    console.log(msg);
};

var logIfDev = function (msg) {
    var env = process.env.NODE_ENV || 'development';
    if (env === 'development') { log(msg); }
};

var logErrorAndNext = function (msg, error, next) {
    log(msg);
    return next(error);
};

exports.log = log;
exports.logIfDev = logIfDev;
exports.logErrorAndNext = logErrorAndNext;
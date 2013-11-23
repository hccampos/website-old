var sanitizer = require('sanitizer');
var sanitize = require('validator').sanitize;

exports.trim = function (str, chars) {
    if (str === null || str === undefined) { return str; }
    return sanitize(str).trim(chars);
};

exports.ltrim = function (str, chars) {
    if (str === null || str === undefined) { return str; }
    return sanitize(str).ltrim(chars);
};

exports.rtrim = function (str, chars) {
    if (str === null || str === undefined) { return str; }
    return sanitize(str).rtrim(chars);
};

exports.isNull = function (str, replace) {
    if (str === null || str === undefined) { return str; }
    return sanitize(str).isNull(replace);
};

exports.toFloat = function (str) {
    if (str === null || str === undefined) { return str; }
    return sanitize(str).toFloat();
};

exports.toInt = function (str) {
    if (str === null || str === undefined) { return str; }
    return sanitize(str).toInt();
};

exports.toBoolean = function (str) {
    if (str === null || str === undefined) { return str; }
    return sanitize(str).toBoolean();
};

exports.toBooleanStrict = function (str) {
    if (str === null || str === undefined) { return str; }
    return sanitize(str).toBooleanStrict();
};

exports.entityDecode = function (str) {
    if (str === null || str === undefined) { return str; }
    return sanitize(str).entityDecode();
};

exports.entityEncode = function (str) {
    if (str === null || str === undefined) { return str; }
    return sanitize(str).entityEncode();
};

exports.escapeEntities = function (str) {
    if (str === null || str === undefined) { return str; }
    return sanitizer.escape(str);
};

exports.unescapeEntities = function (str) {
    if (str === null || str === undefined) { return str; }
    return sanitizer.unescapeEntities(str);
};

exports.sanitize = function (str) {
    if (str === null || str === undefined) { return str; }
    return sanitizer.sanitize(str);
};
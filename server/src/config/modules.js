var injector = require('../utils/injector');

module.exports = function (basePath, env) {
    injector.addModule('config', require(basePath + 'config/config')(env));
    injector.addModule('logger', require(basePath + 'utils/logger'));
    injector.addModule('sanitizer', require(basePath + 'utils/sanitizer'));
    injector.addModule('validator', require(basePath + 'utils/validator'));

    // We don't want to send e-mails while in the development or test environments so we use a mock.
    if (env === 'development') {
        injector.addModule('emailManager', require(basePath + 'mocks/email-manager-mock'));
    } else {
        injector.addModule('emailManager', require(basePath + 'utils/email-manager'));
    }

    injector.addModule('middleware.noCache', require(basePath + 'middleware/no-cache'));
};
var when = require('when');
var inject = require('./injector').inject;
var config = inject('config');
var logger = inject('logger');
var EmailError = inject('errors.EmailError');

var nodemailer = require('nodemailer');

var smtpTransport = nodemailer.createTransport('SMTP', {
    service: config.email.service,
    auth: {
        user: config.email.username,
        pass: config.email.password
    }
});

/**
 * Sends an e-mail using the provided options.
 *
 * @param {*} options
 *      The object which contains the options required to send the e-mail (subject, html
 *      content, text content, to, from, etc).
 * @param {function} callback
 *      The callback.
 *
 * @returns {Promise}
 */
exports.send = function (options, callback) {
    var deferred = when.defer();

    smtpTransport.sendMail(options, function (err) {
        if (err) {
            logger.log(err);
            return deferred.reject(new EmailError());
        }

        return deferred.resolve();
    });

    return deferred.promise;
};

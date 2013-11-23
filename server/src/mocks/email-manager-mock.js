var inject = require('./../utils/injector').inject;
var logger = inject('logger');

/**
 * Sends an e-mail using the provided options.
 *
 * @param {*} options
 *      The object which contains the options required to send the e-mail (subject, html
 *      content, text content, to, from, etc).
 * @param {function} callback
 *      The callback.
 *
 * @returns {*}
 */
exports.send = function (options, callback) {
    logger.log('\n//-------------- EMAIL --------------//\n');
    logger.log(options.to);

    if (options.html) {
        logger.log(options.html.replace(/<head\>((\s|\S)*?)<\/head\>/, ''));
    }

    if (callback) { callback(null, {}); }
};

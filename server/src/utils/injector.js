/**
 * @module injector
 */

var modulesMap = {};

/**
 * Adds a module to the injector.
 *
 * @param {string} moduleName
 *      The name of the module.
 * @param {*} module
 *      The module which is to be added to the injector.
 *
 * @memberOf injector
 */
exports.addModule = function (moduleName, module) {
    modulesMap[moduleName] = module;
};

/**
 * Injects a module from the injector.
 *
 * @param {string} moduleName
 *      The name of the module which is to be required.
 *
 * @returns {*}
 *      The module that was required.
 *
 * @memberOf injector
 */
exports.inject = function (moduleName) {
    if (modulesMap[moduleName] === undefined || modulesMap[moduleName] === null) {
        throw new Error('Module Manager: module ' + moduleName + ' could not be found.');
    }

    return modulesMap[moduleName];
};

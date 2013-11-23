/**
 * Contains all the global configurations.
 */

var _ = require('lodash');
var path = require('path');

var rootPath = path.normalize(__dirname + '/../../..');

//------------------------------------------------------------------------------------------------//
// Development
//------------------------------------------------------------------------------------------------//
var developmentConfig = {
    env: 'development',
    appName: 'hccampos-dev',
    baseUrl: 'http://localhost:5000',
    dirs: {
        root: rootPath,
        client: rootPath + '/client',
        staticFiles: rootPath + '/client/dist',
        templates: rootPath + '/server/src/templates'
    },
    api: {
        root: '/api',
        version: '1.0.0'
    },
    errorsToConsole: true,
    logPaths: true,
    maxResultsPerRequest: 100, // Maximum number of documents that can be returned in a request.
    defaultPageSize: 10,
    maxFeedbackLength: 3000
};

//------------------------------------------------------------------------------------------------//
// Production
//------------------------------------------------------------------------------------------------//
var productionConfig = {
    env: 'production',
    appName: 'hccampos',
    baseUrl: 'https://www.hccampos.com',
    logPaths: false
};

//------------------------------------------------------------------------------------------------//

module.exports = function (env) {
    if (env === 'development') { return developmentConfig; }
    return _.merge(developmentConfig, productionConfig);
};
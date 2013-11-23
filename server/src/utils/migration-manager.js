var _ = require('lodash');
var uuid = require('node-uuid');
var when = require('when');
var series = require('when/sequence');
var inject = require('./injector').inject;
var config = inject('config');
var logger = inject('logger');
var knex = inject('bookshelf').knex;

var initialVersion = '000';
var defaultDatabaseVersion = config.database.version;

function getDatabaseVersion() {
    return knex.schema.hasTable('settings').then(function (exists) {
        if (exists) {
            return knex('settings')
                .where('key', 'databaseVersion')
                .select('value')
                .then(function (response) {
                    if (!response || response.length === 0) { return initialVersion; }

                    var setting = response[0];
                    if (!setting) { return initialVersion; }

                    var databaseVersion = setting.value;
                    if (!databaseVersion || databaseVersion.length === 0) {
                        databaseVersion = initialVersion;
                    }

                    return databaseVersion;
                });
        }

        throw new Error('Settings table does not exist');
    });
}

function setDatabaseVersion(version) {
    version = version || defaultDatabaseVersion;

    return knex('settings')
        .where('key', 'databaseVersion')
        .select('value')
        .then(function (data) {
            if (!data || data.length === 0) { return when.reject(); }

            return knex('settings')
                .where('key', 'databaseVersion')
                .update({'value': version });
        })
        .otherwise(function () {
            return knex('settings').insert({
                uuid: uuid.v4(),
                key: 'databaseVersion',
                value: version
            });
        });
}

function getMigration(version) {
    return require(config.dirs.migrations + '/' + version);
}

module.exports = {
    getDatabaseVersion: getDatabaseVersion,

    /**
     * Initializes the database and performs migrations if necessary.
     *
     * @returns {*|Promise}
     */
    init: function () {
        var self = this;

        return getDatabaseVersion().then(function (databaseVersion) {
            if (databaseVersion === defaultDatabaseVersion) { return when.resolve(); }

            if (databaseVersion < defaultDatabaseVersion) {
                return self.migrateUpFromVersion(databaseVersion);
            }

            if (databaseVersion > defaultDatabaseVersion) {
                logger.log('The database is not compatible with the current version of stikr.');
                return process.exit(0);
            }

            return null;
        }, function (err) {
            if (err && err.message) { return self.migrateUpFromFreshDb(); }

            logger.log('There is a problem with the database');
            return process.exit(0);
        });
    },

    /**
     * Migrate down to nothing.
     *
     * @returns {*|Promise}
     */
    reset: function () {
        var self = this;

        return getDatabaseVersion().then(function (databaseVersion) {
            return self.migrateDownFromVersion(databaseVersion);
        }, function () {
            return self.migrateDownFromVersion(initialVersion);
        });
    },

    /**
     * Migrate up when there is not database.
     *
     * @returns {*|Promise}
     */
    migrateUpFromFreshDb: function () {
        var migration = getMigration(initialVersion);
        return migration.up().then(function () {
            return setDatabaseVersion(initialVersion);
        });
    },

    /**
     * Migrates up from the specified version.
     *
     * @param version
     * @param max
     *
     * @returns {*|Promise}
     */
    migrateUpFromVersion: function (version, max) {
        var versions = [];
        var maxVersion = max || this.getVersionAfter(defaultDatabaseVersion);
        var currentVersion = version;
        var tasks;

        while(currentVersion !== maxVersion) {
            versions.push(currentVersion);
            currentVersion = this.getVersionAfter(currentVersion);
        }

        tasks = _.map(versions, function (taskVersion) {
            return function () {
                try {
                    var migration = getMigration(taskVersion);
                    return migration.up();
                } catch (e) {
                    logger.log(e);
                    return when.reject(e);
                }
            };
        });

        return series(tasks).then(function () {
            return setDatabaseVersion();
        });
    },

    /**
     * Migrates down from the specified version.
     *
     * @param version
     *
     * @returns {*|Promise}
     */
    migrateDownFromVersion: function (version) {
        var self = this;
        var versions = [];
        var minVersion = this.getVersionBefore(initialVersion);
        var currentVersion = version;
        var tasks;

        while(currentVersion !== minVersion) {
            versions.push(currentVersion);
            currentVersion = this.getVersionBefore(currentVersion);
        }

        tasks = _.map(versions, function (taskVersion) {
            return function () {
                try {
                    var migration = getMigration(taskVersion);
                    return migration.down();
                } catch (e) {
                    logger.log(e);
                    return self.migrateDownFromVersion(initialVersion);
                }
            };
        });

        return series(tasks);
    },

    /**
     * Gets the database version after the specified version.
     *
     * @param currentVersion
     *
     * @returns {*|string}
     */
    getVersionAfter: function (currentVersion) {
        var currentVersionNumber = parseInt(currentVersion, 10);
        var nextVersion;

        if (isNaN(currentVersionNumber)) { currentVersionNumber = parseInt(initialVersion, 10); }

        currentVersionNumber += 1;

        nextVersion = String(currentVersionNumber);
        while(nextVersion.length < 3) {
            nextVersion = '0' + nextVersion;
        }

        return nextVersion;
    },

    /**
     * Gets the database version after the specified version.
     *
     * @param currentVersion
     *
     * @returns {*|string}
     */
    getVersionBefore: function (currentVersion) {
        var currentVersionNumber = parseInt(currentVersion, 10);
        var previousVersion;

        if (isNaN(currentVersionNumber)) { currentVersionNumber = parseInt(initialVersion, 10); }

        currentVersionNumber -= 1;

        previousVersion = String(currentVersionNumber);
        while (previousVersion.length < 3) {
            previousVersion = '0' + previousVersion;
        }

        return previousVersion;
    }
};
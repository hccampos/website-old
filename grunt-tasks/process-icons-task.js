var _ = require('lodash');
var async = require('async');
var fs = require('fs.extra');
var unzip = require('unzip');
var path = require('path');
var timers = require('timers');

var zipPath = './icomoon.zip';
var stylesDirInZip = '.';
var stylesFileName = 'style.css';
var fontsDirInZip = 'fonts';
var fontFileNames = [
    'icomoon.eot',
    'icomoon.svg',
    'icomoon.ttf',
    'icomoon.woff'
];

var stylesTempPath = './icon-styles-tmp.css';
var fontsOutputPath = './client/src/assets/fonts';
var scssOutputPath = './client/src/sass/_icomoon.scss';

var scssDefaultData = "" +
"@font-face {\n" +
"    font-family: 'icomoon';\n" +
"    src:url('/fonts/icomoon.eot');\n" +
"    src:url('/fonts/icomoon.eot?#iefix') format('embedded-opentype'),\n" +
"    url('/fonts/icomoon.ttf') format('truetype'),\n" +
"    url('/fonts/icomoon.woff') format('woff'),\n" +
"    url('/fonts/icomoon.svg#icomoon') format('svg');\n" +
"    font-weight: normal;\n" +
"    font-style: normal;\n" +
"}\n\n" +
".icomoon:before {\n" +
"    vertical-align: baseline;\n" +
"    text-transform: none;\n" +
"    font-weight: normal;\n" +
"    font-style: normal;\n" +
"    font-variant: normal;\n" +
"    font-family: 'icomoon';\n" +
"    line-height: 1em;\n" +
"    speak: none;\n" +
"    webkit-font-smoothing: antialiased;\n" +
"    -moz-osx-font-smoothing: grayscale;\n" +
"}\n";

module.exports = function (grunt) {
    grunt.registerTask('icons', 'Process icons.', function () {
        var taskDone = this.async();

        async.auto({
            'extract': function (callback) {
                var q = [];

                // Write a file to disk.
                var pipeToFile = function (readStream, path) {
                    var task = { done: false };

                    var writeStream = fs.createWriteStream(path, {flags: 'w'});
                    readStream.pipe(writeStream).on('close', function () {
                        task.done = true;
                    });

                    q.push(task);
                };

                var stream = fs.createReadStream(zipPath)
                    .pipe(unzip.Parse())
                    .on('entry', function (data) {
                        if (data.type !== 'File') { data.autodrain(); }

                        var dirName = path.dirname(data.path);
                        var fileName = path.basename(data.path);

                        if (dirName === stylesDirInZip && fileName === stylesFileName) {
                            pipeToFile(data, stylesTempPath);
                        } else if (dirName === fontsDirInZip && fontFileNames.indexOf(fileName) !== -1) {
                            pipeToFile(data, fontsOutputPath + '/' + fileName);
                        } else {
                            data.autodrain();
                        }
                    });

                stream.on('close', function () {
                    // Wait for all the files to be written to disk.
                    async.until(function () {
                        return _.every(q, function (task) { return task.done === true; });
                    }, function (callback) {
                        timers.setTimeout(callback, 10);
                    }, function (err) {
                        if (err) { return grunt.log.error(err); }
                        return callback();
                    })
                });
            },
            'loadCss': ['extract', function (callback) {
                fs.readFile(stylesTempPath, 'utf8', callback);
            }],
            'processCss': ['loadCss', function (callback, results) {
                var css = results.loadCss;

                var scssFileData = scssDefaultData;
                var match;

                // Get all the icons and generate the data which is to be written to the SCSS file.
                var regex = new RegExp(/\.icon-([\w\-]+)\:before\s*\{\s*content\:\s*\"\\(\w+)\"\s*\;\s*\}/gm);
                while(match = regex.exec(css)) {
                    var iconName = match[1];
                    var iconContent = match[2];

                    var scssIconVar = '$icon-' + iconName;
                    scssFileData += '\n' + scssIconVar + ': "\\' + iconContent + '";\n';
                    scssFileData += '.icon-' + iconName + ':before { content: ' + scssIconVar + '; }\n';
                }

                // Write the SCSS data to the corresponding output file.
                fs.writeFile(scssOutputPath, scssFileData, { flag: 'w' }, callback);
            }],
            'removeZip': ['extract', function (callback) {
                fs.unlink(zipPath, callback);
            }],
            'removeCss': ['loadCss', function (callback) {
                fs.unlink(stylesTempPath, callback);
            }]
        }, function () {
            taskDone();
        });
    });
};
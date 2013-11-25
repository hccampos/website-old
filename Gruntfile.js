var path = require('path');
var _ = require('lodash');

module.exports = function (grunt) {
    grunt.loadNpmTasks('grunt-preprocess');
    grunt.loadNpmTasks('grunt-env');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-sass');

    require('./grunt-tasks/process-icons-task')(grunt);

    // Default task.
    grunt.registerTask('default', ['build']);

    // Cleans and builds everything.
    grunt.registerTask('build', [
        'env:dev',
        'clean:all',
        'sass:build',
        'concat',
        'copy',
        'preprocess:dev'
    ]);

    // Cleans everything, builds everything and runs all tests to prepare the app for release.
    grunt.registerTask('release', [
        'env:prod',
        'clean:all',
        'sass:min',
        'uglify',
        'copy',
        'preprocess:prod'
    ]);

    // Task used to deploy the app to heroku.
    grunt.registerTask('heroku', ['release']);

    // Print a timestamp (useful for when watching)
    grunt.registerTask('timestamp', function () {
        grunt.log.subhead(new Date());
    });

    var clientPath = 'client';
    var vendorPath = clientPath + '/vendor';
    var sassPath = clientPath + '/src/sass';
    var serverPath = 'server';

    // Project configuration.
    grunt.initConfig({
        distDir: clientPath + '/dist',
        pkg: grunt.file.readJSON('package.json'),
        banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n' +
            '<%= pkg.homepage ? " * " + pkg.homepage + "\\n" : "" %>' +
            ' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author %>\n */\n\n',
        src: {
            client: {
                js: [clientPath + '/src/**/*.js'],
                html: [clientPath + '/src/index.html'],
                vendor: [
                    //vendorPath + '/lodash.js',
                    //vendorPath + '/underscore.string.js',
                    vendorPath + '/jquery.js',
                    //vendorPath + '/backbone.js',
                    //vendorPath + '/jquery.fittext.js',
                    //vendorPath + '/moment.js',
                    //vendorPath + '/spin.js',
                    vendorPath + '//sly.js'
                ],
                sassDir: sassPath,
                sass: [sassPath + '/**/*.scss'],
                assetsDir: clientPath + '/src/assets'
            },
            server: {
                js: [serverPath + '/src/**/*.js']
            }
        },
        clean: {
            all: ['<%= distDir %>/*']
        },
        env : {
            dev: { NODE_ENV : 'development' },
            prod : { NODE_ENV : 'production' }
        },
        concat: {
            options: { banner: "<%= banner %>" },
            dist: {
                src: ['<%= src.client.vendor %>', '<%= src.client.js %>'],
                dest: '<%= distDir %>/<%= pkg.name %>.js'
            }
        },
        copy: {
            assets: {
                files: [{
                    dest: '<%= distDir %>',
                    src: '**',
                    expand: true,
                    cwd: '<%= src.client.assetsDir %>/'
                }]
            },
            vendor: {
                files: [{
                    dest: '<%= distDir %>/vendor',
                    src: '**',
                    expand: true,
                    cwd: clientPath + '/vendor/'
                }]
            },
            index: {
                files: [{
                    dest: '<%= distDir %>',
                    src: 'index.html',
                    expand: true,
                    cwd: clientPath + '/src/'
                }]
            }
        },
        preprocess : {
            dev : {
                src: '<%= distDir %>/index.html',
                dest: '<%= distDir %>/index.html'
            },
            prod : {
                src: '<%= distDir %>/index.html',
                dest: '<%= distDir %>/index.html'
            }
        },
        uglify: {
            dist: {
                options: { banner: "<%= banner %>" },
                src: ['<%= src.client.vendor %>', '<%= src.client.js %>'],
                dest: '<%= distDir %>/<%= pkg.name %>.js'
            }
        },
        sass: {
            build: {
                options: { outputStyle: 'nested' },
                files: { '<%= distDir %>/main.css': '<%= src.client.sassDir %>/main.scss' }
            },
            min: {
                options: { outputStyle: 'compressed' },
                files: { '<%= distDir %>/main.css': '<%= src.client.sassDir %>/main.scss'}
            }
        },
        watch: {
            all: {
                files: [
                    '<%= src.client.js %>',
                    '<%= src.client.vendor %>',
                    '<%= src.client.html %>',
                    '<%= src.client.sass %>'
                ],
                tasks: ['build'],
                options: { livereload: true }
            }
        }
    });

};
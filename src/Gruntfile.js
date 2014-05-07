"use strict";

module.exports = function(grunt) {

    // Module Requires
    // --------------------------
    require("load-grunt-tasks")(grunt);
    require("time-grunt")(grunt);


    // Init Config
    // --------------------------

    var appConfig = {

        // Dirs
        dirs: {
            // PATHS SRC
            js: "assets/js",
            sass: "assets/sass",
            img: "assets/images",

            // FRAMEWORK PATHS
            base: '../FRAMEWORK',
            controller: '../FRAMEWORK/app/Controllers',
            model: '../FRAMEWORK/app/Models',
            views: '../FRAMEWORK/app/Views',
            lib: '..//FRAMEWORK/app/Lib',
            // ASSETS FRAMEWORK
            css: "../FRAMEWORK/app/webroot/css",
            jsfinal: "../FRAMEWORK/app/webroot/js",
            imgdest: "../FRAMEWORK/app/webroot/img"
        },

        except: [
            "Thumbs.db",
            ".git",
            ".gitignore",
            ".sftp-config.json"
        ]

        // Metadata
        pkg: grunt.file.readJSON("package.json"),
        banner:
        "\n" +
        "/*\n" +
        " * -------------------------------------------------------\n" +
        " * Project: <%= pkg.title %>\n" +
        " * Version: <%= pkg.version %>\n" +
        " * Author:  <%= pkg.author.name %> (<%= pkg.author.email %>)\n" +
        " *\n" +
        " * Copyright (c) <%= grunt.template.today(\"yyyy\") %> <%= pkg.title %>\n" +
        " * -------------------------------------------------------\n" +
        " */\n" +
        "\n",


        // Watch Task
        watch: {
            options: {
                livereload: true,
                spawn: false
            },
            css: {
                files: "<%= dirs.sass %>/**",
                tasks: ["compass","autoprefixer"],
                options: {
                    spawn: false
                }
            },
            js: {
                files: "<%= jshint.all %>",
                tasks: ["jshint", "uglify"]
            },

            files: [
                '<%= dirs.lib %>/{*,}*.php',
                '<%= dirs.controller %>/{*,}*.php',
                '<%= dirs.model %>/{*,}*.php',
                '<%= dirs.views %>/**/{*,}*.phtml'
            ]
        },

        // Linting
        jshint: {
            options: {
                jshintrc: ".jshintrc"
            },
            all: [
                "Gruntfile.js",
                "<%= dirs.js %>/main.js"
            ]
        },

        // Minifica e concatena
        uglify: {
            options: {
                mangle: false,
                banner: "<%= banner %>"
            },
            dist: {
                files: {
                    // Seu script do projeto
                    "<%= dirs.jsfinal %>/site.min.js": ["<%= dirs.js %>/main.js","<%= dirs.js %>/legacy/*"],
                    "<%= dirs.jsfinal %>/bootstrap.min.js": ["<%= dirs.js %>/bootstrap/**/*.js"]
                    // CSS para concatenar                   
                }
            }
        },

        // Compile Sass/Scss to CSS
        compass: {
            dist: {
                options: {
                    force: true,
                    config: "config.rb",
                }
            }
        },


        // Prefixo automático para css cross browser
        autoprefixer: {
            options: {
                browsers: ['last 5 version']
            },

            single_file: {
                src: '<%= dirs.css %>style.css',
                dest: '<%= dirs.css %>style.css'
            }

        },


        // Otimiza as imagens utilizando o Imagemagick
        shell: {
            imagemagick: {
                command: 'mogrify -strip -interlace Plane -quality 70 <%= dirs.imgdest %>/*.{jpg,png,gif}'
            }
        },

        // FTP Deploy
        ftpush: {
            build: {
                auth: {
                    host: "host",
                    port: 21,
                    authKey: "key1"
                },
                src: "../FRAMEWORK/",
                dest: "/public_html/paginas/testdeploy",
                simple: false,
                exclusions: "<%= except %>"
            }
        },

        // Rsync Deploy
        rsync: {
            options: {
                args: ["--verbose"],
                exclusions: "<%= except %>",
                recursive: true,
                syncDest: true
            },
            staging: {
                options: {
                    src: "../FRAMEWORK/",
                    dest: "/path/server",
                    host: "user@host.com",
                }
            },
            production: {
                options: {
                    src: "../FRAMEWORK/",
                    dest: "/path/server",
                    host: "user@host.com",
                }
            }
        }
    };

    grunt.initConfig(appConfig);


    // Register tasks
    // --------------------------

    // Start server and watch for changes
    grunt.registerTask("default", ["watch"]);

     // Run build
    grunt.registerTask("runserver", ["connect", "watch"]);

    // Run build
    grunt.registerTask("build", ["jshint", "uglify", "compass"]);

    // Optimize Images
    grunt.registerTask("optimize", ["shell:imagemagick"]);

    // Deploy Methods
    grunt.registerTask("ftp", ["build", "optimize", "ftpush"]);
    grunt.registerTask("rsync", ["build", "optimize", "rsync"]);

    // Aliases Tasks
    grunt.registerTask("rs", ["runserver"]);
    grunt.registerTask("b",  ["build"]);
    grunt.registerTask("o",  ["optimize"]);
    grunt.registerTask("f",  ["ftp"]);
    grunt.registerTask("r",  ["rsync"]);

};
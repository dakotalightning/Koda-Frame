module.exports = function(grunt) {

    require('jit-grunt')(grunt);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        clean: {
            css: ['style/*'],
            scripts: ['scripts/*.js','scripts/*.js']
        },
        compass: {
            css: {
                options: {
                    require: 'susy',
                    config: 'config.rb'
                }
            }
        },
        cssc: {
            clean: {
                options: {
                    sortSelectors: true,
                    consolidateViaDeclarations: false,
                    consolidateViaSelectors:    false,
                    consolidateMediaQueries:    false
                },
                files: {
                    'style/_style.clean.css': 'style/style.css',
                }
            },
            consolidate: {
                files: {
                    'style/_style.consolidate.css': 'style/_style.clean.css',
                }
            }
        },
        cssmin: {
            build: {
                src: 'style/style.css',
                dest: 'style/style.min.css'
            }
        },

        // ========================================
        // scripts
        // ========================================
        react: {
            single_file_output: {
                files: {
                    'scripts/main.js': 'jsx/main.jsx'
                }
            }
        },
        jshint: {
            files: ['gruntfile.js', '<%= concat.scripts.src %>'],
            options: {
                globals: {
                    jQuery: true,
                    console: true,
                    module: true
                }
            }
        },
        concat: {
            options: {
                separator: ';'
            },
            scripts: {
                src: ['scripts/main.js'],
                dest: 'scripts/concat/app.concat.js'
            }
        },
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' + '<%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            build: {
                files: {
                    'scripts/app.min.js' : ['<%= concat.scripts.dest %>']
                }
            }
        },
        watch: {
            options: {
                livereload: true
            },
            sass: {
                files: ['sass/**/**/*.scss'],
                tasks: ['compass', 'cssc', 'cssmin']
            },
            js: {
                files: ['jsx/*.jsx'],
                tasks: ['react', 'concat', 'uglify']
            },
            watch: {
                files: ['<%= jshint.files %>'],
                tasks: ['jshint']
            }
        },
        concurrent: {
            first: {
                tasks: ['js']
            },
            second: {
                tasks: ['css']
            }
        },
    });

    grunt.registerTask('default', ['js']);

    grunt.registerTask('js', ['clean:scripts', 'react', 'jshint', 'concat', 'uglify']);
    grunt.registerTask('css', ['clean:css', 'compass', 'cssc', 'cssmin']);
};

module.exports = function(grunt) {
    // 1. All configuration goes here
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        concat: {
            dist: {
                src: [
                    'app/lib/angular/angular.js',
                    'app/lib/jquery.js',
                    'app/lib/d3.v3.js',
                    'app/lib/angular-local-storage.js',
                    'app/angular/angular-route.js',
                    'app/lib/underscore.js',
                    'app/lib/nvd3/nv.d3.js',
                    'app/js/app.js',
                ],
                dest: 'app/build/js/production.js',
            }
        },

        autoprefixer: {
          options: {
            browsers: ['last 2 version']
          },
          multiple_files: {
            expand: true,
            flatten: true,
            src: 'app/css/build/production.min.css',
            dest: 'app/build/production.min.prefixed.css'
          }
        },

        cssmin: {
          combine: {
            files: {
              'app/build/css/build.min.css': ['app/css/vendor/*.css', 'app/css/*.css']
            }
          }
        },

        jshint: {
          beforeconcat: ['js/*.js']
        },

        uglify: {
          build: {
            src: 'app/build/js/production.js',
            dest: 'app/build/js/production.min.js'
          }
        },

        watch: {
          options: {
            livereload: true,
            base: 'app',
          },
          html: {
            files: ['app/*.html']
          },
          scripts: {
            files: ['app/js/*.js'],
            tasks: ['jshint'],
            options: {
              spawn: false,
            }
          },
          css: {
            files: ['app/css/*.css'],
            //tasks: ['sass', 'autoprefixer', 'cssmin'],
            options: {
              spawn: false,
            }
          },
          // images: {
          //   files: ['images/**/*.{png,jpg,gif}', 'images/*.{png,jpg,gif}'],
          //   tasks: ['imagemin'],
          //   options: {
          //     spawn: false,
          //   }
          // }
        },
        connect: {
          server: {
            options: {
              port: 8000,
              base: 'app'
            }
          }
        },
    });

    // 3. Where we tell Grunt we plan to use this plug-in.
    require('load-grunt-tasks')(grunt);

    // 4. Where we tell Grunt what to do when we type "grunt" into the terminal.
    grunt.registerTask('production', ['concat', 'uglify', 'cssmin', 'autoprefixer']);
    grunt.registerTask('dev', ['connect', 'watch']);
};
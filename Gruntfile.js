module.exports = function (grunt) {
    grunt.initConfig({
        js: ['js/plugins/*.js', 'js/main.js', 'js/app.js', 'js/modules/*.js'],
        concat: {
            my_target: {
                files: {
                    'js/min.debug.js': ['<%= js %>']
                }
            }
        },
        uglify: {
            my_target: {
                files: {
                    'js/min.js':  ['<%= js %>']
                }
            }
        },
        compass: {                  // Task
            dist: {                   // Target
                options: {              // Target options
                    config: 'config.rb'
                }
            }
        },
        watch: {
            sass: {
                files: ['css/sass/*.{scss,sass}'],
                tasks: ['compass']
            },
            css: {
                files: ['*.css']
            },
            js: {
                files: [
                    '<%= js %>'
                ],
                tasks: ['concat', 'uglify'],
                options: { livereload: true }
            },
            livereload: {
                files: ['css/*.css'],
                options: { livereload: true }
            }
        }// watch
    });

    // carrega plugins
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-watch');


    grunt.registerTask('default', ['compass', 'concat', 'uglify', 'watch']);
};
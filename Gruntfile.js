module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

		clean : {
			all: {
				files: [{src:'output/'}]
			}
		},

		copy: {
			development: {
				files: [
					{
						src: ['index.html', 'libs/pixi.min.js', 'libs/tween.min.js', 'resources/**'],
						dest: './output/'
					}]
			},
			production: {
				files: [
					{
						src: ['index.html'],
						dest: './output/'
					}]
			}
		},

		browserify: {
			development: {
				options: {
					browserifyOptions: {
						debug: true
					}
				},
				files: {
					'output/gs-particles.js': ['src/Main.js']
				}
			},

			production: {
				files: {
					'output/gs-particles.js': ['src/Main.js']
				}
			}
		}
    });

	grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-browserify');

	grunt.registerTask('dev', ['clean:all', 'browserify:development', 'copy:development']);

    grunt.registerTask('default', ['dev']);
};
module.exports = function(grunt) {

  // Libs
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-release');


  // Temp dir
  var TempDir = require('temporary/lib/dir');
  var tempDir = new TempDir().path;


  // Project configuration.
  grunt.initConfig(
  {
    clean: {
      build: {
        src: ['build']
      }
    },
    concat: {
      build: {
        options: {
          banner: '(function(global){\n\n\'use strict\';\n\n',
          footer: '\n\n}(this));'
        },
        src: ['src/**/*.js'],
        dest: 'build/secure-storage.js'
      }
    },
    jasmine: {
      test: {
        src: ['build/**/*.js', 'src/SecureStore.js'],
        options: {
          specs: 'test/specs/*Spec.js',
          vendor: 'bower_components/sjcl/sjcl.js',
          keepRunner: true
        }
      }
    },
    jshint: {
      src: ['build/**/*.js'],
      options: {
        curly: true,
        eqeqeq: true,
        eqnull: true,
        browser: true,
        camelcase: true,
        forin: true,
        latedef: 'nofunc',
        newcap: true,
        noarg: true,
        nonew: true,
        quotmark: 'single',
        undef: true,
        unused: true,
        strict: true,
        devel: true,
        globals: {
          sjcl: true
        }
      }
    },
    watch: {
      main: {
          files: ['*.*', 'src/**/*.*'],
          tasks: 'build'
      }
    },
    release: {
      options: {
        npm: false,
        file: 'bower.json'
      }
    }
  });



  // Tasks
  grunt.registerTask('build', [
        'clean',
        'concat',
        'jshint',
        'jasmine'
  ]);

  grunt.registerTask('deploy', [
        'build',
        'release'
  ]);

  grunt.registerTask('default', [
        'build'
  ]);


};
module.exports = function(grunt) {

  // Libs
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-jasmine');


  // Temp dir
  var TempDir = require('temporary/lib/dir');
  var tempDir = new TempDir().path;


  // Project configuration.
  grunt.initConfig(
  {
    packkage: grunt.file.readJSON('package.json'),
    clean: {
      build: {
        src: ['build']
      }
    },
    // concat: {
    //   buildJS: {
    //     options: {
    //       banner: '(function(){\n\n"use strict";\n\nvar module = angular.module(\'next-boat\', []);\n\n',
    //       footer: '\n\n}.call({}));'
    //     },
    //     src: ['src/next-boat/**/*.js'],
    //     dest: 'build/next-boat/next-boat.js'
    //   },
    //   buildCSS: {
    //     src: ['src/next-boat/**/*.css'],
    //     dest: 'build/next-boat/next-boat.css'
    //   }
    // },
    jasmine: {
      test: {
        src: 'src/**/*.js',
        options: {
          specs: 'test/specs/*Spec.js',
          vendor: 'bower_components/sjcl/sjcl.js',
          keepRunner: true
        }
      }
    },
    watch: {
      main: {
          files: ['*.*', 'src/**/*.*'],
          tasks: 'build'
      }
    },
  });



  // Tasks
  grunt.registerTask('build', [
        'clean',
        //'concat'
        'jasmine'
  ]);

  grunt.registerTask('deploy', [
        'build'
  ]);

  grunt.registerTask('default', [
        'build'
  ]);


};
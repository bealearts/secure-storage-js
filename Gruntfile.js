module.exports = function(grunt) {

  // Libs
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-bower-task');
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
    // bower: {
    //   build: {
    //     options: {
    //       targetDir: 'build/lib',
    //       copy: true,
    //       cleanBowerDir: true
    //     } 
    //   }
    // },
    // copy: {
    //   build: {
    //     files: [
    //       {
    //         expand: true,
    //         cwd: 'src/',
    //         src: ['**/.htaccess', 'next-boat/assets/**/*.*', '*.*', 'lib/**/*.*'], 
    //         dest: 'build/'
    //       }
    //     ]
    //   }
    // },
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
    // watch: {
    //   main: {
    //       files: ['*.*', 'src/**/*.*'],
    //       tasks: 'build'
    //   }
    // }

    jasmine: {
      test: {
        src: 'src/**/*.js',
        options: {
          specs: 'test/specs/*Spec.js',
          vendor: 'bower_components/cryptico/cryptico.js',
          keepRunner: true
        }
      }
    }
  });



  // Tasks
  grunt.registerTask('build', [
        'clean',
        //'copy',
        //'bower',
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
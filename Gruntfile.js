// grunt --gruntfile=Gruntfile-blogging.js
'use strict';

var grunt = require('grunt');
var argv = require('yargs').argv;

grunt.log.write('compiling blogging');

var webpackConfig = require('./webpack.config.js');

// stop webpack watch and keepalive
webpackConfig.watch = false;
webpackConfig.keepalive = false;

module.exports = function (grunt) {
  'use strict';

  // load all grunt tasks
  require('load-grunt-tasks')(grunt);
  var webpack = require('webpack');

  var yeomanConfig = {
    app: 'app/app_blogging',
    dist: 'dist',
    indexFile: 'prod-index.html',
    project: 'blogging'
  };

  grunt.initConfig({
    yeoman: yeomanConfig,

    webpack: {
        options: webpackConfig,
        'prod': {
            devtool: null // production
        },
        'build-dev': {
            devtool: 'cheap-module-eval-source-map', // development
        }
    },
    clean: [
      './dist.zip',
      '<%= yeoman.dist %>',
      '<%= yeoman.app %>/build'
    ],
    uglify: {
      options: {
        compress: true,
        mangle: true,
        sourceMap: false
      },
      target: {
        src: '<%= yeoman.dist %>/build/bundle.js',
        dest: '<%= yeoman.dist %>/build/bundle.js'
      }
    },
    cssmin: {
      target: {
        files: {
          '<%= yeoman.dist %>/build/styles.css': '<%= yeoman.dist %>/build/styles.css'
        }
      },
      options: {
        report: 'min'
      }
    },
    copy: {
      dist: {
        files: [
          {
            expand: true,
            cwd: '<%= yeoman.app %>',
            src: [
              '*.{ico,txt,png}',
              '.htaccess',
            ],
            dest: '<%= yeoman.dist %>'
          },
          // copy the vendor folder
          { expand: true,
            cwd: '<%= yeoman.app %>',
            src: ['vendor/**'],
            dest: '<%= yeoman.dist %>'
          },
          // copy pages
          { expand: true,
            cwd: '<%= yeoman.app %>',
            src: ['pages/**'],
            dest: '<%= yeoman.dist %>'
          },
          // copy the img files
          { expand: true,
            cwd: '<%= yeoman.app %>',
            src: ['img/**'],
            dest: '<%= yeoman.dist %>'
          },
          { expand: true,
            cwd: '<%= yeoman.app %>',
            src: ['images/**'],
            dest: '<%= yeoman.dist %>'
          },
          // copy the img files
          { expand: true,
            cwd: '<%= yeoman.app %>',
            src: ['styles/**'],
            dest: '<%= yeoman.dist %>'
          },
          // copy the root files
          { expand: true,
            cwd: '<%= yeoman.app %>',
            src: ['*.html','*.php'],
            dest: '<%= yeoman.dist %>'
          },  // copy the bootstrap files
          { expand: true,
            cwd: '<%= yeoman.app %>',
            src: ['build/*'],
            dest: '<%= yeoman.dist %>'
          },
          { expand: true,
            cwd: '<%= yeoman.app %>',
            src: ['scripts/custom.js', 'scripts/filter.js'],
            dest: '<%= yeoman.dist %>'
          }
        ]
      }
    },
    compress: {
        dist: {
            options: {
                archive: './dist.zip',
                mode: 'zip'
            },
            files: [{
                dot: true,
                expand: true,
                src : "**/*",
                cwd : "./dist/"
            }]
        }
    },
    cacheBust: {
        taskName: {
            options: {
                assets: ['<%= yeoman.dist %>/']
            },
            src: ['index.php']
        }
    }
  });
  grunt.registerTask('default', function() {
    grunt.task.run([
      'clean',
      'webpack:build-dev',
      'copy',
      'uglify',
      'cssmin',
      'compress',
      'cacheBust'
    ]);
  });

  grunt.registerTask('prod', function() {
      grunt.task.run([
        'clean',
        'webpack:prod',
        'copy',
        'uglify',
        'cssmin',
        'compress',
        'cacheBust'
      ]);
  });

};

module.exports = function(grunt) {
  "use strict";

  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),
    bowercopy: {
      options: {
        clean: true
      },
      test: {
        options: {
          destPrefix: "test/lib"
        },
        files: {
          "qunit.js" : "qunit/qunit/qunit.js",
          "qunit.css" : "qunit/qunit/qunit.css",
          "jquery.js" : "jquery/jquery.js"
        }
      }
    },
    connect: {
      testserver: { }
    },
    uglify: {
      all: {
        files: {
          "<%= pkg.name %>.min.js": [ "<%= pkg.name %>.js" ]
        },
        options: {
          preserveComments: false,
          report: "min",
          beautify: {
            ascii_only: true
          }
        }
      }
    },
    qunit: {
      all: ["test/*.html"],
      options: {
        timeout: 100000
      }
    },
    release: {
      options: {
        bump: false
      }
    },
    watch: {
      testserver: {
        files: [],
        tasks: ['connect:testserver'],
        options: { atBegin: true, spawn: false }
      },
    }
  });

  grunt.loadNpmTasks('grunt-bowercopy');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-release');

  grunt.registerTask("testserver", ["watch:testserver"]);
  grunt.registerTask("default", ["uglify", "qunit"]);
};


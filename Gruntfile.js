module.exports = function (grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    clean: {
      options: {
        force: true
      },
      all: ['dist/']
    },

    fileExists: {
      css: ['dist/css/joeday.css']
    },

    sass: {
      options: {
        outputStyle: 'nested',
        sourceMap: true,
        precision: 5,
        includePaths: [
            "node_modules"
        ]
      },
      dist: {
        files: {
          'dist/css/joeday.css': 'src/scss/joeday.scss'
        }
      }
    },

    // Copy doc files
    copy: {
      assets: {
        files: [
        {
          expand: true,
          cwd: 'src/images/',
          src: '*',
          dest: 'dist/images/'
        }
        ]
      },
      doc: {
        files: [
        {
          expand: true,
          cwd: 'src/js/',
          src: 'app.js',
          dest: 'dist/js/'
        }
        ]
      }
    },

    // Build the main HTML file of the style guide
    assemble: {
      options: {
        partials: ['src/doc/partials/**/*.hbs'],
        layout: ['src/doc/layouts/default.hbs'],
        flatten: true,
        data: './src/doc/models/*.json',

        // Set the version number
        version: '<%= pkg.version %>',

        // Name of the project
        name: '<%= pkg.name %>',
      },
      pages: {
        src: ['src/doc/*.hbs'],
        dest: './dist/'
      }
    },

    watch: {
      sass: {
        files: 'src/scss/**/*.scss',
        tasks: ['sass']
      },

      doc: {
        files: ['src/doc/**/*', 'src/js/*.js'],
        tasks: ['assemble', 'copy:doc']
      },
      configFiles: {
        files: ['gruntfile.js'],
        options: {
          reload: true
        }
      },
      options: {
        tasks: ['notify:assemble']
      }
    },

    connect: {
      server: {
        options: {
          port: 9001,
          base: './dist/'
        }
      }
    },

    bump: {
      options: {
        files: ['package.json'],
        commit: true,
        commitMessage: 'Release version %VERSION%',
        commitFiles: ['package.json'],
        updateConfigs: ['pkg'],
        createTag: true,
        tagName: '%VERSION%',
        tagMessage: 'Version %VERSION%',
        push: true,
        pushTo: 'upstream',
        gitDescribeOptions: '--tags --always --abbrev=1 --dirty=-d',
        globalReplace: false,
        prereleaseName: false,
        regExp: false
      }
    },
    notify: {
      server: {
        options: {
          title: 'Portfolio',
          message: 'Server started'
        },
      },
      watch: {
        options: {
          title: 'Portfolio',
          message: 'assemble completed', //required
        }
      }
    }
  });

  grunt.loadNpmTasks('assemble');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-file-exists');
  grunt.loadNpmTasks('grunt-bump');
  grunt.loadNpmTasks('grunt-notify');

  grunt.registerTask('default', ['clean', 'sass', 'assemble', 'copy', 'fileExists']);
  grunt.registerTask('server', ['connect', 'notify:server', 'watch']);

};

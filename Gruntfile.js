module.exports = function(grunt) {
  grunt.initConfig({
    jshint :{
      options: {
        curly: true,
        eqeqeq: true,
        eqnull: true,
        browser: true,
        globals: {
          jQuery: true
        }
      },
      client: {
        src: ['client-code/**/*.js']
      },
      server: {
        src: ['private/**/*.js', 'main.js']
      }
    },
    concat_in_order: {
      'client-code': {
        files: {
          'public_html/js/client.js': ['client-code/*.js']
        }
      },
      'engine': {
        files: {
          'public_html/js/engine.js': ['client-code/Engine/main.js', 'client-code/Engine/**/*.js']
        }
      },
      'game': {
        files: {
          'public_html/js/game.js': ['client-code/Game/main.js', 'client-code/Game/**/*.js']
        }
      }
    },
    uglify: {
      'client-code': {
        options: {
          sourceMap: true,
          sourceMapName: 'public_html/js/client.min.js.map'
        },
        files: {
          'public_html/js/client.min.js': ['public_html/js/client.js']
        }
      },
      'engine-code': {
        options: {
          sourceMap: true,
          sourceMapName: 'public_html/js/engine.min.js.map'
        },
        files: {
          'public_html/js/engine.min.js': ['public_html/js/engine.js']
        }
      },
      'game-code': {
        options: {
          sourceMap: true,
          sourceMapName: 'public_html/js/game.min.js.map'
        },
        files: {
          'public_html/js/game.min.js': ['public_html/js/game.js']
        }
      }
    },
    watch: {
      'client-code': {
        files: ['client-code/**/*.js'],
        tasks: ['concat_in_order', 'uglify']
      }
    }
  });

  grunt.loadNpmTasks('grunt-concat-in-order');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-serve');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
};

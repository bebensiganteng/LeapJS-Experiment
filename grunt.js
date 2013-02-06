module.exports = function(grunt){
  grunt.initConfig({
    watch: {
      html: {
        files: ['*.html'],
        tasks: 'reload'
      },
      scripts: {
        files: ['scripts/*.coffee'],
        tasks: 'coffee reload'
      }
    },
    coffee: {
      dist: {
        files: {
          "scripts/*.js": ["scripts/*.coffee"]
        }
      }
    },
    server: {
      port:3457
    },
    reload: {
      port:8001,
      proxy: {
        host:'localhost',
        port:8000
      }
    }
  });
  grunt.loadNpmTasks('grunt-contrib-coffee');
  grunt.loadNpmTasks('grunt-reload');

  grunt.registerTask('default', 'coffee server reload watch');
};
module.exports = function(grunt) {

  // Automatically Load Tasks
  require('load-grunt-tasks')(grunt, {
    pattern: 'grunt-*',
    config: './package.json',
    scope: [ 'devDependencies', 'dependencies' ]
  });

  grunt.initConfig({


  });

  grunt.loadTasks('tasks' );


};
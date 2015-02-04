module.exports = function(grunt) {

  // Automatically Load Tasks
  require('load-grunt-tasks')(grunt, {
    pattern: 'grunt-*',
    config: './package.json',
    scope: [ 'devDependencies', 'dependencies' ]
  });

  grunt.initConfig({

    /**
     *
     * cp -a /Users/andy.potanin/Sites/www.discodonniepresents.com/wp-content/themes/wp-phonegap-v2.0/assets/app.js ./
     * cp -a /Users/andy.potanin/Sites/www.discodonniepresents.com/wp-content/themes/wp-phonegap-v2.0/assets/components ./
     * cp -a /Users/andy.potanin/Sites/www.discodonniepresents.com/wp-content/themes/wp-phonegap-v2.0/assets/imagesr ./
     * cp -a /Users/andy.potanin/Sites/www.discodonniepresents.com/wp-content/themes/wp-phonegap-v2.0/assets/fonts ./
     * cp -a /Users/andy.potanin/Sites/www.discodonniepresents.com/wp-content/themes/wp-phonegap-v2.0/assets/parts ./
     * cp -fa /Users/andy.potanin/Sites/www.discodonniepresents.com/wp-content/themes/wp-phonegap-v2.0/assets/styles ./
     *
     */
    symlink: {
      options: {
        overwrite: false
      },

      expanded: {
        files: [
          {
            expand: true,
            overwrite: true,
            cwd: '/Users/andy.potanin/Sites/www.discodonniepresents.com/wp-content/themes/wp-phonegap-v2.0/assets',
            src: ['vendor'],
            dest: 'www'
          },
          {
            expand: true,
            overwrite: true,
            cwd: '/Users/andy.potanin/Sites/www.discodonniepresents.com/wp-content/themes/wp-phonegap-v2.0/assets',
            src: ['app.js'],
            dest: 'www'
          },
          {
            expand: true,
            overwrite: true,
            cwd: '/Users/andy.potanin/Sites/www.discodonniepresents.com/wp-content/themes/wp-phonegap-v2.0/assets',
            src: ['styles/app.min.css'],
            dest: 'www'
          }
        ]
      }

    },
    clean: {
      symlinks: [
      ],
      postUpdate: [
        "www/manifest.appcache",
        "www/cordova_plugins.js",
        "www/cordova.js"
      ],
      config: [
        "www/config.xml"
      ],
      preUpdate: [
        "www/*.html"
      ],
      release: [
        "wp-content/themes/wp-phonegap-v2.0/assets/vendor/framework7/examples"
      ]
    },

    download: {
      site: {
        url: 'http://mobile.discodonniepresents.com/manifest.appcache',
        manifest: true,
        filename: 'www'
      },
      config: {
        url: 'https://mobile.discodonniepresents.com/api/build/config.xml',
        filename: 'www'
      }
    }

  });

  grunt.loadTasks('tasks' );

  grunt.registerTask('update', [
    //'clean:symlinks',
    'clean:preUpdate',
    'download:site',
    //'clean:postUpdate',
    // 'clean:config',
    // 'download:config'
  ]);

  grunt.registerTask('default', [
    // 'clean:config',
    // 'download:config'
  ]);


};
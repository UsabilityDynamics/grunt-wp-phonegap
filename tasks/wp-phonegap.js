/*
 * grunt-download
 * https://github.com/eug48/grunt-download
 *
 * Copyright (c) 2013
 * Licensed under the MIT license.
 */

async = require( 'async' );
url = require( 'url' );
http = require( 'http' );
fs = require( 'fs' );
path = require( 'path' );
mkdirp = require( 'mkdirp' );
request = require( 'request' );

module.exports = function ( grunt ) {

  grunt.registerTask( 'wpPhoneGap', 'Downloads files via HTTP', function ( arg1, arg2 ) {

    var done = this.async();
    var options = this.options();

    // console.log( 'this.data', options );
    // var manifestUrl = url.parse( args.manifestUrl, true );
    grunt.log.write( ' \n ' + this.name + ' wpPhoneGap - fake run...' );

    require( 'request' ).get({
      url: options.manifestUrl,
      json: false,
      headers: {
        'x-access-token': options.token,
        'x-target-platform': options.platform,
        'x-target-device': options.device
      }
    }, function( error, res, body ) {

      //console.log( 'error.message', error );
      console.log( 'body', body );

      done();

    })


  });

};


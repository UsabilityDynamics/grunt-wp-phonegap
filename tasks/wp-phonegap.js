/*
 * grunt-download
 * https://github.com/eug48/grunt-download
 *
 * Copyright (c) 2013
 * Licensed under the MIT license.
 */

// process.env.CIRCLE_ARTIFACTS

var grunt = require( 'grunt' );
var async = require( 'async' );
var _ = require( 'lodash' );
var url = require( 'url' );
var http = require( 'http' );
var fs = require( 'fs' );
var path = require( 'path' );
var mkdirp = require( 'mkdirp' );
var request = require( 'request' );
var client = require('phonegap-build-api');

function downloadManifestFiles( routes, options, done ) {

  var _queue = require( 'async' ).queue(function (task, thisDdone ) {
    //grunt.log.write( ' --> ' + res.statusCode + '\n' );

    // pipeDownload( task.newUrl, task.assetFilename, callback );

    var outputFilename = options.output + task.outputFilename;
    var remotePath = task.remotePath;

    if (fs.existsSync( outputFilename)) {

//      fs.unlinkSync(outputFilename);

      process.nextTick( function() {
        // grunt.log.write( '\n - File exists: ' + outputFilename );
        //cb();
      });

      //return;
    }

    //console.log( require('path').dirname( outputFilename ) );
    mkdirp.sync( require('path').dirname( outputFilename ) );

    var file = fs.createWriteStream( outputFilename );

    var _headers = _.extend({
      'cache-control': 'no-cache',
      'pragma': 'no-cache',
      'x-access-token': options.token,
      'x-target-platform': options.platform,
      'x-target-device': options.device
    }, options.requestHeaders );

    request.get({
      url: remotePath,
      headers: _headers
    }, function requestCallback( error, res, body ) {

      grunt.log.write( '\n - Downloading ' + remotePath );

      if( error ) {

        if( res ) {
          grunt.log.write( ' --> ' + res.statusCode + '\n' );
        } else {
          console.log( error );
        }
        // return cb();
        //return cb( 'problem with request: ' + error.message );
      }

      // grunt.log.write( ' --> ' + res.statusCode + '\n' );

      thisDdone();

    }).pipe( file );


  }, 20 );

  routes.forEach( function( singleRoute ) {

    _queue.push({ remotePath:  options.url + singleRoute, outputFilename: singleRoute }, function (error) {

      if( error ) {
        grunt.log.write( ' \n Error! ' +error.message );
      } else {
        // grunt.log.write( ' \n - Finished downloading. '  );
      }


    });


  });

  _queue.drain = function() {
    grunt.log.write( ' \n Finished downloads.' );
    done( true );
  }

}

/**
 *
 * @param options
 * @param done
 */
function startBuild( options, done ) {

  client.auth({ token: options.token }, function(e, api) {
    // time to make requests

    // console.log( 'error', e );

    api.post('/apps/' +  options.appId + '/build', function(e, data) {
      // console.log('error:', e);
      console.log('data:', data);
      done();
    });

  });

}

function fetchManifest( options, done ) {
  console.log( 'fetchManifest' );

  require( 'request' ).get({
    url: options.manifestUrl,
    json: true,
    headers: _.extend({
      'x-access-token': options.token,
      'x-target-platform': options.platform,
      'x-target-device': options.device
    }, options.requestHeaders )
  }, function( error, res, body ) {

    //console.log( 'error.message', error );
    //console.log( 'body', body );

    done( error, body );

  });

}

module.exports = function ( grunt ) {

  grunt.registerMultiTask( 'wpPhoneGap', 'Downloads files via HTTP', function ( type ) {

    // merge default options and target-specific data into single object.
    var done = this.async();

    var options = _.extend( {
      _target: this.target,
      id: null,
      token: null,
      device: null,
      platform: null,
      output: require( 'os' ).tmpdir + '/_tmp',
      requestHeaders: {}
    }, this.options(), this.data );


    // resolve path
    options.output = require( 'path' ).resolve( options.output.replace( '~', process.env.HOME ) );

    if( options._target === 'fetchManifest' ) {
      fetchManifest( options, function( error, data ) {
        // console.log( 'have fetchManifest', data.routes );

        data.routes = data.routes || [];

        if( options.configPath ) {
          data.routes.push( options.configPath );
        }

        downloadManifestFiles( data.routes, options, done );

      });
    }

    //console.log( 'options', grunt.option.flags() );
    //console.log( 'options', grunt.option( 'wpPhoneGap') );
    //console.log( 'arg1', arg1 );

    // return;
    // console.log( 'this.data', options );
    // var manifestUrl = url.parse( args.manifestUrl, true );
    // grunt.log.write( ' \n ' + this.name + ' wpPhoneGap - fake run...' );


  });

};


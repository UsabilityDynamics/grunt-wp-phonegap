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

function clone( obj ) { // from http://stackoverflow.com/a/122190/94078
  if( obj == null || typeof(obj) != 'object' )
    return obj;

  var temp = obj.constructor(); // changed

  for( var key in obj )
    temp[ key ] = clone( obj[ key ] );
  return temp;
}

module.exports = function ( grunt ) {

  /**
   *
   * @param parsedUrl
   * @param outputFilename
   * @param cb
   */
  function pipeRequest( parsedUrl, outputFilename, cb ) {
    // grunt.log.write( 'downloading ' + url.format( parsedUrl ) );


    if (fs.existsSync(outputFilename)) {

//      fs.unlinkSync(outputFilename);

      process.nextTick( function() {
        // grunt.log.write( '\n - File exists: ' + outputFilename );
        //cb();
      });

      //return;
    }


    var file = fs.createWriteStream( outputFilename );

    request.get({
      url: url.format( parsedUrl ),
      headers: {
        'cache-control': 'no-cache',
        //'x-set-backend': 'DiscoDonniePresentsAmarahStaging',
        'pragma': 'no-cache'
      }
    }, function requestCallback( error, res, body ) {

      grunt.log.write( '\n - Downloading ' + url.format( parsedUrl ) );

      grunt.log.write( ' --> ' + res.statusCode + '\n' );

      if( error ) {
        // return cb();
        //return cb( 'problem with request: ' + error.message );
      }

      // grunt.log.write( ' --> ' + res.statusCode + '\n' );

      cb();

    }).pipe( file );

  };


  // Please see the grunt documentation for more information regarding task and
  // helper creation: https://github.com/gruntjs/grunt/blob/master/docs/toc.md

  // ==========================================================================
  // TASKS
  // ==========================================================================

  grunt.registerMultiTask( 'wpPhoneGap:download', 'Downloads files via HTTP', function () {
    var configData = this.data;
    var done = this.async();

    var q = require( 'async' ).queue(function (task, callback) {
      //grunt.log.write( ' --> ' + res.statusCode + '\n' );
      pipeRequest( task.newUrl, task.assetFilename, callback );
    }, 20);


    var parsedUrl = url.parse( configData.url, true );
    var filename = configData.filename;
    if( fs.statSync( configData.filename ).isDirectory() ) {
      filename = path.join( configData.filename, path.basename( parsedUrl.pathname ) );
    }

    pipeRequest( parsedUrl, filename, function ( error ) {
      if( error ) {
        grunt.log.error( error );
        console.log( 'error: ' + error );
        done( false );
        return;
      }

      if( configData.manifest ) {
        var manifest = fs.readFileSync( filename, 'utf8' );
        var manifestDir = path.dirname( filename );

        var tasks = [];
        manifest.split( '\n' ).forEach( function ( line, i ) {

          line = line.replace( /^\s+/g, ' ' );

          if( /^CACHE MANIFEST|#|\*$/.test( line ) || /^[A-Z]+:$/.test( line ) || line.length == 0 ) {
            return;
          }

          var newUrl = JSON.parse( JSON.stringify( parsedUrl ) );

          newUrl.search = '';

          if( line[ 0 ] === '/' ) {
            newUrl.path = newUrl.pathname = line;
          } else {
            newUrl.path = newUrl.pathname = path.join( path.dirname( parsedUrl.pathname ), line );
          }

          var assetFilename = path.join( manifestDir, line );

          mkdirp.sync( path.dirname( assetFilename ) );

          q.push({newUrl: newUrl, assetFilename: assetFilename }, function (error) {

            if( error ) {
              grunt.log.write( ' \n Error! ' +error.message );
            }
            // console.log('finished processing foo');
          });

          q.drain = function() {
            grunt.log.write( ' \n Finished downloads.' );
            done( true );
          }

        });

      } else {
        done( true );
      }

    } );

  } );

};

/* vim: set et sw=2 ts=2: */

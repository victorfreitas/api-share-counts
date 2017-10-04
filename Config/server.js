"use strict";

var express = require( 'express' )
  , consign = require( 'consign' )
  , app     = express()
;

consign()
    .include( 'Exceptions' )
	.include( 'Helper' )
	.include( 'Routes' )
	.then( 'Config/mongodb.js' )
	.then( 'Model' )
	.then( 'Controller' )
	.into( app );

app.use(function(req, res, next) {
	res.status( 404 ).json({
		error: 'Page not found'
	});

	next();
});

app.use(function(error, req, res, next) {
	res.status( 500 ).json({
		url   : ( error.url || null ),
		error : error.message
	});

	next();
});

module.exports = app;
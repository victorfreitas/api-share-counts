"use strict";

if ( typeof XMLHttpRequest === 'undefined' ) {
	global.XMLHttpRequest = require( 'xmlhttprequest' ).XMLHttpRequest;
}

var async = require( 'async' );

function getSharesCount(network, permalink, callback, networkName) {
	var url  = network.url.replace( '@PERMALINK', permalink )
	  , data = ( network.data || null )
	;

	var xhr = new XMLHttpRequest();

	xhr.open( ( network.method || 'GET' ), url );

	xhr.timeout = ( network.timeout || 5000 );

	xhr.setRequestHeader( 'Content-Type', 'application/json' );

	xhr.onload = function(onEvent) {
		callback( null, network.parse( xhr.responseText ) );
	};

	if ( networkName === 'gplus' ) {
		data = network.data.replace( /@PERMALINK/g, permalink );
	}

	xhr.send( data );
};

function getNetworkNames(app) {
	var networkNames = [];

	for ( var item in app.Model.networks ) {
		networkNames.push( item );
	}

	return networkNames;
}

module.exports = function(app) {
	return function(url, callback) {
		var actions = {}
		  , names   = getNetworkNames( app )
		;

		names.forEach(function(networkName) {
			var network = app.Model.networks[ networkName ];

			if ( !network || actions[ networkName ] ) {
				return;
			}

			actions[ networkName ] = function(cb) {
				getSharesCount( network, url, cb, networkName );
			};
		});

		async.parallel( actions, callback );
	};
};
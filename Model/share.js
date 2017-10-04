"use strict";

function getCallback(callback) {
	return ( typeof callback !== 'function' ? function() {} : callback );
}

var Instance = function() {
	this._db = this._app.Config.mongodb;
};

Instance.prototype.replace = function(shares, callback) {
	this._db().open(function(error, client) {
		client.collection( 'counts', function(error, collection) {
			collection.replaceOne(
				{
					href : shares.href
				},
				{
					$set : shares
				},
				{
					upsert: true
				},
				getCallback( callback )
			);

			client.close();
		});
	});
};

Instance.prototype.find = function(search, callback) {
	this._db().open(function(error, client) {
		client.collection( 'counts', function(error, collection) {
			collection.find( search ).toArray( getCallback( callback ) );
		});

		client.close();
	});
};

module.exports = function( app ) {
	Instance.prototype._app = app;

	return Instance;
};
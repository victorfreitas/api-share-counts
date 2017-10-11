"use strict";

function getCallback(callback) {
	return ( typeof callback !== 'function' ? function() {} : callback );
}

var Instance = function() {
	this._db = this._app.Config.mongodb;
};

Instance.prototype.replace = function(data, collectionName, callback) {
	this._db().open(function(error, client) {
		client.collection( collectionName, function(error, collection) {
			collection.replaceOne(
				{
					href : data.href
				},
				{
					$set : data
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

Instance.prototype.addShares = function(sharesData, callback) {
	this.replace( sharesData, 'counts', callback );
};

Instance.prototype.addDomain = function(data, callback) {
	this.replace( data, 'domains', callback );
};

Instance.prototype.findShares = function(data, callback) {
	this.find( data, 'counts', callback );
};

module.exports = function( app ) {
	Instance.prototype._app = app;

	return Instance;
};
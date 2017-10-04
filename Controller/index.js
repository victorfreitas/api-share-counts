"user strict";

var Counts = function(app, req, res) {
	this.setProps( app, res );
	this.init( req );
};

Counts.prototype.init = function(req) {
	this.app.Helper.utils.isValidId( req.query.id );

	this.setUrl( req.query.id );
	this.setShareModel();

	this.Share.find(
		{
			href : this.url.href
		},
		this.find.bind( this )
	);
};

Counts.prototype.setProps = function(app, res) {
	this.app = app;
	this.res = res;
};

Counts.prototype.setUrl = function(url) {
	this.url = this.getUrl( url );
};

Counts.prototype.setShareModel = function() {
	this.Share = new this.app.Model.share();
};

Counts.prototype.getUrl = function(url) {
	return this.app.Helper.utils.parseUrl( url );
};

Counts.prototype.find = function(error, results) {
	if ( results.length ) {
		this.sendLocal( results );
		return;
	}

	this.requests();
};

Counts.prototype.sendLocal = function(results) {
	var result = ( results[0] || {} );

	this.res.json( result.shares );
};

Counts.prototype.requests = function() {
	var _self = this;

	this.app.Controller.shares( this.url.href, function(error, data) {
		var dataShares = _self.parseData( data );

		if ( !dataShares.shares.total ) {
			_self.res.json( data );
			return;
		}

		_self.Share.replace( dataShares, function(error, result) {
			_self.res.json( data );
		});
	});
};

Counts.prototype.parseData = function(data) {
	var response = {
		domain   : this.url.host,
		pathname : this.url.pathname,
		homeUrl  : this.url.href.replace( this.url.pathname, '/' ),
		href     : this.url.href,
		shares   : data
	};

	response.shares.total = this.app.Helper.utils.parseTotalShares( data );

	return response;
};

module.exports = function(app) {
	return function(req, res) {
		new Counts( app, req, res );
	};
};
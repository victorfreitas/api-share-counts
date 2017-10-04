"use strict";

module.exports = function(app) {
	app.get( '/shares', function(req, res) {
		app.Controller.index( req, res );
	});
};
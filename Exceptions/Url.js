"use strict";

module.exports = function(app) {
	return function(message, url) {
	   this.message = message;
	   this.url     = url ? url : null;
	}
};
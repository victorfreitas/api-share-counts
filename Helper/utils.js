"use strict";

var URL          = require( 'url' )
  , validDomains = {
		'jogarmais.com.br' : 1
    }
;

module.exports = function(app) {
	return {

		parseUrl: function(currentUrl) {
			return URL.parse( currentUrl );
		},

		isEmptyValue: function(value) {
			return !( value || ( value.trim() ) );
		},

		isValidId: function(uri) {
			if ( !uri || this.isEmptyValue( uri ) ) {
				return false;
			}

			if ( !/^(https?:\/\/)((www)[0-9]?\.)?[\S]+\.([a-zA-Z]{2,5})(\/[\S]+)?\/?$/.test( decodeURIComponent( uri ) ) ) {
				throw new app.Exceptions.Url( 'Invalid id param value', uri );
			}

			var domain = this.parseUrl( uri ).host.replace( 'www.', '' );

			if ( !validDomains[ domain ] ) {
				throw new app.Exceptions.Url( 'Domain ' + domain + ' not authorised.', uri );
			}
		},

		parseTotalShares: function(shares) {
			var total = 0;

			try {
				for ( var network in shares ) {
					total += parseInt( shares[ network ] );
				}

				return total;
			} catch ( e ) {
				return 0;
			}
		}
	};
};
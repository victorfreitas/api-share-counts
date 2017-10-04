"use strict";

function parse(objString) {
    try {
        return JSON.parse( objString );
    } catch ( e ) {
        return {};
    }
}

module.exports = function() {
	return {
		facebook : {
			url   : 'https://graph.facebook.com/?id=@PERMALINK',
			parse : function(body) {
				var response = parse( body );

				if ( response && response.share ) {
					return ( response.share.share_count || 0 ) + ( response.share.comment_count || 0 );
				}

				return 0;
			}
		},

		twitter : {
			url     : 'https://public.newsharecounts.com/count.json?url=@PERMALINK',
			timeout : 60000,
			parse   : function(body) {
				var response = parse( body );

				return ( response.count || 0 );
			}
		},

		tumblr : {
			url   : 'https://api.tumblr.com/v2/share/stats?url=@PERMALINK',
			parse : function(body) {
				var response = parse( body );

				return ( ( response.response || {} ).note_count || 0 );
			}
		},

		pinterest : {
			url   : 'https://api.pinterest.com/v1/urls/count.json?callback=_&url=@PERMALINK',
			parse : function(body) {
				return body ? ( parse( body.match( /_\((.+)\)/ )[1] ).count || 0 ) : 0;
			}
		},

		gplus : {
			url    : 'https://clients6.google.com/rpc',
			method : 'POST',
			data   : JSON.stringify({
				id         : '@PERMALINK',
				key        : 'p',
				method     : 'pos.plusones.get',
				jsonrpc    : '2.0',
				apiVersion : 'v1',
				params     : {
					nolog   : true,
					id      : '@PERMALINK',
					source  : 'widget',
					userId  : '@viewer',
					groupId : '@self'
				}
			}),
			parse  : function(body) {
				var response = parse( body )
				  , counts   = ( ( ( response.result || {} ).metadata || {} ).globalCounts || {} ).count
				;

				return parseInt( counts || 0 );
			}
		},

		linkedin : {
			url   : 'https://www.linkedin.com/countserv/count/share?url=@PERMALINK',
			parse : function(body) {
				return body ? ( parse( body.match( /IN\.Tags\.Share\.handleCount\((.+)\)/ )[1] ).count || 0 ) : 0;
			}
		},

		buffer : {
			url   : 'https://api.bufferapp.com/1/links/shares.json?url=@PERMALINK',
			parse : function(body) {
				var response = parse( body );

				return ( response.shares || 0 );
			}
		}
	};
};
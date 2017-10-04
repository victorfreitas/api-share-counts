"use strict";

var port = 3000
  , app  = require( './Config/server' )
;

app.listen( port );

console.log( 'Server ON: ' + port );
var mongodb = require( 'mongodb' );

module.exports = function() {
	return function() {
		return new mongodb.Db(
			'shares',
			new mongodb.Server(
				'localhost',
				27017,
				{}
			),
			{}
		);
	};
};
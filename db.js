// Sequelize provides an abstraction to work JSON objects into relational DBs like MySql,Postgres etc.
// it provides a set of APIs that eases the job of writing big SQL queries while working with JSON and JS objects.
// It works as an ORM
var Sequelize = require('sequelize');

var env = process.env.NODE_ENV || 'development';
var sequelize;
if (env === 'production') {
	sequelize = new Sequelize(process.env.DATABASE_URL, {
		"dialect": "postgres",
	});
} else {
	sequelize = new Sequelize(undefined, undefined, undefined, {
		"dialect": "sqlite",
		"storage": __dirname + "/data/dev-db.sqlite"
	});
}

var db = {};

db.todo = sequelize.import(__dirname + "/models/todo.js");
db.sequelize = sequelize;
db.Sequelize = Sequelize;
module.exports = db;
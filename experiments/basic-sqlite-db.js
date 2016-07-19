// Sequelize provides an abstraction to work JSON objects into relational DBs like MySql,Postgres etc.
// it provides a set of APIs that eases the job of writing big SQL queries while working with JSON and JS objects.
// It works as an ORM
var Sequelize = require('sequelize');

// ARGS to be checked later
var sequelize = new Sequelize(undefined, undefined, undefined, {
	"dialect": "sqlite",
	"storage": __dirname + "/basic-sqlite-db.sqlite"
});

// definition of the model
var Todo = sequelize.define('todo', {
	description: {
		type: Sequelize.STRING,
		allowNull: false,
		validate :
		{
			notEmpty:true,
			len:[1,250]
		}
	},
	completed: {
		type: Sequelize.BOOLEAN,
		allowNull: false,
		defaultValue:false
	}
});


// calling sync takes the models and syncs them with DB  
// force:true would result in deleting and recreate the schema
sequelize.sync({
	force: true
}).
	then(function() {
	//console.log('Sequelize => Everything is synched for DB');
	return Todo.create({
		description: "wake up at 7:00 AM",
		completed: true
	})
	}).
	then(function() {
		return Todo.create({
		description: "have lunch at 2:00 PM",
		//completed: false
	})
	}).
	then(function() {
		return Todo.create({
		description: "attend meeting at 5:00 PM",
		//completed: false
	})
	}).
	then(function()
	{
		return Todo.findById(1);
	}).
	then(function(fetchedTodo)
	{
		if(fetchedTodo)
		{
			console.log(fetchedTodo.toJSON());
		}
		else
		{
			console.log("no records found!!")
		}
	}).
	then(function()
	{
		return Todo.findAll({
			where:{completed:false}
			})
	}).
	then(function(fetchedTodos){
		if(fetchedTodos)
		{
			fetchedTodos.forEach(function(fetchedTodo){
				console.log(fetchedTodo.toJSON());
			})
			
		}
		else
		{
			console.log("no records found!!")
		}	
	}).
	catch(function (e){
		console.log(e);
	})

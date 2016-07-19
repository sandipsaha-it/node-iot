var express = require("express");

// body parser is required for parsing the json data from POST request's body.
var bodyParser = require("body-parser");

// The convension for declaring variable for underscore is to use '_'.
// It is required for a set of utilities and validation purposes.
// It is used as a middleware with Express using app.use()
var _ = require("underscore");


middleware = require("./middleware.js");
var app = express();


// process.env.PORT is the port number set by Heroku..for local server the 9000 port would be used
// as process.env.PORT is not supplied in the local env
var port = process.env.PORT || 9000;

var nextTodoId = 1;
var todos = [];

// using bodyparser as a middleware
app.use(bodyParser.json());



/*app.get("/",
	function(req,resp)
	{
		resp.send("My First Express App");
	}
);*/



//these are applicaiton level middlewares
//app.use(middleware.requireAuthentication);
//app.use(middleware.logger);


// the following is an example of path specific middleware(pathSpecificLogger), which is used as a second argument of the route difinition
app.get("/about", middleware.pathSpecificLogger, function(req, resp) {
	resp.send("About items are listed here");
});

//GET all todo items
app.get("/todos",
	function(req, resp) {
		// instead of sending JSON.stringify() use the readymade function of resp.json()
		resp.json(todos);
	}
);

//GET an individual todo with ID=:id
app.get("/todos/:id",
	function(req, resp) {
		var todoId = parseInt(req.params.id, 10);
		var matchedTodo;

		//commented for the underscore's usage of _.findWhere() 
		/*todos.forEach(function(todo)
		{
			if(todoId===todo.id)
			{
				matchedTodo=todo;
			}
		});*/


		// using underscore for finding the element
		matchedTodo = _.findWhere(todos, {
			id: todoId
		});

		if (matchedTodo) {
			resp.json(matchedTodo);
		} else {
			console.log("Reqeust:" + new Date().toString() + " => " + req.method + " " + req.originalUrl + " could not be served the todo item with id " + todoId + " does not exist!!");
			resp.status(404).send();

		}
	}
);

//POST create a new todo item
app.post("/todos",
	function(req, resp) {
		// using body-parser provides the feature of req.body to be used
		var body = req.body;


		// adding id with the JSON sent by user/client
		body.id = nextTodoId++;

		// add new todo in todos array		
		todos.push(body);
		console.log(body);
		resp.json(body);
	}
);


//if you dont provide any route for the "/" , this would get autometically invoked
// __dirname  => is an predefined variable within node which gives the path of current working directory
app.use(express.static(__dirname + "/public"));

app.listen(port, function(error, success) {
	if (error) {
		console.log("server startup failed");
	} else {
		console.log("server is started at port " + port + " press [ctrl+c] to exit!!");
	}
});
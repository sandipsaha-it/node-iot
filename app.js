var express = require("express");
var app=express();
var port=process.env.PORT||9000;

var todos = [
	{
		id:1,
		description:'Have the lunch by 2PM',
		completed:false
	},
	{
		id:2,
		description:'Wake up at 7AM',
		completed:true
	},
	{
		id:3,
		description:'Start to home at 5:30PM',
		completed:true
	}

];

middleware=require("./middleware.js");

/*app.get("/",
	function(req,resp)
	{
		resp.send("My First Express App");
	}
);*/

//this is an  applicaiton level middleware
//app.use(middleware.requireAuthentication);
//app.use(middleware.logger);


// the following is an example of path specific logger, which is used as a second argument of the route difinition
app.get("/about",middleware.pathSpecificLogger,
	function(req,resp)
	{
		resp.send("About items are listed here");
	}
);

//GET all todo items

app.get("/todos",
	function(req,resp)
	{
		// instead of sending JSON.stringify() use the readymade function of resp.json()
		resp.json(todos);
	}
);

//GET an individual todo with ID=:id
app.get("/todos/:id",
	function(req,resp)
	{
		var todoId = parseInt(req.params.id,10);
		var matchedTodo;
		todos.forEach(function(todo)
		{
			if(todoId===todo.id)
			{
				matchedTodo=todo;
			}
		});

		if(matchedTodo)
		{
			resp.json(matchedTodo);
		}
		else
		{
			console.log("Reqeust:"+ new Date().toString()+" => "+req.method +" "+ req.originalUrl+" could not be served the todo item with id "+todoId +" does not exist!!");
			resp.status(404).send();
		}
	}
);


//if you dont provide any route for the "/"  this would get autometically invoked
app.use(express.static(__dirname+"/public"));

app.listen(port,function(error,success){
	if(error)
	{
		console.log("server startup failed");		
	}
	else
	{
		console.log("server is started at port "+port+" press [ctrl+c] to exit!!");
	}
});

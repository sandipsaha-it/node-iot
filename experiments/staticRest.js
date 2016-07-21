var nextTodoId = 1;
var todos = [];


//POST create a new todo item
app.post("/todosStatic",
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

//GET all todo items
app.get("/todosStatic",
	function(req, resp) {
		// instead of sending JSON.stringify() use the readymade function of resp.json()
		resp.json(todos);
	}
);

//GET an individual todo with ID=:id
app.get("/todosStatic/:id",
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
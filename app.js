var express = require("express");
var app=express();
var port=process.env.PORT||9000;

middleware=require("./middleware.js");

/*app.get("/",
	function(req,resp)
	{
		resp.send("My First Express App");
	}
);*/

//this is an  applicaiton level middleware
app.use(middleware.requireAuthentication);
app.use(middleware.logger);


// the following is an example of path specific logger, which is used as a second argument of the route difinition
app.get("/about",middleware.pathSpecificLogger,
	function(req,resp)
	{
		resp.send("About items are listed here");
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

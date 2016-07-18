//declaring a middleware
var middleware = {
	requireAuthentication : function(req,res,next)
	{
		console.log("private route hit");
		next();
	},
	logger:function(req,res,next)
	{
		console.log("Reqeust:"+ new Date().toString()+" => "+req.method +" "+ req.originalUrl);
		next();
	},
	pathSpecificLogger:function(req,res,next)
	{
		console.log("Path specific reqeust:"+ new Date().toString()+" => "+req.method +" "+ req.originalUrl);
		next();
	} 
}

module.exports=middleware;
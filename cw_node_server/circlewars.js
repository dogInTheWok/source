var port = process.env.VCAP_APP_PORT || 8080;

var app = require("http").createServer(handler),
	io	= require("socket.io").listen(app),
	static = require("node-static");
	
var fileServer = new static.Server("./");

app.listen(port);


function handler(request, response)
{
	request.addListener("end", function(){
		fileServer.serve(request, response);
	})
	//response.write("Hello World");
	//response.end();
}

io.sockets.on("connection", function(socket) {
	//console.log("Got a connection!");
	socket.on("mousemove", function (data) {
		//console.log(data.x);
		socket.broadcast.emit("moving", data);
		//console.log("Received mousemove");
	});
});

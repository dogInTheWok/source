var app = require('express').createServer();
app.get('/', function(request, response) {
	response.send('Hello from AppFog');
});	

app.listen(process.env.VCAP_APP_PORT || 3000);
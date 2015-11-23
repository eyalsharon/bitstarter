var fs = require('fs');
var express = require('express');

var app = express()

var data = fs.readFileSync("index.html", "utf-8");

app.get('/', function(request, response) {
  response.send(data);
});

var port = process.env.PORT || 8080
app.listen(port, function() {
  console.log("Listening on " + port);
});


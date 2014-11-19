var http = require("http");
var fs = require('fs');
var path = require('path');


// Utility function that downloads a URL and invokes
// callback with the data.
function download(url, callback) {
  http.get(url, function(res) {
    var data = "";
    res.on('data', function (chunk) {
      data += chunk;
    });
   res.on("end", function() {
      callback(data);
    });
  }).on("error", function() {
    callback(null);
  });
}


var cheerio = require("cheerio");



var express = require('express');

/*
 * body-parser is a piece of express middleware that 
 *   reads a form's input and stores it as a javascript
 *   object accessible through `req.body` 
 *
 * 'body-parser' must be installed (via `npm install --save body-parser`)
 * For more info see: https://github.com/expressjs/body-parser
 */
var bodyParser = require('body-parser');

// create our app
var app = express();
app.use(express.static(path.join(__dirname, 'client')));

// instruct the app to use the `bodyParser()` middleware for all routes
app.use(bodyParser());

// A browser's default method is 'GET', so this
// is the route that express uses when we visit
// our site initially.
app.get('/', function(req, res){
 
        fs.readFile('client/index.html',function (err, data){
            res.writeHead(200, {'Content-Type': 'text/html','Content-Length':data.length});
            res.write(data);
        });
  
});

// This route receives the posted form.
// As explained above, usage of 'body-parser' means
// that `req.body` will be filled in with the form elements
app.post('/', function(req, res){
  
  var URL = req.body.URL;
  var Patern = req.body.Pattern;
  console.log(URL);
  
          download(URL, function(data) {
            if (data) {
          //    console.log(data);
              var $ = cheerio.load(data);
              var myresponse = 'Responses:<br>';
              
              $(Patern).each(function() {
               //    console.log($(this).text());
                  myresponse = myresponse + $(this).text()+'<br>';
              });
              
              res.send(myresponse);
           }
            else console.log("error");  
          });
  

});

app.listen(8080);
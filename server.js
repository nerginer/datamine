var http = require("http");
var request = require('request');
var fs = require('fs');
var path = require('path');


var cheerio = require("cheerio");
var express = require('express');

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
  
              request({
              uri: URL,
              method: "GET",
              timeout: 1000,
              followRedirect: true,
              maxRedirects: 10
            }, function(error, response, body) {
                     if (!error && response.statusCode == 200) {
                   
          
                
                  //    console.log(data);
                      var $ = cheerio.load(body);
                      var myresponse = 'Responses:<br>';
                      
                      $(Patern).each(function() {
                       //    console.log($(this).text());
                          myresponse = myresponse + $(this).text()+'<br>';
                      });
                      
                      res.send(myresponse);
                 
                    } 
                    else {
                        res.send('unexpected error no:001');
                        request.end();
                    }
                    
    /*                request.on('error', function(e) {
                        console.error('error');
                        console.error(e);
                        request.end(); 
                    });
*/
              
            });
  
           
  
  
        
});

app.listen(8080);
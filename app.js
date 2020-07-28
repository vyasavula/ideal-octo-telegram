//jshint esversion:6
const express = require('express');
const bodyParser = require("body-parser");
const https = require("https");

const app = express();
app.use(bodyParser.urlencoded({
  extended: true
}));
//To fetch the static files we use special functionof express
app.use(express.static("public"));

//GET routes
app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html");  //this send file can be used anywhere in post also.
});

//POST routes
app.post("/", function(req, res) {
  const firstName = req.body.fname;
  const lastName = req.body.lname;
  const email = req.body.email;
  const data = {
    members: [{
      email_address: email,
      status: "subscribed",
      merge_fields: {
        FNAME: firstName,
        LNAME: lastName
      }
    }]
  };
  const jsonData = JSON.stringify(data);
  const url = 'https://us17.api.mailchimp.com/3.0/lists/b48036599e';
  const options = {
    method: "POST",
    auth: "vyas:51f36c8b45a292d3a5411f7cdf97b311-us1"
  };
  const request = https.request(url, options, function(response) {
    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    }else{
      res.sendFile(__dirname + "/failure.html");
    }
    response.on("data", function(data) {
      console.log(JSON.parse(data));
    });
  });
  request.write(jsonData);
  request.end();
});


app.post("/failure", function(req,res){
  res.redirect("/");
});






//listen
app.listen(process.env.PORT ||3000, function() { //to make it compatible for heroku.
  console.log("You have just started your server,Mate!!!!");
});

//API apiKey
//51f36c8b45a292d3a5411f7cdf97b311-us17
//// ID
//b48036599e

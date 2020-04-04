'use strict';

var express = require('express');
var mongo = require('mongodb');
var mongoose = require('mongoose');
const bodyParser = require("body-parser");
const myApp = require('./myApp');
const r = require('ramda');

var cors = require('cors');

var app = express();

// Basic Configuration 
var port = process.env.PORT || 3000;

/** this project needs a db !! **/ 
// mongoose.connect(process.env.DB_URI);
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

app.use(cors());

/** this project needs to parse POST bodies **/
// you should mount the body-parser here

app.use(bodyParser.urlencoded({ extended: false }));

app.use('/public', express.static(process.cwd() + '/public'));

// log requests
app.use(({ method, path, ip }, res, next) => {
  // console.log(`${method} ${path} - ${ip}`);
  next();
});


app.get('/', function(req, res){
  res.sendFile(process.cwd() + '/views/index.html');
});

  
// your first API endpoint... 

app.post("/api/shorturl/new", function (req, res, next) {
  // console.log(req.body)
  const shortUrl = myApp.createUrl(req.body.url);
  
  myApp.saveUrl(shortUrl);
  // const savedUrl = myApp.findUrlById(shortUrl._id, (err,data) => err ? next(err) : next(null,data)).then((err, data) => {
  const savedUrl = myApp.findUrlById(shortUrl._id).then((err, data) => {
    console.log(err,'data', data)
  });
  
  // console.log('body',req.body, 'shortUrl',shortUrl,'saved',savedUrl)
  //res.json(savedUrl);
  res.json({url: req.body.url});
});


// app.post("/api/shorturl/new", function (req, res) {
//   // console.log(req.body)
//   const shortUrl = myApp.createAndSaveUrl(req.body);
//   console.log('body',req.body, 'shortUrl',shortUrl)
//   res.json(shortUrl);
// });


app.get("*", function(req, res) {
  res.status(404).send("No url here, sorry 404");
});


app.listen(port, function () {
  console.log('Node.js listening ...');
});
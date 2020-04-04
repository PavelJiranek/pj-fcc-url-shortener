'use strict';

var express = require('express');
var mongo = require('mongodb');
var mongoose = require('mongoose');
const bodyParser = require("body-parser");
const R = require('ramda');

const myApp = require('./myApp');
const utils = require('./utils');

require('dotenv').config();
var cors = require('cors');
var app = express();

// Basic Configuration 
var port = process.env.PORT || 3000;

// mongoose.connect(process.env.DB_URI);
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(cors());

/** this project needs to parse POST bodies **/
// you should mount the body-parser here

app.use(bodyParser.urlencoded({ extended: false }));

app.use('/public', express.static(process.cwd() + '/public'));

// log requests
app.use(({method, path, ip}, res, next) => {
  // console.log(`${method} ${path} - ${ip}`);
  next();
});


app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});


// New URL endpoint
app.post("/api/shorturl/new", function (req, res, next) {
  const shortUrl = myApp.createUrl(req.body.url);

  myApp.saveUrl(shortUrl, (err, urlData) => {
    if (err) {
      console.log(`Error when saving url: ${err}`);
      return next(err);
    }
    myApp.findUrlById(utils.getUrlId(urlData), (err, savedUrlData) => {
      if (err) {
        console.log(`Created url not found with error: ${err}`);
        return next(err);
      }
      res.json(savedUrlData)
    })
  });
});

app.get("/api/admin/dropUrls", function (req, res, next) {
  myApp.removeAllUrls((err, success) => {
    if (err) {
      console.log('Err:', err);
      return next(err);
    }
    res.send(`Deleted ${success.deletedCount} urls`);
  })
});

app.get("*", function (req, res) {
  res.status(404).send("No url here, sorry 404");
});


app.listen(port, function () {
  console.log('Node.js listening ...');
});

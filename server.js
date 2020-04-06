'use strict';

const express = require('express');
const bodyParser = require("body-parser");
const cors = require('cors');

const myApp = require('./myApp');
const utils = require('./utils');

const app = express();

// Basic Configuration 
const port = process.env.PORT || 3000;

app.use(cors());

/** this project needs to parse POST bodies **/
app.use(bodyParser.urlencoded({extended: false}));

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
  const url = req.body.url;

  if (utils.isInvalidUrl(url)) {
    res.json(myApp.invalidUrl);
    return next(`Invalid url format:\n${url}`);
  }

  myApp.validateHost(url, err => {
    if (err) {
      res.json(myApp.invalidUrl);
      return next(`Invalid hostname error:\n${err}`);
    }

    const shortUrl = myApp.createUrl(url);
    myApp.saveAndSendUrl(shortUrl, res, next);
  });
});

// redirect to saved URLs
app.get("/api/shorturl/:shortUrl", function (req, res, next) {
  const shortUrl = req.params.shortUrl;
  myApp.findUrlByShortUrl(shortUrl, (err, urlData) => {
    if (err) {
      console.log(`Shortened url not found error:\n${err}`);
      return next('Shortened url not found');
    }
    const origUrl = utils.getOrigUrl(urlData);
    res.redirect(origUrl);
  })
});


app.get("/api/admin/dropUrls", function (req, res, next) {
  myApp.removeAllUrls((err, success) => {
    if (err) {
      return next(`Error when deleting urls: ${err}`);
    }
    res.send(`Deleted ${success.deletedCount} urls.
    Count reset to ${success.nextCount}`);
  })
});

app.get("*", function (req, res) {
  res.status(404).send("No url here, sorry 404");
});


app.listen(port, function () {
  console.log('Node.js listening ...');
});

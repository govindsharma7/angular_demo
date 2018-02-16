var express = require('express');
var bodyParser = require('body-parser')

var app = express();

var urlencodedParser = bodyParser.urlencoded({ extended: false })

app.set('view engine', 'ejs');

app.post('/senddata', urlencodedParser, function (req, res) {
  console.log(req.body);
  res.render('success', {data: req.body});
});

app.listen(3000);
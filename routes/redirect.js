var express = require('express');
var router = express.Router();
var urls = require('./globalUrls');

/* GET home page. */
router.get('/:id', function(req, res, next) {
  res.redirect(301, urls[req.params.id])
});

module.exports = router;

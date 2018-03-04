var express = require('express');
var router = express.Router();

var urls = require('./globalUrls')
var urlsLength = Object.keys(urls).length

var inc = urls.length

/* GET all urls or by short url */
router.get('/:id*?', function(req, res) {
  if (req.params.id) {
    let id = req.params.id
    if (urls[id]) {
      res.send({'code': 'RESPONSE_SUCCESS', 'data': urls[id]})
    } else {
      res.send({'code': 'RESPONSE_FAILED', 'message': 'Could not find the url'})
    }
  } else {
    res.send({'code': 'RESPONSE_SUCCESS', 'data': urls});    
  }
});

/* Create url with id response */
router.post('/', function(req, res) {
  if (req.body.url) {
    urls[++urlsLength] = req.body.url
    res.send({'code': 'RESPONSE_SUCCESS', 'data': {"id": urlsLength, "url": req.body.url}})
  } else {
    res.status(403).send({'code': 'RESPONSE_FAILED', 'message': 'Please provide valid url'})
  }
  res.send(req.body.url)
});

/* Delete url with id */
router.delete('/:id', function(req, res) {
  if (req.params.id) {
    delete urls[req.params.id]
    res.send({'code': 'RESPONSE_SUCCESS'})
  } else {
    res.status(403).send({'code': 'RESPONSE_FAILED', 'message': 'Could not find the url'})
  }
});

/* Update Url with same id */
router.put('/:id', function(req,res) {
  if (req.params.id) {
    urls[req.params.id] = req.body.url
    res.send({'code': 'RESPONSE_SUCCESS', 'code': {'id': req.params.id, 'url': urls[req.params.id]}})
  } else {
    res.status(403).send({'code': 'RESPONSE_FAILED', 'message': 'Could not find the url'})
  }
})


module.exports = router;

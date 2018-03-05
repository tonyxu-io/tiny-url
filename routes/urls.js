var express = require('express');
var router = express.Router();
const low = require('lowdb')
const lodashId = require('lodash-id')
const FileSync = require('lowdb/adapters/FileSync')

const adapter = new FileSync('db.json')
const db = low(adapter)

db._.mixin(lodashId)

// We need to set some default values, if the collection does not exist yet
// We also can store our collection
let urlCollection = db
  .defaults({ urls: [], count: 100000 })

/* GET all urls or by short url */
router.get('/:id*?', function(req, res) {
  if (req.params.id) {
    let url = urlCollection
      .get('urls')
      .getById(req.params.id)
      .value()
    if (url) {
      res.send({'code': 'RESPONSE_SUCCESS', 'data': url})
    } else {
      res.send({'code': 'RESPONSE_FAILED', 'message': 'Could not find the url'})
    }
  } else {
    res.send({'code': 'RESPONSE_SUCCESS', 'data': urlCollection.get('urls')});    
  }
});

/* Create url with id response */
router.post('/', function(req, res) {
  if (req.body.url) {
    // urls[++urlsLength] = req.body.url
    let count = urlCollection.get('count') + 1
    urlCollection
      .get('urls')
      .insert({ url: req.body.url, id: count })
      .write()
    urlCollection
      .update('count', n => n = count)
      .write()
    res.send({'code': 'RESPONSE_SUCCESS', 'data': {"id": count, "url": req.body.url}})
  } else {
    res.status(403).send({'code': 'RESPONSE_FAILED', 'message': 'Please provide valid url'})
  }
});

/* Delete url with id */
router.delete('/:id', function(req, res) {
  if (req.params.id) {
    // delete urls[req.params.id]
    urlCollection
      .get('urls')
      .removeById(req.params.id)
      .write()
    res.send({'code': 'RESPONSE_SUCCESS'})
  } else {
    res.status(403).send({'code': 'RESPONSE_FAILED', 'message': 'Could not find the url'})
  }
});

/* Update Url with same id */
router.put('/:id', function(req,res) {
  if (req.params.id) {
    urlCollection
      .get('urls')
      .updateById(req.params.id, {url: req.body.url})
      .write()
    res.send({'code': 'RESPONSE_SUCCESS', 'code': {'id': req.params.id, 'url': req.body.url}})
  } else {
    res.status(403).send({'code': 'RESPONSE_FAILED', 'message': 'Could not find the url'})
  }
})


module.exports = router;

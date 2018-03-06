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

/* GET home page. */
router.get('/:id', function(req, res, next) {
  let url = db
  .read()
  .get('urls')
  .getById(req.params.id)
  .value()

  res.redirect(301, url.url)
});

module.exports = router;

var co = require('co'),
    codb = require('..');

co(function * () {
  var db = yield codb('examples/simple-db');
  var doc = yield db.doc('doc1');
  var contents = yield doc.contents;

  console.log('----Doc Obj----')
  console.log(doc);
  console.log('----Doc Contents----')
  console.log(contents.toString());
  console.log('--------------------')
})();

var co = require('co'),
    codb = require('..');

co(function *() {
  var jsonDb = yield codb('examples/json-db'),
      doc = null,
      docs = [];

  jsonDb.use(function *(doc){
    var contents = new Buffer(0),
        chunk;

    while (chunk = yield doc.contents) {
      contents = Buffer.concat([contents, chunk]);
    }

    doc.contents = JSON.parse(contents.toString());
  });

  docs = yield jsonDb.docs();

  docs.forEach(function (doc) {
    console.log('id ==', doc.id);
    console.log('contents ==', doc.contents);
    console.log('------------------------------');
  });
})();

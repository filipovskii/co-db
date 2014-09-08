# co-db

[![Build
Status](https://travis-ci.org/filipovskii/co-db.svg?branch=master)](https://travis-ci.org/filipovskii/co-db)

FS-based database to use with [co](https://github.com/visionmedia/co).


## Installation

```
npm install co-db
```

## Examples

### Simple DB

```
$ cd examples/simple-db
$ tree .

.
└── doc1
```

```js
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
```

```
$ node --harmony-generators examples/simple-db.js

----Doc Obj----
{ cwd: '/path/to/co-db',
  id: 'doc1',
  base: '/path/to/co-db/examples/simple-db',
  path: '/path/to/co-db/examples/simple-db/doc1',
  contents: [Function] }
----Doc Contents----
   |
   |
   + \
   \\.G_.*=.
    `(H'/.\|
     .>' (_--.
  _=/d   ,^\
 ~~ \)-'   '
    / |
   '  '   a:f

--------------------
```

### JSON DB (middleware example)

```
$ cd examples/json-db
$ tree .

.
├── doc1.json
└── doc2.json
```

```js
// examples/json-db.js
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
```

```
$ node --harmony-generators examples/json-db.js

id == doc1.json
contents == { um: 'oh' }
------------------------------
id == doc2.json
contents == { wow: true }
------------------------------
```

## License

MIT

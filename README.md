# co-db

[![Build
Status](https://travis-ci.org/filipovskii/co-db.svg?branch=master)](https://travis-ci.org/filipovskii/co-db)

FS-based database to use with [co](https://github.com/visionmedia/co).


## Installation

```
npm install co-db
```

## Example

```
$ cd examples
$ tree .
.
└── simple-db
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

## License

MIT

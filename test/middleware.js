var co = require('co'),
    fs = require('fs-extra'),
    cofs = require('co-fs'),
    assert = require('assert'),
    codb = require('..');

describe('db', function () {

  beforeEach(function () {
    fs.mkdirpSync('test/db');
  });


  afterEach(function () {
    fs.removeSync('test/db');
  });

  describe('.use(middleware)', function () {

    it('invokes middleware, when returning a doc', function (done) {
      co(function *() {
        var db = yield codb('test/db'),
            doc = null,
            contents = null;
            contentsKeys = [];

        yield cofs.writeFile('test/db/file', '{"json": true}');
        db.use(function *(file) {
          var contents = yield file.contents;
          file.contents = JSON.parse(contents);
        });

        doc = yield db.doc('file') ;
        contents = doc.contents;
        contentsKeys = Object.keys(contents);

        assert.equal(contentsKeys.length, 1);
        assert.equal(contentsKeys[0], 'json');
        assert.equal(contents.json, true);
        done();
      })();
    })
  });
});

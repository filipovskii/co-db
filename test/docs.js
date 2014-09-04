var co = require('co'),
    fs = require('fs-extra'),
    assert = require('assert'),
    docdb = require('..');

describe('db', function () {

  beforeEach(function () {
    fs.mkdirpSync('test/nested-db/folder1');
    fs.mkdirpSync('test/nested-db/folder2');
  });


  afterEach(function () {
    fs.removeSync('test/nested-db');
  });

  function isGeneratorFunction(obj) {
    return (
      obj &&
      obj.constructor &&
      'GeneratorFunction' == obj.constructor.name
    );
  }


  describe('.doc(path)',function () {

    it('should return doc object, if exists', function (done) {
      fs.createFileSync('test/nested-db/file');
      co(function *(){
        var db = yield docdb('test/nested-db'),
            doc = yield db.doc('file');

        assert.ok(doc.path.indexOf('test/nested-db') > 0);
        assert.equal(doc.id, 'file');
        assert.ok(doc.contents);
        assert.ok(isGeneratorFunction(doc.contents));
        done();
      })();
    });

  });

});

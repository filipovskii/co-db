var co = require('co'),
    fs = require('fs-extra'),
    cofs = require('co-fs'),
    assert = require('assert'),
    codb = require('..');

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
        var db = yield codb('test/nested-db'),
            doc = yield db.doc('file');

        assert.ok(doc.path.indexOf('test/nested-db') > 0);
        assert.equal(doc.id, 'file');
        assert.ok(doc.contents);
        assert.ok(isGeneratorFunction(doc.contents));
        done();
      })();
    });


    it('should have data from file in contents', function (done) {
      co(function *() {
        var db = yield codb('test/nested-db'),
            doc,
            contents;

        yield cofs.writeFile('test/nested-db/file', 'File contents');

        doc = yield db.doc('file');
        contents = yield doc.contents;

        assert.equal('File contents', contents);
        done();
      })();
    });


    it('throws exception if file does not exist', function (done) {
      co(function * () {
        var db = yield codb('test/nested-db');

        try {
          (yield db.doc('not-exists'));
          done(new Error('Exception was not thrown!'))
        } catch (e) {
          // ok
          done();
        }
      })();
    });


    it('throws exception if file is a folder', function (done) {
      co(function * () {
        var db = yield codb('test');

        try {
          (yield db.doc('nested-db'));
          done(new Error('Exception was not thrown!'))
        } catch (e) {
          done();
        }
      })();
    });

  });


  describe('.docs()', function () {

    it('should list containing docs', function (done) {
      fs.createFileSync('test/nested-db/file1');
      fs.createFileSync('test/nested-db/file2');
      fs.createFileSync('test/nested-db/file3');

      co(function *() {
        var db = yield codb('test/nested-db'),
            docs;

        docs = yield db.docs();

        assert.equal(docs.length, 3);
        assert.equal(docs[0].id, 'file1');
        assert.equal(docs[1].id, 'file2');
        assert.equal(docs[2].id, 'file3');
        done();
      })();
    });


    it('should not list containing folders', function (done) {
      fs.mkdirpSync('test/nested-db/folder1');
      fs.mkdirpSync('test/nested-db/folder2');
      fs.createFileSync('test/nested-db/file1');

      co(function *() {
        var db = yield codb('test/nested-db'),
            docs;

        docs = yield db.docs();

        assert.equal(docs.length, 1);
        assert.equal(docs[0].id, 'file1');
        done();
      })();
    });

  });

});

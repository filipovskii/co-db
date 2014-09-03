var assert = require('assert'),
    fs = require('fs-extra'),
    docdb = require('../'),
    co = require('co');


describe('db nesting', function () {

  beforeEach(function () {
    fs.mkdirpSync('test/nested-db/folder1');
    fs.mkdirpSync('test/nested-db/folder2');
  });


  it('db.dbs() lists inner folders', function (done) {
    co(function *() {
      var db = yield docdb('test/nested-db'),
          innerDbs;

      innerDbs = yield db.dbs();
      assert.equal(innerDbs.length, 2);
      assert.equal(innerDbs[0], 'folder1');
      assert.equal(innerDbs[1], 'folder2');
    })(done);
  });


  it('db.db(key) returns nested db', function (done) {
    co(function *() {
      var db = yield docdb('test'),
          innerDb = db.db('nested-db'),
          path;

       path = yield innerDb.path();
       assert.equal(path.split('/').slice(-2).join('/'), 'test/nested-db');
    })(done);
  });


  it('db(path) throws if path does not exist', function (done) {
    co(function *() {
      try {
        var db = yield docdb('not-exists');
        done(new Error('Error not thrown'));
      } catch (e) {
        done();
      }
    })();
  });


  it('db(path) throws if path is not a directory', function (done) {
    fs.createFileSync('test/nested-db/file');

    co(function *() {
      try {
        var db = yield docdb('test/nested-db/file');
        done(new Error('Error not thrown'));
      } catch (e) {
        done();
      }
    })();
  });


  afterEach(function () {
    fs.removeSync('test/nested-db');
  });

});

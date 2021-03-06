var assert = require('assert'),
    fs = require('fs-extra'),
    codb = require('../'),
    co = require('co');


describe('db', function () {

  beforeEach(function () {
    fs.mkdirpSync('test/nested-db/folder1');
    fs.mkdirpSync('test/nested-db/folder2');
  });

  describe('.dbs()', function () {

    it('lists inner folders', function (done) {
      co(function *() {
        var db = yield codb('test/nested-db'),
            innerDbs;

        innerDbs = yield db.dbs();
        assert.equal(innerDbs.length, 2);
        assert.equal(innerDbs[0], 'folder1');
        assert.equal(innerDbs[1], 'folder2');
      })(done);
    });


    it('does not list files', function (done) {
      fs.createFileSync('test/nested-db/file');

      co(function *() {
        var db = yield codb('test/nested-db'),
            innerDbs;

        innerDbs = yield db.dbs();
        assert.equal(innerDbs.length, 2);
        assert.equal(innerDbs[0], 'folder1');
        assert.equal(innerDbs[1], 'folder2');
      })(done);
    });

  });


  describe('.db(path)', function () {

    it('returns nested db', function (done) {
      co(function *() {
        var db = yield codb('test'),
            innerDb = db.db('nested-db'),
            path;

         path = yield innerDb.path();
         assert.equal(path.split('/').slice(-2).join('/'),
           'test/nested-db');
      })(done);
    });


    it('throws if path does not exist', function (done) {
      co(function *() {
        try {
          var db = yield codb('not-exists');
          done(new Error('Error not thrown'));
        } catch (e) {
          done();
        }
      })();
    });


    it('throws if path is not a directory', function (done) {
      fs.createFileSync('test/nested-db/file');

      co(function *() {
        try {
          var db = yield codb('test/nested-db/file');
          done(new Error('Error not thrown'));
        } catch (e) {
          done();
        }
      })();
    });

  });



  afterEach(function () {
    fs.removeSync('test/nested-db');
  });

});

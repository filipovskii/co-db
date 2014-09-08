var fs = require('co-fs'),
    path = require('path'),
    co = require('co'),
    filter = require('co-filter'),
    _ = require('lodash'),
    Doc = require('./doc');

module.exports = db;

function * db(p) {
  var stats = yield fs.stat(p);

  if (!stats.isDirectory()) {
    throw new Error('Path to folder needed');
  }

  return new Db(p);
}

function Db(p) {
  this._path = p;
  this._middleware = [];
}


Db.prototype.dbs = function *() {
  var dbPath = this._path,
      names;

  names = yield fs.readdir(this._path);

  return yield filter(names, function *(name) {
    var stats = yield fs.stat(path.join(dbPath, name));
    return stats.isDirectory();
  });
};


Db.prototype.db = function (p) {
  return new Db(path.join(this._path, p));
};


Db.prototype.path = function *() {
  return yield fs.realpath(this._path);
};


Db.prototype.doc = function *(p) {
  var filePath = path.join(this._path, p),
      middleware = this._middleware.slice().reverse(),
      stream,
      stats,
      doc;

  if (!(yield fs.exists(filePath))) {
    throw new Error('Doc was not found at "' + filePath + '"');
  }

  stats = yield fs.stat(filePath);

  if (!stats.isFile()) {
    throw new Error('Doc at "' + filePath + '" is not a file');
  }

  doc = new Doc(filePath);

  while (middleware.length > 0) {
    yield middleware.pop()(doc);
  }

  return doc;
};


/**
 * Find and return all docs in path. Not recursive.
 *
 * @param {string} [.] - path to search docs
 * @return {Doc[]}
 */
Db.prototype.docs = function *(p) {
  var db = this,
      fileNames = [],
      dirPath,
      names;

  p = p || '';
  dirPath = path.join(this._path, p);
  names = yield fs.readdir(dirPath);

  fileNames = yield filter(names, function *(name) {
    var stats = yield fs.stat(path.join(dirPath, name));
    return stats.isFile();
  });


  return yield _.map(fileNames, function *(name) {
    return yield db.doc(path.join(p, name));
  });
};


Db.prototype.use = function (f) {
  this._middleware.push(f);
  return db;
};

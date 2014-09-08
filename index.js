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
      middleware = this._middleware.slice(),
      stream,
      stats,
      doc;

  if (!(yield fs.exists(filePath))) {
    throw new Error('Doc was not found at "' + fullPath + '"');
  }

  stats = yield fs.stat(filePath);

  if (!stats.isFile()) {
    throw new Error('Doc at "' + fullPath + '" is not a file');
  }

  doc = new Doc(filePath);

  while (middleware.length > 0) {
    yield middleware.pop()(doc);
  }

  return doc;
};


Db.prototype.docs = function *() {
  var db = this,
      fileNames = [],
      names = yield fs.readdir(this._path);

  fileNames = yield filter(names, function *(name) {
    var stats = yield fs.stat(path.join(db._path, name));
    return stats.isFile();
  });


  return yield _.map(fileNames, function *(name) {
    return yield db.doc(name);
  });
};


Db.prototype.use = function (f) {
  this._middleware.push(f);
  return db;
};

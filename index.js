var fs = require('co-fs'),
    path = require('path'),
    co = require('co'),
    filter = require('co-filter'),
    _ = require('lodash');

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
      fullPath = path.join(process.cwd(), filePath),
      dirPath = path.dirname(fullPath),
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

  stream = fs.createReadStream(filePath);

  return {
    cwd: process.cwd(),
    id: path.relative(dirPath, fullPath),
    base: dirPath,
    path: fullPath,
    contents: stream
  }
};

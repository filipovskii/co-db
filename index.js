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

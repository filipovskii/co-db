var fs = require('co-fs'),
    path = require('path');

module.exports = Doc;


function Doc(filePath) {
  var fullPath = path.join(process.cwd(), filePath),
      dirPath = path.dirname(fullPath);

  this.cwd = process.cwd();
  this.id = path.relative(dirPath, fullPath);
  this.base = dirPath;
  this.path = fullPath;
  this.contents = fs.createReadStream(filePath);
}

var fs = require('fs');


module.exports = function (filePath, opt) {
    return fs.readFileSync(filePath, opt || 'utf8').split('\n');
};
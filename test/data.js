var fs = require('fs');

function getData(dataType, direction) {
    var data = fs.readFileSync('test/data/' + dataType + '/' + direction + '.json', {
        encoding: 'utf-8'
    });

    return JSON.parse(data);
};

exports.input = function(dataType) {
    return getData(dataType, 'input');
};

exports.output = function(dataType) {
    return getData(dataType, 'output');
};
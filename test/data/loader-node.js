function getData(dataType, direction) {
    return require(__dirname + '/' + dataType + '/' + direction, {
        encoding: 'utf-8'
    })[dataType][direction];
};

exports.input = function(dataType) {
    return getData(dataType, 'input');
};

exports.output = function(dataType) {
    return getData(dataType, 'output');
};

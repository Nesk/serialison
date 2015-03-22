var exports = {};

var data = {

    getData: function(dataType, direction) {
        return exports[dataType][direction];
    },

    input: function(dataType) {
        return this.getData(dataType, 'input');
    },

    output: function(dataType) {
        return this.getData(dataType, 'output');
    }

};

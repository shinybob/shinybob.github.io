var CompactArray = {};

CompactArray.compact = function(array) {
    for (var j = 0; j < array.length; j++) {
        if (array[j] == null) {
            array.splice(j, 1);
            j--;
        }
    }
};

module.exports = CompactArray;
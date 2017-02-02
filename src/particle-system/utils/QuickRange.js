var QuickRange = {};

QuickRange.range = function(min, max, round) {
    var value = min + (Math.random() * (max - min));
    if(round) value = Math.round(value);
    return value;
};

module.exports = QuickRange;
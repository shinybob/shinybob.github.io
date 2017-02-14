function Range(min, max, round) {
    this.min = min;
    this.max = max;
    this.round = round;
}

Range.prototype.range = function() {
    var value = this.min + (Math.random() * (this.max - this.min));
    if(this.round) value = Math.round(value);
    return value;
};

module.exports = Range;
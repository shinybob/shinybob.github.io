var QuickRange = require('../particle-system/utils/QuickRange');

var FireworkPositions = {};

FireworkPositions.launchPosition = function() {
    var position = {};
    position.x = (window.innerWidth / 2) + QuickRange.range(-50, 50);
    position.y = window.innerHeight;
    return position;
};

FireworkPositions.burstPosition = function() {
    var position = {};
    position.x = (window.innerWidth / 2) + QuickRange.range(-300, 300);
    position.y = QuickRange.range(100, 300);
    return position;
};

module.exports = FireworkPositions;
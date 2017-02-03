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
    position.x = (window.innerWidth / 2) + QuickRange.range((-window.innerWidth / 3), (window.innerWidth / 3));
    position.y = QuickRange.range(100, 200);
    return position;
};

module.exports = FireworkPositions;
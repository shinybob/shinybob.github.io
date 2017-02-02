var QuickRange = require('../utils/QuickRange');
var Behaviour = {};

Behaviour.reset = function(particle) {
};

Behaviour.update = function(particle) {
    particle.direction += QuickRange.range(-1, 1);
};

module.exports = Behaviour;
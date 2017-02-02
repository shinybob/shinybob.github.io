var QuickRange = require('../utils/QuickRange');
var Behaviour = {};

Behaviour.reset = function(particle) {
    particle.rotationSpeed = QuickRange.range(.5, 2);
};

Behaviour.update = function(particle) {
    particle.rotation += particle.rotationSpeed;
};

module.exports = Behaviour;
var QuickRange = require('../utils/QuickRange');
var Behaviour = {};

Behaviour.reset = function(particle) {
    particle.spriralRotation = QuickRange.range(0, Math.PI * 2);
    particle.spiralRotationSpeed = .1;//QuickRange.range(.02, .05);
    particle.spiralDistance = 2;//QuickRange.range(-2, 2);
};

Behaviour.update = function(particle) {
    particle.spriralRotation += particle.spiralRotationSpeed;
    particle.x += (Math.sin(particle.spriralRotation) * particle.spiralDistance);
    particle.y += (-Math.cos(particle.spriralRotation) * particle.spiralDistance);
};

module.exports = Behaviour;
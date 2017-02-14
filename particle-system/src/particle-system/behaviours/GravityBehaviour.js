var Behaviour = {};

Behaviour.reset = function(particle) {
};

Behaviour.update = function(particle) {
    particle.y += particle.gravity;
};

module.exports = Behaviour;
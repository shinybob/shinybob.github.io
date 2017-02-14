var Behaviour = {};

Behaviour.reset = function(particle) {
};

Behaviour.update = function(particle) {
    particle.speed *= particle.decay;
};

module.exports = Behaviour;
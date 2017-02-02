var Behaviour = {};

Behaviour.reset = function(particle) {
};

Behaviour.update = function(particle) {
    particle.x += particle.speed * Math.sin(particle.direction);
    particle.y += particle.speed * -Math.cos(particle.direction);
};

module.exports = Behaviour;
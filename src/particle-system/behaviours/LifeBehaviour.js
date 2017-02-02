var Behaviour = {};

Behaviour.reset = function(particle) {
};

Behaviour.update = function(particle) {
    if(particle.life.lifeDuration == 0) {
        if(particle.life.fadeDuration > 0) {
            particle.alpha -= particle.fadePerFrame;
            particle.life.fadeDuration--;
        } else {
            particle.dead = true;
        }
    } else {
        particle.life.lifeDuration--;
    }
};

module.exports = Behaviour;
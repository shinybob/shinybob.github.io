var Particle = require('./Particle');

var ParticlePool = {};
var pool = [];

ParticlePool.addParticles = function(qty) {
    for(var i = 0; i < qty; i++) {
        pool.push(new Particle());
    }
};

ParticlePool.getParticle = function() {
    if(pool.length > 0) {
        return pool.pop();
    }

    return new Particle();
};

ParticlePool.returnParticle = function(particle) {
    pool.push(particle);
};

module.exports = ParticlePool;
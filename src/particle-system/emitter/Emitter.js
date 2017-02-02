var ParticlePool = require('../particle/ParticlePool');
var QuickRange = require('../utils/QuickRange');
var CompactArray = require('../utils/CompactArray');

function Emitter(stage, particleSettings, emitterSettings) {
    this.stage = stage;
    this.dead = false;
    this.adding = 0;
    this.particleSettings = particleSettings;
    this.emitterSettings = emitterSettings;
    this.range = new Range();

    ParticlePool.addParticles(this.emitterSettings.quantity);

    this.particles = [];
}

Emitter.prototype.start = function() {
    for(var i = 0; i < this.emitterSettings.getQuantity(); i++) {
        var delay = this.emitterSettings.getSpawnDelay();
        this.adding++;
        if(delay > 0) {
            setTimeout(this.addParticle.bind(this), delay)
        } else {
            this.addParticle();
        }
    }
};

Emitter.prototype.addParticle = function() {
    var particle = ParticlePool.getParticle();
    this.updateParticle(particle);
    this.particles.push(particle);
    this.stage.addChild(particle);
    this.adding--;
};

Emitter.prototype.updateParticle = function(particle) {
    particle.reset(this.particleSettings, this.getSpawnPosition());
};

Emitter.prototype.getSpawnPosition = function () {
    var bounds = this.emitterSettings.getBounds();
    var xPos = this.x;
    var yPos = this.y;

    if(bounds.type === "POINT") {
        // Do nothing
    } else if(bounds.type === "CIRCLE") {
        var angle = QuickRange.range(0, Math.PI * 2);
        xPos += Math.sin(angle) * QuickRange.range(0, bounds.radius);
        yPos += Math.cos(angle) * QuickRange.range(0, bounds.radius);
    } else if(bounds.type === "RECTANGLE") {
        xPos += QuickRange.range(-bounds.width / 2, bounds.width / 2);
        yPos += QuickRange.range(-bounds.height / 2, bounds.height / 2);
    }

    return {x:xPos, y:yPos};
};

Emitter.prototype.getActiveParticles = function() {
    return this.particles;
};

Emitter.prototype.setDeadWhenEmpty = function(value) {
    this.deadWhenEmpty = value;
};

Emitter.prototype.isDead = function() {
    return this.dead;
};

Emitter.prototype.stopRespawn = function() {
    this.emitterSettings.setRespawn(false);
};

Emitter.prototype.update = function() {
    var particle;
    var needsCompacting;

    for(var i = 0; i < this.particles.length; i++) {
        particle = this.particles[i];

        if(particle.dead) {
            if(this.emitterSettings.getRespawn()) {
                this.updateParticle(particle);
            } else {
                this.stage.removeChild(particle);
                ParticlePool.returnParticle(particle);
                this.particles[i] = null;
                needsCompacting = true;
            }
        } else {
            particle.update();
        }
    }

    if(needsCompacting) {
        CompactArray.compact(this.particles);
    }

    if(this.deadWhenEmpty && this.particles.length === 0 && this.adding === 0) {
        this.dead = true;
    }
};

module.exports = Emitter;
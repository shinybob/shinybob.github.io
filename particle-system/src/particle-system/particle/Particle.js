Particle.constructor = Particle;
Particle.prototype = Object.create(PIXI.Sprite.prototype);

function Particle() {
    PIXI.Sprite.call(this);
    this.anchor.x = 0.5;
    this.anchor.y = 0.5;
}

Particle.prototype.reset = function(settings, position) {
    this.dead = false;
    this.speed = settings.getSpeed();
    this.direction = settings.getDirection();
    this.alpha =  settings.getAlpha();
    this.rotation =  settings.getRotation();
    this.texture = settings.getTexture();
    this.gravity = settings.getGravity();
    this.decay = settings.getDecay();
    this.life = settings.getLife();
    this.scale.x = this.scale.y = settings.getScale();
    this.behaviours = settings.getBehaviours();

    for(var i = 0; i < this.behaviours.length; i++) {
        this.behaviours[i].reset(this);
    }

    this.x = this.startX = position.x;
    this.y = this.startY = position.y;

    this.fadePerFrame = this.alpha / this.life.fadeDuration;
};

Particle.prototype.update = function() {
    for(var i = 0; i < this.behaviours.length; i++) {
        this.behaviours[i].update(this);
    }
};

module.exports = Particle;
Fire.constructor = Fire;
Fire.prototype = Object.create(PIXI.Container.prototype);

var Emitter = require('./../particle-system/emitter/Emitter');
var EmitterSettings = require('./../particle-system/emitter/EmitterSettings');
var ParticleSettings = require('./../particle-system/particle/ParticleSettings');
var TextureGenerator = require('./../particle-system/utils/TextureGenerator');
var VelocityBehaviour = require('./../particle-system/behaviours/VelocityBehaviour');
var LifeBehaviour = require('./../particle-system/behaviours/LifeBehaviour');
var SpiralBehaviour = require('./../particle-system/behaviours/SpiralBehaviour');
var GravityBehaviour = require('./../particle-system/behaviours/GravityBehaviour');
var RotationBehaviour = require('./../particle-system/behaviours/RotationBehaviour');
var QuickRange = require('./../particle-system/utils/QuickRange');

function Fire() {
    PIXI.Container.call(this);

    this.emitters = [];
}

Fire.prototype.getFlameEffect = function() {
    var particleSettings = new ParticleSettings();
    particleSettings.setSpeed(1, 4);
    particleSettings.setDirection(0, 0);
    particleSettings.setLife(5, 10, 10, 20);
    particleSettings.setScale(2, 4);
    particleSettings.addBehaviour(VelocityBehaviour);
    particleSettings.addBehaviour(LifeBehaviour);
    particleSettings.addTexture(TextureGenerator.circle(1, 0xffab37, true));
    particleSettings.addTexture(TextureGenerator.circle(1, 0xfff191, true));

    var emitterSettings = new EmitterSettings();
    emitterSettings.setQuantity(150);
    emitterSettings.setBounds({type:"RECTANGLE", width:30, height:1});
    emitterSettings.setRespawn(true);
    emitterSettings.setSpawnDelay(0, 1000);

    return new Emitter(this, particleSettings, emitterSettings);
};

Fire.prototype.getSparksEffect = function() {
    var particleSettings = new ParticleSettings();
    particleSettings.setLife(5, 50, 10, 50);
    particleSettings.setScale(.2, 1);
    particleSettings.setGravity(-1, -2);
    particleSettings.addBehaviour(GravityBehaviour);
    particleSettings.addBehaviour(SpiralBehaviour);
    particleSettings.addBehaviour(LifeBehaviour);
    particleSettings.addTexture(TextureGenerator.circle(2, 0xffab37, true));
    particleSettings.addTexture(TextureGenerator.circle(1, 0xffffff, true));
    particleSettings.addTexture(TextureGenerator.circle(1, 0xffffff));

    var emitterSettings = new EmitterSettings();
    emitterSettings.setQuantity(20);
    emitterSettings.setBounds({type:"RECTANGLE", width:50, height:1});
    emitterSettings.setRespawn(true);
    emitterSettings.setSpawnDelay(0, 2000);

    return new Emitter(this, particleSettings, emitterSettings);
};

Fire.prototype.getSmokeEffect = function() {
    var particleSettings = new ParticleSettings();
    particleSettings.setLife(5, 5, 100, 200);
    particleSettings.setScale(5, 10);
    particleSettings.setAlpha(.1, .3);
    particleSettings.setGravity(-1, -2);
    particleSettings.addBehaviour(GravityBehaviour);
    particleSettings.addBehaviour(RotationBehaviour);
    particleSettings.addBehaviour(LifeBehaviour);
    particleSettings.addTexture(TextureGenerator.circle(1, 0xffffff, true));

    var emitterSettings = new EmitterSettings();
    emitterSettings.setQuantity(40);
    emitterSettings.setBounds({type:"RECTANGLE", width:50, height:1});
    emitterSettings.setRespawn(true);
    emitterSettings.setSpawnDelay(0, 1000);

    return new Emitter(this, particleSettings, emitterSettings);
};

Fire.prototype.start = function() {
    var smokeEffect = this.getSmokeEffect();
    var flameEffect = this.getFlameEffect();
    var sparkEffect = this.getSparksEffect();

    flameEffect.x = sparkEffect.x = smokeEffect.x = (window.innerWidth / 2) + QuickRange.range(-300, 300);
    flameEffect.y = sparkEffect.y = smokeEffect.y = window.innerHeight - QuickRange.range(200, 400);

    this.emitters.push(flameEffect);
    this.emitters.push(sparkEffect);
    this.emitters.push(smokeEffect);

    flameEffect.start();
    sparkEffect.start();
    smokeEffect.start();
};

Fire.prototype.update = function() {
    for(var i = 0; i < this.emitters.length; i++) {
        this.emitters[i].update();
    }
};

module.exports = Fire;
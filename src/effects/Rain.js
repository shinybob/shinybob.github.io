Rain.constructor = Rain;
Rain.prototype = Object.create(PIXI.Container.prototype);

var Emitter = require('./../particle-system/emitter/Emitter');
var EmitterSettings = require('./../particle-system/emitter/EmitterSettings');
var ParticleSettings = require('./../particle-system/particle/ParticleSettings');
var TextureGenerator = require('./../particle-system/utils/TextureGenerator');
var VelocityBehaviour = require('./../particle-system/behaviours/VelocityBehaviour');
var LifeBehaviour = require('./../particle-system/behaviours/LifeBehaviour');
var SpiralBehaviour = require('./../particle-system/behaviours/SpiralBehaviour');
var GravityBehaviour = require('./../particle-system/behaviours/GravityBehaviour');

function Rain() {
    PIXI.Container.call(this);

    this.trailEmitters = [];

    this.setupBurstEffect();
}

Rain.prototype.setupBurstEffect = function() {
    var particleSettings = new ParticleSettings();
    particleSettings.setLife(40, 300, 10, 50);
    particleSettings.setSpeed(5, 5);
    particleSettings.setDirection(Math.PI, Math.PI * 2);
    particleSettings.setScale(.2, 1);
    particleSettings.setGravity(1, 2);
    particleSettings.addBehaviour(GravityBehaviour);
    particleSettings.addBehaviour(SpiralBehaviour);
    particleSettings.addBehaviour(LifeBehaviour);
    particleSettings.addTexture(TextureGenerator.circle(2, 0xffffff, true));
    particleSettings.addTexture(TextureGenerator.circle(2, 0x91ffa1, true));
    particleSettings.addTexture(TextureGenerator.circle(2, 0x91ffa1, true));
    particleSettings.addTexture(TextureGenerator.circle(2, 0x66ccff, true));
    particleSettings.addTexture(TextureGenerator.circle(2, 0xccff66, true));
    particleSettings.addTexture(TextureGenerator.circle(2, 0xff6fcf, true));

    var emitterSettings = new EmitterSettings();
    emitterSettings.setQuantity(1000);
    emitterSettings.setBounds({type:"RECTANGLE", width:window.innerWidth, height:1});
    emitterSettings.setRespawn(true);
    emitterSettings.setSpawnDelay(0, 2000);

    this.burstEmitter = new Emitter(this, particleSettings, emitterSettings);
};


Rain.prototype.start = function() {
    this.burstEmitter.x = window.innerWidth / 2;
    this.burstEmitter.y = 0;

    this.burstEmitter.start();
};

Rain.prototype.update = function() {
    this.burstEmitter.update();
};

module.exports = Rain;
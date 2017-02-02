Firework1.constructor = Firework1;
Firework1.prototype = Object.create(PIXI.Container.prototype);

var Emitter = require('./../particle-system/emitter/Emitter');
var EmitterSettings = require('./../particle-system/emitter/EmitterSettings');
var ParticleSettings = require('./../particle-system/particle/ParticleSettings');
var TextureGenerator = require('./../particle-system/utils/TextureGenerator');
var VelocityBehaviour = require('./../particle-system/behaviours/VelocityBehaviour');
var LifeBehaviour = require('./../particle-system/behaviours/LifeBehaviour');
var RotationBehaviour = require('./../particle-system/behaviours/RotationBehaviour');
var WanderBehaviour = require('./../particle-system/behaviours/WanderBehaviour');
var RippleBehaviour = require('./../particle-system/behaviours/RippleBehaviour');
var FireworkPositions = require('./FireworkPositions');
var CompactArray = require('./../particle-system/utils/CompactArray');

function Firework1() {
    PIXI.Container.call(this);

    this.trailEmitters = [];

    this.setupSmokeEffect();
    this.setupBurstEffect();
}

Firework1.prototype.setupSmokeEffect = function() {
    var particleSettings = new ParticleSettings();
    particleSettings.setSpeed(.1, .2);
    particleSettings.setDirection(0, Math.PI * 2);
    particleSettings.setLife(20, 40, 10, 20);
    particleSettings.setAlpha(.05, .15);
    particleSettings.setScale(10, 20);
    particleSettings.addBehaviour(VelocityBehaviour);
    particleSettings.addBehaviour(LifeBehaviour);
    particleSettings.addBehaviour(RotationBehaviour);
    particleSettings.addTexture(TextureGenerator.circle(2, 0xffffff, true));
    particleSettings.addTexture(TextureGenerator.circle(2, 0x91ffa1, true));

    var emitterSettings = new EmitterSettings();
    emitterSettings.setQuantity(20);
    emitterSettings.setBounds({type:"CIRCLE", radius:80});

    this.smokeEmitter = new Emitter(this, particleSettings, emitterSettings);
};

Firework1.prototype.setupBurstEffect = function() {
    var particleSettings = new ParticleSettings();
    particleSettings.setSpeed(2, 2);
    particleSettings.setDirection(0, Math.PI * 2);
    particleSettings.setLife(40, 100, 0, 0);
    particleSettings.setScale(.5, 1.5);
    particleSettings.addBehaviour(VelocityBehaviour);
    particleSettings.addBehaviour(WanderBehaviour);
    particleSettings.addBehaviour(LifeBehaviour);
    particleSettings.addTexture(TextureGenerator.circle(2, 0xffffff, true));
    particleSettings.addTexture(TextureGenerator.circle(2, 0x91ffa1, true));

    var emitterSettings = new EmitterSettings();
    emitterSettings.setQuantity(100);

    this.burstEmitter = new Emitter(this, particleSettings, emitterSettings);
};

Firework1.prototype.getTrailEmitter = function() {
    var trailParticleSettings = new ParticleSettings();
    trailParticleSettings.setLife(3, 8, 1, 20);
    trailParticleSettings.setAlpha(.1, .5);
    trailParticleSettings.addBehaviour(LifeBehaviour);
    trailParticleSettings.addTexture(TextureGenerator.circle(1, 0xf2ffe2, true));
    trailParticleSettings.addTexture(TextureGenerator.circle(1, 0xf5ffa6, true, 4));
    trailParticleSettings.addTexture(TextureGenerator.circle(2, 0xf5ffa6, true, 8));

    var trailEmitterSettings = new EmitterSettings();
    trailEmitterSettings.setQuantity(100);
    trailEmitterSettings.setRespawn(true);

    return new Emitter(this, trailParticleSettings, trailEmitterSettings);
};

Firework1.prototype.start = function() {
    var trailEmitter = this.getTrailEmitter();
    var launchPosition = FireworkPositions.launchPosition();
    var burstPosition = FireworkPositions.burstPosition();

    trailEmitter.x = launchPosition.x;
    trailEmitter.y = launchPosition.y;
    trailEmitter.start();

    this.trailEmitters.push(trailEmitter);

    var callback = this.trailComplete.bind(this);

    new TWEEN.Tween(trailEmitter)
        .to({x : burstPosition.x, y : burstPosition.y}, 2000)
        .easing(TWEEN.Easing.Cubic.In)
        .start()
        .onComplete(function(){ callback(trailEmitter) });
};

Firework1.prototype.trailComplete = function(trailEmitter) {
    this.smokeEmitter.x = this.burstEmitter.x = trailEmitter.x;
    this.smokeEmitter.y = this.burstEmitter.y = trailEmitter.y;

    this.smokeEmitter.start();
    this.burstEmitter.start();

    RippleBehaviour.startFlash(1500);
    trailEmitter.stopRespawn();
    trailEmitter.setDeadWhenEmpty(true);
};

Firework1.prototype.update = function() {
    this.smokeEmitter.update();
    this.burstEmitter.update();

    var needsCompacting = false;

    for(var i = 0; i <  this.trailEmitters.length; i++) {
        this.trailEmitters[i].update();

        if(this.trailEmitters[i].isDead()) {
            this.trailEmitters[i] = null;
            needsCompacting = true;
        }
    }

    if(needsCompacting) {
        CompactArray.compact(this.trailEmitters);
    }
};

module.exports = Firework1;
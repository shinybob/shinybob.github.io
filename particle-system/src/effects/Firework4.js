Firework4.constructor = Firework4;
Firework4.prototype = Object.create(PIXI.Container.prototype);

var Emitter = require('./../particle-system/emitter/Emitter');
var EmitterSettings = require('./../particle-system/emitter/EmitterSettings');
var ParticleSettings = require('./../particle-system/particle/ParticleSettings');
var TextureGenerator = require('./../particle-system/utils/TextureGenerator');
var VelocityBehaviour = require('./../particle-system/behaviours/VelocityBehaviour');
var LifeBehaviour = require('./../particle-system/behaviours/LifeBehaviour');
var GravityBehaviour = require('./../particle-system/behaviours/GravityBehaviour');
var RotationBehaviour = require('./../particle-system/behaviours/RotationBehaviour');
var DecayBehaviour = require('./../particle-system/behaviours/DecayBehaviour');
var FireworkPositions = require('./FireworkPositions');
var CompactArray = require('./../particle-system/utils/CompactArray');
var RippleBehaviour = require('./../particle-system/behaviours/RippleBehaviour');

function Firework4() {
    PIXI.Container.call(this);

    this.trailEmitters = [];

    this.setupSmokeEffect();
    this.setupBurstEffect();
}

Firework4.prototype.setupSmokeEffect = function() {
    var particleSettings = new ParticleSettings();
    particleSettings.setSpeed(.1, .2);
    particleSettings.setDirection(0, Math.PI * 2);
    particleSettings.setLife(20, 40, 10, 20);
    particleSettings.setAlpha(.1, .2);
    particleSettings.setScale(10, 15);
    particleSettings.addBehaviour(VelocityBehaviour);
    particleSettings.addBehaviour(LifeBehaviour);
    particleSettings.addBehaviour(RotationBehaviour);
    particleSettings.addTexture(TextureGenerator.circle(3, 0xffffff, false, 2));
    particleSettings.addTexture(TextureGenerator.circle(3, 0xc3e8be, true, 2));
    particleSettings.addTexture(TextureGenerator.circle(3, 0xbdfab0, false, 2));
    particleSettings.addTexture(TextureGenerator.circle(3, 0xcaf977, false, 2));
    particleSettings.addTexture(TextureGenerator.circle(3, 0x5afa9b, false, 2));

    var emitterSettings = new EmitterSettings();
    emitterSettings.setQuantity(20);
    emitterSettings.setBounds({type:"CIRCLE", radius:120});

    this.smokeEmitter = new Emitter(this, particleSettings, emitterSettings);
};

Firework4.prototype.setupBurstEffect = function() {
    var particleSettings = new ParticleSettings();
    particleSettings.setSpeed(2, 15);
    particleSettings.setDirection(0, Math.PI * 2);
    particleSettings.setLife(30, 60, 10, 30);
    particleSettings.setScale(.4, 1.2);
    particleSettings.setDecay(.91, .91);
    particleSettings.setGravity(.1, 1);
    particleSettings.addBehaviour(VelocityBehaviour);
    particleSettings.addBehaviour(LifeBehaviour);
    particleSettings.addBehaviour(GravityBehaviour);
    particleSettings.addBehaviour(DecayBehaviour);
    particleSettings.addTexture(TextureGenerator.circle(3, 0xc3e8be, true));
    particleSettings.addTexture(TextureGenerator.circle(3, 0xbdfab0, true));
    particleSettings.addTexture(TextureGenerator.circle(3, 0xcaf977, true));

    var emitterSettings = new EmitterSettings();
    emitterSettings.setQuantity(100);

    this.burstEmitter = new Emitter(this, particleSettings, emitterSettings);
};

Firework4.prototype.getSparkleEmitter = function() {
    var particleSettings = new ParticleSettings();
    particleSettings.setDirection(0, Math.PI * 2);
    particleSettings.setLife(2, 8, 0, 0);
    particleSettings.setScale(.4, 1);
    particleSettings.setGravity(1, 1);
    particleSettings.addBehaviour(VelocityBehaviour);
    particleSettings.addBehaviour(LifeBehaviour);
    particleSettings.addBehaviour(GravityBehaviour);
    particleSettings.addTexture(TextureGenerator.circle(2, 0xffffff, true));
    particleSettings.addTexture(TextureGenerator.circle(2, 0xffffff, true, 6));

    var emitterSettings = new EmitterSettings();
    emitterSettings.setQuantity(300);
    emitterSettings.setSpawnDelay(500, 2500);
    emitterSettings.setBounds({type:"CIRCLE", radius:180});

    return new Emitter(this, particleSettings, emitterSettings);
};

Firework4.prototype.getTrailEmitter = function() {
    var trailParticleSettings = new ParticleSettings();
    trailParticleSettings.setLife(3, 8, 1, 20);
    trailParticleSettings.setAlpha(.1, .5);
    trailParticleSettings.addBehaviour(LifeBehaviour);
    trailParticleSettings.addTexture(TextureGenerator.circle(1, 0x80ffea, true));
    trailParticleSettings.addTexture(TextureGenerator.circle(1, 0xb5fff2, true, 4));
    trailParticleSettings.addTexture(TextureGenerator.circle(2, 0xFFFFFF, true, 8));

    var trailEmitterSettings = new EmitterSettings();
    trailEmitterSettings.setQuantity(100);
    trailEmitterSettings.setRespawn(true);

    return new Emitter(this, trailParticleSettings, trailEmitterSettings);
};


Firework4.prototype.start = function() {
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

Firework4.prototype.trailComplete = function(trailEmitter) {
    var sparkleEmitter = this.getSparkleEmitter();
    this.trailEmitters.push(sparkleEmitter);
    this.smokeEmitter.x = this.burstEmitter.x = sparkleEmitter.x = trailEmitter.x;
    this.smokeEmitter.y = this.burstEmitter.y = sparkleEmitter.y = trailEmitter.y;

    this.smokeEmitter.start();
    this.burstEmitter.start();
    sparkleEmitter.start();

    RippleBehaviour.startFlash(1500);
    trailEmitter.stopRespawn();
    trailEmitter.setDeadWhenEmpty(true);
    sparkleEmitter.setDeadWhenEmpty(true);
};

Firework4.prototype.update = function() {
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

module.exports = Firework4;
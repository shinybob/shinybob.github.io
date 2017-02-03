ElementalDragon.constructor = ElementalDragon;
ElementalDragon.prototype = Object.create(PIXI.Container.prototype);

var Emitter = require('./../particle-system/emitter/Emitter');
var EmitterSettings = require('./../particle-system/emitter/EmitterSettings');
var ParticleSettings = require('./../particle-system/particle/ParticleSettings');
var TextureGenerator = require('./../particle-system/utils/TextureGenerator');
var LifeBehaviour = require('./../particle-system/behaviours/LifeBehaviour');
var VelocityBehaviour = require('./../particle-system/behaviours/VelocityBehaviour');
var Geometry = require('./../particle-system/utils/Geometry');

function ElementalDragon() {
    PIXI.Container.call(this);

    this.trailEmitters = [];

    this.setupBodyParticles();
    this.setupBodySmoke();
    this.setupHeadAndTail();

    this.dragonRotationX = 0;
    this.dragonRotationY = 0;
    this.mouseTrail = false;
}

ElementalDragon.prototype.setupHeadAndTail = function() {
    this.head = new PIXI.Sprite.fromImage('../resources/dragonHead.png');
    this.head.anchor.y = .5;
    this.head.anchor.x = .5;
};

ElementalDragon.prototype.setupBodyParticles = function() {
    var particleSettings = new ParticleSettings();
    particleSettings.setLife(50, 100, 10, 50);
    particleSettings.setSpeed(.2, .5);
    particleSettings.setDirection(-Math.PI * 2, Math.PI * 2);
    particleSettings.setScale(.2, 1.5);
    particleSettings.setRotation(-Math.PI * 2, Math.PI * 2);
    particleSettings.addBehaviour(VelocityBehaviour);
    particleSettings.addBehaviour(LifeBehaviour);
    particleSettings.addBehaviour(RotationBehaviour);
    particleSettings.addTexture(TextureGenerator.circle(2, 0xffffff, true));
    particleSettings.addTexture(TextureGenerator.circle(1, 0xffffff, true));

    var emitterSettings = new EmitterSettings();
    emitterSettings.setQuantity(300);
    emitterSettings.setRespawn(true);
    emitterSettings.setBounds({type:"CIRCLE", radius:"20"});
    emitterSettings.setSpawnDelay(0, 1000);

    this.bodyParticlesEmitter = new Emitter(this, particleSettings, emitterSettings);
};

ElementalDragon.prototype.setupBodySmoke = function() {
    var particleSettings = new ParticleSettings();
    particleSettings.setLife(50, 100, 0, 0);
    particleSettings.setSpeed(.1, .2);
    particleSettings.setDirection(-Math.PI * 2, Math.PI * 2);
    particleSettings.setScale(.5, 1);
    particleSettings.setAlpha(.01, .1);
    particleSettings.setRotation(-Math.PI * 2, Math.PI * 2);
    particleSettings.addBehaviour(VelocityBehaviour);
    particleSettings.addBehaviour(LifeBehaviour);
    particleSettings.addBehaviour(RotationBehaviour);
    particleSettings.addBehaviour(TintDragonBodyBehaviour);
    particleSettings.addTexture(PIXI.loader.resources['smoke1'].texture);
    particleSettings.addTexture(PIXI.loader.resources['smoke2'].texture);
    particleSettings.addTexture(PIXI.loader.resources['smoke3'].texture);
    particleSettings.addTexture(PIXI.loader.resources['smoke4'].texture);

    var emitterSettings = new EmitterSettings();
    emitterSettings.setQuantity(600);
    emitterSettings.setRespawn(true);
    emitterSettings.setBounds({type:"CIRCLE", radius:"20"});
    emitterSettings.setSpawnDelay(0, 1000);

    this.bodySmokeEmitter = new Emitter(this, particleSettings, emitterSettings);
};

ElementalDragon.prototype.start = function() {
    if(this.started !== true) {
        this.started = true;
        this.pos = {x:window.innerWidth / 2, y:window.innerHeight / 2};
        this.bodyParticlesEmitter.start();
        this.bodySmokeEmitter.start();
        this.addChild(this.head);
        this.headTween = new TWEEN.Tween(this.pos);
    } else {
        this.mouseTrail = true;
    }
};

ElementalDragon.prototype.startMouseTrail = function() {
    this.mouseTrail = true;
};

ElementalDragon.prototype.getPosition = function() {
    var target = {};

    if(this.mouseTrail) {
        target = renderer.plugins.interaction.mouse.global;
    } else {
        this.dragonRotationX += .04;
        this.dragonRotationY += .02;
        target.x = (window.innerWidth / 2) + Math.sin(this.dragonRotationX) * 200;
        target.y = (window.innerHeight / 2) + Math.cos(this.dragonRotationY) * 200;
        target.rotation = Geometry.angleBetweenPointsRadians(target, {x:this.head.x, y:this.head.y});
    }

    return target;
};

ElementalDragon.prototype.update = function() {
    var target = this.getPosition();

    this.bodyParticlesEmitter.update();
    this.bodySmokeEmitter.update();

    if(this.headTween) {
        this.headTween.to(target, 100);
        this.headTween.start();
        this.head.x = this.pos.x;
        this.head.y = this.pos.y;
        this.head.rotation = Geometry.angleBetweenPointsRadians(target, {x:this.head.x, y:this.head.y});

        var switchAngle = Math.PI/2;

        if(this.head.rotation < -switchAngle || this.head.rotation > switchAngle) {
            this.head.scale.y = -switchAngle
        } else {
            this.head.scale.y = switchAngle
        }

        this.bodyParticlesEmitter.x = this.pos.x;
        this.bodyParticlesEmitter.y = this.pos.y;
        this.bodySmokeEmitter.x = this.pos.x;
        this.bodySmokeEmitter.y = this.pos.y;
    }
};

module.exports = ElementalDragon;

// ------------------------------------
var TintDragonBodyBehaviour = {};

TintDragonBodyBehaviour.reset = function(particle) {
    particle.tint = 0xbcfdfa;
};

TintDragonBodyBehaviour.update = function(particle) {
};

// ------------------------------------
var RotationBehaviour = {};

RotationBehaviour.reset = function(particle) {
    particle.rotationSpeed = (Math.random() * .01) - .005;
};

RotationBehaviour.update = function(particle) {
    particle.rotation += particle.rotationSpeed;
};
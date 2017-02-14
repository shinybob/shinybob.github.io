(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
FireworkDisplay.constructor = FireworkDisplay;
FireworkDisplay.prototype = Object.create(PIXI.Container.prototype);

var RippleEffect = require('./effects/RippleEffect');
var TextureGenerator = require('./particle-system/utils/TextureGenerator');
var Firework1 = require('./effects/Firework1');
var Firework2 = require('./effects/Firework2');
var Firework3 = require('./effects/Firework3');
var Firework4 = require('./effects/Firework4');
var Rain = require('./effects/Rain');
var Fire = require('./effects/Fire');
var ElementalDragon = require('./effects/ElementalDragon');

function FireworkDisplay() {
    PIXI.Container.call(this);

    this.setupBackground();

    this.effects = [];
    this.addEffect(new Firework1());
    this.addEffect(new Firework2());
    this.addEffect(new Firework3());
    this.addEffect(new Firework4());
    this.addEffect(new Rain());
    this.addEffect(new Fire());
    this.addEffect(new ElementalDragon());

    this.addButtons();
}

FireworkDisplay.prototype.setupBackground = function() {
    var background = new PIXI.Sprite.fromImage('../resources/background.png');
    background.anchor= {x:0.5, y:1};
    background.x = window.innerWidth / 2;
    background.y = window.innerHeight - 100;
    
    this.addChild(background);

    this.rippleEffect = new RippleEffect({x: window.innerWidth / 2, y:window.innerHeight - 150});
    this.addChild(this.rippleEffect);
}

FireworkDisplay.prototype.addEffect = function(effect) {
    this.effects.push(effect);
    this.addChild(effect);
};

FireworkDisplay.prototype.addButtons = function() {
    var padding = 10;
    var buttonWidth = (window.innerWidth - (padding * (this.effects.length + 1))) / this.effects.length;
    var buttonHeight = 50;

    for(var i = 0; i < this.effects.length; i++) {
        this.addButton(padding + (i * (buttonWidth + padding)), window.innerHeight - padding - buttonHeight, buttonWidth, buttonHeight, this.startEffect.bind(this, this.effects[i]));
    }
};

FireworkDisplay.prototype.startEffect = function(effect) {
    effect.start();
};

FireworkDisplay.prototype.update = function() {
    this.rippleEffect.update();

    for(var i = 0; i < this.effects.length; i++) {
        this.effects[i].update();
    }
};

FireworkDisplay.prototype.addButton = function(x, y, width, height, callback) {
    var texture = TextureGenerator.rectangle(width, height, 0x268694);
    var sprite = new PIXI.Sprite(texture);
    sprite.x = x;
    sprite.y = y;
    sprite.interactive = true;
    sprite.mousedown = sprite.touchend = callback;
    sprite.buttonMode = true;

    this.addChild(sprite);
};

module.exports = FireworkDisplay;
},{"./effects/ElementalDragon":3,"./effects/Fire":4,"./effects/Firework1":5,"./effects/Firework2":6,"./effects/Firework3":7,"./effects/Firework4":8,"./effects/Rain":10,"./effects/RippleEffect":11,"./particle-system/utils/TextureGenerator":29}],2:[function(require,module,exports){
var FireworkDisplay = require('../src/FireworkDisplay');
var originalWindowSize, fireworkDisplay, stage;

window.onload = init;

function init() {
    originalWindowSize = {width:window.innerWidth, height:window.innerHeight};

    this.loader = PIXI.loader
        .add('ripple', '../resources/ripple.png')
        .add('smoke1', '../resources/smoke1.png')
        .add('smoke2', '../resources/smoke2.png')
        .add('smoke3', '../resources/smoke3.png')
        .add('smoke4', '../resources/smoke4.png')
        .add('bodyPart1', '../resources/bodyPart1.png')
        .load(texturesLoaded);
}

function texturesLoaded (loader, resources) {
    setupStage();
    setupFireworkDisplay();
    update();
}

function setupStage() {
    this.app = new PIXI.Application(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.app.view);
    this.app.ticker.add(update);
}

function setupFireworkDisplay() {
    fireworkDisplay = new FireworkDisplay();
    this.app.stage.addChild(fireworkDisplay);
}

function update() {
    TWEEN.update();

    fireworkDisplay.update();

    if(originalWindowSize.width !== window.innerWidth || originalWindowSize.height !== window.innerHeight) {
        window.location = window.location;
    }
}
},{"../src/FireworkDisplay":1}],3:[function(require,module,exports){
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
    emitterSettings.setQuantity(150);
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
    emitterSettings.setQuantity(300);
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
},{"./../particle-system/behaviours/LifeBehaviour":14,"./../particle-system/behaviours/VelocityBehaviour":18,"./../particle-system/emitter/Emitter":20,"./../particle-system/emitter/EmitterSettings":21,"./../particle-system/particle/ParticleSettings":24,"./../particle-system/utils/Geometry":26,"./../particle-system/utils/TextureGenerator":29}],4:[function(require,module,exports){
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
},{"./../particle-system/behaviours/GravityBehaviour":13,"./../particle-system/behaviours/LifeBehaviour":14,"./../particle-system/behaviours/RotationBehaviour":16,"./../particle-system/behaviours/SpiralBehaviour":17,"./../particle-system/behaviours/VelocityBehaviour":18,"./../particle-system/emitter/Emitter":20,"./../particle-system/emitter/EmitterSettings":21,"./../particle-system/particle/ParticleSettings":24,"./../particle-system/utils/QuickRange":27,"./../particle-system/utils/TextureGenerator":29}],5:[function(require,module,exports){
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
},{"./../particle-system/behaviours/LifeBehaviour":14,"./../particle-system/behaviours/RippleBehaviour":15,"./../particle-system/behaviours/RotationBehaviour":16,"./../particle-system/behaviours/VelocityBehaviour":18,"./../particle-system/behaviours/WanderBehaviour":19,"./../particle-system/emitter/Emitter":20,"./../particle-system/emitter/EmitterSettings":21,"./../particle-system/particle/ParticleSettings":24,"./../particle-system/utils/CompactArray":25,"./../particle-system/utils/TextureGenerator":29,"./FireworkPositions":9}],6:[function(require,module,exports){
Firework2.constructor = Firework2;
Firework2.prototype = Object.create(PIXI.Container.prototype);

var Emitter = require('./../particle-system/emitter/Emitter');
var EmitterSettings = require('./../particle-system/emitter/EmitterSettings');
var ParticleSettings = require('./../particle-system/particle/ParticleSettings');
var TextureGenerator = require('./../particle-system/utils/TextureGenerator');
var VelocityBehaviour = require('./../particle-system/behaviours/VelocityBehaviour');
var LifeBehaviour = require('./../particle-system/behaviours/LifeBehaviour');
var RotationBehaviour = require('./../particle-system/behaviours/RotationBehaviour');
var SpiralBehaviour = require('./../particle-system/behaviours/SpiralBehaviour');
var FireworkPositions = require('./FireworkPositions');
var CompactArray = require('./../particle-system/utils/CompactArray');
var RippleBehaviour = require('./../particle-system/behaviours/RippleBehaviour');

function Firework2() {
    PIXI.Container.call(this);

    this.trailEmitters = [];

    this.setupSmokeEffect();
    this.setupBurstEffect();
}

Firework2.prototype.setupSmokeEffect = function() {
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
    particleSettings.addTexture(TextureGenerator.circle(2, 0x80ffea, true));
    particleSettings.addTexture(TextureGenerator.circle(2, 0xb5fff2, true));
    particleSettings.addTexture(TextureGenerator.circle(2, 0xe76fff, true));

    var emitterSettings = new EmitterSettings();
    emitterSettings.setQuantity(20);
    emitterSettings.setBounds({type:"CIRCLE", radius:80});

    this.smokeEmitter = new Emitter(this, particleSettings, emitterSettings);
};

Firework2.prototype.setupBurstEffect = function() {
    var particleSettings = new ParticleSettings();
    particleSettings.setLife(100, 150, 20, 40);
    particleSettings.addBehaviour(SpiralBehaviour);
    particleSettings.addBehaviour(LifeBehaviour);
    particleSettings.addTexture(TextureGenerator.circle(2, 0x80ffea, true));
    particleSettings.addTexture(TextureGenerator.circle(2, 0xb5fff2, true));
    particleSettings.addTexture(TextureGenerator.circle(2, 0xFFFFFF, true));

    var emitterSettings = new EmitterSettings();
    emitterSettings.setQuantity(80);
    emitterSettings.setSpawnDelay(0, 1000);

    this.burstEmitter = new Emitter(this, particleSettings, emitterSettings);
};

Firework2.prototype.getTrailEmitter = function() {
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


Firework2.prototype.start = function() {
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

Firework2.prototype.trailComplete = function(trailEmitter) {
    this.smokeEmitter.x = this.burstEmitter.x = trailEmitter.x;
    this.smokeEmitter.y = this.burstEmitter.y = trailEmitter.y;

    this.smokeEmitter.start();
    this.burstEmitter.start();

    RippleBehaviour.startFlash(1500);
    trailEmitter.stopRespawn();
    trailEmitter.setDeadWhenEmpty(true);
};

Firework2.prototype.update = function() {
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

module.exports = Firework2;
},{"./../particle-system/behaviours/LifeBehaviour":14,"./../particle-system/behaviours/RippleBehaviour":15,"./../particle-system/behaviours/RotationBehaviour":16,"./../particle-system/behaviours/SpiralBehaviour":17,"./../particle-system/behaviours/VelocityBehaviour":18,"./../particle-system/emitter/Emitter":20,"./../particle-system/emitter/EmitterSettings":21,"./../particle-system/particle/ParticleSettings":24,"./../particle-system/utils/CompactArray":25,"./../particle-system/utils/TextureGenerator":29,"./FireworkPositions":9}],7:[function(require,module,exports){
Firework3.constructor = Firework3;
Firework3.prototype = Object.create(PIXI.Container.prototype);

var Emitter = require('./../particle-system/emitter/Emitter');
var EmitterSettings = require('./../particle-system/emitter/EmitterSettings');
var ParticleSettings = require('./../particle-system/particle/ParticleSettings');
var TextureGenerator = require('./../particle-system/utils/TextureGenerator');
var VelocityBehaviour = require('./../particle-system/behaviours/VelocityBehaviour');
var LifeBehaviour = require('./../particle-system/behaviours/LifeBehaviour');
var RotationBehaviour = require('./../particle-system/behaviours/RotationBehaviour');
var DecayBehaviour = require('./../particle-system/behaviours/DecayBehaviour');
var FireworkPositions = require('./FireworkPositions');
var CompactArray = require('./../particle-system/utils/CompactArray');
var RippleBehaviour = require('./../particle-system/behaviours/RippleBehaviour');

function Firework3() {
    PIXI.Container.call(this);

    this.trailEmitters = [];

    this.setupSmokeEffect();
    this.setupBurstEffect();
}

Firework3.prototype.setupSmokeEffect = function() {
    var particleSettings = new ParticleSettings();
    particleSettings.setSpeed(.1, .2);
    particleSettings.setDirection(0, Math.PI * 2);
    particleSettings.setLife(20, 40, 10, 20);
    particleSettings.setAlpha(.05, .15);
    particleSettings.setScale(10, 15);
    particleSettings.addBehaviour(VelocityBehaviour);
    particleSettings.addBehaviour(LifeBehaviour);
    particleSettings.addBehaviour(RotationBehaviour);
    particleSettings.addTexture(TextureGenerator.circle(3, 0xccffff, false, 2));
    particleSettings.addTexture(TextureGenerator.circle(3, 0xff11ff, true, 2));
    particleSettings.addTexture(TextureGenerator.circle(3, 0xffff11, false, 2));

    var emitterSettings = new EmitterSettings();
    emitterSettings.setQuantity(20);
    emitterSettings.setBounds({type:"CIRCLE", radius:80});

    this.smokeEmitter = new Emitter(this, particleSettings, emitterSettings);
};

Firework3.prototype.setupBurstEffect = function() {
    var particleSettings = new ParticleSettings();
    particleSettings.setSpeed(1, 5);
    particleSettings.setDirection(0, Math.PI * 2);
    particleSettings.setLife(40, 80, 10, 40);
    particleSettings.setScale(.4, 1);
    particleSettings.setDecay(.95, .95);
    particleSettings.setGravity(.5, 1);
    particleSettings.addBehaviour(VelocityBehaviour);
    particleSettings.addBehaviour(LifeBehaviour);
    particleSettings.addBehaviour(DecayBehaviour);
    particleSettings.addTexture(TextureGenerator.circle(3, 0xddffff, true));
    particleSettings.addTexture(TextureGenerator.circle(3, 0xffffff, true));
    particleSettings.addTexture(TextureGenerator.circle(3, 0xffddff, true));
    particleSettings.addTexture(TextureGenerator.circle(3, 0xffffdd, true));

    var emitterSettings = new EmitterSettings();
    emitterSettings.setQuantity(100);

    this.burstEmitter = new Emitter(this, particleSettings, emitterSettings);
};

Firework3.prototype.getTrailEmitter = function() {
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

Firework3.prototype.start = function() {
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

Firework3.prototype.trailComplete = function(trailEmitter) {
    this.smokeEmitter.x = this.burstEmitter.x = trailEmitter.x;
    this.smokeEmitter.y = this.burstEmitter.y = trailEmitter.y;

    this.smokeEmitter.start();
    this.burstEmitter.start();

    RippleBehaviour.startFlash(1500);
    trailEmitter.stopRespawn();
    trailEmitter.setDeadWhenEmpty(true);
};

Firework3.prototype.update = function() {
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

module.exports = Firework3;
},{"./../particle-system/behaviours/DecayBehaviour":12,"./../particle-system/behaviours/LifeBehaviour":14,"./../particle-system/behaviours/RippleBehaviour":15,"./../particle-system/behaviours/RotationBehaviour":16,"./../particle-system/behaviours/VelocityBehaviour":18,"./../particle-system/emitter/Emitter":20,"./../particle-system/emitter/EmitterSettings":21,"./../particle-system/particle/ParticleSettings":24,"./../particle-system/utils/CompactArray":25,"./../particle-system/utils/TextureGenerator":29,"./FireworkPositions":9}],8:[function(require,module,exports){
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
},{"./../particle-system/behaviours/DecayBehaviour":12,"./../particle-system/behaviours/GravityBehaviour":13,"./../particle-system/behaviours/LifeBehaviour":14,"./../particle-system/behaviours/RippleBehaviour":15,"./../particle-system/behaviours/RotationBehaviour":16,"./../particle-system/behaviours/VelocityBehaviour":18,"./../particle-system/emitter/Emitter":20,"./../particle-system/emitter/EmitterSettings":21,"./../particle-system/particle/ParticleSettings":24,"./../particle-system/utils/CompactArray":25,"./../particle-system/utils/TextureGenerator":29,"./FireworkPositions":9}],9:[function(require,module,exports){
var QuickRange = require('../particle-system/utils/QuickRange');

var FireworkPositions = {};

FireworkPositions.launchPosition = function() {
    var position = {};
    position.x = (window.innerWidth / 2) + QuickRange.range(-50, 50);
    position.y = window.innerHeight;
    return position;
};

FireworkPositions.burstPosition = function() {
    var position = {};
    position.x = (window.innerWidth / 2) + QuickRange.range((-window.innerWidth / 3), (window.innerWidth / 3));
    position.y = QuickRange.range(100, 200);
    return position;
};

module.exports = FireworkPositions;
},{"../particle-system/utils/QuickRange":27}],10:[function(require,module,exports){
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
    emitterSettings.setRespawn(false);
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
},{"./../particle-system/behaviours/GravityBehaviour":13,"./../particle-system/behaviours/LifeBehaviour":14,"./../particle-system/behaviours/SpiralBehaviour":17,"./../particle-system/behaviours/VelocityBehaviour":18,"./../particle-system/emitter/Emitter":20,"./../particle-system/emitter/EmitterSettings":21,"./../particle-system/particle/ParticleSettings":24,"./../particle-system/utils/TextureGenerator":29}],11:[function(require,module,exports){
RippleEffect.constructor = RippleEffect;
RippleEffect.prototype = Object.create(PIXI.Container.prototype);

var Emitter = require('./../particle-system/emitter/Emitter');
var EmitterSettings = require('./../particle-system/emitter/EmitterSettings');
var ParticleSettings = require('./../particle-system/particle/ParticleSettings');
var TextureGenerator = require('./../particle-system/utils/TextureGenerator');
var VelocityBehaviour = require('./../particle-system/behaviours/VelocityBehaviour');
var LifeBehaviour = require('./../particle-system/behaviours/LifeBehaviour');
var RotationBehaviour = require('./../particle-system/behaviours/RotationBehaviour');
var WanderBehaviour = require('./../particle-system/behaviours/WanderBehaviour');
var RippleBehaviour = require('./../particle-system/behaviours/RippleBehaviour');

function RippleEffect(position) {
    PIXI.Container.call(this);

    var particleSettings = new ParticleSettings();
    particleSettings.setLife(1, 1);
    particleSettings.addBehaviour(RippleBehaviour);
    particleSettings.addTexture(PIXI.loader.resources['ripple'].texture);

    var emitterSettings = new EmitterSettings();
    emitterSettings.setBounds({type:"RECTANGLE", width:10, height:20});
    emitterSettings.setQuantity(6);

    this.emitter = new Emitter(this, particleSettings, emitterSettings);
    this.emitter.x = position.x;
    this.emitter.y = position.y;
    this.emitter.start();
};

RippleEffect.prototype.update = function() {
    if(this.emitter !== undefined) {
        this.emitter.update();
    }
};

module.exports = RippleEffect;
},{"./../particle-system/behaviours/LifeBehaviour":14,"./../particle-system/behaviours/RippleBehaviour":15,"./../particle-system/behaviours/RotationBehaviour":16,"./../particle-system/behaviours/VelocityBehaviour":18,"./../particle-system/behaviours/WanderBehaviour":19,"./../particle-system/emitter/Emitter":20,"./../particle-system/emitter/EmitterSettings":21,"./../particle-system/particle/ParticleSettings":24,"./../particle-system/utils/TextureGenerator":29}],12:[function(require,module,exports){
var Behaviour = {};

Behaviour.reset = function(particle) {
};

Behaviour.update = function(particle) {
    particle.speed *= particle.decay;
};

module.exports = Behaviour;
},{}],13:[function(require,module,exports){
var Behaviour = {};

Behaviour.reset = function(particle) {
};

Behaviour.update = function(particle) {
    particle.y += particle.gravity;
};

module.exports = Behaviour;
},{}],14:[function(require,module,exports){
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
},{}],15:[function(require,module,exports){
var QuickRange = require('../utils/QuickRange');
var colours = [0x4e6c55, 0x75392, 0x268694, 0xff85ff];
var flashColours = [0xa2e0b2, 0xffffff, 0xb594ed, 0x38cce4];

var updateColours, startFlash;

var Behaviour = {};

Behaviour.reset = function(particle) {
    particle.startX = particle.x;
    particle.rippleSpeed = QuickRange.range(-.01, .01);
    particle.rippleRotation = QuickRange.range(-Math.PI * 2, Math.PI * 2);
    particle.rippleDistance = QuickRange.range(50, 100);
    particle.tint = colours[QuickRange.range(0, colours.length - 1, true)];
    if(QuickRange.range(0, 1, true) === 1) {particle.scale.x = -particle.scale.x}
};

Behaviour.update = function(particle) {
    particle.rippleRotation += particle.rippleSpeed;
    particle.x = particle.startX + (Math.sin(particle.rippleRotation) * particle.rippleDistance);
    particle.y = particle.startY + (Math.cos(particle.rippleRotation) * (particle.rippleDistance / 5));

    if(updateColours) {
        if(startFlash) {
            particle.tint = colours[QuickRange.range(0, flashColours.length - 1, true)];
        } else {
            particle.tint = colours[QuickRange.range(0, colours.length - 1, true)];
            updateColours = false;
        }
    }
};

Behaviour.startFlash = function(duration) {
    updateColours = true;
    startFlash = true;
    setTimeout(Behaviour.stopFlash, duration);
};

Behaviour.stopFlash = function() {
    updateColours = true;
    startFlash = false
};

module.exports = Behaviour;
},{"../utils/QuickRange":27}],16:[function(require,module,exports){
var QuickRange = require('../utils/QuickRange');
var Behaviour = {};

Behaviour.reset = function(particle) {
    particle.rotationSpeed = QuickRange.range(.5, 2);
};

Behaviour.update = function(particle) {
    particle.rotation += particle.rotationSpeed;
};

module.exports = Behaviour;
},{"../utils/QuickRange":27}],17:[function(require,module,exports){
var QuickRange = require('../utils/QuickRange');
var Behaviour = {};

Behaviour.reset = function(particle) {
    particle.spriralRotation = QuickRange.range(0, Math.PI * 2);
    particle.spiralRotationSpeed = .1;//QuickRange.range(.02, .05);
    particle.spiralDistance = 2;//QuickRange.range(-2, 2);
};

Behaviour.update = function(particle) {
    particle.spriralRotation += particle.spiralRotationSpeed;
    particle.x += (Math.sin(particle.spriralRotation) * particle.spiralDistance);
    particle.y += (-Math.cos(particle.spriralRotation) * particle.spiralDistance);
};

module.exports = Behaviour;
},{"../utils/QuickRange":27}],18:[function(require,module,exports){
var Behaviour = {};

Behaviour.reset = function(particle) {
};

Behaviour.update = function(particle) {
    particle.x += particle.speed * Math.sin(particle.direction);
    particle.y += particle.speed * -Math.cos(particle.direction);
};

module.exports = Behaviour;
},{}],19:[function(require,module,exports){
var QuickRange = require('../utils/QuickRange');
var Behaviour = {};

Behaviour.reset = function(particle) {
};

Behaviour.update = function(particle) {
    particle.direction += QuickRange.range(-1, 1);
};

module.exports = Behaviour;
},{"../utils/QuickRange":27}],20:[function(require,module,exports){
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
},{"../particle/ParticlePool":23,"../utils/CompactArray":25,"../utils/QuickRange":27}],21:[function(require,module,exports){
var Range = require('../utils/Range');

function EmitterSettings() {}

EmitterSettings.prototype.setQuantity = function(quantity) {
    this._quantity = quantity;
};

EmitterSettings.prototype.setBounds = function(bounds) {
    this._bounds = bounds;
};

EmitterSettings.prototype.setRespawn = function(isRespawn) {
    this._isRespawn = isRespawn;
};

EmitterSettings.prototype.setSpawnDelay = function(min, max) {
    this._spawnDelayRange = new Range(min, max);
};

/********************************
 * Getters
 ********************************/

EmitterSettings.prototype.getQuantity = function() {
    return this._quantity;
};

EmitterSettings.prototype.getBounds = function() {
    return (this._bounds !== undefined) ? this._bounds : {type:"POINT"};
};

EmitterSettings.prototype.getRespawn = function() {
    return (this._isRespawn === undefined) ? false : this._isRespawn;
};

EmitterSettings.prototype.getSpawnDelay = function() {
    return (this._spawnDelayRange) ? this._spawnDelayRange.range() : 0;
};

module.exports = EmitterSettings;
},{"../utils/Range":28}],22:[function(require,module,exports){
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
},{}],23:[function(require,module,exports){
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
},{"./Particle":22}],24:[function(require,module,exports){
var Range = require('../utils/Range');

function ParticleSettings() {
    this._textures = [];
    this._behavious = [];
}

ParticleSettings.prototype.setSpeed = function(min, max) {
    this._speedRange = new Range(min, max);
};

ParticleSettings.prototype.setDirection = function(min, max) {
    this._directionRange = new Range(min, max);
};

ParticleSettings.prototype.setAlpha = function(min, max) {
    this._alphaRange = new Range(min, max);
};

ParticleSettings.prototype.setRotation = function(min, max) {
    this._rotationRange = new Range(min, max);
};

ParticleSettings.prototype.setLife = function(lifeMin, lifeMax, fadeMin, fadeMax) {
    this._lifeDurationRange = new Range(lifeMin, lifeMax, true);
    this._fadeDurationRange = new Range(fadeMin, fadeMax, true);
};

ParticleSettings.prototype.setScale = function(min, max) {
    this._scaleRange = new Range(min, max);
};

ParticleSettings.prototype.setGravity = function(min, max) {
    this._gravityRange = new Range(min, max);
};

ParticleSettings.prototype.setDecay = function(min, max) {
    this._decayRange = new Range(min, max);
};

ParticleSettings.prototype.addTexture = function(texture) {
    this._textures.push(texture);
};

ParticleSettings.prototype.addBehaviour = function(behaviour) {
    this._behavious.push(behaviour);
};

/********************************
 * Getters
 ********************************/

ParticleSettings.prototype.getTexture = function() {
    if(this._textures.length === 0) {
        throw new Error("No texture has been set on ParticleSettings");
    }

    return this._textures[Math.floor(Math.random() * this._textures.length)];
};

ParticleSettings.prototype.getLife = function() {
    if(this._lifeDurationRange === undefined) {
        throw new Error("No life has been set on ParticleSettings");
    }

    return {lifeDuration: this._lifeDurationRange.range(), fadeDuration: this._fadeDurationRange.range()};
};

ParticleSettings.prototype.getScale = function() {
    return (this._scaleRange) ? this._scaleRange.range() : 1;
};

ParticleSettings.prototype.getBehaviours = function() {
    return (this._behavious) ? this._behavious : [];
};

ParticleSettings.prototype.getGravity = function() {
    return (this._gravityRange) ? this._gravityRange.range() : 0;
};

ParticleSettings.prototype.getDecay = function() {
    return (this._decayRange) ? this._decayRange.range() : 0;
};

ParticleSettings.prototype.getSpeed = function() {
    return (this._speedRange) ? this._speedRange.range() : 0;
};

ParticleSettings.prototype.getDirection = function() {
    return (this._directionRange) ? this._directionRange.range() : 0;
};

ParticleSettings.prototype.getAlpha = function() {
    return (this._alphaRange) ? this._alphaRange.range() : 1;
};

ParticleSettings.prototype.getRotation = function() {
    return (this._rotationRange) ? this._rotationRange.range() : 0;
};

module.exports = ParticleSettings;
},{"../utils/Range":28}],25:[function(require,module,exports){
var CompactArray = {};

CompactArray.compact = function(array) {
    for (var j = 0; j < array.length; j++) {
        if (array[j] == null) {
            array.splice(j, 1);
            j--;
        }
    }
};

module.exports = CompactArray;
},{}],26:[function(require,module,exports){
var Geometry = {};

Geometry.distanceBetweenPoints = function(a, b) {
    return Math.sqrt( (a.x-b.x)*(a.x-b.x) + (a.y-b.y)*(a.y-b.y) );
};

Geometry.angleBetweenPointsRadians = function(a, b) {
    return Math.atan2(b.y - a.y, b.x - a.x);;
};

Geometry.angleBetweenPointsDegrees = function(a, b) {
    return Geometry.angleBetweenPointsRadians(a, b) * 180 / Math.PI;
};

module.exports = Geometry;
},{}],27:[function(require,module,exports){
var QuickRange = {};

QuickRange.range = function(min, max, round) {
    var value = min + (Math.random() * (max - min));
    if(round) value = Math.round(value);
    return value;
};

module.exports = QuickRange;
},{}],28:[function(require,module,exports){
function Range(min, max, round) {
    this.min = min;
    this.max = max;
    this.round = round;
}

Range.prototype.range = function() {
    var value = this.min + (Math.random() * (this.max - this.min));
    if(this.round) value = Math.round(value);
    return value;
};

module.exports = Range;
},{}],29:[function(require,module,exports){
var TextureGenerator = {};

TextureGenerator.circle = function(radius, colour, halo, blurAmount) {
    var graphics = new PIXI.Graphics();
    graphics.lineStyle(0);

    if(halo) {
        graphics.beginFill(colour, .2);
        graphics.drawCircle(0, 0, radius * 2);
        graphics.endFill();

        graphics.beginFill(colour, .1);
        graphics.drawCircle(0, 0, radius * 4);
        graphics.endFill();
    }

    graphics.beginFill(colour, 1);
    graphics.drawCircle(0, 0, radius);
    graphics.endFill();

    if(blurAmount > 0) {
        var blurFilter = new PIXI.filters.BlurFilter();
        blurFilter.blur = blurAmount;
        graphics.filters = [blurFilter];
    }

    return app.renderer.generateTexture(graphics);
};

TextureGenerator.rectangle = function(width, height, colour, halo, blurAmount) {
    var graphics = new PIXI.Graphics();
    graphics.lineStyle(0);

    if(halo) {
        graphics.beginFill(colour, .2);
        graphics.drawRect(0, 0, width * 2, height * 2);
        graphics.endFill();

        graphics.beginFill(colour, .1);
        graphics.drawRect(0, 0, width * 4, height * 4);
        graphics.endFill();
    }

    graphics.beginFill(colour);
    graphics.drawRect(0, 0, width, height);
    graphics.endFill();

    graphics.anchor = {x:.5, y:.5};

    if(blurAmount > 0) {
        var blurFilter = new PIXI.filters.BlurFilter();
        blurFilter.blur = blurAmount;
        graphics.filters = [blurFilter];
    }

    return app.renderer.generateTexture(graphics);
};

module.exports = TextureGenerator;
},{}]},{},[2])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9ncnVudC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvRmlyZXdvcmtEaXNwbGF5LmpzIiwic3JjL01haW4uanMiLCJzcmMvZWZmZWN0cy9FbGVtZW50YWxEcmFnb24uanMiLCJzcmMvZWZmZWN0cy9GaXJlLmpzIiwic3JjL2VmZmVjdHMvRmlyZXdvcmsxLmpzIiwic3JjL2VmZmVjdHMvRmlyZXdvcmsyLmpzIiwic3JjL2VmZmVjdHMvRmlyZXdvcmszLmpzIiwic3JjL2VmZmVjdHMvRmlyZXdvcms0LmpzIiwic3JjL2VmZmVjdHMvRmlyZXdvcmtQb3NpdGlvbnMuanMiLCJzcmMvZWZmZWN0cy9SYWluLmpzIiwic3JjL2VmZmVjdHMvUmlwcGxlRWZmZWN0LmpzIiwic3JjL3BhcnRpY2xlLXN5c3RlbS9iZWhhdmlvdXJzL0RlY2F5QmVoYXZpb3VyLmpzIiwic3JjL3BhcnRpY2xlLXN5c3RlbS9iZWhhdmlvdXJzL0dyYXZpdHlCZWhhdmlvdXIuanMiLCJzcmMvcGFydGljbGUtc3lzdGVtL2JlaGF2aW91cnMvTGlmZUJlaGF2aW91ci5qcyIsInNyYy9wYXJ0aWNsZS1zeXN0ZW0vYmVoYXZpb3Vycy9SaXBwbGVCZWhhdmlvdXIuanMiLCJzcmMvcGFydGljbGUtc3lzdGVtL2JlaGF2aW91cnMvUm90YXRpb25CZWhhdmlvdXIuanMiLCJzcmMvcGFydGljbGUtc3lzdGVtL2JlaGF2aW91cnMvU3BpcmFsQmVoYXZpb3VyLmpzIiwic3JjL3BhcnRpY2xlLXN5c3RlbS9iZWhhdmlvdXJzL1ZlbG9jaXR5QmVoYXZpb3VyLmpzIiwic3JjL3BhcnRpY2xlLXN5c3RlbS9iZWhhdmlvdXJzL1dhbmRlckJlaGF2aW91ci5qcyIsInNyYy9wYXJ0aWNsZS1zeXN0ZW0vZW1pdHRlci9FbWl0dGVyLmpzIiwic3JjL3BhcnRpY2xlLXN5c3RlbS9lbWl0dGVyL0VtaXR0ZXJTZXR0aW5ncy5qcyIsInNyYy9wYXJ0aWNsZS1zeXN0ZW0vcGFydGljbGUvUGFydGljbGUuanMiLCJzcmMvcGFydGljbGUtc3lzdGVtL3BhcnRpY2xlL1BhcnRpY2xlUG9vbC5qcyIsInNyYy9wYXJ0aWNsZS1zeXN0ZW0vcGFydGljbGUvUGFydGljbGVTZXR0aW5ncy5qcyIsInNyYy9wYXJ0aWNsZS1zeXN0ZW0vdXRpbHMvQ29tcGFjdEFycmF5LmpzIiwic3JjL3BhcnRpY2xlLXN5c3RlbS91dGlscy9HZW9tZXRyeS5qcyIsInNyYy9wYXJ0aWNsZS1zeXN0ZW0vdXRpbHMvUXVpY2tSYW5nZS5qcyIsInNyYy9wYXJ0aWNsZS1zeXN0ZW0vdXRpbHMvUmFuZ2UuanMiLCJzcmMvcGFydGljbGUtc3lzdGVtL3V0aWxzL1RleHR1cmVHZW5lcmF0b3IuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbElBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdklBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbktBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJGaXJld29ya0Rpc3BsYXkuY29uc3RydWN0b3IgPSBGaXJld29ya0Rpc3BsYXk7XG5GaXJld29ya0Rpc3BsYXkucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShQSVhJLkNvbnRhaW5lci5wcm90b3R5cGUpO1xuXG52YXIgUmlwcGxlRWZmZWN0ID0gcmVxdWlyZSgnLi9lZmZlY3RzL1JpcHBsZUVmZmVjdCcpO1xudmFyIFRleHR1cmVHZW5lcmF0b3IgPSByZXF1aXJlKCcuL3BhcnRpY2xlLXN5c3RlbS91dGlscy9UZXh0dXJlR2VuZXJhdG9yJyk7XG52YXIgRmlyZXdvcmsxID0gcmVxdWlyZSgnLi9lZmZlY3RzL0ZpcmV3b3JrMScpO1xudmFyIEZpcmV3b3JrMiA9IHJlcXVpcmUoJy4vZWZmZWN0cy9GaXJld29yazInKTtcbnZhciBGaXJld29yazMgPSByZXF1aXJlKCcuL2VmZmVjdHMvRmlyZXdvcmszJyk7XG52YXIgRmlyZXdvcms0ID0gcmVxdWlyZSgnLi9lZmZlY3RzL0ZpcmV3b3JrNCcpO1xudmFyIFJhaW4gPSByZXF1aXJlKCcuL2VmZmVjdHMvUmFpbicpO1xudmFyIEZpcmUgPSByZXF1aXJlKCcuL2VmZmVjdHMvRmlyZScpO1xudmFyIEVsZW1lbnRhbERyYWdvbiA9IHJlcXVpcmUoJy4vZWZmZWN0cy9FbGVtZW50YWxEcmFnb24nKTtcblxuZnVuY3Rpb24gRmlyZXdvcmtEaXNwbGF5KCkge1xuICAgIFBJWEkuQ29udGFpbmVyLmNhbGwodGhpcyk7XG5cbiAgICB0aGlzLnNldHVwQmFja2dyb3VuZCgpO1xuXG4gICAgdGhpcy5lZmZlY3RzID0gW107XG4gICAgdGhpcy5hZGRFZmZlY3QobmV3IEZpcmV3b3JrMSgpKTtcbiAgICB0aGlzLmFkZEVmZmVjdChuZXcgRmlyZXdvcmsyKCkpO1xuICAgIHRoaXMuYWRkRWZmZWN0KG5ldyBGaXJld29yazMoKSk7XG4gICAgdGhpcy5hZGRFZmZlY3QobmV3IEZpcmV3b3JrNCgpKTtcbiAgICB0aGlzLmFkZEVmZmVjdChuZXcgUmFpbigpKTtcbiAgICB0aGlzLmFkZEVmZmVjdChuZXcgRmlyZSgpKTtcbiAgICB0aGlzLmFkZEVmZmVjdChuZXcgRWxlbWVudGFsRHJhZ29uKCkpO1xuXG4gICAgdGhpcy5hZGRCdXR0b25zKCk7XG59XG5cbkZpcmV3b3JrRGlzcGxheS5wcm90b3R5cGUuc2V0dXBCYWNrZ3JvdW5kID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGJhY2tncm91bmQgPSBuZXcgUElYSS5TcHJpdGUuZnJvbUltYWdlKCcuLi9yZXNvdXJjZXMvYmFja2dyb3VuZC5wbmcnKTtcbiAgICBiYWNrZ3JvdW5kLmFuY2hvcj0ge3g6MC41LCB5OjF9O1xuICAgIGJhY2tncm91bmQueCA9IHdpbmRvdy5pbm5lcldpZHRoIC8gMjtcbiAgICBiYWNrZ3JvdW5kLnkgPSB3aW5kb3cuaW5uZXJIZWlnaHQgLSAxMDA7XG4gICAgXG4gICAgdGhpcy5hZGRDaGlsZChiYWNrZ3JvdW5kKTtcblxuICAgIHRoaXMucmlwcGxlRWZmZWN0ID0gbmV3IFJpcHBsZUVmZmVjdCh7eDogd2luZG93LmlubmVyV2lkdGggLyAyLCB5OndpbmRvdy5pbm5lckhlaWdodCAtIDE1MH0pO1xuICAgIHRoaXMuYWRkQ2hpbGQodGhpcy5yaXBwbGVFZmZlY3QpO1xufVxuXG5GaXJld29ya0Rpc3BsYXkucHJvdG90eXBlLmFkZEVmZmVjdCA9IGZ1bmN0aW9uKGVmZmVjdCkge1xuICAgIHRoaXMuZWZmZWN0cy5wdXNoKGVmZmVjdCk7XG4gICAgdGhpcy5hZGRDaGlsZChlZmZlY3QpO1xufTtcblxuRmlyZXdvcmtEaXNwbGF5LnByb3RvdHlwZS5hZGRCdXR0b25zID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHBhZGRpbmcgPSAxMDtcbiAgICB2YXIgYnV0dG9uV2lkdGggPSAod2luZG93LmlubmVyV2lkdGggLSAocGFkZGluZyAqICh0aGlzLmVmZmVjdHMubGVuZ3RoICsgMSkpKSAvIHRoaXMuZWZmZWN0cy5sZW5ndGg7XG4gICAgdmFyIGJ1dHRvbkhlaWdodCA9IDUwO1xuXG4gICAgZm9yKHZhciBpID0gMDsgaSA8IHRoaXMuZWZmZWN0cy5sZW5ndGg7IGkrKykge1xuICAgICAgICB0aGlzLmFkZEJ1dHRvbihwYWRkaW5nICsgKGkgKiAoYnV0dG9uV2lkdGggKyBwYWRkaW5nKSksIHdpbmRvdy5pbm5lckhlaWdodCAtIHBhZGRpbmcgLSBidXR0b25IZWlnaHQsIGJ1dHRvbldpZHRoLCBidXR0b25IZWlnaHQsIHRoaXMuc3RhcnRFZmZlY3QuYmluZCh0aGlzLCB0aGlzLmVmZmVjdHNbaV0pKTtcbiAgICB9XG59O1xuXG5GaXJld29ya0Rpc3BsYXkucHJvdG90eXBlLnN0YXJ0RWZmZWN0ID0gZnVuY3Rpb24oZWZmZWN0KSB7XG4gICAgZWZmZWN0LnN0YXJ0KCk7XG59O1xuXG5GaXJld29ya0Rpc3BsYXkucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMucmlwcGxlRWZmZWN0LnVwZGF0ZSgpO1xuXG4gICAgZm9yKHZhciBpID0gMDsgaSA8IHRoaXMuZWZmZWN0cy5sZW5ndGg7IGkrKykge1xuICAgICAgICB0aGlzLmVmZmVjdHNbaV0udXBkYXRlKCk7XG4gICAgfVxufTtcblxuRmlyZXdvcmtEaXNwbGF5LnByb3RvdHlwZS5hZGRCdXR0b24gPSBmdW5jdGlvbih4LCB5LCB3aWR0aCwgaGVpZ2h0LCBjYWxsYmFjaykge1xuICAgIHZhciB0ZXh0dXJlID0gVGV4dHVyZUdlbmVyYXRvci5yZWN0YW5nbGUod2lkdGgsIGhlaWdodCwgMHgyNjg2OTQpO1xuICAgIHZhciBzcHJpdGUgPSBuZXcgUElYSS5TcHJpdGUodGV4dHVyZSk7XG4gICAgc3ByaXRlLnggPSB4O1xuICAgIHNwcml0ZS55ID0geTtcbiAgICBzcHJpdGUuaW50ZXJhY3RpdmUgPSB0cnVlO1xuICAgIHNwcml0ZS5tb3VzZWRvd24gPSBzcHJpdGUudG91Y2hlbmQgPSBjYWxsYmFjaztcbiAgICBzcHJpdGUuYnV0dG9uTW9kZSA9IHRydWU7XG5cbiAgICB0aGlzLmFkZENoaWxkKHNwcml0ZSk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEZpcmV3b3JrRGlzcGxheTsiLCJ2YXIgRmlyZXdvcmtEaXNwbGF5ID0gcmVxdWlyZSgnLi4vc3JjL0ZpcmV3b3JrRGlzcGxheScpO1xudmFyIG9yaWdpbmFsV2luZG93U2l6ZSwgZmlyZXdvcmtEaXNwbGF5LCBzdGFnZTtcblxud2luZG93Lm9ubG9hZCA9IGluaXQ7XG5cbmZ1bmN0aW9uIGluaXQoKSB7XG4gICAgb3JpZ2luYWxXaW5kb3dTaXplID0ge3dpZHRoOndpbmRvdy5pbm5lcldpZHRoLCBoZWlnaHQ6d2luZG93LmlubmVySGVpZ2h0fTtcblxuICAgIHRoaXMubG9hZGVyID0gUElYSS5sb2FkZXJcbiAgICAgICAgLmFkZCgncmlwcGxlJywgJy4uL3Jlc291cmNlcy9yaXBwbGUucG5nJylcbiAgICAgICAgLmFkZCgnc21va2UxJywgJy4uL3Jlc291cmNlcy9zbW9rZTEucG5nJylcbiAgICAgICAgLmFkZCgnc21va2UyJywgJy4uL3Jlc291cmNlcy9zbW9rZTIucG5nJylcbiAgICAgICAgLmFkZCgnc21va2UzJywgJy4uL3Jlc291cmNlcy9zbW9rZTMucG5nJylcbiAgICAgICAgLmFkZCgnc21va2U0JywgJy4uL3Jlc291cmNlcy9zbW9rZTQucG5nJylcbiAgICAgICAgLmFkZCgnYm9keVBhcnQxJywgJy4uL3Jlc291cmNlcy9ib2R5UGFydDEucG5nJylcbiAgICAgICAgLmxvYWQodGV4dHVyZXNMb2FkZWQpO1xufVxuXG5mdW5jdGlvbiB0ZXh0dXJlc0xvYWRlZCAobG9hZGVyLCByZXNvdXJjZXMpIHtcbiAgICBzZXR1cFN0YWdlKCk7XG4gICAgc2V0dXBGaXJld29ya0Rpc3BsYXkoKTtcbiAgICB1cGRhdGUoKTtcbn1cblxuZnVuY3Rpb24gc2V0dXBTdGFnZSgpIHtcbiAgICB0aGlzLmFwcCA9IG5ldyBQSVhJLkFwcGxpY2F0aW9uKHdpbmRvdy5pbm5lcldpZHRoLCB3aW5kb3cuaW5uZXJIZWlnaHQpO1xuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodGhpcy5hcHAudmlldyk7XG4gICAgdGhpcy5hcHAudGlja2VyLmFkZCh1cGRhdGUpO1xufVxuXG5mdW5jdGlvbiBzZXR1cEZpcmV3b3JrRGlzcGxheSgpIHtcbiAgICBmaXJld29ya0Rpc3BsYXkgPSBuZXcgRmlyZXdvcmtEaXNwbGF5KCk7XG4gICAgdGhpcy5hcHAuc3RhZ2UuYWRkQ2hpbGQoZmlyZXdvcmtEaXNwbGF5KTtcbn1cblxuZnVuY3Rpb24gdXBkYXRlKCkge1xuICAgIFRXRUVOLnVwZGF0ZSgpO1xuXG4gICAgZmlyZXdvcmtEaXNwbGF5LnVwZGF0ZSgpO1xuXG4gICAgaWYob3JpZ2luYWxXaW5kb3dTaXplLndpZHRoICE9PSB3aW5kb3cuaW5uZXJXaWR0aCB8fCBvcmlnaW5hbFdpbmRvd1NpemUuaGVpZ2h0ICE9PSB3aW5kb3cuaW5uZXJIZWlnaHQpIHtcbiAgICAgICAgd2luZG93LmxvY2F0aW9uID0gd2luZG93LmxvY2F0aW9uO1xuICAgIH1cbn0iLCJFbGVtZW50YWxEcmFnb24uY29uc3RydWN0b3IgPSBFbGVtZW50YWxEcmFnb247XG5FbGVtZW50YWxEcmFnb24ucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShQSVhJLkNvbnRhaW5lci5wcm90b3R5cGUpO1xuXG52YXIgRW1pdHRlciA9IHJlcXVpcmUoJy4vLi4vcGFydGljbGUtc3lzdGVtL2VtaXR0ZXIvRW1pdHRlcicpO1xudmFyIEVtaXR0ZXJTZXR0aW5ncyA9IHJlcXVpcmUoJy4vLi4vcGFydGljbGUtc3lzdGVtL2VtaXR0ZXIvRW1pdHRlclNldHRpbmdzJyk7XG52YXIgUGFydGljbGVTZXR0aW5ncyA9IHJlcXVpcmUoJy4vLi4vcGFydGljbGUtc3lzdGVtL3BhcnRpY2xlL1BhcnRpY2xlU2V0dGluZ3MnKTtcbnZhciBUZXh0dXJlR2VuZXJhdG9yID0gcmVxdWlyZSgnLi8uLi9wYXJ0aWNsZS1zeXN0ZW0vdXRpbHMvVGV4dHVyZUdlbmVyYXRvcicpO1xudmFyIExpZmVCZWhhdmlvdXIgPSByZXF1aXJlKCcuLy4uL3BhcnRpY2xlLXN5c3RlbS9iZWhhdmlvdXJzL0xpZmVCZWhhdmlvdXInKTtcbnZhciBWZWxvY2l0eUJlaGF2aW91ciA9IHJlcXVpcmUoJy4vLi4vcGFydGljbGUtc3lzdGVtL2JlaGF2aW91cnMvVmVsb2NpdHlCZWhhdmlvdXInKTtcbnZhciBHZW9tZXRyeSA9IHJlcXVpcmUoJy4vLi4vcGFydGljbGUtc3lzdGVtL3V0aWxzL0dlb21ldHJ5Jyk7XG5cbmZ1bmN0aW9uIEVsZW1lbnRhbERyYWdvbigpIHtcbiAgICBQSVhJLkNvbnRhaW5lci5jYWxsKHRoaXMpO1xuXG4gICAgdGhpcy50cmFpbEVtaXR0ZXJzID0gW107XG5cbiAgICB0aGlzLnNldHVwQm9keVBhcnRpY2xlcygpO1xuICAgIHRoaXMuc2V0dXBCb2R5U21va2UoKTtcbiAgICB0aGlzLnNldHVwSGVhZEFuZFRhaWwoKTtcblxuICAgIHRoaXMuZHJhZ29uUm90YXRpb25YID0gMDtcbiAgICB0aGlzLmRyYWdvblJvdGF0aW9uWSA9IDA7XG4gICAgdGhpcy5tb3VzZVRyYWlsID0gZmFsc2U7XG59XG5cbkVsZW1lbnRhbERyYWdvbi5wcm90b3R5cGUuc2V0dXBIZWFkQW5kVGFpbCA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuaGVhZCA9IG5ldyBQSVhJLlNwcml0ZS5mcm9tSW1hZ2UoJy4uL3Jlc291cmNlcy9kcmFnb25IZWFkLnBuZycpO1xuICAgIHRoaXMuaGVhZC5hbmNob3IueSA9IC41O1xuICAgIHRoaXMuaGVhZC5hbmNob3IueCA9IC41O1xufTtcblxuRWxlbWVudGFsRHJhZ29uLnByb3RvdHlwZS5zZXR1cEJvZHlQYXJ0aWNsZXMgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgcGFydGljbGVTZXR0aW5ncyA9IG5ldyBQYXJ0aWNsZVNldHRpbmdzKCk7XG4gICAgcGFydGljbGVTZXR0aW5ncy5zZXRMaWZlKDUwLCAxMDAsIDEwLCA1MCk7XG4gICAgcGFydGljbGVTZXR0aW5ncy5zZXRTcGVlZCguMiwgLjUpO1xuICAgIHBhcnRpY2xlU2V0dGluZ3Muc2V0RGlyZWN0aW9uKC1NYXRoLlBJICogMiwgTWF0aC5QSSAqIDIpO1xuICAgIHBhcnRpY2xlU2V0dGluZ3Muc2V0U2NhbGUoLjIsIDEuNSk7XG4gICAgcGFydGljbGVTZXR0aW5ncy5zZXRSb3RhdGlvbigtTWF0aC5QSSAqIDIsIE1hdGguUEkgKiAyKTtcbiAgICBwYXJ0aWNsZVNldHRpbmdzLmFkZEJlaGF2aW91cihWZWxvY2l0eUJlaGF2aW91cik7XG4gICAgcGFydGljbGVTZXR0aW5ncy5hZGRCZWhhdmlvdXIoTGlmZUJlaGF2aW91cik7XG4gICAgcGFydGljbGVTZXR0aW5ncy5hZGRCZWhhdmlvdXIoUm90YXRpb25CZWhhdmlvdXIpO1xuICAgIHBhcnRpY2xlU2V0dGluZ3MuYWRkVGV4dHVyZShUZXh0dXJlR2VuZXJhdG9yLmNpcmNsZSgyLCAweGZmZmZmZiwgdHJ1ZSkpO1xuICAgIHBhcnRpY2xlU2V0dGluZ3MuYWRkVGV4dHVyZShUZXh0dXJlR2VuZXJhdG9yLmNpcmNsZSgxLCAweGZmZmZmZiwgdHJ1ZSkpO1xuXG4gICAgdmFyIGVtaXR0ZXJTZXR0aW5ncyA9IG5ldyBFbWl0dGVyU2V0dGluZ3MoKTtcbiAgICBlbWl0dGVyU2V0dGluZ3Muc2V0UXVhbnRpdHkoMTUwKTtcbiAgICBlbWl0dGVyU2V0dGluZ3Muc2V0UmVzcGF3bih0cnVlKTtcbiAgICBlbWl0dGVyU2V0dGluZ3Muc2V0Qm91bmRzKHt0eXBlOlwiQ0lSQ0xFXCIsIHJhZGl1czpcIjIwXCJ9KTtcbiAgICBlbWl0dGVyU2V0dGluZ3Muc2V0U3Bhd25EZWxheSgwLCAxMDAwKTtcblxuICAgIHRoaXMuYm9keVBhcnRpY2xlc0VtaXR0ZXIgPSBuZXcgRW1pdHRlcih0aGlzLCBwYXJ0aWNsZVNldHRpbmdzLCBlbWl0dGVyU2V0dGluZ3MpO1xufTtcblxuRWxlbWVudGFsRHJhZ29uLnByb3RvdHlwZS5zZXR1cEJvZHlTbW9rZSA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBwYXJ0aWNsZVNldHRpbmdzID0gbmV3IFBhcnRpY2xlU2V0dGluZ3MoKTtcbiAgICBwYXJ0aWNsZVNldHRpbmdzLnNldExpZmUoNTAsIDEwMCwgMCwgMCk7XG4gICAgcGFydGljbGVTZXR0aW5ncy5zZXRTcGVlZCguMSwgLjIpO1xuICAgIHBhcnRpY2xlU2V0dGluZ3Muc2V0RGlyZWN0aW9uKC1NYXRoLlBJICogMiwgTWF0aC5QSSAqIDIpO1xuICAgIHBhcnRpY2xlU2V0dGluZ3Muc2V0U2NhbGUoLjUsIDEpO1xuICAgIHBhcnRpY2xlU2V0dGluZ3Muc2V0QWxwaGEoLjAxLCAuMSk7XG4gICAgcGFydGljbGVTZXR0aW5ncy5zZXRSb3RhdGlvbigtTWF0aC5QSSAqIDIsIE1hdGguUEkgKiAyKTtcbiAgICBwYXJ0aWNsZVNldHRpbmdzLmFkZEJlaGF2aW91cihWZWxvY2l0eUJlaGF2aW91cik7XG4gICAgcGFydGljbGVTZXR0aW5ncy5hZGRCZWhhdmlvdXIoTGlmZUJlaGF2aW91cik7XG4gICAgcGFydGljbGVTZXR0aW5ncy5hZGRCZWhhdmlvdXIoUm90YXRpb25CZWhhdmlvdXIpO1xuICAgIHBhcnRpY2xlU2V0dGluZ3MuYWRkQmVoYXZpb3VyKFRpbnREcmFnb25Cb2R5QmVoYXZpb3VyKTtcbiAgICBwYXJ0aWNsZVNldHRpbmdzLmFkZFRleHR1cmUoUElYSS5sb2FkZXIucmVzb3VyY2VzWydzbW9rZTEnXS50ZXh0dXJlKTtcbiAgICBwYXJ0aWNsZVNldHRpbmdzLmFkZFRleHR1cmUoUElYSS5sb2FkZXIucmVzb3VyY2VzWydzbW9rZTInXS50ZXh0dXJlKTtcbiAgICBwYXJ0aWNsZVNldHRpbmdzLmFkZFRleHR1cmUoUElYSS5sb2FkZXIucmVzb3VyY2VzWydzbW9rZTMnXS50ZXh0dXJlKTtcbiAgICBwYXJ0aWNsZVNldHRpbmdzLmFkZFRleHR1cmUoUElYSS5sb2FkZXIucmVzb3VyY2VzWydzbW9rZTQnXS50ZXh0dXJlKTtcblxuICAgIHZhciBlbWl0dGVyU2V0dGluZ3MgPSBuZXcgRW1pdHRlclNldHRpbmdzKCk7XG4gICAgZW1pdHRlclNldHRpbmdzLnNldFF1YW50aXR5KDMwMCk7XG4gICAgZW1pdHRlclNldHRpbmdzLnNldFJlc3Bhd24odHJ1ZSk7XG4gICAgZW1pdHRlclNldHRpbmdzLnNldEJvdW5kcyh7dHlwZTpcIkNJUkNMRVwiLCByYWRpdXM6XCIyMFwifSk7XG4gICAgZW1pdHRlclNldHRpbmdzLnNldFNwYXduRGVsYXkoMCwgMTAwMCk7XG5cbiAgICB0aGlzLmJvZHlTbW9rZUVtaXR0ZXIgPSBuZXcgRW1pdHRlcih0aGlzLCBwYXJ0aWNsZVNldHRpbmdzLCBlbWl0dGVyU2V0dGluZ3MpO1xufTtcblxuRWxlbWVudGFsRHJhZ29uLnByb3RvdHlwZS5zdGFydCA9IGZ1bmN0aW9uKCkge1xuICAgIGlmKHRoaXMuc3RhcnRlZCAhPT0gdHJ1ZSkge1xuICAgICAgICB0aGlzLnN0YXJ0ZWQgPSB0cnVlO1xuICAgICAgICB0aGlzLnBvcyA9IHt4OndpbmRvdy5pbm5lcldpZHRoIC8gMiwgeTp3aW5kb3cuaW5uZXJIZWlnaHQgLyAyfTtcbiAgICAgICAgdGhpcy5ib2R5UGFydGljbGVzRW1pdHRlci5zdGFydCgpO1xuICAgICAgICB0aGlzLmJvZHlTbW9rZUVtaXR0ZXIuc3RhcnQoKTtcbiAgICAgICAgdGhpcy5hZGRDaGlsZCh0aGlzLmhlYWQpO1xuICAgICAgICB0aGlzLmhlYWRUd2VlbiA9IG5ldyBUV0VFTi5Ud2Vlbih0aGlzLnBvcyk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5tb3VzZVRyYWlsID0gdHJ1ZTtcbiAgICB9XG59O1xuXG5FbGVtZW50YWxEcmFnb24ucHJvdG90eXBlLnN0YXJ0TW91c2VUcmFpbCA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMubW91c2VUcmFpbCA9IHRydWU7XG59O1xuXG5FbGVtZW50YWxEcmFnb24ucHJvdG90eXBlLmdldFBvc2l0aW9uID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHRhcmdldCA9IHt9O1xuXG4gICAgaWYodGhpcy5tb3VzZVRyYWlsKSB7XG4gICAgICAgIHRhcmdldCA9IHJlbmRlcmVyLnBsdWdpbnMuaW50ZXJhY3Rpb24ubW91c2UuZ2xvYmFsO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuZHJhZ29uUm90YXRpb25YICs9IC4wNDtcbiAgICAgICAgdGhpcy5kcmFnb25Sb3RhdGlvblkgKz0gLjAyO1xuICAgICAgICB0YXJnZXQueCA9ICh3aW5kb3cuaW5uZXJXaWR0aCAvIDIpICsgTWF0aC5zaW4odGhpcy5kcmFnb25Sb3RhdGlvblgpICogMjAwO1xuICAgICAgICB0YXJnZXQueSA9ICh3aW5kb3cuaW5uZXJIZWlnaHQgLyAyKSArIE1hdGguY29zKHRoaXMuZHJhZ29uUm90YXRpb25ZKSAqIDIwMDtcbiAgICAgICAgdGFyZ2V0LnJvdGF0aW9uID0gR2VvbWV0cnkuYW5nbGVCZXR3ZWVuUG9pbnRzUmFkaWFucyh0YXJnZXQsIHt4OnRoaXMuaGVhZC54LCB5OnRoaXMuaGVhZC55fSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRhcmdldDtcbn07XG5cbkVsZW1lbnRhbERyYWdvbi5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHRhcmdldCA9IHRoaXMuZ2V0UG9zaXRpb24oKTtcblxuICAgIHRoaXMuYm9keVBhcnRpY2xlc0VtaXR0ZXIudXBkYXRlKCk7XG4gICAgdGhpcy5ib2R5U21va2VFbWl0dGVyLnVwZGF0ZSgpO1xuXG4gICAgaWYodGhpcy5oZWFkVHdlZW4pIHtcbiAgICAgICAgdGhpcy5oZWFkVHdlZW4udG8odGFyZ2V0LCAxMDApO1xuICAgICAgICB0aGlzLmhlYWRUd2Vlbi5zdGFydCgpO1xuICAgICAgICB0aGlzLmhlYWQueCA9IHRoaXMucG9zLng7XG4gICAgICAgIHRoaXMuaGVhZC55ID0gdGhpcy5wb3MueTtcbiAgICAgICAgdGhpcy5oZWFkLnJvdGF0aW9uID0gR2VvbWV0cnkuYW5nbGVCZXR3ZWVuUG9pbnRzUmFkaWFucyh0YXJnZXQsIHt4OnRoaXMuaGVhZC54LCB5OnRoaXMuaGVhZC55fSk7XG5cbiAgICAgICAgdmFyIHN3aXRjaEFuZ2xlID0gTWF0aC5QSS8yO1xuXG4gICAgICAgIGlmKHRoaXMuaGVhZC5yb3RhdGlvbiA8IC1zd2l0Y2hBbmdsZSB8fCB0aGlzLmhlYWQucm90YXRpb24gPiBzd2l0Y2hBbmdsZSkge1xuICAgICAgICAgICAgdGhpcy5oZWFkLnNjYWxlLnkgPSAtc3dpdGNoQW5nbGVcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuaGVhZC5zY2FsZS55ID0gc3dpdGNoQW5nbGVcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuYm9keVBhcnRpY2xlc0VtaXR0ZXIueCA9IHRoaXMucG9zLng7XG4gICAgICAgIHRoaXMuYm9keVBhcnRpY2xlc0VtaXR0ZXIueSA9IHRoaXMucG9zLnk7XG4gICAgICAgIHRoaXMuYm9keVNtb2tlRW1pdHRlci54ID0gdGhpcy5wb3MueDtcbiAgICAgICAgdGhpcy5ib2R5U21va2VFbWl0dGVyLnkgPSB0aGlzLnBvcy55O1xuICAgIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gRWxlbWVudGFsRHJhZ29uO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbnZhciBUaW50RHJhZ29uQm9keUJlaGF2aW91ciA9IHt9O1xuXG5UaW50RHJhZ29uQm9keUJlaGF2aW91ci5yZXNldCA9IGZ1bmN0aW9uKHBhcnRpY2xlKSB7XG4gICAgcGFydGljbGUudGludCA9IDB4YmNmZGZhO1xufTtcblxuVGludERyYWdvbkJvZHlCZWhhdmlvdXIudXBkYXRlID0gZnVuY3Rpb24ocGFydGljbGUpIHtcbn07XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxudmFyIFJvdGF0aW9uQmVoYXZpb3VyID0ge307XG5cblJvdGF0aW9uQmVoYXZpb3VyLnJlc2V0ID0gZnVuY3Rpb24ocGFydGljbGUpIHtcbiAgICBwYXJ0aWNsZS5yb3RhdGlvblNwZWVkID0gKE1hdGgucmFuZG9tKCkgKiAuMDEpIC0gLjAwNTtcbn07XG5cblJvdGF0aW9uQmVoYXZpb3VyLnVwZGF0ZSA9IGZ1bmN0aW9uKHBhcnRpY2xlKSB7XG4gICAgcGFydGljbGUucm90YXRpb24gKz0gcGFydGljbGUucm90YXRpb25TcGVlZDtcbn07IiwiRmlyZS5jb25zdHJ1Y3RvciA9IEZpcmU7XG5GaXJlLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoUElYSS5Db250YWluZXIucHJvdG90eXBlKTtcblxudmFyIEVtaXR0ZXIgPSByZXF1aXJlKCcuLy4uL3BhcnRpY2xlLXN5c3RlbS9lbWl0dGVyL0VtaXR0ZXInKTtcbnZhciBFbWl0dGVyU2V0dGluZ3MgPSByZXF1aXJlKCcuLy4uL3BhcnRpY2xlLXN5c3RlbS9lbWl0dGVyL0VtaXR0ZXJTZXR0aW5ncycpO1xudmFyIFBhcnRpY2xlU2V0dGluZ3MgPSByZXF1aXJlKCcuLy4uL3BhcnRpY2xlLXN5c3RlbS9wYXJ0aWNsZS9QYXJ0aWNsZVNldHRpbmdzJyk7XG52YXIgVGV4dHVyZUdlbmVyYXRvciA9IHJlcXVpcmUoJy4vLi4vcGFydGljbGUtc3lzdGVtL3V0aWxzL1RleHR1cmVHZW5lcmF0b3InKTtcbnZhciBWZWxvY2l0eUJlaGF2aW91ciA9IHJlcXVpcmUoJy4vLi4vcGFydGljbGUtc3lzdGVtL2JlaGF2aW91cnMvVmVsb2NpdHlCZWhhdmlvdXInKTtcbnZhciBMaWZlQmVoYXZpb3VyID0gcmVxdWlyZSgnLi8uLi9wYXJ0aWNsZS1zeXN0ZW0vYmVoYXZpb3Vycy9MaWZlQmVoYXZpb3VyJyk7XG52YXIgU3BpcmFsQmVoYXZpb3VyID0gcmVxdWlyZSgnLi8uLi9wYXJ0aWNsZS1zeXN0ZW0vYmVoYXZpb3Vycy9TcGlyYWxCZWhhdmlvdXInKTtcbnZhciBHcmF2aXR5QmVoYXZpb3VyID0gcmVxdWlyZSgnLi8uLi9wYXJ0aWNsZS1zeXN0ZW0vYmVoYXZpb3Vycy9HcmF2aXR5QmVoYXZpb3VyJyk7XG52YXIgUm90YXRpb25CZWhhdmlvdXIgPSByZXF1aXJlKCcuLy4uL3BhcnRpY2xlLXN5c3RlbS9iZWhhdmlvdXJzL1JvdGF0aW9uQmVoYXZpb3VyJyk7XG52YXIgUXVpY2tSYW5nZSA9IHJlcXVpcmUoJy4vLi4vcGFydGljbGUtc3lzdGVtL3V0aWxzL1F1aWNrUmFuZ2UnKTtcblxuZnVuY3Rpb24gRmlyZSgpIHtcbiAgICBQSVhJLkNvbnRhaW5lci5jYWxsKHRoaXMpO1xuXG4gICAgdGhpcy5lbWl0dGVycyA9IFtdO1xufVxuXG5GaXJlLnByb3RvdHlwZS5nZXRGbGFtZUVmZmVjdCA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBwYXJ0aWNsZVNldHRpbmdzID0gbmV3IFBhcnRpY2xlU2V0dGluZ3MoKTtcbiAgICBwYXJ0aWNsZVNldHRpbmdzLnNldFNwZWVkKDEsIDQpO1xuICAgIHBhcnRpY2xlU2V0dGluZ3Muc2V0RGlyZWN0aW9uKDAsIDApO1xuICAgIHBhcnRpY2xlU2V0dGluZ3Muc2V0TGlmZSg1LCAxMCwgMTAsIDIwKTtcbiAgICBwYXJ0aWNsZVNldHRpbmdzLnNldFNjYWxlKDIsIDQpO1xuICAgIHBhcnRpY2xlU2V0dGluZ3MuYWRkQmVoYXZpb3VyKFZlbG9jaXR5QmVoYXZpb3VyKTtcbiAgICBwYXJ0aWNsZVNldHRpbmdzLmFkZEJlaGF2aW91cihMaWZlQmVoYXZpb3VyKTtcbiAgICBwYXJ0aWNsZVNldHRpbmdzLmFkZFRleHR1cmUoVGV4dHVyZUdlbmVyYXRvci5jaXJjbGUoMSwgMHhmZmFiMzcsIHRydWUpKTtcbiAgICBwYXJ0aWNsZVNldHRpbmdzLmFkZFRleHR1cmUoVGV4dHVyZUdlbmVyYXRvci5jaXJjbGUoMSwgMHhmZmYxOTEsIHRydWUpKTtcblxuICAgIHZhciBlbWl0dGVyU2V0dGluZ3MgPSBuZXcgRW1pdHRlclNldHRpbmdzKCk7XG4gICAgZW1pdHRlclNldHRpbmdzLnNldFF1YW50aXR5KDE1MCk7XG4gICAgZW1pdHRlclNldHRpbmdzLnNldEJvdW5kcyh7dHlwZTpcIlJFQ1RBTkdMRVwiLCB3aWR0aDozMCwgaGVpZ2h0OjF9KTtcbiAgICBlbWl0dGVyU2V0dGluZ3Muc2V0UmVzcGF3bih0cnVlKTtcbiAgICBlbWl0dGVyU2V0dGluZ3Muc2V0U3Bhd25EZWxheSgwLCAxMDAwKTtcblxuICAgIHJldHVybiBuZXcgRW1pdHRlcih0aGlzLCBwYXJ0aWNsZVNldHRpbmdzLCBlbWl0dGVyU2V0dGluZ3MpO1xufTtcblxuRmlyZS5wcm90b3R5cGUuZ2V0U3BhcmtzRWZmZWN0ID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHBhcnRpY2xlU2V0dGluZ3MgPSBuZXcgUGFydGljbGVTZXR0aW5ncygpO1xuICAgIHBhcnRpY2xlU2V0dGluZ3Muc2V0TGlmZSg1LCA1MCwgMTAsIDUwKTtcbiAgICBwYXJ0aWNsZVNldHRpbmdzLnNldFNjYWxlKC4yLCAxKTtcbiAgICBwYXJ0aWNsZVNldHRpbmdzLnNldEdyYXZpdHkoLTEsIC0yKTtcbiAgICBwYXJ0aWNsZVNldHRpbmdzLmFkZEJlaGF2aW91cihHcmF2aXR5QmVoYXZpb3VyKTtcbiAgICBwYXJ0aWNsZVNldHRpbmdzLmFkZEJlaGF2aW91cihTcGlyYWxCZWhhdmlvdXIpO1xuICAgIHBhcnRpY2xlU2V0dGluZ3MuYWRkQmVoYXZpb3VyKExpZmVCZWhhdmlvdXIpO1xuICAgIHBhcnRpY2xlU2V0dGluZ3MuYWRkVGV4dHVyZShUZXh0dXJlR2VuZXJhdG9yLmNpcmNsZSgyLCAweGZmYWIzNywgdHJ1ZSkpO1xuICAgIHBhcnRpY2xlU2V0dGluZ3MuYWRkVGV4dHVyZShUZXh0dXJlR2VuZXJhdG9yLmNpcmNsZSgxLCAweGZmZmZmZiwgdHJ1ZSkpO1xuICAgIHBhcnRpY2xlU2V0dGluZ3MuYWRkVGV4dHVyZShUZXh0dXJlR2VuZXJhdG9yLmNpcmNsZSgxLCAweGZmZmZmZikpO1xuXG4gICAgdmFyIGVtaXR0ZXJTZXR0aW5ncyA9IG5ldyBFbWl0dGVyU2V0dGluZ3MoKTtcbiAgICBlbWl0dGVyU2V0dGluZ3Muc2V0UXVhbnRpdHkoMjApO1xuICAgIGVtaXR0ZXJTZXR0aW5ncy5zZXRCb3VuZHMoe3R5cGU6XCJSRUNUQU5HTEVcIiwgd2lkdGg6NTAsIGhlaWdodDoxfSk7XG4gICAgZW1pdHRlclNldHRpbmdzLnNldFJlc3Bhd24odHJ1ZSk7XG4gICAgZW1pdHRlclNldHRpbmdzLnNldFNwYXduRGVsYXkoMCwgMjAwMCk7XG5cbiAgICByZXR1cm4gbmV3IEVtaXR0ZXIodGhpcywgcGFydGljbGVTZXR0aW5ncywgZW1pdHRlclNldHRpbmdzKTtcbn07XG5cbkZpcmUucHJvdG90eXBlLmdldFNtb2tlRWZmZWN0ID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHBhcnRpY2xlU2V0dGluZ3MgPSBuZXcgUGFydGljbGVTZXR0aW5ncygpO1xuICAgIHBhcnRpY2xlU2V0dGluZ3Muc2V0TGlmZSg1LCA1LCAxMDAsIDIwMCk7XG4gICAgcGFydGljbGVTZXR0aW5ncy5zZXRTY2FsZSg1LCAxMCk7XG4gICAgcGFydGljbGVTZXR0aW5ncy5zZXRBbHBoYSguMSwgLjMpO1xuICAgIHBhcnRpY2xlU2V0dGluZ3Muc2V0R3Jhdml0eSgtMSwgLTIpO1xuICAgIHBhcnRpY2xlU2V0dGluZ3MuYWRkQmVoYXZpb3VyKEdyYXZpdHlCZWhhdmlvdXIpO1xuICAgIHBhcnRpY2xlU2V0dGluZ3MuYWRkQmVoYXZpb3VyKFJvdGF0aW9uQmVoYXZpb3VyKTtcbiAgICBwYXJ0aWNsZVNldHRpbmdzLmFkZEJlaGF2aW91cihMaWZlQmVoYXZpb3VyKTtcbiAgICBwYXJ0aWNsZVNldHRpbmdzLmFkZFRleHR1cmUoVGV4dHVyZUdlbmVyYXRvci5jaXJjbGUoMSwgMHhmZmZmZmYsIHRydWUpKTtcblxuICAgIHZhciBlbWl0dGVyU2V0dGluZ3MgPSBuZXcgRW1pdHRlclNldHRpbmdzKCk7XG4gICAgZW1pdHRlclNldHRpbmdzLnNldFF1YW50aXR5KDQwKTtcbiAgICBlbWl0dGVyU2V0dGluZ3Muc2V0Qm91bmRzKHt0eXBlOlwiUkVDVEFOR0xFXCIsIHdpZHRoOjUwLCBoZWlnaHQ6MX0pO1xuICAgIGVtaXR0ZXJTZXR0aW5ncy5zZXRSZXNwYXduKHRydWUpO1xuICAgIGVtaXR0ZXJTZXR0aW5ncy5zZXRTcGF3bkRlbGF5KDAsIDEwMDApO1xuXG4gICAgcmV0dXJuIG5ldyBFbWl0dGVyKHRoaXMsIHBhcnRpY2xlU2V0dGluZ3MsIGVtaXR0ZXJTZXR0aW5ncyk7XG59O1xuXG5GaXJlLnByb3RvdHlwZS5zdGFydCA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBzbW9rZUVmZmVjdCA9IHRoaXMuZ2V0U21va2VFZmZlY3QoKTtcbiAgICB2YXIgZmxhbWVFZmZlY3QgPSB0aGlzLmdldEZsYW1lRWZmZWN0KCk7XG4gICAgdmFyIHNwYXJrRWZmZWN0ID0gdGhpcy5nZXRTcGFya3NFZmZlY3QoKTtcblxuICAgIGZsYW1lRWZmZWN0LnggPSBzcGFya0VmZmVjdC54ID0gc21va2VFZmZlY3QueCA9ICh3aW5kb3cuaW5uZXJXaWR0aCAvIDIpICsgUXVpY2tSYW5nZS5yYW5nZSgtMzAwLCAzMDApO1xuICAgIGZsYW1lRWZmZWN0LnkgPSBzcGFya0VmZmVjdC55ID0gc21va2VFZmZlY3QueSA9IHdpbmRvdy5pbm5lckhlaWdodCAtIFF1aWNrUmFuZ2UucmFuZ2UoMjAwLCA0MDApO1xuXG4gICAgdGhpcy5lbWl0dGVycy5wdXNoKGZsYW1lRWZmZWN0KTtcbiAgICB0aGlzLmVtaXR0ZXJzLnB1c2goc3BhcmtFZmZlY3QpO1xuICAgIHRoaXMuZW1pdHRlcnMucHVzaChzbW9rZUVmZmVjdCk7XG5cbiAgICBmbGFtZUVmZmVjdC5zdGFydCgpO1xuICAgIHNwYXJrRWZmZWN0LnN0YXJ0KCk7XG4gICAgc21va2VFZmZlY3Quc3RhcnQoKTtcbn07XG5cbkZpcmUucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uKCkge1xuICAgIGZvcih2YXIgaSA9IDA7IGkgPCB0aGlzLmVtaXR0ZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHRoaXMuZW1pdHRlcnNbaV0udXBkYXRlKCk7XG4gICAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBGaXJlOyIsIkZpcmV3b3JrMS5jb25zdHJ1Y3RvciA9IEZpcmV3b3JrMTtcbkZpcmV3b3JrMS5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKFBJWEkuQ29udGFpbmVyLnByb3RvdHlwZSk7XG5cbnZhciBFbWl0dGVyID0gcmVxdWlyZSgnLi8uLi9wYXJ0aWNsZS1zeXN0ZW0vZW1pdHRlci9FbWl0dGVyJyk7XG52YXIgRW1pdHRlclNldHRpbmdzID0gcmVxdWlyZSgnLi8uLi9wYXJ0aWNsZS1zeXN0ZW0vZW1pdHRlci9FbWl0dGVyU2V0dGluZ3MnKTtcbnZhciBQYXJ0aWNsZVNldHRpbmdzID0gcmVxdWlyZSgnLi8uLi9wYXJ0aWNsZS1zeXN0ZW0vcGFydGljbGUvUGFydGljbGVTZXR0aW5ncycpO1xudmFyIFRleHR1cmVHZW5lcmF0b3IgPSByZXF1aXJlKCcuLy4uL3BhcnRpY2xlLXN5c3RlbS91dGlscy9UZXh0dXJlR2VuZXJhdG9yJyk7XG52YXIgVmVsb2NpdHlCZWhhdmlvdXIgPSByZXF1aXJlKCcuLy4uL3BhcnRpY2xlLXN5c3RlbS9iZWhhdmlvdXJzL1ZlbG9jaXR5QmVoYXZpb3VyJyk7XG52YXIgTGlmZUJlaGF2aW91ciA9IHJlcXVpcmUoJy4vLi4vcGFydGljbGUtc3lzdGVtL2JlaGF2aW91cnMvTGlmZUJlaGF2aW91cicpO1xudmFyIFJvdGF0aW9uQmVoYXZpb3VyID0gcmVxdWlyZSgnLi8uLi9wYXJ0aWNsZS1zeXN0ZW0vYmVoYXZpb3Vycy9Sb3RhdGlvbkJlaGF2aW91cicpO1xudmFyIFdhbmRlckJlaGF2aW91ciA9IHJlcXVpcmUoJy4vLi4vcGFydGljbGUtc3lzdGVtL2JlaGF2aW91cnMvV2FuZGVyQmVoYXZpb3VyJyk7XG52YXIgUmlwcGxlQmVoYXZpb3VyID0gcmVxdWlyZSgnLi8uLi9wYXJ0aWNsZS1zeXN0ZW0vYmVoYXZpb3Vycy9SaXBwbGVCZWhhdmlvdXInKTtcbnZhciBGaXJld29ya1Bvc2l0aW9ucyA9IHJlcXVpcmUoJy4vRmlyZXdvcmtQb3NpdGlvbnMnKTtcbnZhciBDb21wYWN0QXJyYXkgPSByZXF1aXJlKCcuLy4uL3BhcnRpY2xlLXN5c3RlbS91dGlscy9Db21wYWN0QXJyYXknKTtcblxuZnVuY3Rpb24gRmlyZXdvcmsxKCkge1xuICAgIFBJWEkuQ29udGFpbmVyLmNhbGwodGhpcyk7XG5cbiAgICB0aGlzLnRyYWlsRW1pdHRlcnMgPSBbXTtcblxuICAgIHRoaXMuc2V0dXBTbW9rZUVmZmVjdCgpO1xuICAgIHRoaXMuc2V0dXBCdXJzdEVmZmVjdCgpO1xufVxuXG5GaXJld29yazEucHJvdG90eXBlLnNldHVwU21va2VFZmZlY3QgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgcGFydGljbGVTZXR0aW5ncyA9IG5ldyBQYXJ0aWNsZVNldHRpbmdzKCk7XG4gICAgcGFydGljbGVTZXR0aW5ncy5zZXRTcGVlZCguMSwgLjIpO1xuICAgIHBhcnRpY2xlU2V0dGluZ3Muc2V0RGlyZWN0aW9uKDAsIE1hdGguUEkgKiAyKTtcbiAgICBwYXJ0aWNsZVNldHRpbmdzLnNldExpZmUoMjAsIDQwLCAxMCwgMjApO1xuICAgIHBhcnRpY2xlU2V0dGluZ3Muc2V0QWxwaGEoLjA1LCAuMTUpO1xuICAgIHBhcnRpY2xlU2V0dGluZ3Muc2V0U2NhbGUoMTAsIDIwKTtcbiAgICBwYXJ0aWNsZVNldHRpbmdzLmFkZEJlaGF2aW91cihWZWxvY2l0eUJlaGF2aW91cik7XG4gICAgcGFydGljbGVTZXR0aW5ncy5hZGRCZWhhdmlvdXIoTGlmZUJlaGF2aW91cik7XG4gICAgcGFydGljbGVTZXR0aW5ncy5hZGRCZWhhdmlvdXIoUm90YXRpb25CZWhhdmlvdXIpO1xuICAgIHBhcnRpY2xlU2V0dGluZ3MuYWRkVGV4dHVyZShUZXh0dXJlR2VuZXJhdG9yLmNpcmNsZSgyLCAweGZmZmZmZiwgdHJ1ZSkpO1xuICAgIHBhcnRpY2xlU2V0dGluZ3MuYWRkVGV4dHVyZShUZXh0dXJlR2VuZXJhdG9yLmNpcmNsZSgyLCAweDkxZmZhMSwgdHJ1ZSkpO1xuXG4gICAgdmFyIGVtaXR0ZXJTZXR0aW5ncyA9IG5ldyBFbWl0dGVyU2V0dGluZ3MoKTtcbiAgICBlbWl0dGVyU2V0dGluZ3Muc2V0UXVhbnRpdHkoMjApO1xuICAgIGVtaXR0ZXJTZXR0aW5ncy5zZXRCb3VuZHMoe3R5cGU6XCJDSVJDTEVcIiwgcmFkaXVzOjgwfSk7XG5cbiAgICB0aGlzLnNtb2tlRW1pdHRlciA9IG5ldyBFbWl0dGVyKHRoaXMsIHBhcnRpY2xlU2V0dGluZ3MsIGVtaXR0ZXJTZXR0aW5ncyk7XG59O1xuXG5GaXJld29yazEucHJvdG90eXBlLnNldHVwQnVyc3RFZmZlY3QgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgcGFydGljbGVTZXR0aW5ncyA9IG5ldyBQYXJ0aWNsZVNldHRpbmdzKCk7XG4gICAgcGFydGljbGVTZXR0aW5ncy5zZXRTcGVlZCgyLCAyKTtcbiAgICBwYXJ0aWNsZVNldHRpbmdzLnNldERpcmVjdGlvbigwLCBNYXRoLlBJICogMik7XG4gICAgcGFydGljbGVTZXR0aW5ncy5zZXRMaWZlKDQwLCAxMDAsIDAsIDApO1xuICAgIHBhcnRpY2xlU2V0dGluZ3Muc2V0U2NhbGUoLjUsIDEuNSk7XG4gICAgcGFydGljbGVTZXR0aW5ncy5hZGRCZWhhdmlvdXIoVmVsb2NpdHlCZWhhdmlvdXIpO1xuICAgIHBhcnRpY2xlU2V0dGluZ3MuYWRkQmVoYXZpb3VyKFdhbmRlckJlaGF2aW91cik7XG4gICAgcGFydGljbGVTZXR0aW5ncy5hZGRCZWhhdmlvdXIoTGlmZUJlaGF2aW91cik7XG4gICAgcGFydGljbGVTZXR0aW5ncy5hZGRUZXh0dXJlKFRleHR1cmVHZW5lcmF0b3IuY2lyY2xlKDIsIDB4ZmZmZmZmLCB0cnVlKSk7XG4gICAgcGFydGljbGVTZXR0aW5ncy5hZGRUZXh0dXJlKFRleHR1cmVHZW5lcmF0b3IuY2lyY2xlKDIsIDB4OTFmZmExLCB0cnVlKSk7XG5cbiAgICB2YXIgZW1pdHRlclNldHRpbmdzID0gbmV3IEVtaXR0ZXJTZXR0aW5ncygpO1xuICAgIGVtaXR0ZXJTZXR0aW5ncy5zZXRRdWFudGl0eSgxMDApO1xuXG4gICAgdGhpcy5idXJzdEVtaXR0ZXIgPSBuZXcgRW1pdHRlcih0aGlzLCBwYXJ0aWNsZVNldHRpbmdzLCBlbWl0dGVyU2V0dGluZ3MpO1xufTtcblxuRmlyZXdvcmsxLnByb3RvdHlwZS5nZXRUcmFpbEVtaXR0ZXIgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgdHJhaWxQYXJ0aWNsZVNldHRpbmdzID0gbmV3IFBhcnRpY2xlU2V0dGluZ3MoKTtcbiAgICB0cmFpbFBhcnRpY2xlU2V0dGluZ3Muc2V0TGlmZSgzLCA4LCAxLCAyMCk7XG4gICAgdHJhaWxQYXJ0aWNsZVNldHRpbmdzLnNldEFscGhhKC4xLCAuNSk7XG4gICAgdHJhaWxQYXJ0aWNsZVNldHRpbmdzLmFkZEJlaGF2aW91cihMaWZlQmVoYXZpb3VyKTtcbiAgICB0cmFpbFBhcnRpY2xlU2V0dGluZ3MuYWRkVGV4dHVyZShUZXh0dXJlR2VuZXJhdG9yLmNpcmNsZSgxLCAweGYyZmZlMiwgdHJ1ZSkpO1xuICAgIHRyYWlsUGFydGljbGVTZXR0aW5ncy5hZGRUZXh0dXJlKFRleHR1cmVHZW5lcmF0b3IuY2lyY2xlKDEsIDB4ZjVmZmE2LCB0cnVlLCA0KSk7XG4gICAgdHJhaWxQYXJ0aWNsZVNldHRpbmdzLmFkZFRleHR1cmUoVGV4dHVyZUdlbmVyYXRvci5jaXJjbGUoMiwgMHhmNWZmYTYsIHRydWUsIDgpKTtcblxuICAgIHZhciB0cmFpbEVtaXR0ZXJTZXR0aW5ncyA9IG5ldyBFbWl0dGVyU2V0dGluZ3MoKTtcbiAgICB0cmFpbEVtaXR0ZXJTZXR0aW5ncy5zZXRRdWFudGl0eSgxMDApO1xuICAgIHRyYWlsRW1pdHRlclNldHRpbmdzLnNldFJlc3Bhd24odHJ1ZSk7XG5cbiAgICByZXR1cm4gbmV3IEVtaXR0ZXIodGhpcywgdHJhaWxQYXJ0aWNsZVNldHRpbmdzLCB0cmFpbEVtaXR0ZXJTZXR0aW5ncyk7XG59O1xuXG5GaXJld29yazEucHJvdG90eXBlLnN0YXJ0ID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHRyYWlsRW1pdHRlciA9IHRoaXMuZ2V0VHJhaWxFbWl0dGVyKCk7XG4gICAgdmFyIGxhdW5jaFBvc2l0aW9uID0gRmlyZXdvcmtQb3NpdGlvbnMubGF1bmNoUG9zaXRpb24oKTtcbiAgICB2YXIgYnVyc3RQb3NpdGlvbiA9IEZpcmV3b3JrUG9zaXRpb25zLmJ1cnN0UG9zaXRpb24oKTtcblxuICAgIHRyYWlsRW1pdHRlci54ID0gbGF1bmNoUG9zaXRpb24ueDtcbiAgICB0cmFpbEVtaXR0ZXIueSA9IGxhdW5jaFBvc2l0aW9uLnk7XG4gICAgdHJhaWxFbWl0dGVyLnN0YXJ0KCk7XG5cbiAgICB0aGlzLnRyYWlsRW1pdHRlcnMucHVzaCh0cmFpbEVtaXR0ZXIpO1xuXG4gICAgdmFyIGNhbGxiYWNrID0gdGhpcy50cmFpbENvbXBsZXRlLmJpbmQodGhpcyk7XG5cbiAgICBuZXcgVFdFRU4uVHdlZW4odHJhaWxFbWl0dGVyKVxuICAgICAgICAudG8oe3ggOiBidXJzdFBvc2l0aW9uLngsIHkgOiBidXJzdFBvc2l0aW9uLnl9LCAyMDAwKVxuICAgICAgICAuZWFzaW5nKFRXRUVOLkVhc2luZy5DdWJpYy5JbilcbiAgICAgICAgLnN0YXJ0KClcbiAgICAgICAgLm9uQ29tcGxldGUoZnVuY3Rpb24oKXsgY2FsbGJhY2sodHJhaWxFbWl0dGVyKSB9KTtcbn07XG5cbkZpcmV3b3JrMS5wcm90b3R5cGUudHJhaWxDb21wbGV0ZSA9IGZ1bmN0aW9uKHRyYWlsRW1pdHRlcikge1xuICAgIHRoaXMuc21va2VFbWl0dGVyLnggPSB0aGlzLmJ1cnN0RW1pdHRlci54ID0gdHJhaWxFbWl0dGVyLng7XG4gICAgdGhpcy5zbW9rZUVtaXR0ZXIueSA9IHRoaXMuYnVyc3RFbWl0dGVyLnkgPSB0cmFpbEVtaXR0ZXIueTtcblxuICAgIHRoaXMuc21va2VFbWl0dGVyLnN0YXJ0KCk7XG4gICAgdGhpcy5idXJzdEVtaXR0ZXIuc3RhcnQoKTtcblxuICAgIFJpcHBsZUJlaGF2aW91ci5zdGFydEZsYXNoKDE1MDApO1xuICAgIHRyYWlsRW1pdHRlci5zdG9wUmVzcGF3bigpO1xuICAgIHRyYWlsRW1pdHRlci5zZXREZWFkV2hlbkVtcHR5KHRydWUpO1xufTtcblxuRmlyZXdvcmsxLnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnNtb2tlRW1pdHRlci51cGRhdGUoKTtcbiAgICB0aGlzLmJ1cnN0RW1pdHRlci51cGRhdGUoKTtcblxuICAgIHZhciBuZWVkc0NvbXBhY3RpbmcgPSBmYWxzZTtcblxuICAgIGZvcih2YXIgaSA9IDA7IGkgPCAgdGhpcy50cmFpbEVtaXR0ZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHRoaXMudHJhaWxFbWl0dGVyc1tpXS51cGRhdGUoKTtcblxuICAgICAgICBpZih0aGlzLnRyYWlsRW1pdHRlcnNbaV0uaXNEZWFkKCkpIHtcbiAgICAgICAgICAgIHRoaXMudHJhaWxFbWl0dGVyc1tpXSA9IG51bGw7XG4gICAgICAgICAgICBuZWVkc0NvbXBhY3RpbmcgPSB0cnVlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgaWYobmVlZHNDb21wYWN0aW5nKSB7XG4gICAgICAgIENvbXBhY3RBcnJheS5jb21wYWN0KHRoaXMudHJhaWxFbWl0dGVycyk7XG4gICAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBGaXJld29yazE7IiwiRmlyZXdvcmsyLmNvbnN0cnVjdG9yID0gRmlyZXdvcmsyO1xuRmlyZXdvcmsyLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoUElYSS5Db250YWluZXIucHJvdG90eXBlKTtcblxudmFyIEVtaXR0ZXIgPSByZXF1aXJlKCcuLy4uL3BhcnRpY2xlLXN5c3RlbS9lbWl0dGVyL0VtaXR0ZXInKTtcbnZhciBFbWl0dGVyU2V0dGluZ3MgPSByZXF1aXJlKCcuLy4uL3BhcnRpY2xlLXN5c3RlbS9lbWl0dGVyL0VtaXR0ZXJTZXR0aW5ncycpO1xudmFyIFBhcnRpY2xlU2V0dGluZ3MgPSByZXF1aXJlKCcuLy4uL3BhcnRpY2xlLXN5c3RlbS9wYXJ0aWNsZS9QYXJ0aWNsZVNldHRpbmdzJyk7XG52YXIgVGV4dHVyZUdlbmVyYXRvciA9IHJlcXVpcmUoJy4vLi4vcGFydGljbGUtc3lzdGVtL3V0aWxzL1RleHR1cmVHZW5lcmF0b3InKTtcbnZhciBWZWxvY2l0eUJlaGF2aW91ciA9IHJlcXVpcmUoJy4vLi4vcGFydGljbGUtc3lzdGVtL2JlaGF2aW91cnMvVmVsb2NpdHlCZWhhdmlvdXInKTtcbnZhciBMaWZlQmVoYXZpb3VyID0gcmVxdWlyZSgnLi8uLi9wYXJ0aWNsZS1zeXN0ZW0vYmVoYXZpb3Vycy9MaWZlQmVoYXZpb3VyJyk7XG52YXIgUm90YXRpb25CZWhhdmlvdXIgPSByZXF1aXJlKCcuLy4uL3BhcnRpY2xlLXN5c3RlbS9iZWhhdmlvdXJzL1JvdGF0aW9uQmVoYXZpb3VyJyk7XG52YXIgU3BpcmFsQmVoYXZpb3VyID0gcmVxdWlyZSgnLi8uLi9wYXJ0aWNsZS1zeXN0ZW0vYmVoYXZpb3Vycy9TcGlyYWxCZWhhdmlvdXInKTtcbnZhciBGaXJld29ya1Bvc2l0aW9ucyA9IHJlcXVpcmUoJy4vRmlyZXdvcmtQb3NpdGlvbnMnKTtcbnZhciBDb21wYWN0QXJyYXkgPSByZXF1aXJlKCcuLy4uL3BhcnRpY2xlLXN5c3RlbS91dGlscy9Db21wYWN0QXJyYXknKTtcbnZhciBSaXBwbGVCZWhhdmlvdXIgPSByZXF1aXJlKCcuLy4uL3BhcnRpY2xlLXN5c3RlbS9iZWhhdmlvdXJzL1JpcHBsZUJlaGF2aW91cicpO1xuXG5mdW5jdGlvbiBGaXJld29yazIoKSB7XG4gICAgUElYSS5Db250YWluZXIuY2FsbCh0aGlzKTtcblxuICAgIHRoaXMudHJhaWxFbWl0dGVycyA9IFtdO1xuXG4gICAgdGhpcy5zZXR1cFNtb2tlRWZmZWN0KCk7XG4gICAgdGhpcy5zZXR1cEJ1cnN0RWZmZWN0KCk7XG59XG5cbkZpcmV3b3JrMi5wcm90b3R5cGUuc2V0dXBTbW9rZUVmZmVjdCA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBwYXJ0aWNsZVNldHRpbmdzID0gbmV3IFBhcnRpY2xlU2V0dGluZ3MoKTtcbiAgICBwYXJ0aWNsZVNldHRpbmdzLnNldFNwZWVkKC4xLCAuMik7XG4gICAgcGFydGljbGVTZXR0aW5ncy5zZXREaXJlY3Rpb24oMCwgTWF0aC5QSSAqIDIpO1xuICAgIHBhcnRpY2xlU2V0dGluZ3Muc2V0TGlmZSgyMCwgNDAsIDEwLCAyMCk7XG4gICAgcGFydGljbGVTZXR0aW5ncy5zZXRBbHBoYSguMDUsIC4xNSk7XG4gICAgcGFydGljbGVTZXR0aW5ncy5zZXRTY2FsZSgxMCwgMjApO1xuICAgIHBhcnRpY2xlU2V0dGluZ3MuYWRkQmVoYXZpb3VyKFZlbG9jaXR5QmVoYXZpb3VyKTtcbiAgICBwYXJ0aWNsZVNldHRpbmdzLmFkZEJlaGF2aW91cihMaWZlQmVoYXZpb3VyKTtcbiAgICBwYXJ0aWNsZVNldHRpbmdzLmFkZEJlaGF2aW91cihSb3RhdGlvbkJlaGF2aW91cik7XG4gICAgcGFydGljbGVTZXR0aW5ncy5hZGRUZXh0dXJlKFRleHR1cmVHZW5lcmF0b3IuY2lyY2xlKDIsIDB4ZmZmZmZmLCB0cnVlKSk7XG4gICAgcGFydGljbGVTZXR0aW5ncy5hZGRUZXh0dXJlKFRleHR1cmVHZW5lcmF0b3IuY2lyY2xlKDIsIDB4ODBmZmVhLCB0cnVlKSk7XG4gICAgcGFydGljbGVTZXR0aW5ncy5hZGRUZXh0dXJlKFRleHR1cmVHZW5lcmF0b3IuY2lyY2xlKDIsIDB4YjVmZmYyLCB0cnVlKSk7XG4gICAgcGFydGljbGVTZXR0aW5ncy5hZGRUZXh0dXJlKFRleHR1cmVHZW5lcmF0b3IuY2lyY2xlKDIsIDB4ZTc2ZmZmLCB0cnVlKSk7XG5cbiAgICB2YXIgZW1pdHRlclNldHRpbmdzID0gbmV3IEVtaXR0ZXJTZXR0aW5ncygpO1xuICAgIGVtaXR0ZXJTZXR0aW5ncy5zZXRRdWFudGl0eSgyMCk7XG4gICAgZW1pdHRlclNldHRpbmdzLnNldEJvdW5kcyh7dHlwZTpcIkNJUkNMRVwiLCByYWRpdXM6ODB9KTtcblxuICAgIHRoaXMuc21va2VFbWl0dGVyID0gbmV3IEVtaXR0ZXIodGhpcywgcGFydGljbGVTZXR0aW5ncywgZW1pdHRlclNldHRpbmdzKTtcbn07XG5cbkZpcmV3b3JrMi5wcm90b3R5cGUuc2V0dXBCdXJzdEVmZmVjdCA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBwYXJ0aWNsZVNldHRpbmdzID0gbmV3IFBhcnRpY2xlU2V0dGluZ3MoKTtcbiAgICBwYXJ0aWNsZVNldHRpbmdzLnNldExpZmUoMTAwLCAxNTAsIDIwLCA0MCk7XG4gICAgcGFydGljbGVTZXR0aW5ncy5hZGRCZWhhdmlvdXIoU3BpcmFsQmVoYXZpb3VyKTtcbiAgICBwYXJ0aWNsZVNldHRpbmdzLmFkZEJlaGF2aW91cihMaWZlQmVoYXZpb3VyKTtcbiAgICBwYXJ0aWNsZVNldHRpbmdzLmFkZFRleHR1cmUoVGV4dHVyZUdlbmVyYXRvci5jaXJjbGUoMiwgMHg4MGZmZWEsIHRydWUpKTtcbiAgICBwYXJ0aWNsZVNldHRpbmdzLmFkZFRleHR1cmUoVGV4dHVyZUdlbmVyYXRvci5jaXJjbGUoMiwgMHhiNWZmZjIsIHRydWUpKTtcbiAgICBwYXJ0aWNsZVNldHRpbmdzLmFkZFRleHR1cmUoVGV4dHVyZUdlbmVyYXRvci5jaXJjbGUoMiwgMHhGRkZGRkYsIHRydWUpKTtcblxuICAgIHZhciBlbWl0dGVyU2V0dGluZ3MgPSBuZXcgRW1pdHRlclNldHRpbmdzKCk7XG4gICAgZW1pdHRlclNldHRpbmdzLnNldFF1YW50aXR5KDgwKTtcbiAgICBlbWl0dGVyU2V0dGluZ3Muc2V0U3Bhd25EZWxheSgwLCAxMDAwKTtcblxuICAgIHRoaXMuYnVyc3RFbWl0dGVyID0gbmV3IEVtaXR0ZXIodGhpcywgcGFydGljbGVTZXR0aW5ncywgZW1pdHRlclNldHRpbmdzKTtcbn07XG5cbkZpcmV3b3JrMi5wcm90b3R5cGUuZ2V0VHJhaWxFbWl0dGVyID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHRyYWlsUGFydGljbGVTZXR0aW5ncyA9IG5ldyBQYXJ0aWNsZVNldHRpbmdzKCk7XG4gICAgdHJhaWxQYXJ0aWNsZVNldHRpbmdzLnNldExpZmUoMywgOCwgMSwgMjApO1xuICAgIHRyYWlsUGFydGljbGVTZXR0aW5ncy5zZXRBbHBoYSguMSwgLjUpO1xuICAgIHRyYWlsUGFydGljbGVTZXR0aW5ncy5hZGRCZWhhdmlvdXIoTGlmZUJlaGF2aW91cik7XG4gICAgdHJhaWxQYXJ0aWNsZVNldHRpbmdzLmFkZFRleHR1cmUoVGV4dHVyZUdlbmVyYXRvci5jaXJjbGUoMSwgMHg4MGZmZWEsIHRydWUpKTtcbiAgICB0cmFpbFBhcnRpY2xlU2V0dGluZ3MuYWRkVGV4dHVyZShUZXh0dXJlR2VuZXJhdG9yLmNpcmNsZSgxLCAweGI1ZmZmMiwgdHJ1ZSwgNCkpO1xuICAgIHRyYWlsUGFydGljbGVTZXR0aW5ncy5hZGRUZXh0dXJlKFRleHR1cmVHZW5lcmF0b3IuY2lyY2xlKDIsIDB4RkZGRkZGLCB0cnVlLCA4KSk7XG5cbiAgICB2YXIgdHJhaWxFbWl0dGVyU2V0dGluZ3MgPSBuZXcgRW1pdHRlclNldHRpbmdzKCk7XG4gICAgdHJhaWxFbWl0dGVyU2V0dGluZ3Muc2V0UXVhbnRpdHkoMTAwKTtcbiAgICB0cmFpbEVtaXR0ZXJTZXR0aW5ncy5zZXRSZXNwYXduKHRydWUpO1xuXG4gICAgcmV0dXJuIG5ldyBFbWl0dGVyKHRoaXMsIHRyYWlsUGFydGljbGVTZXR0aW5ncywgdHJhaWxFbWl0dGVyU2V0dGluZ3MpO1xufTtcblxuXG5GaXJld29yazIucHJvdG90eXBlLnN0YXJ0ID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHRyYWlsRW1pdHRlciA9IHRoaXMuZ2V0VHJhaWxFbWl0dGVyKCk7XG4gICAgdmFyIGxhdW5jaFBvc2l0aW9uID0gRmlyZXdvcmtQb3NpdGlvbnMubGF1bmNoUG9zaXRpb24oKTtcbiAgICB2YXIgYnVyc3RQb3NpdGlvbiA9IEZpcmV3b3JrUG9zaXRpb25zLmJ1cnN0UG9zaXRpb24oKTtcblxuICAgIHRyYWlsRW1pdHRlci54ID0gbGF1bmNoUG9zaXRpb24ueDtcbiAgICB0cmFpbEVtaXR0ZXIueSA9IGxhdW5jaFBvc2l0aW9uLnk7XG4gICAgdHJhaWxFbWl0dGVyLnN0YXJ0KCk7XG5cbiAgICB0aGlzLnRyYWlsRW1pdHRlcnMucHVzaCh0cmFpbEVtaXR0ZXIpO1xuXG4gICAgdmFyIGNhbGxiYWNrID0gdGhpcy50cmFpbENvbXBsZXRlLmJpbmQodGhpcyk7XG5cbiAgICBuZXcgVFdFRU4uVHdlZW4odHJhaWxFbWl0dGVyKVxuICAgICAgICAudG8oe3ggOiBidXJzdFBvc2l0aW9uLngsIHkgOiBidXJzdFBvc2l0aW9uLnl9LCAyMDAwKVxuICAgICAgICAuZWFzaW5nKFRXRUVOLkVhc2luZy5DdWJpYy5JbilcbiAgICAgICAgLnN0YXJ0KClcbiAgICAgICAgLm9uQ29tcGxldGUoZnVuY3Rpb24oKXsgY2FsbGJhY2sodHJhaWxFbWl0dGVyKSB9KTtcbn07XG5cbkZpcmV3b3JrMi5wcm90b3R5cGUudHJhaWxDb21wbGV0ZSA9IGZ1bmN0aW9uKHRyYWlsRW1pdHRlcikge1xuICAgIHRoaXMuc21va2VFbWl0dGVyLnggPSB0aGlzLmJ1cnN0RW1pdHRlci54ID0gdHJhaWxFbWl0dGVyLng7XG4gICAgdGhpcy5zbW9rZUVtaXR0ZXIueSA9IHRoaXMuYnVyc3RFbWl0dGVyLnkgPSB0cmFpbEVtaXR0ZXIueTtcblxuICAgIHRoaXMuc21va2VFbWl0dGVyLnN0YXJ0KCk7XG4gICAgdGhpcy5idXJzdEVtaXR0ZXIuc3RhcnQoKTtcblxuICAgIFJpcHBsZUJlaGF2aW91ci5zdGFydEZsYXNoKDE1MDApO1xuICAgIHRyYWlsRW1pdHRlci5zdG9wUmVzcGF3bigpO1xuICAgIHRyYWlsRW1pdHRlci5zZXREZWFkV2hlbkVtcHR5KHRydWUpO1xufTtcblxuRmlyZXdvcmsyLnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnNtb2tlRW1pdHRlci51cGRhdGUoKTtcbiAgICB0aGlzLmJ1cnN0RW1pdHRlci51cGRhdGUoKTtcblxuICAgIHZhciBuZWVkc0NvbXBhY3RpbmcgPSBmYWxzZTtcblxuICAgIGZvcih2YXIgaSA9IDA7IGkgPCAgdGhpcy50cmFpbEVtaXR0ZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHRoaXMudHJhaWxFbWl0dGVyc1tpXS51cGRhdGUoKTtcblxuICAgICAgICBpZih0aGlzLnRyYWlsRW1pdHRlcnNbaV0uaXNEZWFkKCkpIHtcbiAgICAgICAgICAgIHRoaXMudHJhaWxFbWl0dGVyc1tpXSA9IG51bGw7XG4gICAgICAgICAgICBuZWVkc0NvbXBhY3RpbmcgPSB0cnVlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgaWYobmVlZHNDb21wYWN0aW5nKSB7XG4gICAgICAgIENvbXBhY3RBcnJheS5jb21wYWN0KHRoaXMudHJhaWxFbWl0dGVycyk7XG4gICAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBGaXJld29yazI7IiwiRmlyZXdvcmszLmNvbnN0cnVjdG9yID0gRmlyZXdvcmszO1xuRmlyZXdvcmszLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoUElYSS5Db250YWluZXIucHJvdG90eXBlKTtcblxudmFyIEVtaXR0ZXIgPSByZXF1aXJlKCcuLy4uL3BhcnRpY2xlLXN5c3RlbS9lbWl0dGVyL0VtaXR0ZXInKTtcbnZhciBFbWl0dGVyU2V0dGluZ3MgPSByZXF1aXJlKCcuLy4uL3BhcnRpY2xlLXN5c3RlbS9lbWl0dGVyL0VtaXR0ZXJTZXR0aW5ncycpO1xudmFyIFBhcnRpY2xlU2V0dGluZ3MgPSByZXF1aXJlKCcuLy4uL3BhcnRpY2xlLXN5c3RlbS9wYXJ0aWNsZS9QYXJ0aWNsZVNldHRpbmdzJyk7XG52YXIgVGV4dHVyZUdlbmVyYXRvciA9IHJlcXVpcmUoJy4vLi4vcGFydGljbGUtc3lzdGVtL3V0aWxzL1RleHR1cmVHZW5lcmF0b3InKTtcbnZhciBWZWxvY2l0eUJlaGF2aW91ciA9IHJlcXVpcmUoJy4vLi4vcGFydGljbGUtc3lzdGVtL2JlaGF2aW91cnMvVmVsb2NpdHlCZWhhdmlvdXInKTtcbnZhciBMaWZlQmVoYXZpb3VyID0gcmVxdWlyZSgnLi8uLi9wYXJ0aWNsZS1zeXN0ZW0vYmVoYXZpb3Vycy9MaWZlQmVoYXZpb3VyJyk7XG52YXIgUm90YXRpb25CZWhhdmlvdXIgPSByZXF1aXJlKCcuLy4uL3BhcnRpY2xlLXN5c3RlbS9iZWhhdmlvdXJzL1JvdGF0aW9uQmVoYXZpb3VyJyk7XG52YXIgRGVjYXlCZWhhdmlvdXIgPSByZXF1aXJlKCcuLy4uL3BhcnRpY2xlLXN5c3RlbS9iZWhhdmlvdXJzL0RlY2F5QmVoYXZpb3VyJyk7XG52YXIgRmlyZXdvcmtQb3NpdGlvbnMgPSByZXF1aXJlKCcuL0ZpcmV3b3JrUG9zaXRpb25zJyk7XG52YXIgQ29tcGFjdEFycmF5ID0gcmVxdWlyZSgnLi8uLi9wYXJ0aWNsZS1zeXN0ZW0vdXRpbHMvQ29tcGFjdEFycmF5Jyk7XG52YXIgUmlwcGxlQmVoYXZpb3VyID0gcmVxdWlyZSgnLi8uLi9wYXJ0aWNsZS1zeXN0ZW0vYmVoYXZpb3Vycy9SaXBwbGVCZWhhdmlvdXInKTtcblxuZnVuY3Rpb24gRmlyZXdvcmszKCkge1xuICAgIFBJWEkuQ29udGFpbmVyLmNhbGwodGhpcyk7XG5cbiAgICB0aGlzLnRyYWlsRW1pdHRlcnMgPSBbXTtcblxuICAgIHRoaXMuc2V0dXBTbW9rZUVmZmVjdCgpO1xuICAgIHRoaXMuc2V0dXBCdXJzdEVmZmVjdCgpO1xufVxuXG5GaXJld29yazMucHJvdG90eXBlLnNldHVwU21va2VFZmZlY3QgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgcGFydGljbGVTZXR0aW5ncyA9IG5ldyBQYXJ0aWNsZVNldHRpbmdzKCk7XG4gICAgcGFydGljbGVTZXR0aW5ncy5zZXRTcGVlZCguMSwgLjIpO1xuICAgIHBhcnRpY2xlU2V0dGluZ3Muc2V0RGlyZWN0aW9uKDAsIE1hdGguUEkgKiAyKTtcbiAgICBwYXJ0aWNsZVNldHRpbmdzLnNldExpZmUoMjAsIDQwLCAxMCwgMjApO1xuICAgIHBhcnRpY2xlU2V0dGluZ3Muc2V0QWxwaGEoLjA1LCAuMTUpO1xuICAgIHBhcnRpY2xlU2V0dGluZ3Muc2V0U2NhbGUoMTAsIDE1KTtcbiAgICBwYXJ0aWNsZVNldHRpbmdzLmFkZEJlaGF2aW91cihWZWxvY2l0eUJlaGF2aW91cik7XG4gICAgcGFydGljbGVTZXR0aW5ncy5hZGRCZWhhdmlvdXIoTGlmZUJlaGF2aW91cik7XG4gICAgcGFydGljbGVTZXR0aW5ncy5hZGRCZWhhdmlvdXIoUm90YXRpb25CZWhhdmlvdXIpO1xuICAgIHBhcnRpY2xlU2V0dGluZ3MuYWRkVGV4dHVyZShUZXh0dXJlR2VuZXJhdG9yLmNpcmNsZSgzLCAweGNjZmZmZiwgZmFsc2UsIDIpKTtcbiAgICBwYXJ0aWNsZVNldHRpbmdzLmFkZFRleHR1cmUoVGV4dHVyZUdlbmVyYXRvci5jaXJjbGUoMywgMHhmZjExZmYsIHRydWUsIDIpKTtcbiAgICBwYXJ0aWNsZVNldHRpbmdzLmFkZFRleHR1cmUoVGV4dHVyZUdlbmVyYXRvci5jaXJjbGUoMywgMHhmZmZmMTEsIGZhbHNlLCAyKSk7XG5cbiAgICB2YXIgZW1pdHRlclNldHRpbmdzID0gbmV3IEVtaXR0ZXJTZXR0aW5ncygpO1xuICAgIGVtaXR0ZXJTZXR0aW5ncy5zZXRRdWFudGl0eSgyMCk7XG4gICAgZW1pdHRlclNldHRpbmdzLnNldEJvdW5kcyh7dHlwZTpcIkNJUkNMRVwiLCByYWRpdXM6ODB9KTtcblxuICAgIHRoaXMuc21va2VFbWl0dGVyID0gbmV3IEVtaXR0ZXIodGhpcywgcGFydGljbGVTZXR0aW5ncywgZW1pdHRlclNldHRpbmdzKTtcbn07XG5cbkZpcmV3b3JrMy5wcm90b3R5cGUuc2V0dXBCdXJzdEVmZmVjdCA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBwYXJ0aWNsZVNldHRpbmdzID0gbmV3IFBhcnRpY2xlU2V0dGluZ3MoKTtcbiAgICBwYXJ0aWNsZVNldHRpbmdzLnNldFNwZWVkKDEsIDUpO1xuICAgIHBhcnRpY2xlU2V0dGluZ3Muc2V0RGlyZWN0aW9uKDAsIE1hdGguUEkgKiAyKTtcbiAgICBwYXJ0aWNsZVNldHRpbmdzLnNldExpZmUoNDAsIDgwLCAxMCwgNDApO1xuICAgIHBhcnRpY2xlU2V0dGluZ3Muc2V0U2NhbGUoLjQsIDEpO1xuICAgIHBhcnRpY2xlU2V0dGluZ3Muc2V0RGVjYXkoLjk1LCAuOTUpO1xuICAgIHBhcnRpY2xlU2V0dGluZ3Muc2V0R3Jhdml0eSguNSwgMSk7XG4gICAgcGFydGljbGVTZXR0aW5ncy5hZGRCZWhhdmlvdXIoVmVsb2NpdHlCZWhhdmlvdXIpO1xuICAgIHBhcnRpY2xlU2V0dGluZ3MuYWRkQmVoYXZpb3VyKExpZmVCZWhhdmlvdXIpO1xuICAgIHBhcnRpY2xlU2V0dGluZ3MuYWRkQmVoYXZpb3VyKERlY2F5QmVoYXZpb3VyKTtcbiAgICBwYXJ0aWNsZVNldHRpbmdzLmFkZFRleHR1cmUoVGV4dHVyZUdlbmVyYXRvci5jaXJjbGUoMywgMHhkZGZmZmYsIHRydWUpKTtcbiAgICBwYXJ0aWNsZVNldHRpbmdzLmFkZFRleHR1cmUoVGV4dHVyZUdlbmVyYXRvci5jaXJjbGUoMywgMHhmZmZmZmYsIHRydWUpKTtcbiAgICBwYXJ0aWNsZVNldHRpbmdzLmFkZFRleHR1cmUoVGV4dHVyZUdlbmVyYXRvci5jaXJjbGUoMywgMHhmZmRkZmYsIHRydWUpKTtcbiAgICBwYXJ0aWNsZVNldHRpbmdzLmFkZFRleHR1cmUoVGV4dHVyZUdlbmVyYXRvci5jaXJjbGUoMywgMHhmZmZmZGQsIHRydWUpKTtcblxuICAgIHZhciBlbWl0dGVyU2V0dGluZ3MgPSBuZXcgRW1pdHRlclNldHRpbmdzKCk7XG4gICAgZW1pdHRlclNldHRpbmdzLnNldFF1YW50aXR5KDEwMCk7XG5cbiAgICB0aGlzLmJ1cnN0RW1pdHRlciA9IG5ldyBFbWl0dGVyKHRoaXMsIHBhcnRpY2xlU2V0dGluZ3MsIGVtaXR0ZXJTZXR0aW5ncyk7XG59O1xuXG5GaXJld29yazMucHJvdG90eXBlLmdldFRyYWlsRW1pdHRlciA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciB0cmFpbFBhcnRpY2xlU2V0dGluZ3MgPSBuZXcgUGFydGljbGVTZXR0aW5ncygpO1xuICAgIHRyYWlsUGFydGljbGVTZXR0aW5ncy5zZXRMaWZlKDMsIDgsIDEsIDIwKTtcbiAgICB0cmFpbFBhcnRpY2xlU2V0dGluZ3Muc2V0QWxwaGEoLjEsIC41KTtcbiAgICB0cmFpbFBhcnRpY2xlU2V0dGluZ3MuYWRkQmVoYXZpb3VyKExpZmVCZWhhdmlvdXIpO1xuICAgIHRyYWlsUGFydGljbGVTZXR0aW5ncy5hZGRUZXh0dXJlKFRleHR1cmVHZW5lcmF0b3IuY2lyY2xlKDEsIDB4ZjJmZmUyLCB0cnVlKSk7XG4gICAgdHJhaWxQYXJ0aWNsZVNldHRpbmdzLmFkZFRleHR1cmUoVGV4dHVyZUdlbmVyYXRvci5jaXJjbGUoMSwgMHhmNWZmYTYsIHRydWUsIDQpKTtcbiAgICB0cmFpbFBhcnRpY2xlU2V0dGluZ3MuYWRkVGV4dHVyZShUZXh0dXJlR2VuZXJhdG9yLmNpcmNsZSgyLCAweGY1ZmZhNiwgdHJ1ZSwgOCkpO1xuXG4gICAgdmFyIHRyYWlsRW1pdHRlclNldHRpbmdzID0gbmV3IEVtaXR0ZXJTZXR0aW5ncygpO1xuICAgIHRyYWlsRW1pdHRlclNldHRpbmdzLnNldFF1YW50aXR5KDEwMCk7XG4gICAgdHJhaWxFbWl0dGVyU2V0dGluZ3Muc2V0UmVzcGF3bih0cnVlKTtcblxuICAgIHJldHVybiBuZXcgRW1pdHRlcih0aGlzLCB0cmFpbFBhcnRpY2xlU2V0dGluZ3MsIHRyYWlsRW1pdHRlclNldHRpbmdzKTtcbn07XG5cbkZpcmV3b3JrMy5wcm90b3R5cGUuc3RhcnQgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgdHJhaWxFbWl0dGVyID0gdGhpcy5nZXRUcmFpbEVtaXR0ZXIoKTtcbiAgICB2YXIgbGF1bmNoUG9zaXRpb24gPSBGaXJld29ya1Bvc2l0aW9ucy5sYXVuY2hQb3NpdGlvbigpO1xuICAgIHZhciBidXJzdFBvc2l0aW9uID0gRmlyZXdvcmtQb3NpdGlvbnMuYnVyc3RQb3NpdGlvbigpO1xuXG4gICAgdHJhaWxFbWl0dGVyLnggPSBsYXVuY2hQb3NpdGlvbi54O1xuICAgIHRyYWlsRW1pdHRlci55ID0gbGF1bmNoUG9zaXRpb24ueTtcbiAgICB0cmFpbEVtaXR0ZXIuc3RhcnQoKTtcblxuICAgIHRoaXMudHJhaWxFbWl0dGVycy5wdXNoKHRyYWlsRW1pdHRlcik7XG5cbiAgICB2YXIgY2FsbGJhY2sgPSB0aGlzLnRyYWlsQ29tcGxldGUuYmluZCh0aGlzKTtcblxuICAgIG5ldyBUV0VFTi5Ud2Vlbih0cmFpbEVtaXR0ZXIpXG4gICAgICAgIC50byh7eCA6IGJ1cnN0UG9zaXRpb24ueCwgeSA6IGJ1cnN0UG9zaXRpb24ueX0sIDIwMDApXG4gICAgICAgIC5lYXNpbmcoVFdFRU4uRWFzaW5nLkN1YmljLkluKVxuICAgICAgICAuc3RhcnQoKVxuICAgICAgICAub25Db21wbGV0ZShmdW5jdGlvbigpeyBjYWxsYmFjayh0cmFpbEVtaXR0ZXIpIH0pO1xufTtcblxuRmlyZXdvcmszLnByb3RvdHlwZS50cmFpbENvbXBsZXRlID0gZnVuY3Rpb24odHJhaWxFbWl0dGVyKSB7XG4gICAgdGhpcy5zbW9rZUVtaXR0ZXIueCA9IHRoaXMuYnVyc3RFbWl0dGVyLnggPSB0cmFpbEVtaXR0ZXIueDtcbiAgICB0aGlzLnNtb2tlRW1pdHRlci55ID0gdGhpcy5idXJzdEVtaXR0ZXIueSA9IHRyYWlsRW1pdHRlci55O1xuXG4gICAgdGhpcy5zbW9rZUVtaXR0ZXIuc3RhcnQoKTtcbiAgICB0aGlzLmJ1cnN0RW1pdHRlci5zdGFydCgpO1xuXG4gICAgUmlwcGxlQmVoYXZpb3VyLnN0YXJ0Rmxhc2goMTUwMCk7XG4gICAgdHJhaWxFbWl0dGVyLnN0b3BSZXNwYXduKCk7XG4gICAgdHJhaWxFbWl0dGVyLnNldERlYWRXaGVuRW1wdHkodHJ1ZSk7XG59O1xuXG5GaXJld29yazMucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuc21va2VFbWl0dGVyLnVwZGF0ZSgpO1xuICAgIHRoaXMuYnVyc3RFbWl0dGVyLnVwZGF0ZSgpO1xuXG4gICAgdmFyIG5lZWRzQ29tcGFjdGluZyA9IGZhbHNlO1xuXG4gICAgZm9yKHZhciBpID0gMDsgaSA8ICB0aGlzLnRyYWlsRW1pdHRlcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdGhpcy50cmFpbEVtaXR0ZXJzW2ldLnVwZGF0ZSgpO1xuXG4gICAgICAgIGlmKHRoaXMudHJhaWxFbWl0dGVyc1tpXS5pc0RlYWQoKSkge1xuICAgICAgICAgICAgdGhpcy50cmFpbEVtaXR0ZXJzW2ldID0gbnVsbDtcbiAgICAgICAgICAgIG5lZWRzQ29tcGFjdGluZyA9IHRydWU7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBpZihuZWVkc0NvbXBhY3RpbmcpIHtcbiAgICAgICAgQ29tcGFjdEFycmF5LmNvbXBhY3QodGhpcy50cmFpbEVtaXR0ZXJzKTtcbiAgICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEZpcmV3b3JrMzsiLCJGaXJld29yazQuY29uc3RydWN0b3IgPSBGaXJld29yazQ7XG5GaXJld29yazQucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShQSVhJLkNvbnRhaW5lci5wcm90b3R5cGUpO1xuXG52YXIgRW1pdHRlciA9IHJlcXVpcmUoJy4vLi4vcGFydGljbGUtc3lzdGVtL2VtaXR0ZXIvRW1pdHRlcicpO1xudmFyIEVtaXR0ZXJTZXR0aW5ncyA9IHJlcXVpcmUoJy4vLi4vcGFydGljbGUtc3lzdGVtL2VtaXR0ZXIvRW1pdHRlclNldHRpbmdzJyk7XG52YXIgUGFydGljbGVTZXR0aW5ncyA9IHJlcXVpcmUoJy4vLi4vcGFydGljbGUtc3lzdGVtL3BhcnRpY2xlL1BhcnRpY2xlU2V0dGluZ3MnKTtcbnZhciBUZXh0dXJlR2VuZXJhdG9yID0gcmVxdWlyZSgnLi8uLi9wYXJ0aWNsZS1zeXN0ZW0vdXRpbHMvVGV4dHVyZUdlbmVyYXRvcicpO1xudmFyIFZlbG9jaXR5QmVoYXZpb3VyID0gcmVxdWlyZSgnLi8uLi9wYXJ0aWNsZS1zeXN0ZW0vYmVoYXZpb3Vycy9WZWxvY2l0eUJlaGF2aW91cicpO1xudmFyIExpZmVCZWhhdmlvdXIgPSByZXF1aXJlKCcuLy4uL3BhcnRpY2xlLXN5c3RlbS9iZWhhdmlvdXJzL0xpZmVCZWhhdmlvdXInKTtcbnZhciBHcmF2aXR5QmVoYXZpb3VyID0gcmVxdWlyZSgnLi8uLi9wYXJ0aWNsZS1zeXN0ZW0vYmVoYXZpb3Vycy9HcmF2aXR5QmVoYXZpb3VyJyk7XG52YXIgUm90YXRpb25CZWhhdmlvdXIgPSByZXF1aXJlKCcuLy4uL3BhcnRpY2xlLXN5c3RlbS9iZWhhdmlvdXJzL1JvdGF0aW9uQmVoYXZpb3VyJyk7XG52YXIgRGVjYXlCZWhhdmlvdXIgPSByZXF1aXJlKCcuLy4uL3BhcnRpY2xlLXN5c3RlbS9iZWhhdmlvdXJzL0RlY2F5QmVoYXZpb3VyJyk7XG52YXIgRmlyZXdvcmtQb3NpdGlvbnMgPSByZXF1aXJlKCcuL0ZpcmV3b3JrUG9zaXRpb25zJyk7XG52YXIgQ29tcGFjdEFycmF5ID0gcmVxdWlyZSgnLi8uLi9wYXJ0aWNsZS1zeXN0ZW0vdXRpbHMvQ29tcGFjdEFycmF5Jyk7XG52YXIgUmlwcGxlQmVoYXZpb3VyID0gcmVxdWlyZSgnLi8uLi9wYXJ0aWNsZS1zeXN0ZW0vYmVoYXZpb3Vycy9SaXBwbGVCZWhhdmlvdXInKTtcblxuZnVuY3Rpb24gRmlyZXdvcms0KCkge1xuICAgIFBJWEkuQ29udGFpbmVyLmNhbGwodGhpcyk7XG5cbiAgICB0aGlzLnRyYWlsRW1pdHRlcnMgPSBbXTtcblxuICAgIHRoaXMuc2V0dXBTbW9rZUVmZmVjdCgpO1xuICAgIHRoaXMuc2V0dXBCdXJzdEVmZmVjdCgpO1xufVxuXG5GaXJld29yazQucHJvdG90eXBlLnNldHVwU21va2VFZmZlY3QgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgcGFydGljbGVTZXR0aW5ncyA9IG5ldyBQYXJ0aWNsZVNldHRpbmdzKCk7XG4gICAgcGFydGljbGVTZXR0aW5ncy5zZXRTcGVlZCguMSwgLjIpO1xuICAgIHBhcnRpY2xlU2V0dGluZ3Muc2V0RGlyZWN0aW9uKDAsIE1hdGguUEkgKiAyKTtcbiAgICBwYXJ0aWNsZVNldHRpbmdzLnNldExpZmUoMjAsIDQwLCAxMCwgMjApO1xuICAgIHBhcnRpY2xlU2V0dGluZ3Muc2V0QWxwaGEoLjEsIC4yKTtcbiAgICBwYXJ0aWNsZVNldHRpbmdzLnNldFNjYWxlKDEwLCAxNSk7XG4gICAgcGFydGljbGVTZXR0aW5ncy5hZGRCZWhhdmlvdXIoVmVsb2NpdHlCZWhhdmlvdXIpO1xuICAgIHBhcnRpY2xlU2V0dGluZ3MuYWRkQmVoYXZpb3VyKExpZmVCZWhhdmlvdXIpO1xuICAgIHBhcnRpY2xlU2V0dGluZ3MuYWRkQmVoYXZpb3VyKFJvdGF0aW9uQmVoYXZpb3VyKTtcbiAgICBwYXJ0aWNsZVNldHRpbmdzLmFkZFRleHR1cmUoVGV4dHVyZUdlbmVyYXRvci5jaXJjbGUoMywgMHhmZmZmZmYsIGZhbHNlLCAyKSk7XG4gICAgcGFydGljbGVTZXR0aW5ncy5hZGRUZXh0dXJlKFRleHR1cmVHZW5lcmF0b3IuY2lyY2xlKDMsIDB4YzNlOGJlLCB0cnVlLCAyKSk7XG4gICAgcGFydGljbGVTZXR0aW5ncy5hZGRUZXh0dXJlKFRleHR1cmVHZW5lcmF0b3IuY2lyY2xlKDMsIDB4YmRmYWIwLCBmYWxzZSwgMikpO1xuICAgIHBhcnRpY2xlU2V0dGluZ3MuYWRkVGV4dHVyZShUZXh0dXJlR2VuZXJhdG9yLmNpcmNsZSgzLCAweGNhZjk3NywgZmFsc2UsIDIpKTtcbiAgICBwYXJ0aWNsZVNldHRpbmdzLmFkZFRleHR1cmUoVGV4dHVyZUdlbmVyYXRvci5jaXJjbGUoMywgMHg1YWZhOWIsIGZhbHNlLCAyKSk7XG5cbiAgICB2YXIgZW1pdHRlclNldHRpbmdzID0gbmV3IEVtaXR0ZXJTZXR0aW5ncygpO1xuICAgIGVtaXR0ZXJTZXR0aW5ncy5zZXRRdWFudGl0eSgyMCk7XG4gICAgZW1pdHRlclNldHRpbmdzLnNldEJvdW5kcyh7dHlwZTpcIkNJUkNMRVwiLCByYWRpdXM6MTIwfSk7XG5cbiAgICB0aGlzLnNtb2tlRW1pdHRlciA9IG5ldyBFbWl0dGVyKHRoaXMsIHBhcnRpY2xlU2V0dGluZ3MsIGVtaXR0ZXJTZXR0aW5ncyk7XG59O1xuXG5GaXJld29yazQucHJvdG90eXBlLnNldHVwQnVyc3RFZmZlY3QgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgcGFydGljbGVTZXR0aW5ncyA9IG5ldyBQYXJ0aWNsZVNldHRpbmdzKCk7XG4gICAgcGFydGljbGVTZXR0aW5ncy5zZXRTcGVlZCgyLCAxNSk7XG4gICAgcGFydGljbGVTZXR0aW5ncy5zZXREaXJlY3Rpb24oMCwgTWF0aC5QSSAqIDIpO1xuICAgIHBhcnRpY2xlU2V0dGluZ3Muc2V0TGlmZSgzMCwgNjAsIDEwLCAzMCk7XG4gICAgcGFydGljbGVTZXR0aW5ncy5zZXRTY2FsZSguNCwgMS4yKTtcbiAgICBwYXJ0aWNsZVNldHRpbmdzLnNldERlY2F5KC45MSwgLjkxKTtcbiAgICBwYXJ0aWNsZVNldHRpbmdzLnNldEdyYXZpdHkoLjEsIDEpO1xuICAgIHBhcnRpY2xlU2V0dGluZ3MuYWRkQmVoYXZpb3VyKFZlbG9jaXR5QmVoYXZpb3VyKTtcbiAgICBwYXJ0aWNsZVNldHRpbmdzLmFkZEJlaGF2aW91cihMaWZlQmVoYXZpb3VyKTtcbiAgICBwYXJ0aWNsZVNldHRpbmdzLmFkZEJlaGF2aW91cihHcmF2aXR5QmVoYXZpb3VyKTtcbiAgICBwYXJ0aWNsZVNldHRpbmdzLmFkZEJlaGF2aW91cihEZWNheUJlaGF2aW91cik7XG4gICAgcGFydGljbGVTZXR0aW5ncy5hZGRUZXh0dXJlKFRleHR1cmVHZW5lcmF0b3IuY2lyY2xlKDMsIDB4YzNlOGJlLCB0cnVlKSk7XG4gICAgcGFydGljbGVTZXR0aW5ncy5hZGRUZXh0dXJlKFRleHR1cmVHZW5lcmF0b3IuY2lyY2xlKDMsIDB4YmRmYWIwLCB0cnVlKSk7XG4gICAgcGFydGljbGVTZXR0aW5ncy5hZGRUZXh0dXJlKFRleHR1cmVHZW5lcmF0b3IuY2lyY2xlKDMsIDB4Y2FmOTc3LCB0cnVlKSk7XG5cbiAgICB2YXIgZW1pdHRlclNldHRpbmdzID0gbmV3IEVtaXR0ZXJTZXR0aW5ncygpO1xuICAgIGVtaXR0ZXJTZXR0aW5ncy5zZXRRdWFudGl0eSgxMDApO1xuXG4gICAgdGhpcy5idXJzdEVtaXR0ZXIgPSBuZXcgRW1pdHRlcih0aGlzLCBwYXJ0aWNsZVNldHRpbmdzLCBlbWl0dGVyU2V0dGluZ3MpO1xufTtcblxuRmlyZXdvcms0LnByb3RvdHlwZS5nZXRTcGFya2xlRW1pdHRlciA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBwYXJ0aWNsZVNldHRpbmdzID0gbmV3IFBhcnRpY2xlU2V0dGluZ3MoKTtcbiAgICBwYXJ0aWNsZVNldHRpbmdzLnNldERpcmVjdGlvbigwLCBNYXRoLlBJICogMik7XG4gICAgcGFydGljbGVTZXR0aW5ncy5zZXRMaWZlKDIsIDgsIDAsIDApO1xuICAgIHBhcnRpY2xlU2V0dGluZ3Muc2V0U2NhbGUoLjQsIDEpO1xuICAgIHBhcnRpY2xlU2V0dGluZ3Muc2V0R3Jhdml0eSgxLCAxKTtcbiAgICBwYXJ0aWNsZVNldHRpbmdzLmFkZEJlaGF2aW91cihWZWxvY2l0eUJlaGF2aW91cik7XG4gICAgcGFydGljbGVTZXR0aW5ncy5hZGRCZWhhdmlvdXIoTGlmZUJlaGF2aW91cik7XG4gICAgcGFydGljbGVTZXR0aW5ncy5hZGRCZWhhdmlvdXIoR3Jhdml0eUJlaGF2aW91cik7XG4gICAgcGFydGljbGVTZXR0aW5ncy5hZGRUZXh0dXJlKFRleHR1cmVHZW5lcmF0b3IuY2lyY2xlKDIsIDB4ZmZmZmZmLCB0cnVlKSk7XG4gICAgcGFydGljbGVTZXR0aW5ncy5hZGRUZXh0dXJlKFRleHR1cmVHZW5lcmF0b3IuY2lyY2xlKDIsIDB4ZmZmZmZmLCB0cnVlLCA2KSk7XG5cbiAgICB2YXIgZW1pdHRlclNldHRpbmdzID0gbmV3IEVtaXR0ZXJTZXR0aW5ncygpO1xuICAgIGVtaXR0ZXJTZXR0aW5ncy5zZXRRdWFudGl0eSgzMDApO1xuICAgIGVtaXR0ZXJTZXR0aW5ncy5zZXRTcGF3bkRlbGF5KDUwMCwgMjUwMCk7XG4gICAgZW1pdHRlclNldHRpbmdzLnNldEJvdW5kcyh7dHlwZTpcIkNJUkNMRVwiLCByYWRpdXM6MTgwfSk7XG5cbiAgICByZXR1cm4gbmV3IEVtaXR0ZXIodGhpcywgcGFydGljbGVTZXR0aW5ncywgZW1pdHRlclNldHRpbmdzKTtcbn07XG5cbkZpcmV3b3JrNC5wcm90b3R5cGUuZ2V0VHJhaWxFbWl0dGVyID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHRyYWlsUGFydGljbGVTZXR0aW5ncyA9IG5ldyBQYXJ0aWNsZVNldHRpbmdzKCk7XG4gICAgdHJhaWxQYXJ0aWNsZVNldHRpbmdzLnNldExpZmUoMywgOCwgMSwgMjApO1xuICAgIHRyYWlsUGFydGljbGVTZXR0aW5ncy5zZXRBbHBoYSguMSwgLjUpO1xuICAgIHRyYWlsUGFydGljbGVTZXR0aW5ncy5hZGRCZWhhdmlvdXIoTGlmZUJlaGF2aW91cik7XG4gICAgdHJhaWxQYXJ0aWNsZVNldHRpbmdzLmFkZFRleHR1cmUoVGV4dHVyZUdlbmVyYXRvci5jaXJjbGUoMSwgMHg4MGZmZWEsIHRydWUpKTtcbiAgICB0cmFpbFBhcnRpY2xlU2V0dGluZ3MuYWRkVGV4dHVyZShUZXh0dXJlR2VuZXJhdG9yLmNpcmNsZSgxLCAweGI1ZmZmMiwgdHJ1ZSwgNCkpO1xuICAgIHRyYWlsUGFydGljbGVTZXR0aW5ncy5hZGRUZXh0dXJlKFRleHR1cmVHZW5lcmF0b3IuY2lyY2xlKDIsIDB4RkZGRkZGLCB0cnVlLCA4KSk7XG5cbiAgICB2YXIgdHJhaWxFbWl0dGVyU2V0dGluZ3MgPSBuZXcgRW1pdHRlclNldHRpbmdzKCk7XG4gICAgdHJhaWxFbWl0dGVyU2V0dGluZ3Muc2V0UXVhbnRpdHkoMTAwKTtcbiAgICB0cmFpbEVtaXR0ZXJTZXR0aW5ncy5zZXRSZXNwYXduKHRydWUpO1xuXG4gICAgcmV0dXJuIG5ldyBFbWl0dGVyKHRoaXMsIHRyYWlsUGFydGljbGVTZXR0aW5ncywgdHJhaWxFbWl0dGVyU2V0dGluZ3MpO1xufTtcblxuXG5GaXJld29yazQucHJvdG90eXBlLnN0YXJ0ID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHRyYWlsRW1pdHRlciA9IHRoaXMuZ2V0VHJhaWxFbWl0dGVyKCk7XG4gICAgdmFyIGxhdW5jaFBvc2l0aW9uID0gRmlyZXdvcmtQb3NpdGlvbnMubGF1bmNoUG9zaXRpb24oKTtcbiAgICB2YXIgYnVyc3RQb3NpdGlvbiA9IEZpcmV3b3JrUG9zaXRpb25zLmJ1cnN0UG9zaXRpb24oKTtcblxuICAgIHRyYWlsRW1pdHRlci54ID0gbGF1bmNoUG9zaXRpb24ueDtcbiAgICB0cmFpbEVtaXR0ZXIueSA9IGxhdW5jaFBvc2l0aW9uLnk7XG4gICAgdHJhaWxFbWl0dGVyLnN0YXJ0KCk7XG5cbiAgICB0aGlzLnRyYWlsRW1pdHRlcnMucHVzaCh0cmFpbEVtaXR0ZXIpO1xuXG4gICAgdmFyIGNhbGxiYWNrID0gdGhpcy50cmFpbENvbXBsZXRlLmJpbmQodGhpcyk7XG5cbiAgICBuZXcgVFdFRU4uVHdlZW4odHJhaWxFbWl0dGVyKVxuICAgICAgICAudG8oe3ggOiBidXJzdFBvc2l0aW9uLngsIHkgOiBidXJzdFBvc2l0aW9uLnl9LCAyMDAwKVxuICAgICAgICAuZWFzaW5nKFRXRUVOLkVhc2luZy5DdWJpYy5JbilcbiAgICAgICAgLnN0YXJ0KClcbiAgICAgICAgLm9uQ29tcGxldGUoZnVuY3Rpb24oKXsgY2FsbGJhY2sodHJhaWxFbWl0dGVyKSB9KTtcbn07XG5cbkZpcmV3b3JrNC5wcm90b3R5cGUudHJhaWxDb21wbGV0ZSA9IGZ1bmN0aW9uKHRyYWlsRW1pdHRlcikge1xuICAgIHZhciBzcGFya2xlRW1pdHRlciA9IHRoaXMuZ2V0U3BhcmtsZUVtaXR0ZXIoKTtcbiAgICB0aGlzLnRyYWlsRW1pdHRlcnMucHVzaChzcGFya2xlRW1pdHRlcik7XG4gICAgdGhpcy5zbW9rZUVtaXR0ZXIueCA9IHRoaXMuYnVyc3RFbWl0dGVyLnggPSBzcGFya2xlRW1pdHRlci54ID0gdHJhaWxFbWl0dGVyLng7XG4gICAgdGhpcy5zbW9rZUVtaXR0ZXIueSA9IHRoaXMuYnVyc3RFbWl0dGVyLnkgPSBzcGFya2xlRW1pdHRlci55ID0gdHJhaWxFbWl0dGVyLnk7XG5cbiAgICB0aGlzLnNtb2tlRW1pdHRlci5zdGFydCgpO1xuICAgIHRoaXMuYnVyc3RFbWl0dGVyLnN0YXJ0KCk7XG4gICAgc3BhcmtsZUVtaXR0ZXIuc3RhcnQoKTtcblxuICAgIFJpcHBsZUJlaGF2aW91ci5zdGFydEZsYXNoKDE1MDApO1xuICAgIHRyYWlsRW1pdHRlci5zdG9wUmVzcGF3bigpO1xuICAgIHRyYWlsRW1pdHRlci5zZXREZWFkV2hlbkVtcHR5KHRydWUpO1xuICAgIHNwYXJrbGVFbWl0dGVyLnNldERlYWRXaGVuRW1wdHkodHJ1ZSk7XG59O1xuXG5GaXJld29yazQucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuc21va2VFbWl0dGVyLnVwZGF0ZSgpO1xuICAgIHRoaXMuYnVyc3RFbWl0dGVyLnVwZGF0ZSgpO1xuXG4gICAgdmFyIG5lZWRzQ29tcGFjdGluZyA9IGZhbHNlO1xuXG4gICAgZm9yKHZhciBpID0gMDsgaSA8ICB0aGlzLnRyYWlsRW1pdHRlcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdGhpcy50cmFpbEVtaXR0ZXJzW2ldLnVwZGF0ZSgpO1xuXG4gICAgICAgIGlmKHRoaXMudHJhaWxFbWl0dGVyc1tpXS5pc0RlYWQoKSkge1xuICAgICAgICAgICAgdGhpcy50cmFpbEVtaXR0ZXJzW2ldID0gbnVsbDtcbiAgICAgICAgICAgIG5lZWRzQ29tcGFjdGluZyA9IHRydWU7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBpZihuZWVkc0NvbXBhY3RpbmcpIHtcbiAgICAgICAgQ29tcGFjdEFycmF5LmNvbXBhY3QodGhpcy50cmFpbEVtaXR0ZXJzKTtcbiAgICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEZpcmV3b3JrNDsiLCJ2YXIgUXVpY2tSYW5nZSA9IHJlcXVpcmUoJy4uL3BhcnRpY2xlLXN5c3RlbS91dGlscy9RdWlja1JhbmdlJyk7XG5cbnZhciBGaXJld29ya1Bvc2l0aW9ucyA9IHt9O1xuXG5GaXJld29ya1Bvc2l0aW9ucy5sYXVuY2hQb3NpdGlvbiA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBwb3NpdGlvbiA9IHt9O1xuICAgIHBvc2l0aW9uLnggPSAod2luZG93LmlubmVyV2lkdGggLyAyKSArIFF1aWNrUmFuZ2UucmFuZ2UoLTUwLCA1MCk7XG4gICAgcG9zaXRpb24ueSA9IHdpbmRvdy5pbm5lckhlaWdodDtcbiAgICByZXR1cm4gcG9zaXRpb247XG59O1xuXG5GaXJld29ya1Bvc2l0aW9ucy5idXJzdFBvc2l0aW9uID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHBvc2l0aW9uID0ge307XG4gICAgcG9zaXRpb24ueCA9ICh3aW5kb3cuaW5uZXJXaWR0aCAvIDIpICsgUXVpY2tSYW5nZS5yYW5nZSgoLXdpbmRvdy5pbm5lcldpZHRoIC8gMyksICh3aW5kb3cuaW5uZXJXaWR0aCAvIDMpKTtcbiAgICBwb3NpdGlvbi55ID0gUXVpY2tSYW5nZS5yYW5nZSgxMDAsIDIwMCk7XG4gICAgcmV0dXJuIHBvc2l0aW9uO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBGaXJld29ya1Bvc2l0aW9uczsiLCJSYWluLmNvbnN0cnVjdG9yID0gUmFpbjtcblJhaW4ucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShQSVhJLkNvbnRhaW5lci5wcm90b3R5cGUpO1xuXG52YXIgRW1pdHRlciA9IHJlcXVpcmUoJy4vLi4vcGFydGljbGUtc3lzdGVtL2VtaXR0ZXIvRW1pdHRlcicpO1xudmFyIEVtaXR0ZXJTZXR0aW5ncyA9IHJlcXVpcmUoJy4vLi4vcGFydGljbGUtc3lzdGVtL2VtaXR0ZXIvRW1pdHRlclNldHRpbmdzJyk7XG52YXIgUGFydGljbGVTZXR0aW5ncyA9IHJlcXVpcmUoJy4vLi4vcGFydGljbGUtc3lzdGVtL3BhcnRpY2xlL1BhcnRpY2xlU2V0dGluZ3MnKTtcbnZhciBUZXh0dXJlR2VuZXJhdG9yID0gcmVxdWlyZSgnLi8uLi9wYXJ0aWNsZS1zeXN0ZW0vdXRpbHMvVGV4dHVyZUdlbmVyYXRvcicpO1xudmFyIFZlbG9jaXR5QmVoYXZpb3VyID0gcmVxdWlyZSgnLi8uLi9wYXJ0aWNsZS1zeXN0ZW0vYmVoYXZpb3Vycy9WZWxvY2l0eUJlaGF2aW91cicpO1xudmFyIExpZmVCZWhhdmlvdXIgPSByZXF1aXJlKCcuLy4uL3BhcnRpY2xlLXN5c3RlbS9iZWhhdmlvdXJzL0xpZmVCZWhhdmlvdXInKTtcbnZhciBTcGlyYWxCZWhhdmlvdXIgPSByZXF1aXJlKCcuLy4uL3BhcnRpY2xlLXN5c3RlbS9iZWhhdmlvdXJzL1NwaXJhbEJlaGF2aW91cicpO1xudmFyIEdyYXZpdHlCZWhhdmlvdXIgPSByZXF1aXJlKCcuLy4uL3BhcnRpY2xlLXN5c3RlbS9iZWhhdmlvdXJzL0dyYXZpdHlCZWhhdmlvdXInKTtcblxuZnVuY3Rpb24gUmFpbigpIHtcbiAgICBQSVhJLkNvbnRhaW5lci5jYWxsKHRoaXMpO1xuXG4gICAgdGhpcy50cmFpbEVtaXR0ZXJzID0gW107XG5cbiAgICB0aGlzLnNldHVwQnVyc3RFZmZlY3QoKTtcbn1cblxuUmFpbi5wcm90b3R5cGUuc2V0dXBCdXJzdEVmZmVjdCA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBwYXJ0aWNsZVNldHRpbmdzID0gbmV3IFBhcnRpY2xlU2V0dGluZ3MoKTtcbiAgICBwYXJ0aWNsZVNldHRpbmdzLnNldExpZmUoNDAsIDMwMCwgMTAsIDUwKTtcbiAgICBwYXJ0aWNsZVNldHRpbmdzLnNldFNwZWVkKDUsIDUpO1xuICAgIHBhcnRpY2xlU2V0dGluZ3Muc2V0RGlyZWN0aW9uKE1hdGguUEksIE1hdGguUEkgKiAyKTtcbiAgICBwYXJ0aWNsZVNldHRpbmdzLnNldFNjYWxlKC4yLCAxKTtcbiAgICBwYXJ0aWNsZVNldHRpbmdzLnNldEdyYXZpdHkoMSwgMik7XG4gICAgcGFydGljbGVTZXR0aW5ncy5hZGRCZWhhdmlvdXIoR3Jhdml0eUJlaGF2aW91cik7XG4gICAgcGFydGljbGVTZXR0aW5ncy5hZGRCZWhhdmlvdXIoU3BpcmFsQmVoYXZpb3VyKTtcbiAgICBwYXJ0aWNsZVNldHRpbmdzLmFkZEJlaGF2aW91cihMaWZlQmVoYXZpb3VyKTtcbiAgICBwYXJ0aWNsZVNldHRpbmdzLmFkZFRleHR1cmUoVGV4dHVyZUdlbmVyYXRvci5jaXJjbGUoMiwgMHhmZmZmZmYsIHRydWUpKTtcbiAgICBwYXJ0aWNsZVNldHRpbmdzLmFkZFRleHR1cmUoVGV4dHVyZUdlbmVyYXRvci5jaXJjbGUoMiwgMHg5MWZmYTEsIHRydWUpKTtcbiAgICBwYXJ0aWNsZVNldHRpbmdzLmFkZFRleHR1cmUoVGV4dHVyZUdlbmVyYXRvci5jaXJjbGUoMiwgMHg5MWZmYTEsIHRydWUpKTtcbiAgICBwYXJ0aWNsZVNldHRpbmdzLmFkZFRleHR1cmUoVGV4dHVyZUdlbmVyYXRvci5jaXJjbGUoMiwgMHg2NmNjZmYsIHRydWUpKTtcbiAgICBwYXJ0aWNsZVNldHRpbmdzLmFkZFRleHR1cmUoVGV4dHVyZUdlbmVyYXRvci5jaXJjbGUoMiwgMHhjY2ZmNjYsIHRydWUpKTtcbiAgICBwYXJ0aWNsZVNldHRpbmdzLmFkZFRleHR1cmUoVGV4dHVyZUdlbmVyYXRvci5jaXJjbGUoMiwgMHhmZjZmY2YsIHRydWUpKTtcblxuICAgIHZhciBlbWl0dGVyU2V0dGluZ3MgPSBuZXcgRW1pdHRlclNldHRpbmdzKCk7XG4gICAgZW1pdHRlclNldHRpbmdzLnNldFF1YW50aXR5KDEwMDApO1xuICAgIGVtaXR0ZXJTZXR0aW5ncy5zZXRCb3VuZHMoe3R5cGU6XCJSRUNUQU5HTEVcIiwgd2lkdGg6d2luZG93LmlubmVyV2lkdGgsIGhlaWdodDoxfSk7XG4gICAgZW1pdHRlclNldHRpbmdzLnNldFJlc3Bhd24oZmFsc2UpO1xuICAgIGVtaXR0ZXJTZXR0aW5ncy5zZXRTcGF3bkRlbGF5KDAsIDIwMDApO1xuXG4gICAgdGhpcy5idXJzdEVtaXR0ZXIgPSBuZXcgRW1pdHRlcih0aGlzLCBwYXJ0aWNsZVNldHRpbmdzLCBlbWl0dGVyU2V0dGluZ3MpO1xufTtcblxuXG5SYWluLnByb3RvdHlwZS5zdGFydCA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuYnVyc3RFbWl0dGVyLnggPSB3aW5kb3cuaW5uZXJXaWR0aCAvIDI7XG4gICAgdGhpcy5idXJzdEVtaXR0ZXIueSA9IDA7XG5cbiAgICB0aGlzLmJ1cnN0RW1pdHRlci5zdGFydCgpO1xufTtcblxuUmFpbi5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5idXJzdEVtaXR0ZXIudXBkYXRlKCk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFJhaW47IiwiUmlwcGxlRWZmZWN0LmNvbnN0cnVjdG9yID0gUmlwcGxlRWZmZWN0O1xuUmlwcGxlRWZmZWN0LnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoUElYSS5Db250YWluZXIucHJvdG90eXBlKTtcblxudmFyIEVtaXR0ZXIgPSByZXF1aXJlKCcuLy4uL3BhcnRpY2xlLXN5c3RlbS9lbWl0dGVyL0VtaXR0ZXInKTtcbnZhciBFbWl0dGVyU2V0dGluZ3MgPSByZXF1aXJlKCcuLy4uL3BhcnRpY2xlLXN5c3RlbS9lbWl0dGVyL0VtaXR0ZXJTZXR0aW5ncycpO1xudmFyIFBhcnRpY2xlU2V0dGluZ3MgPSByZXF1aXJlKCcuLy4uL3BhcnRpY2xlLXN5c3RlbS9wYXJ0aWNsZS9QYXJ0aWNsZVNldHRpbmdzJyk7XG52YXIgVGV4dHVyZUdlbmVyYXRvciA9IHJlcXVpcmUoJy4vLi4vcGFydGljbGUtc3lzdGVtL3V0aWxzL1RleHR1cmVHZW5lcmF0b3InKTtcbnZhciBWZWxvY2l0eUJlaGF2aW91ciA9IHJlcXVpcmUoJy4vLi4vcGFydGljbGUtc3lzdGVtL2JlaGF2aW91cnMvVmVsb2NpdHlCZWhhdmlvdXInKTtcbnZhciBMaWZlQmVoYXZpb3VyID0gcmVxdWlyZSgnLi8uLi9wYXJ0aWNsZS1zeXN0ZW0vYmVoYXZpb3Vycy9MaWZlQmVoYXZpb3VyJyk7XG52YXIgUm90YXRpb25CZWhhdmlvdXIgPSByZXF1aXJlKCcuLy4uL3BhcnRpY2xlLXN5c3RlbS9iZWhhdmlvdXJzL1JvdGF0aW9uQmVoYXZpb3VyJyk7XG52YXIgV2FuZGVyQmVoYXZpb3VyID0gcmVxdWlyZSgnLi8uLi9wYXJ0aWNsZS1zeXN0ZW0vYmVoYXZpb3Vycy9XYW5kZXJCZWhhdmlvdXInKTtcbnZhciBSaXBwbGVCZWhhdmlvdXIgPSByZXF1aXJlKCcuLy4uL3BhcnRpY2xlLXN5c3RlbS9iZWhhdmlvdXJzL1JpcHBsZUJlaGF2aW91cicpO1xuXG5mdW5jdGlvbiBSaXBwbGVFZmZlY3QocG9zaXRpb24pIHtcbiAgICBQSVhJLkNvbnRhaW5lci5jYWxsKHRoaXMpO1xuXG4gICAgdmFyIHBhcnRpY2xlU2V0dGluZ3MgPSBuZXcgUGFydGljbGVTZXR0aW5ncygpO1xuICAgIHBhcnRpY2xlU2V0dGluZ3Muc2V0TGlmZSgxLCAxKTtcbiAgICBwYXJ0aWNsZVNldHRpbmdzLmFkZEJlaGF2aW91cihSaXBwbGVCZWhhdmlvdXIpO1xuICAgIHBhcnRpY2xlU2V0dGluZ3MuYWRkVGV4dHVyZShQSVhJLmxvYWRlci5yZXNvdXJjZXNbJ3JpcHBsZSddLnRleHR1cmUpO1xuXG4gICAgdmFyIGVtaXR0ZXJTZXR0aW5ncyA9IG5ldyBFbWl0dGVyU2V0dGluZ3MoKTtcbiAgICBlbWl0dGVyU2V0dGluZ3Muc2V0Qm91bmRzKHt0eXBlOlwiUkVDVEFOR0xFXCIsIHdpZHRoOjEwLCBoZWlnaHQ6MjB9KTtcbiAgICBlbWl0dGVyU2V0dGluZ3Muc2V0UXVhbnRpdHkoNik7XG5cbiAgICB0aGlzLmVtaXR0ZXIgPSBuZXcgRW1pdHRlcih0aGlzLCBwYXJ0aWNsZVNldHRpbmdzLCBlbWl0dGVyU2V0dGluZ3MpO1xuICAgIHRoaXMuZW1pdHRlci54ID0gcG9zaXRpb24ueDtcbiAgICB0aGlzLmVtaXR0ZXIueSA9IHBvc2l0aW9uLnk7XG4gICAgdGhpcy5lbWl0dGVyLnN0YXJ0KCk7XG59O1xuXG5SaXBwbGVFZmZlY3QucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uKCkge1xuICAgIGlmKHRoaXMuZW1pdHRlciAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHRoaXMuZW1pdHRlci51cGRhdGUoKTtcbiAgICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFJpcHBsZUVmZmVjdDsiLCJ2YXIgQmVoYXZpb3VyID0ge307XG5cbkJlaGF2aW91ci5yZXNldCA9IGZ1bmN0aW9uKHBhcnRpY2xlKSB7XG59O1xuXG5CZWhhdmlvdXIudXBkYXRlID0gZnVuY3Rpb24ocGFydGljbGUpIHtcbiAgICBwYXJ0aWNsZS5zcGVlZCAqPSBwYXJ0aWNsZS5kZWNheTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gQmVoYXZpb3VyOyIsInZhciBCZWhhdmlvdXIgPSB7fTtcblxuQmVoYXZpb3VyLnJlc2V0ID0gZnVuY3Rpb24ocGFydGljbGUpIHtcbn07XG5cbkJlaGF2aW91ci51cGRhdGUgPSBmdW5jdGlvbihwYXJ0aWNsZSkge1xuICAgIHBhcnRpY2xlLnkgKz0gcGFydGljbGUuZ3Jhdml0eTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gQmVoYXZpb3VyOyIsInZhciBCZWhhdmlvdXIgPSB7fTtcblxuQmVoYXZpb3VyLnJlc2V0ID0gZnVuY3Rpb24ocGFydGljbGUpIHtcbn07XG5cbkJlaGF2aW91ci51cGRhdGUgPSBmdW5jdGlvbihwYXJ0aWNsZSkge1xuICAgIGlmKHBhcnRpY2xlLmxpZmUubGlmZUR1cmF0aW9uID09IDApIHtcbiAgICAgICAgaWYocGFydGljbGUubGlmZS5mYWRlRHVyYXRpb24gPiAwKSB7XG4gICAgICAgICAgICBwYXJ0aWNsZS5hbHBoYSAtPSBwYXJ0aWNsZS5mYWRlUGVyRnJhbWU7XG4gICAgICAgICAgICBwYXJ0aWNsZS5saWZlLmZhZGVEdXJhdGlvbi0tO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcGFydGljbGUuZGVhZCA9IHRydWU7XG4gICAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgICBwYXJ0aWNsZS5saWZlLmxpZmVEdXJhdGlvbi0tO1xuICAgIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gQmVoYXZpb3VyOyIsInZhciBRdWlja1JhbmdlID0gcmVxdWlyZSgnLi4vdXRpbHMvUXVpY2tSYW5nZScpO1xudmFyIGNvbG91cnMgPSBbMHg0ZTZjNTUsIDB4NzUzOTIsIDB4MjY4Njk0LCAweGZmODVmZl07XG52YXIgZmxhc2hDb2xvdXJzID0gWzB4YTJlMGIyLCAweGZmZmZmZiwgMHhiNTk0ZWQsIDB4MzhjY2U0XTtcblxudmFyIHVwZGF0ZUNvbG91cnMsIHN0YXJ0Rmxhc2g7XG5cbnZhciBCZWhhdmlvdXIgPSB7fTtcblxuQmVoYXZpb3VyLnJlc2V0ID0gZnVuY3Rpb24ocGFydGljbGUpIHtcbiAgICBwYXJ0aWNsZS5zdGFydFggPSBwYXJ0aWNsZS54O1xuICAgIHBhcnRpY2xlLnJpcHBsZVNwZWVkID0gUXVpY2tSYW5nZS5yYW5nZSgtLjAxLCAuMDEpO1xuICAgIHBhcnRpY2xlLnJpcHBsZVJvdGF0aW9uID0gUXVpY2tSYW5nZS5yYW5nZSgtTWF0aC5QSSAqIDIsIE1hdGguUEkgKiAyKTtcbiAgICBwYXJ0aWNsZS5yaXBwbGVEaXN0YW5jZSA9IFF1aWNrUmFuZ2UucmFuZ2UoNTAsIDEwMCk7XG4gICAgcGFydGljbGUudGludCA9IGNvbG91cnNbUXVpY2tSYW5nZS5yYW5nZSgwLCBjb2xvdXJzLmxlbmd0aCAtIDEsIHRydWUpXTtcbiAgICBpZihRdWlja1JhbmdlLnJhbmdlKDAsIDEsIHRydWUpID09PSAxKSB7cGFydGljbGUuc2NhbGUueCA9IC1wYXJ0aWNsZS5zY2FsZS54fVxufTtcblxuQmVoYXZpb3VyLnVwZGF0ZSA9IGZ1bmN0aW9uKHBhcnRpY2xlKSB7XG4gICAgcGFydGljbGUucmlwcGxlUm90YXRpb24gKz0gcGFydGljbGUucmlwcGxlU3BlZWQ7XG4gICAgcGFydGljbGUueCA9IHBhcnRpY2xlLnN0YXJ0WCArIChNYXRoLnNpbihwYXJ0aWNsZS5yaXBwbGVSb3RhdGlvbikgKiBwYXJ0aWNsZS5yaXBwbGVEaXN0YW5jZSk7XG4gICAgcGFydGljbGUueSA9IHBhcnRpY2xlLnN0YXJ0WSArIChNYXRoLmNvcyhwYXJ0aWNsZS5yaXBwbGVSb3RhdGlvbikgKiAocGFydGljbGUucmlwcGxlRGlzdGFuY2UgLyA1KSk7XG5cbiAgICBpZih1cGRhdGVDb2xvdXJzKSB7XG4gICAgICAgIGlmKHN0YXJ0Rmxhc2gpIHtcbiAgICAgICAgICAgIHBhcnRpY2xlLnRpbnQgPSBjb2xvdXJzW1F1aWNrUmFuZ2UucmFuZ2UoMCwgZmxhc2hDb2xvdXJzLmxlbmd0aCAtIDEsIHRydWUpXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHBhcnRpY2xlLnRpbnQgPSBjb2xvdXJzW1F1aWNrUmFuZ2UucmFuZ2UoMCwgY29sb3Vycy5sZW5ndGggLSAxLCB0cnVlKV07XG4gICAgICAgICAgICB1cGRhdGVDb2xvdXJzID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9XG59O1xuXG5CZWhhdmlvdXIuc3RhcnRGbGFzaCA9IGZ1bmN0aW9uKGR1cmF0aW9uKSB7XG4gICAgdXBkYXRlQ29sb3VycyA9IHRydWU7XG4gICAgc3RhcnRGbGFzaCA9IHRydWU7XG4gICAgc2V0VGltZW91dChCZWhhdmlvdXIuc3RvcEZsYXNoLCBkdXJhdGlvbik7XG59O1xuXG5CZWhhdmlvdXIuc3RvcEZsYXNoID0gZnVuY3Rpb24oKSB7XG4gICAgdXBkYXRlQ29sb3VycyA9IHRydWU7XG4gICAgc3RhcnRGbGFzaCA9IGZhbHNlXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEJlaGF2aW91cjsiLCJ2YXIgUXVpY2tSYW5nZSA9IHJlcXVpcmUoJy4uL3V0aWxzL1F1aWNrUmFuZ2UnKTtcbnZhciBCZWhhdmlvdXIgPSB7fTtcblxuQmVoYXZpb3VyLnJlc2V0ID0gZnVuY3Rpb24ocGFydGljbGUpIHtcbiAgICBwYXJ0aWNsZS5yb3RhdGlvblNwZWVkID0gUXVpY2tSYW5nZS5yYW5nZSguNSwgMik7XG59O1xuXG5CZWhhdmlvdXIudXBkYXRlID0gZnVuY3Rpb24ocGFydGljbGUpIHtcbiAgICBwYXJ0aWNsZS5yb3RhdGlvbiArPSBwYXJ0aWNsZS5yb3RhdGlvblNwZWVkO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBCZWhhdmlvdXI7IiwidmFyIFF1aWNrUmFuZ2UgPSByZXF1aXJlKCcuLi91dGlscy9RdWlja1JhbmdlJyk7XG52YXIgQmVoYXZpb3VyID0ge307XG5cbkJlaGF2aW91ci5yZXNldCA9IGZ1bmN0aW9uKHBhcnRpY2xlKSB7XG4gICAgcGFydGljbGUuc3ByaXJhbFJvdGF0aW9uID0gUXVpY2tSYW5nZS5yYW5nZSgwLCBNYXRoLlBJICogMik7XG4gICAgcGFydGljbGUuc3BpcmFsUm90YXRpb25TcGVlZCA9IC4xOy8vUXVpY2tSYW5nZS5yYW5nZSguMDIsIC4wNSk7XG4gICAgcGFydGljbGUuc3BpcmFsRGlzdGFuY2UgPSAyOy8vUXVpY2tSYW5nZS5yYW5nZSgtMiwgMik7XG59O1xuXG5CZWhhdmlvdXIudXBkYXRlID0gZnVuY3Rpb24ocGFydGljbGUpIHtcbiAgICBwYXJ0aWNsZS5zcHJpcmFsUm90YXRpb24gKz0gcGFydGljbGUuc3BpcmFsUm90YXRpb25TcGVlZDtcbiAgICBwYXJ0aWNsZS54ICs9IChNYXRoLnNpbihwYXJ0aWNsZS5zcHJpcmFsUm90YXRpb24pICogcGFydGljbGUuc3BpcmFsRGlzdGFuY2UpO1xuICAgIHBhcnRpY2xlLnkgKz0gKC1NYXRoLmNvcyhwYXJ0aWNsZS5zcHJpcmFsUm90YXRpb24pICogcGFydGljbGUuc3BpcmFsRGlzdGFuY2UpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBCZWhhdmlvdXI7IiwidmFyIEJlaGF2aW91ciA9IHt9O1xuXG5CZWhhdmlvdXIucmVzZXQgPSBmdW5jdGlvbihwYXJ0aWNsZSkge1xufTtcblxuQmVoYXZpb3VyLnVwZGF0ZSA9IGZ1bmN0aW9uKHBhcnRpY2xlKSB7XG4gICAgcGFydGljbGUueCArPSBwYXJ0aWNsZS5zcGVlZCAqIE1hdGguc2luKHBhcnRpY2xlLmRpcmVjdGlvbik7XG4gICAgcGFydGljbGUueSArPSBwYXJ0aWNsZS5zcGVlZCAqIC1NYXRoLmNvcyhwYXJ0aWNsZS5kaXJlY3Rpb24pO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBCZWhhdmlvdXI7IiwidmFyIFF1aWNrUmFuZ2UgPSByZXF1aXJlKCcuLi91dGlscy9RdWlja1JhbmdlJyk7XG52YXIgQmVoYXZpb3VyID0ge307XG5cbkJlaGF2aW91ci5yZXNldCA9IGZ1bmN0aW9uKHBhcnRpY2xlKSB7XG59O1xuXG5CZWhhdmlvdXIudXBkYXRlID0gZnVuY3Rpb24ocGFydGljbGUpIHtcbiAgICBwYXJ0aWNsZS5kaXJlY3Rpb24gKz0gUXVpY2tSYW5nZS5yYW5nZSgtMSwgMSk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEJlaGF2aW91cjsiLCJ2YXIgUGFydGljbGVQb29sID0gcmVxdWlyZSgnLi4vcGFydGljbGUvUGFydGljbGVQb29sJyk7XG52YXIgUXVpY2tSYW5nZSA9IHJlcXVpcmUoJy4uL3V0aWxzL1F1aWNrUmFuZ2UnKTtcbnZhciBDb21wYWN0QXJyYXkgPSByZXF1aXJlKCcuLi91dGlscy9Db21wYWN0QXJyYXknKTtcblxuZnVuY3Rpb24gRW1pdHRlcihzdGFnZSwgcGFydGljbGVTZXR0aW5ncywgZW1pdHRlclNldHRpbmdzKSB7XG4gICAgdGhpcy5zdGFnZSA9IHN0YWdlO1xuICAgIHRoaXMuZGVhZCA9IGZhbHNlO1xuICAgIHRoaXMuYWRkaW5nID0gMDtcbiAgICB0aGlzLnBhcnRpY2xlU2V0dGluZ3MgPSBwYXJ0aWNsZVNldHRpbmdzO1xuICAgIHRoaXMuZW1pdHRlclNldHRpbmdzID0gZW1pdHRlclNldHRpbmdzO1xuICAgIHRoaXMucmFuZ2UgPSBuZXcgUmFuZ2UoKTtcblxuICAgIFBhcnRpY2xlUG9vbC5hZGRQYXJ0aWNsZXModGhpcy5lbWl0dGVyU2V0dGluZ3MucXVhbnRpdHkpO1xuXG4gICAgdGhpcy5wYXJ0aWNsZXMgPSBbXTtcbn1cblxuRW1pdHRlci5wcm90b3R5cGUuc3RhcnQgPSBmdW5jdGlvbigpIHtcbiAgICBmb3IodmFyIGkgPSAwOyBpIDwgdGhpcy5lbWl0dGVyU2V0dGluZ3MuZ2V0UXVhbnRpdHkoKTsgaSsrKSB7XG4gICAgICAgIHZhciBkZWxheSA9IHRoaXMuZW1pdHRlclNldHRpbmdzLmdldFNwYXduRGVsYXkoKTtcbiAgICAgICAgdGhpcy5hZGRpbmcrKztcbiAgICAgICAgaWYoZGVsYXkgPiAwKSB7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KHRoaXMuYWRkUGFydGljbGUuYmluZCh0aGlzKSwgZGVsYXkpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmFkZFBhcnRpY2xlKCk7XG4gICAgICAgIH1cbiAgICB9XG59O1xuXG5FbWl0dGVyLnByb3RvdHlwZS5hZGRQYXJ0aWNsZSA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBwYXJ0aWNsZSA9IFBhcnRpY2xlUG9vbC5nZXRQYXJ0aWNsZSgpO1xuICAgIHRoaXMudXBkYXRlUGFydGljbGUocGFydGljbGUpO1xuICAgIHRoaXMucGFydGljbGVzLnB1c2gocGFydGljbGUpO1xuICAgIHRoaXMuc3RhZ2UuYWRkQ2hpbGQocGFydGljbGUpO1xuICAgIHRoaXMuYWRkaW5nLS07XG59O1xuXG5FbWl0dGVyLnByb3RvdHlwZS51cGRhdGVQYXJ0aWNsZSA9IGZ1bmN0aW9uKHBhcnRpY2xlKSB7XG4gICAgcGFydGljbGUucmVzZXQodGhpcy5wYXJ0aWNsZVNldHRpbmdzLCB0aGlzLmdldFNwYXduUG9zaXRpb24oKSk7XG59O1xuXG5FbWl0dGVyLnByb3RvdHlwZS5nZXRTcGF3blBvc2l0aW9uID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBib3VuZHMgPSB0aGlzLmVtaXR0ZXJTZXR0aW5ncy5nZXRCb3VuZHMoKTtcbiAgICB2YXIgeFBvcyA9IHRoaXMueDtcbiAgICB2YXIgeVBvcyA9IHRoaXMueTtcblxuICAgIGlmKGJvdW5kcy50eXBlID09PSBcIlBPSU5UXCIpIHtcbiAgICAgICAgLy8gRG8gbm90aGluZ1xuICAgIH0gZWxzZSBpZihib3VuZHMudHlwZSA9PT0gXCJDSVJDTEVcIikge1xuICAgICAgICB2YXIgYW5nbGUgPSBRdWlja1JhbmdlLnJhbmdlKDAsIE1hdGguUEkgKiAyKTtcbiAgICAgICAgeFBvcyArPSBNYXRoLnNpbihhbmdsZSkgKiBRdWlja1JhbmdlLnJhbmdlKDAsIGJvdW5kcy5yYWRpdXMpO1xuICAgICAgICB5UG9zICs9IE1hdGguY29zKGFuZ2xlKSAqIFF1aWNrUmFuZ2UucmFuZ2UoMCwgYm91bmRzLnJhZGl1cyk7XG4gICAgfSBlbHNlIGlmKGJvdW5kcy50eXBlID09PSBcIlJFQ1RBTkdMRVwiKSB7XG4gICAgICAgIHhQb3MgKz0gUXVpY2tSYW5nZS5yYW5nZSgtYm91bmRzLndpZHRoIC8gMiwgYm91bmRzLndpZHRoIC8gMik7XG4gICAgICAgIHlQb3MgKz0gUXVpY2tSYW5nZS5yYW5nZSgtYm91bmRzLmhlaWdodCAvIDIsIGJvdW5kcy5oZWlnaHQgLyAyKTtcbiAgICB9XG5cbiAgICByZXR1cm4ge3g6eFBvcywgeTp5UG9zfTtcbn07XG5cbkVtaXR0ZXIucHJvdG90eXBlLmdldEFjdGl2ZVBhcnRpY2xlcyA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLnBhcnRpY2xlcztcbn07XG5cbkVtaXR0ZXIucHJvdG90eXBlLnNldERlYWRXaGVuRW1wdHkgPSBmdW5jdGlvbih2YWx1ZSkge1xuICAgIHRoaXMuZGVhZFdoZW5FbXB0eSA9IHZhbHVlO1xufTtcblxuRW1pdHRlci5wcm90b3R5cGUuaXNEZWFkID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuZGVhZDtcbn07XG5cbkVtaXR0ZXIucHJvdG90eXBlLnN0b3BSZXNwYXduID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5lbWl0dGVyU2V0dGluZ3Muc2V0UmVzcGF3bihmYWxzZSk7XG59O1xuXG5FbWl0dGVyLnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgcGFydGljbGU7XG4gICAgdmFyIG5lZWRzQ29tcGFjdGluZztcblxuICAgIGZvcih2YXIgaSA9IDA7IGkgPCB0aGlzLnBhcnRpY2xlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICBwYXJ0aWNsZSA9IHRoaXMucGFydGljbGVzW2ldO1xuXG4gICAgICAgIGlmKHBhcnRpY2xlLmRlYWQpIHtcbiAgICAgICAgICAgIGlmKHRoaXMuZW1pdHRlclNldHRpbmdzLmdldFJlc3Bhd24oKSkge1xuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlUGFydGljbGUocGFydGljbGUpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLnN0YWdlLnJlbW92ZUNoaWxkKHBhcnRpY2xlKTtcbiAgICAgICAgICAgICAgICBQYXJ0aWNsZVBvb2wucmV0dXJuUGFydGljbGUocGFydGljbGUpO1xuICAgICAgICAgICAgICAgIHRoaXMucGFydGljbGVzW2ldID0gbnVsbDtcbiAgICAgICAgICAgICAgICBuZWVkc0NvbXBhY3RpbmcgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcGFydGljbGUudXBkYXRlKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBpZihuZWVkc0NvbXBhY3RpbmcpIHtcbiAgICAgICAgQ29tcGFjdEFycmF5LmNvbXBhY3QodGhpcy5wYXJ0aWNsZXMpO1xuICAgIH1cblxuICAgIGlmKHRoaXMuZGVhZFdoZW5FbXB0eSAmJiB0aGlzLnBhcnRpY2xlcy5sZW5ndGggPT09IDAgJiYgdGhpcy5hZGRpbmcgPT09IDApIHtcbiAgICAgICAgdGhpcy5kZWFkID0gdHJ1ZTtcbiAgICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEVtaXR0ZXI7IiwidmFyIFJhbmdlID0gcmVxdWlyZSgnLi4vdXRpbHMvUmFuZ2UnKTtcblxuZnVuY3Rpb24gRW1pdHRlclNldHRpbmdzKCkge31cblxuRW1pdHRlclNldHRpbmdzLnByb3RvdHlwZS5zZXRRdWFudGl0eSA9IGZ1bmN0aW9uKHF1YW50aXR5KSB7XG4gICAgdGhpcy5fcXVhbnRpdHkgPSBxdWFudGl0eTtcbn07XG5cbkVtaXR0ZXJTZXR0aW5ncy5wcm90b3R5cGUuc2V0Qm91bmRzID0gZnVuY3Rpb24oYm91bmRzKSB7XG4gICAgdGhpcy5fYm91bmRzID0gYm91bmRzO1xufTtcblxuRW1pdHRlclNldHRpbmdzLnByb3RvdHlwZS5zZXRSZXNwYXduID0gZnVuY3Rpb24oaXNSZXNwYXduKSB7XG4gICAgdGhpcy5faXNSZXNwYXduID0gaXNSZXNwYXduO1xufTtcblxuRW1pdHRlclNldHRpbmdzLnByb3RvdHlwZS5zZXRTcGF3bkRlbGF5ID0gZnVuY3Rpb24obWluLCBtYXgpIHtcbiAgICB0aGlzLl9zcGF3bkRlbGF5UmFuZ2UgPSBuZXcgUmFuZ2UobWluLCBtYXgpO1xufTtcblxuLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gKiBHZXR0ZXJzXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbkVtaXR0ZXJTZXR0aW5ncy5wcm90b3R5cGUuZ2V0UXVhbnRpdHkgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5fcXVhbnRpdHk7XG59O1xuXG5FbWl0dGVyU2V0dGluZ3MucHJvdG90eXBlLmdldEJvdW5kcyA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiAodGhpcy5fYm91bmRzICE9PSB1bmRlZmluZWQpID8gdGhpcy5fYm91bmRzIDoge3R5cGU6XCJQT0lOVFwifTtcbn07XG5cbkVtaXR0ZXJTZXR0aW5ncy5wcm90b3R5cGUuZ2V0UmVzcGF3biA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiAodGhpcy5faXNSZXNwYXduID09PSB1bmRlZmluZWQpID8gZmFsc2UgOiB0aGlzLl9pc1Jlc3Bhd247XG59O1xuXG5FbWl0dGVyU2V0dGluZ3MucHJvdG90eXBlLmdldFNwYXduRGVsYXkgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gKHRoaXMuX3NwYXduRGVsYXlSYW5nZSkgPyB0aGlzLl9zcGF3bkRlbGF5UmFuZ2UucmFuZ2UoKSA6IDA7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEVtaXR0ZXJTZXR0aW5nczsiLCJQYXJ0aWNsZS5jb25zdHJ1Y3RvciA9IFBhcnRpY2xlO1xuUGFydGljbGUucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShQSVhJLlNwcml0ZS5wcm90b3R5cGUpO1xuXG5mdW5jdGlvbiBQYXJ0aWNsZSgpIHtcbiAgICBQSVhJLlNwcml0ZS5jYWxsKHRoaXMpO1xuICAgIHRoaXMuYW5jaG9yLnggPSAwLjU7XG4gICAgdGhpcy5hbmNob3IueSA9IDAuNTtcbn1cblxuUGFydGljbGUucHJvdG90eXBlLnJlc2V0ID0gZnVuY3Rpb24oc2V0dGluZ3MsIHBvc2l0aW9uKSB7XG4gICAgdGhpcy5kZWFkID0gZmFsc2U7XG4gICAgdGhpcy5zcGVlZCA9IHNldHRpbmdzLmdldFNwZWVkKCk7XG4gICAgdGhpcy5kaXJlY3Rpb24gPSBzZXR0aW5ncy5nZXREaXJlY3Rpb24oKTtcbiAgICB0aGlzLmFscGhhID0gIHNldHRpbmdzLmdldEFscGhhKCk7XG4gICAgdGhpcy5yb3RhdGlvbiA9ICBzZXR0aW5ncy5nZXRSb3RhdGlvbigpO1xuICAgIHRoaXMudGV4dHVyZSA9IHNldHRpbmdzLmdldFRleHR1cmUoKTtcbiAgICB0aGlzLmdyYXZpdHkgPSBzZXR0aW5ncy5nZXRHcmF2aXR5KCk7XG4gICAgdGhpcy5kZWNheSA9IHNldHRpbmdzLmdldERlY2F5KCk7XG4gICAgdGhpcy5saWZlID0gc2V0dGluZ3MuZ2V0TGlmZSgpO1xuICAgIHRoaXMuc2NhbGUueCA9IHRoaXMuc2NhbGUueSA9IHNldHRpbmdzLmdldFNjYWxlKCk7XG4gICAgdGhpcy5iZWhhdmlvdXJzID0gc2V0dGluZ3MuZ2V0QmVoYXZpb3VycygpO1xuXG4gICAgZm9yKHZhciBpID0gMDsgaSA8IHRoaXMuYmVoYXZpb3Vycy5sZW5ndGg7IGkrKykge1xuICAgICAgICB0aGlzLmJlaGF2aW91cnNbaV0ucmVzZXQodGhpcyk7XG4gICAgfVxuXG4gICAgdGhpcy54ID0gdGhpcy5zdGFydFggPSBwb3NpdGlvbi54O1xuICAgIHRoaXMueSA9IHRoaXMuc3RhcnRZID0gcG9zaXRpb24ueTtcblxuICAgIHRoaXMuZmFkZVBlckZyYW1lID0gdGhpcy5hbHBoYSAvIHRoaXMubGlmZS5mYWRlRHVyYXRpb247XG59O1xuXG5QYXJ0aWNsZS5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24oKSB7XG4gICAgZm9yKHZhciBpID0gMDsgaSA8IHRoaXMuYmVoYXZpb3Vycy5sZW5ndGg7IGkrKykge1xuICAgICAgICB0aGlzLmJlaGF2aW91cnNbaV0udXBkYXRlKHRoaXMpO1xuICAgIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gUGFydGljbGU7IiwidmFyIFBhcnRpY2xlID0gcmVxdWlyZSgnLi9QYXJ0aWNsZScpO1xuXG52YXIgUGFydGljbGVQb29sID0ge307XG52YXIgcG9vbCA9IFtdO1xuXG5QYXJ0aWNsZVBvb2wuYWRkUGFydGljbGVzID0gZnVuY3Rpb24ocXR5KSB7XG4gICAgZm9yKHZhciBpID0gMDsgaSA8IHF0eTsgaSsrKSB7XG4gICAgICAgIHBvb2wucHVzaChuZXcgUGFydGljbGUoKSk7XG4gICAgfVxufTtcblxuUGFydGljbGVQb29sLmdldFBhcnRpY2xlID0gZnVuY3Rpb24oKSB7XG4gICAgaWYocG9vbC5sZW5ndGggPiAwKSB7XG4gICAgICAgIHJldHVybiBwb29sLnBvcCgpO1xuICAgIH1cblxuICAgIHJldHVybiBuZXcgUGFydGljbGUoKTtcbn07XG5cblBhcnRpY2xlUG9vbC5yZXR1cm5QYXJ0aWNsZSA9IGZ1bmN0aW9uKHBhcnRpY2xlKSB7XG4gICAgcG9vbC5wdXNoKHBhcnRpY2xlKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gUGFydGljbGVQb29sOyIsInZhciBSYW5nZSA9IHJlcXVpcmUoJy4uL3V0aWxzL1JhbmdlJyk7XG5cbmZ1bmN0aW9uIFBhcnRpY2xlU2V0dGluZ3MoKSB7XG4gICAgdGhpcy5fdGV4dHVyZXMgPSBbXTtcbiAgICB0aGlzLl9iZWhhdmlvdXMgPSBbXTtcbn1cblxuUGFydGljbGVTZXR0aW5ncy5wcm90b3R5cGUuc2V0U3BlZWQgPSBmdW5jdGlvbihtaW4sIG1heCkge1xuICAgIHRoaXMuX3NwZWVkUmFuZ2UgPSBuZXcgUmFuZ2UobWluLCBtYXgpO1xufTtcblxuUGFydGljbGVTZXR0aW5ncy5wcm90b3R5cGUuc2V0RGlyZWN0aW9uID0gZnVuY3Rpb24obWluLCBtYXgpIHtcbiAgICB0aGlzLl9kaXJlY3Rpb25SYW5nZSA9IG5ldyBSYW5nZShtaW4sIG1heCk7XG59O1xuXG5QYXJ0aWNsZVNldHRpbmdzLnByb3RvdHlwZS5zZXRBbHBoYSA9IGZ1bmN0aW9uKG1pbiwgbWF4KSB7XG4gICAgdGhpcy5fYWxwaGFSYW5nZSA9IG5ldyBSYW5nZShtaW4sIG1heCk7XG59O1xuXG5QYXJ0aWNsZVNldHRpbmdzLnByb3RvdHlwZS5zZXRSb3RhdGlvbiA9IGZ1bmN0aW9uKG1pbiwgbWF4KSB7XG4gICAgdGhpcy5fcm90YXRpb25SYW5nZSA9IG5ldyBSYW5nZShtaW4sIG1heCk7XG59O1xuXG5QYXJ0aWNsZVNldHRpbmdzLnByb3RvdHlwZS5zZXRMaWZlID0gZnVuY3Rpb24obGlmZU1pbiwgbGlmZU1heCwgZmFkZU1pbiwgZmFkZU1heCkge1xuICAgIHRoaXMuX2xpZmVEdXJhdGlvblJhbmdlID0gbmV3IFJhbmdlKGxpZmVNaW4sIGxpZmVNYXgsIHRydWUpO1xuICAgIHRoaXMuX2ZhZGVEdXJhdGlvblJhbmdlID0gbmV3IFJhbmdlKGZhZGVNaW4sIGZhZGVNYXgsIHRydWUpO1xufTtcblxuUGFydGljbGVTZXR0aW5ncy5wcm90b3R5cGUuc2V0U2NhbGUgPSBmdW5jdGlvbihtaW4sIG1heCkge1xuICAgIHRoaXMuX3NjYWxlUmFuZ2UgPSBuZXcgUmFuZ2UobWluLCBtYXgpO1xufTtcblxuUGFydGljbGVTZXR0aW5ncy5wcm90b3R5cGUuc2V0R3Jhdml0eSA9IGZ1bmN0aW9uKG1pbiwgbWF4KSB7XG4gICAgdGhpcy5fZ3Jhdml0eVJhbmdlID0gbmV3IFJhbmdlKG1pbiwgbWF4KTtcbn07XG5cblBhcnRpY2xlU2V0dGluZ3MucHJvdG90eXBlLnNldERlY2F5ID0gZnVuY3Rpb24obWluLCBtYXgpIHtcbiAgICB0aGlzLl9kZWNheVJhbmdlID0gbmV3IFJhbmdlKG1pbiwgbWF4KTtcbn07XG5cblBhcnRpY2xlU2V0dGluZ3MucHJvdG90eXBlLmFkZFRleHR1cmUgPSBmdW5jdGlvbih0ZXh0dXJlKSB7XG4gICAgdGhpcy5fdGV4dHVyZXMucHVzaCh0ZXh0dXJlKTtcbn07XG5cblBhcnRpY2xlU2V0dGluZ3MucHJvdG90eXBlLmFkZEJlaGF2aW91ciA9IGZ1bmN0aW9uKGJlaGF2aW91cikge1xuICAgIHRoaXMuX2JlaGF2aW91cy5wdXNoKGJlaGF2aW91cik7XG59O1xuXG4vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAqIEdldHRlcnNcbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuUGFydGljbGVTZXR0aW5ncy5wcm90b3R5cGUuZ2V0VGV4dHVyZSA9IGZ1bmN0aW9uKCkge1xuICAgIGlmKHRoaXMuX3RleHR1cmVzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJObyB0ZXh0dXJlIGhhcyBiZWVuIHNldCBvbiBQYXJ0aWNsZVNldHRpbmdzXCIpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLl90ZXh0dXJlc1tNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiB0aGlzLl90ZXh0dXJlcy5sZW5ndGgpXTtcbn07XG5cblBhcnRpY2xlU2V0dGluZ3MucHJvdG90eXBlLmdldExpZmUgPSBmdW5jdGlvbigpIHtcbiAgICBpZih0aGlzLl9saWZlRHVyYXRpb25SYW5nZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIk5vIGxpZmUgaGFzIGJlZW4gc2V0IG9uIFBhcnRpY2xlU2V0dGluZ3NcIik7XG4gICAgfVxuXG4gICAgcmV0dXJuIHtsaWZlRHVyYXRpb246IHRoaXMuX2xpZmVEdXJhdGlvblJhbmdlLnJhbmdlKCksIGZhZGVEdXJhdGlvbjogdGhpcy5fZmFkZUR1cmF0aW9uUmFuZ2UucmFuZ2UoKX07XG59O1xuXG5QYXJ0aWNsZVNldHRpbmdzLnByb3RvdHlwZS5nZXRTY2FsZSA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiAodGhpcy5fc2NhbGVSYW5nZSkgPyB0aGlzLl9zY2FsZVJhbmdlLnJhbmdlKCkgOiAxO1xufTtcblxuUGFydGljbGVTZXR0aW5ncy5wcm90b3R5cGUuZ2V0QmVoYXZpb3VycyA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiAodGhpcy5fYmVoYXZpb3VzKSA/IHRoaXMuX2JlaGF2aW91cyA6IFtdO1xufTtcblxuUGFydGljbGVTZXR0aW5ncy5wcm90b3R5cGUuZ2V0R3Jhdml0eSA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiAodGhpcy5fZ3Jhdml0eVJhbmdlKSA/IHRoaXMuX2dyYXZpdHlSYW5nZS5yYW5nZSgpIDogMDtcbn07XG5cblBhcnRpY2xlU2V0dGluZ3MucHJvdG90eXBlLmdldERlY2F5ID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuICh0aGlzLl9kZWNheVJhbmdlKSA/IHRoaXMuX2RlY2F5UmFuZ2UucmFuZ2UoKSA6IDA7XG59O1xuXG5QYXJ0aWNsZVNldHRpbmdzLnByb3RvdHlwZS5nZXRTcGVlZCA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiAodGhpcy5fc3BlZWRSYW5nZSkgPyB0aGlzLl9zcGVlZFJhbmdlLnJhbmdlKCkgOiAwO1xufTtcblxuUGFydGljbGVTZXR0aW5ncy5wcm90b3R5cGUuZ2V0RGlyZWN0aW9uID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuICh0aGlzLl9kaXJlY3Rpb25SYW5nZSkgPyB0aGlzLl9kaXJlY3Rpb25SYW5nZS5yYW5nZSgpIDogMDtcbn07XG5cblBhcnRpY2xlU2V0dGluZ3MucHJvdG90eXBlLmdldEFscGhhID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuICh0aGlzLl9hbHBoYVJhbmdlKSA/IHRoaXMuX2FscGhhUmFuZ2UucmFuZ2UoKSA6IDE7XG59O1xuXG5QYXJ0aWNsZVNldHRpbmdzLnByb3RvdHlwZS5nZXRSb3RhdGlvbiA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiAodGhpcy5fcm90YXRpb25SYW5nZSkgPyB0aGlzLl9yb3RhdGlvblJhbmdlLnJhbmdlKCkgOiAwO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBQYXJ0aWNsZVNldHRpbmdzOyIsInZhciBDb21wYWN0QXJyYXkgPSB7fTtcblxuQ29tcGFjdEFycmF5LmNvbXBhY3QgPSBmdW5jdGlvbihhcnJheSkge1xuICAgIGZvciAodmFyIGogPSAwOyBqIDwgYXJyYXkubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgaWYgKGFycmF5W2pdID09IG51bGwpIHtcbiAgICAgICAgICAgIGFycmF5LnNwbGljZShqLCAxKTtcbiAgICAgICAgICAgIGotLTtcbiAgICAgICAgfVxuICAgIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gQ29tcGFjdEFycmF5OyIsInZhciBHZW9tZXRyeSA9IHt9O1xuXG5HZW9tZXRyeS5kaXN0YW5jZUJldHdlZW5Qb2ludHMgPSBmdW5jdGlvbihhLCBiKSB7XG4gICAgcmV0dXJuIE1hdGguc3FydCggKGEueC1iLngpKihhLngtYi54KSArIChhLnktYi55KSooYS55LWIueSkgKTtcbn07XG5cbkdlb21ldHJ5LmFuZ2xlQmV0d2VlblBvaW50c1JhZGlhbnMgPSBmdW5jdGlvbihhLCBiKSB7XG4gICAgcmV0dXJuIE1hdGguYXRhbjIoYi55IC0gYS55LCBiLnggLSBhLngpOztcbn07XG5cbkdlb21ldHJ5LmFuZ2xlQmV0d2VlblBvaW50c0RlZ3JlZXMgPSBmdW5jdGlvbihhLCBiKSB7XG4gICAgcmV0dXJuIEdlb21ldHJ5LmFuZ2xlQmV0d2VlblBvaW50c1JhZGlhbnMoYSwgYikgKiAxODAgLyBNYXRoLlBJO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBHZW9tZXRyeTsiLCJ2YXIgUXVpY2tSYW5nZSA9IHt9O1xuXG5RdWlja1JhbmdlLnJhbmdlID0gZnVuY3Rpb24obWluLCBtYXgsIHJvdW5kKSB7XG4gICAgdmFyIHZhbHVlID0gbWluICsgKE1hdGgucmFuZG9tKCkgKiAobWF4IC0gbWluKSk7XG4gICAgaWYocm91bmQpIHZhbHVlID0gTWF0aC5yb3VuZCh2YWx1ZSk7XG4gICAgcmV0dXJuIHZhbHVlO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBRdWlja1JhbmdlOyIsImZ1bmN0aW9uIFJhbmdlKG1pbiwgbWF4LCByb3VuZCkge1xuICAgIHRoaXMubWluID0gbWluO1xuICAgIHRoaXMubWF4ID0gbWF4O1xuICAgIHRoaXMucm91bmQgPSByb3VuZDtcbn1cblxuUmFuZ2UucHJvdG90eXBlLnJhbmdlID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHZhbHVlID0gdGhpcy5taW4gKyAoTWF0aC5yYW5kb20oKSAqICh0aGlzLm1heCAtIHRoaXMubWluKSk7XG4gICAgaWYodGhpcy5yb3VuZCkgdmFsdWUgPSBNYXRoLnJvdW5kKHZhbHVlKTtcbiAgICByZXR1cm4gdmFsdWU7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFJhbmdlOyIsInZhciBUZXh0dXJlR2VuZXJhdG9yID0ge307XG5cblRleHR1cmVHZW5lcmF0b3IuY2lyY2xlID0gZnVuY3Rpb24ocmFkaXVzLCBjb2xvdXIsIGhhbG8sIGJsdXJBbW91bnQpIHtcbiAgICB2YXIgZ3JhcGhpY3MgPSBuZXcgUElYSS5HcmFwaGljcygpO1xuICAgIGdyYXBoaWNzLmxpbmVTdHlsZSgwKTtcblxuICAgIGlmKGhhbG8pIHtcbiAgICAgICAgZ3JhcGhpY3MuYmVnaW5GaWxsKGNvbG91ciwgLjIpO1xuICAgICAgICBncmFwaGljcy5kcmF3Q2lyY2xlKDAsIDAsIHJhZGl1cyAqIDIpO1xuICAgICAgICBncmFwaGljcy5lbmRGaWxsKCk7XG5cbiAgICAgICAgZ3JhcGhpY3MuYmVnaW5GaWxsKGNvbG91ciwgLjEpO1xuICAgICAgICBncmFwaGljcy5kcmF3Q2lyY2xlKDAsIDAsIHJhZGl1cyAqIDQpO1xuICAgICAgICBncmFwaGljcy5lbmRGaWxsKCk7XG4gICAgfVxuXG4gICAgZ3JhcGhpY3MuYmVnaW5GaWxsKGNvbG91ciwgMSk7XG4gICAgZ3JhcGhpY3MuZHJhd0NpcmNsZSgwLCAwLCByYWRpdXMpO1xuICAgIGdyYXBoaWNzLmVuZEZpbGwoKTtcblxuICAgIGlmKGJsdXJBbW91bnQgPiAwKSB7XG4gICAgICAgIHZhciBibHVyRmlsdGVyID0gbmV3IFBJWEkuZmlsdGVycy5CbHVyRmlsdGVyKCk7XG4gICAgICAgIGJsdXJGaWx0ZXIuYmx1ciA9IGJsdXJBbW91bnQ7XG4gICAgICAgIGdyYXBoaWNzLmZpbHRlcnMgPSBbYmx1ckZpbHRlcl07XG4gICAgfVxuXG4gICAgcmV0dXJuIGFwcC5yZW5kZXJlci5nZW5lcmF0ZVRleHR1cmUoZ3JhcGhpY3MpO1xufTtcblxuVGV4dHVyZUdlbmVyYXRvci5yZWN0YW5nbGUgPSBmdW5jdGlvbih3aWR0aCwgaGVpZ2h0LCBjb2xvdXIsIGhhbG8sIGJsdXJBbW91bnQpIHtcbiAgICB2YXIgZ3JhcGhpY3MgPSBuZXcgUElYSS5HcmFwaGljcygpO1xuICAgIGdyYXBoaWNzLmxpbmVTdHlsZSgwKTtcblxuICAgIGlmKGhhbG8pIHtcbiAgICAgICAgZ3JhcGhpY3MuYmVnaW5GaWxsKGNvbG91ciwgLjIpO1xuICAgICAgICBncmFwaGljcy5kcmF3UmVjdCgwLCAwLCB3aWR0aCAqIDIsIGhlaWdodCAqIDIpO1xuICAgICAgICBncmFwaGljcy5lbmRGaWxsKCk7XG5cbiAgICAgICAgZ3JhcGhpY3MuYmVnaW5GaWxsKGNvbG91ciwgLjEpO1xuICAgICAgICBncmFwaGljcy5kcmF3UmVjdCgwLCAwLCB3aWR0aCAqIDQsIGhlaWdodCAqIDQpO1xuICAgICAgICBncmFwaGljcy5lbmRGaWxsKCk7XG4gICAgfVxuXG4gICAgZ3JhcGhpY3MuYmVnaW5GaWxsKGNvbG91cik7XG4gICAgZ3JhcGhpY3MuZHJhd1JlY3QoMCwgMCwgd2lkdGgsIGhlaWdodCk7XG4gICAgZ3JhcGhpY3MuZW5kRmlsbCgpO1xuXG4gICAgZ3JhcGhpY3MuYW5jaG9yID0ge3g6LjUsIHk6LjV9O1xuXG4gICAgaWYoYmx1ckFtb3VudCA+IDApIHtcbiAgICAgICAgdmFyIGJsdXJGaWx0ZXIgPSBuZXcgUElYSS5maWx0ZXJzLkJsdXJGaWx0ZXIoKTtcbiAgICAgICAgYmx1ckZpbHRlci5ibHVyID0gYmx1ckFtb3VudDtcbiAgICAgICAgZ3JhcGhpY3MuZmlsdGVycyA9IFtibHVyRmlsdGVyXTtcbiAgICB9XG5cbiAgICByZXR1cm4gYXBwLnJlbmRlcmVyLmdlbmVyYXRlVGV4dHVyZShncmFwaGljcyk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFRleHR1cmVHZW5lcmF0b3I7Il19

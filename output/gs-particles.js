(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
FireworkDisplay.constructor = FireworkDisplay;
FireworkDisplay.prototype = Object.create(PIXI.Container.prototype);

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
},{"./effects/ElementalDragon":3,"./effects/Fire":4,"./effects/Firework1":5,"./effects/Firework2":6,"./effects/Firework3":7,"./effects/Firework4":8,"./effects/Rain":10,"./particle-system/utils/TextureGenerator":28}],2:[function(require,module,exports){
var FireworkDisplay = require('../src/FireworkDisplay');
var RippleEffect = require('./ripple/RippleEffect');
window.onload = init;

function init() {
    this.originalWindowSize = {width:window.innerWidth, height:window.innerHeight};


    this.loader = PIXI.loader
        .add('ripple', '../resources/ripple.png')
        .add('smoke1', '../resources/smoke1.png')
        .add('smoke2', '../resources/smoke2.png')
        .add('smoke3', '../resources/smoke3.png')
        .add('smoke4', '../resources/smoke4.png')
        .load(texturesLoaded);
}

function texturesLoaded (loader, resources) {
    setupStage();
    setupBackground();
    setupFireworkDisplay();
    update();
}

function setupStage() {
    var canvas = document.getElementById('game');
    canvas.style.width = String(window.innerWidth) + 'px';
    canvas.style.height = String(window.innerHeight) + 'px';

    var rendererOptions = {
        antialiasing:false,
        resolution:1,
        backgroundColor:0x000000,
        view:canvas
    };

    this.renderer = PIXI.autoDetectRenderer(window.innerWidth, window.innerHeight, rendererOptions);
    this.stage = new PIXI.Container();
}

function setupBackground() {
    var background = new PIXI.Sprite.fromImage('../resources/background.png');
    background.anchor= {x:0.5, y:1};
    background.x = window.innerWidth / 2;
    background.y = window.innerHeight - 100;
    this.stage.addChild(background);

    this.rippleEffect = new RippleEffect({x: window.innerWidth / 2, y:window.innerHeight - 150});
    this.stage.addChild(this.rippleEffect);
}

function setupFireworkDisplay() {
    this.fireworkDisplay = new FireworkDisplay();
    this.stage.addChild(this.fireworkDisplay);
}

function update() {
    TWEEN.update();

    this.fireworkDisplay.update();
    this.rippleEffect.update();
    this.renderer.render(this.stage);

    if(this.originalWindowSize.width !== window.innerWidth || this.originalWindowSize.height !== window.innerHeight) {
        window.location = window.location;
    }

    window.requestAnimationFrame(update);
}
},{"../src/FireworkDisplay":1,"./ripple/RippleEffect":29}],3:[function(require,module,exports){
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
}

ElementalDragon.prototype.setupHeadAndTail = function() {
    this.head = new PIXI.Sprite.fromImage('../resources/dragonHead.png');
    this.head.anchor.y = .5;
    this.head.anchor.x = .5;
    // this.tail = new PIXI.Sprite.fromImage('../resources/dragonTail.png');
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
    this.bodyParticlesEmitter.start();
    this.bodySmokeEmitter.start();
    this.addChild(this.head);
    // this.addChild(this.tail);
    this.pos = {x:0, y:0};
    this.pos2 = {x:0, y:0};
    this.headTween = new TWEEN.Tween(this.pos);
    // this.tailTween = new TWEEN.Tween(this.pos2)

};

ElementalDragon.prototype.update = function() {
    var target = renderer.plugins.interaction.mouse.global;

    target.rotation = Geometry.angleBetweenPointsRadians(target, {x:this.head.x, y:this.head.y});

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


var TintDragonBodyBehaviour = {};

TintDragonBodyBehaviour.reset = function(particle) {
    particle.tint = 0xbcfdfa;
};

TintDragonBodyBehaviour.update = function(particle) {
    // particle.rotation += particle.rotationSpeed;
};


var RotationBehaviour = {};

RotationBehaviour.reset = function(particle) {
    particle.rotationSpeed = (Math.random() * .01) - .005;
};

RotationBehaviour.update = function(particle) {
    particle.rotation += particle.rotationSpeed;
};
},{"./../particle-system/behaviours/LifeBehaviour":13,"./../particle-system/behaviours/VelocityBehaviour":17,"./../particle-system/emitter/Emitter":19,"./../particle-system/emitter/EmitterSettings":20,"./../particle-system/particle/ParticleSettings":23,"./../particle-system/utils/Geometry":25,"./../particle-system/utils/TextureGenerator":28}],4:[function(require,module,exports){
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
},{"./../particle-system/behaviours/GravityBehaviour":12,"./../particle-system/behaviours/LifeBehaviour":13,"./../particle-system/behaviours/RotationBehaviour":15,"./../particle-system/behaviours/SpiralBehaviour":16,"./../particle-system/behaviours/VelocityBehaviour":17,"./../particle-system/emitter/Emitter":19,"./../particle-system/emitter/EmitterSettings":20,"./../particle-system/particle/ParticleSettings":23,"./../particle-system/utils/QuickRange":26,"./../particle-system/utils/TextureGenerator":28}],5:[function(require,module,exports){
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
},{"./../particle-system/behaviours/LifeBehaviour":13,"./../particle-system/behaviours/RippleBehaviour":14,"./../particle-system/behaviours/RotationBehaviour":15,"./../particle-system/behaviours/VelocityBehaviour":17,"./../particle-system/behaviours/WanderBehaviour":18,"./../particle-system/emitter/Emitter":19,"./../particle-system/emitter/EmitterSettings":20,"./../particle-system/particle/ParticleSettings":23,"./../particle-system/utils/CompactArray":24,"./../particle-system/utils/TextureGenerator":28,"./FireworkPositions":9}],6:[function(require,module,exports){
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
},{"./../particle-system/behaviours/LifeBehaviour":13,"./../particle-system/behaviours/RippleBehaviour":14,"./../particle-system/behaviours/RotationBehaviour":15,"./../particle-system/behaviours/SpiralBehaviour":16,"./../particle-system/behaviours/VelocityBehaviour":17,"./../particle-system/emitter/Emitter":19,"./../particle-system/emitter/EmitterSettings":20,"./../particle-system/particle/ParticleSettings":23,"./../particle-system/utils/CompactArray":24,"./../particle-system/utils/TextureGenerator":28,"./FireworkPositions":9}],7:[function(require,module,exports){
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
},{"./../particle-system/behaviours/DecayBehaviour":11,"./../particle-system/behaviours/LifeBehaviour":13,"./../particle-system/behaviours/RippleBehaviour":14,"./../particle-system/behaviours/RotationBehaviour":15,"./../particle-system/behaviours/VelocityBehaviour":17,"./../particle-system/emitter/Emitter":19,"./../particle-system/emitter/EmitterSettings":20,"./../particle-system/particle/ParticleSettings":23,"./../particle-system/utils/CompactArray":24,"./../particle-system/utils/TextureGenerator":28,"./FireworkPositions":9}],8:[function(require,module,exports){
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
},{"./../particle-system/behaviours/DecayBehaviour":11,"./../particle-system/behaviours/GravityBehaviour":12,"./../particle-system/behaviours/LifeBehaviour":13,"./../particle-system/behaviours/RippleBehaviour":14,"./../particle-system/behaviours/RotationBehaviour":15,"./../particle-system/behaviours/VelocityBehaviour":17,"./../particle-system/emitter/Emitter":19,"./../particle-system/emitter/EmitterSettings":20,"./../particle-system/particle/ParticleSettings":23,"./../particle-system/utils/CompactArray":24,"./../particle-system/utils/TextureGenerator":28,"./FireworkPositions":9}],9:[function(require,module,exports){
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
    position.x = (window.innerWidth / 2) + QuickRange.range(-300, 300);
    position.y = QuickRange.range(100, 300);
    return position;
};

module.exports = FireworkPositions;
},{"../particle-system/utils/QuickRange":26}],10:[function(require,module,exports){
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
},{"./../particle-system/behaviours/GravityBehaviour":12,"./../particle-system/behaviours/LifeBehaviour":13,"./../particle-system/behaviours/SpiralBehaviour":16,"./../particle-system/behaviours/VelocityBehaviour":17,"./../particle-system/emitter/Emitter":19,"./../particle-system/emitter/EmitterSettings":20,"./../particle-system/particle/ParticleSettings":23,"./../particle-system/utils/TextureGenerator":28}],11:[function(require,module,exports){
var Behaviour = {};

Behaviour.reset = function(particle) {
};

Behaviour.update = function(particle) {
    particle.speed *= particle.decay;
};

module.exports = Behaviour;
},{}],12:[function(require,module,exports){
var Behaviour = {};

Behaviour.reset = function(particle) {
};

Behaviour.update = function(particle) {
    particle.y += particle.gravity;
};

module.exports = Behaviour;
},{}],13:[function(require,module,exports){
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
},{}],14:[function(require,module,exports){
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
},{"../utils/QuickRange":26}],15:[function(require,module,exports){
var QuickRange = require('../utils/QuickRange');
var Behaviour = {};

Behaviour.reset = function(particle) {
    particle.rotationSpeed = QuickRange.range(.5, 2);
};

Behaviour.update = function(particle) {
    particle.rotation += particle.rotationSpeed;
};

module.exports = Behaviour;
},{"../utils/QuickRange":26}],16:[function(require,module,exports){
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
},{"../utils/QuickRange":26}],17:[function(require,module,exports){
var Behaviour = {};

Behaviour.reset = function(particle) {
};

Behaviour.update = function(particle) {
    particle.x += particle.speed * Math.sin(particle.direction);
    particle.y += particle.speed * -Math.cos(particle.direction);
};

module.exports = Behaviour;
},{}],18:[function(require,module,exports){
var QuickRange = require('../utils/QuickRange');
var Behaviour = {};

Behaviour.reset = function(particle) {
};

Behaviour.update = function(particle) {
    particle.direction += QuickRange.range(-1, 1);
};

module.exports = Behaviour;
},{"../utils/QuickRange":26}],19:[function(require,module,exports){
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
},{"../particle/ParticlePool":22,"../utils/CompactArray":24,"../utils/QuickRange":26}],20:[function(require,module,exports){
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
},{"../utils/Range":27}],21:[function(require,module,exports){
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
},{}],22:[function(require,module,exports){
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
},{"./Particle":21}],23:[function(require,module,exports){
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
},{"../utils/Range":27}],24:[function(require,module,exports){
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
},{}],25:[function(require,module,exports){
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
},{}],26:[function(require,module,exports){
var QuickRange = {};

QuickRange.range = function(min, max, round) {
    var value = min + (Math.random() * (max - min));
    if(round) value = Math.round(value);
    return value;
};

module.exports = QuickRange;
},{}],27:[function(require,module,exports){
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
},{}],28:[function(require,module,exports){
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

    return renderer.generateTexture(graphics);
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

    return renderer.generateTexture(graphics);
};

module.exports = TextureGenerator;
},{}],29:[function(require,module,exports){
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
},{"./../particle-system/behaviours/LifeBehaviour":13,"./../particle-system/behaviours/RippleBehaviour":14,"./../particle-system/behaviours/RotationBehaviour":15,"./../particle-system/behaviours/VelocityBehaviour":17,"./../particle-system/behaviours/WanderBehaviour":18,"./../particle-system/emitter/Emitter":19,"./../particle-system/emitter/EmitterSettings":20,"./../particle-system/particle/ParticleSettings":23,"./../particle-system/utils/TextureGenerator":28}]},{},[2])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9ncnVudC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvRmlyZXdvcmtEaXNwbGF5LmpzIiwic3JjL01haW4uanMiLCJzcmMvZWZmZWN0cy9FbGVtZW50YWxEcmFnb24uanMiLCJzcmMvZWZmZWN0cy9GaXJlLmpzIiwic3JjL2VmZmVjdHMvRmlyZXdvcmsxLmpzIiwic3JjL2VmZmVjdHMvRmlyZXdvcmsyLmpzIiwic3JjL2VmZmVjdHMvRmlyZXdvcmszLmpzIiwic3JjL2VmZmVjdHMvRmlyZXdvcms0LmpzIiwic3JjL2VmZmVjdHMvRmlyZXdvcmtQb3NpdGlvbnMuanMiLCJzcmMvZWZmZWN0cy9SYWluLmpzIiwic3JjL3BhcnRpY2xlLXN5c3RlbS9iZWhhdmlvdXJzL0RlY2F5QmVoYXZpb3VyLmpzIiwic3JjL3BhcnRpY2xlLXN5c3RlbS9iZWhhdmlvdXJzL0dyYXZpdHlCZWhhdmlvdXIuanMiLCJzcmMvcGFydGljbGUtc3lzdGVtL2JlaGF2aW91cnMvTGlmZUJlaGF2aW91ci5qcyIsInNyYy9wYXJ0aWNsZS1zeXN0ZW0vYmVoYXZpb3Vycy9SaXBwbGVCZWhhdmlvdXIuanMiLCJzcmMvcGFydGljbGUtc3lzdGVtL2JlaGF2aW91cnMvUm90YXRpb25CZWhhdmlvdXIuanMiLCJzcmMvcGFydGljbGUtc3lzdGVtL2JlaGF2aW91cnMvU3BpcmFsQmVoYXZpb3VyLmpzIiwic3JjL3BhcnRpY2xlLXN5c3RlbS9iZWhhdmlvdXJzL1ZlbG9jaXR5QmVoYXZpb3VyLmpzIiwic3JjL3BhcnRpY2xlLXN5c3RlbS9iZWhhdmlvdXJzL1dhbmRlckJlaGF2aW91ci5qcyIsInNyYy9wYXJ0aWNsZS1zeXN0ZW0vZW1pdHRlci9FbWl0dGVyLmpzIiwic3JjL3BhcnRpY2xlLXN5c3RlbS9lbWl0dGVyL0VtaXR0ZXJTZXR0aW5ncy5qcyIsInNyYy9wYXJ0aWNsZS1zeXN0ZW0vcGFydGljbGUvUGFydGljbGUuanMiLCJzcmMvcGFydGljbGUtc3lzdGVtL3BhcnRpY2xlL1BhcnRpY2xlUG9vbC5qcyIsInNyYy9wYXJ0aWNsZS1zeXN0ZW0vcGFydGljbGUvUGFydGljbGVTZXR0aW5ncy5qcyIsInNyYy9wYXJ0aWNsZS1zeXN0ZW0vdXRpbHMvQ29tcGFjdEFycmF5LmpzIiwic3JjL3BhcnRpY2xlLXN5c3RlbS91dGlscy9HZW9tZXRyeS5qcyIsInNyYy9wYXJ0aWNsZS1zeXN0ZW0vdXRpbHMvUXVpY2tSYW5nZS5qcyIsInNyYy9wYXJ0aWNsZS1zeXN0ZW0vdXRpbHMvUmFuZ2UuanMiLCJzcmMvcGFydGljbGUtc3lzdGVtL3V0aWxzL1RleHR1cmVHZW5lcmF0b3IuanMiLCJzcmMvcmlwcGxlL1JpcHBsZUVmZmVjdC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbElBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdklBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbktBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJGaXJld29ya0Rpc3BsYXkuY29uc3RydWN0b3IgPSBGaXJld29ya0Rpc3BsYXk7XG5GaXJld29ya0Rpc3BsYXkucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShQSVhJLkNvbnRhaW5lci5wcm90b3R5cGUpO1xuXG52YXIgVGV4dHVyZUdlbmVyYXRvciA9IHJlcXVpcmUoJy4vcGFydGljbGUtc3lzdGVtL3V0aWxzL1RleHR1cmVHZW5lcmF0b3InKTtcbnZhciBGaXJld29yazEgPSByZXF1aXJlKCcuL2VmZmVjdHMvRmlyZXdvcmsxJyk7XG52YXIgRmlyZXdvcmsyID0gcmVxdWlyZSgnLi9lZmZlY3RzL0ZpcmV3b3JrMicpO1xudmFyIEZpcmV3b3JrMyA9IHJlcXVpcmUoJy4vZWZmZWN0cy9GaXJld29yazMnKTtcbnZhciBGaXJld29yazQgPSByZXF1aXJlKCcuL2VmZmVjdHMvRmlyZXdvcms0Jyk7XG52YXIgUmFpbiA9IHJlcXVpcmUoJy4vZWZmZWN0cy9SYWluJyk7XG52YXIgRmlyZSA9IHJlcXVpcmUoJy4vZWZmZWN0cy9GaXJlJyk7XG52YXIgRWxlbWVudGFsRHJhZ29uID0gcmVxdWlyZSgnLi9lZmZlY3RzL0VsZW1lbnRhbERyYWdvbicpO1xuXG5mdW5jdGlvbiBGaXJld29ya0Rpc3BsYXkoKSB7XG4gICAgUElYSS5Db250YWluZXIuY2FsbCh0aGlzKTtcblxuICAgIHRoaXMuZWZmZWN0cyA9IFtdO1xuICAgIHRoaXMuYWRkRWZmZWN0KG5ldyBGaXJld29yazEoKSk7XG4gICAgdGhpcy5hZGRFZmZlY3QobmV3IEZpcmV3b3JrMigpKTtcbiAgICB0aGlzLmFkZEVmZmVjdChuZXcgRmlyZXdvcmszKCkpO1xuICAgIHRoaXMuYWRkRWZmZWN0KG5ldyBGaXJld29yazQoKSk7XG4gICAgdGhpcy5hZGRFZmZlY3QobmV3IFJhaW4oKSk7XG4gICAgdGhpcy5hZGRFZmZlY3QobmV3IEZpcmUoKSk7XG4gICAgdGhpcy5hZGRFZmZlY3QobmV3IEVsZW1lbnRhbERyYWdvbigpKTtcblxuICAgIHRoaXMuYWRkQnV0dG9ucygpO1xufVxuXG5GaXJld29ya0Rpc3BsYXkucHJvdG90eXBlLmFkZEVmZmVjdCA9IGZ1bmN0aW9uKGVmZmVjdCkge1xuICAgIHRoaXMuZWZmZWN0cy5wdXNoKGVmZmVjdCk7XG4gICAgdGhpcy5hZGRDaGlsZChlZmZlY3QpO1xufTtcblxuRmlyZXdvcmtEaXNwbGF5LnByb3RvdHlwZS5hZGRCdXR0b25zID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHBhZGRpbmcgPSAxMDtcbiAgICB2YXIgYnV0dG9uV2lkdGggPSAod2luZG93LmlubmVyV2lkdGggLSAocGFkZGluZyAqICh0aGlzLmVmZmVjdHMubGVuZ3RoICsgMSkpKSAvIHRoaXMuZWZmZWN0cy5sZW5ndGg7XG4gICAgdmFyIGJ1dHRvbkhlaWdodCA9IDUwO1xuXG4gICAgZm9yKHZhciBpID0gMDsgaSA8IHRoaXMuZWZmZWN0cy5sZW5ndGg7IGkrKykge1xuICAgICAgICB0aGlzLmFkZEJ1dHRvbihwYWRkaW5nICsgKGkgKiAoYnV0dG9uV2lkdGggKyBwYWRkaW5nKSksIHdpbmRvdy5pbm5lckhlaWdodCAtIHBhZGRpbmcgLSBidXR0b25IZWlnaHQsIGJ1dHRvbldpZHRoLCBidXR0b25IZWlnaHQsIHRoaXMuc3RhcnRFZmZlY3QuYmluZCh0aGlzLCB0aGlzLmVmZmVjdHNbaV0pKTtcbiAgICB9XG59O1xuXG5GaXJld29ya0Rpc3BsYXkucHJvdG90eXBlLnN0YXJ0RWZmZWN0ID0gZnVuY3Rpb24oZWZmZWN0KSB7XG4gICAgZWZmZWN0LnN0YXJ0KCk7XG59O1xuXG5GaXJld29ya0Rpc3BsYXkucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uKCkge1xuICAgIGZvcih2YXIgaSA9IDA7IGkgPCB0aGlzLmVmZmVjdHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdGhpcy5lZmZlY3RzW2ldLnVwZGF0ZSgpO1xuICAgIH1cbn07XG5cbkZpcmV3b3JrRGlzcGxheS5wcm90b3R5cGUuYWRkQnV0dG9uID0gZnVuY3Rpb24oeCwgeSwgd2lkdGgsIGhlaWdodCwgY2FsbGJhY2spIHtcbiAgICB2YXIgdGV4dHVyZSA9IFRleHR1cmVHZW5lcmF0b3IucmVjdGFuZ2xlKHdpZHRoLCBoZWlnaHQsIDB4MjY4Njk0KTtcbiAgICB2YXIgc3ByaXRlID0gbmV3IFBJWEkuU3ByaXRlKHRleHR1cmUpO1xuICAgIHNwcml0ZS54ID0geDtcbiAgICBzcHJpdGUueSA9IHk7XG4gICAgc3ByaXRlLmludGVyYWN0aXZlID0gdHJ1ZTtcbiAgICBzcHJpdGUubW91c2Vkb3duID0gc3ByaXRlLnRvdWNoZW5kID0gY2FsbGJhY2s7XG4gICAgc3ByaXRlLmJ1dHRvbk1vZGUgPSB0cnVlO1xuXG4gICAgdGhpcy5hZGRDaGlsZChzcHJpdGUpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBGaXJld29ya0Rpc3BsYXk7IiwidmFyIEZpcmV3b3JrRGlzcGxheSA9IHJlcXVpcmUoJy4uL3NyYy9GaXJld29ya0Rpc3BsYXknKTtcbnZhciBSaXBwbGVFZmZlY3QgPSByZXF1aXJlKCcuL3JpcHBsZS9SaXBwbGVFZmZlY3QnKTtcbndpbmRvdy5vbmxvYWQgPSBpbml0O1xuXG5mdW5jdGlvbiBpbml0KCkge1xuICAgIHRoaXMub3JpZ2luYWxXaW5kb3dTaXplID0ge3dpZHRoOndpbmRvdy5pbm5lcldpZHRoLCBoZWlnaHQ6d2luZG93LmlubmVySGVpZ2h0fTtcblxuXG4gICAgdGhpcy5sb2FkZXIgPSBQSVhJLmxvYWRlclxuICAgICAgICAuYWRkKCdyaXBwbGUnLCAnLi4vcmVzb3VyY2VzL3JpcHBsZS5wbmcnKVxuICAgICAgICAuYWRkKCdzbW9rZTEnLCAnLi4vcmVzb3VyY2VzL3Ntb2tlMS5wbmcnKVxuICAgICAgICAuYWRkKCdzbW9rZTInLCAnLi4vcmVzb3VyY2VzL3Ntb2tlMi5wbmcnKVxuICAgICAgICAuYWRkKCdzbW9rZTMnLCAnLi4vcmVzb3VyY2VzL3Ntb2tlMy5wbmcnKVxuICAgICAgICAuYWRkKCdzbW9rZTQnLCAnLi4vcmVzb3VyY2VzL3Ntb2tlNC5wbmcnKVxuICAgICAgICAubG9hZCh0ZXh0dXJlc0xvYWRlZCk7XG59XG5cbmZ1bmN0aW9uIHRleHR1cmVzTG9hZGVkIChsb2FkZXIsIHJlc291cmNlcykge1xuICAgIHNldHVwU3RhZ2UoKTtcbiAgICBzZXR1cEJhY2tncm91bmQoKTtcbiAgICBzZXR1cEZpcmV3b3JrRGlzcGxheSgpO1xuICAgIHVwZGF0ZSgpO1xufVxuXG5mdW5jdGlvbiBzZXR1cFN0YWdlKCkge1xuICAgIHZhciBjYW52YXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZ2FtZScpO1xuICAgIGNhbnZhcy5zdHlsZS53aWR0aCA9IFN0cmluZyh3aW5kb3cuaW5uZXJXaWR0aCkgKyAncHgnO1xuICAgIGNhbnZhcy5zdHlsZS5oZWlnaHQgPSBTdHJpbmcod2luZG93LmlubmVySGVpZ2h0KSArICdweCc7XG5cbiAgICB2YXIgcmVuZGVyZXJPcHRpb25zID0ge1xuICAgICAgICBhbnRpYWxpYXNpbmc6ZmFsc2UsXG4gICAgICAgIHJlc29sdXRpb246MSxcbiAgICAgICAgYmFja2dyb3VuZENvbG9yOjB4MDAwMDAwLFxuICAgICAgICB2aWV3OmNhbnZhc1xuICAgIH07XG5cbiAgICB0aGlzLnJlbmRlcmVyID0gUElYSS5hdXRvRGV0ZWN0UmVuZGVyZXIod2luZG93LmlubmVyV2lkdGgsIHdpbmRvdy5pbm5lckhlaWdodCwgcmVuZGVyZXJPcHRpb25zKTtcbiAgICB0aGlzLnN0YWdlID0gbmV3IFBJWEkuQ29udGFpbmVyKCk7XG59XG5cbmZ1bmN0aW9uIHNldHVwQmFja2dyb3VuZCgpIHtcbiAgICB2YXIgYmFja2dyb3VuZCA9IG5ldyBQSVhJLlNwcml0ZS5mcm9tSW1hZ2UoJy4uL3Jlc291cmNlcy9iYWNrZ3JvdW5kLnBuZycpO1xuICAgIGJhY2tncm91bmQuYW5jaG9yPSB7eDowLjUsIHk6MX07XG4gICAgYmFja2dyb3VuZC54ID0gd2luZG93LmlubmVyV2lkdGggLyAyO1xuICAgIGJhY2tncm91bmQueSA9IHdpbmRvdy5pbm5lckhlaWdodCAtIDEwMDtcbiAgICB0aGlzLnN0YWdlLmFkZENoaWxkKGJhY2tncm91bmQpO1xuXG4gICAgdGhpcy5yaXBwbGVFZmZlY3QgPSBuZXcgUmlwcGxlRWZmZWN0KHt4OiB3aW5kb3cuaW5uZXJXaWR0aCAvIDIsIHk6d2luZG93LmlubmVySGVpZ2h0IC0gMTUwfSk7XG4gICAgdGhpcy5zdGFnZS5hZGRDaGlsZCh0aGlzLnJpcHBsZUVmZmVjdCk7XG59XG5cbmZ1bmN0aW9uIHNldHVwRmlyZXdvcmtEaXNwbGF5KCkge1xuICAgIHRoaXMuZmlyZXdvcmtEaXNwbGF5ID0gbmV3IEZpcmV3b3JrRGlzcGxheSgpO1xuICAgIHRoaXMuc3RhZ2UuYWRkQ2hpbGQodGhpcy5maXJld29ya0Rpc3BsYXkpO1xufVxuXG5mdW5jdGlvbiB1cGRhdGUoKSB7XG4gICAgVFdFRU4udXBkYXRlKCk7XG5cbiAgICB0aGlzLmZpcmV3b3JrRGlzcGxheS51cGRhdGUoKTtcbiAgICB0aGlzLnJpcHBsZUVmZmVjdC51cGRhdGUoKTtcbiAgICB0aGlzLnJlbmRlcmVyLnJlbmRlcih0aGlzLnN0YWdlKTtcblxuICAgIGlmKHRoaXMub3JpZ2luYWxXaW5kb3dTaXplLndpZHRoICE9PSB3aW5kb3cuaW5uZXJXaWR0aCB8fCB0aGlzLm9yaWdpbmFsV2luZG93U2l6ZS5oZWlnaHQgIT09IHdpbmRvdy5pbm5lckhlaWdodCkge1xuICAgICAgICB3aW5kb3cubG9jYXRpb24gPSB3aW5kb3cubG9jYXRpb247XG4gICAgfVxuXG4gICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSh1cGRhdGUpO1xufSIsIkVsZW1lbnRhbERyYWdvbi5jb25zdHJ1Y3RvciA9IEVsZW1lbnRhbERyYWdvbjtcbkVsZW1lbnRhbERyYWdvbi5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKFBJWEkuQ29udGFpbmVyLnByb3RvdHlwZSk7XG5cbnZhciBFbWl0dGVyID0gcmVxdWlyZSgnLi8uLi9wYXJ0aWNsZS1zeXN0ZW0vZW1pdHRlci9FbWl0dGVyJyk7XG52YXIgRW1pdHRlclNldHRpbmdzID0gcmVxdWlyZSgnLi8uLi9wYXJ0aWNsZS1zeXN0ZW0vZW1pdHRlci9FbWl0dGVyU2V0dGluZ3MnKTtcbnZhciBQYXJ0aWNsZVNldHRpbmdzID0gcmVxdWlyZSgnLi8uLi9wYXJ0aWNsZS1zeXN0ZW0vcGFydGljbGUvUGFydGljbGVTZXR0aW5ncycpO1xudmFyIFRleHR1cmVHZW5lcmF0b3IgPSByZXF1aXJlKCcuLy4uL3BhcnRpY2xlLXN5c3RlbS91dGlscy9UZXh0dXJlR2VuZXJhdG9yJyk7XG52YXIgTGlmZUJlaGF2aW91ciA9IHJlcXVpcmUoJy4vLi4vcGFydGljbGUtc3lzdGVtL2JlaGF2aW91cnMvTGlmZUJlaGF2aW91cicpO1xudmFyIFZlbG9jaXR5QmVoYXZpb3VyID0gcmVxdWlyZSgnLi8uLi9wYXJ0aWNsZS1zeXN0ZW0vYmVoYXZpb3Vycy9WZWxvY2l0eUJlaGF2aW91cicpO1xudmFyIEdlb21ldHJ5ID0gcmVxdWlyZSgnLi8uLi9wYXJ0aWNsZS1zeXN0ZW0vdXRpbHMvR2VvbWV0cnknKTtcblxuZnVuY3Rpb24gRWxlbWVudGFsRHJhZ29uKCkge1xuICAgIFBJWEkuQ29udGFpbmVyLmNhbGwodGhpcyk7XG5cbiAgICB0aGlzLnRyYWlsRW1pdHRlcnMgPSBbXTtcblxuICAgIHRoaXMuc2V0dXBCb2R5UGFydGljbGVzKCk7XG4gICAgdGhpcy5zZXR1cEJvZHlTbW9rZSgpO1xuICAgIHRoaXMuc2V0dXBIZWFkQW5kVGFpbCgpO1xufVxuXG5FbGVtZW50YWxEcmFnb24ucHJvdG90eXBlLnNldHVwSGVhZEFuZFRhaWwgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLmhlYWQgPSBuZXcgUElYSS5TcHJpdGUuZnJvbUltYWdlKCcuLi9yZXNvdXJjZXMvZHJhZ29uSGVhZC5wbmcnKTtcbiAgICB0aGlzLmhlYWQuYW5jaG9yLnkgPSAuNTtcbiAgICB0aGlzLmhlYWQuYW5jaG9yLnggPSAuNTtcbiAgICAvLyB0aGlzLnRhaWwgPSBuZXcgUElYSS5TcHJpdGUuZnJvbUltYWdlKCcuLi9yZXNvdXJjZXMvZHJhZ29uVGFpbC5wbmcnKTtcbn07XG5cbkVsZW1lbnRhbERyYWdvbi5wcm90b3R5cGUuc2V0dXBCb2R5UGFydGljbGVzID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHBhcnRpY2xlU2V0dGluZ3MgPSBuZXcgUGFydGljbGVTZXR0aW5ncygpO1xuICAgIHBhcnRpY2xlU2V0dGluZ3Muc2V0TGlmZSg1MCwgMTAwLCAxMCwgNTApO1xuICAgIHBhcnRpY2xlU2V0dGluZ3Muc2V0U3BlZWQoLjIsIC41KTtcbiAgICBwYXJ0aWNsZVNldHRpbmdzLnNldERpcmVjdGlvbigtTWF0aC5QSSAqIDIsIE1hdGguUEkgKiAyKTtcbiAgICBwYXJ0aWNsZVNldHRpbmdzLnNldFNjYWxlKC4yLCAxLjUpO1xuICAgIHBhcnRpY2xlU2V0dGluZ3Muc2V0Um90YXRpb24oLU1hdGguUEkgKiAyLCBNYXRoLlBJICogMik7XG4gICAgcGFydGljbGVTZXR0aW5ncy5hZGRCZWhhdmlvdXIoVmVsb2NpdHlCZWhhdmlvdXIpO1xuICAgIHBhcnRpY2xlU2V0dGluZ3MuYWRkQmVoYXZpb3VyKExpZmVCZWhhdmlvdXIpO1xuICAgIHBhcnRpY2xlU2V0dGluZ3MuYWRkQmVoYXZpb3VyKFJvdGF0aW9uQmVoYXZpb3VyKTtcbiAgICBwYXJ0aWNsZVNldHRpbmdzLmFkZFRleHR1cmUoVGV4dHVyZUdlbmVyYXRvci5jaXJjbGUoMiwgMHhmZmZmZmYsIHRydWUpKTtcbiAgICBwYXJ0aWNsZVNldHRpbmdzLmFkZFRleHR1cmUoVGV4dHVyZUdlbmVyYXRvci5jaXJjbGUoMSwgMHhmZmZmZmYsIHRydWUpKTtcblxuICAgIHZhciBlbWl0dGVyU2V0dGluZ3MgPSBuZXcgRW1pdHRlclNldHRpbmdzKCk7XG4gICAgZW1pdHRlclNldHRpbmdzLnNldFF1YW50aXR5KDMwMCk7XG4gICAgZW1pdHRlclNldHRpbmdzLnNldFJlc3Bhd24odHJ1ZSk7XG4gICAgZW1pdHRlclNldHRpbmdzLnNldEJvdW5kcyh7dHlwZTpcIkNJUkNMRVwiLCByYWRpdXM6XCIyMFwifSk7XG4gICAgZW1pdHRlclNldHRpbmdzLnNldFNwYXduRGVsYXkoMCwgMTAwMCk7XG5cbiAgICB0aGlzLmJvZHlQYXJ0aWNsZXNFbWl0dGVyID0gbmV3IEVtaXR0ZXIodGhpcywgcGFydGljbGVTZXR0aW5ncywgZW1pdHRlclNldHRpbmdzKTtcbn07XG5cbkVsZW1lbnRhbERyYWdvbi5wcm90b3R5cGUuc2V0dXBCb2R5U21va2UgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgcGFydGljbGVTZXR0aW5ncyA9IG5ldyBQYXJ0aWNsZVNldHRpbmdzKCk7XG4gICAgcGFydGljbGVTZXR0aW5ncy5zZXRMaWZlKDUwLCAxMDAsIDAsIDApO1xuICAgIHBhcnRpY2xlU2V0dGluZ3Muc2V0U3BlZWQoLjEsIC4yKTtcbiAgICBwYXJ0aWNsZVNldHRpbmdzLnNldERpcmVjdGlvbigtTWF0aC5QSSAqIDIsIE1hdGguUEkgKiAyKTtcbiAgICBwYXJ0aWNsZVNldHRpbmdzLnNldFNjYWxlKC41LCAxKTtcbiAgICBwYXJ0aWNsZVNldHRpbmdzLnNldEFscGhhKC4wMSwgLjEpO1xuICAgIHBhcnRpY2xlU2V0dGluZ3Muc2V0Um90YXRpb24oLU1hdGguUEkgKiAyLCBNYXRoLlBJICogMik7XG4gICAgcGFydGljbGVTZXR0aW5ncy5hZGRCZWhhdmlvdXIoVmVsb2NpdHlCZWhhdmlvdXIpO1xuICAgIHBhcnRpY2xlU2V0dGluZ3MuYWRkQmVoYXZpb3VyKExpZmVCZWhhdmlvdXIpO1xuICAgIHBhcnRpY2xlU2V0dGluZ3MuYWRkQmVoYXZpb3VyKFJvdGF0aW9uQmVoYXZpb3VyKTtcbiAgICBwYXJ0aWNsZVNldHRpbmdzLmFkZEJlaGF2aW91cihUaW50RHJhZ29uQm9keUJlaGF2aW91cik7XG4gICAgcGFydGljbGVTZXR0aW5ncy5hZGRUZXh0dXJlKFBJWEkubG9hZGVyLnJlc291cmNlc1snc21va2UxJ10udGV4dHVyZSk7XG4gICAgcGFydGljbGVTZXR0aW5ncy5hZGRUZXh0dXJlKFBJWEkubG9hZGVyLnJlc291cmNlc1snc21va2UyJ10udGV4dHVyZSk7XG4gICAgcGFydGljbGVTZXR0aW5ncy5hZGRUZXh0dXJlKFBJWEkubG9hZGVyLnJlc291cmNlc1snc21va2UzJ10udGV4dHVyZSk7XG4gICAgcGFydGljbGVTZXR0aW5ncy5hZGRUZXh0dXJlKFBJWEkubG9hZGVyLnJlc291cmNlc1snc21va2U0J10udGV4dHVyZSk7XG5cbiAgICB2YXIgZW1pdHRlclNldHRpbmdzID0gbmV3IEVtaXR0ZXJTZXR0aW5ncygpO1xuICAgIGVtaXR0ZXJTZXR0aW5ncy5zZXRRdWFudGl0eSg2MDApO1xuICAgIGVtaXR0ZXJTZXR0aW5ncy5zZXRSZXNwYXduKHRydWUpO1xuICAgIGVtaXR0ZXJTZXR0aW5ncy5zZXRCb3VuZHMoe3R5cGU6XCJDSVJDTEVcIiwgcmFkaXVzOlwiMjBcIn0pO1xuICAgIGVtaXR0ZXJTZXR0aW5ncy5zZXRTcGF3bkRlbGF5KDAsIDEwMDApO1xuXG4gICAgdGhpcy5ib2R5U21va2VFbWl0dGVyID0gbmV3IEVtaXR0ZXIodGhpcywgcGFydGljbGVTZXR0aW5ncywgZW1pdHRlclNldHRpbmdzKTtcbn07XG5cbkVsZW1lbnRhbERyYWdvbi5wcm90b3R5cGUuc3RhcnQgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLmJvZHlQYXJ0aWNsZXNFbWl0dGVyLnN0YXJ0KCk7XG4gICAgdGhpcy5ib2R5U21va2VFbWl0dGVyLnN0YXJ0KCk7XG4gICAgdGhpcy5hZGRDaGlsZCh0aGlzLmhlYWQpO1xuICAgIC8vIHRoaXMuYWRkQ2hpbGQodGhpcy50YWlsKTtcbiAgICB0aGlzLnBvcyA9IHt4OjAsIHk6MH07XG4gICAgdGhpcy5wb3MyID0ge3g6MCwgeTowfTtcbiAgICB0aGlzLmhlYWRUd2VlbiA9IG5ldyBUV0VFTi5Ud2Vlbih0aGlzLnBvcyk7XG4gICAgLy8gdGhpcy50YWlsVHdlZW4gPSBuZXcgVFdFRU4uVHdlZW4odGhpcy5wb3MyKVxuXG59O1xuXG5FbGVtZW50YWxEcmFnb24ucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciB0YXJnZXQgPSByZW5kZXJlci5wbHVnaW5zLmludGVyYWN0aW9uLm1vdXNlLmdsb2JhbDtcblxuICAgIHRhcmdldC5yb3RhdGlvbiA9IEdlb21ldHJ5LmFuZ2xlQmV0d2VlblBvaW50c1JhZGlhbnModGFyZ2V0LCB7eDp0aGlzLmhlYWQueCwgeTp0aGlzLmhlYWQueX0pO1xuXG4gICAgdGhpcy5ib2R5UGFydGljbGVzRW1pdHRlci51cGRhdGUoKTtcbiAgICB0aGlzLmJvZHlTbW9rZUVtaXR0ZXIudXBkYXRlKCk7XG5cbiAgICBpZih0aGlzLmhlYWRUd2Vlbikge1xuICAgICAgICB0aGlzLmhlYWRUd2Vlbi50byh0YXJnZXQsIDEwMCk7XG4gICAgICAgIHRoaXMuaGVhZFR3ZWVuLnN0YXJ0KCk7XG4gICAgICAgIHRoaXMuaGVhZC54ID0gdGhpcy5wb3MueDtcbiAgICAgICAgdGhpcy5oZWFkLnkgPSB0aGlzLnBvcy55O1xuICAgICAgICB0aGlzLmhlYWQucm90YXRpb24gPSBHZW9tZXRyeS5hbmdsZUJldHdlZW5Qb2ludHNSYWRpYW5zKHRhcmdldCwge3g6dGhpcy5oZWFkLngsIHk6dGhpcy5oZWFkLnl9KTtcblxuICAgICAgICB2YXIgc3dpdGNoQW5nbGUgPSBNYXRoLlBJLzI7XG5cbiAgICAgICAgaWYodGhpcy5oZWFkLnJvdGF0aW9uIDwgLXN3aXRjaEFuZ2xlIHx8IHRoaXMuaGVhZC5yb3RhdGlvbiA+IHN3aXRjaEFuZ2xlKSB7XG4gICAgICAgICAgICB0aGlzLmhlYWQuc2NhbGUueSA9IC1zd2l0Y2hBbmdsZVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5oZWFkLnNjYWxlLnkgPSBzd2l0Y2hBbmdsZVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5ib2R5UGFydGljbGVzRW1pdHRlci54ID0gdGhpcy5wb3MueDtcbiAgICAgICAgdGhpcy5ib2R5UGFydGljbGVzRW1pdHRlci55ID0gdGhpcy5wb3MueTtcbiAgICAgICAgdGhpcy5ib2R5U21va2VFbWl0dGVyLnggPSB0aGlzLnBvcy54O1xuICAgICAgICB0aGlzLmJvZHlTbW9rZUVtaXR0ZXIueSA9IHRoaXMucG9zLnk7XG4gICAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBFbGVtZW50YWxEcmFnb247XG5cblxudmFyIFRpbnREcmFnb25Cb2R5QmVoYXZpb3VyID0ge307XG5cblRpbnREcmFnb25Cb2R5QmVoYXZpb3VyLnJlc2V0ID0gZnVuY3Rpb24ocGFydGljbGUpIHtcbiAgICBwYXJ0aWNsZS50aW50ID0gMHhiY2ZkZmE7XG59O1xuXG5UaW50RHJhZ29uQm9keUJlaGF2aW91ci51cGRhdGUgPSBmdW5jdGlvbihwYXJ0aWNsZSkge1xuICAgIC8vIHBhcnRpY2xlLnJvdGF0aW9uICs9IHBhcnRpY2xlLnJvdGF0aW9uU3BlZWQ7XG59O1xuXG5cbnZhciBSb3RhdGlvbkJlaGF2aW91ciA9IHt9O1xuXG5Sb3RhdGlvbkJlaGF2aW91ci5yZXNldCA9IGZ1bmN0aW9uKHBhcnRpY2xlKSB7XG4gICAgcGFydGljbGUucm90YXRpb25TcGVlZCA9IChNYXRoLnJhbmRvbSgpICogLjAxKSAtIC4wMDU7XG59O1xuXG5Sb3RhdGlvbkJlaGF2aW91ci51cGRhdGUgPSBmdW5jdGlvbihwYXJ0aWNsZSkge1xuICAgIHBhcnRpY2xlLnJvdGF0aW9uICs9IHBhcnRpY2xlLnJvdGF0aW9uU3BlZWQ7XG59OyIsIkZpcmUuY29uc3RydWN0b3IgPSBGaXJlO1xuRmlyZS5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKFBJWEkuQ29udGFpbmVyLnByb3RvdHlwZSk7XG5cbnZhciBFbWl0dGVyID0gcmVxdWlyZSgnLi8uLi9wYXJ0aWNsZS1zeXN0ZW0vZW1pdHRlci9FbWl0dGVyJyk7XG52YXIgRW1pdHRlclNldHRpbmdzID0gcmVxdWlyZSgnLi8uLi9wYXJ0aWNsZS1zeXN0ZW0vZW1pdHRlci9FbWl0dGVyU2V0dGluZ3MnKTtcbnZhciBQYXJ0aWNsZVNldHRpbmdzID0gcmVxdWlyZSgnLi8uLi9wYXJ0aWNsZS1zeXN0ZW0vcGFydGljbGUvUGFydGljbGVTZXR0aW5ncycpO1xudmFyIFRleHR1cmVHZW5lcmF0b3IgPSByZXF1aXJlKCcuLy4uL3BhcnRpY2xlLXN5c3RlbS91dGlscy9UZXh0dXJlR2VuZXJhdG9yJyk7XG52YXIgVmVsb2NpdHlCZWhhdmlvdXIgPSByZXF1aXJlKCcuLy4uL3BhcnRpY2xlLXN5c3RlbS9iZWhhdmlvdXJzL1ZlbG9jaXR5QmVoYXZpb3VyJyk7XG52YXIgTGlmZUJlaGF2aW91ciA9IHJlcXVpcmUoJy4vLi4vcGFydGljbGUtc3lzdGVtL2JlaGF2aW91cnMvTGlmZUJlaGF2aW91cicpO1xudmFyIFNwaXJhbEJlaGF2aW91ciA9IHJlcXVpcmUoJy4vLi4vcGFydGljbGUtc3lzdGVtL2JlaGF2aW91cnMvU3BpcmFsQmVoYXZpb3VyJyk7XG52YXIgR3Jhdml0eUJlaGF2aW91ciA9IHJlcXVpcmUoJy4vLi4vcGFydGljbGUtc3lzdGVtL2JlaGF2aW91cnMvR3Jhdml0eUJlaGF2aW91cicpO1xudmFyIFJvdGF0aW9uQmVoYXZpb3VyID0gcmVxdWlyZSgnLi8uLi9wYXJ0aWNsZS1zeXN0ZW0vYmVoYXZpb3Vycy9Sb3RhdGlvbkJlaGF2aW91cicpO1xudmFyIFF1aWNrUmFuZ2UgPSByZXF1aXJlKCcuLy4uL3BhcnRpY2xlLXN5c3RlbS91dGlscy9RdWlja1JhbmdlJyk7XG5cbmZ1bmN0aW9uIEZpcmUoKSB7XG4gICAgUElYSS5Db250YWluZXIuY2FsbCh0aGlzKTtcblxuICAgIHRoaXMuZW1pdHRlcnMgPSBbXTtcbn1cblxuRmlyZS5wcm90b3R5cGUuZ2V0RmxhbWVFZmZlY3QgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgcGFydGljbGVTZXR0aW5ncyA9IG5ldyBQYXJ0aWNsZVNldHRpbmdzKCk7XG4gICAgcGFydGljbGVTZXR0aW5ncy5zZXRTcGVlZCgxLCA0KTtcbiAgICBwYXJ0aWNsZVNldHRpbmdzLnNldERpcmVjdGlvbigwLCAwKTtcbiAgICBwYXJ0aWNsZVNldHRpbmdzLnNldExpZmUoNSwgMTAsIDEwLCAyMCk7XG4gICAgcGFydGljbGVTZXR0aW5ncy5zZXRTY2FsZSgyLCA0KTtcbiAgICBwYXJ0aWNsZVNldHRpbmdzLmFkZEJlaGF2aW91cihWZWxvY2l0eUJlaGF2aW91cik7XG4gICAgcGFydGljbGVTZXR0aW5ncy5hZGRCZWhhdmlvdXIoTGlmZUJlaGF2aW91cik7XG4gICAgcGFydGljbGVTZXR0aW5ncy5hZGRUZXh0dXJlKFRleHR1cmVHZW5lcmF0b3IuY2lyY2xlKDEsIDB4ZmZhYjM3LCB0cnVlKSk7XG4gICAgcGFydGljbGVTZXR0aW5ncy5hZGRUZXh0dXJlKFRleHR1cmVHZW5lcmF0b3IuY2lyY2xlKDEsIDB4ZmZmMTkxLCB0cnVlKSk7XG5cbiAgICB2YXIgZW1pdHRlclNldHRpbmdzID0gbmV3IEVtaXR0ZXJTZXR0aW5ncygpO1xuICAgIGVtaXR0ZXJTZXR0aW5ncy5zZXRRdWFudGl0eSgxNTApO1xuICAgIGVtaXR0ZXJTZXR0aW5ncy5zZXRCb3VuZHMoe3R5cGU6XCJSRUNUQU5HTEVcIiwgd2lkdGg6MzAsIGhlaWdodDoxfSk7XG4gICAgZW1pdHRlclNldHRpbmdzLnNldFJlc3Bhd24odHJ1ZSk7XG4gICAgZW1pdHRlclNldHRpbmdzLnNldFNwYXduRGVsYXkoMCwgMTAwMCk7XG5cbiAgICByZXR1cm4gbmV3IEVtaXR0ZXIodGhpcywgcGFydGljbGVTZXR0aW5ncywgZW1pdHRlclNldHRpbmdzKTtcbn07XG5cbkZpcmUucHJvdG90eXBlLmdldFNwYXJrc0VmZmVjdCA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBwYXJ0aWNsZVNldHRpbmdzID0gbmV3IFBhcnRpY2xlU2V0dGluZ3MoKTtcbiAgICBwYXJ0aWNsZVNldHRpbmdzLnNldExpZmUoNSwgNTAsIDEwLCA1MCk7XG4gICAgcGFydGljbGVTZXR0aW5ncy5zZXRTY2FsZSguMiwgMSk7XG4gICAgcGFydGljbGVTZXR0aW5ncy5zZXRHcmF2aXR5KC0xLCAtMik7XG4gICAgcGFydGljbGVTZXR0aW5ncy5hZGRCZWhhdmlvdXIoR3Jhdml0eUJlaGF2aW91cik7XG4gICAgcGFydGljbGVTZXR0aW5ncy5hZGRCZWhhdmlvdXIoU3BpcmFsQmVoYXZpb3VyKTtcbiAgICBwYXJ0aWNsZVNldHRpbmdzLmFkZEJlaGF2aW91cihMaWZlQmVoYXZpb3VyKTtcbiAgICBwYXJ0aWNsZVNldHRpbmdzLmFkZFRleHR1cmUoVGV4dHVyZUdlbmVyYXRvci5jaXJjbGUoMiwgMHhmZmFiMzcsIHRydWUpKTtcbiAgICBwYXJ0aWNsZVNldHRpbmdzLmFkZFRleHR1cmUoVGV4dHVyZUdlbmVyYXRvci5jaXJjbGUoMSwgMHhmZmZmZmYsIHRydWUpKTtcbiAgICBwYXJ0aWNsZVNldHRpbmdzLmFkZFRleHR1cmUoVGV4dHVyZUdlbmVyYXRvci5jaXJjbGUoMSwgMHhmZmZmZmYpKTtcblxuICAgIHZhciBlbWl0dGVyU2V0dGluZ3MgPSBuZXcgRW1pdHRlclNldHRpbmdzKCk7XG4gICAgZW1pdHRlclNldHRpbmdzLnNldFF1YW50aXR5KDIwKTtcbiAgICBlbWl0dGVyU2V0dGluZ3Muc2V0Qm91bmRzKHt0eXBlOlwiUkVDVEFOR0xFXCIsIHdpZHRoOjUwLCBoZWlnaHQ6MX0pO1xuICAgIGVtaXR0ZXJTZXR0aW5ncy5zZXRSZXNwYXduKHRydWUpO1xuICAgIGVtaXR0ZXJTZXR0aW5ncy5zZXRTcGF3bkRlbGF5KDAsIDIwMDApO1xuXG4gICAgcmV0dXJuIG5ldyBFbWl0dGVyKHRoaXMsIHBhcnRpY2xlU2V0dGluZ3MsIGVtaXR0ZXJTZXR0aW5ncyk7XG59O1xuXG5GaXJlLnByb3RvdHlwZS5nZXRTbW9rZUVmZmVjdCA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBwYXJ0aWNsZVNldHRpbmdzID0gbmV3IFBhcnRpY2xlU2V0dGluZ3MoKTtcbiAgICBwYXJ0aWNsZVNldHRpbmdzLnNldExpZmUoNSwgNSwgMTAwLCAyMDApO1xuICAgIHBhcnRpY2xlU2V0dGluZ3Muc2V0U2NhbGUoNSwgMTApO1xuICAgIHBhcnRpY2xlU2V0dGluZ3Muc2V0QWxwaGEoLjEsIC4zKTtcbiAgICBwYXJ0aWNsZVNldHRpbmdzLnNldEdyYXZpdHkoLTEsIC0yKTtcbiAgICBwYXJ0aWNsZVNldHRpbmdzLmFkZEJlaGF2aW91cihHcmF2aXR5QmVoYXZpb3VyKTtcbiAgICBwYXJ0aWNsZVNldHRpbmdzLmFkZEJlaGF2aW91cihSb3RhdGlvbkJlaGF2aW91cik7XG4gICAgcGFydGljbGVTZXR0aW5ncy5hZGRCZWhhdmlvdXIoTGlmZUJlaGF2aW91cik7XG4gICAgcGFydGljbGVTZXR0aW5ncy5hZGRUZXh0dXJlKFRleHR1cmVHZW5lcmF0b3IuY2lyY2xlKDEsIDB4ZmZmZmZmLCB0cnVlKSk7XG5cbiAgICB2YXIgZW1pdHRlclNldHRpbmdzID0gbmV3IEVtaXR0ZXJTZXR0aW5ncygpO1xuICAgIGVtaXR0ZXJTZXR0aW5ncy5zZXRRdWFudGl0eSg0MCk7XG4gICAgZW1pdHRlclNldHRpbmdzLnNldEJvdW5kcyh7dHlwZTpcIlJFQ1RBTkdMRVwiLCB3aWR0aDo1MCwgaGVpZ2h0OjF9KTtcbiAgICBlbWl0dGVyU2V0dGluZ3Muc2V0UmVzcGF3bih0cnVlKTtcbiAgICBlbWl0dGVyU2V0dGluZ3Muc2V0U3Bhd25EZWxheSgwLCAxMDAwKTtcblxuICAgIHJldHVybiBuZXcgRW1pdHRlcih0aGlzLCBwYXJ0aWNsZVNldHRpbmdzLCBlbWl0dGVyU2V0dGluZ3MpO1xufTtcblxuRmlyZS5wcm90b3R5cGUuc3RhcnQgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgc21va2VFZmZlY3QgPSB0aGlzLmdldFNtb2tlRWZmZWN0KCk7XG4gICAgdmFyIGZsYW1lRWZmZWN0ID0gdGhpcy5nZXRGbGFtZUVmZmVjdCgpO1xuICAgIHZhciBzcGFya0VmZmVjdCA9IHRoaXMuZ2V0U3BhcmtzRWZmZWN0KCk7XG5cbiAgICBmbGFtZUVmZmVjdC54ID0gc3BhcmtFZmZlY3QueCA9IHNtb2tlRWZmZWN0LnggPSAod2luZG93LmlubmVyV2lkdGggLyAyKSArIFF1aWNrUmFuZ2UucmFuZ2UoLTMwMCwgMzAwKTtcbiAgICBmbGFtZUVmZmVjdC55ID0gc3BhcmtFZmZlY3QueSA9IHNtb2tlRWZmZWN0LnkgPSB3aW5kb3cuaW5uZXJIZWlnaHQgLSBRdWlja1JhbmdlLnJhbmdlKDIwMCwgNDAwKTtcblxuICAgIHRoaXMuZW1pdHRlcnMucHVzaChmbGFtZUVmZmVjdCk7XG4gICAgdGhpcy5lbWl0dGVycy5wdXNoKHNwYXJrRWZmZWN0KTtcbiAgICB0aGlzLmVtaXR0ZXJzLnB1c2goc21va2VFZmZlY3QpO1xuXG4gICAgZmxhbWVFZmZlY3Quc3RhcnQoKTtcbiAgICBzcGFya0VmZmVjdC5zdGFydCgpO1xuICAgIHNtb2tlRWZmZWN0LnN0YXJ0KCk7XG59O1xuXG5GaXJlLnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbigpIHtcbiAgICBmb3IodmFyIGkgPSAwOyBpIDwgdGhpcy5lbWl0dGVycy5sZW5ndGg7IGkrKykge1xuICAgICAgICB0aGlzLmVtaXR0ZXJzW2ldLnVwZGF0ZSgpO1xuICAgIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gRmlyZTsiLCJGaXJld29yazEuY29uc3RydWN0b3IgPSBGaXJld29yazE7XG5GaXJld29yazEucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShQSVhJLkNvbnRhaW5lci5wcm90b3R5cGUpO1xuXG52YXIgRW1pdHRlciA9IHJlcXVpcmUoJy4vLi4vcGFydGljbGUtc3lzdGVtL2VtaXR0ZXIvRW1pdHRlcicpO1xudmFyIEVtaXR0ZXJTZXR0aW5ncyA9IHJlcXVpcmUoJy4vLi4vcGFydGljbGUtc3lzdGVtL2VtaXR0ZXIvRW1pdHRlclNldHRpbmdzJyk7XG52YXIgUGFydGljbGVTZXR0aW5ncyA9IHJlcXVpcmUoJy4vLi4vcGFydGljbGUtc3lzdGVtL3BhcnRpY2xlL1BhcnRpY2xlU2V0dGluZ3MnKTtcbnZhciBUZXh0dXJlR2VuZXJhdG9yID0gcmVxdWlyZSgnLi8uLi9wYXJ0aWNsZS1zeXN0ZW0vdXRpbHMvVGV4dHVyZUdlbmVyYXRvcicpO1xudmFyIFZlbG9jaXR5QmVoYXZpb3VyID0gcmVxdWlyZSgnLi8uLi9wYXJ0aWNsZS1zeXN0ZW0vYmVoYXZpb3Vycy9WZWxvY2l0eUJlaGF2aW91cicpO1xudmFyIExpZmVCZWhhdmlvdXIgPSByZXF1aXJlKCcuLy4uL3BhcnRpY2xlLXN5c3RlbS9iZWhhdmlvdXJzL0xpZmVCZWhhdmlvdXInKTtcbnZhciBSb3RhdGlvbkJlaGF2aW91ciA9IHJlcXVpcmUoJy4vLi4vcGFydGljbGUtc3lzdGVtL2JlaGF2aW91cnMvUm90YXRpb25CZWhhdmlvdXInKTtcbnZhciBXYW5kZXJCZWhhdmlvdXIgPSByZXF1aXJlKCcuLy4uL3BhcnRpY2xlLXN5c3RlbS9iZWhhdmlvdXJzL1dhbmRlckJlaGF2aW91cicpO1xudmFyIFJpcHBsZUJlaGF2aW91ciA9IHJlcXVpcmUoJy4vLi4vcGFydGljbGUtc3lzdGVtL2JlaGF2aW91cnMvUmlwcGxlQmVoYXZpb3VyJyk7XG52YXIgRmlyZXdvcmtQb3NpdGlvbnMgPSByZXF1aXJlKCcuL0ZpcmV3b3JrUG9zaXRpb25zJyk7XG52YXIgQ29tcGFjdEFycmF5ID0gcmVxdWlyZSgnLi8uLi9wYXJ0aWNsZS1zeXN0ZW0vdXRpbHMvQ29tcGFjdEFycmF5Jyk7XG5cbmZ1bmN0aW9uIEZpcmV3b3JrMSgpIHtcbiAgICBQSVhJLkNvbnRhaW5lci5jYWxsKHRoaXMpO1xuXG4gICAgdGhpcy50cmFpbEVtaXR0ZXJzID0gW107XG5cbiAgICB0aGlzLnNldHVwU21va2VFZmZlY3QoKTtcbiAgICB0aGlzLnNldHVwQnVyc3RFZmZlY3QoKTtcbn1cblxuRmlyZXdvcmsxLnByb3RvdHlwZS5zZXR1cFNtb2tlRWZmZWN0ID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHBhcnRpY2xlU2V0dGluZ3MgPSBuZXcgUGFydGljbGVTZXR0aW5ncygpO1xuICAgIHBhcnRpY2xlU2V0dGluZ3Muc2V0U3BlZWQoLjEsIC4yKTtcbiAgICBwYXJ0aWNsZVNldHRpbmdzLnNldERpcmVjdGlvbigwLCBNYXRoLlBJICogMik7XG4gICAgcGFydGljbGVTZXR0aW5ncy5zZXRMaWZlKDIwLCA0MCwgMTAsIDIwKTtcbiAgICBwYXJ0aWNsZVNldHRpbmdzLnNldEFscGhhKC4wNSwgLjE1KTtcbiAgICBwYXJ0aWNsZVNldHRpbmdzLnNldFNjYWxlKDEwLCAyMCk7XG4gICAgcGFydGljbGVTZXR0aW5ncy5hZGRCZWhhdmlvdXIoVmVsb2NpdHlCZWhhdmlvdXIpO1xuICAgIHBhcnRpY2xlU2V0dGluZ3MuYWRkQmVoYXZpb3VyKExpZmVCZWhhdmlvdXIpO1xuICAgIHBhcnRpY2xlU2V0dGluZ3MuYWRkQmVoYXZpb3VyKFJvdGF0aW9uQmVoYXZpb3VyKTtcbiAgICBwYXJ0aWNsZVNldHRpbmdzLmFkZFRleHR1cmUoVGV4dHVyZUdlbmVyYXRvci5jaXJjbGUoMiwgMHhmZmZmZmYsIHRydWUpKTtcbiAgICBwYXJ0aWNsZVNldHRpbmdzLmFkZFRleHR1cmUoVGV4dHVyZUdlbmVyYXRvci5jaXJjbGUoMiwgMHg5MWZmYTEsIHRydWUpKTtcblxuICAgIHZhciBlbWl0dGVyU2V0dGluZ3MgPSBuZXcgRW1pdHRlclNldHRpbmdzKCk7XG4gICAgZW1pdHRlclNldHRpbmdzLnNldFF1YW50aXR5KDIwKTtcbiAgICBlbWl0dGVyU2V0dGluZ3Muc2V0Qm91bmRzKHt0eXBlOlwiQ0lSQ0xFXCIsIHJhZGl1czo4MH0pO1xuXG4gICAgdGhpcy5zbW9rZUVtaXR0ZXIgPSBuZXcgRW1pdHRlcih0aGlzLCBwYXJ0aWNsZVNldHRpbmdzLCBlbWl0dGVyU2V0dGluZ3MpO1xufTtcblxuRmlyZXdvcmsxLnByb3RvdHlwZS5zZXR1cEJ1cnN0RWZmZWN0ID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHBhcnRpY2xlU2V0dGluZ3MgPSBuZXcgUGFydGljbGVTZXR0aW5ncygpO1xuICAgIHBhcnRpY2xlU2V0dGluZ3Muc2V0U3BlZWQoMiwgMik7XG4gICAgcGFydGljbGVTZXR0aW5ncy5zZXREaXJlY3Rpb24oMCwgTWF0aC5QSSAqIDIpO1xuICAgIHBhcnRpY2xlU2V0dGluZ3Muc2V0TGlmZSg0MCwgMTAwLCAwLCAwKTtcbiAgICBwYXJ0aWNsZVNldHRpbmdzLnNldFNjYWxlKC41LCAxLjUpO1xuICAgIHBhcnRpY2xlU2V0dGluZ3MuYWRkQmVoYXZpb3VyKFZlbG9jaXR5QmVoYXZpb3VyKTtcbiAgICBwYXJ0aWNsZVNldHRpbmdzLmFkZEJlaGF2aW91cihXYW5kZXJCZWhhdmlvdXIpO1xuICAgIHBhcnRpY2xlU2V0dGluZ3MuYWRkQmVoYXZpb3VyKExpZmVCZWhhdmlvdXIpO1xuICAgIHBhcnRpY2xlU2V0dGluZ3MuYWRkVGV4dHVyZShUZXh0dXJlR2VuZXJhdG9yLmNpcmNsZSgyLCAweGZmZmZmZiwgdHJ1ZSkpO1xuICAgIHBhcnRpY2xlU2V0dGluZ3MuYWRkVGV4dHVyZShUZXh0dXJlR2VuZXJhdG9yLmNpcmNsZSgyLCAweDkxZmZhMSwgdHJ1ZSkpO1xuXG4gICAgdmFyIGVtaXR0ZXJTZXR0aW5ncyA9IG5ldyBFbWl0dGVyU2V0dGluZ3MoKTtcbiAgICBlbWl0dGVyU2V0dGluZ3Muc2V0UXVhbnRpdHkoMTAwKTtcblxuICAgIHRoaXMuYnVyc3RFbWl0dGVyID0gbmV3IEVtaXR0ZXIodGhpcywgcGFydGljbGVTZXR0aW5ncywgZW1pdHRlclNldHRpbmdzKTtcbn07XG5cbkZpcmV3b3JrMS5wcm90b3R5cGUuZ2V0VHJhaWxFbWl0dGVyID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHRyYWlsUGFydGljbGVTZXR0aW5ncyA9IG5ldyBQYXJ0aWNsZVNldHRpbmdzKCk7XG4gICAgdHJhaWxQYXJ0aWNsZVNldHRpbmdzLnNldExpZmUoMywgOCwgMSwgMjApO1xuICAgIHRyYWlsUGFydGljbGVTZXR0aW5ncy5zZXRBbHBoYSguMSwgLjUpO1xuICAgIHRyYWlsUGFydGljbGVTZXR0aW5ncy5hZGRCZWhhdmlvdXIoTGlmZUJlaGF2aW91cik7XG4gICAgdHJhaWxQYXJ0aWNsZVNldHRpbmdzLmFkZFRleHR1cmUoVGV4dHVyZUdlbmVyYXRvci5jaXJjbGUoMSwgMHhmMmZmZTIsIHRydWUpKTtcbiAgICB0cmFpbFBhcnRpY2xlU2V0dGluZ3MuYWRkVGV4dHVyZShUZXh0dXJlR2VuZXJhdG9yLmNpcmNsZSgxLCAweGY1ZmZhNiwgdHJ1ZSwgNCkpO1xuICAgIHRyYWlsUGFydGljbGVTZXR0aW5ncy5hZGRUZXh0dXJlKFRleHR1cmVHZW5lcmF0b3IuY2lyY2xlKDIsIDB4ZjVmZmE2LCB0cnVlLCA4KSk7XG5cbiAgICB2YXIgdHJhaWxFbWl0dGVyU2V0dGluZ3MgPSBuZXcgRW1pdHRlclNldHRpbmdzKCk7XG4gICAgdHJhaWxFbWl0dGVyU2V0dGluZ3Muc2V0UXVhbnRpdHkoMTAwKTtcbiAgICB0cmFpbEVtaXR0ZXJTZXR0aW5ncy5zZXRSZXNwYXduKHRydWUpO1xuXG4gICAgcmV0dXJuIG5ldyBFbWl0dGVyKHRoaXMsIHRyYWlsUGFydGljbGVTZXR0aW5ncywgdHJhaWxFbWl0dGVyU2V0dGluZ3MpO1xufTtcblxuRmlyZXdvcmsxLnByb3RvdHlwZS5zdGFydCA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciB0cmFpbEVtaXR0ZXIgPSB0aGlzLmdldFRyYWlsRW1pdHRlcigpO1xuICAgIHZhciBsYXVuY2hQb3NpdGlvbiA9IEZpcmV3b3JrUG9zaXRpb25zLmxhdW5jaFBvc2l0aW9uKCk7XG4gICAgdmFyIGJ1cnN0UG9zaXRpb24gPSBGaXJld29ya1Bvc2l0aW9ucy5idXJzdFBvc2l0aW9uKCk7XG5cbiAgICB0cmFpbEVtaXR0ZXIueCA9IGxhdW5jaFBvc2l0aW9uLng7XG4gICAgdHJhaWxFbWl0dGVyLnkgPSBsYXVuY2hQb3NpdGlvbi55O1xuICAgIHRyYWlsRW1pdHRlci5zdGFydCgpO1xuXG4gICAgdGhpcy50cmFpbEVtaXR0ZXJzLnB1c2godHJhaWxFbWl0dGVyKTtcblxuICAgIHZhciBjYWxsYmFjayA9IHRoaXMudHJhaWxDb21wbGV0ZS5iaW5kKHRoaXMpO1xuXG4gICAgbmV3IFRXRUVOLlR3ZWVuKHRyYWlsRW1pdHRlcilcbiAgICAgICAgLnRvKHt4IDogYnVyc3RQb3NpdGlvbi54LCB5IDogYnVyc3RQb3NpdGlvbi55fSwgMjAwMClcbiAgICAgICAgLmVhc2luZyhUV0VFTi5FYXNpbmcuQ3ViaWMuSW4pXG4gICAgICAgIC5zdGFydCgpXG4gICAgICAgIC5vbkNvbXBsZXRlKGZ1bmN0aW9uKCl7IGNhbGxiYWNrKHRyYWlsRW1pdHRlcikgfSk7XG59O1xuXG5GaXJld29yazEucHJvdG90eXBlLnRyYWlsQ29tcGxldGUgPSBmdW5jdGlvbih0cmFpbEVtaXR0ZXIpIHtcbiAgICB0aGlzLnNtb2tlRW1pdHRlci54ID0gdGhpcy5idXJzdEVtaXR0ZXIueCA9IHRyYWlsRW1pdHRlci54O1xuICAgIHRoaXMuc21va2VFbWl0dGVyLnkgPSB0aGlzLmJ1cnN0RW1pdHRlci55ID0gdHJhaWxFbWl0dGVyLnk7XG5cbiAgICB0aGlzLnNtb2tlRW1pdHRlci5zdGFydCgpO1xuICAgIHRoaXMuYnVyc3RFbWl0dGVyLnN0YXJ0KCk7XG5cbiAgICBSaXBwbGVCZWhhdmlvdXIuc3RhcnRGbGFzaCgxNTAwKTtcbiAgICB0cmFpbEVtaXR0ZXIuc3RvcFJlc3Bhd24oKTtcbiAgICB0cmFpbEVtaXR0ZXIuc2V0RGVhZFdoZW5FbXB0eSh0cnVlKTtcbn07XG5cbkZpcmV3b3JrMS5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5zbW9rZUVtaXR0ZXIudXBkYXRlKCk7XG4gICAgdGhpcy5idXJzdEVtaXR0ZXIudXBkYXRlKCk7XG5cbiAgICB2YXIgbmVlZHNDb21wYWN0aW5nID0gZmFsc2U7XG5cbiAgICBmb3IodmFyIGkgPSAwOyBpIDwgIHRoaXMudHJhaWxFbWl0dGVycy5sZW5ndGg7IGkrKykge1xuICAgICAgICB0aGlzLnRyYWlsRW1pdHRlcnNbaV0udXBkYXRlKCk7XG5cbiAgICAgICAgaWYodGhpcy50cmFpbEVtaXR0ZXJzW2ldLmlzRGVhZCgpKSB7XG4gICAgICAgICAgICB0aGlzLnRyYWlsRW1pdHRlcnNbaV0gPSBudWxsO1xuICAgICAgICAgICAgbmVlZHNDb21wYWN0aW5nID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGlmKG5lZWRzQ29tcGFjdGluZykge1xuICAgICAgICBDb21wYWN0QXJyYXkuY29tcGFjdCh0aGlzLnRyYWlsRW1pdHRlcnMpO1xuICAgIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gRmlyZXdvcmsxOyIsIkZpcmV3b3JrMi5jb25zdHJ1Y3RvciA9IEZpcmV3b3JrMjtcbkZpcmV3b3JrMi5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKFBJWEkuQ29udGFpbmVyLnByb3RvdHlwZSk7XG5cbnZhciBFbWl0dGVyID0gcmVxdWlyZSgnLi8uLi9wYXJ0aWNsZS1zeXN0ZW0vZW1pdHRlci9FbWl0dGVyJyk7XG52YXIgRW1pdHRlclNldHRpbmdzID0gcmVxdWlyZSgnLi8uLi9wYXJ0aWNsZS1zeXN0ZW0vZW1pdHRlci9FbWl0dGVyU2V0dGluZ3MnKTtcbnZhciBQYXJ0aWNsZVNldHRpbmdzID0gcmVxdWlyZSgnLi8uLi9wYXJ0aWNsZS1zeXN0ZW0vcGFydGljbGUvUGFydGljbGVTZXR0aW5ncycpO1xudmFyIFRleHR1cmVHZW5lcmF0b3IgPSByZXF1aXJlKCcuLy4uL3BhcnRpY2xlLXN5c3RlbS91dGlscy9UZXh0dXJlR2VuZXJhdG9yJyk7XG52YXIgVmVsb2NpdHlCZWhhdmlvdXIgPSByZXF1aXJlKCcuLy4uL3BhcnRpY2xlLXN5c3RlbS9iZWhhdmlvdXJzL1ZlbG9jaXR5QmVoYXZpb3VyJyk7XG52YXIgTGlmZUJlaGF2aW91ciA9IHJlcXVpcmUoJy4vLi4vcGFydGljbGUtc3lzdGVtL2JlaGF2aW91cnMvTGlmZUJlaGF2aW91cicpO1xudmFyIFJvdGF0aW9uQmVoYXZpb3VyID0gcmVxdWlyZSgnLi8uLi9wYXJ0aWNsZS1zeXN0ZW0vYmVoYXZpb3Vycy9Sb3RhdGlvbkJlaGF2aW91cicpO1xudmFyIFNwaXJhbEJlaGF2aW91ciA9IHJlcXVpcmUoJy4vLi4vcGFydGljbGUtc3lzdGVtL2JlaGF2aW91cnMvU3BpcmFsQmVoYXZpb3VyJyk7XG52YXIgRmlyZXdvcmtQb3NpdGlvbnMgPSByZXF1aXJlKCcuL0ZpcmV3b3JrUG9zaXRpb25zJyk7XG52YXIgQ29tcGFjdEFycmF5ID0gcmVxdWlyZSgnLi8uLi9wYXJ0aWNsZS1zeXN0ZW0vdXRpbHMvQ29tcGFjdEFycmF5Jyk7XG52YXIgUmlwcGxlQmVoYXZpb3VyID0gcmVxdWlyZSgnLi8uLi9wYXJ0aWNsZS1zeXN0ZW0vYmVoYXZpb3Vycy9SaXBwbGVCZWhhdmlvdXInKTtcblxuZnVuY3Rpb24gRmlyZXdvcmsyKCkge1xuICAgIFBJWEkuQ29udGFpbmVyLmNhbGwodGhpcyk7XG5cbiAgICB0aGlzLnRyYWlsRW1pdHRlcnMgPSBbXTtcblxuICAgIHRoaXMuc2V0dXBTbW9rZUVmZmVjdCgpO1xuICAgIHRoaXMuc2V0dXBCdXJzdEVmZmVjdCgpO1xufVxuXG5GaXJld29yazIucHJvdG90eXBlLnNldHVwU21va2VFZmZlY3QgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgcGFydGljbGVTZXR0aW5ncyA9IG5ldyBQYXJ0aWNsZVNldHRpbmdzKCk7XG4gICAgcGFydGljbGVTZXR0aW5ncy5zZXRTcGVlZCguMSwgLjIpO1xuICAgIHBhcnRpY2xlU2V0dGluZ3Muc2V0RGlyZWN0aW9uKDAsIE1hdGguUEkgKiAyKTtcbiAgICBwYXJ0aWNsZVNldHRpbmdzLnNldExpZmUoMjAsIDQwLCAxMCwgMjApO1xuICAgIHBhcnRpY2xlU2V0dGluZ3Muc2V0QWxwaGEoLjA1LCAuMTUpO1xuICAgIHBhcnRpY2xlU2V0dGluZ3Muc2V0U2NhbGUoMTAsIDIwKTtcbiAgICBwYXJ0aWNsZVNldHRpbmdzLmFkZEJlaGF2aW91cihWZWxvY2l0eUJlaGF2aW91cik7XG4gICAgcGFydGljbGVTZXR0aW5ncy5hZGRCZWhhdmlvdXIoTGlmZUJlaGF2aW91cik7XG4gICAgcGFydGljbGVTZXR0aW5ncy5hZGRCZWhhdmlvdXIoUm90YXRpb25CZWhhdmlvdXIpO1xuICAgIHBhcnRpY2xlU2V0dGluZ3MuYWRkVGV4dHVyZShUZXh0dXJlR2VuZXJhdG9yLmNpcmNsZSgyLCAweGZmZmZmZiwgdHJ1ZSkpO1xuICAgIHBhcnRpY2xlU2V0dGluZ3MuYWRkVGV4dHVyZShUZXh0dXJlR2VuZXJhdG9yLmNpcmNsZSgyLCAweDgwZmZlYSwgdHJ1ZSkpO1xuICAgIHBhcnRpY2xlU2V0dGluZ3MuYWRkVGV4dHVyZShUZXh0dXJlR2VuZXJhdG9yLmNpcmNsZSgyLCAweGI1ZmZmMiwgdHJ1ZSkpO1xuICAgIHBhcnRpY2xlU2V0dGluZ3MuYWRkVGV4dHVyZShUZXh0dXJlR2VuZXJhdG9yLmNpcmNsZSgyLCAweGU3NmZmZiwgdHJ1ZSkpO1xuXG4gICAgdmFyIGVtaXR0ZXJTZXR0aW5ncyA9IG5ldyBFbWl0dGVyU2V0dGluZ3MoKTtcbiAgICBlbWl0dGVyU2V0dGluZ3Muc2V0UXVhbnRpdHkoMjApO1xuICAgIGVtaXR0ZXJTZXR0aW5ncy5zZXRCb3VuZHMoe3R5cGU6XCJDSVJDTEVcIiwgcmFkaXVzOjgwfSk7XG5cbiAgICB0aGlzLnNtb2tlRW1pdHRlciA9IG5ldyBFbWl0dGVyKHRoaXMsIHBhcnRpY2xlU2V0dGluZ3MsIGVtaXR0ZXJTZXR0aW5ncyk7XG59O1xuXG5GaXJld29yazIucHJvdG90eXBlLnNldHVwQnVyc3RFZmZlY3QgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgcGFydGljbGVTZXR0aW5ncyA9IG5ldyBQYXJ0aWNsZVNldHRpbmdzKCk7XG4gICAgcGFydGljbGVTZXR0aW5ncy5zZXRMaWZlKDEwMCwgMTUwLCAyMCwgNDApO1xuICAgIHBhcnRpY2xlU2V0dGluZ3MuYWRkQmVoYXZpb3VyKFNwaXJhbEJlaGF2aW91cik7XG4gICAgcGFydGljbGVTZXR0aW5ncy5hZGRCZWhhdmlvdXIoTGlmZUJlaGF2aW91cik7XG4gICAgcGFydGljbGVTZXR0aW5ncy5hZGRUZXh0dXJlKFRleHR1cmVHZW5lcmF0b3IuY2lyY2xlKDIsIDB4ODBmZmVhLCB0cnVlKSk7XG4gICAgcGFydGljbGVTZXR0aW5ncy5hZGRUZXh0dXJlKFRleHR1cmVHZW5lcmF0b3IuY2lyY2xlKDIsIDB4YjVmZmYyLCB0cnVlKSk7XG4gICAgcGFydGljbGVTZXR0aW5ncy5hZGRUZXh0dXJlKFRleHR1cmVHZW5lcmF0b3IuY2lyY2xlKDIsIDB4RkZGRkZGLCB0cnVlKSk7XG5cbiAgICB2YXIgZW1pdHRlclNldHRpbmdzID0gbmV3IEVtaXR0ZXJTZXR0aW5ncygpO1xuICAgIGVtaXR0ZXJTZXR0aW5ncy5zZXRRdWFudGl0eSg4MCk7XG4gICAgZW1pdHRlclNldHRpbmdzLnNldFNwYXduRGVsYXkoMCwgMTAwMCk7XG5cbiAgICB0aGlzLmJ1cnN0RW1pdHRlciA9IG5ldyBFbWl0dGVyKHRoaXMsIHBhcnRpY2xlU2V0dGluZ3MsIGVtaXR0ZXJTZXR0aW5ncyk7XG59O1xuXG5GaXJld29yazIucHJvdG90eXBlLmdldFRyYWlsRW1pdHRlciA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciB0cmFpbFBhcnRpY2xlU2V0dGluZ3MgPSBuZXcgUGFydGljbGVTZXR0aW5ncygpO1xuICAgIHRyYWlsUGFydGljbGVTZXR0aW5ncy5zZXRMaWZlKDMsIDgsIDEsIDIwKTtcbiAgICB0cmFpbFBhcnRpY2xlU2V0dGluZ3Muc2V0QWxwaGEoLjEsIC41KTtcbiAgICB0cmFpbFBhcnRpY2xlU2V0dGluZ3MuYWRkQmVoYXZpb3VyKExpZmVCZWhhdmlvdXIpO1xuICAgIHRyYWlsUGFydGljbGVTZXR0aW5ncy5hZGRUZXh0dXJlKFRleHR1cmVHZW5lcmF0b3IuY2lyY2xlKDEsIDB4ODBmZmVhLCB0cnVlKSk7XG4gICAgdHJhaWxQYXJ0aWNsZVNldHRpbmdzLmFkZFRleHR1cmUoVGV4dHVyZUdlbmVyYXRvci5jaXJjbGUoMSwgMHhiNWZmZjIsIHRydWUsIDQpKTtcbiAgICB0cmFpbFBhcnRpY2xlU2V0dGluZ3MuYWRkVGV4dHVyZShUZXh0dXJlR2VuZXJhdG9yLmNpcmNsZSgyLCAweEZGRkZGRiwgdHJ1ZSwgOCkpO1xuXG4gICAgdmFyIHRyYWlsRW1pdHRlclNldHRpbmdzID0gbmV3IEVtaXR0ZXJTZXR0aW5ncygpO1xuICAgIHRyYWlsRW1pdHRlclNldHRpbmdzLnNldFF1YW50aXR5KDEwMCk7XG4gICAgdHJhaWxFbWl0dGVyU2V0dGluZ3Muc2V0UmVzcGF3bih0cnVlKTtcblxuICAgIHJldHVybiBuZXcgRW1pdHRlcih0aGlzLCB0cmFpbFBhcnRpY2xlU2V0dGluZ3MsIHRyYWlsRW1pdHRlclNldHRpbmdzKTtcbn07XG5cblxuRmlyZXdvcmsyLnByb3RvdHlwZS5zdGFydCA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciB0cmFpbEVtaXR0ZXIgPSB0aGlzLmdldFRyYWlsRW1pdHRlcigpO1xuICAgIHZhciBsYXVuY2hQb3NpdGlvbiA9IEZpcmV3b3JrUG9zaXRpb25zLmxhdW5jaFBvc2l0aW9uKCk7XG4gICAgdmFyIGJ1cnN0UG9zaXRpb24gPSBGaXJld29ya1Bvc2l0aW9ucy5idXJzdFBvc2l0aW9uKCk7XG5cbiAgICB0cmFpbEVtaXR0ZXIueCA9IGxhdW5jaFBvc2l0aW9uLng7XG4gICAgdHJhaWxFbWl0dGVyLnkgPSBsYXVuY2hQb3NpdGlvbi55O1xuICAgIHRyYWlsRW1pdHRlci5zdGFydCgpO1xuXG4gICAgdGhpcy50cmFpbEVtaXR0ZXJzLnB1c2godHJhaWxFbWl0dGVyKTtcblxuICAgIHZhciBjYWxsYmFjayA9IHRoaXMudHJhaWxDb21wbGV0ZS5iaW5kKHRoaXMpO1xuXG4gICAgbmV3IFRXRUVOLlR3ZWVuKHRyYWlsRW1pdHRlcilcbiAgICAgICAgLnRvKHt4IDogYnVyc3RQb3NpdGlvbi54LCB5IDogYnVyc3RQb3NpdGlvbi55fSwgMjAwMClcbiAgICAgICAgLmVhc2luZyhUV0VFTi5FYXNpbmcuQ3ViaWMuSW4pXG4gICAgICAgIC5zdGFydCgpXG4gICAgICAgIC5vbkNvbXBsZXRlKGZ1bmN0aW9uKCl7IGNhbGxiYWNrKHRyYWlsRW1pdHRlcikgfSk7XG59O1xuXG5GaXJld29yazIucHJvdG90eXBlLnRyYWlsQ29tcGxldGUgPSBmdW5jdGlvbih0cmFpbEVtaXR0ZXIpIHtcbiAgICB0aGlzLnNtb2tlRW1pdHRlci54ID0gdGhpcy5idXJzdEVtaXR0ZXIueCA9IHRyYWlsRW1pdHRlci54O1xuICAgIHRoaXMuc21va2VFbWl0dGVyLnkgPSB0aGlzLmJ1cnN0RW1pdHRlci55ID0gdHJhaWxFbWl0dGVyLnk7XG5cbiAgICB0aGlzLnNtb2tlRW1pdHRlci5zdGFydCgpO1xuICAgIHRoaXMuYnVyc3RFbWl0dGVyLnN0YXJ0KCk7XG5cbiAgICBSaXBwbGVCZWhhdmlvdXIuc3RhcnRGbGFzaCgxNTAwKTtcbiAgICB0cmFpbEVtaXR0ZXIuc3RvcFJlc3Bhd24oKTtcbiAgICB0cmFpbEVtaXR0ZXIuc2V0RGVhZFdoZW5FbXB0eSh0cnVlKTtcbn07XG5cbkZpcmV3b3JrMi5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5zbW9rZUVtaXR0ZXIudXBkYXRlKCk7XG4gICAgdGhpcy5idXJzdEVtaXR0ZXIudXBkYXRlKCk7XG5cbiAgICB2YXIgbmVlZHNDb21wYWN0aW5nID0gZmFsc2U7XG5cbiAgICBmb3IodmFyIGkgPSAwOyBpIDwgIHRoaXMudHJhaWxFbWl0dGVycy5sZW5ndGg7IGkrKykge1xuICAgICAgICB0aGlzLnRyYWlsRW1pdHRlcnNbaV0udXBkYXRlKCk7XG5cbiAgICAgICAgaWYodGhpcy50cmFpbEVtaXR0ZXJzW2ldLmlzRGVhZCgpKSB7XG4gICAgICAgICAgICB0aGlzLnRyYWlsRW1pdHRlcnNbaV0gPSBudWxsO1xuICAgICAgICAgICAgbmVlZHNDb21wYWN0aW5nID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGlmKG5lZWRzQ29tcGFjdGluZykge1xuICAgICAgICBDb21wYWN0QXJyYXkuY29tcGFjdCh0aGlzLnRyYWlsRW1pdHRlcnMpO1xuICAgIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gRmlyZXdvcmsyOyIsIkZpcmV3b3JrMy5jb25zdHJ1Y3RvciA9IEZpcmV3b3JrMztcbkZpcmV3b3JrMy5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKFBJWEkuQ29udGFpbmVyLnByb3RvdHlwZSk7XG5cbnZhciBFbWl0dGVyID0gcmVxdWlyZSgnLi8uLi9wYXJ0aWNsZS1zeXN0ZW0vZW1pdHRlci9FbWl0dGVyJyk7XG52YXIgRW1pdHRlclNldHRpbmdzID0gcmVxdWlyZSgnLi8uLi9wYXJ0aWNsZS1zeXN0ZW0vZW1pdHRlci9FbWl0dGVyU2V0dGluZ3MnKTtcbnZhciBQYXJ0aWNsZVNldHRpbmdzID0gcmVxdWlyZSgnLi8uLi9wYXJ0aWNsZS1zeXN0ZW0vcGFydGljbGUvUGFydGljbGVTZXR0aW5ncycpO1xudmFyIFRleHR1cmVHZW5lcmF0b3IgPSByZXF1aXJlKCcuLy4uL3BhcnRpY2xlLXN5c3RlbS91dGlscy9UZXh0dXJlR2VuZXJhdG9yJyk7XG52YXIgVmVsb2NpdHlCZWhhdmlvdXIgPSByZXF1aXJlKCcuLy4uL3BhcnRpY2xlLXN5c3RlbS9iZWhhdmlvdXJzL1ZlbG9jaXR5QmVoYXZpb3VyJyk7XG52YXIgTGlmZUJlaGF2aW91ciA9IHJlcXVpcmUoJy4vLi4vcGFydGljbGUtc3lzdGVtL2JlaGF2aW91cnMvTGlmZUJlaGF2aW91cicpO1xudmFyIFJvdGF0aW9uQmVoYXZpb3VyID0gcmVxdWlyZSgnLi8uLi9wYXJ0aWNsZS1zeXN0ZW0vYmVoYXZpb3Vycy9Sb3RhdGlvbkJlaGF2aW91cicpO1xudmFyIERlY2F5QmVoYXZpb3VyID0gcmVxdWlyZSgnLi8uLi9wYXJ0aWNsZS1zeXN0ZW0vYmVoYXZpb3Vycy9EZWNheUJlaGF2aW91cicpO1xudmFyIEZpcmV3b3JrUG9zaXRpb25zID0gcmVxdWlyZSgnLi9GaXJld29ya1Bvc2l0aW9ucycpO1xudmFyIENvbXBhY3RBcnJheSA9IHJlcXVpcmUoJy4vLi4vcGFydGljbGUtc3lzdGVtL3V0aWxzL0NvbXBhY3RBcnJheScpO1xudmFyIFJpcHBsZUJlaGF2aW91ciA9IHJlcXVpcmUoJy4vLi4vcGFydGljbGUtc3lzdGVtL2JlaGF2aW91cnMvUmlwcGxlQmVoYXZpb3VyJyk7XG5cbmZ1bmN0aW9uIEZpcmV3b3JrMygpIHtcbiAgICBQSVhJLkNvbnRhaW5lci5jYWxsKHRoaXMpO1xuXG4gICAgdGhpcy50cmFpbEVtaXR0ZXJzID0gW107XG5cbiAgICB0aGlzLnNldHVwU21va2VFZmZlY3QoKTtcbiAgICB0aGlzLnNldHVwQnVyc3RFZmZlY3QoKTtcbn1cblxuRmlyZXdvcmszLnByb3RvdHlwZS5zZXR1cFNtb2tlRWZmZWN0ID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHBhcnRpY2xlU2V0dGluZ3MgPSBuZXcgUGFydGljbGVTZXR0aW5ncygpO1xuICAgIHBhcnRpY2xlU2V0dGluZ3Muc2V0U3BlZWQoLjEsIC4yKTtcbiAgICBwYXJ0aWNsZVNldHRpbmdzLnNldERpcmVjdGlvbigwLCBNYXRoLlBJICogMik7XG4gICAgcGFydGljbGVTZXR0aW5ncy5zZXRMaWZlKDIwLCA0MCwgMTAsIDIwKTtcbiAgICBwYXJ0aWNsZVNldHRpbmdzLnNldEFscGhhKC4wNSwgLjE1KTtcbiAgICBwYXJ0aWNsZVNldHRpbmdzLnNldFNjYWxlKDEwLCAxNSk7XG4gICAgcGFydGljbGVTZXR0aW5ncy5hZGRCZWhhdmlvdXIoVmVsb2NpdHlCZWhhdmlvdXIpO1xuICAgIHBhcnRpY2xlU2V0dGluZ3MuYWRkQmVoYXZpb3VyKExpZmVCZWhhdmlvdXIpO1xuICAgIHBhcnRpY2xlU2V0dGluZ3MuYWRkQmVoYXZpb3VyKFJvdGF0aW9uQmVoYXZpb3VyKTtcbiAgICBwYXJ0aWNsZVNldHRpbmdzLmFkZFRleHR1cmUoVGV4dHVyZUdlbmVyYXRvci5jaXJjbGUoMywgMHhjY2ZmZmYsIGZhbHNlLCAyKSk7XG4gICAgcGFydGljbGVTZXR0aW5ncy5hZGRUZXh0dXJlKFRleHR1cmVHZW5lcmF0b3IuY2lyY2xlKDMsIDB4ZmYxMWZmLCB0cnVlLCAyKSk7XG4gICAgcGFydGljbGVTZXR0aW5ncy5hZGRUZXh0dXJlKFRleHR1cmVHZW5lcmF0b3IuY2lyY2xlKDMsIDB4ZmZmZjExLCBmYWxzZSwgMikpO1xuXG4gICAgdmFyIGVtaXR0ZXJTZXR0aW5ncyA9IG5ldyBFbWl0dGVyU2V0dGluZ3MoKTtcbiAgICBlbWl0dGVyU2V0dGluZ3Muc2V0UXVhbnRpdHkoMjApO1xuICAgIGVtaXR0ZXJTZXR0aW5ncy5zZXRCb3VuZHMoe3R5cGU6XCJDSVJDTEVcIiwgcmFkaXVzOjgwfSk7XG5cbiAgICB0aGlzLnNtb2tlRW1pdHRlciA9IG5ldyBFbWl0dGVyKHRoaXMsIHBhcnRpY2xlU2V0dGluZ3MsIGVtaXR0ZXJTZXR0aW5ncyk7XG59O1xuXG5GaXJld29yazMucHJvdG90eXBlLnNldHVwQnVyc3RFZmZlY3QgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgcGFydGljbGVTZXR0aW5ncyA9IG5ldyBQYXJ0aWNsZVNldHRpbmdzKCk7XG4gICAgcGFydGljbGVTZXR0aW5ncy5zZXRTcGVlZCgxLCA1KTtcbiAgICBwYXJ0aWNsZVNldHRpbmdzLnNldERpcmVjdGlvbigwLCBNYXRoLlBJICogMik7XG4gICAgcGFydGljbGVTZXR0aW5ncy5zZXRMaWZlKDQwLCA4MCwgMTAsIDQwKTtcbiAgICBwYXJ0aWNsZVNldHRpbmdzLnNldFNjYWxlKC40LCAxKTtcbiAgICBwYXJ0aWNsZVNldHRpbmdzLnNldERlY2F5KC45NSwgLjk1KTtcbiAgICBwYXJ0aWNsZVNldHRpbmdzLnNldEdyYXZpdHkoLjUsIDEpO1xuICAgIHBhcnRpY2xlU2V0dGluZ3MuYWRkQmVoYXZpb3VyKFZlbG9jaXR5QmVoYXZpb3VyKTtcbiAgICBwYXJ0aWNsZVNldHRpbmdzLmFkZEJlaGF2aW91cihMaWZlQmVoYXZpb3VyKTtcbiAgICBwYXJ0aWNsZVNldHRpbmdzLmFkZEJlaGF2aW91cihEZWNheUJlaGF2aW91cik7XG4gICAgcGFydGljbGVTZXR0aW5ncy5hZGRUZXh0dXJlKFRleHR1cmVHZW5lcmF0b3IuY2lyY2xlKDMsIDB4ZGRmZmZmLCB0cnVlKSk7XG4gICAgcGFydGljbGVTZXR0aW5ncy5hZGRUZXh0dXJlKFRleHR1cmVHZW5lcmF0b3IuY2lyY2xlKDMsIDB4ZmZmZmZmLCB0cnVlKSk7XG4gICAgcGFydGljbGVTZXR0aW5ncy5hZGRUZXh0dXJlKFRleHR1cmVHZW5lcmF0b3IuY2lyY2xlKDMsIDB4ZmZkZGZmLCB0cnVlKSk7XG4gICAgcGFydGljbGVTZXR0aW5ncy5hZGRUZXh0dXJlKFRleHR1cmVHZW5lcmF0b3IuY2lyY2xlKDMsIDB4ZmZmZmRkLCB0cnVlKSk7XG5cbiAgICB2YXIgZW1pdHRlclNldHRpbmdzID0gbmV3IEVtaXR0ZXJTZXR0aW5ncygpO1xuICAgIGVtaXR0ZXJTZXR0aW5ncy5zZXRRdWFudGl0eSgxMDApO1xuXG4gICAgdGhpcy5idXJzdEVtaXR0ZXIgPSBuZXcgRW1pdHRlcih0aGlzLCBwYXJ0aWNsZVNldHRpbmdzLCBlbWl0dGVyU2V0dGluZ3MpO1xufTtcblxuRmlyZXdvcmszLnByb3RvdHlwZS5nZXRUcmFpbEVtaXR0ZXIgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgdHJhaWxQYXJ0aWNsZVNldHRpbmdzID0gbmV3IFBhcnRpY2xlU2V0dGluZ3MoKTtcbiAgICB0cmFpbFBhcnRpY2xlU2V0dGluZ3Muc2V0TGlmZSgzLCA4LCAxLCAyMCk7XG4gICAgdHJhaWxQYXJ0aWNsZVNldHRpbmdzLnNldEFscGhhKC4xLCAuNSk7XG4gICAgdHJhaWxQYXJ0aWNsZVNldHRpbmdzLmFkZEJlaGF2aW91cihMaWZlQmVoYXZpb3VyKTtcbiAgICB0cmFpbFBhcnRpY2xlU2V0dGluZ3MuYWRkVGV4dHVyZShUZXh0dXJlR2VuZXJhdG9yLmNpcmNsZSgxLCAweGYyZmZlMiwgdHJ1ZSkpO1xuICAgIHRyYWlsUGFydGljbGVTZXR0aW5ncy5hZGRUZXh0dXJlKFRleHR1cmVHZW5lcmF0b3IuY2lyY2xlKDEsIDB4ZjVmZmE2LCB0cnVlLCA0KSk7XG4gICAgdHJhaWxQYXJ0aWNsZVNldHRpbmdzLmFkZFRleHR1cmUoVGV4dHVyZUdlbmVyYXRvci5jaXJjbGUoMiwgMHhmNWZmYTYsIHRydWUsIDgpKTtcblxuICAgIHZhciB0cmFpbEVtaXR0ZXJTZXR0aW5ncyA9IG5ldyBFbWl0dGVyU2V0dGluZ3MoKTtcbiAgICB0cmFpbEVtaXR0ZXJTZXR0aW5ncy5zZXRRdWFudGl0eSgxMDApO1xuICAgIHRyYWlsRW1pdHRlclNldHRpbmdzLnNldFJlc3Bhd24odHJ1ZSk7XG5cbiAgICByZXR1cm4gbmV3IEVtaXR0ZXIodGhpcywgdHJhaWxQYXJ0aWNsZVNldHRpbmdzLCB0cmFpbEVtaXR0ZXJTZXR0aW5ncyk7XG59O1xuXG5GaXJld29yazMucHJvdG90eXBlLnN0YXJ0ID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHRyYWlsRW1pdHRlciA9IHRoaXMuZ2V0VHJhaWxFbWl0dGVyKCk7XG4gICAgdmFyIGxhdW5jaFBvc2l0aW9uID0gRmlyZXdvcmtQb3NpdGlvbnMubGF1bmNoUG9zaXRpb24oKTtcbiAgICB2YXIgYnVyc3RQb3NpdGlvbiA9IEZpcmV3b3JrUG9zaXRpb25zLmJ1cnN0UG9zaXRpb24oKTtcblxuICAgIHRyYWlsRW1pdHRlci54ID0gbGF1bmNoUG9zaXRpb24ueDtcbiAgICB0cmFpbEVtaXR0ZXIueSA9IGxhdW5jaFBvc2l0aW9uLnk7XG4gICAgdHJhaWxFbWl0dGVyLnN0YXJ0KCk7XG5cbiAgICB0aGlzLnRyYWlsRW1pdHRlcnMucHVzaCh0cmFpbEVtaXR0ZXIpO1xuXG4gICAgdmFyIGNhbGxiYWNrID0gdGhpcy50cmFpbENvbXBsZXRlLmJpbmQodGhpcyk7XG5cbiAgICBuZXcgVFdFRU4uVHdlZW4odHJhaWxFbWl0dGVyKVxuICAgICAgICAudG8oe3ggOiBidXJzdFBvc2l0aW9uLngsIHkgOiBidXJzdFBvc2l0aW9uLnl9LCAyMDAwKVxuICAgICAgICAuZWFzaW5nKFRXRUVOLkVhc2luZy5DdWJpYy5JbilcbiAgICAgICAgLnN0YXJ0KClcbiAgICAgICAgLm9uQ29tcGxldGUoZnVuY3Rpb24oKXsgY2FsbGJhY2sodHJhaWxFbWl0dGVyKSB9KTtcbn07XG5cbkZpcmV3b3JrMy5wcm90b3R5cGUudHJhaWxDb21wbGV0ZSA9IGZ1bmN0aW9uKHRyYWlsRW1pdHRlcikge1xuICAgIHRoaXMuc21va2VFbWl0dGVyLnggPSB0aGlzLmJ1cnN0RW1pdHRlci54ID0gdHJhaWxFbWl0dGVyLng7XG4gICAgdGhpcy5zbW9rZUVtaXR0ZXIueSA9IHRoaXMuYnVyc3RFbWl0dGVyLnkgPSB0cmFpbEVtaXR0ZXIueTtcblxuICAgIHRoaXMuc21va2VFbWl0dGVyLnN0YXJ0KCk7XG4gICAgdGhpcy5idXJzdEVtaXR0ZXIuc3RhcnQoKTtcblxuICAgIFJpcHBsZUJlaGF2aW91ci5zdGFydEZsYXNoKDE1MDApO1xuICAgIHRyYWlsRW1pdHRlci5zdG9wUmVzcGF3bigpO1xuICAgIHRyYWlsRW1pdHRlci5zZXREZWFkV2hlbkVtcHR5KHRydWUpO1xufTtcblxuRmlyZXdvcmszLnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnNtb2tlRW1pdHRlci51cGRhdGUoKTtcbiAgICB0aGlzLmJ1cnN0RW1pdHRlci51cGRhdGUoKTtcblxuICAgIHZhciBuZWVkc0NvbXBhY3RpbmcgPSBmYWxzZTtcblxuICAgIGZvcih2YXIgaSA9IDA7IGkgPCAgdGhpcy50cmFpbEVtaXR0ZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHRoaXMudHJhaWxFbWl0dGVyc1tpXS51cGRhdGUoKTtcblxuICAgICAgICBpZih0aGlzLnRyYWlsRW1pdHRlcnNbaV0uaXNEZWFkKCkpIHtcbiAgICAgICAgICAgIHRoaXMudHJhaWxFbWl0dGVyc1tpXSA9IG51bGw7XG4gICAgICAgICAgICBuZWVkc0NvbXBhY3RpbmcgPSB0cnVlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgaWYobmVlZHNDb21wYWN0aW5nKSB7XG4gICAgICAgIENvbXBhY3RBcnJheS5jb21wYWN0KHRoaXMudHJhaWxFbWl0dGVycyk7XG4gICAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBGaXJld29yazM7IiwiRmlyZXdvcms0LmNvbnN0cnVjdG9yID0gRmlyZXdvcms0O1xuRmlyZXdvcms0LnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoUElYSS5Db250YWluZXIucHJvdG90eXBlKTtcblxudmFyIEVtaXR0ZXIgPSByZXF1aXJlKCcuLy4uL3BhcnRpY2xlLXN5c3RlbS9lbWl0dGVyL0VtaXR0ZXInKTtcbnZhciBFbWl0dGVyU2V0dGluZ3MgPSByZXF1aXJlKCcuLy4uL3BhcnRpY2xlLXN5c3RlbS9lbWl0dGVyL0VtaXR0ZXJTZXR0aW5ncycpO1xudmFyIFBhcnRpY2xlU2V0dGluZ3MgPSByZXF1aXJlKCcuLy4uL3BhcnRpY2xlLXN5c3RlbS9wYXJ0aWNsZS9QYXJ0aWNsZVNldHRpbmdzJyk7XG52YXIgVGV4dHVyZUdlbmVyYXRvciA9IHJlcXVpcmUoJy4vLi4vcGFydGljbGUtc3lzdGVtL3V0aWxzL1RleHR1cmVHZW5lcmF0b3InKTtcbnZhciBWZWxvY2l0eUJlaGF2aW91ciA9IHJlcXVpcmUoJy4vLi4vcGFydGljbGUtc3lzdGVtL2JlaGF2aW91cnMvVmVsb2NpdHlCZWhhdmlvdXInKTtcbnZhciBMaWZlQmVoYXZpb3VyID0gcmVxdWlyZSgnLi8uLi9wYXJ0aWNsZS1zeXN0ZW0vYmVoYXZpb3Vycy9MaWZlQmVoYXZpb3VyJyk7XG52YXIgR3Jhdml0eUJlaGF2aW91ciA9IHJlcXVpcmUoJy4vLi4vcGFydGljbGUtc3lzdGVtL2JlaGF2aW91cnMvR3Jhdml0eUJlaGF2aW91cicpO1xudmFyIFJvdGF0aW9uQmVoYXZpb3VyID0gcmVxdWlyZSgnLi8uLi9wYXJ0aWNsZS1zeXN0ZW0vYmVoYXZpb3Vycy9Sb3RhdGlvbkJlaGF2aW91cicpO1xudmFyIERlY2F5QmVoYXZpb3VyID0gcmVxdWlyZSgnLi8uLi9wYXJ0aWNsZS1zeXN0ZW0vYmVoYXZpb3Vycy9EZWNheUJlaGF2aW91cicpO1xudmFyIEZpcmV3b3JrUG9zaXRpb25zID0gcmVxdWlyZSgnLi9GaXJld29ya1Bvc2l0aW9ucycpO1xudmFyIENvbXBhY3RBcnJheSA9IHJlcXVpcmUoJy4vLi4vcGFydGljbGUtc3lzdGVtL3V0aWxzL0NvbXBhY3RBcnJheScpO1xudmFyIFJpcHBsZUJlaGF2aW91ciA9IHJlcXVpcmUoJy4vLi4vcGFydGljbGUtc3lzdGVtL2JlaGF2aW91cnMvUmlwcGxlQmVoYXZpb3VyJyk7XG5cbmZ1bmN0aW9uIEZpcmV3b3JrNCgpIHtcbiAgICBQSVhJLkNvbnRhaW5lci5jYWxsKHRoaXMpO1xuXG4gICAgdGhpcy50cmFpbEVtaXR0ZXJzID0gW107XG5cbiAgICB0aGlzLnNldHVwU21va2VFZmZlY3QoKTtcbiAgICB0aGlzLnNldHVwQnVyc3RFZmZlY3QoKTtcbn1cblxuRmlyZXdvcms0LnByb3RvdHlwZS5zZXR1cFNtb2tlRWZmZWN0ID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHBhcnRpY2xlU2V0dGluZ3MgPSBuZXcgUGFydGljbGVTZXR0aW5ncygpO1xuICAgIHBhcnRpY2xlU2V0dGluZ3Muc2V0U3BlZWQoLjEsIC4yKTtcbiAgICBwYXJ0aWNsZVNldHRpbmdzLnNldERpcmVjdGlvbigwLCBNYXRoLlBJICogMik7XG4gICAgcGFydGljbGVTZXR0aW5ncy5zZXRMaWZlKDIwLCA0MCwgMTAsIDIwKTtcbiAgICBwYXJ0aWNsZVNldHRpbmdzLnNldEFscGhhKC4xLCAuMik7XG4gICAgcGFydGljbGVTZXR0aW5ncy5zZXRTY2FsZSgxMCwgMTUpO1xuICAgIHBhcnRpY2xlU2V0dGluZ3MuYWRkQmVoYXZpb3VyKFZlbG9jaXR5QmVoYXZpb3VyKTtcbiAgICBwYXJ0aWNsZVNldHRpbmdzLmFkZEJlaGF2aW91cihMaWZlQmVoYXZpb3VyKTtcbiAgICBwYXJ0aWNsZVNldHRpbmdzLmFkZEJlaGF2aW91cihSb3RhdGlvbkJlaGF2aW91cik7XG4gICAgcGFydGljbGVTZXR0aW5ncy5hZGRUZXh0dXJlKFRleHR1cmVHZW5lcmF0b3IuY2lyY2xlKDMsIDB4ZmZmZmZmLCBmYWxzZSwgMikpO1xuICAgIHBhcnRpY2xlU2V0dGluZ3MuYWRkVGV4dHVyZShUZXh0dXJlR2VuZXJhdG9yLmNpcmNsZSgzLCAweGMzZThiZSwgdHJ1ZSwgMikpO1xuICAgIHBhcnRpY2xlU2V0dGluZ3MuYWRkVGV4dHVyZShUZXh0dXJlR2VuZXJhdG9yLmNpcmNsZSgzLCAweGJkZmFiMCwgZmFsc2UsIDIpKTtcbiAgICBwYXJ0aWNsZVNldHRpbmdzLmFkZFRleHR1cmUoVGV4dHVyZUdlbmVyYXRvci5jaXJjbGUoMywgMHhjYWY5NzcsIGZhbHNlLCAyKSk7XG4gICAgcGFydGljbGVTZXR0aW5ncy5hZGRUZXh0dXJlKFRleHR1cmVHZW5lcmF0b3IuY2lyY2xlKDMsIDB4NWFmYTliLCBmYWxzZSwgMikpO1xuXG4gICAgdmFyIGVtaXR0ZXJTZXR0aW5ncyA9IG5ldyBFbWl0dGVyU2V0dGluZ3MoKTtcbiAgICBlbWl0dGVyU2V0dGluZ3Muc2V0UXVhbnRpdHkoMjApO1xuICAgIGVtaXR0ZXJTZXR0aW5ncy5zZXRCb3VuZHMoe3R5cGU6XCJDSVJDTEVcIiwgcmFkaXVzOjEyMH0pO1xuXG4gICAgdGhpcy5zbW9rZUVtaXR0ZXIgPSBuZXcgRW1pdHRlcih0aGlzLCBwYXJ0aWNsZVNldHRpbmdzLCBlbWl0dGVyU2V0dGluZ3MpO1xufTtcblxuRmlyZXdvcms0LnByb3RvdHlwZS5zZXR1cEJ1cnN0RWZmZWN0ID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHBhcnRpY2xlU2V0dGluZ3MgPSBuZXcgUGFydGljbGVTZXR0aW5ncygpO1xuICAgIHBhcnRpY2xlU2V0dGluZ3Muc2V0U3BlZWQoMiwgMTUpO1xuICAgIHBhcnRpY2xlU2V0dGluZ3Muc2V0RGlyZWN0aW9uKDAsIE1hdGguUEkgKiAyKTtcbiAgICBwYXJ0aWNsZVNldHRpbmdzLnNldExpZmUoMzAsIDYwLCAxMCwgMzApO1xuICAgIHBhcnRpY2xlU2V0dGluZ3Muc2V0U2NhbGUoLjQsIDEuMik7XG4gICAgcGFydGljbGVTZXR0aW5ncy5zZXREZWNheSguOTEsIC45MSk7XG4gICAgcGFydGljbGVTZXR0aW5ncy5zZXRHcmF2aXR5KC4xLCAxKTtcbiAgICBwYXJ0aWNsZVNldHRpbmdzLmFkZEJlaGF2aW91cihWZWxvY2l0eUJlaGF2aW91cik7XG4gICAgcGFydGljbGVTZXR0aW5ncy5hZGRCZWhhdmlvdXIoTGlmZUJlaGF2aW91cik7XG4gICAgcGFydGljbGVTZXR0aW5ncy5hZGRCZWhhdmlvdXIoR3Jhdml0eUJlaGF2aW91cik7XG4gICAgcGFydGljbGVTZXR0aW5ncy5hZGRCZWhhdmlvdXIoRGVjYXlCZWhhdmlvdXIpO1xuICAgIHBhcnRpY2xlU2V0dGluZ3MuYWRkVGV4dHVyZShUZXh0dXJlR2VuZXJhdG9yLmNpcmNsZSgzLCAweGMzZThiZSwgdHJ1ZSkpO1xuICAgIHBhcnRpY2xlU2V0dGluZ3MuYWRkVGV4dHVyZShUZXh0dXJlR2VuZXJhdG9yLmNpcmNsZSgzLCAweGJkZmFiMCwgdHJ1ZSkpO1xuICAgIHBhcnRpY2xlU2V0dGluZ3MuYWRkVGV4dHVyZShUZXh0dXJlR2VuZXJhdG9yLmNpcmNsZSgzLCAweGNhZjk3NywgdHJ1ZSkpO1xuXG4gICAgdmFyIGVtaXR0ZXJTZXR0aW5ncyA9IG5ldyBFbWl0dGVyU2V0dGluZ3MoKTtcbiAgICBlbWl0dGVyU2V0dGluZ3Muc2V0UXVhbnRpdHkoMTAwKTtcblxuICAgIHRoaXMuYnVyc3RFbWl0dGVyID0gbmV3IEVtaXR0ZXIodGhpcywgcGFydGljbGVTZXR0aW5ncywgZW1pdHRlclNldHRpbmdzKTtcbn07XG5cbkZpcmV3b3JrNC5wcm90b3R5cGUuZ2V0U3BhcmtsZUVtaXR0ZXIgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgcGFydGljbGVTZXR0aW5ncyA9IG5ldyBQYXJ0aWNsZVNldHRpbmdzKCk7XG4gICAgcGFydGljbGVTZXR0aW5ncy5zZXREaXJlY3Rpb24oMCwgTWF0aC5QSSAqIDIpO1xuICAgIHBhcnRpY2xlU2V0dGluZ3Muc2V0TGlmZSgyLCA4LCAwLCAwKTtcbiAgICBwYXJ0aWNsZVNldHRpbmdzLnNldFNjYWxlKC40LCAxKTtcbiAgICBwYXJ0aWNsZVNldHRpbmdzLnNldEdyYXZpdHkoMSwgMSk7XG4gICAgcGFydGljbGVTZXR0aW5ncy5hZGRCZWhhdmlvdXIoVmVsb2NpdHlCZWhhdmlvdXIpO1xuICAgIHBhcnRpY2xlU2V0dGluZ3MuYWRkQmVoYXZpb3VyKExpZmVCZWhhdmlvdXIpO1xuICAgIHBhcnRpY2xlU2V0dGluZ3MuYWRkQmVoYXZpb3VyKEdyYXZpdHlCZWhhdmlvdXIpO1xuICAgIHBhcnRpY2xlU2V0dGluZ3MuYWRkVGV4dHVyZShUZXh0dXJlR2VuZXJhdG9yLmNpcmNsZSgyLCAweGZmZmZmZiwgdHJ1ZSkpO1xuICAgIHBhcnRpY2xlU2V0dGluZ3MuYWRkVGV4dHVyZShUZXh0dXJlR2VuZXJhdG9yLmNpcmNsZSgyLCAweGZmZmZmZiwgdHJ1ZSwgNikpO1xuXG4gICAgdmFyIGVtaXR0ZXJTZXR0aW5ncyA9IG5ldyBFbWl0dGVyU2V0dGluZ3MoKTtcbiAgICBlbWl0dGVyU2V0dGluZ3Muc2V0UXVhbnRpdHkoMzAwKTtcbiAgICBlbWl0dGVyU2V0dGluZ3Muc2V0U3Bhd25EZWxheSg1MDAsIDI1MDApO1xuICAgIGVtaXR0ZXJTZXR0aW5ncy5zZXRCb3VuZHMoe3R5cGU6XCJDSVJDTEVcIiwgcmFkaXVzOjE4MH0pO1xuXG4gICAgcmV0dXJuIG5ldyBFbWl0dGVyKHRoaXMsIHBhcnRpY2xlU2V0dGluZ3MsIGVtaXR0ZXJTZXR0aW5ncyk7XG59O1xuXG5GaXJld29yazQucHJvdG90eXBlLmdldFRyYWlsRW1pdHRlciA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciB0cmFpbFBhcnRpY2xlU2V0dGluZ3MgPSBuZXcgUGFydGljbGVTZXR0aW5ncygpO1xuICAgIHRyYWlsUGFydGljbGVTZXR0aW5ncy5zZXRMaWZlKDMsIDgsIDEsIDIwKTtcbiAgICB0cmFpbFBhcnRpY2xlU2V0dGluZ3Muc2V0QWxwaGEoLjEsIC41KTtcbiAgICB0cmFpbFBhcnRpY2xlU2V0dGluZ3MuYWRkQmVoYXZpb3VyKExpZmVCZWhhdmlvdXIpO1xuICAgIHRyYWlsUGFydGljbGVTZXR0aW5ncy5hZGRUZXh0dXJlKFRleHR1cmVHZW5lcmF0b3IuY2lyY2xlKDEsIDB4ODBmZmVhLCB0cnVlKSk7XG4gICAgdHJhaWxQYXJ0aWNsZVNldHRpbmdzLmFkZFRleHR1cmUoVGV4dHVyZUdlbmVyYXRvci5jaXJjbGUoMSwgMHhiNWZmZjIsIHRydWUsIDQpKTtcbiAgICB0cmFpbFBhcnRpY2xlU2V0dGluZ3MuYWRkVGV4dHVyZShUZXh0dXJlR2VuZXJhdG9yLmNpcmNsZSgyLCAweEZGRkZGRiwgdHJ1ZSwgOCkpO1xuXG4gICAgdmFyIHRyYWlsRW1pdHRlclNldHRpbmdzID0gbmV3IEVtaXR0ZXJTZXR0aW5ncygpO1xuICAgIHRyYWlsRW1pdHRlclNldHRpbmdzLnNldFF1YW50aXR5KDEwMCk7XG4gICAgdHJhaWxFbWl0dGVyU2V0dGluZ3Muc2V0UmVzcGF3bih0cnVlKTtcblxuICAgIHJldHVybiBuZXcgRW1pdHRlcih0aGlzLCB0cmFpbFBhcnRpY2xlU2V0dGluZ3MsIHRyYWlsRW1pdHRlclNldHRpbmdzKTtcbn07XG5cblxuRmlyZXdvcms0LnByb3RvdHlwZS5zdGFydCA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciB0cmFpbEVtaXR0ZXIgPSB0aGlzLmdldFRyYWlsRW1pdHRlcigpO1xuICAgIHZhciBsYXVuY2hQb3NpdGlvbiA9IEZpcmV3b3JrUG9zaXRpb25zLmxhdW5jaFBvc2l0aW9uKCk7XG4gICAgdmFyIGJ1cnN0UG9zaXRpb24gPSBGaXJld29ya1Bvc2l0aW9ucy5idXJzdFBvc2l0aW9uKCk7XG5cbiAgICB0cmFpbEVtaXR0ZXIueCA9IGxhdW5jaFBvc2l0aW9uLng7XG4gICAgdHJhaWxFbWl0dGVyLnkgPSBsYXVuY2hQb3NpdGlvbi55O1xuICAgIHRyYWlsRW1pdHRlci5zdGFydCgpO1xuXG4gICAgdGhpcy50cmFpbEVtaXR0ZXJzLnB1c2godHJhaWxFbWl0dGVyKTtcblxuICAgIHZhciBjYWxsYmFjayA9IHRoaXMudHJhaWxDb21wbGV0ZS5iaW5kKHRoaXMpO1xuXG4gICAgbmV3IFRXRUVOLlR3ZWVuKHRyYWlsRW1pdHRlcilcbiAgICAgICAgLnRvKHt4IDogYnVyc3RQb3NpdGlvbi54LCB5IDogYnVyc3RQb3NpdGlvbi55fSwgMjAwMClcbiAgICAgICAgLmVhc2luZyhUV0VFTi5FYXNpbmcuQ3ViaWMuSW4pXG4gICAgICAgIC5zdGFydCgpXG4gICAgICAgIC5vbkNvbXBsZXRlKGZ1bmN0aW9uKCl7IGNhbGxiYWNrKHRyYWlsRW1pdHRlcikgfSk7XG59O1xuXG5GaXJld29yazQucHJvdG90eXBlLnRyYWlsQ29tcGxldGUgPSBmdW5jdGlvbih0cmFpbEVtaXR0ZXIpIHtcbiAgICB2YXIgc3BhcmtsZUVtaXR0ZXIgPSB0aGlzLmdldFNwYXJrbGVFbWl0dGVyKCk7XG4gICAgdGhpcy50cmFpbEVtaXR0ZXJzLnB1c2goc3BhcmtsZUVtaXR0ZXIpO1xuICAgIHRoaXMuc21va2VFbWl0dGVyLnggPSB0aGlzLmJ1cnN0RW1pdHRlci54ID0gc3BhcmtsZUVtaXR0ZXIueCA9IHRyYWlsRW1pdHRlci54O1xuICAgIHRoaXMuc21va2VFbWl0dGVyLnkgPSB0aGlzLmJ1cnN0RW1pdHRlci55ID0gc3BhcmtsZUVtaXR0ZXIueSA9IHRyYWlsRW1pdHRlci55O1xuXG4gICAgdGhpcy5zbW9rZUVtaXR0ZXIuc3RhcnQoKTtcbiAgICB0aGlzLmJ1cnN0RW1pdHRlci5zdGFydCgpO1xuICAgIHNwYXJrbGVFbWl0dGVyLnN0YXJ0KCk7XG5cbiAgICBSaXBwbGVCZWhhdmlvdXIuc3RhcnRGbGFzaCgxNTAwKTtcbiAgICB0cmFpbEVtaXR0ZXIuc3RvcFJlc3Bhd24oKTtcbiAgICB0cmFpbEVtaXR0ZXIuc2V0RGVhZFdoZW5FbXB0eSh0cnVlKTtcbiAgICBzcGFya2xlRW1pdHRlci5zZXREZWFkV2hlbkVtcHR5KHRydWUpO1xufTtcblxuRmlyZXdvcms0LnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnNtb2tlRW1pdHRlci51cGRhdGUoKTtcbiAgICB0aGlzLmJ1cnN0RW1pdHRlci51cGRhdGUoKTtcblxuICAgIHZhciBuZWVkc0NvbXBhY3RpbmcgPSBmYWxzZTtcblxuICAgIGZvcih2YXIgaSA9IDA7IGkgPCAgdGhpcy50cmFpbEVtaXR0ZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHRoaXMudHJhaWxFbWl0dGVyc1tpXS51cGRhdGUoKTtcblxuICAgICAgICBpZih0aGlzLnRyYWlsRW1pdHRlcnNbaV0uaXNEZWFkKCkpIHtcbiAgICAgICAgICAgIHRoaXMudHJhaWxFbWl0dGVyc1tpXSA9IG51bGw7XG4gICAgICAgICAgICBuZWVkc0NvbXBhY3RpbmcgPSB0cnVlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgaWYobmVlZHNDb21wYWN0aW5nKSB7XG4gICAgICAgIENvbXBhY3RBcnJheS5jb21wYWN0KHRoaXMudHJhaWxFbWl0dGVycyk7XG4gICAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBGaXJld29yazQ7IiwidmFyIFF1aWNrUmFuZ2UgPSByZXF1aXJlKCcuLi9wYXJ0aWNsZS1zeXN0ZW0vdXRpbHMvUXVpY2tSYW5nZScpO1xuXG52YXIgRmlyZXdvcmtQb3NpdGlvbnMgPSB7fTtcblxuRmlyZXdvcmtQb3NpdGlvbnMubGF1bmNoUG9zaXRpb24gPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgcG9zaXRpb24gPSB7fTtcbiAgICBwb3NpdGlvbi54ID0gKHdpbmRvdy5pbm5lcldpZHRoIC8gMikgKyBRdWlja1JhbmdlLnJhbmdlKC01MCwgNTApO1xuICAgIHBvc2l0aW9uLnkgPSB3aW5kb3cuaW5uZXJIZWlnaHQ7XG4gICAgcmV0dXJuIHBvc2l0aW9uO1xufTtcblxuRmlyZXdvcmtQb3NpdGlvbnMuYnVyc3RQb3NpdGlvbiA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBwb3NpdGlvbiA9IHt9O1xuICAgIHBvc2l0aW9uLnggPSAod2luZG93LmlubmVyV2lkdGggLyAyKSArIFF1aWNrUmFuZ2UucmFuZ2UoLTMwMCwgMzAwKTtcbiAgICBwb3NpdGlvbi55ID0gUXVpY2tSYW5nZS5yYW5nZSgxMDAsIDMwMCk7XG4gICAgcmV0dXJuIHBvc2l0aW9uO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBGaXJld29ya1Bvc2l0aW9uczsiLCJSYWluLmNvbnN0cnVjdG9yID0gUmFpbjtcblJhaW4ucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShQSVhJLkNvbnRhaW5lci5wcm90b3R5cGUpO1xuXG52YXIgRW1pdHRlciA9IHJlcXVpcmUoJy4vLi4vcGFydGljbGUtc3lzdGVtL2VtaXR0ZXIvRW1pdHRlcicpO1xudmFyIEVtaXR0ZXJTZXR0aW5ncyA9IHJlcXVpcmUoJy4vLi4vcGFydGljbGUtc3lzdGVtL2VtaXR0ZXIvRW1pdHRlclNldHRpbmdzJyk7XG52YXIgUGFydGljbGVTZXR0aW5ncyA9IHJlcXVpcmUoJy4vLi4vcGFydGljbGUtc3lzdGVtL3BhcnRpY2xlL1BhcnRpY2xlU2V0dGluZ3MnKTtcbnZhciBUZXh0dXJlR2VuZXJhdG9yID0gcmVxdWlyZSgnLi8uLi9wYXJ0aWNsZS1zeXN0ZW0vdXRpbHMvVGV4dHVyZUdlbmVyYXRvcicpO1xudmFyIFZlbG9jaXR5QmVoYXZpb3VyID0gcmVxdWlyZSgnLi8uLi9wYXJ0aWNsZS1zeXN0ZW0vYmVoYXZpb3Vycy9WZWxvY2l0eUJlaGF2aW91cicpO1xudmFyIExpZmVCZWhhdmlvdXIgPSByZXF1aXJlKCcuLy4uL3BhcnRpY2xlLXN5c3RlbS9iZWhhdmlvdXJzL0xpZmVCZWhhdmlvdXInKTtcbnZhciBTcGlyYWxCZWhhdmlvdXIgPSByZXF1aXJlKCcuLy4uL3BhcnRpY2xlLXN5c3RlbS9iZWhhdmlvdXJzL1NwaXJhbEJlaGF2aW91cicpO1xudmFyIEdyYXZpdHlCZWhhdmlvdXIgPSByZXF1aXJlKCcuLy4uL3BhcnRpY2xlLXN5c3RlbS9iZWhhdmlvdXJzL0dyYXZpdHlCZWhhdmlvdXInKTtcblxuZnVuY3Rpb24gUmFpbigpIHtcbiAgICBQSVhJLkNvbnRhaW5lci5jYWxsKHRoaXMpO1xuXG4gICAgdGhpcy50cmFpbEVtaXR0ZXJzID0gW107XG5cbiAgICB0aGlzLnNldHVwQnVyc3RFZmZlY3QoKTtcbn1cblxuUmFpbi5wcm90b3R5cGUuc2V0dXBCdXJzdEVmZmVjdCA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBwYXJ0aWNsZVNldHRpbmdzID0gbmV3IFBhcnRpY2xlU2V0dGluZ3MoKTtcbiAgICBwYXJ0aWNsZVNldHRpbmdzLnNldExpZmUoNDAsIDMwMCwgMTAsIDUwKTtcbiAgICBwYXJ0aWNsZVNldHRpbmdzLnNldFNwZWVkKDUsIDUpO1xuICAgIHBhcnRpY2xlU2V0dGluZ3Muc2V0RGlyZWN0aW9uKE1hdGguUEksIE1hdGguUEkgKiAyKTtcbiAgICBwYXJ0aWNsZVNldHRpbmdzLnNldFNjYWxlKC4yLCAxKTtcbiAgICBwYXJ0aWNsZVNldHRpbmdzLnNldEdyYXZpdHkoMSwgMik7XG4gICAgcGFydGljbGVTZXR0aW5ncy5hZGRCZWhhdmlvdXIoR3Jhdml0eUJlaGF2aW91cik7XG4gICAgcGFydGljbGVTZXR0aW5ncy5hZGRCZWhhdmlvdXIoU3BpcmFsQmVoYXZpb3VyKTtcbiAgICBwYXJ0aWNsZVNldHRpbmdzLmFkZEJlaGF2aW91cihMaWZlQmVoYXZpb3VyKTtcbiAgICBwYXJ0aWNsZVNldHRpbmdzLmFkZFRleHR1cmUoVGV4dHVyZUdlbmVyYXRvci5jaXJjbGUoMiwgMHhmZmZmZmYsIHRydWUpKTtcbiAgICBwYXJ0aWNsZVNldHRpbmdzLmFkZFRleHR1cmUoVGV4dHVyZUdlbmVyYXRvci5jaXJjbGUoMiwgMHg5MWZmYTEsIHRydWUpKTtcbiAgICBwYXJ0aWNsZVNldHRpbmdzLmFkZFRleHR1cmUoVGV4dHVyZUdlbmVyYXRvci5jaXJjbGUoMiwgMHg5MWZmYTEsIHRydWUpKTtcbiAgICBwYXJ0aWNsZVNldHRpbmdzLmFkZFRleHR1cmUoVGV4dHVyZUdlbmVyYXRvci5jaXJjbGUoMiwgMHg2NmNjZmYsIHRydWUpKTtcbiAgICBwYXJ0aWNsZVNldHRpbmdzLmFkZFRleHR1cmUoVGV4dHVyZUdlbmVyYXRvci5jaXJjbGUoMiwgMHhjY2ZmNjYsIHRydWUpKTtcbiAgICBwYXJ0aWNsZVNldHRpbmdzLmFkZFRleHR1cmUoVGV4dHVyZUdlbmVyYXRvci5jaXJjbGUoMiwgMHhmZjZmY2YsIHRydWUpKTtcblxuICAgIHZhciBlbWl0dGVyU2V0dGluZ3MgPSBuZXcgRW1pdHRlclNldHRpbmdzKCk7XG4gICAgZW1pdHRlclNldHRpbmdzLnNldFF1YW50aXR5KDEwMDApO1xuICAgIGVtaXR0ZXJTZXR0aW5ncy5zZXRCb3VuZHMoe3R5cGU6XCJSRUNUQU5HTEVcIiwgd2lkdGg6d2luZG93LmlubmVyV2lkdGgsIGhlaWdodDoxfSk7XG4gICAgZW1pdHRlclNldHRpbmdzLnNldFJlc3Bhd24odHJ1ZSk7XG4gICAgZW1pdHRlclNldHRpbmdzLnNldFNwYXduRGVsYXkoMCwgMjAwMCk7XG5cbiAgICB0aGlzLmJ1cnN0RW1pdHRlciA9IG5ldyBFbWl0dGVyKHRoaXMsIHBhcnRpY2xlU2V0dGluZ3MsIGVtaXR0ZXJTZXR0aW5ncyk7XG59O1xuXG5cblJhaW4ucHJvdG90eXBlLnN0YXJ0ID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5idXJzdEVtaXR0ZXIueCA9IHdpbmRvdy5pbm5lcldpZHRoIC8gMjtcbiAgICB0aGlzLmJ1cnN0RW1pdHRlci55ID0gMDtcblxuICAgIHRoaXMuYnVyc3RFbWl0dGVyLnN0YXJ0KCk7XG59O1xuXG5SYWluLnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLmJ1cnN0RW1pdHRlci51cGRhdGUoKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gUmFpbjsiLCJ2YXIgQmVoYXZpb3VyID0ge307XG5cbkJlaGF2aW91ci5yZXNldCA9IGZ1bmN0aW9uKHBhcnRpY2xlKSB7XG59O1xuXG5CZWhhdmlvdXIudXBkYXRlID0gZnVuY3Rpb24ocGFydGljbGUpIHtcbiAgICBwYXJ0aWNsZS5zcGVlZCAqPSBwYXJ0aWNsZS5kZWNheTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gQmVoYXZpb3VyOyIsInZhciBCZWhhdmlvdXIgPSB7fTtcblxuQmVoYXZpb3VyLnJlc2V0ID0gZnVuY3Rpb24ocGFydGljbGUpIHtcbn07XG5cbkJlaGF2aW91ci51cGRhdGUgPSBmdW5jdGlvbihwYXJ0aWNsZSkge1xuICAgIHBhcnRpY2xlLnkgKz0gcGFydGljbGUuZ3Jhdml0eTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gQmVoYXZpb3VyOyIsInZhciBCZWhhdmlvdXIgPSB7fTtcblxuQmVoYXZpb3VyLnJlc2V0ID0gZnVuY3Rpb24ocGFydGljbGUpIHtcbn07XG5cbkJlaGF2aW91ci51cGRhdGUgPSBmdW5jdGlvbihwYXJ0aWNsZSkge1xuICAgIGlmKHBhcnRpY2xlLmxpZmUubGlmZUR1cmF0aW9uID09IDApIHtcbiAgICAgICAgaWYocGFydGljbGUubGlmZS5mYWRlRHVyYXRpb24gPiAwKSB7XG4gICAgICAgICAgICBwYXJ0aWNsZS5hbHBoYSAtPSBwYXJ0aWNsZS5mYWRlUGVyRnJhbWU7XG4gICAgICAgICAgICBwYXJ0aWNsZS5saWZlLmZhZGVEdXJhdGlvbi0tO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcGFydGljbGUuZGVhZCA9IHRydWU7XG4gICAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgICBwYXJ0aWNsZS5saWZlLmxpZmVEdXJhdGlvbi0tO1xuICAgIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gQmVoYXZpb3VyOyIsInZhciBRdWlja1JhbmdlID0gcmVxdWlyZSgnLi4vdXRpbHMvUXVpY2tSYW5nZScpO1xudmFyIGNvbG91cnMgPSBbMHg0ZTZjNTUsIDB4NzUzOTIsIDB4MjY4Njk0LCAweGZmODVmZl07XG52YXIgZmxhc2hDb2xvdXJzID0gWzB4YTJlMGIyLCAweGZmZmZmZiwgMHhiNTk0ZWQsIDB4MzhjY2U0XTtcblxudmFyIHVwZGF0ZUNvbG91cnMsIHN0YXJ0Rmxhc2g7XG5cbnZhciBCZWhhdmlvdXIgPSB7fTtcblxuQmVoYXZpb3VyLnJlc2V0ID0gZnVuY3Rpb24ocGFydGljbGUpIHtcbiAgICBwYXJ0aWNsZS5zdGFydFggPSBwYXJ0aWNsZS54O1xuICAgIHBhcnRpY2xlLnJpcHBsZVNwZWVkID0gUXVpY2tSYW5nZS5yYW5nZSgtLjAxLCAuMDEpO1xuICAgIHBhcnRpY2xlLnJpcHBsZVJvdGF0aW9uID0gUXVpY2tSYW5nZS5yYW5nZSgtTWF0aC5QSSAqIDIsIE1hdGguUEkgKiAyKTtcbiAgICBwYXJ0aWNsZS5yaXBwbGVEaXN0YW5jZSA9IFF1aWNrUmFuZ2UucmFuZ2UoNTAsIDEwMCk7XG4gICAgcGFydGljbGUudGludCA9IGNvbG91cnNbUXVpY2tSYW5nZS5yYW5nZSgwLCBjb2xvdXJzLmxlbmd0aCAtIDEsIHRydWUpXTtcbiAgICBpZihRdWlja1JhbmdlLnJhbmdlKDAsIDEsIHRydWUpID09PSAxKSB7cGFydGljbGUuc2NhbGUueCA9IC1wYXJ0aWNsZS5zY2FsZS54fVxufTtcblxuQmVoYXZpb3VyLnVwZGF0ZSA9IGZ1bmN0aW9uKHBhcnRpY2xlKSB7XG4gICAgcGFydGljbGUucmlwcGxlUm90YXRpb24gKz0gcGFydGljbGUucmlwcGxlU3BlZWQ7XG4gICAgcGFydGljbGUueCA9IHBhcnRpY2xlLnN0YXJ0WCArIChNYXRoLnNpbihwYXJ0aWNsZS5yaXBwbGVSb3RhdGlvbikgKiBwYXJ0aWNsZS5yaXBwbGVEaXN0YW5jZSk7XG4gICAgcGFydGljbGUueSA9IHBhcnRpY2xlLnN0YXJ0WSArIChNYXRoLmNvcyhwYXJ0aWNsZS5yaXBwbGVSb3RhdGlvbikgKiAocGFydGljbGUucmlwcGxlRGlzdGFuY2UgLyA1KSk7XG5cbiAgICBpZih1cGRhdGVDb2xvdXJzKSB7XG4gICAgICAgIGlmKHN0YXJ0Rmxhc2gpIHtcbiAgICAgICAgICAgIHBhcnRpY2xlLnRpbnQgPSBjb2xvdXJzW1F1aWNrUmFuZ2UucmFuZ2UoMCwgZmxhc2hDb2xvdXJzLmxlbmd0aCAtIDEsIHRydWUpXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHBhcnRpY2xlLnRpbnQgPSBjb2xvdXJzW1F1aWNrUmFuZ2UucmFuZ2UoMCwgY29sb3Vycy5sZW5ndGggLSAxLCB0cnVlKV07XG4gICAgICAgICAgICB1cGRhdGVDb2xvdXJzID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9XG59O1xuXG5CZWhhdmlvdXIuc3RhcnRGbGFzaCA9IGZ1bmN0aW9uKGR1cmF0aW9uKSB7XG4gICAgdXBkYXRlQ29sb3VycyA9IHRydWU7XG4gICAgc3RhcnRGbGFzaCA9IHRydWU7XG4gICAgc2V0VGltZW91dChCZWhhdmlvdXIuc3RvcEZsYXNoLCBkdXJhdGlvbik7XG59O1xuXG5CZWhhdmlvdXIuc3RvcEZsYXNoID0gZnVuY3Rpb24oKSB7XG4gICAgdXBkYXRlQ29sb3VycyA9IHRydWU7XG4gICAgc3RhcnRGbGFzaCA9IGZhbHNlXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEJlaGF2aW91cjsiLCJ2YXIgUXVpY2tSYW5nZSA9IHJlcXVpcmUoJy4uL3V0aWxzL1F1aWNrUmFuZ2UnKTtcbnZhciBCZWhhdmlvdXIgPSB7fTtcblxuQmVoYXZpb3VyLnJlc2V0ID0gZnVuY3Rpb24ocGFydGljbGUpIHtcbiAgICBwYXJ0aWNsZS5yb3RhdGlvblNwZWVkID0gUXVpY2tSYW5nZS5yYW5nZSguNSwgMik7XG59O1xuXG5CZWhhdmlvdXIudXBkYXRlID0gZnVuY3Rpb24ocGFydGljbGUpIHtcbiAgICBwYXJ0aWNsZS5yb3RhdGlvbiArPSBwYXJ0aWNsZS5yb3RhdGlvblNwZWVkO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBCZWhhdmlvdXI7IiwidmFyIFF1aWNrUmFuZ2UgPSByZXF1aXJlKCcuLi91dGlscy9RdWlja1JhbmdlJyk7XG52YXIgQmVoYXZpb3VyID0ge307XG5cbkJlaGF2aW91ci5yZXNldCA9IGZ1bmN0aW9uKHBhcnRpY2xlKSB7XG4gICAgcGFydGljbGUuc3ByaXJhbFJvdGF0aW9uID0gUXVpY2tSYW5nZS5yYW5nZSgwLCBNYXRoLlBJICogMik7XG4gICAgcGFydGljbGUuc3BpcmFsUm90YXRpb25TcGVlZCA9IC4xOy8vUXVpY2tSYW5nZS5yYW5nZSguMDIsIC4wNSk7XG4gICAgcGFydGljbGUuc3BpcmFsRGlzdGFuY2UgPSAyOy8vUXVpY2tSYW5nZS5yYW5nZSgtMiwgMik7XG59O1xuXG5CZWhhdmlvdXIudXBkYXRlID0gZnVuY3Rpb24ocGFydGljbGUpIHtcbiAgICBwYXJ0aWNsZS5zcHJpcmFsUm90YXRpb24gKz0gcGFydGljbGUuc3BpcmFsUm90YXRpb25TcGVlZDtcbiAgICBwYXJ0aWNsZS54ICs9IChNYXRoLnNpbihwYXJ0aWNsZS5zcHJpcmFsUm90YXRpb24pICogcGFydGljbGUuc3BpcmFsRGlzdGFuY2UpO1xuICAgIHBhcnRpY2xlLnkgKz0gKC1NYXRoLmNvcyhwYXJ0aWNsZS5zcHJpcmFsUm90YXRpb24pICogcGFydGljbGUuc3BpcmFsRGlzdGFuY2UpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBCZWhhdmlvdXI7IiwidmFyIEJlaGF2aW91ciA9IHt9O1xuXG5CZWhhdmlvdXIucmVzZXQgPSBmdW5jdGlvbihwYXJ0aWNsZSkge1xufTtcblxuQmVoYXZpb3VyLnVwZGF0ZSA9IGZ1bmN0aW9uKHBhcnRpY2xlKSB7XG4gICAgcGFydGljbGUueCArPSBwYXJ0aWNsZS5zcGVlZCAqIE1hdGguc2luKHBhcnRpY2xlLmRpcmVjdGlvbik7XG4gICAgcGFydGljbGUueSArPSBwYXJ0aWNsZS5zcGVlZCAqIC1NYXRoLmNvcyhwYXJ0aWNsZS5kaXJlY3Rpb24pO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBCZWhhdmlvdXI7IiwidmFyIFF1aWNrUmFuZ2UgPSByZXF1aXJlKCcuLi91dGlscy9RdWlja1JhbmdlJyk7XG52YXIgQmVoYXZpb3VyID0ge307XG5cbkJlaGF2aW91ci5yZXNldCA9IGZ1bmN0aW9uKHBhcnRpY2xlKSB7XG59O1xuXG5CZWhhdmlvdXIudXBkYXRlID0gZnVuY3Rpb24ocGFydGljbGUpIHtcbiAgICBwYXJ0aWNsZS5kaXJlY3Rpb24gKz0gUXVpY2tSYW5nZS5yYW5nZSgtMSwgMSk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEJlaGF2aW91cjsiLCJ2YXIgUGFydGljbGVQb29sID0gcmVxdWlyZSgnLi4vcGFydGljbGUvUGFydGljbGVQb29sJyk7XG52YXIgUXVpY2tSYW5nZSA9IHJlcXVpcmUoJy4uL3V0aWxzL1F1aWNrUmFuZ2UnKTtcbnZhciBDb21wYWN0QXJyYXkgPSByZXF1aXJlKCcuLi91dGlscy9Db21wYWN0QXJyYXknKTtcblxuZnVuY3Rpb24gRW1pdHRlcihzdGFnZSwgcGFydGljbGVTZXR0aW5ncywgZW1pdHRlclNldHRpbmdzKSB7XG4gICAgdGhpcy5zdGFnZSA9IHN0YWdlO1xuICAgIHRoaXMuZGVhZCA9IGZhbHNlO1xuICAgIHRoaXMuYWRkaW5nID0gMDtcbiAgICB0aGlzLnBhcnRpY2xlU2V0dGluZ3MgPSBwYXJ0aWNsZVNldHRpbmdzO1xuICAgIHRoaXMuZW1pdHRlclNldHRpbmdzID0gZW1pdHRlclNldHRpbmdzO1xuICAgIHRoaXMucmFuZ2UgPSBuZXcgUmFuZ2UoKTtcblxuICAgIFBhcnRpY2xlUG9vbC5hZGRQYXJ0aWNsZXModGhpcy5lbWl0dGVyU2V0dGluZ3MucXVhbnRpdHkpO1xuXG4gICAgdGhpcy5wYXJ0aWNsZXMgPSBbXTtcbn1cblxuRW1pdHRlci5wcm90b3R5cGUuc3RhcnQgPSBmdW5jdGlvbigpIHtcbiAgICBmb3IodmFyIGkgPSAwOyBpIDwgdGhpcy5lbWl0dGVyU2V0dGluZ3MuZ2V0UXVhbnRpdHkoKTsgaSsrKSB7XG4gICAgICAgIHZhciBkZWxheSA9IHRoaXMuZW1pdHRlclNldHRpbmdzLmdldFNwYXduRGVsYXkoKTtcbiAgICAgICAgdGhpcy5hZGRpbmcrKztcbiAgICAgICAgaWYoZGVsYXkgPiAwKSB7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KHRoaXMuYWRkUGFydGljbGUuYmluZCh0aGlzKSwgZGVsYXkpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmFkZFBhcnRpY2xlKCk7XG4gICAgICAgIH1cbiAgICB9XG59O1xuXG5FbWl0dGVyLnByb3RvdHlwZS5hZGRQYXJ0aWNsZSA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBwYXJ0aWNsZSA9IFBhcnRpY2xlUG9vbC5nZXRQYXJ0aWNsZSgpO1xuICAgIHRoaXMudXBkYXRlUGFydGljbGUocGFydGljbGUpO1xuICAgIHRoaXMucGFydGljbGVzLnB1c2gocGFydGljbGUpO1xuICAgIHRoaXMuc3RhZ2UuYWRkQ2hpbGQocGFydGljbGUpO1xuICAgIHRoaXMuYWRkaW5nLS07XG59O1xuXG5FbWl0dGVyLnByb3RvdHlwZS51cGRhdGVQYXJ0aWNsZSA9IGZ1bmN0aW9uKHBhcnRpY2xlKSB7XG4gICAgcGFydGljbGUucmVzZXQodGhpcy5wYXJ0aWNsZVNldHRpbmdzLCB0aGlzLmdldFNwYXduUG9zaXRpb24oKSk7XG59O1xuXG5FbWl0dGVyLnByb3RvdHlwZS5nZXRTcGF3blBvc2l0aW9uID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBib3VuZHMgPSB0aGlzLmVtaXR0ZXJTZXR0aW5ncy5nZXRCb3VuZHMoKTtcbiAgICB2YXIgeFBvcyA9IHRoaXMueDtcbiAgICB2YXIgeVBvcyA9IHRoaXMueTtcblxuICAgIGlmKGJvdW5kcy50eXBlID09PSBcIlBPSU5UXCIpIHtcbiAgICAgICAgLy8gRG8gbm90aGluZ1xuICAgIH0gZWxzZSBpZihib3VuZHMudHlwZSA9PT0gXCJDSVJDTEVcIikge1xuICAgICAgICB2YXIgYW5nbGUgPSBRdWlja1JhbmdlLnJhbmdlKDAsIE1hdGguUEkgKiAyKTtcbiAgICAgICAgeFBvcyArPSBNYXRoLnNpbihhbmdsZSkgKiBRdWlja1JhbmdlLnJhbmdlKDAsIGJvdW5kcy5yYWRpdXMpO1xuICAgICAgICB5UG9zICs9IE1hdGguY29zKGFuZ2xlKSAqIFF1aWNrUmFuZ2UucmFuZ2UoMCwgYm91bmRzLnJhZGl1cyk7XG4gICAgfSBlbHNlIGlmKGJvdW5kcy50eXBlID09PSBcIlJFQ1RBTkdMRVwiKSB7XG4gICAgICAgIHhQb3MgKz0gUXVpY2tSYW5nZS5yYW5nZSgtYm91bmRzLndpZHRoIC8gMiwgYm91bmRzLndpZHRoIC8gMik7XG4gICAgICAgIHlQb3MgKz0gUXVpY2tSYW5nZS5yYW5nZSgtYm91bmRzLmhlaWdodCAvIDIsIGJvdW5kcy5oZWlnaHQgLyAyKTtcbiAgICB9XG5cbiAgICByZXR1cm4ge3g6eFBvcywgeTp5UG9zfTtcbn07XG5cbkVtaXR0ZXIucHJvdG90eXBlLmdldEFjdGl2ZVBhcnRpY2xlcyA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLnBhcnRpY2xlcztcbn07XG5cbkVtaXR0ZXIucHJvdG90eXBlLnNldERlYWRXaGVuRW1wdHkgPSBmdW5jdGlvbih2YWx1ZSkge1xuICAgIHRoaXMuZGVhZFdoZW5FbXB0eSA9IHZhbHVlO1xufTtcblxuRW1pdHRlci5wcm90b3R5cGUuaXNEZWFkID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuZGVhZDtcbn07XG5cbkVtaXR0ZXIucHJvdG90eXBlLnN0b3BSZXNwYXduID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5lbWl0dGVyU2V0dGluZ3Muc2V0UmVzcGF3bihmYWxzZSk7XG59O1xuXG5FbWl0dGVyLnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgcGFydGljbGU7XG4gICAgdmFyIG5lZWRzQ29tcGFjdGluZztcblxuICAgIGZvcih2YXIgaSA9IDA7IGkgPCB0aGlzLnBhcnRpY2xlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICBwYXJ0aWNsZSA9IHRoaXMucGFydGljbGVzW2ldO1xuXG4gICAgICAgIGlmKHBhcnRpY2xlLmRlYWQpIHtcbiAgICAgICAgICAgIGlmKHRoaXMuZW1pdHRlclNldHRpbmdzLmdldFJlc3Bhd24oKSkge1xuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlUGFydGljbGUocGFydGljbGUpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLnN0YWdlLnJlbW92ZUNoaWxkKHBhcnRpY2xlKTtcbiAgICAgICAgICAgICAgICBQYXJ0aWNsZVBvb2wucmV0dXJuUGFydGljbGUocGFydGljbGUpO1xuICAgICAgICAgICAgICAgIHRoaXMucGFydGljbGVzW2ldID0gbnVsbDtcbiAgICAgICAgICAgICAgICBuZWVkc0NvbXBhY3RpbmcgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcGFydGljbGUudXBkYXRlKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBpZihuZWVkc0NvbXBhY3RpbmcpIHtcbiAgICAgICAgQ29tcGFjdEFycmF5LmNvbXBhY3QodGhpcy5wYXJ0aWNsZXMpO1xuICAgIH1cblxuICAgIGlmKHRoaXMuZGVhZFdoZW5FbXB0eSAmJiB0aGlzLnBhcnRpY2xlcy5sZW5ndGggPT09IDAgJiYgdGhpcy5hZGRpbmcgPT09IDApIHtcbiAgICAgICAgdGhpcy5kZWFkID0gdHJ1ZTtcbiAgICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEVtaXR0ZXI7IiwidmFyIFJhbmdlID0gcmVxdWlyZSgnLi4vdXRpbHMvUmFuZ2UnKTtcblxuZnVuY3Rpb24gRW1pdHRlclNldHRpbmdzKCkge31cblxuRW1pdHRlclNldHRpbmdzLnByb3RvdHlwZS5zZXRRdWFudGl0eSA9IGZ1bmN0aW9uKHF1YW50aXR5KSB7XG4gICAgdGhpcy5fcXVhbnRpdHkgPSBxdWFudGl0eTtcbn07XG5cbkVtaXR0ZXJTZXR0aW5ncy5wcm90b3R5cGUuc2V0Qm91bmRzID0gZnVuY3Rpb24oYm91bmRzKSB7XG4gICAgdGhpcy5fYm91bmRzID0gYm91bmRzO1xufTtcblxuRW1pdHRlclNldHRpbmdzLnByb3RvdHlwZS5zZXRSZXNwYXduID0gZnVuY3Rpb24oaXNSZXNwYXduKSB7XG4gICAgdGhpcy5faXNSZXNwYXduID0gaXNSZXNwYXduO1xufTtcblxuRW1pdHRlclNldHRpbmdzLnByb3RvdHlwZS5zZXRTcGF3bkRlbGF5ID0gZnVuY3Rpb24obWluLCBtYXgpIHtcbiAgICB0aGlzLl9zcGF3bkRlbGF5UmFuZ2UgPSBuZXcgUmFuZ2UobWluLCBtYXgpO1xufTtcblxuLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gKiBHZXR0ZXJzXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbkVtaXR0ZXJTZXR0aW5ncy5wcm90b3R5cGUuZ2V0UXVhbnRpdHkgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5fcXVhbnRpdHk7XG59O1xuXG5FbWl0dGVyU2V0dGluZ3MucHJvdG90eXBlLmdldEJvdW5kcyA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiAodGhpcy5fYm91bmRzICE9PSB1bmRlZmluZWQpID8gdGhpcy5fYm91bmRzIDoge3R5cGU6XCJQT0lOVFwifTtcbn07XG5cbkVtaXR0ZXJTZXR0aW5ncy5wcm90b3R5cGUuZ2V0UmVzcGF3biA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiAodGhpcy5faXNSZXNwYXduID09PSB1bmRlZmluZWQpID8gZmFsc2UgOiB0aGlzLl9pc1Jlc3Bhd247XG59O1xuXG5FbWl0dGVyU2V0dGluZ3MucHJvdG90eXBlLmdldFNwYXduRGVsYXkgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gKHRoaXMuX3NwYXduRGVsYXlSYW5nZSkgPyB0aGlzLl9zcGF3bkRlbGF5UmFuZ2UucmFuZ2UoKSA6IDA7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEVtaXR0ZXJTZXR0aW5nczsiLCJQYXJ0aWNsZS5jb25zdHJ1Y3RvciA9IFBhcnRpY2xlO1xuUGFydGljbGUucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShQSVhJLlNwcml0ZS5wcm90b3R5cGUpO1xuXG5mdW5jdGlvbiBQYXJ0aWNsZSgpIHtcbiAgICBQSVhJLlNwcml0ZS5jYWxsKHRoaXMpO1xuICAgIHRoaXMuYW5jaG9yLnggPSAwLjU7XG4gICAgdGhpcy5hbmNob3IueSA9IDAuNTtcbn1cblxuUGFydGljbGUucHJvdG90eXBlLnJlc2V0ID0gZnVuY3Rpb24oc2V0dGluZ3MsIHBvc2l0aW9uKSB7XG4gICAgdGhpcy5kZWFkID0gZmFsc2U7XG4gICAgdGhpcy5zcGVlZCA9IHNldHRpbmdzLmdldFNwZWVkKCk7XG4gICAgdGhpcy5kaXJlY3Rpb24gPSBzZXR0aW5ncy5nZXREaXJlY3Rpb24oKTtcbiAgICB0aGlzLmFscGhhID0gIHNldHRpbmdzLmdldEFscGhhKCk7XG4gICAgdGhpcy5yb3RhdGlvbiA9ICBzZXR0aW5ncy5nZXRSb3RhdGlvbigpO1xuICAgIHRoaXMudGV4dHVyZSA9IHNldHRpbmdzLmdldFRleHR1cmUoKTtcbiAgICB0aGlzLmdyYXZpdHkgPSBzZXR0aW5ncy5nZXRHcmF2aXR5KCk7XG4gICAgdGhpcy5kZWNheSA9IHNldHRpbmdzLmdldERlY2F5KCk7XG4gICAgdGhpcy5saWZlID0gc2V0dGluZ3MuZ2V0TGlmZSgpO1xuICAgIHRoaXMuc2NhbGUueCA9IHRoaXMuc2NhbGUueSA9IHNldHRpbmdzLmdldFNjYWxlKCk7XG4gICAgdGhpcy5iZWhhdmlvdXJzID0gc2V0dGluZ3MuZ2V0QmVoYXZpb3VycygpO1xuXG4gICAgZm9yKHZhciBpID0gMDsgaSA8IHRoaXMuYmVoYXZpb3Vycy5sZW5ndGg7IGkrKykge1xuICAgICAgICB0aGlzLmJlaGF2aW91cnNbaV0ucmVzZXQodGhpcyk7XG4gICAgfVxuXG4gICAgdGhpcy54ID0gdGhpcy5zdGFydFggPSBwb3NpdGlvbi54O1xuICAgIHRoaXMueSA9IHRoaXMuc3RhcnRZID0gcG9zaXRpb24ueTtcblxuICAgIHRoaXMuZmFkZVBlckZyYW1lID0gdGhpcy5hbHBoYSAvIHRoaXMubGlmZS5mYWRlRHVyYXRpb247XG59O1xuXG5QYXJ0aWNsZS5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24oKSB7XG4gICAgZm9yKHZhciBpID0gMDsgaSA8IHRoaXMuYmVoYXZpb3Vycy5sZW5ndGg7IGkrKykge1xuICAgICAgICB0aGlzLmJlaGF2aW91cnNbaV0udXBkYXRlKHRoaXMpO1xuICAgIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gUGFydGljbGU7IiwidmFyIFBhcnRpY2xlID0gcmVxdWlyZSgnLi9QYXJ0aWNsZScpO1xuXG52YXIgUGFydGljbGVQb29sID0ge307XG52YXIgcG9vbCA9IFtdO1xuXG5QYXJ0aWNsZVBvb2wuYWRkUGFydGljbGVzID0gZnVuY3Rpb24ocXR5KSB7XG4gICAgZm9yKHZhciBpID0gMDsgaSA8IHF0eTsgaSsrKSB7XG4gICAgICAgIHBvb2wucHVzaChuZXcgUGFydGljbGUoKSk7XG4gICAgfVxufTtcblxuUGFydGljbGVQb29sLmdldFBhcnRpY2xlID0gZnVuY3Rpb24oKSB7XG4gICAgaWYocG9vbC5sZW5ndGggPiAwKSB7XG4gICAgICAgIHJldHVybiBwb29sLnBvcCgpO1xuICAgIH1cblxuICAgIHJldHVybiBuZXcgUGFydGljbGUoKTtcbn07XG5cblBhcnRpY2xlUG9vbC5yZXR1cm5QYXJ0aWNsZSA9IGZ1bmN0aW9uKHBhcnRpY2xlKSB7XG4gICAgcG9vbC5wdXNoKHBhcnRpY2xlKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gUGFydGljbGVQb29sOyIsInZhciBSYW5nZSA9IHJlcXVpcmUoJy4uL3V0aWxzL1JhbmdlJyk7XG5cbmZ1bmN0aW9uIFBhcnRpY2xlU2V0dGluZ3MoKSB7XG4gICAgdGhpcy5fdGV4dHVyZXMgPSBbXTtcbiAgICB0aGlzLl9iZWhhdmlvdXMgPSBbXTtcbn1cblxuUGFydGljbGVTZXR0aW5ncy5wcm90b3R5cGUuc2V0U3BlZWQgPSBmdW5jdGlvbihtaW4sIG1heCkge1xuICAgIHRoaXMuX3NwZWVkUmFuZ2UgPSBuZXcgUmFuZ2UobWluLCBtYXgpO1xufTtcblxuUGFydGljbGVTZXR0aW5ncy5wcm90b3R5cGUuc2V0RGlyZWN0aW9uID0gZnVuY3Rpb24obWluLCBtYXgpIHtcbiAgICB0aGlzLl9kaXJlY3Rpb25SYW5nZSA9IG5ldyBSYW5nZShtaW4sIG1heCk7XG59O1xuXG5QYXJ0aWNsZVNldHRpbmdzLnByb3RvdHlwZS5zZXRBbHBoYSA9IGZ1bmN0aW9uKG1pbiwgbWF4KSB7XG4gICAgdGhpcy5fYWxwaGFSYW5nZSA9IG5ldyBSYW5nZShtaW4sIG1heCk7XG59O1xuXG5QYXJ0aWNsZVNldHRpbmdzLnByb3RvdHlwZS5zZXRSb3RhdGlvbiA9IGZ1bmN0aW9uKG1pbiwgbWF4KSB7XG4gICAgdGhpcy5fcm90YXRpb25SYW5nZSA9IG5ldyBSYW5nZShtaW4sIG1heCk7XG59O1xuXG5QYXJ0aWNsZVNldHRpbmdzLnByb3RvdHlwZS5zZXRMaWZlID0gZnVuY3Rpb24obGlmZU1pbiwgbGlmZU1heCwgZmFkZU1pbiwgZmFkZU1heCkge1xuICAgIHRoaXMuX2xpZmVEdXJhdGlvblJhbmdlID0gbmV3IFJhbmdlKGxpZmVNaW4sIGxpZmVNYXgsIHRydWUpO1xuICAgIHRoaXMuX2ZhZGVEdXJhdGlvblJhbmdlID0gbmV3IFJhbmdlKGZhZGVNaW4sIGZhZGVNYXgsIHRydWUpO1xufTtcblxuUGFydGljbGVTZXR0aW5ncy5wcm90b3R5cGUuc2V0U2NhbGUgPSBmdW5jdGlvbihtaW4sIG1heCkge1xuICAgIHRoaXMuX3NjYWxlUmFuZ2UgPSBuZXcgUmFuZ2UobWluLCBtYXgpO1xufTtcblxuUGFydGljbGVTZXR0aW5ncy5wcm90b3R5cGUuc2V0R3Jhdml0eSA9IGZ1bmN0aW9uKG1pbiwgbWF4KSB7XG4gICAgdGhpcy5fZ3Jhdml0eVJhbmdlID0gbmV3IFJhbmdlKG1pbiwgbWF4KTtcbn07XG5cblBhcnRpY2xlU2V0dGluZ3MucHJvdG90eXBlLnNldERlY2F5ID0gZnVuY3Rpb24obWluLCBtYXgpIHtcbiAgICB0aGlzLl9kZWNheVJhbmdlID0gbmV3IFJhbmdlKG1pbiwgbWF4KTtcbn07XG5cblBhcnRpY2xlU2V0dGluZ3MucHJvdG90eXBlLmFkZFRleHR1cmUgPSBmdW5jdGlvbih0ZXh0dXJlKSB7XG4gICAgdGhpcy5fdGV4dHVyZXMucHVzaCh0ZXh0dXJlKTtcbn07XG5cblBhcnRpY2xlU2V0dGluZ3MucHJvdG90eXBlLmFkZEJlaGF2aW91ciA9IGZ1bmN0aW9uKGJlaGF2aW91cikge1xuICAgIHRoaXMuX2JlaGF2aW91cy5wdXNoKGJlaGF2aW91cik7XG59O1xuXG4vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAqIEdldHRlcnNcbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuUGFydGljbGVTZXR0aW5ncy5wcm90b3R5cGUuZ2V0VGV4dHVyZSA9IGZ1bmN0aW9uKCkge1xuICAgIGlmKHRoaXMuX3RleHR1cmVzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJObyB0ZXh0dXJlIGhhcyBiZWVuIHNldCBvbiBQYXJ0aWNsZVNldHRpbmdzXCIpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLl90ZXh0dXJlc1tNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiB0aGlzLl90ZXh0dXJlcy5sZW5ndGgpXTtcbn07XG5cblBhcnRpY2xlU2V0dGluZ3MucHJvdG90eXBlLmdldExpZmUgPSBmdW5jdGlvbigpIHtcbiAgICBpZih0aGlzLl9saWZlRHVyYXRpb25SYW5nZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIk5vIGxpZmUgaGFzIGJlZW4gc2V0IG9uIFBhcnRpY2xlU2V0dGluZ3NcIik7XG4gICAgfVxuXG4gICAgcmV0dXJuIHtsaWZlRHVyYXRpb246IHRoaXMuX2xpZmVEdXJhdGlvblJhbmdlLnJhbmdlKCksIGZhZGVEdXJhdGlvbjogdGhpcy5fZmFkZUR1cmF0aW9uUmFuZ2UucmFuZ2UoKX07XG59O1xuXG5QYXJ0aWNsZVNldHRpbmdzLnByb3RvdHlwZS5nZXRTY2FsZSA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiAodGhpcy5fc2NhbGVSYW5nZSkgPyB0aGlzLl9zY2FsZVJhbmdlLnJhbmdlKCkgOiAxO1xufTtcblxuUGFydGljbGVTZXR0aW5ncy5wcm90b3R5cGUuZ2V0QmVoYXZpb3VycyA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiAodGhpcy5fYmVoYXZpb3VzKSA/IHRoaXMuX2JlaGF2aW91cyA6IFtdO1xufTtcblxuUGFydGljbGVTZXR0aW5ncy5wcm90b3R5cGUuZ2V0R3Jhdml0eSA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiAodGhpcy5fZ3Jhdml0eVJhbmdlKSA/IHRoaXMuX2dyYXZpdHlSYW5nZS5yYW5nZSgpIDogMDtcbn07XG5cblBhcnRpY2xlU2V0dGluZ3MucHJvdG90eXBlLmdldERlY2F5ID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuICh0aGlzLl9kZWNheVJhbmdlKSA/IHRoaXMuX2RlY2F5UmFuZ2UucmFuZ2UoKSA6IDA7XG59O1xuXG5QYXJ0aWNsZVNldHRpbmdzLnByb3RvdHlwZS5nZXRTcGVlZCA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiAodGhpcy5fc3BlZWRSYW5nZSkgPyB0aGlzLl9zcGVlZFJhbmdlLnJhbmdlKCkgOiAwO1xufTtcblxuUGFydGljbGVTZXR0aW5ncy5wcm90b3R5cGUuZ2V0RGlyZWN0aW9uID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuICh0aGlzLl9kaXJlY3Rpb25SYW5nZSkgPyB0aGlzLl9kaXJlY3Rpb25SYW5nZS5yYW5nZSgpIDogMDtcbn07XG5cblBhcnRpY2xlU2V0dGluZ3MucHJvdG90eXBlLmdldEFscGhhID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuICh0aGlzLl9hbHBoYVJhbmdlKSA/IHRoaXMuX2FscGhhUmFuZ2UucmFuZ2UoKSA6IDE7XG59O1xuXG5QYXJ0aWNsZVNldHRpbmdzLnByb3RvdHlwZS5nZXRSb3RhdGlvbiA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiAodGhpcy5fcm90YXRpb25SYW5nZSkgPyB0aGlzLl9yb3RhdGlvblJhbmdlLnJhbmdlKCkgOiAwO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBQYXJ0aWNsZVNldHRpbmdzOyIsInZhciBDb21wYWN0QXJyYXkgPSB7fTtcblxuQ29tcGFjdEFycmF5LmNvbXBhY3QgPSBmdW5jdGlvbihhcnJheSkge1xuICAgIGZvciAodmFyIGogPSAwOyBqIDwgYXJyYXkubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgaWYgKGFycmF5W2pdID09IG51bGwpIHtcbiAgICAgICAgICAgIGFycmF5LnNwbGljZShqLCAxKTtcbiAgICAgICAgICAgIGotLTtcbiAgICAgICAgfVxuICAgIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gQ29tcGFjdEFycmF5OyIsInZhciBHZW9tZXRyeSA9IHt9O1xuXG5HZW9tZXRyeS5kaXN0YW5jZUJldHdlZW5Qb2ludHMgPSBmdW5jdGlvbihhLCBiKSB7XG4gICAgcmV0dXJuIE1hdGguc3FydCggKGEueC1iLngpKihhLngtYi54KSArIChhLnktYi55KSooYS55LWIueSkgKTtcbn07XG5cbkdlb21ldHJ5LmFuZ2xlQmV0d2VlblBvaW50c1JhZGlhbnMgPSBmdW5jdGlvbihhLCBiKSB7XG4gICAgcmV0dXJuIE1hdGguYXRhbjIoYi55IC0gYS55LCBiLnggLSBhLngpOztcbn07XG5cbkdlb21ldHJ5LmFuZ2xlQmV0d2VlblBvaW50c0RlZ3JlZXMgPSBmdW5jdGlvbihhLCBiKSB7XG4gICAgcmV0dXJuIEdlb21ldHJ5LmFuZ2xlQmV0d2VlblBvaW50c1JhZGlhbnMoYSwgYikgKiAxODAgLyBNYXRoLlBJO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBHZW9tZXRyeTsiLCJ2YXIgUXVpY2tSYW5nZSA9IHt9O1xuXG5RdWlja1JhbmdlLnJhbmdlID0gZnVuY3Rpb24obWluLCBtYXgsIHJvdW5kKSB7XG4gICAgdmFyIHZhbHVlID0gbWluICsgKE1hdGgucmFuZG9tKCkgKiAobWF4IC0gbWluKSk7XG4gICAgaWYocm91bmQpIHZhbHVlID0gTWF0aC5yb3VuZCh2YWx1ZSk7XG4gICAgcmV0dXJuIHZhbHVlO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBRdWlja1JhbmdlOyIsImZ1bmN0aW9uIFJhbmdlKG1pbiwgbWF4LCByb3VuZCkge1xuICAgIHRoaXMubWluID0gbWluO1xuICAgIHRoaXMubWF4ID0gbWF4O1xuICAgIHRoaXMucm91bmQgPSByb3VuZDtcbn1cblxuUmFuZ2UucHJvdG90eXBlLnJhbmdlID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHZhbHVlID0gdGhpcy5taW4gKyAoTWF0aC5yYW5kb20oKSAqICh0aGlzLm1heCAtIHRoaXMubWluKSk7XG4gICAgaWYodGhpcy5yb3VuZCkgdmFsdWUgPSBNYXRoLnJvdW5kKHZhbHVlKTtcbiAgICByZXR1cm4gdmFsdWU7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFJhbmdlOyIsInZhciBUZXh0dXJlR2VuZXJhdG9yID0ge307XG5cblRleHR1cmVHZW5lcmF0b3IuY2lyY2xlID0gZnVuY3Rpb24ocmFkaXVzLCBjb2xvdXIsIGhhbG8sIGJsdXJBbW91bnQpIHtcbiAgICB2YXIgZ3JhcGhpY3MgPSBuZXcgUElYSS5HcmFwaGljcygpO1xuICAgIGdyYXBoaWNzLmxpbmVTdHlsZSgwKTtcblxuICAgIGlmKGhhbG8pIHtcbiAgICAgICAgZ3JhcGhpY3MuYmVnaW5GaWxsKGNvbG91ciwgLjIpO1xuICAgICAgICBncmFwaGljcy5kcmF3Q2lyY2xlKDAsIDAsIHJhZGl1cyAqIDIpO1xuICAgICAgICBncmFwaGljcy5lbmRGaWxsKCk7XG5cbiAgICAgICAgZ3JhcGhpY3MuYmVnaW5GaWxsKGNvbG91ciwgLjEpO1xuICAgICAgICBncmFwaGljcy5kcmF3Q2lyY2xlKDAsIDAsIHJhZGl1cyAqIDQpO1xuICAgICAgICBncmFwaGljcy5lbmRGaWxsKCk7XG4gICAgfVxuXG4gICAgZ3JhcGhpY3MuYmVnaW5GaWxsKGNvbG91ciwgMSk7XG4gICAgZ3JhcGhpY3MuZHJhd0NpcmNsZSgwLCAwLCByYWRpdXMpO1xuICAgIGdyYXBoaWNzLmVuZEZpbGwoKTtcblxuICAgIGlmKGJsdXJBbW91bnQgPiAwKSB7XG4gICAgICAgIHZhciBibHVyRmlsdGVyID0gbmV3IFBJWEkuZmlsdGVycy5CbHVyRmlsdGVyKCk7XG4gICAgICAgIGJsdXJGaWx0ZXIuYmx1ciA9IGJsdXJBbW91bnQ7XG4gICAgICAgIGdyYXBoaWNzLmZpbHRlcnMgPSBbYmx1ckZpbHRlcl07XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlbmRlcmVyLmdlbmVyYXRlVGV4dHVyZShncmFwaGljcyk7XG59O1xuXG5UZXh0dXJlR2VuZXJhdG9yLnJlY3RhbmdsZSA9IGZ1bmN0aW9uKHdpZHRoLCBoZWlnaHQsIGNvbG91ciwgaGFsbywgYmx1ckFtb3VudCkge1xuICAgIHZhciBncmFwaGljcyA9IG5ldyBQSVhJLkdyYXBoaWNzKCk7XG4gICAgZ3JhcGhpY3MubGluZVN0eWxlKDApO1xuXG4gICAgaWYoaGFsbykge1xuICAgICAgICBncmFwaGljcy5iZWdpbkZpbGwoY29sb3VyLCAuMik7XG4gICAgICAgIGdyYXBoaWNzLmRyYXdSZWN0KDAsIDAsIHdpZHRoICogMiwgaGVpZ2h0ICogMik7XG4gICAgICAgIGdyYXBoaWNzLmVuZEZpbGwoKTtcblxuICAgICAgICBncmFwaGljcy5iZWdpbkZpbGwoY29sb3VyLCAuMSk7XG4gICAgICAgIGdyYXBoaWNzLmRyYXdSZWN0KDAsIDAsIHdpZHRoICogNCwgaGVpZ2h0ICogNCk7XG4gICAgICAgIGdyYXBoaWNzLmVuZEZpbGwoKTtcbiAgICB9XG5cbiAgICBncmFwaGljcy5iZWdpbkZpbGwoY29sb3VyKTtcbiAgICBncmFwaGljcy5kcmF3UmVjdCgwLCAwLCB3aWR0aCwgaGVpZ2h0KTtcbiAgICBncmFwaGljcy5lbmRGaWxsKCk7XG5cbiAgICBncmFwaGljcy5hbmNob3IgPSB7eDouNSwgeTouNX07XG5cbiAgICBpZihibHVyQW1vdW50ID4gMCkge1xuICAgICAgICB2YXIgYmx1ckZpbHRlciA9IG5ldyBQSVhJLmZpbHRlcnMuQmx1ckZpbHRlcigpO1xuICAgICAgICBibHVyRmlsdGVyLmJsdXIgPSBibHVyQW1vdW50O1xuICAgICAgICBncmFwaGljcy5maWx0ZXJzID0gW2JsdXJGaWx0ZXJdO1xuICAgIH1cblxuICAgIHJldHVybiByZW5kZXJlci5nZW5lcmF0ZVRleHR1cmUoZ3JhcGhpY3MpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBUZXh0dXJlR2VuZXJhdG9yOyIsIlJpcHBsZUVmZmVjdC5jb25zdHJ1Y3RvciA9IFJpcHBsZUVmZmVjdDtcblJpcHBsZUVmZmVjdC5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKFBJWEkuQ29udGFpbmVyLnByb3RvdHlwZSk7XG5cbnZhciBFbWl0dGVyID0gcmVxdWlyZSgnLi8uLi9wYXJ0aWNsZS1zeXN0ZW0vZW1pdHRlci9FbWl0dGVyJyk7XG52YXIgRW1pdHRlclNldHRpbmdzID0gcmVxdWlyZSgnLi8uLi9wYXJ0aWNsZS1zeXN0ZW0vZW1pdHRlci9FbWl0dGVyU2V0dGluZ3MnKTtcbnZhciBQYXJ0aWNsZVNldHRpbmdzID0gcmVxdWlyZSgnLi8uLi9wYXJ0aWNsZS1zeXN0ZW0vcGFydGljbGUvUGFydGljbGVTZXR0aW5ncycpO1xudmFyIFRleHR1cmVHZW5lcmF0b3IgPSByZXF1aXJlKCcuLy4uL3BhcnRpY2xlLXN5c3RlbS91dGlscy9UZXh0dXJlR2VuZXJhdG9yJyk7XG52YXIgVmVsb2NpdHlCZWhhdmlvdXIgPSByZXF1aXJlKCcuLy4uL3BhcnRpY2xlLXN5c3RlbS9iZWhhdmlvdXJzL1ZlbG9jaXR5QmVoYXZpb3VyJyk7XG52YXIgTGlmZUJlaGF2aW91ciA9IHJlcXVpcmUoJy4vLi4vcGFydGljbGUtc3lzdGVtL2JlaGF2aW91cnMvTGlmZUJlaGF2aW91cicpO1xudmFyIFJvdGF0aW9uQmVoYXZpb3VyID0gcmVxdWlyZSgnLi8uLi9wYXJ0aWNsZS1zeXN0ZW0vYmVoYXZpb3Vycy9Sb3RhdGlvbkJlaGF2aW91cicpO1xudmFyIFdhbmRlckJlaGF2aW91ciA9IHJlcXVpcmUoJy4vLi4vcGFydGljbGUtc3lzdGVtL2JlaGF2aW91cnMvV2FuZGVyQmVoYXZpb3VyJyk7XG52YXIgUmlwcGxlQmVoYXZpb3VyID0gcmVxdWlyZSgnLi8uLi9wYXJ0aWNsZS1zeXN0ZW0vYmVoYXZpb3Vycy9SaXBwbGVCZWhhdmlvdXInKTtcblxuZnVuY3Rpb24gUmlwcGxlRWZmZWN0KHBvc2l0aW9uKSB7XG4gICAgUElYSS5Db250YWluZXIuY2FsbCh0aGlzKTtcblxuICAgIHZhciBwYXJ0aWNsZVNldHRpbmdzID0gbmV3IFBhcnRpY2xlU2V0dGluZ3MoKTtcbiAgICBwYXJ0aWNsZVNldHRpbmdzLnNldExpZmUoMSwgMSk7XG4gICAgcGFydGljbGVTZXR0aW5ncy5hZGRCZWhhdmlvdXIoUmlwcGxlQmVoYXZpb3VyKTtcbiAgICBwYXJ0aWNsZVNldHRpbmdzLmFkZFRleHR1cmUoUElYSS5sb2FkZXIucmVzb3VyY2VzWydyaXBwbGUnXS50ZXh0dXJlKTtcblxuICAgIHZhciBlbWl0dGVyU2V0dGluZ3MgPSBuZXcgRW1pdHRlclNldHRpbmdzKCk7XG4gICAgZW1pdHRlclNldHRpbmdzLnNldEJvdW5kcyh7dHlwZTpcIlJFQ1RBTkdMRVwiLCB3aWR0aDoxMCwgaGVpZ2h0OjIwfSk7XG4gICAgZW1pdHRlclNldHRpbmdzLnNldFF1YW50aXR5KDYpO1xuXG4gICAgdGhpcy5lbWl0dGVyID0gbmV3IEVtaXR0ZXIodGhpcywgcGFydGljbGVTZXR0aW5ncywgZW1pdHRlclNldHRpbmdzKTtcbiAgICB0aGlzLmVtaXR0ZXIueCA9IHBvc2l0aW9uLng7XG4gICAgdGhpcy5lbWl0dGVyLnkgPSBwb3NpdGlvbi55O1xuICAgIHRoaXMuZW1pdHRlci5zdGFydCgpO1xufTtcblxuUmlwcGxlRWZmZWN0LnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbigpIHtcbiAgICBpZih0aGlzLmVtaXR0ZXIgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICB0aGlzLmVtaXR0ZXIudXBkYXRlKCk7XG4gICAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBSaXBwbGVFZmZlY3Q7Il19
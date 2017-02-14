(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function(q,n){function f(c,b){if(null==b)return null;null==b.__id__&&(b.__id__=p++);var a;null==c.hx__closures__?c.hx__closures__={}:a=c.hx__closures__[b.__id__];null==a&&(a=function(){return a.method.apply(a.scope,arguments)},a.scope=c,a.method=b,c.hx__closures__[b.__id__]=a);return a}var d=n.Perf=function(c,b){null==b&&(b=0);null==c&&(c="TR");var a=this;this._divElements=[];this._perfObj=window.performance;null!=g.field(this._perfObj,"memory")&&(this._memoryObj=g.field(this._perfObj,"memory"));
this._memCheck=null!=this._perfObj&&null!=this._memoryObj&&0<this._memoryObj.totalJSHeapSize;this._pos=c;this._offset=b;this.currentFps=60;this.currentMs=0;this.currentMem="0";this.avgFps=this.lowFps=60;this._ticks=this._time=this._totalFps=this._measureCount=0;this._fpsMax=this._fpsMin=60;null!=this._perfObj&&null!=(e=this._perfObj,f(e,e.now))?this._startTime=this._perfObj.now():this._startTime=(new Date).getTime();this._prevTime=-d.MEASUREMENT_INTERVAL;this._createFpsDom();this._createMsDom();this._memCheck&&
this._createMemoryDom();var k=0,l=null;null!=(e=window,f(e,e.requestAnimationFrame))?this.RAF=(e=window,f(e,e.requestAnimationFrame)):this.RAF=function(b){var c;c=null!=a._perfObj&&null!=(e=a._perfObj,f(e,e.now))?a._perfObj.now():(new Date).getTime();var d=m["int"](Math.max(0,16-(c-k)));l=h.delay(function(){b(c+d)},d);k=c+d;return l};null!=(e=window,f(e,e.cancelAnimationFrame))?this.CAF=(e=window,f(e,e.cancelAnimationFrame)):this.CAF=function(a){null!=a&&a.stop()};null!=this.RAF&&(this._raf=g.callMethod(window,
this.RAF,[f(this,this._tick)]))};d.prototype={_init:function(){this.currentFps=60;this.currentMs=0;this.currentMem="0";this.avgFps=this.lowFps=60;this._ticks=this._time=this._totalFps=this._measureCount=0;this._fpsMax=this._fpsMin=60;null!=this._perfObj&&null!=(e=this._perfObj,f(e,e.now))?this._startTime=this._perfObj.now():this._startTime=(new Date).getTime();this._prevTime=-d.MEASUREMENT_INTERVAL},_now:function(){return null!=this._perfObj&&null!=(e=this._perfObj,f(e,e.now))?this._perfObj.now():
(new Date).getTime()},_tick:function(c){var b;b=null!=this._perfObj&&null!=(e=this._perfObj,f(e,e.now))?this._perfObj.now():(new Date).getTime();this._ticks++;null!=this._raf&&b>this._prevTime+d.MEASUREMENT_INTERVAL&&(this.currentMs=Math.round(b-this._startTime),this.ms.innerHTML="MS: "+this.currentMs,this.currentFps=Math.round(1E3*this._ticks/(b-this._prevTime)),60<this.currentFps&&(this.currentFps=60),0<this.currentFps&&c>d.DELAY_TIME&&(this._measureCount++,this._totalFps+=this.currentFps,this.lowFps=
this._fpsMin=Math.min(this._fpsMin,this.currentFps),this._fpsMax=Math.max(this._fpsMax,this.currentFps),this.avgFps=Math.round(this._totalFps/this._measureCount)),this.fps.innerHTML="FPS: "+this.currentFps+" ("+this._fpsMin+"-"+this._fpsMax+")",this.fps.style.backgroundColor=30<=this.currentFps?d.FPS_BG_CLR:15<=this.currentFps?d.FPS_WARN_BG_CLR:d.FPS_PROB_BG_CLR,this._prevTime=b,this._ticks=0,this._memCheck&&(this.currentMem=this._getFormattedSize(this._memoryObj.usedJSHeapSize,2),this.memory.innerHTML=
"MEM: "+this.currentMem));this._startTime=b;null!=this._raf&&(this._raf=g.callMethod(window,this.RAF,[f(this,this._tick)]))},_createDiv:function(c,b){null==b&&(b=0);var a;a=window.document.createElement("div");a.id=c;a.className=c;a.style.position="absolute";switch(this._pos){case "TL":a.style.left=this._offset+"px";a.style.top=b+"px";break;case "TR":a.style.right=this._offset+"px";a.style.top=b+"px";break;case "BL":a.style.left=this._offset+"px";a.style.bottom=(this._memCheck?48:32)-b+"px";break;
case "BR":a.style.right=this._offset+"px",a.style.bottom=(this._memCheck?48:32)-b+"px"}a.style.width="80px";a.style.height="12px";a.style.lineHeight="12px";a.style.padding="2px";a.style.fontFamily=d.FONT_FAMILY;a.style.fontSize="9px";a.style.fontWeight="bold";a.style.textAlign="center";window.document.body.appendChild(a);this._divElements.push(a);return a},_createFpsDom:function(){this.fps=this._createDiv("fps");this.fps.style.backgroundColor=d.FPS_BG_CLR;this.fps.style.zIndex="995";this.fps.style.color=
d.FPS_TXT_CLR;this.fps.innerHTML="FPS: 0"},_createMsDom:function(){this.ms=this._createDiv("ms",16);this.ms.style.backgroundColor=d.MS_BG_CLR;this.ms.style.zIndex="996";this.ms.style.color=d.MS_TXT_CLR;this.ms.innerHTML="MS: 0"},_createMemoryDom:function(){this.memory=this._createDiv("memory",32);this.memory.style.backgroundColor=d.MEM_BG_CLR;this.memory.style.color=d.MEM_TXT_CLR;this.memory.style.zIndex="997";this.memory.innerHTML="MEM: 0"},_getFormattedSize:function(c,b){null==b&&(b=0);if(0==c)return"0";
var a=Math.pow(10,b),d=Math.floor(Math.log(c)/Math.log(1024));return Math.round(c*a/Math.pow(1024,d))/a+" "+["Bytes","KB","MB","GB","TB"][d]},addInfo:function(c){this.info=this._createDiv("info",this._memCheck?48:32);this.info.style.backgroundColor=d.INFO_BG_CLR;this.info.style.color=d.INFO_TXT_CLR;this.info.style.zIndex="998";this.info.innerHTML=c},clearInfo:function(){null!=this.info&&(window.document.body.removeChild(this.info),this.info=null)},destroy:function(){g.callMethod(window,this.CAF,[this._raf]);
this._memoryObj=this._perfObj=this._raf=null;null!=this.fps&&(window.document.body.removeChild(this.fps),this.fps=null);null!=this.ms&&(window.document.body.removeChild(this.ms),this.ms=null);null!=this.memory&&(window.document.body.removeChild(this.memory),this.memory=null);this.clearInfo();this.currentFps=60;this.currentMs=0;this.currentMem="0";this.avgFps=this.lowFps=60;this._ticks=this._time=this._totalFps=this._measureCount=0;this._fpsMax=this._fpsMin=60;null!=this._perfObj&&null!=(e=this._perfObj,
f(e,e.now))?this._startTime=this._perfObj.now():this._startTime=(new Date).getTime();this._prevTime=-d.MEASUREMENT_INTERVAL},hide:function(){for(var c=0,b=this._divElements;c<b.length;){var a=b[c];++c;a.style.visibility="hidden"}},show:function(){for(var c=0,b=this._divElements;c<b.length;){var a=b[c];++c;a.style.visibility="visible"}},_cancelRAF:function(){g.callMethod(window,this.CAF,[this._raf]);this._raf=null}};var g=function(){};g.field=function(c,b){try{return c[b]}catch(a){return null}};g.callMethod=
function(c,b,a){return b.apply(c,a)};var m=function(){};m["int"]=function(c){return c|0};var h=function(c){var b=this;this.id=setInterval(function(){b.run()},c)};h.delay=function(c,b){var a=new h(b);a.run=function(){a.stop();c()};return a};h.prototype={stop:function(){null!=this.id&&(clearInterval(this.id),this.id=null)},run:function(){}};var e,p=0;d.MEASUREMENT_INTERVAL=1E3;d.FONT_FAMILY="Helvetica,Arial";d.FPS_BG_CLR="#00FF00";d.FPS_WARN_BG_CLR="#FF8000";d.FPS_PROB_BG_CLR="#FF0000";d.MS_BG_CLR=
"#FFFF00";d.MEM_BG_CLR="#086A87";d.INFO_BG_CLR="#00FFFF";d.FPS_TXT_CLR="#000000";d.MS_TXT_CLR="#000000";d.MEM_TXT_CLR="#FFFFFF";d.INFO_TXT_CLR="#000000";d.TOP_LEFT="TL";d.TOP_RIGHT="TR";d.BOTTOM_LEFT="BL";d.BOTTOM_RIGHT="BR";d.DELAY_TIME=4E3})("undefined"!=typeof console?console:{log:function(){}},"undefined"!=typeof window?window:exports);

},{}],2:[function(require,module,exports){
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
},{"./effects/ElementalDragon":4,"./effects/Fire":5,"./effects/Firework1":6,"./effects/Firework2":7,"./effects/Firework3":8,"./effects/Firework4":9,"./effects/Rain":11,"./effects/RippleEffect":12,"./particle-system/utils/TextureGenerator":30}],3:[function(require,module,exports){
var FireworkDisplay = require('../src/FireworkDisplay');
var originalWindowSize, fireworkDisplay, stage;

require("perf.js");

window.onload = init;

function init() {
    originalWindowSize = {width:window.innerWidth, height:window.innerHeight};
    this.fpsStats = new Perf(Perf.TOP_LEFT);

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
},{"../src/FireworkDisplay":2,"perf.js":1}],4:[function(require,module,exports){
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
},{"./../particle-system/behaviours/LifeBehaviour":15,"./../particle-system/behaviours/VelocityBehaviour":19,"./../particle-system/emitter/Emitter":21,"./../particle-system/emitter/EmitterSettings":22,"./../particle-system/particle/ParticleSettings":25,"./../particle-system/utils/Geometry":27,"./../particle-system/utils/TextureGenerator":30}],5:[function(require,module,exports){
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
},{"./../particle-system/behaviours/GravityBehaviour":14,"./../particle-system/behaviours/LifeBehaviour":15,"./../particle-system/behaviours/RotationBehaviour":17,"./../particle-system/behaviours/SpiralBehaviour":18,"./../particle-system/behaviours/VelocityBehaviour":19,"./../particle-system/emitter/Emitter":21,"./../particle-system/emitter/EmitterSettings":22,"./../particle-system/particle/ParticleSettings":25,"./../particle-system/utils/QuickRange":28,"./../particle-system/utils/TextureGenerator":30}],6:[function(require,module,exports){
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
},{"./../particle-system/behaviours/LifeBehaviour":15,"./../particle-system/behaviours/RippleBehaviour":16,"./../particle-system/behaviours/RotationBehaviour":17,"./../particle-system/behaviours/VelocityBehaviour":19,"./../particle-system/behaviours/WanderBehaviour":20,"./../particle-system/emitter/Emitter":21,"./../particle-system/emitter/EmitterSettings":22,"./../particle-system/particle/ParticleSettings":25,"./../particle-system/utils/CompactArray":26,"./../particle-system/utils/TextureGenerator":30,"./FireworkPositions":10}],7:[function(require,module,exports){
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
},{"./../particle-system/behaviours/LifeBehaviour":15,"./../particle-system/behaviours/RippleBehaviour":16,"./../particle-system/behaviours/RotationBehaviour":17,"./../particle-system/behaviours/SpiralBehaviour":18,"./../particle-system/behaviours/VelocityBehaviour":19,"./../particle-system/emitter/Emitter":21,"./../particle-system/emitter/EmitterSettings":22,"./../particle-system/particle/ParticleSettings":25,"./../particle-system/utils/CompactArray":26,"./../particle-system/utils/TextureGenerator":30,"./FireworkPositions":10}],8:[function(require,module,exports){
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
},{"./../particle-system/behaviours/DecayBehaviour":13,"./../particle-system/behaviours/LifeBehaviour":15,"./../particle-system/behaviours/RippleBehaviour":16,"./../particle-system/behaviours/RotationBehaviour":17,"./../particle-system/behaviours/VelocityBehaviour":19,"./../particle-system/emitter/Emitter":21,"./../particle-system/emitter/EmitterSettings":22,"./../particle-system/particle/ParticleSettings":25,"./../particle-system/utils/CompactArray":26,"./../particle-system/utils/TextureGenerator":30,"./FireworkPositions":10}],9:[function(require,module,exports){
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
},{"./../particle-system/behaviours/DecayBehaviour":13,"./../particle-system/behaviours/GravityBehaviour":14,"./../particle-system/behaviours/LifeBehaviour":15,"./../particle-system/behaviours/RippleBehaviour":16,"./../particle-system/behaviours/RotationBehaviour":17,"./../particle-system/behaviours/VelocityBehaviour":19,"./../particle-system/emitter/Emitter":21,"./../particle-system/emitter/EmitterSettings":22,"./../particle-system/particle/ParticleSettings":25,"./../particle-system/utils/CompactArray":26,"./../particle-system/utils/TextureGenerator":30,"./FireworkPositions":10}],10:[function(require,module,exports){
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
},{"../particle-system/utils/QuickRange":28}],11:[function(require,module,exports){
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
},{"./../particle-system/behaviours/GravityBehaviour":14,"./../particle-system/behaviours/LifeBehaviour":15,"./../particle-system/behaviours/SpiralBehaviour":18,"./../particle-system/behaviours/VelocityBehaviour":19,"./../particle-system/emitter/Emitter":21,"./../particle-system/emitter/EmitterSettings":22,"./../particle-system/particle/ParticleSettings":25,"./../particle-system/utils/TextureGenerator":30}],12:[function(require,module,exports){
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
},{"./../particle-system/behaviours/LifeBehaviour":15,"./../particle-system/behaviours/RippleBehaviour":16,"./../particle-system/behaviours/RotationBehaviour":17,"./../particle-system/behaviours/VelocityBehaviour":19,"./../particle-system/behaviours/WanderBehaviour":20,"./../particle-system/emitter/Emitter":21,"./../particle-system/emitter/EmitterSettings":22,"./../particle-system/particle/ParticleSettings":25,"./../particle-system/utils/TextureGenerator":30}],13:[function(require,module,exports){
var Behaviour = {};

Behaviour.reset = function(particle) {
};

Behaviour.update = function(particle) {
    particle.speed *= particle.decay;
};

module.exports = Behaviour;
},{}],14:[function(require,module,exports){
var Behaviour = {};

Behaviour.reset = function(particle) {
};

Behaviour.update = function(particle) {
    particle.y += particle.gravity;
};

module.exports = Behaviour;
},{}],15:[function(require,module,exports){
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
},{}],16:[function(require,module,exports){
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
},{"../utils/QuickRange":28}],17:[function(require,module,exports){
var QuickRange = require('../utils/QuickRange');
var Behaviour = {};

Behaviour.reset = function(particle) {
    particle.rotationSpeed = QuickRange.range(.5, 2);
};

Behaviour.update = function(particle) {
    particle.rotation += particle.rotationSpeed;
};

module.exports = Behaviour;
},{"../utils/QuickRange":28}],18:[function(require,module,exports){
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
},{"../utils/QuickRange":28}],19:[function(require,module,exports){
var Behaviour = {};

Behaviour.reset = function(particle) {
};

Behaviour.update = function(particle) {
    particle.x += particle.speed * Math.sin(particle.direction);
    particle.y += particle.speed * -Math.cos(particle.direction);
};

module.exports = Behaviour;
},{}],20:[function(require,module,exports){
var QuickRange = require('../utils/QuickRange');
var Behaviour = {};

Behaviour.reset = function(particle) {
};

Behaviour.update = function(particle) {
    particle.direction += QuickRange.range(-1, 1);
};

module.exports = Behaviour;
},{"../utils/QuickRange":28}],21:[function(require,module,exports){
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
},{"../particle/ParticlePool":24,"../utils/CompactArray":26,"../utils/QuickRange":28}],22:[function(require,module,exports){
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
},{"../utils/Range":29}],23:[function(require,module,exports){
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
},{}],24:[function(require,module,exports){
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
},{"./Particle":23}],25:[function(require,module,exports){
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
},{"../utils/Range":29}],26:[function(require,module,exports){
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
},{}],27:[function(require,module,exports){
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
},{}],28:[function(require,module,exports){
var QuickRange = {};

QuickRange.range = function(min, max, round) {
    var value = min + (Math.random() * (max - min));
    if(round) value = Math.round(value);
    return value;
};

module.exports = QuickRange;
},{}],29:[function(require,module,exports){
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
},{}],30:[function(require,module,exports){
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
},{}]},{},[3])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9ncnVudC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvcGVyZi5qcy9kaXN0L3BlcmYubWluLmpzIiwic3JjL0ZpcmV3b3JrRGlzcGxheS5qcyIsInNyYy9NYWluLmpzIiwic3JjL2VmZmVjdHMvRWxlbWVudGFsRHJhZ29uLmpzIiwic3JjL2VmZmVjdHMvRmlyZS5qcyIsInNyYy9lZmZlY3RzL0ZpcmV3b3JrMS5qcyIsInNyYy9lZmZlY3RzL0ZpcmV3b3JrMi5qcyIsInNyYy9lZmZlY3RzL0ZpcmV3b3JrMy5qcyIsInNyYy9lZmZlY3RzL0ZpcmV3b3JrNC5qcyIsInNyYy9lZmZlY3RzL0ZpcmV3b3JrUG9zaXRpb25zLmpzIiwic3JjL2VmZmVjdHMvUmFpbi5qcyIsInNyYy9lZmZlY3RzL1JpcHBsZUVmZmVjdC5qcyIsInNyYy9wYXJ0aWNsZS1zeXN0ZW0vYmVoYXZpb3Vycy9EZWNheUJlaGF2aW91ci5qcyIsInNyYy9wYXJ0aWNsZS1zeXN0ZW0vYmVoYXZpb3Vycy9HcmF2aXR5QmVoYXZpb3VyLmpzIiwic3JjL3BhcnRpY2xlLXN5c3RlbS9iZWhhdmlvdXJzL0xpZmVCZWhhdmlvdXIuanMiLCJzcmMvcGFydGljbGUtc3lzdGVtL2JlaGF2aW91cnMvUmlwcGxlQmVoYXZpb3VyLmpzIiwic3JjL3BhcnRpY2xlLXN5c3RlbS9iZWhhdmlvdXJzL1JvdGF0aW9uQmVoYXZpb3VyLmpzIiwic3JjL3BhcnRpY2xlLXN5c3RlbS9iZWhhdmlvdXJzL1NwaXJhbEJlaGF2aW91ci5qcyIsInNyYy9wYXJ0aWNsZS1zeXN0ZW0vYmVoYXZpb3Vycy9WZWxvY2l0eUJlaGF2aW91ci5qcyIsInNyYy9wYXJ0aWNsZS1zeXN0ZW0vYmVoYXZpb3Vycy9XYW5kZXJCZWhhdmlvdXIuanMiLCJzcmMvcGFydGljbGUtc3lzdGVtL2VtaXR0ZXIvRW1pdHRlci5qcyIsInNyYy9wYXJ0aWNsZS1zeXN0ZW0vZW1pdHRlci9FbWl0dGVyU2V0dGluZ3MuanMiLCJzcmMvcGFydGljbGUtc3lzdGVtL3BhcnRpY2xlL1BhcnRpY2xlLmpzIiwic3JjL3BhcnRpY2xlLXN5c3RlbS9wYXJ0aWNsZS9QYXJ0aWNsZVBvb2wuanMiLCJzcmMvcGFydGljbGUtc3lzdGVtL3BhcnRpY2xlL1BhcnRpY2xlU2V0dGluZ3MuanMiLCJzcmMvcGFydGljbGUtc3lzdGVtL3V0aWxzL0NvbXBhY3RBcnJheS5qcyIsInNyYy9wYXJ0aWNsZS1zeXN0ZW0vdXRpbHMvR2VvbWV0cnkuanMiLCJzcmMvcGFydGljbGUtc3lzdGVtL3V0aWxzL1F1aWNrUmFuZ2UuanMiLCJzcmMvcGFydGljbGUtc3lzdGVtL3V0aWxzL1JhbmdlLmpzIiwic3JjL3BhcnRpY2xlLXN5c3RlbS91dGlscy9UZXh0dXJlR2VuZXJhdG9yLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaktBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25JQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2SUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIihmdW5jdGlvbihxLG4pe2Z1bmN0aW9uIGYoYyxiKXtpZihudWxsPT1iKXJldHVybiBudWxsO251bGw9PWIuX19pZF9fJiYoYi5fX2lkX189cCsrKTt2YXIgYTtudWxsPT1jLmh4X19jbG9zdXJlc19fP2MuaHhfX2Nsb3N1cmVzX189e306YT1jLmh4X19jbG9zdXJlc19fW2IuX19pZF9fXTtudWxsPT1hJiYoYT1mdW5jdGlvbigpe3JldHVybiBhLm1ldGhvZC5hcHBseShhLnNjb3BlLGFyZ3VtZW50cyl9LGEuc2NvcGU9YyxhLm1ldGhvZD1iLGMuaHhfX2Nsb3N1cmVzX19bYi5fX2lkX19dPWEpO3JldHVybiBhfXZhciBkPW4uUGVyZj1mdW5jdGlvbihjLGIpe251bGw9PWImJihiPTApO251bGw9PWMmJihjPVwiVFJcIik7dmFyIGE9dGhpczt0aGlzLl9kaXZFbGVtZW50cz1bXTt0aGlzLl9wZXJmT2JqPXdpbmRvdy5wZXJmb3JtYW5jZTtudWxsIT1nLmZpZWxkKHRoaXMuX3BlcmZPYmosXCJtZW1vcnlcIikmJih0aGlzLl9tZW1vcnlPYmo9Zy5maWVsZCh0aGlzLl9wZXJmT2JqLFwibWVtb3J5XCIpKTtcbnRoaXMuX21lbUNoZWNrPW51bGwhPXRoaXMuX3BlcmZPYmomJm51bGwhPXRoaXMuX21lbW9yeU9iaiYmMDx0aGlzLl9tZW1vcnlPYmoudG90YWxKU0hlYXBTaXplO3RoaXMuX3Bvcz1jO3RoaXMuX29mZnNldD1iO3RoaXMuY3VycmVudEZwcz02MDt0aGlzLmN1cnJlbnRNcz0wO3RoaXMuY3VycmVudE1lbT1cIjBcIjt0aGlzLmF2Z0Zwcz10aGlzLmxvd0Zwcz02MDt0aGlzLl90aWNrcz10aGlzLl90aW1lPXRoaXMuX3RvdGFsRnBzPXRoaXMuX21lYXN1cmVDb3VudD0wO3RoaXMuX2Zwc01heD10aGlzLl9mcHNNaW49NjA7bnVsbCE9dGhpcy5fcGVyZk9iaiYmbnVsbCE9KGU9dGhpcy5fcGVyZk9iaixmKGUsZS5ub3cpKT90aGlzLl9zdGFydFRpbWU9dGhpcy5fcGVyZk9iai5ub3coKTp0aGlzLl9zdGFydFRpbWU9KG5ldyBEYXRlKS5nZXRUaW1lKCk7dGhpcy5fcHJldlRpbWU9LWQuTUVBU1VSRU1FTlRfSU5URVJWQUw7dGhpcy5fY3JlYXRlRnBzRG9tKCk7dGhpcy5fY3JlYXRlTXNEb20oKTt0aGlzLl9tZW1DaGVjayYmXG50aGlzLl9jcmVhdGVNZW1vcnlEb20oKTt2YXIgaz0wLGw9bnVsbDtudWxsIT0oZT13aW5kb3csZihlLGUucmVxdWVzdEFuaW1hdGlvbkZyYW1lKSk/dGhpcy5SQUY9KGU9d2luZG93LGYoZSxlLnJlcXVlc3RBbmltYXRpb25GcmFtZSkpOnRoaXMuUkFGPWZ1bmN0aW9uKGIpe3ZhciBjO2M9bnVsbCE9YS5fcGVyZk9iaiYmbnVsbCE9KGU9YS5fcGVyZk9iaixmKGUsZS5ub3cpKT9hLl9wZXJmT2JqLm5vdygpOihuZXcgRGF0ZSkuZ2V0VGltZSgpO3ZhciBkPW1bXCJpbnRcIl0oTWF0aC5tYXgoMCwxNi0oYy1rKSkpO2w9aC5kZWxheShmdW5jdGlvbigpe2IoYytkKX0sZCk7az1jK2Q7cmV0dXJuIGx9O251bGwhPShlPXdpbmRvdyxmKGUsZS5jYW5jZWxBbmltYXRpb25GcmFtZSkpP3RoaXMuQ0FGPShlPXdpbmRvdyxmKGUsZS5jYW5jZWxBbmltYXRpb25GcmFtZSkpOnRoaXMuQ0FGPWZ1bmN0aW9uKGEpe251bGwhPWEmJmEuc3RvcCgpfTtudWxsIT10aGlzLlJBRiYmKHRoaXMuX3JhZj1nLmNhbGxNZXRob2Qod2luZG93LFxudGhpcy5SQUYsW2YodGhpcyx0aGlzLl90aWNrKV0pKX07ZC5wcm90b3R5cGU9e19pbml0OmZ1bmN0aW9uKCl7dGhpcy5jdXJyZW50RnBzPTYwO3RoaXMuY3VycmVudE1zPTA7dGhpcy5jdXJyZW50TWVtPVwiMFwiO3RoaXMuYXZnRnBzPXRoaXMubG93RnBzPTYwO3RoaXMuX3RpY2tzPXRoaXMuX3RpbWU9dGhpcy5fdG90YWxGcHM9dGhpcy5fbWVhc3VyZUNvdW50PTA7dGhpcy5fZnBzTWF4PXRoaXMuX2Zwc01pbj02MDtudWxsIT10aGlzLl9wZXJmT2JqJiZudWxsIT0oZT10aGlzLl9wZXJmT2JqLGYoZSxlLm5vdykpP3RoaXMuX3N0YXJ0VGltZT10aGlzLl9wZXJmT2JqLm5vdygpOnRoaXMuX3N0YXJ0VGltZT0obmV3IERhdGUpLmdldFRpbWUoKTt0aGlzLl9wcmV2VGltZT0tZC5NRUFTVVJFTUVOVF9JTlRFUlZBTH0sX25vdzpmdW5jdGlvbigpe3JldHVybiBudWxsIT10aGlzLl9wZXJmT2JqJiZudWxsIT0oZT10aGlzLl9wZXJmT2JqLGYoZSxlLm5vdykpP3RoaXMuX3BlcmZPYmoubm93KCk6XG4obmV3IERhdGUpLmdldFRpbWUoKX0sX3RpY2s6ZnVuY3Rpb24oYyl7dmFyIGI7Yj1udWxsIT10aGlzLl9wZXJmT2JqJiZudWxsIT0oZT10aGlzLl9wZXJmT2JqLGYoZSxlLm5vdykpP3RoaXMuX3BlcmZPYmoubm93KCk6KG5ldyBEYXRlKS5nZXRUaW1lKCk7dGhpcy5fdGlja3MrKztudWxsIT10aGlzLl9yYWYmJmI+dGhpcy5fcHJldlRpbWUrZC5NRUFTVVJFTUVOVF9JTlRFUlZBTCYmKHRoaXMuY3VycmVudE1zPU1hdGgucm91bmQoYi10aGlzLl9zdGFydFRpbWUpLHRoaXMubXMuaW5uZXJIVE1MPVwiTVM6IFwiK3RoaXMuY3VycmVudE1zLHRoaXMuY3VycmVudEZwcz1NYXRoLnJvdW5kKDFFMyp0aGlzLl90aWNrcy8oYi10aGlzLl9wcmV2VGltZSkpLDYwPHRoaXMuY3VycmVudEZwcyYmKHRoaXMuY3VycmVudEZwcz02MCksMDx0aGlzLmN1cnJlbnRGcHMmJmM+ZC5ERUxBWV9USU1FJiYodGhpcy5fbWVhc3VyZUNvdW50KyssdGhpcy5fdG90YWxGcHMrPXRoaXMuY3VycmVudEZwcyx0aGlzLmxvd0Zwcz1cbnRoaXMuX2Zwc01pbj1NYXRoLm1pbih0aGlzLl9mcHNNaW4sdGhpcy5jdXJyZW50RnBzKSx0aGlzLl9mcHNNYXg9TWF0aC5tYXgodGhpcy5fZnBzTWF4LHRoaXMuY3VycmVudEZwcyksdGhpcy5hdmdGcHM9TWF0aC5yb3VuZCh0aGlzLl90b3RhbEZwcy90aGlzLl9tZWFzdXJlQ291bnQpKSx0aGlzLmZwcy5pbm5lckhUTUw9XCJGUFM6IFwiK3RoaXMuY3VycmVudEZwcytcIiAoXCIrdGhpcy5fZnBzTWluK1wiLVwiK3RoaXMuX2Zwc01heCtcIilcIix0aGlzLmZwcy5zdHlsZS5iYWNrZ3JvdW5kQ29sb3I9MzA8PXRoaXMuY3VycmVudEZwcz9kLkZQU19CR19DTFI6MTU8PXRoaXMuY3VycmVudEZwcz9kLkZQU19XQVJOX0JHX0NMUjpkLkZQU19QUk9CX0JHX0NMUix0aGlzLl9wcmV2VGltZT1iLHRoaXMuX3RpY2tzPTAsdGhpcy5fbWVtQ2hlY2smJih0aGlzLmN1cnJlbnRNZW09dGhpcy5fZ2V0Rm9ybWF0dGVkU2l6ZSh0aGlzLl9tZW1vcnlPYmoudXNlZEpTSGVhcFNpemUsMiksdGhpcy5tZW1vcnkuaW5uZXJIVE1MPVxuXCJNRU06IFwiK3RoaXMuY3VycmVudE1lbSkpO3RoaXMuX3N0YXJ0VGltZT1iO251bGwhPXRoaXMuX3JhZiYmKHRoaXMuX3JhZj1nLmNhbGxNZXRob2Qod2luZG93LHRoaXMuUkFGLFtmKHRoaXMsdGhpcy5fdGljayldKSl9LF9jcmVhdGVEaXY6ZnVuY3Rpb24oYyxiKXtudWxsPT1iJiYoYj0wKTt2YXIgYTthPXdpbmRvdy5kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO2EuaWQ9YzthLmNsYXNzTmFtZT1jO2Euc3R5bGUucG9zaXRpb249XCJhYnNvbHV0ZVwiO3N3aXRjaCh0aGlzLl9wb3Mpe2Nhc2UgXCJUTFwiOmEuc3R5bGUubGVmdD10aGlzLl9vZmZzZXQrXCJweFwiO2Euc3R5bGUudG9wPWIrXCJweFwiO2JyZWFrO2Nhc2UgXCJUUlwiOmEuc3R5bGUucmlnaHQ9dGhpcy5fb2Zmc2V0K1wicHhcIjthLnN0eWxlLnRvcD1iK1wicHhcIjticmVhaztjYXNlIFwiQkxcIjphLnN0eWxlLmxlZnQ9dGhpcy5fb2Zmc2V0K1wicHhcIjthLnN0eWxlLmJvdHRvbT0odGhpcy5fbWVtQ2hlY2s/NDg6MzIpLWIrXCJweFwiO2JyZWFrO1xuY2FzZSBcIkJSXCI6YS5zdHlsZS5yaWdodD10aGlzLl9vZmZzZXQrXCJweFwiLGEuc3R5bGUuYm90dG9tPSh0aGlzLl9tZW1DaGVjaz80ODozMiktYitcInB4XCJ9YS5zdHlsZS53aWR0aD1cIjgwcHhcIjthLnN0eWxlLmhlaWdodD1cIjEycHhcIjthLnN0eWxlLmxpbmVIZWlnaHQ9XCIxMnB4XCI7YS5zdHlsZS5wYWRkaW5nPVwiMnB4XCI7YS5zdHlsZS5mb250RmFtaWx5PWQuRk9OVF9GQU1JTFk7YS5zdHlsZS5mb250U2l6ZT1cIjlweFwiO2Euc3R5bGUuZm9udFdlaWdodD1cImJvbGRcIjthLnN0eWxlLnRleHRBbGlnbj1cImNlbnRlclwiO3dpbmRvdy5kb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGEpO3RoaXMuX2RpdkVsZW1lbnRzLnB1c2goYSk7cmV0dXJuIGF9LF9jcmVhdGVGcHNEb206ZnVuY3Rpb24oKXt0aGlzLmZwcz10aGlzLl9jcmVhdGVEaXYoXCJmcHNcIik7dGhpcy5mcHMuc3R5bGUuYmFja2dyb3VuZENvbG9yPWQuRlBTX0JHX0NMUjt0aGlzLmZwcy5zdHlsZS56SW5kZXg9XCI5OTVcIjt0aGlzLmZwcy5zdHlsZS5jb2xvcj1cbmQuRlBTX1RYVF9DTFI7dGhpcy5mcHMuaW5uZXJIVE1MPVwiRlBTOiAwXCJ9LF9jcmVhdGVNc0RvbTpmdW5jdGlvbigpe3RoaXMubXM9dGhpcy5fY3JlYXRlRGl2KFwibXNcIiwxNik7dGhpcy5tcy5zdHlsZS5iYWNrZ3JvdW5kQ29sb3I9ZC5NU19CR19DTFI7dGhpcy5tcy5zdHlsZS56SW5kZXg9XCI5OTZcIjt0aGlzLm1zLnN0eWxlLmNvbG9yPWQuTVNfVFhUX0NMUjt0aGlzLm1zLmlubmVySFRNTD1cIk1TOiAwXCJ9LF9jcmVhdGVNZW1vcnlEb206ZnVuY3Rpb24oKXt0aGlzLm1lbW9yeT10aGlzLl9jcmVhdGVEaXYoXCJtZW1vcnlcIiwzMik7dGhpcy5tZW1vcnkuc3R5bGUuYmFja2dyb3VuZENvbG9yPWQuTUVNX0JHX0NMUjt0aGlzLm1lbW9yeS5zdHlsZS5jb2xvcj1kLk1FTV9UWFRfQ0xSO3RoaXMubWVtb3J5LnN0eWxlLnpJbmRleD1cIjk5N1wiO3RoaXMubWVtb3J5LmlubmVySFRNTD1cIk1FTTogMFwifSxfZ2V0Rm9ybWF0dGVkU2l6ZTpmdW5jdGlvbihjLGIpe251bGw9PWImJihiPTApO2lmKDA9PWMpcmV0dXJuXCIwXCI7XG52YXIgYT1NYXRoLnBvdygxMCxiKSxkPU1hdGguZmxvb3IoTWF0aC5sb2coYykvTWF0aC5sb2coMTAyNCkpO3JldHVybiBNYXRoLnJvdW5kKGMqYS9NYXRoLnBvdygxMDI0LGQpKS9hK1wiIFwiK1tcIkJ5dGVzXCIsXCJLQlwiLFwiTUJcIixcIkdCXCIsXCJUQlwiXVtkXX0sYWRkSW5mbzpmdW5jdGlvbihjKXt0aGlzLmluZm89dGhpcy5fY3JlYXRlRGl2KFwiaW5mb1wiLHRoaXMuX21lbUNoZWNrPzQ4OjMyKTt0aGlzLmluZm8uc3R5bGUuYmFja2dyb3VuZENvbG9yPWQuSU5GT19CR19DTFI7dGhpcy5pbmZvLnN0eWxlLmNvbG9yPWQuSU5GT19UWFRfQ0xSO3RoaXMuaW5mby5zdHlsZS56SW5kZXg9XCI5OThcIjt0aGlzLmluZm8uaW5uZXJIVE1MPWN9LGNsZWFySW5mbzpmdW5jdGlvbigpe251bGwhPXRoaXMuaW5mbyYmKHdpbmRvdy5kb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKHRoaXMuaW5mbyksdGhpcy5pbmZvPW51bGwpfSxkZXN0cm95OmZ1bmN0aW9uKCl7Zy5jYWxsTWV0aG9kKHdpbmRvdyx0aGlzLkNBRixbdGhpcy5fcmFmXSk7XG50aGlzLl9tZW1vcnlPYmo9dGhpcy5fcGVyZk9iaj10aGlzLl9yYWY9bnVsbDtudWxsIT10aGlzLmZwcyYmKHdpbmRvdy5kb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKHRoaXMuZnBzKSx0aGlzLmZwcz1udWxsKTtudWxsIT10aGlzLm1zJiYod2luZG93LmRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQodGhpcy5tcyksdGhpcy5tcz1udWxsKTtudWxsIT10aGlzLm1lbW9yeSYmKHdpbmRvdy5kb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKHRoaXMubWVtb3J5KSx0aGlzLm1lbW9yeT1udWxsKTt0aGlzLmNsZWFySW5mbygpO3RoaXMuY3VycmVudEZwcz02MDt0aGlzLmN1cnJlbnRNcz0wO3RoaXMuY3VycmVudE1lbT1cIjBcIjt0aGlzLmF2Z0Zwcz10aGlzLmxvd0Zwcz02MDt0aGlzLl90aWNrcz10aGlzLl90aW1lPXRoaXMuX3RvdGFsRnBzPXRoaXMuX21lYXN1cmVDb3VudD0wO3RoaXMuX2Zwc01heD10aGlzLl9mcHNNaW49NjA7bnVsbCE9dGhpcy5fcGVyZk9iaiYmbnVsbCE9KGU9dGhpcy5fcGVyZk9iaixcbmYoZSxlLm5vdykpP3RoaXMuX3N0YXJ0VGltZT10aGlzLl9wZXJmT2JqLm5vdygpOnRoaXMuX3N0YXJ0VGltZT0obmV3IERhdGUpLmdldFRpbWUoKTt0aGlzLl9wcmV2VGltZT0tZC5NRUFTVVJFTUVOVF9JTlRFUlZBTH0saGlkZTpmdW5jdGlvbigpe2Zvcih2YXIgYz0wLGI9dGhpcy5fZGl2RWxlbWVudHM7YzxiLmxlbmd0aDspe3ZhciBhPWJbY107KytjO2Euc3R5bGUudmlzaWJpbGl0eT1cImhpZGRlblwifX0sc2hvdzpmdW5jdGlvbigpe2Zvcih2YXIgYz0wLGI9dGhpcy5fZGl2RWxlbWVudHM7YzxiLmxlbmd0aDspe3ZhciBhPWJbY107KytjO2Euc3R5bGUudmlzaWJpbGl0eT1cInZpc2libGVcIn19LF9jYW5jZWxSQUY6ZnVuY3Rpb24oKXtnLmNhbGxNZXRob2Qod2luZG93LHRoaXMuQ0FGLFt0aGlzLl9yYWZdKTt0aGlzLl9yYWY9bnVsbH19O3ZhciBnPWZ1bmN0aW9uKCl7fTtnLmZpZWxkPWZ1bmN0aW9uKGMsYil7dHJ5e3JldHVybiBjW2JdfWNhdGNoKGEpe3JldHVybiBudWxsfX07Zy5jYWxsTWV0aG9kPVxuZnVuY3Rpb24oYyxiLGEpe3JldHVybiBiLmFwcGx5KGMsYSl9O3ZhciBtPWZ1bmN0aW9uKCl7fTttW1wiaW50XCJdPWZ1bmN0aW9uKGMpe3JldHVybiBjfDB9O3ZhciBoPWZ1bmN0aW9uKGMpe3ZhciBiPXRoaXM7dGhpcy5pZD1zZXRJbnRlcnZhbChmdW5jdGlvbigpe2IucnVuKCl9LGMpfTtoLmRlbGF5PWZ1bmN0aW9uKGMsYil7dmFyIGE9bmV3IGgoYik7YS5ydW49ZnVuY3Rpb24oKXthLnN0b3AoKTtjKCl9O3JldHVybiBhfTtoLnByb3RvdHlwZT17c3RvcDpmdW5jdGlvbigpe251bGwhPXRoaXMuaWQmJihjbGVhckludGVydmFsKHRoaXMuaWQpLHRoaXMuaWQ9bnVsbCl9LHJ1bjpmdW5jdGlvbigpe319O3ZhciBlLHA9MDtkLk1FQVNVUkVNRU5UX0lOVEVSVkFMPTFFMztkLkZPTlRfRkFNSUxZPVwiSGVsdmV0aWNhLEFyaWFsXCI7ZC5GUFNfQkdfQ0xSPVwiIzAwRkYwMFwiO2QuRlBTX1dBUk5fQkdfQ0xSPVwiI0ZGODAwMFwiO2QuRlBTX1BST0JfQkdfQ0xSPVwiI0ZGMDAwMFwiO2QuTVNfQkdfQ0xSPVxuXCIjRkZGRjAwXCI7ZC5NRU1fQkdfQ0xSPVwiIzA4NkE4N1wiO2QuSU5GT19CR19DTFI9XCIjMDBGRkZGXCI7ZC5GUFNfVFhUX0NMUj1cIiMwMDAwMDBcIjtkLk1TX1RYVF9DTFI9XCIjMDAwMDAwXCI7ZC5NRU1fVFhUX0NMUj1cIiNGRkZGRkZcIjtkLklORk9fVFhUX0NMUj1cIiMwMDAwMDBcIjtkLlRPUF9MRUZUPVwiVExcIjtkLlRPUF9SSUdIVD1cIlRSXCI7ZC5CT1RUT01fTEVGVD1cIkJMXCI7ZC5CT1RUT01fUklHSFQ9XCJCUlwiO2QuREVMQVlfVElNRT00RTN9KShcInVuZGVmaW5lZFwiIT10eXBlb2YgY29uc29sZT9jb25zb2xlOntsb2c6ZnVuY3Rpb24oKXt9fSxcInVuZGVmaW5lZFwiIT10eXBlb2Ygd2luZG93P3dpbmRvdzpleHBvcnRzKTtcbiIsIkZpcmV3b3JrRGlzcGxheS5jb25zdHJ1Y3RvciA9IEZpcmV3b3JrRGlzcGxheTtcbkZpcmV3b3JrRGlzcGxheS5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKFBJWEkuQ29udGFpbmVyLnByb3RvdHlwZSk7XG5cbnZhciBSaXBwbGVFZmZlY3QgPSByZXF1aXJlKCcuL2VmZmVjdHMvUmlwcGxlRWZmZWN0Jyk7XG52YXIgVGV4dHVyZUdlbmVyYXRvciA9IHJlcXVpcmUoJy4vcGFydGljbGUtc3lzdGVtL3V0aWxzL1RleHR1cmVHZW5lcmF0b3InKTtcbnZhciBGaXJld29yazEgPSByZXF1aXJlKCcuL2VmZmVjdHMvRmlyZXdvcmsxJyk7XG52YXIgRmlyZXdvcmsyID0gcmVxdWlyZSgnLi9lZmZlY3RzL0ZpcmV3b3JrMicpO1xudmFyIEZpcmV3b3JrMyA9IHJlcXVpcmUoJy4vZWZmZWN0cy9GaXJld29yazMnKTtcbnZhciBGaXJld29yazQgPSByZXF1aXJlKCcuL2VmZmVjdHMvRmlyZXdvcms0Jyk7XG52YXIgUmFpbiA9IHJlcXVpcmUoJy4vZWZmZWN0cy9SYWluJyk7XG52YXIgRmlyZSA9IHJlcXVpcmUoJy4vZWZmZWN0cy9GaXJlJyk7XG52YXIgRWxlbWVudGFsRHJhZ29uID0gcmVxdWlyZSgnLi9lZmZlY3RzL0VsZW1lbnRhbERyYWdvbicpO1xuXG5mdW5jdGlvbiBGaXJld29ya0Rpc3BsYXkoKSB7XG4gICAgUElYSS5Db250YWluZXIuY2FsbCh0aGlzKTtcblxuICAgIHRoaXMuc2V0dXBCYWNrZ3JvdW5kKCk7XG5cbiAgICB0aGlzLmVmZmVjdHMgPSBbXTtcbiAgICB0aGlzLmFkZEVmZmVjdChuZXcgRmlyZXdvcmsxKCkpO1xuICAgIHRoaXMuYWRkRWZmZWN0KG5ldyBGaXJld29yazIoKSk7XG4gICAgdGhpcy5hZGRFZmZlY3QobmV3IEZpcmV3b3JrMygpKTtcbiAgICB0aGlzLmFkZEVmZmVjdChuZXcgRmlyZXdvcms0KCkpO1xuICAgIHRoaXMuYWRkRWZmZWN0KG5ldyBSYWluKCkpO1xuICAgIHRoaXMuYWRkRWZmZWN0KG5ldyBGaXJlKCkpO1xuICAgIHRoaXMuYWRkRWZmZWN0KG5ldyBFbGVtZW50YWxEcmFnb24oKSk7XG5cbiAgICB0aGlzLmFkZEJ1dHRvbnMoKTtcbn1cblxuRmlyZXdvcmtEaXNwbGF5LnByb3RvdHlwZS5zZXR1cEJhY2tncm91bmQgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgYmFja2dyb3VuZCA9IG5ldyBQSVhJLlNwcml0ZS5mcm9tSW1hZ2UoJy4uL3Jlc291cmNlcy9iYWNrZ3JvdW5kLnBuZycpO1xuICAgIGJhY2tncm91bmQuYW5jaG9yPSB7eDowLjUsIHk6MX07XG4gICAgYmFja2dyb3VuZC54ID0gd2luZG93LmlubmVyV2lkdGggLyAyO1xuICAgIGJhY2tncm91bmQueSA9IHdpbmRvdy5pbm5lckhlaWdodCAtIDEwMDtcbiAgICBcbiAgICB0aGlzLmFkZENoaWxkKGJhY2tncm91bmQpO1xuXG4gICAgdGhpcy5yaXBwbGVFZmZlY3QgPSBuZXcgUmlwcGxlRWZmZWN0KHt4OiB3aW5kb3cuaW5uZXJXaWR0aCAvIDIsIHk6d2luZG93LmlubmVySGVpZ2h0IC0gMTUwfSk7XG4gICAgdGhpcy5hZGRDaGlsZCh0aGlzLnJpcHBsZUVmZmVjdCk7XG59XG5cbkZpcmV3b3JrRGlzcGxheS5wcm90b3R5cGUuYWRkRWZmZWN0ID0gZnVuY3Rpb24oZWZmZWN0KSB7XG4gICAgdGhpcy5lZmZlY3RzLnB1c2goZWZmZWN0KTtcbiAgICB0aGlzLmFkZENoaWxkKGVmZmVjdCk7XG59O1xuXG5GaXJld29ya0Rpc3BsYXkucHJvdG90eXBlLmFkZEJ1dHRvbnMgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgcGFkZGluZyA9IDEwO1xuICAgIHZhciBidXR0b25XaWR0aCA9ICh3aW5kb3cuaW5uZXJXaWR0aCAtIChwYWRkaW5nICogKHRoaXMuZWZmZWN0cy5sZW5ndGggKyAxKSkpIC8gdGhpcy5lZmZlY3RzLmxlbmd0aDtcbiAgICB2YXIgYnV0dG9uSGVpZ2h0ID0gNTA7XG5cbiAgICBmb3IodmFyIGkgPSAwOyBpIDwgdGhpcy5lZmZlY3RzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHRoaXMuYWRkQnV0dG9uKHBhZGRpbmcgKyAoaSAqIChidXR0b25XaWR0aCArIHBhZGRpbmcpKSwgd2luZG93LmlubmVySGVpZ2h0IC0gcGFkZGluZyAtIGJ1dHRvbkhlaWdodCwgYnV0dG9uV2lkdGgsIGJ1dHRvbkhlaWdodCwgdGhpcy5zdGFydEVmZmVjdC5iaW5kKHRoaXMsIHRoaXMuZWZmZWN0c1tpXSkpO1xuICAgIH1cbn07XG5cbkZpcmV3b3JrRGlzcGxheS5wcm90b3R5cGUuc3RhcnRFZmZlY3QgPSBmdW5jdGlvbihlZmZlY3QpIHtcbiAgICBlZmZlY3Quc3RhcnQoKTtcbn07XG5cbkZpcmV3b3JrRGlzcGxheS5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5yaXBwbGVFZmZlY3QudXBkYXRlKCk7XG5cbiAgICBmb3IodmFyIGkgPSAwOyBpIDwgdGhpcy5lZmZlY3RzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHRoaXMuZWZmZWN0c1tpXS51cGRhdGUoKTtcbiAgICB9XG59O1xuXG5GaXJld29ya0Rpc3BsYXkucHJvdG90eXBlLmFkZEJ1dHRvbiA9IGZ1bmN0aW9uKHgsIHksIHdpZHRoLCBoZWlnaHQsIGNhbGxiYWNrKSB7XG4gICAgdmFyIHRleHR1cmUgPSBUZXh0dXJlR2VuZXJhdG9yLnJlY3RhbmdsZSh3aWR0aCwgaGVpZ2h0LCAweDI2ODY5NCk7XG4gICAgdmFyIHNwcml0ZSA9IG5ldyBQSVhJLlNwcml0ZSh0ZXh0dXJlKTtcbiAgICBzcHJpdGUueCA9IHg7XG4gICAgc3ByaXRlLnkgPSB5O1xuICAgIHNwcml0ZS5pbnRlcmFjdGl2ZSA9IHRydWU7XG4gICAgc3ByaXRlLm1vdXNlZG93biA9IHNwcml0ZS50b3VjaGVuZCA9IGNhbGxiYWNrO1xuICAgIHNwcml0ZS5idXR0b25Nb2RlID0gdHJ1ZTtcblxuICAgIHRoaXMuYWRkQ2hpbGQoc3ByaXRlKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gRmlyZXdvcmtEaXNwbGF5OyIsInZhciBGaXJld29ya0Rpc3BsYXkgPSByZXF1aXJlKCcuLi9zcmMvRmlyZXdvcmtEaXNwbGF5Jyk7XG52YXIgb3JpZ2luYWxXaW5kb3dTaXplLCBmaXJld29ya0Rpc3BsYXksIHN0YWdlO1xuXG5yZXF1aXJlKFwicGVyZi5qc1wiKTtcblxud2luZG93Lm9ubG9hZCA9IGluaXQ7XG5cbmZ1bmN0aW9uIGluaXQoKSB7XG4gICAgb3JpZ2luYWxXaW5kb3dTaXplID0ge3dpZHRoOndpbmRvdy5pbm5lcldpZHRoLCBoZWlnaHQ6d2luZG93LmlubmVySGVpZ2h0fTtcbiAgICB0aGlzLmZwc1N0YXRzID0gbmV3IFBlcmYoUGVyZi5UT1BfTEVGVCk7XG5cbiAgICB0aGlzLmxvYWRlciA9IFBJWEkubG9hZGVyXG4gICAgICAgIC5hZGQoJ3JpcHBsZScsICcuLi9yZXNvdXJjZXMvcmlwcGxlLnBuZycpXG4gICAgICAgIC5hZGQoJ3Ntb2tlMScsICcuLi9yZXNvdXJjZXMvc21va2UxLnBuZycpXG4gICAgICAgIC5hZGQoJ3Ntb2tlMicsICcuLi9yZXNvdXJjZXMvc21va2UyLnBuZycpXG4gICAgICAgIC5hZGQoJ3Ntb2tlMycsICcuLi9yZXNvdXJjZXMvc21va2UzLnBuZycpXG4gICAgICAgIC5hZGQoJ3Ntb2tlNCcsICcuLi9yZXNvdXJjZXMvc21va2U0LnBuZycpXG4gICAgICAgIC5hZGQoJ2JvZHlQYXJ0MScsICcuLi9yZXNvdXJjZXMvYm9keVBhcnQxLnBuZycpXG4gICAgICAgIC5sb2FkKHRleHR1cmVzTG9hZGVkKTtcbn1cblxuZnVuY3Rpb24gdGV4dHVyZXNMb2FkZWQgKGxvYWRlciwgcmVzb3VyY2VzKSB7XG4gICAgc2V0dXBTdGFnZSgpO1xuICAgIHNldHVwRmlyZXdvcmtEaXNwbGF5KCk7XG4gICAgdXBkYXRlKCk7XG59XG5cbmZ1bmN0aW9uIHNldHVwU3RhZ2UoKSB7XG4gICAgdGhpcy5hcHAgPSBuZXcgUElYSS5BcHBsaWNhdGlvbih3aW5kb3cuaW5uZXJXaWR0aCwgd2luZG93LmlubmVySGVpZ2h0KTtcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHRoaXMuYXBwLnZpZXcpO1xuICAgIHRoaXMuYXBwLnRpY2tlci5hZGQodXBkYXRlKTtcbn1cblxuZnVuY3Rpb24gc2V0dXBGaXJld29ya0Rpc3BsYXkoKSB7XG4gICAgZmlyZXdvcmtEaXNwbGF5ID0gbmV3IEZpcmV3b3JrRGlzcGxheSgpO1xuICAgIHRoaXMuYXBwLnN0YWdlLmFkZENoaWxkKGZpcmV3b3JrRGlzcGxheSk7XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZSgpIHtcbiAgICBUV0VFTi51cGRhdGUoKTtcblxuICAgIGZpcmV3b3JrRGlzcGxheS51cGRhdGUoKTtcblxuICAgIGlmKG9yaWdpbmFsV2luZG93U2l6ZS53aWR0aCAhPT0gd2luZG93LmlubmVyV2lkdGggfHwgb3JpZ2luYWxXaW5kb3dTaXplLmhlaWdodCAhPT0gd2luZG93LmlubmVySGVpZ2h0KSB7XG4gICAgICAgIHdpbmRvdy5sb2NhdGlvbiA9IHdpbmRvdy5sb2NhdGlvbjtcbiAgICB9XG59IiwiRWxlbWVudGFsRHJhZ29uLmNvbnN0cnVjdG9yID0gRWxlbWVudGFsRHJhZ29uO1xuRWxlbWVudGFsRHJhZ29uLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoUElYSS5Db250YWluZXIucHJvdG90eXBlKTtcblxudmFyIEVtaXR0ZXIgPSByZXF1aXJlKCcuLy4uL3BhcnRpY2xlLXN5c3RlbS9lbWl0dGVyL0VtaXR0ZXInKTtcbnZhciBFbWl0dGVyU2V0dGluZ3MgPSByZXF1aXJlKCcuLy4uL3BhcnRpY2xlLXN5c3RlbS9lbWl0dGVyL0VtaXR0ZXJTZXR0aW5ncycpO1xudmFyIFBhcnRpY2xlU2V0dGluZ3MgPSByZXF1aXJlKCcuLy4uL3BhcnRpY2xlLXN5c3RlbS9wYXJ0aWNsZS9QYXJ0aWNsZVNldHRpbmdzJyk7XG52YXIgVGV4dHVyZUdlbmVyYXRvciA9IHJlcXVpcmUoJy4vLi4vcGFydGljbGUtc3lzdGVtL3V0aWxzL1RleHR1cmVHZW5lcmF0b3InKTtcbnZhciBMaWZlQmVoYXZpb3VyID0gcmVxdWlyZSgnLi8uLi9wYXJ0aWNsZS1zeXN0ZW0vYmVoYXZpb3Vycy9MaWZlQmVoYXZpb3VyJyk7XG52YXIgVmVsb2NpdHlCZWhhdmlvdXIgPSByZXF1aXJlKCcuLy4uL3BhcnRpY2xlLXN5c3RlbS9iZWhhdmlvdXJzL1ZlbG9jaXR5QmVoYXZpb3VyJyk7XG52YXIgR2VvbWV0cnkgPSByZXF1aXJlKCcuLy4uL3BhcnRpY2xlLXN5c3RlbS91dGlscy9HZW9tZXRyeScpO1xuXG5mdW5jdGlvbiBFbGVtZW50YWxEcmFnb24oKSB7XG4gICAgUElYSS5Db250YWluZXIuY2FsbCh0aGlzKTtcblxuICAgIHRoaXMudHJhaWxFbWl0dGVycyA9IFtdO1xuXG4gICAgdGhpcy5zZXR1cEJvZHlQYXJ0aWNsZXMoKTtcbiAgICB0aGlzLnNldHVwQm9keVNtb2tlKCk7XG4gICAgdGhpcy5zZXR1cEhlYWRBbmRUYWlsKCk7XG5cbiAgICB0aGlzLmRyYWdvblJvdGF0aW9uWCA9IDA7XG4gICAgdGhpcy5kcmFnb25Sb3RhdGlvblkgPSAwO1xuICAgIHRoaXMubW91c2VUcmFpbCA9IGZhbHNlO1xufVxuXG5FbGVtZW50YWxEcmFnb24ucHJvdG90eXBlLnNldHVwSGVhZEFuZFRhaWwgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLmhlYWQgPSBuZXcgUElYSS5TcHJpdGUuZnJvbUltYWdlKCcuLi9yZXNvdXJjZXMvZHJhZ29uSGVhZC5wbmcnKTtcbiAgICB0aGlzLmhlYWQuYW5jaG9yLnkgPSAuNTtcbiAgICB0aGlzLmhlYWQuYW5jaG9yLnggPSAuNTtcbn07XG5cbkVsZW1lbnRhbERyYWdvbi5wcm90b3R5cGUuc2V0dXBCb2R5UGFydGljbGVzID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHBhcnRpY2xlU2V0dGluZ3MgPSBuZXcgUGFydGljbGVTZXR0aW5ncygpO1xuICAgIHBhcnRpY2xlU2V0dGluZ3Muc2V0TGlmZSg1MCwgMTAwLCAxMCwgNTApO1xuICAgIHBhcnRpY2xlU2V0dGluZ3Muc2V0U3BlZWQoLjIsIC41KTtcbiAgICBwYXJ0aWNsZVNldHRpbmdzLnNldERpcmVjdGlvbigtTWF0aC5QSSAqIDIsIE1hdGguUEkgKiAyKTtcbiAgICBwYXJ0aWNsZVNldHRpbmdzLnNldFNjYWxlKC4yLCAxLjUpO1xuICAgIHBhcnRpY2xlU2V0dGluZ3Muc2V0Um90YXRpb24oLU1hdGguUEkgKiAyLCBNYXRoLlBJICogMik7XG4gICAgcGFydGljbGVTZXR0aW5ncy5hZGRCZWhhdmlvdXIoVmVsb2NpdHlCZWhhdmlvdXIpO1xuICAgIHBhcnRpY2xlU2V0dGluZ3MuYWRkQmVoYXZpb3VyKExpZmVCZWhhdmlvdXIpO1xuICAgIHBhcnRpY2xlU2V0dGluZ3MuYWRkQmVoYXZpb3VyKFJvdGF0aW9uQmVoYXZpb3VyKTtcbiAgICBwYXJ0aWNsZVNldHRpbmdzLmFkZFRleHR1cmUoVGV4dHVyZUdlbmVyYXRvci5jaXJjbGUoMiwgMHhmZmZmZmYsIHRydWUpKTtcbiAgICBwYXJ0aWNsZVNldHRpbmdzLmFkZFRleHR1cmUoVGV4dHVyZUdlbmVyYXRvci5jaXJjbGUoMSwgMHhmZmZmZmYsIHRydWUpKTtcblxuICAgIHZhciBlbWl0dGVyU2V0dGluZ3MgPSBuZXcgRW1pdHRlclNldHRpbmdzKCk7XG4gICAgZW1pdHRlclNldHRpbmdzLnNldFF1YW50aXR5KDE1MCk7XG4gICAgZW1pdHRlclNldHRpbmdzLnNldFJlc3Bhd24odHJ1ZSk7XG4gICAgZW1pdHRlclNldHRpbmdzLnNldEJvdW5kcyh7dHlwZTpcIkNJUkNMRVwiLCByYWRpdXM6XCIyMFwifSk7XG4gICAgZW1pdHRlclNldHRpbmdzLnNldFNwYXduRGVsYXkoMCwgMTAwMCk7XG5cbiAgICB0aGlzLmJvZHlQYXJ0aWNsZXNFbWl0dGVyID0gbmV3IEVtaXR0ZXIodGhpcywgcGFydGljbGVTZXR0aW5ncywgZW1pdHRlclNldHRpbmdzKTtcbn07XG5cbkVsZW1lbnRhbERyYWdvbi5wcm90b3R5cGUuc2V0dXBCb2R5U21va2UgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgcGFydGljbGVTZXR0aW5ncyA9IG5ldyBQYXJ0aWNsZVNldHRpbmdzKCk7XG4gICAgcGFydGljbGVTZXR0aW5ncy5zZXRMaWZlKDUwLCAxMDAsIDAsIDApO1xuICAgIHBhcnRpY2xlU2V0dGluZ3Muc2V0U3BlZWQoLjEsIC4yKTtcbiAgICBwYXJ0aWNsZVNldHRpbmdzLnNldERpcmVjdGlvbigtTWF0aC5QSSAqIDIsIE1hdGguUEkgKiAyKTtcbiAgICBwYXJ0aWNsZVNldHRpbmdzLnNldFNjYWxlKC41LCAxKTtcbiAgICBwYXJ0aWNsZVNldHRpbmdzLnNldEFscGhhKC4wMSwgLjEpO1xuICAgIHBhcnRpY2xlU2V0dGluZ3Muc2V0Um90YXRpb24oLU1hdGguUEkgKiAyLCBNYXRoLlBJICogMik7XG4gICAgcGFydGljbGVTZXR0aW5ncy5hZGRCZWhhdmlvdXIoVmVsb2NpdHlCZWhhdmlvdXIpO1xuICAgIHBhcnRpY2xlU2V0dGluZ3MuYWRkQmVoYXZpb3VyKExpZmVCZWhhdmlvdXIpO1xuICAgIHBhcnRpY2xlU2V0dGluZ3MuYWRkQmVoYXZpb3VyKFJvdGF0aW9uQmVoYXZpb3VyKTtcbiAgICBwYXJ0aWNsZVNldHRpbmdzLmFkZEJlaGF2aW91cihUaW50RHJhZ29uQm9keUJlaGF2aW91cik7XG4gICAgcGFydGljbGVTZXR0aW5ncy5hZGRUZXh0dXJlKFBJWEkubG9hZGVyLnJlc291cmNlc1snc21va2UxJ10udGV4dHVyZSk7XG4gICAgcGFydGljbGVTZXR0aW5ncy5hZGRUZXh0dXJlKFBJWEkubG9hZGVyLnJlc291cmNlc1snc21va2UyJ10udGV4dHVyZSk7XG4gICAgcGFydGljbGVTZXR0aW5ncy5hZGRUZXh0dXJlKFBJWEkubG9hZGVyLnJlc291cmNlc1snc21va2UzJ10udGV4dHVyZSk7XG4gICAgcGFydGljbGVTZXR0aW5ncy5hZGRUZXh0dXJlKFBJWEkubG9hZGVyLnJlc291cmNlc1snc21va2U0J10udGV4dHVyZSk7XG5cbiAgICB2YXIgZW1pdHRlclNldHRpbmdzID0gbmV3IEVtaXR0ZXJTZXR0aW5ncygpO1xuICAgIGVtaXR0ZXJTZXR0aW5ncy5zZXRRdWFudGl0eSgzMDApO1xuICAgIGVtaXR0ZXJTZXR0aW5ncy5zZXRSZXNwYXduKHRydWUpO1xuICAgIGVtaXR0ZXJTZXR0aW5ncy5zZXRCb3VuZHMoe3R5cGU6XCJDSVJDTEVcIiwgcmFkaXVzOlwiMjBcIn0pO1xuICAgIGVtaXR0ZXJTZXR0aW5ncy5zZXRTcGF3bkRlbGF5KDAsIDEwMDApO1xuXG4gICAgdGhpcy5ib2R5U21va2VFbWl0dGVyID0gbmV3IEVtaXR0ZXIodGhpcywgcGFydGljbGVTZXR0aW5ncywgZW1pdHRlclNldHRpbmdzKTtcbn07XG5cbkVsZW1lbnRhbERyYWdvbi5wcm90b3R5cGUuc3RhcnQgPSBmdW5jdGlvbigpIHtcbiAgICBpZih0aGlzLnN0YXJ0ZWQgIT09IHRydWUpIHtcbiAgICAgICAgdGhpcy5zdGFydGVkID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5wb3MgPSB7eDp3aW5kb3cuaW5uZXJXaWR0aCAvIDIsIHk6d2luZG93LmlubmVySGVpZ2h0IC8gMn07XG4gICAgICAgIHRoaXMuYm9keVBhcnRpY2xlc0VtaXR0ZXIuc3RhcnQoKTtcbiAgICAgICAgdGhpcy5ib2R5U21va2VFbWl0dGVyLnN0YXJ0KCk7XG4gICAgICAgIHRoaXMuYWRkQ2hpbGQodGhpcy5oZWFkKTtcbiAgICAgICAgdGhpcy5oZWFkVHdlZW4gPSBuZXcgVFdFRU4uVHdlZW4odGhpcy5wb3MpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMubW91c2VUcmFpbCA9IHRydWU7XG4gICAgfVxufTtcblxuRWxlbWVudGFsRHJhZ29uLnByb3RvdHlwZS5zdGFydE1vdXNlVHJhaWwgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLm1vdXNlVHJhaWwgPSB0cnVlO1xufTtcblxuRWxlbWVudGFsRHJhZ29uLnByb3RvdHlwZS5nZXRQb3NpdGlvbiA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciB0YXJnZXQgPSB7fTtcblxuICAgIGlmKHRoaXMubW91c2VUcmFpbCkge1xuICAgICAgICB0YXJnZXQgPSByZW5kZXJlci5wbHVnaW5zLmludGVyYWN0aW9uLm1vdXNlLmdsb2JhbDtcbiAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmRyYWdvblJvdGF0aW9uWCArPSAuMDQ7XG4gICAgICAgIHRoaXMuZHJhZ29uUm90YXRpb25ZICs9IC4wMjtcbiAgICAgICAgdGFyZ2V0LnggPSAod2luZG93LmlubmVyV2lkdGggLyAyKSArIE1hdGguc2luKHRoaXMuZHJhZ29uUm90YXRpb25YKSAqIDIwMDtcbiAgICAgICAgdGFyZ2V0LnkgPSAod2luZG93LmlubmVySGVpZ2h0IC8gMikgKyBNYXRoLmNvcyh0aGlzLmRyYWdvblJvdGF0aW9uWSkgKiAyMDA7XG4gICAgICAgIHRhcmdldC5yb3RhdGlvbiA9IEdlb21ldHJ5LmFuZ2xlQmV0d2VlblBvaW50c1JhZGlhbnModGFyZ2V0LCB7eDp0aGlzLmhlYWQueCwgeTp0aGlzLmhlYWQueX0pO1xuICAgIH1cblxuICAgIHJldHVybiB0YXJnZXQ7XG59O1xuXG5FbGVtZW50YWxEcmFnb24ucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciB0YXJnZXQgPSB0aGlzLmdldFBvc2l0aW9uKCk7XG5cbiAgICB0aGlzLmJvZHlQYXJ0aWNsZXNFbWl0dGVyLnVwZGF0ZSgpO1xuICAgIHRoaXMuYm9keVNtb2tlRW1pdHRlci51cGRhdGUoKTtcblxuICAgIGlmKHRoaXMuaGVhZFR3ZWVuKSB7XG4gICAgICAgIHRoaXMuaGVhZFR3ZWVuLnRvKHRhcmdldCwgMTAwKTtcbiAgICAgICAgdGhpcy5oZWFkVHdlZW4uc3RhcnQoKTtcbiAgICAgICAgdGhpcy5oZWFkLnggPSB0aGlzLnBvcy54O1xuICAgICAgICB0aGlzLmhlYWQueSA9IHRoaXMucG9zLnk7XG4gICAgICAgIHRoaXMuaGVhZC5yb3RhdGlvbiA9IEdlb21ldHJ5LmFuZ2xlQmV0d2VlblBvaW50c1JhZGlhbnModGFyZ2V0LCB7eDp0aGlzLmhlYWQueCwgeTp0aGlzLmhlYWQueX0pO1xuXG4gICAgICAgIHZhciBzd2l0Y2hBbmdsZSA9IE1hdGguUEkvMjtcblxuICAgICAgICBpZih0aGlzLmhlYWQucm90YXRpb24gPCAtc3dpdGNoQW5nbGUgfHwgdGhpcy5oZWFkLnJvdGF0aW9uID4gc3dpdGNoQW5nbGUpIHtcbiAgICAgICAgICAgIHRoaXMuaGVhZC5zY2FsZS55ID0gLXN3aXRjaEFuZ2xlXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmhlYWQuc2NhbGUueSA9IHN3aXRjaEFuZ2xlXG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmJvZHlQYXJ0aWNsZXNFbWl0dGVyLnggPSB0aGlzLnBvcy54O1xuICAgICAgICB0aGlzLmJvZHlQYXJ0aWNsZXNFbWl0dGVyLnkgPSB0aGlzLnBvcy55O1xuICAgICAgICB0aGlzLmJvZHlTbW9rZUVtaXR0ZXIueCA9IHRoaXMucG9zLng7XG4gICAgICAgIHRoaXMuYm9keVNtb2tlRW1pdHRlci55ID0gdGhpcy5wb3MueTtcbiAgICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEVsZW1lbnRhbERyYWdvbjtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG52YXIgVGludERyYWdvbkJvZHlCZWhhdmlvdXIgPSB7fTtcblxuVGludERyYWdvbkJvZHlCZWhhdmlvdXIucmVzZXQgPSBmdW5jdGlvbihwYXJ0aWNsZSkge1xuICAgIHBhcnRpY2xlLnRpbnQgPSAweGJjZmRmYTtcbn07XG5cblRpbnREcmFnb25Cb2R5QmVoYXZpb3VyLnVwZGF0ZSA9IGZ1bmN0aW9uKHBhcnRpY2xlKSB7XG59O1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbnZhciBSb3RhdGlvbkJlaGF2aW91ciA9IHt9O1xuXG5Sb3RhdGlvbkJlaGF2aW91ci5yZXNldCA9IGZ1bmN0aW9uKHBhcnRpY2xlKSB7XG4gICAgcGFydGljbGUucm90YXRpb25TcGVlZCA9IChNYXRoLnJhbmRvbSgpICogLjAxKSAtIC4wMDU7XG59O1xuXG5Sb3RhdGlvbkJlaGF2aW91ci51cGRhdGUgPSBmdW5jdGlvbihwYXJ0aWNsZSkge1xuICAgIHBhcnRpY2xlLnJvdGF0aW9uICs9IHBhcnRpY2xlLnJvdGF0aW9uU3BlZWQ7XG59OyIsIkZpcmUuY29uc3RydWN0b3IgPSBGaXJlO1xuRmlyZS5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKFBJWEkuQ29udGFpbmVyLnByb3RvdHlwZSk7XG5cbnZhciBFbWl0dGVyID0gcmVxdWlyZSgnLi8uLi9wYXJ0aWNsZS1zeXN0ZW0vZW1pdHRlci9FbWl0dGVyJyk7XG52YXIgRW1pdHRlclNldHRpbmdzID0gcmVxdWlyZSgnLi8uLi9wYXJ0aWNsZS1zeXN0ZW0vZW1pdHRlci9FbWl0dGVyU2V0dGluZ3MnKTtcbnZhciBQYXJ0aWNsZVNldHRpbmdzID0gcmVxdWlyZSgnLi8uLi9wYXJ0aWNsZS1zeXN0ZW0vcGFydGljbGUvUGFydGljbGVTZXR0aW5ncycpO1xudmFyIFRleHR1cmVHZW5lcmF0b3IgPSByZXF1aXJlKCcuLy4uL3BhcnRpY2xlLXN5c3RlbS91dGlscy9UZXh0dXJlR2VuZXJhdG9yJyk7XG52YXIgVmVsb2NpdHlCZWhhdmlvdXIgPSByZXF1aXJlKCcuLy4uL3BhcnRpY2xlLXN5c3RlbS9iZWhhdmlvdXJzL1ZlbG9jaXR5QmVoYXZpb3VyJyk7XG52YXIgTGlmZUJlaGF2aW91ciA9IHJlcXVpcmUoJy4vLi4vcGFydGljbGUtc3lzdGVtL2JlaGF2aW91cnMvTGlmZUJlaGF2aW91cicpO1xudmFyIFNwaXJhbEJlaGF2aW91ciA9IHJlcXVpcmUoJy4vLi4vcGFydGljbGUtc3lzdGVtL2JlaGF2aW91cnMvU3BpcmFsQmVoYXZpb3VyJyk7XG52YXIgR3Jhdml0eUJlaGF2aW91ciA9IHJlcXVpcmUoJy4vLi4vcGFydGljbGUtc3lzdGVtL2JlaGF2aW91cnMvR3Jhdml0eUJlaGF2aW91cicpO1xudmFyIFJvdGF0aW9uQmVoYXZpb3VyID0gcmVxdWlyZSgnLi8uLi9wYXJ0aWNsZS1zeXN0ZW0vYmVoYXZpb3Vycy9Sb3RhdGlvbkJlaGF2aW91cicpO1xudmFyIFF1aWNrUmFuZ2UgPSByZXF1aXJlKCcuLy4uL3BhcnRpY2xlLXN5c3RlbS91dGlscy9RdWlja1JhbmdlJyk7XG5cbmZ1bmN0aW9uIEZpcmUoKSB7XG4gICAgUElYSS5Db250YWluZXIuY2FsbCh0aGlzKTtcblxuICAgIHRoaXMuZW1pdHRlcnMgPSBbXTtcbn1cblxuRmlyZS5wcm90b3R5cGUuZ2V0RmxhbWVFZmZlY3QgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgcGFydGljbGVTZXR0aW5ncyA9IG5ldyBQYXJ0aWNsZVNldHRpbmdzKCk7XG4gICAgcGFydGljbGVTZXR0aW5ncy5zZXRTcGVlZCgxLCA0KTtcbiAgICBwYXJ0aWNsZVNldHRpbmdzLnNldERpcmVjdGlvbigwLCAwKTtcbiAgICBwYXJ0aWNsZVNldHRpbmdzLnNldExpZmUoNSwgMTAsIDEwLCAyMCk7XG4gICAgcGFydGljbGVTZXR0aW5ncy5zZXRTY2FsZSgyLCA0KTtcbiAgICBwYXJ0aWNsZVNldHRpbmdzLmFkZEJlaGF2aW91cihWZWxvY2l0eUJlaGF2aW91cik7XG4gICAgcGFydGljbGVTZXR0aW5ncy5hZGRCZWhhdmlvdXIoTGlmZUJlaGF2aW91cik7XG4gICAgcGFydGljbGVTZXR0aW5ncy5hZGRUZXh0dXJlKFRleHR1cmVHZW5lcmF0b3IuY2lyY2xlKDEsIDB4ZmZhYjM3LCB0cnVlKSk7XG4gICAgcGFydGljbGVTZXR0aW5ncy5hZGRUZXh0dXJlKFRleHR1cmVHZW5lcmF0b3IuY2lyY2xlKDEsIDB4ZmZmMTkxLCB0cnVlKSk7XG5cbiAgICB2YXIgZW1pdHRlclNldHRpbmdzID0gbmV3IEVtaXR0ZXJTZXR0aW5ncygpO1xuICAgIGVtaXR0ZXJTZXR0aW5ncy5zZXRRdWFudGl0eSgxNTApO1xuICAgIGVtaXR0ZXJTZXR0aW5ncy5zZXRCb3VuZHMoe3R5cGU6XCJSRUNUQU5HTEVcIiwgd2lkdGg6MzAsIGhlaWdodDoxfSk7XG4gICAgZW1pdHRlclNldHRpbmdzLnNldFJlc3Bhd24odHJ1ZSk7XG4gICAgZW1pdHRlclNldHRpbmdzLnNldFNwYXduRGVsYXkoMCwgMTAwMCk7XG5cbiAgICByZXR1cm4gbmV3IEVtaXR0ZXIodGhpcywgcGFydGljbGVTZXR0aW5ncywgZW1pdHRlclNldHRpbmdzKTtcbn07XG5cbkZpcmUucHJvdG90eXBlLmdldFNwYXJrc0VmZmVjdCA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBwYXJ0aWNsZVNldHRpbmdzID0gbmV3IFBhcnRpY2xlU2V0dGluZ3MoKTtcbiAgICBwYXJ0aWNsZVNldHRpbmdzLnNldExpZmUoNSwgNTAsIDEwLCA1MCk7XG4gICAgcGFydGljbGVTZXR0aW5ncy5zZXRTY2FsZSguMiwgMSk7XG4gICAgcGFydGljbGVTZXR0aW5ncy5zZXRHcmF2aXR5KC0xLCAtMik7XG4gICAgcGFydGljbGVTZXR0aW5ncy5hZGRCZWhhdmlvdXIoR3Jhdml0eUJlaGF2aW91cik7XG4gICAgcGFydGljbGVTZXR0aW5ncy5hZGRCZWhhdmlvdXIoU3BpcmFsQmVoYXZpb3VyKTtcbiAgICBwYXJ0aWNsZVNldHRpbmdzLmFkZEJlaGF2aW91cihMaWZlQmVoYXZpb3VyKTtcbiAgICBwYXJ0aWNsZVNldHRpbmdzLmFkZFRleHR1cmUoVGV4dHVyZUdlbmVyYXRvci5jaXJjbGUoMiwgMHhmZmFiMzcsIHRydWUpKTtcbiAgICBwYXJ0aWNsZVNldHRpbmdzLmFkZFRleHR1cmUoVGV4dHVyZUdlbmVyYXRvci5jaXJjbGUoMSwgMHhmZmZmZmYsIHRydWUpKTtcbiAgICBwYXJ0aWNsZVNldHRpbmdzLmFkZFRleHR1cmUoVGV4dHVyZUdlbmVyYXRvci5jaXJjbGUoMSwgMHhmZmZmZmYpKTtcblxuICAgIHZhciBlbWl0dGVyU2V0dGluZ3MgPSBuZXcgRW1pdHRlclNldHRpbmdzKCk7XG4gICAgZW1pdHRlclNldHRpbmdzLnNldFF1YW50aXR5KDIwKTtcbiAgICBlbWl0dGVyU2V0dGluZ3Muc2V0Qm91bmRzKHt0eXBlOlwiUkVDVEFOR0xFXCIsIHdpZHRoOjUwLCBoZWlnaHQ6MX0pO1xuICAgIGVtaXR0ZXJTZXR0aW5ncy5zZXRSZXNwYXduKHRydWUpO1xuICAgIGVtaXR0ZXJTZXR0aW5ncy5zZXRTcGF3bkRlbGF5KDAsIDIwMDApO1xuXG4gICAgcmV0dXJuIG5ldyBFbWl0dGVyKHRoaXMsIHBhcnRpY2xlU2V0dGluZ3MsIGVtaXR0ZXJTZXR0aW5ncyk7XG59O1xuXG5GaXJlLnByb3RvdHlwZS5nZXRTbW9rZUVmZmVjdCA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBwYXJ0aWNsZVNldHRpbmdzID0gbmV3IFBhcnRpY2xlU2V0dGluZ3MoKTtcbiAgICBwYXJ0aWNsZVNldHRpbmdzLnNldExpZmUoNSwgNSwgMTAwLCAyMDApO1xuICAgIHBhcnRpY2xlU2V0dGluZ3Muc2V0U2NhbGUoNSwgMTApO1xuICAgIHBhcnRpY2xlU2V0dGluZ3Muc2V0QWxwaGEoLjEsIC4zKTtcbiAgICBwYXJ0aWNsZVNldHRpbmdzLnNldEdyYXZpdHkoLTEsIC0yKTtcbiAgICBwYXJ0aWNsZVNldHRpbmdzLmFkZEJlaGF2aW91cihHcmF2aXR5QmVoYXZpb3VyKTtcbiAgICBwYXJ0aWNsZVNldHRpbmdzLmFkZEJlaGF2aW91cihSb3RhdGlvbkJlaGF2aW91cik7XG4gICAgcGFydGljbGVTZXR0aW5ncy5hZGRCZWhhdmlvdXIoTGlmZUJlaGF2aW91cik7XG4gICAgcGFydGljbGVTZXR0aW5ncy5hZGRUZXh0dXJlKFRleHR1cmVHZW5lcmF0b3IuY2lyY2xlKDEsIDB4ZmZmZmZmLCB0cnVlKSk7XG5cbiAgICB2YXIgZW1pdHRlclNldHRpbmdzID0gbmV3IEVtaXR0ZXJTZXR0aW5ncygpO1xuICAgIGVtaXR0ZXJTZXR0aW5ncy5zZXRRdWFudGl0eSg0MCk7XG4gICAgZW1pdHRlclNldHRpbmdzLnNldEJvdW5kcyh7dHlwZTpcIlJFQ1RBTkdMRVwiLCB3aWR0aDo1MCwgaGVpZ2h0OjF9KTtcbiAgICBlbWl0dGVyU2V0dGluZ3Muc2V0UmVzcGF3bih0cnVlKTtcbiAgICBlbWl0dGVyU2V0dGluZ3Muc2V0U3Bhd25EZWxheSgwLCAxMDAwKTtcblxuICAgIHJldHVybiBuZXcgRW1pdHRlcih0aGlzLCBwYXJ0aWNsZVNldHRpbmdzLCBlbWl0dGVyU2V0dGluZ3MpO1xufTtcblxuRmlyZS5wcm90b3R5cGUuc3RhcnQgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgc21va2VFZmZlY3QgPSB0aGlzLmdldFNtb2tlRWZmZWN0KCk7XG4gICAgdmFyIGZsYW1lRWZmZWN0ID0gdGhpcy5nZXRGbGFtZUVmZmVjdCgpO1xuICAgIHZhciBzcGFya0VmZmVjdCA9IHRoaXMuZ2V0U3BhcmtzRWZmZWN0KCk7XG5cbiAgICBmbGFtZUVmZmVjdC54ID0gc3BhcmtFZmZlY3QueCA9IHNtb2tlRWZmZWN0LnggPSAod2luZG93LmlubmVyV2lkdGggLyAyKSArIFF1aWNrUmFuZ2UucmFuZ2UoLTMwMCwgMzAwKTtcbiAgICBmbGFtZUVmZmVjdC55ID0gc3BhcmtFZmZlY3QueSA9IHNtb2tlRWZmZWN0LnkgPSB3aW5kb3cuaW5uZXJIZWlnaHQgLSBRdWlja1JhbmdlLnJhbmdlKDIwMCwgNDAwKTtcblxuICAgIHRoaXMuZW1pdHRlcnMucHVzaChmbGFtZUVmZmVjdCk7XG4gICAgdGhpcy5lbWl0dGVycy5wdXNoKHNwYXJrRWZmZWN0KTtcbiAgICB0aGlzLmVtaXR0ZXJzLnB1c2goc21va2VFZmZlY3QpO1xuXG4gICAgZmxhbWVFZmZlY3Quc3RhcnQoKTtcbiAgICBzcGFya0VmZmVjdC5zdGFydCgpO1xuICAgIHNtb2tlRWZmZWN0LnN0YXJ0KCk7XG59O1xuXG5GaXJlLnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbigpIHtcbiAgICBmb3IodmFyIGkgPSAwOyBpIDwgdGhpcy5lbWl0dGVycy5sZW5ndGg7IGkrKykge1xuICAgICAgICB0aGlzLmVtaXR0ZXJzW2ldLnVwZGF0ZSgpO1xuICAgIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gRmlyZTsiLCJGaXJld29yazEuY29uc3RydWN0b3IgPSBGaXJld29yazE7XG5GaXJld29yazEucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShQSVhJLkNvbnRhaW5lci5wcm90b3R5cGUpO1xuXG52YXIgRW1pdHRlciA9IHJlcXVpcmUoJy4vLi4vcGFydGljbGUtc3lzdGVtL2VtaXR0ZXIvRW1pdHRlcicpO1xudmFyIEVtaXR0ZXJTZXR0aW5ncyA9IHJlcXVpcmUoJy4vLi4vcGFydGljbGUtc3lzdGVtL2VtaXR0ZXIvRW1pdHRlclNldHRpbmdzJyk7XG52YXIgUGFydGljbGVTZXR0aW5ncyA9IHJlcXVpcmUoJy4vLi4vcGFydGljbGUtc3lzdGVtL3BhcnRpY2xlL1BhcnRpY2xlU2V0dGluZ3MnKTtcbnZhciBUZXh0dXJlR2VuZXJhdG9yID0gcmVxdWlyZSgnLi8uLi9wYXJ0aWNsZS1zeXN0ZW0vdXRpbHMvVGV4dHVyZUdlbmVyYXRvcicpO1xudmFyIFZlbG9jaXR5QmVoYXZpb3VyID0gcmVxdWlyZSgnLi8uLi9wYXJ0aWNsZS1zeXN0ZW0vYmVoYXZpb3Vycy9WZWxvY2l0eUJlaGF2aW91cicpO1xudmFyIExpZmVCZWhhdmlvdXIgPSByZXF1aXJlKCcuLy4uL3BhcnRpY2xlLXN5c3RlbS9iZWhhdmlvdXJzL0xpZmVCZWhhdmlvdXInKTtcbnZhciBSb3RhdGlvbkJlaGF2aW91ciA9IHJlcXVpcmUoJy4vLi4vcGFydGljbGUtc3lzdGVtL2JlaGF2aW91cnMvUm90YXRpb25CZWhhdmlvdXInKTtcbnZhciBXYW5kZXJCZWhhdmlvdXIgPSByZXF1aXJlKCcuLy4uL3BhcnRpY2xlLXN5c3RlbS9iZWhhdmlvdXJzL1dhbmRlckJlaGF2aW91cicpO1xudmFyIFJpcHBsZUJlaGF2aW91ciA9IHJlcXVpcmUoJy4vLi4vcGFydGljbGUtc3lzdGVtL2JlaGF2aW91cnMvUmlwcGxlQmVoYXZpb3VyJyk7XG52YXIgRmlyZXdvcmtQb3NpdGlvbnMgPSByZXF1aXJlKCcuL0ZpcmV3b3JrUG9zaXRpb25zJyk7XG52YXIgQ29tcGFjdEFycmF5ID0gcmVxdWlyZSgnLi8uLi9wYXJ0aWNsZS1zeXN0ZW0vdXRpbHMvQ29tcGFjdEFycmF5Jyk7XG5cbmZ1bmN0aW9uIEZpcmV3b3JrMSgpIHtcbiAgICBQSVhJLkNvbnRhaW5lci5jYWxsKHRoaXMpO1xuXG4gICAgdGhpcy50cmFpbEVtaXR0ZXJzID0gW107XG5cbiAgICB0aGlzLnNldHVwU21va2VFZmZlY3QoKTtcbiAgICB0aGlzLnNldHVwQnVyc3RFZmZlY3QoKTtcbn1cblxuRmlyZXdvcmsxLnByb3RvdHlwZS5zZXR1cFNtb2tlRWZmZWN0ID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHBhcnRpY2xlU2V0dGluZ3MgPSBuZXcgUGFydGljbGVTZXR0aW5ncygpO1xuICAgIHBhcnRpY2xlU2V0dGluZ3Muc2V0U3BlZWQoLjEsIC4yKTtcbiAgICBwYXJ0aWNsZVNldHRpbmdzLnNldERpcmVjdGlvbigwLCBNYXRoLlBJICogMik7XG4gICAgcGFydGljbGVTZXR0aW5ncy5zZXRMaWZlKDIwLCA0MCwgMTAsIDIwKTtcbiAgICBwYXJ0aWNsZVNldHRpbmdzLnNldEFscGhhKC4wNSwgLjE1KTtcbiAgICBwYXJ0aWNsZVNldHRpbmdzLnNldFNjYWxlKDEwLCAyMCk7XG4gICAgcGFydGljbGVTZXR0aW5ncy5hZGRCZWhhdmlvdXIoVmVsb2NpdHlCZWhhdmlvdXIpO1xuICAgIHBhcnRpY2xlU2V0dGluZ3MuYWRkQmVoYXZpb3VyKExpZmVCZWhhdmlvdXIpO1xuICAgIHBhcnRpY2xlU2V0dGluZ3MuYWRkQmVoYXZpb3VyKFJvdGF0aW9uQmVoYXZpb3VyKTtcbiAgICBwYXJ0aWNsZVNldHRpbmdzLmFkZFRleHR1cmUoVGV4dHVyZUdlbmVyYXRvci5jaXJjbGUoMiwgMHhmZmZmZmYsIHRydWUpKTtcbiAgICBwYXJ0aWNsZVNldHRpbmdzLmFkZFRleHR1cmUoVGV4dHVyZUdlbmVyYXRvci5jaXJjbGUoMiwgMHg5MWZmYTEsIHRydWUpKTtcblxuICAgIHZhciBlbWl0dGVyU2V0dGluZ3MgPSBuZXcgRW1pdHRlclNldHRpbmdzKCk7XG4gICAgZW1pdHRlclNldHRpbmdzLnNldFF1YW50aXR5KDIwKTtcbiAgICBlbWl0dGVyU2V0dGluZ3Muc2V0Qm91bmRzKHt0eXBlOlwiQ0lSQ0xFXCIsIHJhZGl1czo4MH0pO1xuXG4gICAgdGhpcy5zbW9rZUVtaXR0ZXIgPSBuZXcgRW1pdHRlcih0aGlzLCBwYXJ0aWNsZVNldHRpbmdzLCBlbWl0dGVyU2V0dGluZ3MpO1xufTtcblxuRmlyZXdvcmsxLnByb3RvdHlwZS5zZXR1cEJ1cnN0RWZmZWN0ID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHBhcnRpY2xlU2V0dGluZ3MgPSBuZXcgUGFydGljbGVTZXR0aW5ncygpO1xuICAgIHBhcnRpY2xlU2V0dGluZ3Muc2V0U3BlZWQoMiwgMik7XG4gICAgcGFydGljbGVTZXR0aW5ncy5zZXREaXJlY3Rpb24oMCwgTWF0aC5QSSAqIDIpO1xuICAgIHBhcnRpY2xlU2V0dGluZ3Muc2V0TGlmZSg0MCwgMTAwLCAwLCAwKTtcbiAgICBwYXJ0aWNsZVNldHRpbmdzLnNldFNjYWxlKC41LCAxLjUpO1xuICAgIHBhcnRpY2xlU2V0dGluZ3MuYWRkQmVoYXZpb3VyKFZlbG9jaXR5QmVoYXZpb3VyKTtcbiAgICBwYXJ0aWNsZVNldHRpbmdzLmFkZEJlaGF2aW91cihXYW5kZXJCZWhhdmlvdXIpO1xuICAgIHBhcnRpY2xlU2V0dGluZ3MuYWRkQmVoYXZpb3VyKExpZmVCZWhhdmlvdXIpO1xuICAgIHBhcnRpY2xlU2V0dGluZ3MuYWRkVGV4dHVyZShUZXh0dXJlR2VuZXJhdG9yLmNpcmNsZSgyLCAweGZmZmZmZiwgdHJ1ZSkpO1xuICAgIHBhcnRpY2xlU2V0dGluZ3MuYWRkVGV4dHVyZShUZXh0dXJlR2VuZXJhdG9yLmNpcmNsZSgyLCAweDkxZmZhMSwgdHJ1ZSkpO1xuXG4gICAgdmFyIGVtaXR0ZXJTZXR0aW5ncyA9IG5ldyBFbWl0dGVyU2V0dGluZ3MoKTtcbiAgICBlbWl0dGVyU2V0dGluZ3Muc2V0UXVhbnRpdHkoMTAwKTtcblxuICAgIHRoaXMuYnVyc3RFbWl0dGVyID0gbmV3IEVtaXR0ZXIodGhpcywgcGFydGljbGVTZXR0aW5ncywgZW1pdHRlclNldHRpbmdzKTtcbn07XG5cbkZpcmV3b3JrMS5wcm90b3R5cGUuZ2V0VHJhaWxFbWl0dGVyID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHRyYWlsUGFydGljbGVTZXR0aW5ncyA9IG5ldyBQYXJ0aWNsZVNldHRpbmdzKCk7XG4gICAgdHJhaWxQYXJ0aWNsZVNldHRpbmdzLnNldExpZmUoMywgOCwgMSwgMjApO1xuICAgIHRyYWlsUGFydGljbGVTZXR0aW5ncy5zZXRBbHBoYSguMSwgLjUpO1xuICAgIHRyYWlsUGFydGljbGVTZXR0aW5ncy5hZGRCZWhhdmlvdXIoTGlmZUJlaGF2aW91cik7XG4gICAgdHJhaWxQYXJ0aWNsZVNldHRpbmdzLmFkZFRleHR1cmUoVGV4dHVyZUdlbmVyYXRvci5jaXJjbGUoMSwgMHhmMmZmZTIsIHRydWUpKTtcbiAgICB0cmFpbFBhcnRpY2xlU2V0dGluZ3MuYWRkVGV4dHVyZShUZXh0dXJlR2VuZXJhdG9yLmNpcmNsZSgxLCAweGY1ZmZhNiwgdHJ1ZSwgNCkpO1xuICAgIHRyYWlsUGFydGljbGVTZXR0aW5ncy5hZGRUZXh0dXJlKFRleHR1cmVHZW5lcmF0b3IuY2lyY2xlKDIsIDB4ZjVmZmE2LCB0cnVlLCA4KSk7XG5cbiAgICB2YXIgdHJhaWxFbWl0dGVyU2V0dGluZ3MgPSBuZXcgRW1pdHRlclNldHRpbmdzKCk7XG4gICAgdHJhaWxFbWl0dGVyU2V0dGluZ3Muc2V0UXVhbnRpdHkoMTAwKTtcbiAgICB0cmFpbEVtaXR0ZXJTZXR0aW5ncy5zZXRSZXNwYXduKHRydWUpO1xuXG4gICAgcmV0dXJuIG5ldyBFbWl0dGVyKHRoaXMsIHRyYWlsUGFydGljbGVTZXR0aW5ncywgdHJhaWxFbWl0dGVyU2V0dGluZ3MpO1xufTtcblxuRmlyZXdvcmsxLnByb3RvdHlwZS5zdGFydCA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciB0cmFpbEVtaXR0ZXIgPSB0aGlzLmdldFRyYWlsRW1pdHRlcigpO1xuICAgIHZhciBsYXVuY2hQb3NpdGlvbiA9IEZpcmV3b3JrUG9zaXRpb25zLmxhdW5jaFBvc2l0aW9uKCk7XG4gICAgdmFyIGJ1cnN0UG9zaXRpb24gPSBGaXJld29ya1Bvc2l0aW9ucy5idXJzdFBvc2l0aW9uKCk7XG5cbiAgICB0cmFpbEVtaXR0ZXIueCA9IGxhdW5jaFBvc2l0aW9uLng7XG4gICAgdHJhaWxFbWl0dGVyLnkgPSBsYXVuY2hQb3NpdGlvbi55O1xuICAgIHRyYWlsRW1pdHRlci5zdGFydCgpO1xuXG4gICAgdGhpcy50cmFpbEVtaXR0ZXJzLnB1c2godHJhaWxFbWl0dGVyKTtcblxuICAgIHZhciBjYWxsYmFjayA9IHRoaXMudHJhaWxDb21wbGV0ZS5iaW5kKHRoaXMpO1xuXG4gICAgbmV3IFRXRUVOLlR3ZWVuKHRyYWlsRW1pdHRlcilcbiAgICAgICAgLnRvKHt4IDogYnVyc3RQb3NpdGlvbi54LCB5IDogYnVyc3RQb3NpdGlvbi55fSwgMjAwMClcbiAgICAgICAgLmVhc2luZyhUV0VFTi5FYXNpbmcuQ3ViaWMuSW4pXG4gICAgICAgIC5zdGFydCgpXG4gICAgICAgIC5vbkNvbXBsZXRlKGZ1bmN0aW9uKCl7IGNhbGxiYWNrKHRyYWlsRW1pdHRlcikgfSk7XG59O1xuXG5GaXJld29yazEucHJvdG90eXBlLnRyYWlsQ29tcGxldGUgPSBmdW5jdGlvbih0cmFpbEVtaXR0ZXIpIHtcbiAgICB0aGlzLnNtb2tlRW1pdHRlci54ID0gdGhpcy5idXJzdEVtaXR0ZXIueCA9IHRyYWlsRW1pdHRlci54O1xuICAgIHRoaXMuc21va2VFbWl0dGVyLnkgPSB0aGlzLmJ1cnN0RW1pdHRlci55ID0gdHJhaWxFbWl0dGVyLnk7XG5cbiAgICB0aGlzLnNtb2tlRW1pdHRlci5zdGFydCgpO1xuICAgIHRoaXMuYnVyc3RFbWl0dGVyLnN0YXJ0KCk7XG5cbiAgICBSaXBwbGVCZWhhdmlvdXIuc3RhcnRGbGFzaCgxNTAwKTtcbiAgICB0cmFpbEVtaXR0ZXIuc3RvcFJlc3Bhd24oKTtcbiAgICB0cmFpbEVtaXR0ZXIuc2V0RGVhZFdoZW5FbXB0eSh0cnVlKTtcbn07XG5cbkZpcmV3b3JrMS5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5zbW9rZUVtaXR0ZXIudXBkYXRlKCk7XG4gICAgdGhpcy5idXJzdEVtaXR0ZXIudXBkYXRlKCk7XG5cbiAgICB2YXIgbmVlZHNDb21wYWN0aW5nID0gZmFsc2U7XG5cbiAgICBmb3IodmFyIGkgPSAwOyBpIDwgIHRoaXMudHJhaWxFbWl0dGVycy5sZW5ndGg7IGkrKykge1xuICAgICAgICB0aGlzLnRyYWlsRW1pdHRlcnNbaV0udXBkYXRlKCk7XG5cbiAgICAgICAgaWYodGhpcy50cmFpbEVtaXR0ZXJzW2ldLmlzRGVhZCgpKSB7XG4gICAgICAgICAgICB0aGlzLnRyYWlsRW1pdHRlcnNbaV0gPSBudWxsO1xuICAgICAgICAgICAgbmVlZHNDb21wYWN0aW5nID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGlmKG5lZWRzQ29tcGFjdGluZykge1xuICAgICAgICBDb21wYWN0QXJyYXkuY29tcGFjdCh0aGlzLnRyYWlsRW1pdHRlcnMpO1xuICAgIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gRmlyZXdvcmsxOyIsIkZpcmV3b3JrMi5jb25zdHJ1Y3RvciA9IEZpcmV3b3JrMjtcbkZpcmV3b3JrMi5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKFBJWEkuQ29udGFpbmVyLnByb3RvdHlwZSk7XG5cbnZhciBFbWl0dGVyID0gcmVxdWlyZSgnLi8uLi9wYXJ0aWNsZS1zeXN0ZW0vZW1pdHRlci9FbWl0dGVyJyk7XG52YXIgRW1pdHRlclNldHRpbmdzID0gcmVxdWlyZSgnLi8uLi9wYXJ0aWNsZS1zeXN0ZW0vZW1pdHRlci9FbWl0dGVyU2V0dGluZ3MnKTtcbnZhciBQYXJ0aWNsZVNldHRpbmdzID0gcmVxdWlyZSgnLi8uLi9wYXJ0aWNsZS1zeXN0ZW0vcGFydGljbGUvUGFydGljbGVTZXR0aW5ncycpO1xudmFyIFRleHR1cmVHZW5lcmF0b3IgPSByZXF1aXJlKCcuLy4uL3BhcnRpY2xlLXN5c3RlbS91dGlscy9UZXh0dXJlR2VuZXJhdG9yJyk7XG52YXIgVmVsb2NpdHlCZWhhdmlvdXIgPSByZXF1aXJlKCcuLy4uL3BhcnRpY2xlLXN5c3RlbS9iZWhhdmlvdXJzL1ZlbG9jaXR5QmVoYXZpb3VyJyk7XG52YXIgTGlmZUJlaGF2aW91ciA9IHJlcXVpcmUoJy4vLi4vcGFydGljbGUtc3lzdGVtL2JlaGF2aW91cnMvTGlmZUJlaGF2aW91cicpO1xudmFyIFJvdGF0aW9uQmVoYXZpb3VyID0gcmVxdWlyZSgnLi8uLi9wYXJ0aWNsZS1zeXN0ZW0vYmVoYXZpb3Vycy9Sb3RhdGlvbkJlaGF2aW91cicpO1xudmFyIFNwaXJhbEJlaGF2aW91ciA9IHJlcXVpcmUoJy4vLi4vcGFydGljbGUtc3lzdGVtL2JlaGF2aW91cnMvU3BpcmFsQmVoYXZpb3VyJyk7XG52YXIgRmlyZXdvcmtQb3NpdGlvbnMgPSByZXF1aXJlKCcuL0ZpcmV3b3JrUG9zaXRpb25zJyk7XG52YXIgQ29tcGFjdEFycmF5ID0gcmVxdWlyZSgnLi8uLi9wYXJ0aWNsZS1zeXN0ZW0vdXRpbHMvQ29tcGFjdEFycmF5Jyk7XG52YXIgUmlwcGxlQmVoYXZpb3VyID0gcmVxdWlyZSgnLi8uLi9wYXJ0aWNsZS1zeXN0ZW0vYmVoYXZpb3Vycy9SaXBwbGVCZWhhdmlvdXInKTtcblxuZnVuY3Rpb24gRmlyZXdvcmsyKCkge1xuICAgIFBJWEkuQ29udGFpbmVyLmNhbGwodGhpcyk7XG5cbiAgICB0aGlzLnRyYWlsRW1pdHRlcnMgPSBbXTtcblxuICAgIHRoaXMuc2V0dXBTbW9rZUVmZmVjdCgpO1xuICAgIHRoaXMuc2V0dXBCdXJzdEVmZmVjdCgpO1xufVxuXG5GaXJld29yazIucHJvdG90eXBlLnNldHVwU21va2VFZmZlY3QgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgcGFydGljbGVTZXR0aW5ncyA9IG5ldyBQYXJ0aWNsZVNldHRpbmdzKCk7XG4gICAgcGFydGljbGVTZXR0aW5ncy5zZXRTcGVlZCguMSwgLjIpO1xuICAgIHBhcnRpY2xlU2V0dGluZ3Muc2V0RGlyZWN0aW9uKDAsIE1hdGguUEkgKiAyKTtcbiAgICBwYXJ0aWNsZVNldHRpbmdzLnNldExpZmUoMjAsIDQwLCAxMCwgMjApO1xuICAgIHBhcnRpY2xlU2V0dGluZ3Muc2V0QWxwaGEoLjA1LCAuMTUpO1xuICAgIHBhcnRpY2xlU2V0dGluZ3Muc2V0U2NhbGUoMTAsIDIwKTtcbiAgICBwYXJ0aWNsZVNldHRpbmdzLmFkZEJlaGF2aW91cihWZWxvY2l0eUJlaGF2aW91cik7XG4gICAgcGFydGljbGVTZXR0aW5ncy5hZGRCZWhhdmlvdXIoTGlmZUJlaGF2aW91cik7XG4gICAgcGFydGljbGVTZXR0aW5ncy5hZGRCZWhhdmlvdXIoUm90YXRpb25CZWhhdmlvdXIpO1xuICAgIHBhcnRpY2xlU2V0dGluZ3MuYWRkVGV4dHVyZShUZXh0dXJlR2VuZXJhdG9yLmNpcmNsZSgyLCAweGZmZmZmZiwgdHJ1ZSkpO1xuICAgIHBhcnRpY2xlU2V0dGluZ3MuYWRkVGV4dHVyZShUZXh0dXJlR2VuZXJhdG9yLmNpcmNsZSgyLCAweDgwZmZlYSwgdHJ1ZSkpO1xuICAgIHBhcnRpY2xlU2V0dGluZ3MuYWRkVGV4dHVyZShUZXh0dXJlR2VuZXJhdG9yLmNpcmNsZSgyLCAweGI1ZmZmMiwgdHJ1ZSkpO1xuICAgIHBhcnRpY2xlU2V0dGluZ3MuYWRkVGV4dHVyZShUZXh0dXJlR2VuZXJhdG9yLmNpcmNsZSgyLCAweGU3NmZmZiwgdHJ1ZSkpO1xuXG4gICAgdmFyIGVtaXR0ZXJTZXR0aW5ncyA9IG5ldyBFbWl0dGVyU2V0dGluZ3MoKTtcbiAgICBlbWl0dGVyU2V0dGluZ3Muc2V0UXVhbnRpdHkoMjApO1xuICAgIGVtaXR0ZXJTZXR0aW5ncy5zZXRCb3VuZHMoe3R5cGU6XCJDSVJDTEVcIiwgcmFkaXVzOjgwfSk7XG5cbiAgICB0aGlzLnNtb2tlRW1pdHRlciA9IG5ldyBFbWl0dGVyKHRoaXMsIHBhcnRpY2xlU2V0dGluZ3MsIGVtaXR0ZXJTZXR0aW5ncyk7XG59O1xuXG5GaXJld29yazIucHJvdG90eXBlLnNldHVwQnVyc3RFZmZlY3QgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgcGFydGljbGVTZXR0aW5ncyA9IG5ldyBQYXJ0aWNsZVNldHRpbmdzKCk7XG4gICAgcGFydGljbGVTZXR0aW5ncy5zZXRMaWZlKDEwMCwgMTUwLCAyMCwgNDApO1xuICAgIHBhcnRpY2xlU2V0dGluZ3MuYWRkQmVoYXZpb3VyKFNwaXJhbEJlaGF2aW91cik7XG4gICAgcGFydGljbGVTZXR0aW5ncy5hZGRCZWhhdmlvdXIoTGlmZUJlaGF2aW91cik7XG4gICAgcGFydGljbGVTZXR0aW5ncy5hZGRUZXh0dXJlKFRleHR1cmVHZW5lcmF0b3IuY2lyY2xlKDIsIDB4ODBmZmVhLCB0cnVlKSk7XG4gICAgcGFydGljbGVTZXR0aW5ncy5hZGRUZXh0dXJlKFRleHR1cmVHZW5lcmF0b3IuY2lyY2xlKDIsIDB4YjVmZmYyLCB0cnVlKSk7XG4gICAgcGFydGljbGVTZXR0aW5ncy5hZGRUZXh0dXJlKFRleHR1cmVHZW5lcmF0b3IuY2lyY2xlKDIsIDB4RkZGRkZGLCB0cnVlKSk7XG5cbiAgICB2YXIgZW1pdHRlclNldHRpbmdzID0gbmV3IEVtaXR0ZXJTZXR0aW5ncygpO1xuICAgIGVtaXR0ZXJTZXR0aW5ncy5zZXRRdWFudGl0eSg4MCk7XG4gICAgZW1pdHRlclNldHRpbmdzLnNldFNwYXduRGVsYXkoMCwgMTAwMCk7XG5cbiAgICB0aGlzLmJ1cnN0RW1pdHRlciA9IG5ldyBFbWl0dGVyKHRoaXMsIHBhcnRpY2xlU2V0dGluZ3MsIGVtaXR0ZXJTZXR0aW5ncyk7XG59O1xuXG5GaXJld29yazIucHJvdG90eXBlLmdldFRyYWlsRW1pdHRlciA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciB0cmFpbFBhcnRpY2xlU2V0dGluZ3MgPSBuZXcgUGFydGljbGVTZXR0aW5ncygpO1xuICAgIHRyYWlsUGFydGljbGVTZXR0aW5ncy5zZXRMaWZlKDMsIDgsIDEsIDIwKTtcbiAgICB0cmFpbFBhcnRpY2xlU2V0dGluZ3Muc2V0QWxwaGEoLjEsIC41KTtcbiAgICB0cmFpbFBhcnRpY2xlU2V0dGluZ3MuYWRkQmVoYXZpb3VyKExpZmVCZWhhdmlvdXIpO1xuICAgIHRyYWlsUGFydGljbGVTZXR0aW5ncy5hZGRUZXh0dXJlKFRleHR1cmVHZW5lcmF0b3IuY2lyY2xlKDEsIDB4ODBmZmVhLCB0cnVlKSk7XG4gICAgdHJhaWxQYXJ0aWNsZVNldHRpbmdzLmFkZFRleHR1cmUoVGV4dHVyZUdlbmVyYXRvci5jaXJjbGUoMSwgMHhiNWZmZjIsIHRydWUsIDQpKTtcbiAgICB0cmFpbFBhcnRpY2xlU2V0dGluZ3MuYWRkVGV4dHVyZShUZXh0dXJlR2VuZXJhdG9yLmNpcmNsZSgyLCAweEZGRkZGRiwgdHJ1ZSwgOCkpO1xuXG4gICAgdmFyIHRyYWlsRW1pdHRlclNldHRpbmdzID0gbmV3IEVtaXR0ZXJTZXR0aW5ncygpO1xuICAgIHRyYWlsRW1pdHRlclNldHRpbmdzLnNldFF1YW50aXR5KDEwMCk7XG4gICAgdHJhaWxFbWl0dGVyU2V0dGluZ3Muc2V0UmVzcGF3bih0cnVlKTtcblxuICAgIHJldHVybiBuZXcgRW1pdHRlcih0aGlzLCB0cmFpbFBhcnRpY2xlU2V0dGluZ3MsIHRyYWlsRW1pdHRlclNldHRpbmdzKTtcbn07XG5cblxuRmlyZXdvcmsyLnByb3RvdHlwZS5zdGFydCA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciB0cmFpbEVtaXR0ZXIgPSB0aGlzLmdldFRyYWlsRW1pdHRlcigpO1xuICAgIHZhciBsYXVuY2hQb3NpdGlvbiA9IEZpcmV3b3JrUG9zaXRpb25zLmxhdW5jaFBvc2l0aW9uKCk7XG4gICAgdmFyIGJ1cnN0UG9zaXRpb24gPSBGaXJld29ya1Bvc2l0aW9ucy5idXJzdFBvc2l0aW9uKCk7XG5cbiAgICB0cmFpbEVtaXR0ZXIueCA9IGxhdW5jaFBvc2l0aW9uLng7XG4gICAgdHJhaWxFbWl0dGVyLnkgPSBsYXVuY2hQb3NpdGlvbi55O1xuICAgIHRyYWlsRW1pdHRlci5zdGFydCgpO1xuXG4gICAgdGhpcy50cmFpbEVtaXR0ZXJzLnB1c2godHJhaWxFbWl0dGVyKTtcblxuICAgIHZhciBjYWxsYmFjayA9IHRoaXMudHJhaWxDb21wbGV0ZS5iaW5kKHRoaXMpO1xuXG4gICAgbmV3IFRXRUVOLlR3ZWVuKHRyYWlsRW1pdHRlcilcbiAgICAgICAgLnRvKHt4IDogYnVyc3RQb3NpdGlvbi54LCB5IDogYnVyc3RQb3NpdGlvbi55fSwgMjAwMClcbiAgICAgICAgLmVhc2luZyhUV0VFTi5FYXNpbmcuQ3ViaWMuSW4pXG4gICAgICAgIC5zdGFydCgpXG4gICAgICAgIC5vbkNvbXBsZXRlKGZ1bmN0aW9uKCl7IGNhbGxiYWNrKHRyYWlsRW1pdHRlcikgfSk7XG59O1xuXG5GaXJld29yazIucHJvdG90eXBlLnRyYWlsQ29tcGxldGUgPSBmdW5jdGlvbih0cmFpbEVtaXR0ZXIpIHtcbiAgICB0aGlzLnNtb2tlRW1pdHRlci54ID0gdGhpcy5idXJzdEVtaXR0ZXIueCA9IHRyYWlsRW1pdHRlci54O1xuICAgIHRoaXMuc21va2VFbWl0dGVyLnkgPSB0aGlzLmJ1cnN0RW1pdHRlci55ID0gdHJhaWxFbWl0dGVyLnk7XG5cbiAgICB0aGlzLnNtb2tlRW1pdHRlci5zdGFydCgpO1xuICAgIHRoaXMuYnVyc3RFbWl0dGVyLnN0YXJ0KCk7XG5cbiAgICBSaXBwbGVCZWhhdmlvdXIuc3RhcnRGbGFzaCgxNTAwKTtcbiAgICB0cmFpbEVtaXR0ZXIuc3RvcFJlc3Bhd24oKTtcbiAgICB0cmFpbEVtaXR0ZXIuc2V0RGVhZFdoZW5FbXB0eSh0cnVlKTtcbn07XG5cbkZpcmV3b3JrMi5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5zbW9rZUVtaXR0ZXIudXBkYXRlKCk7XG4gICAgdGhpcy5idXJzdEVtaXR0ZXIudXBkYXRlKCk7XG5cbiAgICB2YXIgbmVlZHNDb21wYWN0aW5nID0gZmFsc2U7XG5cbiAgICBmb3IodmFyIGkgPSAwOyBpIDwgIHRoaXMudHJhaWxFbWl0dGVycy5sZW5ndGg7IGkrKykge1xuICAgICAgICB0aGlzLnRyYWlsRW1pdHRlcnNbaV0udXBkYXRlKCk7XG5cbiAgICAgICAgaWYodGhpcy50cmFpbEVtaXR0ZXJzW2ldLmlzRGVhZCgpKSB7XG4gICAgICAgICAgICB0aGlzLnRyYWlsRW1pdHRlcnNbaV0gPSBudWxsO1xuICAgICAgICAgICAgbmVlZHNDb21wYWN0aW5nID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGlmKG5lZWRzQ29tcGFjdGluZykge1xuICAgICAgICBDb21wYWN0QXJyYXkuY29tcGFjdCh0aGlzLnRyYWlsRW1pdHRlcnMpO1xuICAgIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gRmlyZXdvcmsyOyIsIkZpcmV3b3JrMy5jb25zdHJ1Y3RvciA9IEZpcmV3b3JrMztcbkZpcmV3b3JrMy5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKFBJWEkuQ29udGFpbmVyLnByb3RvdHlwZSk7XG5cbnZhciBFbWl0dGVyID0gcmVxdWlyZSgnLi8uLi9wYXJ0aWNsZS1zeXN0ZW0vZW1pdHRlci9FbWl0dGVyJyk7XG52YXIgRW1pdHRlclNldHRpbmdzID0gcmVxdWlyZSgnLi8uLi9wYXJ0aWNsZS1zeXN0ZW0vZW1pdHRlci9FbWl0dGVyU2V0dGluZ3MnKTtcbnZhciBQYXJ0aWNsZVNldHRpbmdzID0gcmVxdWlyZSgnLi8uLi9wYXJ0aWNsZS1zeXN0ZW0vcGFydGljbGUvUGFydGljbGVTZXR0aW5ncycpO1xudmFyIFRleHR1cmVHZW5lcmF0b3IgPSByZXF1aXJlKCcuLy4uL3BhcnRpY2xlLXN5c3RlbS91dGlscy9UZXh0dXJlR2VuZXJhdG9yJyk7XG52YXIgVmVsb2NpdHlCZWhhdmlvdXIgPSByZXF1aXJlKCcuLy4uL3BhcnRpY2xlLXN5c3RlbS9iZWhhdmlvdXJzL1ZlbG9jaXR5QmVoYXZpb3VyJyk7XG52YXIgTGlmZUJlaGF2aW91ciA9IHJlcXVpcmUoJy4vLi4vcGFydGljbGUtc3lzdGVtL2JlaGF2aW91cnMvTGlmZUJlaGF2aW91cicpO1xudmFyIFJvdGF0aW9uQmVoYXZpb3VyID0gcmVxdWlyZSgnLi8uLi9wYXJ0aWNsZS1zeXN0ZW0vYmVoYXZpb3Vycy9Sb3RhdGlvbkJlaGF2aW91cicpO1xudmFyIERlY2F5QmVoYXZpb3VyID0gcmVxdWlyZSgnLi8uLi9wYXJ0aWNsZS1zeXN0ZW0vYmVoYXZpb3Vycy9EZWNheUJlaGF2aW91cicpO1xudmFyIEZpcmV3b3JrUG9zaXRpb25zID0gcmVxdWlyZSgnLi9GaXJld29ya1Bvc2l0aW9ucycpO1xudmFyIENvbXBhY3RBcnJheSA9IHJlcXVpcmUoJy4vLi4vcGFydGljbGUtc3lzdGVtL3V0aWxzL0NvbXBhY3RBcnJheScpO1xudmFyIFJpcHBsZUJlaGF2aW91ciA9IHJlcXVpcmUoJy4vLi4vcGFydGljbGUtc3lzdGVtL2JlaGF2aW91cnMvUmlwcGxlQmVoYXZpb3VyJyk7XG5cbmZ1bmN0aW9uIEZpcmV3b3JrMygpIHtcbiAgICBQSVhJLkNvbnRhaW5lci5jYWxsKHRoaXMpO1xuXG4gICAgdGhpcy50cmFpbEVtaXR0ZXJzID0gW107XG5cbiAgICB0aGlzLnNldHVwU21va2VFZmZlY3QoKTtcbiAgICB0aGlzLnNldHVwQnVyc3RFZmZlY3QoKTtcbn1cblxuRmlyZXdvcmszLnByb3RvdHlwZS5zZXR1cFNtb2tlRWZmZWN0ID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHBhcnRpY2xlU2V0dGluZ3MgPSBuZXcgUGFydGljbGVTZXR0aW5ncygpO1xuICAgIHBhcnRpY2xlU2V0dGluZ3Muc2V0U3BlZWQoLjEsIC4yKTtcbiAgICBwYXJ0aWNsZVNldHRpbmdzLnNldERpcmVjdGlvbigwLCBNYXRoLlBJICogMik7XG4gICAgcGFydGljbGVTZXR0aW5ncy5zZXRMaWZlKDIwLCA0MCwgMTAsIDIwKTtcbiAgICBwYXJ0aWNsZVNldHRpbmdzLnNldEFscGhhKC4wNSwgLjE1KTtcbiAgICBwYXJ0aWNsZVNldHRpbmdzLnNldFNjYWxlKDEwLCAxNSk7XG4gICAgcGFydGljbGVTZXR0aW5ncy5hZGRCZWhhdmlvdXIoVmVsb2NpdHlCZWhhdmlvdXIpO1xuICAgIHBhcnRpY2xlU2V0dGluZ3MuYWRkQmVoYXZpb3VyKExpZmVCZWhhdmlvdXIpO1xuICAgIHBhcnRpY2xlU2V0dGluZ3MuYWRkQmVoYXZpb3VyKFJvdGF0aW9uQmVoYXZpb3VyKTtcbiAgICBwYXJ0aWNsZVNldHRpbmdzLmFkZFRleHR1cmUoVGV4dHVyZUdlbmVyYXRvci5jaXJjbGUoMywgMHhjY2ZmZmYsIGZhbHNlLCAyKSk7XG4gICAgcGFydGljbGVTZXR0aW5ncy5hZGRUZXh0dXJlKFRleHR1cmVHZW5lcmF0b3IuY2lyY2xlKDMsIDB4ZmYxMWZmLCB0cnVlLCAyKSk7XG4gICAgcGFydGljbGVTZXR0aW5ncy5hZGRUZXh0dXJlKFRleHR1cmVHZW5lcmF0b3IuY2lyY2xlKDMsIDB4ZmZmZjExLCBmYWxzZSwgMikpO1xuXG4gICAgdmFyIGVtaXR0ZXJTZXR0aW5ncyA9IG5ldyBFbWl0dGVyU2V0dGluZ3MoKTtcbiAgICBlbWl0dGVyU2V0dGluZ3Muc2V0UXVhbnRpdHkoMjApO1xuICAgIGVtaXR0ZXJTZXR0aW5ncy5zZXRCb3VuZHMoe3R5cGU6XCJDSVJDTEVcIiwgcmFkaXVzOjgwfSk7XG5cbiAgICB0aGlzLnNtb2tlRW1pdHRlciA9IG5ldyBFbWl0dGVyKHRoaXMsIHBhcnRpY2xlU2V0dGluZ3MsIGVtaXR0ZXJTZXR0aW5ncyk7XG59O1xuXG5GaXJld29yazMucHJvdG90eXBlLnNldHVwQnVyc3RFZmZlY3QgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgcGFydGljbGVTZXR0aW5ncyA9IG5ldyBQYXJ0aWNsZVNldHRpbmdzKCk7XG4gICAgcGFydGljbGVTZXR0aW5ncy5zZXRTcGVlZCgxLCA1KTtcbiAgICBwYXJ0aWNsZVNldHRpbmdzLnNldERpcmVjdGlvbigwLCBNYXRoLlBJICogMik7XG4gICAgcGFydGljbGVTZXR0aW5ncy5zZXRMaWZlKDQwLCA4MCwgMTAsIDQwKTtcbiAgICBwYXJ0aWNsZVNldHRpbmdzLnNldFNjYWxlKC40LCAxKTtcbiAgICBwYXJ0aWNsZVNldHRpbmdzLnNldERlY2F5KC45NSwgLjk1KTtcbiAgICBwYXJ0aWNsZVNldHRpbmdzLnNldEdyYXZpdHkoLjUsIDEpO1xuICAgIHBhcnRpY2xlU2V0dGluZ3MuYWRkQmVoYXZpb3VyKFZlbG9jaXR5QmVoYXZpb3VyKTtcbiAgICBwYXJ0aWNsZVNldHRpbmdzLmFkZEJlaGF2aW91cihMaWZlQmVoYXZpb3VyKTtcbiAgICBwYXJ0aWNsZVNldHRpbmdzLmFkZEJlaGF2aW91cihEZWNheUJlaGF2aW91cik7XG4gICAgcGFydGljbGVTZXR0aW5ncy5hZGRUZXh0dXJlKFRleHR1cmVHZW5lcmF0b3IuY2lyY2xlKDMsIDB4ZGRmZmZmLCB0cnVlKSk7XG4gICAgcGFydGljbGVTZXR0aW5ncy5hZGRUZXh0dXJlKFRleHR1cmVHZW5lcmF0b3IuY2lyY2xlKDMsIDB4ZmZmZmZmLCB0cnVlKSk7XG4gICAgcGFydGljbGVTZXR0aW5ncy5hZGRUZXh0dXJlKFRleHR1cmVHZW5lcmF0b3IuY2lyY2xlKDMsIDB4ZmZkZGZmLCB0cnVlKSk7XG4gICAgcGFydGljbGVTZXR0aW5ncy5hZGRUZXh0dXJlKFRleHR1cmVHZW5lcmF0b3IuY2lyY2xlKDMsIDB4ZmZmZmRkLCB0cnVlKSk7XG5cbiAgICB2YXIgZW1pdHRlclNldHRpbmdzID0gbmV3IEVtaXR0ZXJTZXR0aW5ncygpO1xuICAgIGVtaXR0ZXJTZXR0aW5ncy5zZXRRdWFudGl0eSgxMDApO1xuXG4gICAgdGhpcy5idXJzdEVtaXR0ZXIgPSBuZXcgRW1pdHRlcih0aGlzLCBwYXJ0aWNsZVNldHRpbmdzLCBlbWl0dGVyU2V0dGluZ3MpO1xufTtcblxuRmlyZXdvcmszLnByb3RvdHlwZS5nZXRUcmFpbEVtaXR0ZXIgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgdHJhaWxQYXJ0aWNsZVNldHRpbmdzID0gbmV3IFBhcnRpY2xlU2V0dGluZ3MoKTtcbiAgICB0cmFpbFBhcnRpY2xlU2V0dGluZ3Muc2V0TGlmZSgzLCA4LCAxLCAyMCk7XG4gICAgdHJhaWxQYXJ0aWNsZVNldHRpbmdzLnNldEFscGhhKC4xLCAuNSk7XG4gICAgdHJhaWxQYXJ0aWNsZVNldHRpbmdzLmFkZEJlaGF2aW91cihMaWZlQmVoYXZpb3VyKTtcbiAgICB0cmFpbFBhcnRpY2xlU2V0dGluZ3MuYWRkVGV4dHVyZShUZXh0dXJlR2VuZXJhdG9yLmNpcmNsZSgxLCAweGYyZmZlMiwgdHJ1ZSkpO1xuICAgIHRyYWlsUGFydGljbGVTZXR0aW5ncy5hZGRUZXh0dXJlKFRleHR1cmVHZW5lcmF0b3IuY2lyY2xlKDEsIDB4ZjVmZmE2LCB0cnVlLCA0KSk7XG4gICAgdHJhaWxQYXJ0aWNsZVNldHRpbmdzLmFkZFRleHR1cmUoVGV4dHVyZUdlbmVyYXRvci5jaXJjbGUoMiwgMHhmNWZmYTYsIHRydWUsIDgpKTtcblxuICAgIHZhciB0cmFpbEVtaXR0ZXJTZXR0aW5ncyA9IG5ldyBFbWl0dGVyU2V0dGluZ3MoKTtcbiAgICB0cmFpbEVtaXR0ZXJTZXR0aW5ncy5zZXRRdWFudGl0eSgxMDApO1xuICAgIHRyYWlsRW1pdHRlclNldHRpbmdzLnNldFJlc3Bhd24odHJ1ZSk7XG5cbiAgICByZXR1cm4gbmV3IEVtaXR0ZXIodGhpcywgdHJhaWxQYXJ0aWNsZVNldHRpbmdzLCB0cmFpbEVtaXR0ZXJTZXR0aW5ncyk7XG59O1xuXG5GaXJld29yazMucHJvdG90eXBlLnN0YXJ0ID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHRyYWlsRW1pdHRlciA9IHRoaXMuZ2V0VHJhaWxFbWl0dGVyKCk7XG4gICAgdmFyIGxhdW5jaFBvc2l0aW9uID0gRmlyZXdvcmtQb3NpdGlvbnMubGF1bmNoUG9zaXRpb24oKTtcbiAgICB2YXIgYnVyc3RQb3NpdGlvbiA9IEZpcmV3b3JrUG9zaXRpb25zLmJ1cnN0UG9zaXRpb24oKTtcblxuICAgIHRyYWlsRW1pdHRlci54ID0gbGF1bmNoUG9zaXRpb24ueDtcbiAgICB0cmFpbEVtaXR0ZXIueSA9IGxhdW5jaFBvc2l0aW9uLnk7XG4gICAgdHJhaWxFbWl0dGVyLnN0YXJ0KCk7XG5cbiAgICB0aGlzLnRyYWlsRW1pdHRlcnMucHVzaCh0cmFpbEVtaXR0ZXIpO1xuXG4gICAgdmFyIGNhbGxiYWNrID0gdGhpcy50cmFpbENvbXBsZXRlLmJpbmQodGhpcyk7XG5cbiAgICBuZXcgVFdFRU4uVHdlZW4odHJhaWxFbWl0dGVyKVxuICAgICAgICAudG8oe3ggOiBidXJzdFBvc2l0aW9uLngsIHkgOiBidXJzdFBvc2l0aW9uLnl9LCAyMDAwKVxuICAgICAgICAuZWFzaW5nKFRXRUVOLkVhc2luZy5DdWJpYy5JbilcbiAgICAgICAgLnN0YXJ0KClcbiAgICAgICAgLm9uQ29tcGxldGUoZnVuY3Rpb24oKXsgY2FsbGJhY2sodHJhaWxFbWl0dGVyKSB9KTtcbn07XG5cbkZpcmV3b3JrMy5wcm90b3R5cGUudHJhaWxDb21wbGV0ZSA9IGZ1bmN0aW9uKHRyYWlsRW1pdHRlcikge1xuICAgIHRoaXMuc21va2VFbWl0dGVyLnggPSB0aGlzLmJ1cnN0RW1pdHRlci54ID0gdHJhaWxFbWl0dGVyLng7XG4gICAgdGhpcy5zbW9rZUVtaXR0ZXIueSA9IHRoaXMuYnVyc3RFbWl0dGVyLnkgPSB0cmFpbEVtaXR0ZXIueTtcblxuICAgIHRoaXMuc21va2VFbWl0dGVyLnN0YXJ0KCk7XG4gICAgdGhpcy5idXJzdEVtaXR0ZXIuc3RhcnQoKTtcblxuICAgIFJpcHBsZUJlaGF2aW91ci5zdGFydEZsYXNoKDE1MDApO1xuICAgIHRyYWlsRW1pdHRlci5zdG9wUmVzcGF3bigpO1xuICAgIHRyYWlsRW1pdHRlci5zZXREZWFkV2hlbkVtcHR5KHRydWUpO1xufTtcblxuRmlyZXdvcmszLnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnNtb2tlRW1pdHRlci51cGRhdGUoKTtcbiAgICB0aGlzLmJ1cnN0RW1pdHRlci51cGRhdGUoKTtcblxuICAgIHZhciBuZWVkc0NvbXBhY3RpbmcgPSBmYWxzZTtcblxuICAgIGZvcih2YXIgaSA9IDA7IGkgPCAgdGhpcy50cmFpbEVtaXR0ZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHRoaXMudHJhaWxFbWl0dGVyc1tpXS51cGRhdGUoKTtcblxuICAgICAgICBpZih0aGlzLnRyYWlsRW1pdHRlcnNbaV0uaXNEZWFkKCkpIHtcbiAgICAgICAgICAgIHRoaXMudHJhaWxFbWl0dGVyc1tpXSA9IG51bGw7XG4gICAgICAgICAgICBuZWVkc0NvbXBhY3RpbmcgPSB0cnVlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgaWYobmVlZHNDb21wYWN0aW5nKSB7XG4gICAgICAgIENvbXBhY3RBcnJheS5jb21wYWN0KHRoaXMudHJhaWxFbWl0dGVycyk7XG4gICAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBGaXJld29yazM7IiwiRmlyZXdvcms0LmNvbnN0cnVjdG9yID0gRmlyZXdvcms0O1xuRmlyZXdvcms0LnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoUElYSS5Db250YWluZXIucHJvdG90eXBlKTtcblxudmFyIEVtaXR0ZXIgPSByZXF1aXJlKCcuLy4uL3BhcnRpY2xlLXN5c3RlbS9lbWl0dGVyL0VtaXR0ZXInKTtcbnZhciBFbWl0dGVyU2V0dGluZ3MgPSByZXF1aXJlKCcuLy4uL3BhcnRpY2xlLXN5c3RlbS9lbWl0dGVyL0VtaXR0ZXJTZXR0aW5ncycpO1xudmFyIFBhcnRpY2xlU2V0dGluZ3MgPSByZXF1aXJlKCcuLy4uL3BhcnRpY2xlLXN5c3RlbS9wYXJ0aWNsZS9QYXJ0aWNsZVNldHRpbmdzJyk7XG52YXIgVGV4dHVyZUdlbmVyYXRvciA9IHJlcXVpcmUoJy4vLi4vcGFydGljbGUtc3lzdGVtL3V0aWxzL1RleHR1cmVHZW5lcmF0b3InKTtcbnZhciBWZWxvY2l0eUJlaGF2aW91ciA9IHJlcXVpcmUoJy4vLi4vcGFydGljbGUtc3lzdGVtL2JlaGF2aW91cnMvVmVsb2NpdHlCZWhhdmlvdXInKTtcbnZhciBMaWZlQmVoYXZpb3VyID0gcmVxdWlyZSgnLi8uLi9wYXJ0aWNsZS1zeXN0ZW0vYmVoYXZpb3Vycy9MaWZlQmVoYXZpb3VyJyk7XG52YXIgR3Jhdml0eUJlaGF2aW91ciA9IHJlcXVpcmUoJy4vLi4vcGFydGljbGUtc3lzdGVtL2JlaGF2aW91cnMvR3Jhdml0eUJlaGF2aW91cicpO1xudmFyIFJvdGF0aW9uQmVoYXZpb3VyID0gcmVxdWlyZSgnLi8uLi9wYXJ0aWNsZS1zeXN0ZW0vYmVoYXZpb3Vycy9Sb3RhdGlvbkJlaGF2aW91cicpO1xudmFyIERlY2F5QmVoYXZpb3VyID0gcmVxdWlyZSgnLi8uLi9wYXJ0aWNsZS1zeXN0ZW0vYmVoYXZpb3Vycy9EZWNheUJlaGF2aW91cicpO1xudmFyIEZpcmV3b3JrUG9zaXRpb25zID0gcmVxdWlyZSgnLi9GaXJld29ya1Bvc2l0aW9ucycpO1xudmFyIENvbXBhY3RBcnJheSA9IHJlcXVpcmUoJy4vLi4vcGFydGljbGUtc3lzdGVtL3V0aWxzL0NvbXBhY3RBcnJheScpO1xudmFyIFJpcHBsZUJlaGF2aW91ciA9IHJlcXVpcmUoJy4vLi4vcGFydGljbGUtc3lzdGVtL2JlaGF2aW91cnMvUmlwcGxlQmVoYXZpb3VyJyk7XG5cbmZ1bmN0aW9uIEZpcmV3b3JrNCgpIHtcbiAgICBQSVhJLkNvbnRhaW5lci5jYWxsKHRoaXMpO1xuXG4gICAgdGhpcy50cmFpbEVtaXR0ZXJzID0gW107XG5cbiAgICB0aGlzLnNldHVwU21va2VFZmZlY3QoKTtcbiAgICB0aGlzLnNldHVwQnVyc3RFZmZlY3QoKTtcbn1cblxuRmlyZXdvcms0LnByb3RvdHlwZS5zZXR1cFNtb2tlRWZmZWN0ID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHBhcnRpY2xlU2V0dGluZ3MgPSBuZXcgUGFydGljbGVTZXR0aW5ncygpO1xuICAgIHBhcnRpY2xlU2V0dGluZ3Muc2V0U3BlZWQoLjEsIC4yKTtcbiAgICBwYXJ0aWNsZVNldHRpbmdzLnNldERpcmVjdGlvbigwLCBNYXRoLlBJICogMik7XG4gICAgcGFydGljbGVTZXR0aW5ncy5zZXRMaWZlKDIwLCA0MCwgMTAsIDIwKTtcbiAgICBwYXJ0aWNsZVNldHRpbmdzLnNldEFscGhhKC4xLCAuMik7XG4gICAgcGFydGljbGVTZXR0aW5ncy5zZXRTY2FsZSgxMCwgMTUpO1xuICAgIHBhcnRpY2xlU2V0dGluZ3MuYWRkQmVoYXZpb3VyKFZlbG9jaXR5QmVoYXZpb3VyKTtcbiAgICBwYXJ0aWNsZVNldHRpbmdzLmFkZEJlaGF2aW91cihMaWZlQmVoYXZpb3VyKTtcbiAgICBwYXJ0aWNsZVNldHRpbmdzLmFkZEJlaGF2aW91cihSb3RhdGlvbkJlaGF2aW91cik7XG4gICAgcGFydGljbGVTZXR0aW5ncy5hZGRUZXh0dXJlKFRleHR1cmVHZW5lcmF0b3IuY2lyY2xlKDMsIDB4ZmZmZmZmLCBmYWxzZSwgMikpO1xuICAgIHBhcnRpY2xlU2V0dGluZ3MuYWRkVGV4dHVyZShUZXh0dXJlR2VuZXJhdG9yLmNpcmNsZSgzLCAweGMzZThiZSwgdHJ1ZSwgMikpO1xuICAgIHBhcnRpY2xlU2V0dGluZ3MuYWRkVGV4dHVyZShUZXh0dXJlR2VuZXJhdG9yLmNpcmNsZSgzLCAweGJkZmFiMCwgZmFsc2UsIDIpKTtcbiAgICBwYXJ0aWNsZVNldHRpbmdzLmFkZFRleHR1cmUoVGV4dHVyZUdlbmVyYXRvci5jaXJjbGUoMywgMHhjYWY5NzcsIGZhbHNlLCAyKSk7XG4gICAgcGFydGljbGVTZXR0aW5ncy5hZGRUZXh0dXJlKFRleHR1cmVHZW5lcmF0b3IuY2lyY2xlKDMsIDB4NWFmYTliLCBmYWxzZSwgMikpO1xuXG4gICAgdmFyIGVtaXR0ZXJTZXR0aW5ncyA9IG5ldyBFbWl0dGVyU2V0dGluZ3MoKTtcbiAgICBlbWl0dGVyU2V0dGluZ3Muc2V0UXVhbnRpdHkoMjApO1xuICAgIGVtaXR0ZXJTZXR0aW5ncy5zZXRCb3VuZHMoe3R5cGU6XCJDSVJDTEVcIiwgcmFkaXVzOjEyMH0pO1xuXG4gICAgdGhpcy5zbW9rZUVtaXR0ZXIgPSBuZXcgRW1pdHRlcih0aGlzLCBwYXJ0aWNsZVNldHRpbmdzLCBlbWl0dGVyU2V0dGluZ3MpO1xufTtcblxuRmlyZXdvcms0LnByb3RvdHlwZS5zZXR1cEJ1cnN0RWZmZWN0ID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHBhcnRpY2xlU2V0dGluZ3MgPSBuZXcgUGFydGljbGVTZXR0aW5ncygpO1xuICAgIHBhcnRpY2xlU2V0dGluZ3Muc2V0U3BlZWQoMiwgMTUpO1xuICAgIHBhcnRpY2xlU2V0dGluZ3Muc2V0RGlyZWN0aW9uKDAsIE1hdGguUEkgKiAyKTtcbiAgICBwYXJ0aWNsZVNldHRpbmdzLnNldExpZmUoMzAsIDYwLCAxMCwgMzApO1xuICAgIHBhcnRpY2xlU2V0dGluZ3Muc2V0U2NhbGUoLjQsIDEuMik7XG4gICAgcGFydGljbGVTZXR0aW5ncy5zZXREZWNheSguOTEsIC45MSk7XG4gICAgcGFydGljbGVTZXR0aW5ncy5zZXRHcmF2aXR5KC4xLCAxKTtcbiAgICBwYXJ0aWNsZVNldHRpbmdzLmFkZEJlaGF2aW91cihWZWxvY2l0eUJlaGF2aW91cik7XG4gICAgcGFydGljbGVTZXR0aW5ncy5hZGRCZWhhdmlvdXIoTGlmZUJlaGF2aW91cik7XG4gICAgcGFydGljbGVTZXR0aW5ncy5hZGRCZWhhdmlvdXIoR3Jhdml0eUJlaGF2aW91cik7XG4gICAgcGFydGljbGVTZXR0aW5ncy5hZGRCZWhhdmlvdXIoRGVjYXlCZWhhdmlvdXIpO1xuICAgIHBhcnRpY2xlU2V0dGluZ3MuYWRkVGV4dHVyZShUZXh0dXJlR2VuZXJhdG9yLmNpcmNsZSgzLCAweGMzZThiZSwgdHJ1ZSkpO1xuICAgIHBhcnRpY2xlU2V0dGluZ3MuYWRkVGV4dHVyZShUZXh0dXJlR2VuZXJhdG9yLmNpcmNsZSgzLCAweGJkZmFiMCwgdHJ1ZSkpO1xuICAgIHBhcnRpY2xlU2V0dGluZ3MuYWRkVGV4dHVyZShUZXh0dXJlR2VuZXJhdG9yLmNpcmNsZSgzLCAweGNhZjk3NywgdHJ1ZSkpO1xuXG4gICAgdmFyIGVtaXR0ZXJTZXR0aW5ncyA9IG5ldyBFbWl0dGVyU2V0dGluZ3MoKTtcbiAgICBlbWl0dGVyU2V0dGluZ3Muc2V0UXVhbnRpdHkoMTAwKTtcblxuICAgIHRoaXMuYnVyc3RFbWl0dGVyID0gbmV3IEVtaXR0ZXIodGhpcywgcGFydGljbGVTZXR0aW5ncywgZW1pdHRlclNldHRpbmdzKTtcbn07XG5cbkZpcmV3b3JrNC5wcm90b3R5cGUuZ2V0U3BhcmtsZUVtaXR0ZXIgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgcGFydGljbGVTZXR0aW5ncyA9IG5ldyBQYXJ0aWNsZVNldHRpbmdzKCk7XG4gICAgcGFydGljbGVTZXR0aW5ncy5zZXREaXJlY3Rpb24oMCwgTWF0aC5QSSAqIDIpO1xuICAgIHBhcnRpY2xlU2V0dGluZ3Muc2V0TGlmZSgyLCA4LCAwLCAwKTtcbiAgICBwYXJ0aWNsZVNldHRpbmdzLnNldFNjYWxlKC40LCAxKTtcbiAgICBwYXJ0aWNsZVNldHRpbmdzLnNldEdyYXZpdHkoMSwgMSk7XG4gICAgcGFydGljbGVTZXR0aW5ncy5hZGRCZWhhdmlvdXIoVmVsb2NpdHlCZWhhdmlvdXIpO1xuICAgIHBhcnRpY2xlU2V0dGluZ3MuYWRkQmVoYXZpb3VyKExpZmVCZWhhdmlvdXIpO1xuICAgIHBhcnRpY2xlU2V0dGluZ3MuYWRkQmVoYXZpb3VyKEdyYXZpdHlCZWhhdmlvdXIpO1xuICAgIHBhcnRpY2xlU2V0dGluZ3MuYWRkVGV4dHVyZShUZXh0dXJlR2VuZXJhdG9yLmNpcmNsZSgyLCAweGZmZmZmZiwgdHJ1ZSkpO1xuICAgIHBhcnRpY2xlU2V0dGluZ3MuYWRkVGV4dHVyZShUZXh0dXJlR2VuZXJhdG9yLmNpcmNsZSgyLCAweGZmZmZmZiwgdHJ1ZSwgNikpO1xuXG4gICAgdmFyIGVtaXR0ZXJTZXR0aW5ncyA9IG5ldyBFbWl0dGVyU2V0dGluZ3MoKTtcbiAgICBlbWl0dGVyU2V0dGluZ3Muc2V0UXVhbnRpdHkoMzAwKTtcbiAgICBlbWl0dGVyU2V0dGluZ3Muc2V0U3Bhd25EZWxheSg1MDAsIDI1MDApO1xuICAgIGVtaXR0ZXJTZXR0aW5ncy5zZXRCb3VuZHMoe3R5cGU6XCJDSVJDTEVcIiwgcmFkaXVzOjE4MH0pO1xuXG4gICAgcmV0dXJuIG5ldyBFbWl0dGVyKHRoaXMsIHBhcnRpY2xlU2V0dGluZ3MsIGVtaXR0ZXJTZXR0aW5ncyk7XG59O1xuXG5GaXJld29yazQucHJvdG90eXBlLmdldFRyYWlsRW1pdHRlciA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciB0cmFpbFBhcnRpY2xlU2V0dGluZ3MgPSBuZXcgUGFydGljbGVTZXR0aW5ncygpO1xuICAgIHRyYWlsUGFydGljbGVTZXR0aW5ncy5zZXRMaWZlKDMsIDgsIDEsIDIwKTtcbiAgICB0cmFpbFBhcnRpY2xlU2V0dGluZ3Muc2V0QWxwaGEoLjEsIC41KTtcbiAgICB0cmFpbFBhcnRpY2xlU2V0dGluZ3MuYWRkQmVoYXZpb3VyKExpZmVCZWhhdmlvdXIpO1xuICAgIHRyYWlsUGFydGljbGVTZXR0aW5ncy5hZGRUZXh0dXJlKFRleHR1cmVHZW5lcmF0b3IuY2lyY2xlKDEsIDB4ODBmZmVhLCB0cnVlKSk7XG4gICAgdHJhaWxQYXJ0aWNsZVNldHRpbmdzLmFkZFRleHR1cmUoVGV4dHVyZUdlbmVyYXRvci5jaXJjbGUoMSwgMHhiNWZmZjIsIHRydWUsIDQpKTtcbiAgICB0cmFpbFBhcnRpY2xlU2V0dGluZ3MuYWRkVGV4dHVyZShUZXh0dXJlR2VuZXJhdG9yLmNpcmNsZSgyLCAweEZGRkZGRiwgdHJ1ZSwgOCkpO1xuXG4gICAgdmFyIHRyYWlsRW1pdHRlclNldHRpbmdzID0gbmV3IEVtaXR0ZXJTZXR0aW5ncygpO1xuICAgIHRyYWlsRW1pdHRlclNldHRpbmdzLnNldFF1YW50aXR5KDEwMCk7XG4gICAgdHJhaWxFbWl0dGVyU2V0dGluZ3Muc2V0UmVzcGF3bih0cnVlKTtcblxuICAgIHJldHVybiBuZXcgRW1pdHRlcih0aGlzLCB0cmFpbFBhcnRpY2xlU2V0dGluZ3MsIHRyYWlsRW1pdHRlclNldHRpbmdzKTtcbn07XG5cblxuRmlyZXdvcms0LnByb3RvdHlwZS5zdGFydCA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciB0cmFpbEVtaXR0ZXIgPSB0aGlzLmdldFRyYWlsRW1pdHRlcigpO1xuICAgIHZhciBsYXVuY2hQb3NpdGlvbiA9IEZpcmV3b3JrUG9zaXRpb25zLmxhdW5jaFBvc2l0aW9uKCk7XG4gICAgdmFyIGJ1cnN0UG9zaXRpb24gPSBGaXJld29ya1Bvc2l0aW9ucy5idXJzdFBvc2l0aW9uKCk7XG5cbiAgICB0cmFpbEVtaXR0ZXIueCA9IGxhdW5jaFBvc2l0aW9uLng7XG4gICAgdHJhaWxFbWl0dGVyLnkgPSBsYXVuY2hQb3NpdGlvbi55O1xuICAgIHRyYWlsRW1pdHRlci5zdGFydCgpO1xuXG4gICAgdGhpcy50cmFpbEVtaXR0ZXJzLnB1c2godHJhaWxFbWl0dGVyKTtcblxuICAgIHZhciBjYWxsYmFjayA9IHRoaXMudHJhaWxDb21wbGV0ZS5iaW5kKHRoaXMpO1xuXG4gICAgbmV3IFRXRUVOLlR3ZWVuKHRyYWlsRW1pdHRlcilcbiAgICAgICAgLnRvKHt4IDogYnVyc3RQb3NpdGlvbi54LCB5IDogYnVyc3RQb3NpdGlvbi55fSwgMjAwMClcbiAgICAgICAgLmVhc2luZyhUV0VFTi5FYXNpbmcuQ3ViaWMuSW4pXG4gICAgICAgIC5zdGFydCgpXG4gICAgICAgIC5vbkNvbXBsZXRlKGZ1bmN0aW9uKCl7IGNhbGxiYWNrKHRyYWlsRW1pdHRlcikgfSk7XG59O1xuXG5GaXJld29yazQucHJvdG90eXBlLnRyYWlsQ29tcGxldGUgPSBmdW5jdGlvbih0cmFpbEVtaXR0ZXIpIHtcbiAgICB2YXIgc3BhcmtsZUVtaXR0ZXIgPSB0aGlzLmdldFNwYXJrbGVFbWl0dGVyKCk7XG4gICAgdGhpcy50cmFpbEVtaXR0ZXJzLnB1c2goc3BhcmtsZUVtaXR0ZXIpO1xuICAgIHRoaXMuc21va2VFbWl0dGVyLnggPSB0aGlzLmJ1cnN0RW1pdHRlci54ID0gc3BhcmtsZUVtaXR0ZXIueCA9IHRyYWlsRW1pdHRlci54O1xuICAgIHRoaXMuc21va2VFbWl0dGVyLnkgPSB0aGlzLmJ1cnN0RW1pdHRlci55ID0gc3BhcmtsZUVtaXR0ZXIueSA9IHRyYWlsRW1pdHRlci55O1xuXG4gICAgdGhpcy5zbW9rZUVtaXR0ZXIuc3RhcnQoKTtcbiAgICB0aGlzLmJ1cnN0RW1pdHRlci5zdGFydCgpO1xuICAgIHNwYXJrbGVFbWl0dGVyLnN0YXJ0KCk7XG5cbiAgICBSaXBwbGVCZWhhdmlvdXIuc3RhcnRGbGFzaCgxNTAwKTtcbiAgICB0cmFpbEVtaXR0ZXIuc3RvcFJlc3Bhd24oKTtcbiAgICB0cmFpbEVtaXR0ZXIuc2V0RGVhZFdoZW5FbXB0eSh0cnVlKTtcbiAgICBzcGFya2xlRW1pdHRlci5zZXREZWFkV2hlbkVtcHR5KHRydWUpO1xufTtcblxuRmlyZXdvcms0LnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnNtb2tlRW1pdHRlci51cGRhdGUoKTtcbiAgICB0aGlzLmJ1cnN0RW1pdHRlci51cGRhdGUoKTtcblxuICAgIHZhciBuZWVkc0NvbXBhY3RpbmcgPSBmYWxzZTtcblxuICAgIGZvcih2YXIgaSA9IDA7IGkgPCAgdGhpcy50cmFpbEVtaXR0ZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHRoaXMudHJhaWxFbWl0dGVyc1tpXS51cGRhdGUoKTtcblxuICAgICAgICBpZih0aGlzLnRyYWlsRW1pdHRlcnNbaV0uaXNEZWFkKCkpIHtcbiAgICAgICAgICAgIHRoaXMudHJhaWxFbWl0dGVyc1tpXSA9IG51bGw7XG4gICAgICAgICAgICBuZWVkc0NvbXBhY3RpbmcgPSB0cnVlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgaWYobmVlZHNDb21wYWN0aW5nKSB7XG4gICAgICAgIENvbXBhY3RBcnJheS5jb21wYWN0KHRoaXMudHJhaWxFbWl0dGVycyk7XG4gICAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBGaXJld29yazQ7IiwidmFyIFF1aWNrUmFuZ2UgPSByZXF1aXJlKCcuLi9wYXJ0aWNsZS1zeXN0ZW0vdXRpbHMvUXVpY2tSYW5nZScpO1xuXG52YXIgRmlyZXdvcmtQb3NpdGlvbnMgPSB7fTtcblxuRmlyZXdvcmtQb3NpdGlvbnMubGF1bmNoUG9zaXRpb24gPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgcG9zaXRpb24gPSB7fTtcbiAgICBwb3NpdGlvbi54ID0gKHdpbmRvdy5pbm5lcldpZHRoIC8gMikgKyBRdWlja1JhbmdlLnJhbmdlKC01MCwgNTApO1xuICAgIHBvc2l0aW9uLnkgPSB3aW5kb3cuaW5uZXJIZWlnaHQ7XG4gICAgcmV0dXJuIHBvc2l0aW9uO1xufTtcblxuRmlyZXdvcmtQb3NpdGlvbnMuYnVyc3RQb3NpdGlvbiA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBwb3NpdGlvbiA9IHt9O1xuICAgIHBvc2l0aW9uLnggPSAod2luZG93LmlubmVyV2lkdGggLyAyKSArIFF1aWNrUmFuZ2UucmFuZ2UoKC13aW5kb3cuaW5uZXJXaWR0aCAvIDMpLCAod2luZG93LmlubmVyV2lkdGggLyAzKSk7XG4gICAgcG9zaXRpb24ueSA9IFF1aWNrUmFuZ2UucmFuZ2UoMTAwLCAyMDApO1xuICAgIHJldHVybiBwb3NpdGlvbjtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gRmlyZXdvcmtQb3NpdGlvbnM7IiwiUmFpbi5jb25zdHJ1Y3RvciA9IFJhaW47XG5SYWluLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoUElYSS5Db250YWluZXIucHJvdG90eXBlKTtcblxudmFyIEVtaXR0ZXIgPSByZXF1aXJlKCcuLy4uL3BhcnRpY2xlLXN5c3RlbS9lbWl0dGVyL0VtaXR0ZXInKTtcbnZhciBFbWl0dGVyU2V0dGluZ3MgPSByZXF1aXJlKCcuLy4uL3BhcnRpY2xlLXN5c3RlbS9lbWl0dGVyL0VtaXR0ZXJTZXR0aW5ncycpO1xudmFyIFBhcnRpY2xlU2V0dGluZ3MgPSByZXF1aXJlKCcuLy4uL3BhcnRpY2xlLXN5c3RlbS9wYXJ0aWNsZS9QYXJ0aWNsZVNldHRpbmdzJyk7XG52YXIgVGV4dHVyZUdlbmVyYXRvciA9IHJlcXVpcmUoJy4vLi4vcGFydGljbGUtc3lzdGVtL3V0aWxzL1RleHR1cmVHZW5lcmF0b3InKTtcbnZhciBWZWxvY2l0eUJlaGF2aW91ciA9IHJlcXVpcmUoJy4vLi4vcGFydGljbGUtc3lzdGVtL2JlaGF2aW91cnMvVmVsb2NpdHlCZWhhdmlvdXInKTtcbnZhciBMaWZlQmVoYXZpb3VyID0gcmVxdWlyZSgnLi8uLi9wYXJ0aWNsZS1zeXN0ZW0vYmVoYXZpb3Vycy9MaWZlQmVoYXZpb3VyJyk7XG52YXIgU3BpcmFsQmVoYXZpb3VyID0gcmVxdWlyZSgnLi8uLi9wYXJ0aWNsZS1zeXN0ZW0vYmVoYXZpb3Vycy9TcGlyYWxCZWhhdmlvdXInKTtcbnZhciBHcmF2aXR5QmVoYXZpb3VyID0gcmVxdWlyZSgnLi8uLi9wYXJ0aWNsZS1zeXN0ZW0vYmVoYXZpb3Vycy9HcmF2aXR5QmVoYXZpb3VyJyk7XG5cbmZ1bmN0aW9uIFJhaW4oKSB7XG4gICAgUElYSS5Db250YWluZXIuY2FsbCh0aGlzKTtcblxuICAgIHRoaXMudHJhaWxFbWl0dGVycyA9IFtdO1xuXG4gICAgdGhpcy5zZXR1cEJ1cnN0RWZmZWN0KCk7XG59XG5cblJhaW4ucHJvdG90eXBlLnNldHVwQnVyc3RFZmZlY3QgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgcGFydGljbGVTZXR0aW5ncyA9IG5ldyBQYXJ0aWNsZVNldHRpbmdzKCk7XG4gICAgcGFydGljbGVTZXR0aW5ncy5zZXRMaWZlKDQwLCAzMDAsIDEwLCA1MCk7XG4gICAgcGFydGljbGVTZXR0aW5ncy5zZXRTcGVlZCg1LCA1KTtcbiAgICBwYXJ0aWNsZVNldHRpbmdzLnNldERpcmVjdGlvbihNYXRoLlBJLCBNYXRoLlBJICogMik7XG4gICAgcGFydGljbGVTZXR0aW5ncy5zZXRTY2FsZSguMiwgMSk7XG4gICAgcGFydGljbGVTZXR0aW5ncy5zZXRHcmF2aXR5KDEsIDIpO1xuICAgIHBhcnRpY2xlU2V0dGluZ3MuYWRkQmVoYXZpb3VyKEdyYXZpdHlCZWhhdmlvdXIpO1xuICAgIHBhcnRpY2xlU2V0dGluZ3MuYWRkQmVoYXZpb3VyKFNwaXJhbEJlaGF2aW91cik7XG4gICAgcGFydGljbGVTZXR0aW5ncy5hZGRCZWhhdmlvdXIoTGlmZUJlaGF2aW91cik7XG4gICAgcGFydGljbGVTZXR0aW5ncy5hZGRUZXh0dXJlKFRleHR1cmVHZW5lcmF0b3IuY2lyY2xlKDIsIDB4ZmZmZmZmLCB0cnVlKSk7XG4gICAgcGFydGljbGVTZXR0aW5ncy5hZGRUZXh0dXJlKFRleHR1cmVHZW5lcmF0b3IuY2lyY2xlKDIsIDB4OTFmZmExLCB0cnVlKSk7XG4gICAgcGFydGljbGVTZXR0aW5ncy5hZGRUZXh0dXJlKFRleHR1cmVHZW5lcmF0b3IuY2lyY2xlKDIsIDB4OTFmZmExLCB0cnVlKSk7XG4gICAgcGFydGljbGVTZXR0aW5ncy5hZGRUZXh0dXJlKFRleHR1cmVHZW5lcmF0b3IuY2lyY2xlKDIsIDB4NjZjY2ZmLCB0cnVlKSk7XG4gICAgcGFydGljbGVTZXR0aW5ncy5hZGRUZXh0dXJlKFRleHR1cmVHZW5lcmF0b3IuY2lyY2xlKDIsIDB4Y2NmZjY2LCB0cnVlKSk7XG4gICAgcGFydGljbGVTZXR0aW5ncy5hZGRUZXh0dXJlKFRleHR1cmVHZW5lcmF0b3IuY2lyY2xlKDIsIDB4ZmY2ZmNmLCB0cnVlKSk7XG5cbiAgICB2YXIgZW1pdHRlclNldHRpbmdzID0gbmV3IEVtaXR0ZXJTZXR0aW5ncygpO1xuICAgIGVtaXR0ZXJTZXR0aW5ncy5zZXRRdWFudGl0eSgxMDAwKTtcbiAgICBlbWl0dGVyU2V0dGluZ3Muc2V0Qm91bmRzKHt0eXBlOlwiUkVDVEFOR0xFXCIsIHdpZHRoOndpbmRvdy5pbm5lcldpZHRoLCBoZWlnaHQ6MX0pO1xuICAgIGVtaXR0ZXJTZXR0aW5ncy5zZXRSZXNwYXduKGZhbHNlKTtcbiAgICBlbWl0dGVyU2V0dGluZ3Muc2V0U3Bhd25EZWxheSgwLCAyMDAwKTtcblxuICAgIHRoaXMuYnVyc3RFbWl0dGVyID0gbmV3IEVtaXR0ZXIodGhpcywgcGFydGljbGVTZXR0aW5ncywgZW1pdHRlclNldHRpbmdzKTtcbn07XG5cblxuUmFpbi5wcm90b3R5cGUuc3RhcnQgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLmJ1cnN0RW1pdHRlci54ID0gd2luZG93LmlubmVyV2lkdGggLyAyO1xuICAgIHRoaXMuYnVyc3RFbWl0dGVyLnkgPSAwO1xuXG4gICAgdGhpcy5idXJzdEVtaXR0ZXIuc3RhcnQoKTtcbn07XG5cblJhaW4ucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuYnVyc3RFbWl0dGVyLnVwZGF0ZSgpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBSYWluOyIsIlJpcHBsZUVmZmVjdC5jb25zdHJ1Y3RvciA9IFJpcHBsZUVmZmVjdDtcblJpcHBsZUVmZmVjdC5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKFBJWEkuQ29udGFpbmVyLnByb3RvdHlwZSk7XG5cbnZhciBFbWl0dGVyID0gcmVxdWlyZSgnLi8uLi9wYXJ0aWNsZS1zeXN0ZW0vZW1pdHRlci9FbWl0dGVyJyk7XG52YXIgRW1pdHRlclNldHRpbmdzID0gcmVxdWlyZSgnLi8uLi9wYXJ0aWNsZS1zeXN0ZW0vZW1pdHRlci9FbWl0dGVyU2V0dGluZ3MnKTtcbnZhciBQYXJ0aWNsZVNldHRpbmdzID0gcmVxdWlyZSgnLi8uLi9wYXJ0aWNsZS1zeXN0ZW0vcGFydGljbGUvUGFydGljbGVTZXR0aW5ncycpO1xudmFyIFRleHR1cmVHZW5lcmF0b3IgPSByZXF1aXJlKCcuLy4uL3BhcnRpY2xlLXN5c3RlbS91dGlscy9UZXh0dXJlR2VuZXJhdG9yJyk7XG52YXIgVmVsb2NpdHlCZWhhdmlvdXIgPSByZXF1aXJlKCcuLy4uL3BhcnRpY2xlLXN5c3RlbS9iZWhhdmlvdXJzL1ZlbG9jaXR5QmVoYXZpb3VyJyk7XG52YXIgTGlmZUJlaGF2aW91ciA9IHJlcXVpcmUoJy4vLi4vcGFydGljbGUtc3lzdGVtL2JlaGF2aW91cnMvTGlmZUJlaGF2aW91cicpO1xudmFyIFJvdGF0aW9uQmVoYXZpb3VyID0gcmVxdWlyZSgnLi8uLi9wYXJ0aWNsZS1zeXN0ZW0vYmVoYXZpb3Vycy9Sb3RhdGlvbkJlaGF2aW91cicpO1xudmFyIFdhbmRlckJlaGF2aW91ciA9IHJlcXVpcmUoJy4vLi4vcGFydGljbGUtc3lzdGVtL2JlaGF2aW91cnMvV2FuZGVyQmVoYXZpb3VyJyk7XG52YXIgUmlwcGxlQmVoYXZpb3VyID0gcmVxdWlyZSgnLi8uLi9wYXJ0aWNsZS1zeXN0ZW0vYmVoYXZpb3Vycy9SaXBwbGVCZWhhdmlvdXInKTtcblxuZnVuY3Rpb24gUmlwcGxlRWZmZWN0KHBvc2l0aW9uKSB7XG4gICAgUElYSS5Db250YWluZXIuY2FsbCh0aGlzKTtcblxuICAgIHZhciBwYXJ0aWNsZVNldHRpbmdzID0gbmV3IFBhcnRpY2xlU2V0dGluZ3MoKTtcbiAgICBwYXJ0aWNsZVNldHRpbmdzLnNldExpZmUoMSwgMSk7XG4gICAgcGFydGljbGVTZXR0aW5ncy5hZGRCZWhhdmlvdXIoUmlwcGxlQmVoYXZpb3VyKTtcbiAgICBwYXJ0aWNsZVNldHRpbmdzLmFkZFRleHR1cmUoUElYSS5sb2FkZXIucmVzb3VyY2VzWydyaXBwbGUnXS50ZXh0dXJlKTtcblxuICAgIHZhciBlbWl0dGVyU2V0dGluZ3MgPSBuZXcgRW1pdHRlclNldHRpbmdzKCk7XG4gICAgZW1pdHRlclNldHRpbmdzLnNldEJvdW5kcyh7dHlwZTpcIlJFQ1RBTkdMRVwiLCB3aWR0aDoxMCwgaGVpZ2h0OjIwfSk7XG4gICAgZW1pdHRlclNldHRpbmdzLnNldFF1YW50aXR5KDYpO1xuXG4gICAgdGhpcy5lbWl0dGVyID0gbmV3IEVtaXR0ZXIodGhpcywgcGFydGljbGVTZXR0aW5ncywgZW1pdHRlclNldHRpbmdzKTtcbiAgICB0aGlzLmVtaXR0ZXIueCA9IHBvc2l0aW9uLng7XG4gICAgdGhpcy5lbWl0dGVyLnkgPSBwb3NpdGlvbi55O1xuICAgIHRoaXMuZW1pdHRlci5zdGFydCgpO1xufTtcblxuUmlwcGxlRWZmZWN0LnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbigpIHtcbiAgICBpZih0aGlzLmVtaXR0ZXIgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICB0aGlzLmVtaXR0ZXIudXBkYXRlKCk7XG4gICAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBSaXBwbGVFZmZlY3Q7IiwidmFyIEJlaGF2aW91ciA9IHt9O1xuXG5CZWhhdmlvdXIucmVzZXQgPSBmdW5jdGlvbihwYXJ0aWNsZSkge1xufTtcblxuQmVoYXZpb3VyLnVwZGF0ZSA9IGZ1bmN0aW9uKHBhcnRpY2xlKSB7XG4gICAgcGFydGljbGUuc3BlZWQgKj0gcGFydGljbGUuZGVjYXk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEJlaGF2aW91cjsiLCJ2YXIgQmVoYXZpb3VyID0ge307XG5cbkJlaGF2aW91ci5yZXNldCA9IGZ1bmN0aW9uKHBhcnRpY2xlKSB7XG59O1xuXG5CZWhhdmlvdXIudXBkYXRlID0gZnVuY3Rpb24ocGFydGljbGUpIHtcbiAgICBwYXJ0aWNsZS55ICs9IHBhcnRpY2xlLmdyYXZpdHk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEJlaGF2aW91cjsiLCJ2YXIgQmVoYXZpb3VyID0ge307XG5cbkJlaGF2aW91ci5yZXNldCA9IGZ1bmN0aW9uKHBhcnRpY2xlKSB7XG59O1xuXG5CZWhhdmlvdXIudXBkYXRlID0gZnVuY3Rpb24ocGFydGljbGUpIHtcbiAgICBpZihwYXJ0aWNsZS5saWZlLmxpZmVEdXJhdGlvbiA9PSAwKSB7XG4gICAgICAgIGlmKHBhcnRpY2xlLmxpZmUuZmFkZUR1cmF0aW9uID4gMCkge1xuICAgICAgICAgICAgcGFydGljbGUuYWxwaGEgLT0gcGFydGljbGUuZmFkZVBlckZyYW1lO1xuICAgICAgICAgICAgcGFydGljbGUubGlmZS5mYWRlRHVyYXRpb24tLTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHBhcnRpY2xlLmRlYWQgPSB0cnVlO1xuICAgICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcGFydGljbGUubGlmZS5saWZlRHVyYXRpb24tLTtcbiAgICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEJlaGF2aW91cjsiLCJ2YXIgUXVpY2tSYW5nZSA9IHJlcXVpcmUoJy4uL3V0aWxzL1F1aWNrUmFuZ2UnKTtcbnZhciBjb2xvdXJzID0gWzB4NGU2YzU1LCAweDc1MzkyLCAweDI2ODY5NCwgMHhmZjg1ZmZdO1xudmFyIGZsYXNoQ29sb3VycyA9IFsweGEyZTBiMiwgMHhmZmZmZmYsIDB4YjU5NGVkLCAweDM4Y2NlNF07XG5cbnZhciB1cGRhdGVDb2xvdXJzLCBzdGFydEZsYXNoO1xuXG52YXIgQmVoYXZpb3VyID0ge307XG5cbkJlaGF2aW91ci5yZXNldCA9IGZ1bmN0aW9uKHBhcnRpY2xlKSB7XG4gICAgcGFydGljbGUuc3RhcnRYID0gcGFydGljbGUueDtcbiAgICBwYXJ0aWNsZS5yaXBwbGVTcGVlZCA9IFF1aWNrUmFuZ2UucmFuZ2UoLS4wMSwgLjAxKTtcbiAgICBwYXJ0aWNsZS5yaXBwbGVSb3RhdGlvbiA9IFF1aWNrUmFuZ2UucmFuZ2UoLU1hdGguUEkgKiAyLCBNYXRoLlBJICogMik7XG4gICAgcGFydGljbGUucmlwcGxlRGlzdGFuY2UgPSBRdWlja1JhbmdlLnJhbmdlKDUwLCAxMDApO1xuICAgIHBhcnRpY2xlLnRpbnQgPSBjb2xvdXJzW1F1aWNrUmFuZ2UucmFuZ2UoMCwgY29sb3Vycy5sZW5ndGggLSAxLCB0cnVlKV07XG4gICAgaWYoUXVpY2tSYW5nZS5yYW5nZSgwLCAxLCB0cnVlKSA9PT0gMSkge3BhcnRpY2xlLnNjYWxlLnggPSAtcGFydGljbGUuc2NhbGUueH1cbn07XG5cbkJlaGF2aW91ci51cGRhdGUgPSBmdW5jdGlvbihwYXJ0aWNsZSkge1xuICAgIHBhcnRpY2xlLnJpcHBsZVJvdGF0aW9uICs9IHBhcnRpY2xlLnJpcHBsZVNwZWVkO1xuICAgIHBhcnRpY2xlLnggPSBwYXJ0aWNsZS5zdGFydFggKyAoTWF0aC5zaW4ocGFydGljbGUucmlwcGxlUm90YXRpb24pICogcGFydGljbGUucmlwcGxlRGlzdGFuY2UpO1xuICAgIHBhcnRpY2xlLnkgPSBwYXJ0aWNsZS5zdGFydFkgKyAoTWF0aC5jb3MocGFydGljbGUucmlwcGxlUm90YXRpb24pICogKHBhcnRpY2xlLnJpcHBsZURpc3RhbmNlIC8gNSkpO1xuXG4gICAgaWYodXBkYXRlQ29sb3Vycykge1xuICAgICAgICBpZihzdGFydEZsYXNoKSB7XG4gICAgICAgICAgICBwYXJ0aWNsZS50aW50ID0gY29sb3Vyc1tRdWlja1JhbmdlLnJhbmdlKDAsIGZsYXNoQ29sb3Vycy5sZW5ndGggLSAxLCB0cnVlKV07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBwYXJ0aWNsZS50aW50ID0gY29sb3Vyc1tRdWlja1JhbmdlLnJhbmdlKDAsIGNvbG91cnMubGVuZ3RoIC0gMSwgdHJ1ZSldO1xuICAgICAgICAgICAgdXBkYXRlQ29sb3VycyA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgfVxufTtcblxuQmVoYXZpb3VyLnN0YXJ0Rmxhc2ggPSBmdW5jdGlvbihkdXJhdGlvbikge1xuICAgIHVwZGF0ZUNvbG91cnMgPSB0cnVlO1xuICAgIHN0YXJ0Rmxhc2ggPSB0cnVlO1xuICAgIHNldFRpbWVvdXQoQmVoYXZpb3VyLnN0b3BGbGFzaCwgZHVyYXRpb24pO1xufTtcblxuQmVoYXZpb3VyLnN0b3BGbGFzaCA9IGZ1bmN0aW9uKCkge1xuICAgIHVwZGF0ZUNvbG91cnMgPSB0cnVlO1xuICAgIHN0YXJ0Rmxhc2ggPSBmYWxzZVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBCZWhhdmlvdXI7IiwidmFyIFF1aWNrUmFuZ2UgPSByZXF1aXJlKCcuLi91dGlscy9RdWlja1JhbmdlJyk7XG52YXIgQmVoYXZpb3VyID0ge307XG5cbkJlaGF2aW91ci5yZXNldCA9IGZ1bmN0aW9uKHBhcnRpY2xlKSB7XG4gICAgcGFydGljbGUucm90YXRpb25TcGVlZCA9IFF1aWNrUmFuZ2UucmFuZ2UoLjUsIDIpO1xufTtcblxuQmVoYXZpb3VyLnVwZGF0ZSA9IGZ1bmN0aW9uKHBhcnRpY2xlKSB7XG4gICAgcGFydGljbGUucm90YXRpb24gKz0gcGFydGljbGUucm90YXRpb25TcGVlZDtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gQmVoYXZpb3VyOyIsInZhciBRdWlja1JhbmdlID0gcmVxdWlyZSgnLi4vdXRpbHMvUXVpY2tSYW5nZScpO1xudmFyIEJlaGF2aW91ciA9IHt9O1xuXG5CZWhhdmlvdXIucmVzZXQgPSBmdW5jdGlvbihwYXJ0aWNsZSkge1xuICAgIHBhcnRpY2xlLnNwcmlyYWxSb3RhdGlvbiA9IFF1aWNrUmFuZ2UucmFuZ2UoMCwgTWF0aC5QSSAqIDIpO1xuICAgIHBhcnRpY2xlLnNwaXJhbFJvdGF0aW9uU3BlZWQgPSAuMTsvL1F1aWNrUmFuZ2UucmFuZ2UoLjAyLCAuMDUpO1xuICAgIHBhcnRpY2xlLnNwaXJhbERpc3RhbmNlID0gMjsvL1F1aWNrUmFuZ2UucmFuZ2UoLTIsIDIpO1xufTtcblxuQmVoYXZpb3VyLnVwZGF0ZSA9IGZ1bmN0aW9uKHBhcnRpY2xlKSB7XG4gICAgcGFydGljbGUuc3ByaXJhbFJvdGF0aW9uICs9IHBhcnRpY2xlLnNwaXJhbFJvdGF0aW9uU3BlZWQ7XG4gICAgcGFydGljbGUueCArPSAoTWF0aC5zaW4ocGFydGljbGUuc3ByaXJhbFJvdGF0aW9uKSAqIHBhcnRpY2xlLnNwaXJhbERpc3RhbmNlKTtcbiAgICBwYXJ0aWNsZS55ICs9ICgtTWF0aC5jb3MocGFydGljbGUuc3ByaXJhbFJvdGF0aW9uKSAqIHBhcnRpY2xlLnNwaXJhbERpc3RhbmNlKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gQmVoYXZpb3VyOyIsInZhciBCZWhhdmlvdXIgPSB7fTtcblxuQmVoYXZpb3VyLnJlc2V0ID0gZnVuY3Rpb24ocGFydGljbGUpIHtcbn07XG5cbkJlaGF2aW91ci51cGRhdGUgPSBmdW5jdGlvbihwYXJ0aWNsZSkge1xuICAgIHBhcnRpY2xlLnggKz0gcGFydGljbGUuc3BlZWQgKiBNYXRoLnNpbihwYXJ0aWNsZS5kaXJlY3Rpb24pO1xuICAgIHBhcnRpY2xlLnkgKz0gcGFydGljbGUuc3BlZWQgKiAtTWF0aC5jb3MocGFydGljbGUuZGlyZWN0aW9uKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gQmVoYXZpb3VyOyIsInZhciBRdWlja1JhbmdlID0gcmVxdWlyZSgnLi4vdXRpbHMvUXVpY2tSYW5nZScpO1xudmFyIEJlaGF2aW91ciA9IHt9O1xuXG5CZWhhdmlvdXIucmVzZXQgPSBmdW5jdGlvbihwYXJ0aWNsZSkge1xufTtcblxuQmVoYXZpb3VyLnVwZGF0ZSA9IGZ1bmN0aW9uKHBhcnRpY2xlKSB7XG4gICAgcGFydGljbGUuZGlyZWN0aW9uICs9IFF1aWNrUmFuZ2UucmFuZ2UoLTEsIDEpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBCZWhhdmlvdXI7IiwidmFyIFBhcnRpY2xlUG9vbCA9IHJlcXVpcmUoJy4uL3BhcnRpY2xlL1BhcnRpY2xlUG9vbCcpO1xudmFyIFF1aWNrUmFuZ2UgPSByZXF1aXJlKCcuLi91dGlscy9RdWlja1JhbmdlJyk7XG52YXIgQ29tcGFjdEFycmF5ID0gcmVxdWlyZSgnLi4vdXRpbHMvQ29tcGFjdEFycmF5Jyk7XG5cbmZ1bmN0aW9uIEVtaXR0ZXIoc3RhZ2UsIHBhcnRpY2xlU2V0dGluZ3MsIGVtaXR0ZXJTZXR0aW5ncykge1xuICAgIHRoaXMuc3RhZ2UgPSBzdGFnZTtcbiAgICB0aGlzLmRlYWQgPSBmYWxzZTtcbiAgICB0aGlzLmFkZGluZyA9IDA7XG4gICAgdGhpcy5wYXJ0aWNsZVNldHRpbmdzID0gcGFydGljbGVTZXR0aW5ncztcbiAgICB0aGlzLmVtaXR0ZXJTZXR0aW5ncyA9IGVtaXR0ZXJTZXR0aW5ncztcbiAgICB0aGlzLnJhbmdlID0gbmV3IFJhbmdlKCk7XG5cbiAgICBQYXJ0aWNsZVBvb2wuYWRkUGFydGljbGVzKHRoaXMuZW1pdHRlclNldHRpbmdzLnF1YW50aXR5KTtcblxuICAgIHRoaXMucGFydGljbGVzID0gW107XG59XG5cbkVtaXR0ZXIucHJvdG90eXBlLnN0YXJ0ID0gZnVuY3Rpb24oKSB7XG4gICAgZm9yKHZhciBpID0gMDsgaSA8IHRoaXMuZW1pdHRlclNldHRpbmdzLmdldFF1YW50aXR5KCk7IGkrKykge1xuICAgICAgICB2YXIgZGVsYXkgPSB0aGlzLmVtaXR0ZXJTZXR0aW5ncy5nZXRTcGF3bkRlbGF5KCk7XG4gICAgICAgIHRoaXMuYWRkaW5nKys7XG4gICAgICAgIGlmKGRlbGF5ID4gMCkge1xuICAgICAgICAgICAgc2V0VGltZW91dCh0aGlzLmFkZFBhcnRpY2xlLmJpbmQodGhpcyksIGRlbGF5KVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5hZGRQYXJ0aWNsZSgpO1xuICAgICAgICB9XG4gICAgfVxufTtcblxuRW1pdHRlci5wcm90b3R5cGUuYWRkUGFydGljbGUgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgcGFydGljbGUgPSBQYXJ0aWNsZVBvb2wuZ2V0UGFydGljbGUoKTtcbiAgICB0aGlzLnVwZGF0ZVBhcnRpY2xlKHBhcnRpY2xlKTtcbiAgICB0aGlzLnBhcnRpY2xlcy5wdXNoKHBhcnRpY2xlKTtcbiAgICB0aGlzLnN0YWdlLmFkZENoaWxkKHBhcnRpY2xlKTtcbiAgICB0aGlzLmFkZGluZy0tO1xufTtcblxuRW1pdHRlci5wcm90b3R5cGUudXBkYXRlUGFydGljbGUgPSBmdW5jdGlvbihwYXJ0aWNsZSkge1xuICAgIHBhcnRpY2xlLnJlc2V0KHRoaXMucGFydGljbGVTZXR0aW5ncywgdGhpcy5nZXRTcGF3blBvc2l0aW9uKCkpO1xufTtcblxuRW1pdHRlci5wcm90b3R5cGUuZ2V0U3Bhd25Qb3NpdGlvbiA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgYm91bmRzID0gdGhpcy5lbWl0dGVyU2V0dGluZ3MuZ2V0Qm91bmRzKCk7XG4gICAgdmFyIHhQb3MgPSB0aGlzLng7XG4gICAgdmFyIHlQb3MgPSB0aGlzLnk7XG5cbiAgICBpZihib3VuZHMudHlwZSA9PT0gXCJQT0lOVFwiKSB7XG4gICAgICAgIC8vIERvIG5vdGhpbmdcbiAgICB9IGVsc2UgaWYoYm91bmRzLnR5cGUgPT09IFwiQ0lSQ0xFXCIpIHtcbiAgICAgICAgdmFyIGFuZ2xlID0gUXVpY2tSYW5nZS5yYW5nZSgwLCBNYXRoLlBJICogMik7XG4gICAgICAgIHhQb3MgKz0gTWF0aC5zaW4oYW5nbGUpICogUXVpY2tSYW5nZS5yYW5nZSgwLCBib3VuZHMucmFkaXVzKTtcbiAgICAgICAgeVBvcyArPSBNYXRoLmNvcyhhbmdsZSkgKiBRdWlja1JhbmdlLnJhbmdlKDAsIGJvdW5kcy5yYWRpdXMpO1xuICAgIH0gZWxzZSBpZihib3VuZHMudHlwZSA9PT0gXCJSRUNUQU5HTEVcIikge1xuICAgICAgICB4UG9zICs9IFF1aWNrUmFuZ2UucmFuZ2UoLWJvdW5kcy53aWR0aCAvIDIsIGJvdW5kcy53aWR0aCAvIDIpO1xuICAgICAgICB5UG9zICs9IFF1aWNrUmFuZ2UucmFuZ2UoLWJvdW5kcy5oZWlnaHQgLyAyLCBib3VuZHMuaGVpZ2h0IC8gMik7XG4gICAgfVxuXG4gICAgcmV0dXJuIHt4OnhQb3MsIHk6eVBvc307XG59O1xuXG5FbWl0dGVyLnByb3RvdHlwZS5nZXRBY3RpdmVQYXJ0aWNsZXMgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5wYXJ0aWNsZXM7XG59O1xuXG5FbWl0dGVyLnByb3RvdHlwZS5zZXREZWFkV2hlbkVtcHR5ID0gZnVuY3Rpb24odmFsdWUpIHtcbiAgICB0aGlzLmRlYWRXaGVuRW1wdHkgPSB2YWx1ZTtcbn07XG5cbkVtaXR0ZXIucHJvdG90eXBlLmlzRGVhZCA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLmRlYWQ7XG59O1xuXG5FbWl0dGVyLnByb3RvdHlwZS5zdG9wUmVzcGF3biA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuZW1pdHRlclNldHRpbmdzLnNldFJlc3Bhd24oZmFsc2UpO1xufTtcblxuRW1pdHRlci5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHBhcnRpY2xlO1xuICAgIHZhciBuZWVkc0NvbXBhY3Rpbmc7XG5cbiAgICBmb3IodmFyIGkgPSAwOyBpIDwgdGhpcy5wYXJ0aWNsZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgcGFydGljbGUgPSB0aGlzLnBhcnRpY2xlc1tpXTtcblxuICAgICAgICBpZihwYXJ0aWNsZS5kZWFkKSB7XG4gICAgICAgICAgICBpZih0aGlzLmVtaXR0ZXJTZXR0aW5ncy5nZXRSZXNwYXduKCkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZVBhcnRpY2xlKHBhcnRpY2xlKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zdGFnZS5yZW1vdmVDaGlsZChwYXJ0aWNsZSk7XG4gICAgICAgICAgICAgICAgUGFydGljbGVQb29sLnJldHVyblBhcnRpY2xlKHBhcnRpY2xlKTtcbiAgICAgICAgICAgICAgICB0aGlzLnBhcnRpY2xlc1tpXSA9IG51bGw7XG4gICAgICAgICAgICAgICAgbmVlZHNDb21wYWN0aW5nID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHBhcnRpY2xlLnVwZGF0ZSgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgaWYobmVlZHNDb21wYWN0aW5nKSB7XG4gICAgICAgIENvbXBhY3RBcnJheS5jb21wYWN0KHRoaXMucGFydGljbGVzKTtcbiAgICB9XG5cbiAgICBpZih0aGlzLmRlYWRXaGVuRW1wdHkgJiYgdGhpcy5wYXJ0aWNsZXMubGVuZ3RoID09PSAwICYmIHRoaXMuYWRkaW5nID09PSAwKSB7XG4gICAgICAgIHRoaXMuZGVhZCA9IHRydWU7XG4gICAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBFbWl0dGVyOyIsInZhciBSYW5nZSA9IHJlcXVpcmUoJy4uL3V0aWxzL1JhbmdlJyk7XG5cbmZ1bmN0aW9uIEVtaXR0ZXJTZXR0aW5ncygpIHt9XG5cbkVtaXR0ZXJTZXR0aW5ncy5wcm90b3R5cGUuc2V0UXVhbnRpdHkgPSBmdW5jdGlvbihxdWFudGl0eSkge1xuICAgIHRoaXMuX3F1YW50aXR5ID0gcXVhbnRpdHk7XG59O1xuXG5FbWl0dGVyU2V0dGluZ3MucHJvdG90eXBlLnNldEJvdW5kcyA9IGZ1bmN0aW9uKGJvdW5kcykge1xuICAgIHRoaXMuX2JvdW5kcyA9IGJvdW5kcztcbn07XG5cbkVtaXR0ZXJTZXR0aW5ncy5wcm90b3R5cGUuc2V0UmVzcGF3biA9IGZ1bmN0aW9uKGlzUmVzcGF3bikge1xuICAgIHRoaXMuX2lzUmVzcGF3biA9IGlzUmVzcGF3bjtcbn07XG5cbkVtaXR0ZXJTZXR0aW5ncy5wcm90b3R5cGUuc2V0U3Bhd25EZWxheSA9IGZ1bmN0aW9uKG1pbiwgbWF4KSB7XG4gICAgdGhpcy5fc3Bhd25EZWxheVJhbmdlID0gbmV3IFJhbmdlKG1pbiwgbWF4KTtcbn07XG5cbi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICogR2V0dGVyc1xuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG5FbWl0dGVyU2V0dGluZ3MucHJvdG90eXBlLmdldFF1YW50aXR5ID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuX3F1YW50aXR5O1xufTtcblxuRW1pdHRlclNldHRpbmdzLnByb3RvdHlwZS5nZXRCb3VuZHMgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gKHRoaXMuX2JvdW5kcyAhPT0gdW5kZWZpbmVkKSA/IHRoaXMuX2JvdW5kcyA6IHt0eXBlOlwiUE9JTlRcIn07XG59O1xuXG5FbWl0dGVyU2V0dGluZ3MucHJvdG90eXBlLmdldFJlc3Bhd24gPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gKHRoaXMuX2lzUmVzcGF3biA9PT0gdW5kZWZpbmVkKSA/IGZhbHNlIDogdGhpcy5faXNSZXNwYXduO1xufTtcblxuRW1pdHRlclNldHRpbmdzLnByb3RvdHlwZS5nZXRTcGF3bkRlbGF5ID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuICh0aGlzLl9zcGF3bkRlbGF5UmFuZ2UpID8gdGhpcy5fc3Bhd25EZWxheVJhbmdlLnJhbmdlKCkgOiAwO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBFbWl0dGVyU2V0dGluZ3M7IiwiUGFydGljbGUuY29uc3RydWN0b3IgPSBQYXJ0aWNsZTtcblBhcnRpY2xlLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoUElYSS5TcHJpdGUucHJvdG90eXBlKTtcblxuZnVuY3Rpb24gUGFydGljbGUoKSB7XG4gICAgUElYSS5TcHJpdGUuY2FsbCh0aGlzKTtcbiAgICB0aGlzLmFuY2hvci54ID0gMC41O1xuICAgIHRoaXMuYW5jaG9yLnkgPSAwLjU7XG59XG5cblBhcnRpY2xlLnByb3RvdHlwZS5yZXNldCA9IGZ1bmN0aW9uKHNldHRpbmdzLCBwb3NpdGlvbikge1xuICAgIHRoaXMuZGVhZCA9IGZhbHNlO1xuICAgIHRoaXMuc3BlZWQgPSBzZXR0aW5ncy5nZXRTcGVlZCgpO1xuICAgIHRoaXMuZGlyZWN0aW9uID0gc2V0dGluZ3MuZ2V0RGlyZWN0aW9uKCk7XG4gICAgdGhpcy5hbHBoYSA9ICBzZXR0aW5ncy5nZXRBbHBoYSgpO1xuICAgIHRoaXMucm90YXRpb24gPSAgc2V0dGluZ3MuZ2V0Um90YXRpb24oKTtcbiAgICB0aGlzLnRleHR1cmUgPSBzZXR0aW5ncy5nZXRUZXh0dXJlKCk7XG4gICAgdGhpcy5ncmF2aXR5ID0gc2V0dGluZ3MuZ2V0R3Jhdml0eSgpO1xuICAgIHRoaXMuZGVjYXkgPSBzZXR0aW5ncy5nZXREZWNheSgpO1xuICAgIHRoaXMubGlmZSA9IHNldHRpbmdzLmdldExpZmUoKTtcbiAgICB0aGlzLnNjYWxlLnggPSB0aGlzLnNjYWxlLnkgPSBzZXR0aW5ncy5nZXRTY2FsZSgpO1xuICAgIHRoaXMuYmVoYXZpb3VycyA9IHNldHRpbmdzLmdldEJlaGF2aW91cnMoKTtcblxuICAgIGZvcih2YXIgaSA9IDA7IGkgPCB0aGlzLmJlaGF2aW91cnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdGhpcy5iZWhhdmlvdXJzW2ldLnJlc2V0KHRoaXMpO1xuICAgIH1cblxuICAgIHRoaXMueCA9IHRoaXMuc3RhcnRYID0gcG9zaXRpb24ueDtcbiAgICB0aGlzLnkgPSB0aGlzLnN0YXJ0WSA9IHBvc2l0aW9uLnk7XG5cbiAgICB0aGlzLmZhZGVQZXJGcmFtZSA9IHRoaXMuYWxwaGEgLyB0aGlzLmxpZmUuZmFkZUR1cmF0aW9uO1xufTtcblxuUGFydGljbGUucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uKCkge1xuICAgIGZvcih2YXIgaSA9IDA7IGkgPCB0aGlzLmJlaGF2aW91cnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdGhpcy5iZWhhdmlvdXJzW2ldLnVwZGF0ZSh0aGlzKTtcbiAgICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFBhcnRpY2xlOyIsInZhciBQYXJ0aWNsZSA9IHJlcXVpcmUoJy4vUGFydGljbGUnKTtcblxudmFyIFBhcnRpY2xlUG9vbCA9IHt9O1xudmFyIHBvb2wgPSBbXTtcblxuUGFydGljbGVQb29sLmFkZFBhcnRpY2xlcyA9IGZ1bmN0aW9uKHF0eSkge1xuICAgIGZvcih2YXIgaSA9IDA7IGkgPCBxdHk7IGkrKykge1xuICAgICAgICBwb29sLnB1c2gobmV3IFBhcnRpY2xlKCkpO1xuICAgIH1cbn07XG5cblBhcnRpY2xlUG9vbC5nZXRQYXJ0aWNsZSA9IGZ1bmN0aW9uKCkge1xuICAgIGlmKHBvb2wubGVuZ3RoID4gMCkge1xuICAgICAgICByZXR1cm4gcG9vbC5wb3AoKTtcbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IFBhcnRpY2xlKCk7XG59O1xuXG5QYXJ0aWNsZVBvb2wucmV0dXJuUGFydGljbGUgPSBmdW5jdGlvbihwYXJ0aWNsZSkge1xuICAgIHBvb2wucHVzaChwYXJ0aWNsZSk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFBhcnRpY2xlUG9vbDsiLCJ2YXIgUmFuZ2UgPSByZXF1aXJlKCcuLi91dGlscy9SYW5nZScpO1xuXG5mdW5jdGlvbiBQYXJ0aWNsZVNldHRpbmdzKCkge1xuICAgIHRoaXMuX3RleHR1cmVzID0gW107XG4gICAgdGhpcy5fYmVoYXZpb3VzID0gW107XG59XG5cblBhcnRpY2xlU2V0dGluZ3MucHJvdG90eXBlLnNldFNwZWVkID0gZnVuY3Rpb24obWluLCBtYXgpIHtcbiAgICB0aGlzLl9zcGVlZFJhbmdlID0gbmV3IFJhbmdlKG1pbiwgbWF4KTtcbn07XG5cblBhcnRpY2xlU2V0dGluZ3MucHJvdG90eXBlLnNldERpcmVjdGlvbiA9IGZ1bmN0aW9uKG1pbiwgbWF4KSB7XG4gICAgdGhpcy5fZGlyZWN0aW9uUmFuZ2UgPSBuZXcgUmFuZ2UobWluLCBtYXgpO1xufTtcblxuUGFydGljbGVTZXR0aW5ncy5wcm90b3R5cGUuc2V0QWxwaGEgPSBmdW5jdGlvbihtaW4sIG1heCkge1xuICAgIHRoaXMuX2FscGhhUmFuZ2UgPSBuZXcgUmFuZ2UobWluLCBtYXgpO1xufTtcblxuUGFydGljbGVTZXR0aW5ncy5wcm90b3R5cGUuc2V0Um90YXRpb24gPSBmdW5jdGlvbihtaW4sIG1heCkge1xuICAgIHRoaXMuX3JvdGF0aW9uUmFuZ2UgPSBuZXcgUmFuZ2UobWluLCBtYXgpO1xufTtcblxuUGFydGljbGVTZXR0aW5ncy5wcm90b3R5cGUuc2V0TGlmZSA9IGZ1bmN0aW9uKGxpZmVNaW4sIGxpZmVNYXgsIGZhZGVNaW4sIGZhZGVNYXgpIHtcbiAgICB0aGlzLl9saWZlRHVyYXRpb25SYW5nZSA9IG5ldyBSYW5nZShsaWZlTWluLCBsaWZlTWF4LCB0cnVlKTtcbiAgICB0aGlzLl9mYWRlRHVyYXRpb25SYW5nZSA9IG5ldyBSYW5nZShmYWRlTWluLCBmYWRlTWF4LCB0cnVlKTtcbn07XG5cblBhcnRpY2xlU2V0dGluZ3MucHJvdG90eXBlLnNldFNjYWxlID0gZnVuY3Rpb24obWluLCBtYXgpIHtcbiAgICB0aGlzLl9zY2FsZVJhbmdlID0gbmV3IFJhbmdlKG1pbiwgbWF4KTtcbn07XG5cblBhcnRpY2xlU2V0dGluZ3MucHJvdG90eXBlLnNldEdyYXZpdHkgPSBmdW5jdGlvbihtaW4sIG1heCkge1xuICAgIHRoaXMuX2dyYXZpdHlSYW5nZSA9IG5ldyBSYW5nZShtaW4sIG1heCk7XG59O1xuXG5QYXJ0aWNsZVNldHRpbmdzLnByb3RvdHlwZS5zZXREZWNheSA9IGZ1bmN0aW9uKG1pbiwgbWF4KSB7XG4gICAgdGhpcy5fZGVjYXlSYW5nZSA9IG5ldyBSYW5nZShtaW4sIG1heCk7XG59O1xuXG5QYXJ0aWNsZVNldHRpbmdzLnByb3RvdHlwZS5hZGRUZXh0dXJlID0gZnVuY3Rpb24odGV4dHVyZSkge1xuICAgIHRoaXMuX3RleHR1cmVzLnB1c2godGV4dHVyZSk7XG59O1xuXG5QYXJ0aWNsZVNldHRpbmdzLnByb3RvdHlwZS5hZGRCZWhhdmlvdXIgPSBmdW5jdGlvbihiZWhhdmlvdXIpIHtcbiAgICB0aGlzLl9iZWhhdmlvdXMucHVzaChiZWhhdmlvdXIpO1xufTtcblxuLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gKiBHZXR0ZXJzXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cblBhcnRpY2xlU2V0dGluZ3MucHJvdG90eXBlLmdldFRleHR1cmUgPSBmdW5jdGlvbigpIHtcbiAgICBpZih0aGlzLl90ZXh0dXJlcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTm8gdGV4dHVyZSBoYXMgYmVlbiBzZXQgb24gUGFydGljbGVTZXR0aW5nc1wiKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5fdGV4dHVyZXNbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogdGhpcy5fdGV4dHVyZXMubGVuZ3RoKV07XG59O1xuXG5QYXJ0aWNsZVNldHRpbmdzLnByb3RvdHlwZS5nZXRMaWZlID0gZnVuY3Rpb24oKSB7XG4gICAgaWYodGhpcy5fbGlmZUR1cmF0aW9uUmFuZ2UgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJObyBsaWZlIGhhcyBiZWVuIHNldCBvbiBQYXJ0aWNsZVNldHRpbmdzXCIpO1xuICAgIH1cblxuICAgIHJldHVybiB7bGlmZUR1cmF0aW9uOiB0aGlzLl9saWZlRHVyYXRpb25SYW5nZS5yYW5nZSgpLCBmYWRlRHVyYXRpb246IHRoaXMuX2ZhZGVEdXJhdGlvblJhbmdlLnJhbmdlKCl9O1xufTtcblxuUGFydGljbGVTZXR0aW5ncy5wcm90b3R5cGUuZ2V0U2NhbGUgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gKHRoaXMuX3NjYWxlUmFuZ2UpID8gdGhpcy5fc2NhbGVSYW5nZS5yYW5nZSgpIDogMTtcbn07XG5cblBhcnRpY2xlU2V0dGluZ3MucHJvdG90eXBlLmdldEJlaGF2aW91cnMgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gKHRoaXMuX2JlaGF2aW91cykgPyB0aGlzLl9iZWhhdmlvdXMgOiBbXTtcbn07XG5cblBhcnRpY2xlU2V0dGluZ3MucHJvdG90eXBlLmdldEdyYXZpdHkgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gKHRoaXMuX2dyYXZpdHlSYW5nZSkgPyB0aGlzLl9ncmF2aXR5UmFuZ2UucmFuZ2UoKSA6IDA7XG59O1xuXG5QYXJ0aWNsZVNldHRpbmdzLnByb3RvdHlwZS5nZXREZWNheSA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiAodGhpcy5fZGVjYXlSYW5nZSkgPyB0aGlzLl9kZWNheVJhbmdlLnJhbmdlKCkgOiAwO1xufTtcblxuUGFydGljbGVTZXR0aW5ncy5wcm90b3R5cGUuZ2V0U3BlZWQgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gKHRoaXMuX3NwZWVkUmFuZ2UpID8gdGhpcy5fc3BlZWRSYW5nZS5yYW5nZSgpIDogMDtcbn07XG5cblBhcnRpY2xlU2V0dGluZ3MucHJvdG90eXBlLmdldERpcmVjdGlvbiA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiAodGhpcy5fZGlyZWN0aW9uUmFuZ2UpID8gdGhpcy5fZGlyZWN0aW9uUmFuZ2UucmFuZ2UoKSA6IDA7XG59O1xuXG5QYXJ0aWNsZVNldHRpbmdzLnByb3RvdHlwZS5nZXRBbHBoYSA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiAodGhpcy5fYWxwaGFSYW5nZSkgPyB0aGlzLl9hbHBoYVJhbmdlLnJhbmdlKCkgOiAxO1xufTtcblxuUGFydGljbGVTZXR0aW5ncy5wcm90b3R5cGUuZ2V0Um90YXRpb24gPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gKHRoaXMuX3JvdGF0aW9uUmFuZ2UpID8gdGhpcy5fcm90YXRpb25SYW5nZS5yYW5nZSgpIDogMDtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gUGFydGljbGVTZXR0aW5nczsiLCJ2YXIgQ29tcGFjdEFycmF5ID0ge307XG5cbkNvbXBhY3RBcnJheS5jb21wYWN0ID0gZnVuY3Rpb24oYXJyYXkpIHtcbiAgICBmb3IgKHZhciBqID0gMDsgaiA8IGFycmF5Lmxlbmd0aDsgaisrKSB7XG4gICAgICAgIGlmIChhcnJheVtqXSA9PSBudWxsKSB7XG4gICAgICAgICAgICBhcnJheS5zcGxpY2UoaiwgMSk7XG4gICAgICAgICAgICBqLS07XG4gICAgICAgIH1cbiAgICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IENvbXBhY3RBcnJheTsiLCJ2YXIgR2VvbWV0cnkgPSB7fTtcblxuR2VvbWV0cnkuZGlzdGFuY2VCZXR3ZWVuUG9pbnRzID0gZnVuY3Rpb24oYSwgYikge1xuICAgIHJldHVybiBNYXRoLnNxcnQoIChhLngtYi54KSooYS54LWIueCkgKyAoYS55LWIueSkqKGEueS1iLnkpICk7XG59O1xuXG5HZW9tZXRyeS5hbmdsZUJldHdlZW5Qb2ludHNSYWRpYW5zID0gZnVuY3Rpb24oYSwgYikge1xuICAgIHJldHVybiBNYXRoLmF0YW4yKGIueSAtIGEueSwgYi54IC0gYS54KTs7XG59O1xuXG5HZW9tZXRyeS5hbmdsZUJldHdlZW5Qb2ludHNEZWdyZWVzID0gZnVuY3Rpb24oYSwgYikge1xuICAgIHJldHVybiBHZW9tZXRyeS5hbmdsZUJldHdlZW5Qb2ludHNSYWRpYW5zKGEsIGIpICogMTgwIC8gTWF0aC5QSTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gR2VvbWV0cnk7IiwidmFyIFF1aWNrUmFuZ2UgPSB7fTtcblxuUXVpY2tSYW5nZS5yYW5nZSA9IGZ1bmN0aW9uKG1pbiwgbWF4LCByb3VuZCkge1xuICAgIHZhciB2YWx1ZSA9IG1pbiArIChNYXRoLnJhbmRvbSgpICogKG1heCAtIG1pbikpO1xuICAgIGlmKHJvdW5kKSB2YWx1ZSA9IE1hdGgucm91bmQodmFsdWUpO1xuICAgIHJldHVybiB2YWx1ZTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gUXVpY2tSYW5nZTsiLCJmdW5jdGlvbiBSYW5nZShtaW4sIG1heCwgcm91bmQpIHtcbiAgICB0aGlzLm1pbiA9IG1pbjtcbiAgICB0aGlzLm1heCA9IG1heDtcbiAgICB0aGlzLnJvdW5kID0gcm91bmQ7XG59XG5cblJhbmdlLnByb3RvdHlwZS5yYW5nZSA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciB2YWx1ZSA9IHRoaXMubWluICsgKE1hdGgucmFuZG9tKCkgKiAodGhpcy5tYXggLSB0aGlzLm1pbikpO1xuICAgIGlmKHRoaXMucm91bmQpIHZhbHVlID0gTWF0aC5yb3VuZCh2YWx1ZSk7XG4gICAgcmV0dXJuIHZhbHVlO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBSYW5nZTsiLCJ2YXIgVGV4dHVyZUdlbmVyYXRvciA9IHt9O1xuXG5UZXh0dXJlR2VuZXJhdG9yLmNpcmNsZSA9IGZ1bmN0aW9uKHJhZGl1cywgY29sb3VyLCBoYWxvLCBibHVyQW1vdW50KSB7XG4gICAgdmFyIGdyYXBoaWNzID0gbmV3IFBJWEkuR3JhcGhpY3MoKTtcbiAgICBncmFwaGljcy5saW5lU3R5bGUoMCk7XG5cbiAgICBpZihoYWxvKSB7XG4gICAgICAgIGdyYXBoaWNzLmJlZ2luRmlsbChjb2xvdXIsIC4yKTtcbiAgICAgICAgZ3JhcGhpY3MuZHJhd0NpcmNsZSgwLCAwLCByYWRpdXMgKiAyKTtcbiAgICAgICAgZ3JhcGhpY3MuZW5kRmlsbCgpO1xuXG4gICAgICAgIGdyYXBoaWNzLmJlZ2luRmlsbChjb2xvdXIsIC4xKTtcbiAgICAgICAgZ3JhcGhpY3MuZHJhd0NpcmNsZSgwLCAwLCByYWRpdXMgKiA0KTtcbiAgICAgICAgZ3JhcGhpY3MuZW5kRmlsbCgpO1xuICAgIH1cblxuICAgIGdyYXBoaWNzLmJlZ2luRmlsbChjb2xvdXIsIDEpO1xuICAgIGdyYXBoaWNzLmRyYXdDaXJjbGUoMCwgMCwgcmFkaXVzKTtcbiAgICBncmFwaGljcy5lbmRGaWxsKCk7XG5cbiAgICBpZihibHVyQW1vdW50ID4gMCkge1xuICAgICAgICB2YXIgYmx1ckZpbHRlciA9IG5ldyBQSVhJLmZpbHRlcnMuQmx1ckZpbHRlcigpO1xuICAgICAgICBibHVyRmlsdGVyLmJsdXIgPSBibHVyQW1vdW50O1xuICAgICAgICBncmFwaGljcy5maWx0ZXJzID0gW2JsdXJGaWx0ZXJdO1xuICAgIH1cblxuICAgIHJldHVybiBhcHAucmVuZGVyZXIuZ2VuZXJhdGVUZXh0dXJlKGdyYXBoaWNzKTtcbn07XG5cblRleHR1cmVHZW5lcmF0b3IucmVjdGFuZ2xlID0gZnVuY3Rpb24od2lkdGgsIGhlaWdodCwgY29sb3VyLCBoYWxvLCBibHVyQW1vdW50KSB7XG4gICAgdmFyIGdyYXBoaWNzID0gbmV3IFBJWEkuR3JhcGhpY3MoKTtcbiAgICBncmFwaGljcy5saW5lU3R5bGUoMCk7XG5cbiAgICBpZihoYWxvKSB7XG4gICAgICAgIGdyYXBoaWNzLmJlZ2luRmlsbChjb2xvdXIsIC4yKTtcbiAgICAgICAgZ3JhcGhpY3MuZHJhd1JlY3QoMCwgMCwgd2lkdGggKiAyLCBoZWlnaHQgKiAyKTtcbiAgICAgICAgZ3JhcGhpY3MuZW5kRmlsbCgpO1xuXG4gICAgICAgIGdyYXBoaWNzLmJlZ2luRmlsbChjb2xvdXIsIC4xKTtcbiAgICAgICAgZ3JhcGhpY3MuZHJhd1JlY3QoMCwgMCwgd2lkdGggKiA0LCBoZWlnaHQgKiA0KTtcbiAgICAgICAgZ3JhcGhpY3MuZW5kRmlsbCgpO1xuICAgIH1cblxuICAgIGdyYXBoaWNzLmJlZ2luRmlsbChjb2xvdXIpO1xuICAgIGdyYXBoaWNzLmRyYXdSZWN0KDAsIDAsIHdpZHRoLCBoZWlnaHQpO1xuICAgIGdyYXBoaWNzLmVuZEZpbGwoKTtcblxuICAgIGdyYXBoaWNzLmFuY2hvciA9IHt4Oi41LCB5Oi41fTtcblxuICAgIGlmKGJsdXJBbW91bnQgPiAwKSB7XG4gICAgICAgIHZhciBibHVyRmlsdGVyID0gbmV3IFBJWEkuZmlsdGVycy5CbHVyRmlsdGVyKCk7XG4gICAgICAgIGJsdXJGaWx0ZXIuYmx1ciA9IGJsdXJBbW91bnQ7XG4gICAgICAgIGdyYXBoaWNzLmZpbHRlcnMgPSBbYmx1ckZpbHRlcl07XG4gICAgfVxuXG4gICAgcmV0dXJuIGFwcC5yZW5kZXJlci5nZW5lcmF0ZVRleHR1cmUoZ3JhcGhpY3MpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBUZXh0dXJlR2VuZXJhdG9yOyJdfQ==

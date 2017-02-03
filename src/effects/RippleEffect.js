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
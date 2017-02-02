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
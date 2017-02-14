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
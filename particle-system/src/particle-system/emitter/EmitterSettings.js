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
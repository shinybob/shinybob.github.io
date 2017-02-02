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
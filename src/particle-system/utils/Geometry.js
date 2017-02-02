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
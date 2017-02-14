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
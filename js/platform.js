$.Platform = function (bounds, type, style, visible) {
    this.Bounds = bounds;
    this.Type = type;
    this.Style = style;
    this.Visible = visible == null ? true : visible;

    // sides 15px
    // center 20px

    if (this.Bounds.Width < 50) { this.Bounds.Width = 50; }
    if (this.Bounds.Height < 25) { this.Bounds.Height = 25; }

    var centerLength = this.Bounds.Width - 30; // Remove sides
    this.CenterCount = Math.ceil(centerLength / 20); // Center width(20)
    this.Bounds.Width = (this.CenterCount * 20) + 30; // Resize for nice fit
};

$.Platform.prototype.Update = function () {

};

$.Platform.prototype.Draw = function (camera) {
    if (!this.Visible) { return; }

    var left = Math.floor(this.Bounds.X - camera.ViewportBounds.X);
    var top = Math.floor(this.Bounds.Y - camera.ViewportBounds.Y);

    // Left
    $.Graphics.drawImage(
        $.PlatformsImage,
        (this.Style * 50) + 15 + 20, 
        0,
        15,
        25,
        left,
        top,
        15,
        25);

    left += 15;

    // Center
    for (var i = 0; i < this.CenterCount; i++) {
        $.Graphics.drawImage(
            $.PlatformsImage,
            (this.Style * 50) + 15,
            0,
            20,
            25,
            left,
            top,
            20,
            25);

        left += 20;
    }

    // Right
    $.Graphics.drawImage(
        $.PlatformsImage,
        this.Style * 50,
        0,
        15,
        25,
        left,
        top,
        15,
        25);
};

$.PlatformTypes = {
    Float: 'FLOAT',
    FloatTop: 'FLOATTOP',
    FloatBottom: 'FLOATBOTTOM',
};

$.PlatformStyles = {
    Rock: 0,
    Steel: 1,
    Stone: 2,
};
$.Ball = function (bounds, ballIndex) {
    this.Bounds = bounds;
    this.BallIndex = ballIndex;
    this.Ticks = Math.round($.RandomBetween(0, 500));
};

$.Ball.prototype.Update = function (camera) {
    if (!camera.RenderBounds.ContainsRect(this.Bounds)) { return; }

    this.Ticks++;
    //this.Bounds.X += (Math.cos(this.Ticks / 20) / 2);
    this.Bounds.Y += (Math.sin(this.Ticks / 20) / 2);
};

$.Ball.prototype.Draw = function (camera) {
    if (!camera.RenderBounds.ContainsRect(this.Bounds)) { return; }

    var left = this.Bounds.X - camera.ViewportBounds.X;
    var top = this.Bounds.Y - camera.ViewportBounds.Y;

    $.Graphics.drawImage(
        $.BallImage,
        this.BallIndex * 30,
        0,
        30,
        30,
        left,
        top,
        this.Bounds.Width,
        this.Bounds.Height);
};
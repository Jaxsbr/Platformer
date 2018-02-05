$.Blade = function (bounds, baseSide) {
    this.Bounds = bounds;
    this.Rotation = 360;
    this.BaseSide = baseSide;
    this.HitBounds = new $.Rectangle(
        this.Bounds.X + 5,
        this.Bounds.Y + 5,
        this.Bounds.Width - 10,
        this.Bounds.Height - 10);
};

$.Blade.prototype.Update = function (camera) {
    if (!camera.RenderBounds.ContainsRect(this.Bounds)) { return; }

    this.Rotation -= 7;
   if (this.Rotation - 7 < -99999)
        this.Rotation = 0;
};

$.Blade.prototype.Draw = function (camera) {
    if (!camera.RenderBounds.ContainsRect(this.Bounds)) { return; }

    var left = this.Bounds.X - camera.ViewportBounds.X;
    var top = this.Bounds.Y - camera.ViewportBounds.Y;

    $.Graphics.drawImage(
        $.BladesImage,
        50 * this.BaseSide,
        0,
        50,
        50,
        left,
        top,
        50,
        50);

    $.Graphics.save();
    $.Graphics.translate(left + (this.Bounds.Width / 2), top + (this.Bounds.Height / 2));
    $.Graphics.rotate(this.Rotation * (Math.PI / 180));
    $.Graphics.drawImage(
        $.BladesImage,
        0,
        0,
        50,
        50,
        -(this.Bounds.Width / 2),
		-(this.Bounds.Height / 2),
        this.Bounds.Width,
        this.Bounds.Height);
    $.Graphics.restore();
};
$.CheckPoint = function (bounds) {
    this.Bounds = bounds;
    this.Checked = false;
    this.CheckTime = Date.now();

    this.ClosedAnimation = new $.Animation($.CheckPointImage, [0, 1, 2], 50, 75, 0, 1);
    this.OpenAnimation = new $.Animation($.CheckPointImage, [3, 4, 5], 50, 75, 0, 1);

    this.CurrentAnimation = this.ClosedAnimation;
    this.CurrentAnimation.Play();
};

$.CheckPoint.prototype.Update = function (camera) {
    if (!camera.RenderBounds.ContainsRect(this.Bounds)) { return; }

    if (this.Checked && this.CurrentAnimation == this.ClosedAnimation) {
        this.CurrentAnimation = this.OpenAnimation;
    }

    if (!this.CurrentAnimation.Playing) {
        this.CurrentAnimation.Play();
    }

    this.CurrentAnimation.Update();
}

$.CheckPoint.prototype.Draw = function (camera) {
    if (!camera.RenderBounds.ContainsRect(this.Bounds)) { return; }

    var left = this.Bounds.X - camera.ViewportBounds.X;
    var top = this.Bounds.Y - camera.ViewportBounds.Y;    
    this.CurrentAnimation.Draw(left, top, this.Bounds.Width, this.Bounds.Height);
};

$.CheckPoint.prototype.DrawColorPolution = function (camera, color) {
    if (this.Checked) { return; }

    var left = this.Bounds.Centre.X - camera.ViewportBounds.X;
    var top = this.Bounds.Centre.Y - camera.ViewportBounds.Y;    

    var grd = $.Graphics.createRadialGradient(
    left,
    top,
    0,
    left,
    top,
    650);

    grd.addColorStop(0, 'transparent');
    grd.addColorStop(0.2, color);
    grd.addColorStop(1, 'transparent');

    $.Graphics.save();
    $.Graphics.beginPath();

    $.Graphics.fillStyle = grd;
    $.Graphics.globalAlpha = 0.6;

    $.Graphics.arc(
        left,
		top,
		650,
		0,
		2 * Math.PI);
    $.Graphics.fill();
    $.Graphics.restore();
};

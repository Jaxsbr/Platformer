$.Camera = function (canvasBounds) {
    this.ViewportBounds = canvasBounds;    
    // Center point of focused object.
    this.FocusedPoint = null;
}

$.Camera.prototype.Update = function (focusedPoint) {
    if (!focusedPoint) { return; }

    this.ViewportBounds = $.CanvasBounds;
    this.DeadSides = $.CanvasBounds.Width / 2;
    this.DeadTop = $.CanvasBounds.Height / 2;
    this.DeadBottom = $.CanvasBounds.Height / 2;

    this.FocusedPoint = focusedPoint;

    if (this.FocusedPoint.X - this.ViewportBounds.X + this.DeadSides > this.ViewportBounds.Width) {
        // Right movement
        this.ViewportBounds.X = this.FocusedPoint.X - (this.ViewportBounds.Width - this.DeadSides);
    }
    else if (this.FocusedPoint.X - this.DeadSides < this.ViewportBounds.X) {
        // Left movement
        this.ViewportBounds.X = this.FocusedPoint.X - this.DeadSides;
    }
    
    if (this.FocusedPoint.Y - this.ViewportBounds.Y + this.DeadTop > this.ViewportBounds.Height) {
        // Down movement
        this.ViewportBounds.Y = this.FocusedPoint.Y - (this.ViewportBounds.Height - this.DeadTop);        
    }
    else if (this.FocusedPoint.Y - this.DeadBottom < this.ViewportBounds.Y) {
        // Up movement
        this.ViewportBounds.Y = this.FocusedPoint.Y - this.DeadBottom ;
    }

    // Prevent camera from moving out of world bounds
    if (!this.ViewportBounds.ContainsRect($.WorldBounds)) {
        if (this.ViewportBounds.X < $.WorldBounds.X)
            this.ViewportBounds.X = $.WorldBounds.X;
        if (this.ViewportBounds.Y < $.WorldBounds.Y)
            this.ViewportBounds.Y = $.WorldBounds.Y;
        if (this.ViewportBounds.Right > $.WorldBounds.Right)
            this.ViewportBounds.X = $.WorldBounds.Right - this.ViewportBounds.Width;
        if (this.ViewportBounds.Bottom > $.WorldBounds.Bottom)
            this.ViewportBounds.Y = $.WorldBounds.Bottom - this.ViewportBounds.Height;
    }

    // Create a rectangle slightly larger that viewportbounds
    // but still smaller than world bounds. We will only render objects
    // that are in side the rectangle.
    this.RenderBounds = new $.Rectangle(
        this.ViewportBounds.X - $.TileWidth,
        this.ViewportBounds.Y - $.TileHeight,
        this.ViewportBounds.Width + ($.TileWidth * 2),
        this.ViewportBounds.Height + ($.TileHeight * 2));
}
$.Tile = function (id, isFake, row, col, width, height, levelIndex) {
    this.ID = id;
    this.TilePoint = new $.Point(row, col);
    //this.Bounds = new $.Rectangle(row * width, col * height, width, height);
    this.Bounds = new $.Rectangle(col * width, row * height, width, height);
    this.IsFake = isFake;
    this.IsEmpty = this.ID == 0 ? true : false;
    this.LevelIndex = levelIndex;    
};

$.Tile.prototype.GetIDValue = function () {
    switch (this.ID) {
        case 'a':
            return 10;
        case 'b':
            return 11;
        case 'c':
            return 12;
        case 'd':
            return 13;
    }

    return this.ID;
};

$.Tile.prototype.GetImageSourceBounds = function () {
    var id = this.GetIDValue();

    var x = (id - 1) * $.TileWidth;
    var y = 0;
    switch (this.LevelIndex) {
        case 3:
        case 4:
            // Yellow
            y = $.TileHeight;
            break;
        case 5:
        case 6:
            // Red
            y = $.TileHeight * 2;
            break;
        case 7:
        case 8:
            // Blue
            y = $.TileHeight * 3;
            break;
        case 9:
        case 10:
            // Green
            y = $.TileHeight * 4;
            break;
        case 11:
        case 12:
            // Purple
            y = $.TileHeight * 5;
            break;
    }

    return new $.Rectangle(x, y, $.TileWidth, $.TileHeight);
};

$.Tile.prototype.Update = function (camera) {
    if (!camera.RenderBounds.ContainsRect(this.Bounds)) { return; }
}; 

$.Tile.prototype.Draw = function (camera) {
    if (this.IsEmpty) { return; }
    if (!camera.RenderBounds.ContainsRect(this.Bounds)) { return; }

    var x = Math.floor(this.Bounds.X - camera.ViewportBounds.X);
    var y = Math.floor(this.Bounds.Y - camera.ViewportBounds.Y);
    var sourceBounds = this.GetImageSourceBounds();

    if (this.IsFake) {
        $.Graphics.save();
        $.Graphics.globalAlpha = 0.85;
        $.Graphics.drawImage(
            $.PathsImage,
            sourceBounds.X,
            sourceBounds.Y,
            sourceBounds.Width,
            sourceBounds.Height,
            x,
            y,
            this.Bounds.Width,
            this.Bounds.Height);
        $.Graphics.restore();
    }
    else {
        $.Graphics.drawImage(
            $.PathsImage,
            sourceBounds.X,
            sourceBounds.Y,
            sourceBounds.Width,
            sourceBounds.Height,
            x,
            y,
            this.Bounds.Width,
            this.Bounds.Height);
    }
};
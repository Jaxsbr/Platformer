$.Level = function () {    
    this.Camera = new $.Camera($.CanvasBounds);
    this.LevelStateNames = { Play: "PLAY", Movie: "MOVIE", Result: "RESULT" }
    this.LevelStates = { Play: 0, Movie: 0, Result: 0 };
    this.ResetLevel = false;
    this.Win = false;

    this.LevelIndex = 0;
    this.Infos = [];
    this.Layers = [];
    this.Platforms = [];
    this.Enemies = [];
    this.Balls = [];
    this.LevelColor = 'white';

    this.Emitters = [];

    this.TileRows = 0;
    this.TileCols = 0;

    this.ResultTitle = { Text : '', Point : new $.Point(25, 40), Font : '48px Impact' };
    this.ResultDisplayObjects = [];
    this.ResultOption1 = { Visible: false, Selected: false, Bounds: new $.Rectangle(25, 40, 25, 40), Image: 0 };
    this.ResultOption2 = { Visible: false, Selected: false, Bounds: new $.Rectangle(25, 40, 25, 40), Image: 0 };

    if ($.IsNewGame) {
        this.LevelIndex = 1;
        this.CreateLevel();
    }
    else {
        this.LoadSavedGame();
    }
};

$.Level.prototype.SetLevelState = function (state) {
    this.LevelStates.Play = 0;
    this.LevelStates.Movie = 0;
    this.LevelStates.Result = 0;

    if (state == this.LevelStateNames.Play) {
        this.LevelStates.Play = 1;
    }
    else if (state == this.LevelStateNames.Movie) {
        this.LevelStates.Movie = 1;
    }
    else if (state == this.LevelStateNames.Result) {
        this.ResultDisplayObjects = [];
        this.LevelStates.Result = 1;
    }
};

$.Level.prototype.CreateLevel = function () {
    var levelObject = 'Level' + this.LevelIndex;
    this.SetLevelColor();

    if (this.ResetLevel) {
        var checkPoint;
        var lastCheckTime;
        for (var i = 0; i < this.CheckPoints.length; i++) {
            if (this.CheckPoints[i].Checked) {
                if (!lastCheckTime || this.CheckPoints[i].CheckTime > lastCheckTime) {
                    checkPoint = this.CheckPoints[i];
                    lastCheckTime = checkPoint.CheckTime;
                }
            }
        }

        if (checkPoint) {
            this.Player.Bounds = new $.Rectangle(checkPoint.Bounds.X, checkPoint.Bounds.Y, 50, 80)
        }
        else {
            this.Player.Bounds = new $.Rectangle(this.StartPortal.X, this.StartPortal.Y, 50, 80)
        }
    }
    else {        
        this.Layers = $.LevelData[levelObject].Layers;        
        this.Infos = $.LevelData[levelObject].Infos;                         

        this.Tiles = [];
        this.Enemies = [];
        this.Balls = [];
        this.Blades = [];
        this.CheckPoints = [];
        this.ParalaxLayers = [];        
        this.ParalaxLayers.push(new $.Rectangle(0, 0, 9600, 960));
        this.ParalaxLayers.push(new $.Rectangle(0, 0, 9600, 960));
        this.ParalaxLayers.push(new $.Rectangle(0, 0, 9600, 960));

        $.BallIndex = 0;

        var tiles = $.LevelData[levelObject].Tiles;
        var tilesInfo = $.LevelData[levelObject].TilesInfo;
        this.TileRows = tiles.length;
        this.TileCols = tiles[0].length;
        $.WorldBounds = new $.Rectangle(0, 0, (this.TileCols * $.TileWidth), (this.TileRows * $.TileHeight));

        for (var row = 0; row < this.TileRows; row++) {
            this.Tiles[row] = new Array();

            for (var col = 0; col < this.TileCols; col++) {
                var id = tiles[row][col];

                // Tile contained portal, load empty tile here.
                if (this.LoadTilePortals(id, row, col)) { id = 0; }

                // Tile contained enemy, load empty tile here.
                if (this.LoadTileEnemies(id, row, col)) { id = 0; }

                // Tile contained ball seed, load empty tile here.
                if (this.LoadTileBalls(id, row, col)) { id = 0; }

                // Tile contained blade, load empty tile here.
                if (this.LoadTileBlades(id, row, col)) { id = 0; }

                // Tile contained check points, load empty tile here.
                if (this.LoadTileCheckPoints(id, row, col)) { id = 0; }

                var isFake = tilesInfo[row][col] == '1' ? true : false;

                this.Tiles[row][col] = new $.Tile(
                    id, isFake, row, col, $.TileWidth, $.TileHeight, this.LevelIndex);
            }
        }

        this.Player = new $.Player(
            new $.Rectangle(
            this.StartPortal.Centre.X - (12.5),
            this.StartPortal.Y, 50, 80), this);        
    }


    this.SetLevelState(this.LevelStateNames.Play);
};

$.Level.prototype.SetLevelColor = function () {
    switch (this.LevelIndex) {
        case 1:
            this.LevelColor = 'yellow';
            break;
        case 2:
            this.LevelColor = 'blue';
            break;
        case 3:
            this.LevelColor = 'red';
            break;
        case 4:
            this.LevelColor = 'green';
            break;
        case 5:
            this.LevelColor = 'purple';
            break;
        default:
            this.LevelColor = 'white';
            break;
    }
};

$.Level.prototype.LoadTilePortals = function (id, row, col) {
    var isPortal = false;
    var x = col * $.TileWidth;
    var y = row * $.TileHeight;    
     
    switch (id) {
        case 'A':
            this.StartPortal = new $.Rectangle(x, y, 64, 64);
            isPortal = true;
            break;
        case 'B':
            this.EndPortal = new $.Rectangle(x, y, 64, 64);
            isPortal = true;
            break;
    }

    return isPortal;
};

$.Level.prototype.LoadTileEnemies = function (id, row, col) {
    var isEnemy = false;    
    var x = col * $.TileWidth;
    var y = row * $.TileHeight;

    switch (id) {
        case 'z':
            isEnemy = true;
            this.Enemies.push(new $.Enemy(new $.Rectangle(x, y, 45, 45), this, 'yellow'));
            break;
        case 'y':
            isEnemy = true;
            this.Enemies.push(new $.Enemy(new $.Rectangle(x, y, 60, 45), this, 'blue'));
            break;
        case 'x':
            isEnemy = true;
            this.Enemies.push(new $.Enemy(new $.Rectangle(x, y, 25, 40), this, 'red'));
            break;
        case 'w':
            isEnemy = true;
            this.Enemies.push(new $.Enemy(new $.Rectangle(x, y, 25, 40), this, 'green'));
            break;
        case 'v':
            isEnemy = true;
            this.Enemies.push(new $.Enemy(new $.Rectangle(x, y, 25, 40), this, 'purple'));
            break;                
    }

    return isEnemy;
};

$.Level.prototype.LoadTileBalls = function (id, row, col) {
    var isBallSeed = false;
    var x = col * $.TileWidth;
    var y = row * $.TileHeight;
    var ballSize = new $.Point(25, 25);    

    switch (id) {
        case 'C':
            isBallSeed = true;
            $.AddBallsLinear(new $.Point(x, y), ballSize, new $.Point(20, 20), 3, this.Balls);
            break;
        case 'D':
            isBallSeed = true;
            $.AddBallsCurve(new $.Point(x, y), ballSize, new $.Point(20, 10), 5, this.Balls);
            break;
        case 'E':
            isBallSeed = true;
            $.AddBallsDiaganol(new $.Point(x, y), ballSize, new $.Point(20, 20), 3, this.Balls, false);
            break;
        case 'F':
            isBallSeed = true;
            $.AddBallsDiaganol(new $.Point(x, y), ballSize, new $.Point(20, 20), 3, this.Balls, true);
            break;
        case 'G':
            isBallSeed = true;
            $.AddBallsLinear(new $.Point(x, y), ballSize, new $.Point(20, 20), 4, this.Balls);
            break;
        case 'H':
            isBallSeed = true;
            $.AddBallsLinear(new $.Point(x, y), ballSize, new $.Point(20, 20), 4, this.Balls);
            break;
    }

    return isBallSeed;
};

$.Level.prototype.LoadTileBlades = function (id, row, col) {
    var isBlade = false;
    var x = col * $.TileWidth;
    var y = row * $.TileHeight;    

    switch (id) {
        case 'W':
            var isBlade = true;
            this.Blades.push(new $.Blade(new $.Rectangle(x, (y + $.TileHeight) - 50, 50, 50), 1));
            break;
        case 'X':
            var isBlade = true;
            this.Blades.push(new $.Blade(new $.Rectangle(x, y, 50, 50), 2));
            break;
        case 'Y':
            var isBlade = true;
            this.Blades.push(new $.Blade(new $.Rectangle(x, y, 50, 50), 3));
            break;
        case 'Z':
            var isBlade = true;
            this.Blades.push(new $.Blade(new $.Rectangle((x + $.TileWidth) - 50, y, 50, 50), 4));
            break;
    }

    return isBlade;
}

$.Level.prototype.LoadTileCheckPoints = function (id, row, col) {
    var isCheckPoint = false;
    var x = col * $.TileWidth;
    var y = row * $.TileHeight;

    switch (id) {
        case 'P':
            var isCheckPoint = true;
            this.CheckPoints.push(new $.CheckPoint(new $.Rectangle(x, (y + $.TileHeight) - 75, 50, 75)));
            break;
    }

    return isCheckPoint;
}

$.Level.prototype.LoadSavedGame = function () {
    this.LevelIndex = 0; // TODO: From saved data
    var levelObject = 'Level' + this.LevelIndex;

    // Load unchangeable data.
    this.StartPortal = $.LevelData[levelObject].StartPortal;
    this.EndPortal = $.LevelData[levelObject].EndPortal;
    this.Platforms = $.LevelData[levelObject].Platforms;

    // TODO:
    // Find and remove killed enemies, collected items.
    // Set player saved properties.

    this.Player = new $.Player(new $.Rectangle(this.StartPortal.X, this.StartPortal.Y, 75, 75), this);

    this.SetLevelState(this.LevelStateNames.Play);
};

$.Level.prototype.Update = function () {
    if (this.LevelStates.Play == 1) { this.UpdatePlay(); }
    else if (this.LevelStates.Movie == 1) { this.UpdateMovie(); }
    else if (this.LevelStates.Result == 1) { this.UpdateResult(); }
};

$.Level.prototype.UpdatePlay = function () {
    if (this.ResetLevel) {
        if (this.Player.Lives > 0) {
            this.Player.Dead = false;
            this.Player.OutOfBounds = false;
            this.CreateLevel();
            this.ResetLevel = false;
            return;
        }
        else {
            this.SetLevelState(this.LevelStateNames.Result);
            this.ResetLevel = false;
            return;
        }
    }

    this.UpdateCamera();
    this.UpdateLayers();
    this.Player.Update();
    this.UpdateCheckPoints();
    this.UpdateEmitters();
    this.UpdateEnemies();
    this.UpdateBalls();
    this.UpdateBlades();
    this.UpdatePlayerWinLose();
    this.UpdatePlayerDeath();
};

$.Level.prototype.UpdateMovie = function () {
    // If Movie not playing
    // Get movie, if not movie exist set play state.
    // if Movie done >> set play state.
};

$.Level.prototype.UpdateResult = function () {
    var itemHeight = 100; // Where items start from.

    if (this.Player.Lives > 0) {
        this.Win = true;        
        this.ResultTitle.Text = 'Level ' + this.LevelIndex + ' completed!';        
        this.ResultDisplayObjects = [];
        this.ResultOption1.Image = 1;
        this.ResultOption2.Image = 2;
    }
    else {
        this.Win = false;
        this.ResultTitle.Text = 'You have been defeated!';
        this.ResultDisplayObjects = [];
        this.ResultOption1.Image = 3;
        this.ResultOption2.Image = 4;
    }

    // Set result title position
    $.Graphics.font = this.ResultTitle.Font;
    var textLength = $.Graphics.measureText(this.ResultTitle.Text).width;
    this.ResultTitle.Point = new $.Point(
        $.CanvasBounds.Centre.X - (textLength / 2), 48);

    this.ResultOption1.Visible = true;
    this.ResultOption2.Visible = true;

    this.ResultOption1.Bounds = new $.Rectangle(
        $.CanvasBounds.Centre.X - 170, itemHeight, 150, 50);        
    this.ResultOption2.Bounds = new $.Rectangle(
        $.CanvasBounds.Centre.X + 10, itemHeight, 150, 50);
        
    this.ResultOption1.Selected = false;
    this.ResultOption2.Selected = false;

    var mouseRect = new $.Rectangle($.MousePoint.X, $.MousePoint.Y, 1, 1);
    if (mouseRect.IntersectRect(this.ResultOption1.Bounds))
        this.ResultOption1.Selected = true;
    if (mouseRect.IntersectRect(this.ResultOption2.Bounds))
        this.ResultOption2.Selected = true;
};

$.Level.prototype.UpdateCamera = function () {    
    var playerY = this.Player.JumpPoint.Y;

    //if ((this.Player.Jumping || this.Player.Falling)) {
    if (this.Grounded) {
        playerY = this.Player.Bounds.Y + this.Player.Bounds.Y * 0.002;
    }
    {
        playerY = this.Player.Bounds.Y + this.Player.JumpPoint.Y * 0.002;
    }

    this.Camera.Update(new $.Point(this.Player.Bounds.Centre.X, playerY));
};

$.Level.prototype.UpdateLayers = function () {
    for (var i = 0; i < this.Layers.length; i++) {        
        this.Layers[i].Point.X = -(this.Camera.ViewportBounds.X * this.Layers[i].Speed.X);
    }


    for (var i = 0; i < this.ParalaxLayers.length; i++) {
        if (i == 0) { this.ParalaxLayers[i].X -= 5; }
        else if (i == 1) { this.ParalaxLayers[i].X -= 3; }
        else if (i == 2) { this.ParalaxLayers[i].X -= 2; }

        if (this.ParalaxLayers[i].X < -this.ParalaxLayers[i].Width) {
            this.ParalaxLayers[i].X = this.ParalaxLayers[i].Width;
        }
    }
};

$.Level.prototype.UpdateCheckPoints = function () {
    for (var i = 0; i < this.CheckPoints.length; i++) {
        this.CheckPoints[i].Update(this.Camera);

        var intersection = this.CheckPoints[i].Bounds.GetIntersectionDepth(this.Player.Bounds);
        if (!(intersection.X == 0 && intersection.Y == 0) && !this.CheckPoints[i].Checked) {
            this.CheckPoints[i].Checked = true;
            this.CheckPoints[i].CheckTime = Date.now();
        }
    }
};

$.Level.prototype.UpdateEmitters = function () {
    for (var i = 0; i < this.Emitters.length; i++) {
        this.Emitters[i].Update(this.Camera);

        if (this.Emitters[i].TTL < 0) {
            this.Emitters[i].Emitting = false;
        }

        if (this.Emitters[i].Particles.length == 0) {
            this.Emitters.splice(i, 1);
        }
    }
};

$.Level.prototype.UpdateEnemies = function () {
    for (var i = 0; i < this.Enemies.length; i++) {
        // TODO:
        // Only update enemies within 1.5 view widths.

        this.Enemies[i].Update(this.Camera);

        var collisionDepth = this.Player.Bounds.GetIntersectionDepth(this.Enemies[i].Bounds);

        if (collisionDepth.Y < 0 && this.Player.Falling) {            
            if (this.Enemies[i].Burning && !this.Enemies[i].Dead) {
                // Even though player landed the butt bounce, he
                // landed on a burning enemy.
                this.Player.Dead = true;
            }            
            else if (!this.Enemies[i].Dead) {
                this.Enemies[i].Dead = true
                this.Player.Bounce();

                //this.Emitters.push(
                //    new $.ParticleEngine(
                //        new $.Point(this.Enemies[i].Bounds.Centre.X, this.Enemies[i].Bounds.Y),
                //        new $.Point(1, 1),
                //        Math.PI,
                //        500,
                //        4,
                //        3,
                //        true,
                //        'red',
                //        $.EnemyHitParticleImage));
            }
        }
        else if (this.Enemies[i].BeamActive && !this.Enemies[i].Dead &&
                this.Enemies[i].Beam.IntersectRect(this.Player.Bounds)) {
            // PLayer hit by beam.
            this.Player.Dead = true;
        }
        else if (collisionDepth.X != 0 && collisionDepth.Y != 0 && !this.Enemies[i].Dead) {
            this.Player.Dead = true;
        }

        if (this.Enemies[i].Remove) {
            this.Enemies.splice(i, 1);
        }
    }
};

$.Level.prototype.UpdateBalls = function () {
    for (var i = 0; i < this.Balls.length; i++) {
        this.Balls[i].Update(this.Camera);

        if (this.Player.Bounds.IntersectRect(this.Balls[i].Bounds)) {
            this.Player.Balls += 1;
            
            this.Emitters.push(
                new $.ParticleEngine(
                new $.Point(this.Balls[i].Bounds.X, this.Balls[i].Bounds.Y),
                new $.Point(1, 1),
                Math.PI,
                500,
                4,
                3,
                true,
                'white',
                null));

            this.Balls.splice(i, 1);
        }
    }    
};

$.Level.prototype.UpdateBlades = function () {
    var playerCenter = this.Player.Bounds.Centre;

    for (var i = 0; i < this.Blades.length; i++) {
        this.Blades[i].Update(this.Camera);

        var collisionDepth = this.Player.Bounds.GetIntersectionDepth(this.Blades[i].HitBounds);
        if (!(collisionDepth.X == 0 && collisionDepth.Y == 0)) {
            this.Player.Dead = true;
        }
        
    }
};

$.Level.prototype.UpdatePlayerWinLose = function () {
    var endPortalReached = false;
    if (this.Player.Bounds.IntersectRect(this.EndPortal)) {
        var dist = this.Player.Bounds.Centre.DistanceBetween(this.EndPortal.Centre);
        if (dist < this.EndPortal.Width / 2) { endPortalReached = true; }
    }


    if (endPortalReached || this.Player.Lives <= 0) {
            this.SetLevelState(this.LevelStateNames.Result);
    }
};

$.Level.prototype.UpdatePlayerDeath = function () {    
    if (this.Player.OutOfBounds) {
        this.Player.Lives -= 1;
        this.ResetLevel = true;        
        // TODO:
        // this.SetLevelState(this.LevelStateNames.Movie);
        // Set next movie (falling).
    }
    else if (this.Player.Dead) {
        this.Player.Lives -= 1;
        this.ResetLevel = true;
    }
};

$.Level.prototype.Draw = function () {
    //$.Graphics.clearRect(0, 0, $.CanvasBounds.Width, $.CanvasBounds.Height);
    $.Graphics.drawImage($.BackgroundImage, 0, 0, $.CanvasBounds.Width, $.CanvasBounds.Height);

    this.DrawPlay();
    this.DrawResult();
};

$.Level.prototype.DrawPlay = function () {    
    this.DrawLayers();
    this.DrawTiles();
    this.DrawInfos();
    this.DrawCheckPoints();
    this.DrawEmitters();
    this.DrawBalls();
    this.DrawBlades();
    this.DrawPortals();
    this.DrawPlayer();
    this.DrawEnemies();
};

$.Level.prototype.DrawLayers = function () {
    //for (var i = 0; i < this.Layers.length; i++) {
    //    $.Graphics.drawImage(
    //        this.Layers[i].Image,
    //        this.Layers[i].Point.X,
    //        this.Layers[i].Point.Y - this.Camera.ViewportBounds.Y);
    //}

    //for (var i = 0; i < this.ParalaxLayers.length; i++) {
    //    var image;
    //    if (i == 0) { image = $.Ships1Image; }
    //    else if (i == 1) { image = $.Ships2Image; }
    //    else if (i == 2) { image = $.Ships3Image; }

    //    $.Graphics.drawImage(
    //        image,
    //        this.ParalaxLayers[i].X - this.Camera.ViewportBounds.X,
    //        this.ParalaxLayers[i].Y - this.Camera.ViewportBounds.Y,
    //        this.ParalaxLayers[i].Width,
    //        this.ParalaxLayers[i].Height);
    //}
};

$.Level.prototype.DrawTiles = function () {
    var maxTilesHorizontal = Math.ceil(this.Camera.RenderBounds.Width / $.TileWidth);
    var maxTilesVertical = Math.ceil(this.Camera.RenderBounds.Height / $.TileHeight);
    var x = Math.floor(this.Camera.RenderBounds.X / $.TileWidth);
    var y = Math.floor(this.Camera.RenderBounds.Y / $.TileHeight);

    for (var col = x; col < x + maxTilesHorizontal; col++) {
        for (var row = y; row < y + maxTilesVertical; row++) {

            if (col < 0 || col >= this.TileCols ||
                row < 0 || row >= this.TileRows) { continue; }

            this.Tiles[row][col].Draw(this.Camera);
        }
    }
};

$.Level.prototype.DrawCheckPoints = function () {
    for (var i = 0; i < this.CheckPoints.length; i++) {
        var dist = this.CheckPoints[i].Bounds.Centre.DistanceBetween(this.Player.Bounds.Centre);
        if (dist < ($.CanvasBounds.Width + ($.CanvasBounds.Width / 3))) {
            //this.CheckPoints[i].DrawColorPolution(this.Camera, this.LevelColor);
        }

        this.CheckPoints[i].Draw(this.Camera, this.LevelColor);
    }
};

$.Level.prototype.DrawInfos = function () {
    for (var i = 0; i < this.Infos.length; i++) {

        var x = this.Infos[i].Bounds.X - this.Camera.ViewportBounds.X;
        var y = this.Infos[i].Bounds.Y - this.Camera.ViewportBounds.Y;

        $.Graphics.drawImage(
            $.InfosImage,
            this.Infos[i].ImageSpriteBounds.X,
            this.Infos[i].ImageSpriteBounds.Y,
            this.Infos[i].ImageSpriteBounds.Width,
            this.Infos[i].ImageSpriteBounds.Height,
            x,
            y,
            this.Infos[i].Bounds.Width,
            this.Infos[i].Bounds.Height);
    }
};

$.Level.prototype.DrawEmitters = function () {
    for (var i = 0; i < this.Emitters.length; i++) {
        this.Emitters[i].Draw(this.Camera);
    }
};

$.Level.prototype.DrawBalls = function () {
    for (var i = 0; i < this.Balls.length; i++) {
        this.Balls[i].Draw(this.Camera);
    }
};

$.Level.prototype.DrawBlades = function () {
    for (var i = 0; i < this.Blades.length; i++) {
        this.Blades[i].Draw(this.Camera);
    }
};

$.Level.prototype.DrawPortals = function () {
    // Start Portal
    $.Graphics.drawImage(
        $.AreasImage,
        0,
        0,
        128,
        128,
        this.StartPortal.X - this.Camera.ViewportBounds.X,
        this.StartPortal.Y - this.Camera.ViewportBounds.Y,
        this.StartPortal.Width,
        this.StartPortal.Height);

    // End Portal
    $.Graphics.drawImage(
        $.AreasImage,
        128,
        0,
        128,
        128,
        this.EndPortal.X - this.Camera.ViewportBounds.X,
        this.EndPortal.Y - this.Camera.ViewportBounds.Y,
        this.EndPortal.Width,
        this.EndPortal.Height);
};

$.Level.prototype.DrawPlayer = function () {
    this.Player.Draw();

    if (this.LevelStates.Play == 1) {
        $.Graphics.save();
        $.Graphics.font = '32px Impact';
        $.Graphics.fillStyle = 'yellow';

        $.Graphics.fillRect(
            200, 6, 25, 25);
        $.Graphics.fillText(' ' + this.Player.Lives, 230, 32);

        $.Graphics.drawImage($.BallImage, 0, 0, 30, 30, 265, 6, 25, 25);
        $.Graphics.fillText(' ' + this.Player.Balls, 295, 32);

        $.Graphics.fillText('Grounded: ' + this.Player.Grounded, 400, 32);
        $.Graphics.fillText($.FPS.GetFPS(), 230, 64);
        $.Graphics.fillText("X: " + Math.round(this.Player.Bounds.X) +
            " Y: " + Math.round(this.Player.Bounds.Y), 230, 96);


        $.Graphics.restore();
    }
}

$.Level.prototype.DrawEnemies = function () {
    for (var i = 0; i < this.Enemies.length; i++) {
        this.Enemies[i].Draw(this.Camera);

        var dist = this.Enemies[i].Bounds.Centre.DistanceBetween(this.Player.Bounds.Centre);
        if (dist < ($.CanvasBounds.Width + ($.CanvasBounds.Width / 3))) {
            this.Enemies[i].DrawColorPolution(this.Camera);
        }
    }
};

$.Level.prototype.DrawResult = function () {
    if (this.LevelStates.Result == 0) { return; }        

    $.Graphics.save();
    $.Graphics.globalAlpha = 0.8;
    $.Graphics.fillStyle = 'black';
    $.Graphics.fillRect($.CanvasBounds.X, $.CanvasBounds.Y, $.CanvasBounds.Width, $.CanvasBounds.Height);    
    $.Graphics.restore();

    $.Graphics.save();
    $.Graphics.font = this.ResultTitle.Font;
    $.Graphics.fillStyle = 'yellow';
    $.Graphics.fillText(this.ResultTitle.Text, this.ResultTitle.Point.X, this.ResultTitle.Point.Y);

    for (var i = 0; i < this.ResultDisplayObjects.length; i++) {

    }

    $.Graphics.drawImage(
        this.ResultOption1.Selected ? $.LevelResultButtonsSelectedImage : $.LevelResultButtonsImage,
        (this.Win ? 0 : 2) * 150,
        0,
        150,
        50,
        this.ResultOption1.Bounds.X,
        this.ResultOption1.Bounds.Y,
        this.ResultOption1.Bounds.Width,
        this.ResultOption1.Bounds.Height);

    $.Graphics.drawImage(
        this.ResultOption2.Selected ? $.LevelResultButtonsSelectedImage : $.LevelResultButtonsImage,
        (this.Win ? 1 : 3) * 150,
        0,
        150,
        50,
        this.ResultOption2.Bounds.X,
        this.ResultOption2.Bounds.Y,
        this.ResultOption2.Bounds.Width,
        this.ResultOption2.Bounds.Height);

    $.Graphics.restore();
};

$.Level.prototype.MouseMove = function () {
    if (this.LevelStates.Result == 1) {

    }
};

$.Level.prototype.MouseUp = function () {
    if (this.LevelStates.Result == 1) {
        this.FireResultAction();
    }
};

$.Level.prototype.KeyDown = function () {
    if (this.LevelStates.Result == 1) {
        if (this.ResultOption1.Selected) {
            if ($.Keys[$.KeyCodes.LEFT] || $.Keys[$.KeyCodes.RIGHT]) {
                this.ResultOption1.Selected = false;
                this.ResultOption2.Selected = true;
            }
            else if ($.Keys[$.KeyCodes.ENTER]) {
                this.FireResultAction();
            }
        }
        else if (this.ResultOption2.Selected) {
            if ($.Keys[$.KeyCodes.LEFT] || $.Keys[$.KeyCodes.RIGHT]) {
                this.ResultOption1.Selected = true;
                this.ResultOption2.Selected = false;
            }
            else if ($.Keys[$.KeyCodes.ENTER]) {
                this.FireResultAction();
            }
        }
        else {
            if ($.Keys[$.KeyCodes.LEFT] || $.Keys[$.KeyCodes.RIGHT]) {
                this.ResultOption1.Selected = true;
            }
        }
    }
};

$.Level.prototype.FireResultAction = function () {
    if (this.ResultOption1.Selected) {
        if (this.Win) { // Save and Quit
            // TODO:
            // Save progress
        }

        // TODO:
        // Clear canvas

        $.Menu.style.visibility = 'visible';
        $.SetGameState($.StateNames.GameMenu);
    }
    else if (this.ResultOption2.Selected) {
        if (this.Win) { // Next level
            this.LevelIndex += 1;
            this.CreateLevel();
        }
        else { // Restart level                    
            this.CreateLevel();
        }
    }
};
$.Enemy = function (bounds, level, type) {
    this.Bounds = bounds;
    this.Level = level;
    this.Velocity = new $.Point(0, 0);
    this.Dead = false;
    this.Remove = false;
    this.Type = type;

    this.Gravity = 1;
    this.FallSpeed = 11;
    this.Falling = false;
    this.Grounded = false;

    this.State = { left: 1, right: 0, idle: 1 };
    this.MoveTick = 5;
    this.IdleTick = $.RandomBetween(12, 18);
    this.Elapsed = $.RandomBetween(0, 7);

    this.Burning = false;

    // Shared by green and purple.
    // Shoot tick used by both to fire attack.
    // Both use float tick for smooth fly motion.
    this.ShootTick = 10;
    this.ShootElapsed = 0;
    this.FloatTick = Math.round($.RandomBetween(0, 500));

    this.BeamTick = 2;
    this.BeamElapsed = 0;
    this.BeamActive = false;

    this.SetupEnemy();
};

$.Enemy.prototype.SetupEnemy = function () {
    switch (this.Type) {
        case "yellow":
            this.LeftAnimation = new $.Animation($.YellowBotImage, [0], 45, 45, 0, 0.5, true);
            this.IdleAnimation = new $.Animation($.YellowBotImage, [1, 2], 45, 45, 0, 2, true);
            this.RightAnimation = new $.Animation($.YellowBotImage, [3], 45, 45, 0, 0.5, true);
            this.DeathAnimation = new $.Animation($.YellowBotImage, [4, 5, 6, 7, 8], 45, 45, 0, 0.3, false);
            break;
        case "blue":            
            this.IdleAnimation = new $.Animation($.BlueBotImage, [1], 45, 30, 0, 0.3, true);
            this.LeftAnimation = this.IdleAnimation;
            this.RightAnimation = this.IdleAnimation;
            this.DeathAnimation = new $.Animation($.YellowBotImage, [4, 5, 6, 7, 8], 45, 45, 0, 5, false);
            break;
        case "red":
            this.LeftAnimation = new $.Animation($.YellowBotImage, [0], 45, 45, 0, 0.5, true);
            this.IdleAnimation = new $.Animation($.YellowBotImage, [1], 45, 45, 0, 0.5, true);
            this.RightAnimation = new $.Animation($.YellowBotImage, [2], 45, 45, 0, 0.5, true);
            this.DeathAnimation = new $.Animation($.YellowBotImage, [4, 5, 6, 7, 8], 45, 45, 0, 5, false);
            this.MoveTick = 8;
            break;
        case "green":
            this.LeftAnimation = new $.Animation($.YellowBotImage, [0], 45, 45, 0, 0.5, true);
            this.IdleAnimation = this.LeftAnimation;
            this.RightAnimation = new $.Animation($.YellowBotImage, [2], 45, 45, 0, 0.5, true);
            this.DeathAnimation = new $.Animation($.YellowBotImage, [4, 5, 6, 7, 8], 45, 45, 0, 5, false);
            break;
        case "purple":
            this.LeftAnimation = new $.Animation($.YellowBotImage, [0], 45, 45, 0, 0.5, true);
            this.IdleAnimation = new $.Animation($.YellowBotImage, [1], 45, 45, 0, 0.5, true);
            this.RightAnimation = new $.Animation($.YellowBotImage, [2], 45, 45, 0, 0.5, true);
            this.DeathAnimation = new $.Animation($.YellowBotImage, [4, 5, 6, 7, 8], 45, 45, 0, 5, false);
            break;
    }

    this.CurrentAnimation = this.IdleAnimation;
    this.CurrentAnimation.Play();
};

$.Enemy.prototype.Update = function (camera) {
    if (this.Remove) { return; }

    this.Bounds.Update();

    if (this.Dead) {
        this.CurrentAnimation = this.DeathAnimation;
        if (this.DeathAnimation.PlayedOnce) { this.Remove = true; }
    }
    else {
        if (this.Type == "yellow") { this.UpdateYellow(); }
        if (this.Type == "blue") { this.UpdateBlue(); }
        if (this.Type == "red") { this.UpdateRed(); }
        if (this.Type == "green") { this.UpdateGreen(camera); }
        if (this.Type == "purple") { this.UpdatePurple(); }
    }

    if (!this.CurrentAnimation.Playing)
        this.CurrentAnimation.Play();

    this.CurrentAnimation.Update();
};

$.Enemy.prototype.UpdateShoot = function () {
    var shoot = false;
    this.ShootElapsed += 0.1;
    if (this.ShootElapsed >= this.ShootTick) {
        this.ShootElapsed = 0;
        shoot = true;
    }
    return shoot;
};


// YELLOW

$.Enemy.prototype.UpdateYellow = function () {
    this.UpdateYellowMovement();
    this.UpdateYellowForces();
    this.HandleYellowCollisions();
    this.UpdateYellowStates();
};

$.Enemy.prototype.UpdateYellowMovement = function () {
    this.Elapsed += 0.1;

    if (this.State.idle == 1) {
        this.Velocity.X = 0;
        this.CurrentAnimation = this.IdleAnimation;      

        if (this.Elapsed >= this.IdleTick) {
            this.Elapsed = 0;
            this.idleTick = $.RandomBetween(12, 18);

            if (this.State.left == 1) {
                this.State.left = 0;
                this.State.right = 1;
                this.Velocity.X += 2;
            }
            else {
                this.State.left = 1;
                this.State.right = 0;
                this.Velocity.X -= 2;
            }
            this.State.idle = 0;
        }
    }
    else {
        if (this.Elapsed >= this.MoveTick) {
            this.Elapsed = 0;
            this.State.idle = 1;
        }
        else {
            if (this.State.left == 1) {
                this.CurrentAnimation = this.LeftAnimation;
            }
            else if (this.State.right == 1) {
                this.CurrentAnimation = this.RightAnimation;
            }
        }
    }
};

$.Enemy.prototype.UpdateYellowForces = function () {
    if (!this.Grounded || this.Falling) {
        this.Velocity.Y += this.Gravity;
    }

    this.Bounds.Y += this.Velocity.Y;
    this.Bounds.X += this.Velocity.X;
};

$.Enemy.prototype.HandleYellowCollisions = function () {
    this.Grounded = false;

    // Only the minimum amount of tile around the player
    // will be checked for collision here.
    var maxTilesHorizontal = Math.ceil(this.Bounds.Width / $.TileWidth) + 1;
    var maxTilesVertical = Math.ceil(this.Bounds.Height / $.TileHeight) + 1;
    var x = Math.floor(this.Bounds.X / $.TileWidth);
    var y = Math.floor(this.Bounds.Y / $.TileHeight);

    if (x < 0 || x >= this.Level.TileCols || y < 0 || y >= this.Level.TileRows) { return; }
    var startX = x - Math.ceil(maxTilesHorizontal / 2);
    var startY = y - Math.ceil(maxTilesVertical / 2);

    for (var col = startX; col < x + maxTilesHorizontal; col++) {
        for (var row = startY; row < y + maxTilesVertical; row++) {

            if (col < 0 || col >= this.Level.TileCols ||
                row < 0 || row >= this.Level.TileRows) { continue; }

            if (this.Level.Tiles[row][col].IsEmpty) { continue; }
            var collision = $.CheckCollision(this.Bounds, this.Level.Tiles[row][col].Bounds);

            if (collision == $.bottom_collision) {
                this.Velocity.Y = 0;
                this.Grounded = true;
            }

            if (collision == $.top_collision) {
                this.Velocity.Y = 0;
            }

            if (collision == $.left_collision) {
                this.Velocity.X = 0;
            }

            if (collision == $.right_collision) {
                this.Velocity.X = 0;
            }
        }
    }

    return;
};

$.Enemy.prototype.UpdateYellowStates = function () {
    if (this.Velocity.Y > 0) {
        this.Falling = true;
        this.Jumping = false;
    }
    else if (this.Velocity.Y < 0) {
        this.Falling = false;
        this.Jumping = true;
    }
    else {
        this.Falling = false;
        this.Jumping = false;
    }
}

// BLUE

$.Enemy.prototype.UpdateBlue = function () {
    this.FloatTick++;

    // Blue's eye must follow player.
    // update eye rotation towards player
    // Sprite sheet will have eye layer that must be
    // drawn over body image.

    // TODO:
    // Implement more patters.e.g. circular, zigzag, figure 8

    this.Bounds.X += (Math.cos(this.FloatTick / 30) * 2);
    this.Bounds.Y += (Math.sin(this.FloatTick / 30) * 2);
};

// RED

$.Enemy.prototype.UpdateRed = function () {
    // Red behaves the same as yellow, it
    // burns while moving thought, thus invincible and kills
    // player on butt bounce attempt while burning.
    this.UpdateYellowMovement();
    this.UpdateYellowForces();
    this.HandleYellowCollisions();
    this.UpdateRedStates();
};

$.Enemy.prototype.UpdateRedStates = function () {
    this.UpdateYellowStates();

    if (this.State.idle == 1) { this.Burning = false; }
    else { this.Burning = true; }        
}

// GREEN

$.Enemy.prototype.UpdateGreen = function (camera) {
    this.UpdateYellowForces();
    this.HandleYellowCollisions();

    if (this.UpdateShoot()) {
        if (this.State.left == 1) {
            this.CurrentAnimation = this.RightAnimation;
            this.State.right = 1;
            this.State.left = 0;
            this.Beam = new $.Rectangle(
                this.Bounds.X + this.Bounds.Width, this.Bounds.Y + this.Bounds.Height / 2, $.TileWidth * 3, 10);            
        }
        else {
            this.CurrentAnimation = this.LeftAnimation;
            this.State.right = 0;
            this.State.left = 1;
            this.Beam = new $.Rectangle(
                this.Bounds.X - $.TileWidth * 3, this.Bounds.Y + this.Bounds.Height / 2, $.TileWidth * 3, 10);
        }

        this.BeamActive = true;
        this.BeamEmitter = new $.ParticleEngine(
            this.Bounds.Centre,
            new $.Point(2, 2),
            Math.PI * 2,
            900,
            10,
            3.5,
            true,
            this.Type,
            $.GreenGlowParticleImage);
    }

    this.UpdateBeam(camera);
};

$.Enemy.prototype.UpdateBeam = function (camera) {    
    if (this.BeamActive) {
        this.BeamElapsed += 0.1;
        if (this.BeamElapsed >= this.BeamTick) {
            this.BeamElapsed = 0;
            this.BeamActive = false;
            this.Beam = new $.Rectangle(0, 0, 0, 0);
        }
        this.BeamEmitter.Update(camera);
    }
    else {
        this.BeamEmitter = null;
    }
};

// PURPLE

$.Enemy.prototype.UpdatePurple = function () {
    this.FloatTick++;

    // Drop bombs on shoot tick

    // TODO:
    // Implement more patters.e.g. circular, zigzag, figure 8

    this.Bounds.X += (Math.sin(this.FloatTick / 60) * 3);
    this.Bounds.Y += (Math.sin(this.FloatTick / 15) * 2);
};


$.Enemy.prototype.Draw = function (camera) {
    if (!camera.RenderBounds.ContainsRect(this.Bounds)) { return; }

    var left = this.Bounds.X - camera.ViewportBounds.X;
    var top = this.Bounds.Y - camera.ViewportBounds.Y;

    this.DrawBeam(camera);
    this.CurrentAnimation.Draw(left, top, this.Bounds.Width, this.Bounds.Height);    
};

$.Enemy.prototype.DrawBeam = function (camera) {
    if (!this.BeamActive) { return; }
    
    this.BeamEmitter.Draw(camera);

    $.Graphics.save();
    $.Graphics.fillStyle = this.Type;
    $.Graphics.fillRect(
        this.Beam.X - camera.ViewportBounds.X,
        this.Beam.Y - camera.ViewportBounds.Y,
        this.Beam.Width,
        this.Beam.Height);
    $.Graphics.restore();
};

$.Enemy.prototype.DrawColorPolution = function (camera) {
    var left = this.Bounds.Centre.X - camera.ViewportBounds.X;
    var top = this.Bounds.Centre.Y - camera.ViewportBounds.Y;

    var grd = $.Graphics.createRadialGradient(
    left,
    top,
    0,
    left,
    top,
    450);

    grd.addColorStop(0, 'transparent');
    grd.addColorStop(0.2, this.Type);
    grd.addColorStop(1, 'transparent');    

    $.Graphics.save();
    $.Graphics.beginPath();

    $.Graphics.fillStyle = grd;
    $.Graphics.globalAlpha = 0.6;

    $.Graphics.arc(
        left,
		top,
		450,
		0,
		2 * Math.PI);
    $.Graphics.fill();    
    $.Graphics.restore();
};
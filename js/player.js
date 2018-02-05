$.Player = function (bounds, level) {
    this.Level = level;
    this.Bounds = bounds;
    this.Velocity = new $.Point(0, 0);
    this.JumpPoint = new $.Point(0, 0);

    this.Lives = 3;
    this.Balls = 0;

    this.Speed = 8.5;
    this.Sprint = 9.5;
    this.Gravity = 1.5;
    this.Direction = 1;
    this.JumpForce = 27.5;
    this.FallSpeed = 22;    
    this.DoubleJumpForce = 14;

    this.Dead = false;
    this.Ducking = false;
    this.Jumping = false;
    this.Falling = false;
    this.Grounded = false;
    this.JumpKeyUp = false;
    this.OutOfBounds = false;
    this.IsSprinting = false;
    this.CanDoubleJump = false;
    this.DoubleJumping = false;

    this.previousBottom = 0.0;
};

$.Player.prototype.Update = function () {
    this.Bounds.Update();
    this.UpdateMovement();
    this.UpdateForces();    
    this.HandleCollisions();
    this.HandleWorldCollision();
    this.UpdateBalls();
    this.UpdateStates();    
};

$.Player.prototype.UpdateMovement = function () {
    //if ($.Keys[$.KeyCodes.SHIFT]) { this.IsSprinting = true; }
    //else { this.IsSprinting = false; }

    if ($.Keys[$.KeyCodes.LEFT]) {
        this.Velocity.X = this.IsSprinting ? -this.Sprint : -this.Speed;
        this.Direction = -1;
    }
    else if ($.Keys[$.KeyCodes.RIGHT]) {
        this.Velocity.X = this.IsSprinting ? this.Sprint : this.Speed;
        this.Direction = 1;
    }
    else {
        this.Velocity.X = 0;
    }

    //    if (!this.Jumping && !this.Falling) {
    if (this.Grounded) {
        if ($.Keys[$.KeyCodes.UP] && this.JumpKeyUp && !this.DoubleJumping) {
            this.Velocity.Y = -this.JumpForce;
            this.CanDoubleJump = true;
            this.Grounded = false;
            this.JumpPoint = new $.Point(this.Bounds.X, this.Bounds.Y);
        }
        else if ($.Keys[$.KeyCodes.DOWN]) { this.Ducking = true; }
    }
    //else {
    //    if ($.Keys[$.KeyCodes.UP] && this.JumpKeyUp && !this.DoubleJumping &&
    //        this.CanDoubleJump && (this.Jumping || this.Falling)) {
    //        this.DoubleJumping = true
    //        this.Velocity.Y = -this.DoubleJumpForce;
    //        this.CanDoubleJump = false
    //    }
    //}
};

$.Player.prototype.UpdateForces = function () {
    // Apply gravity.
    if (!this.Grounded || this.Falling) { this.Velocity.Y += this.Gravity; }

    // Prevent player from exceeding max velocities.
    if (this.Velocity.Y > this.FallSpeed) { this.Velocity.Y = this.FallSpeed; }
    if (this.Velocity.Y < -this.JumpForce) { this.Velocity.Y = -this.JumpForce; }

    // Apply movement velocity to player.
    this.Bounds.X += this.Velocity.X;
    this.Bounds.Y += this.Velocity.Y;
};

$.Player.prototype.HandleCollisions = function () {
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

            if (this.Level.Tiles[row][col].IsEmpty || this.Level.Tiles[row][col].IsFake) { continue; }
            var collision = $.CheckCollision(this.Bounds, this.Level.Tiles[row][col].Bounds);

            if (collision == $.bottom_collision) {
                // If this tile is directly below cancel y velocity.
                // else tile is off to players side and should not prevent y velocity.
                if (this.Bounds.Centre.X > this.Level.Tiles[row][col].Bounds.Left &&
                    this.Bounds.Centre.X < this.Level.Tiles[row][col].Bounds.Right) {
                    this.Velocity.Y = 0;
                    
                    this.DoubleJumping = false;
                }
                this.Grounded = true;
                this.Bounds.Y += 1;
            }

            if (collision == $.top_collision) {                
                // If this tile is directly above cancel y velocity.
                // else tile is off to players side and should not prevent y velocity.
                if (this.Bounds.Centre.X > this.Level.Tiles[row][col].Bounds.Left &&
                    this.Bounds.Centre.X < this.Level.Tiles[row][col].Bounds.Right) {
                    this.Velocity.Y = 0;
                }
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

$.Player.prototype.HandleWorldCollision = function () {
    // Prevent player from moving past sides.
    // Set OutOfBounds if past certain bottom coordinate

    if (this.Bounds.Left < $.WorldBounds.Left) {
        this.Bounds.X = ($.WorldBounds.Left + 1);
        // TODO: reset x velocity
    }

    if (this.Bounds.Right > $.WorldBounds.Right) {
        this.Bounds.X = ($.WorldBounds.Right - 1) - this.Bounds.Width;
        // TODO: reset x velocity
    }

    // TODO:
    // Deduct ground height from world bottom
    if (this.Bounds.Bottom > $.WorldBounds.Bottom) {
        this.OutOfBounds = true;
    }
};

$.Player.prototype.UpdateBalls = function () {
    if (this.BallCount > 99) {
        this.Lives += 0;
        this.Balls = 0;
    }
};

$.Player.prototype.UpdateStates = function () {
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

    if ($.Keys[$.KeyCodes.UP]) { this.JumpKeyUp = false; }
    else { this.JumpKeyUp = true; }

    if (!$.Keys[$.KeyCodes.DOWN]) { this.Ducking = false; }
};

$.Player.prototype.Draw = function () {
    var x = this.Bounds.X - this.Level.Camera.ViewportBounds.X;
    var y = this.Bounds.Y - this.Level.Camera.ViewportBounds.Y;

    $.Graphics.fillStyle = 'yellow';
    $.Graphics.fillRect(x, y, this.Bounds.Width, this.Bounds.Height);
};

$.Player.prototype.Bounce = function () {
    this.Velocity.Y = -this.DoubleJumpForce;
    this.Grounded = false;
    this.CanDoubleJump = false
};
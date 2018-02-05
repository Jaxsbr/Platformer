$.Particle = function (point, velocity, acceleration, ttl) {
    this.Position = point || new $.Point(0, 0);
    this.Velocity = velocity || new $.Point(0, 0);
    this.Acceleration = acceleration || new $.Point(0, 0);
    this.TTL = ttl;
    this.MaxTTL = this.TTL;
    this.Opacity = 1;
};

$.Particle.prototype.Update = function () {
    this.TTL -= 0.1;

    if (this.TTL > 0) { this.Opacity = this.TTL / this.MaxTTL; }
    else { this.Opacity = 0; }

    this.Velocity.X += this.Acceleration.X;
    this.Velocity.Y += this.Acceleration.Y;    
    this.Position.X += this.Velocity.X;
    this.Position.Y += this.Velocity.Y;
};

$.Particle.prototype.Draw = function (camera, image) {
    $.Graphics.save();
    $.Graphics.globalAlpha = this.Opacity;
    if (image) {
        // Assume particles image is 30 * 10 and 3 frames are available
        var x = Math.round($.RandomBetween(1, 3));

        $.Graphics.drawImage(
            image,
            x - 1,
            0,
            10, 
            10,
            this.Position.X - camera.ViewportBounds.X,
            this.Position.Y - camera.ViewportBounds.Y,
            10,
            10);
    }
    else {
        $.Graphics.fillRect(
            this.Position.X - camera.ViewportBounds.X,
            this.Position.Y - camera.ViewportBounds.Y,
            2,
            2);
    }
    $.Graphics.restore();
};


$.ParticleEngine = function (point, velocity, spread, max, rate, ttl, emitting, color, image) {
    this.Position = point; 
    this.Velocity = velocity;
    this.Spread = spread || Math.PI / 32; // possible angles = velocity +/- spread
    this.DrawColor = "#999"; // So we can tell them apart from Fields later    
    this.MaxParticles = max; // 200
    this.EmissionRate = rate; // 4 (per frame rate)   
    this.TTL = ttl;
    this.Emitting = emitting;
    this.Color = color;
    this.Image = image;
    this.Particles = [];
};

$.ParticleEngine.prototype.EmitParticle = function () {
    // Use an angle randomized over the spread so we have more of a "spray"
    var angle = this.Velocity.GetAngle() + this.Spread - (Math.random() * this.Spread * 2);

    // The magnitude of the emitter's velocity
    var magnitude = this.Velocity.GetMagnitude();

    // The emitter's position
    var position = new $.Point(this.Position.X, this.Position.Y);

    // New velocity based off of the calculated angle and magnitude
    var velocity = $.FromAngle(angle, magnitude);
    
    this.Particles.push(new $.Particle(position, velocity, new $.Point(0, 0), 2));
};

$.ParticleEngine.prototype.Update = function (camera) {
    if (!camera.RenderBounds.ContainsRect(new $.Rectangle(this.Position.X, this.Position.Y, 1, 1))) { return; }

    this.TTL -= 0.1;

    if (this.Emitting) {
        if (this.Particles.length > this.MaxParticles) { return; }
        
        for (var i = 0; i < this.EmissionRate; i++) {
            this.EmitParticle();
        }        
    }

    for (var i = 0; i < this.Particles.length; i++) {
        this.Particles[i].Update();
        if (this.Particles[i].TTL <= 0 && this.Particles[i].Opacity == 0) { this.Particles.splice(i, 1); }
    }
};

$.ParticleEngine.prototype.Draw = function (camera) {
    if (!camera.RenderBounds.ContainsRect(new $.Rectangle(this.Position.X, this.Position.Y, 1, 1))) { return; }

    if (this.Emitting) {
        $.Graphics.fillStyle = this.Color;
        for (var i = 0; i < this.Particles.length; i++) {
            this.Particles[i].Draw(camera, this.Image);
        }
    }
};
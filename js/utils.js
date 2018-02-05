$.FPS = {
    StartTime: 0,
    FrameNumber: 0,
    GetFPS: function () {
        this.FrameNumber++;

        var date = new Date().getTime();
        var currentTime = (date - this.StartTime) / 1000;
		var	result = Math.floor((this.FrameNumber / currentTime));

        if (currentTime > 1) {
            this.StartTime = new Date().getTime();
            this.FrameNumber = 0;
        }

        return result;
    }
}


$.RandomBetween = function(min, max) {
    return Math.random() * (max - min) + min;
}

$.RandomVariation = function(center, variation) {
    return center + variation * RandomBetween(-0.5, 0.5);
}

$.CalculateAngle = function(PointA, PointB) {
    var ra = Math.PI / 180;
    var deg = 180 / Math.PI;
    var x = PointB.X - PointA.X;
    var y = PointA.Y - PointB.Y;
    var angle = 0;

    y = y * ra;
    x = x * ra;

    if (x >= 0 && y >= 0) { angle = 90 - Math.atan(y / x) * deg; }
    else if (x >= 0 && y <= 0) { angle = 90 + Math.abs(Math.atan(y / x) * deg); }
    else if (x <= 0 && y <= 0) { angle = 270 - Math.atan(y / x) * deg; }
    else if (x <= 0 && y >= 0) { angle = 270 + Math.abs(Math.atan(y / x) * deg); }

    return angle;
}

$.FromAngle = function (angle, magnitude) {
    return new $.Point(magnitude * Math.cos(angle), magnitude * Math.sin(angle));
};

$.GetRadiansFromPoints = function(PointA, PointB) {
    var tx = PointA.X - PointB.X;
    var ty = PointA.Y - PointB.Y;
    return Math.atan2(ty, tx);
}

$.CheckCollision = function (rectA, rectB) {
    // get the vectors to check against
    var distancePoint = new $.Point(
        (rectA.X + (rectA.Width / 2)) - (rectB.X + (rectB.Width / 2)),
        (rectA.Y + (rectA.Height / 2)) - (rectB.Y + (rectB.Height / 2)));

    // add the half widths and half heights of the objects
    var halfWidths = (rectA.Width / 2) + (rectB.Width / 2);
    var halfHeights = (rectA.Height / 2) + (rectB.Height / 2);
    var collisionSide = null;

    // if the x and y vector are less than the half width or half height, 
    // they we must be inside the object, causing a collision
    if (Math.abs(distancePoint.X) < halfWidths && Math.abs(distancePoint.Y) < halfHeights) {
        // figures out on which side we are colliding (top, bottom, left, or right)
        var resultPoint = new $.Point(
            halfWidths - Math.abs(distancePoint.X),
            halfHeights - Math.abs(distancePoint.Y));

        if (resultPoint.X >= resultPoint.Y) {
            if (distancePoint.Y > 0) {
                collisionSide = $.top_collision;
                rectA.Y += resultPoint.Y;
            }
            else if (distancePoint.Y < 0) {
                collisionSide = $.bottom_collision;
                rectA.Y -= resultPoint.Y;
            }
        }
        else if (resultPoint.X < resultPoint.Y) {
            if (distancePoint.X > 0) {
                collisionSide = $.left_collision;
                rectA.X += resultPoint.X;
            }
            else if (distancePoint.X < 0) {
                collisionSide = $.right_collision;
                rectA.X -= resultPoint.X;
            }
        }
    }
    return collisionSide;
};

$.top_collision = "top";
$.bottom_collision = "bottom";
$.left_collision = "left";
$.right_collision = "right";


$.Point = function(x, y) {
    this.X = x;
    this.Y = y;
}

$.Point.prototype.DistanceBetween = function (point) {
    var px = this.X - point.X;
    var py = this.Y - point.Y;
    return Math.sqrt(px * px + py * py);
}

$.Point.prototype.Normalize = function (point) {
    var px = this.X - point.X;
    var py = this.Y - point.Y;
    var dist = Math.sqrt(px * px + py * py);
    return new Point(px / dist, py / dist);
}

$.Point.prototype.GetMagnitude = function () {
    return Math.sqrt(this.X * this.X + this.Y * this.Y);
};

$.Point.prototype.GetAngle = function () {
    return Math.atan2(this.Y, this.X);
};


$.Rectangle = function(x, y, width, height) {
    this.X = x;
    this.Y = y;
    this.Width = width;
    this.Height = height;
    this.Left = this.X;
    this.Top = this.Y;
    this.Right = null
    this.Bottom = null;
    this.Centre = null;    
    this.Update();
}

$.Rectangle.prototype.Update = function () {
    this.Left = this.X;
    this.Top = this.Y;
    this.Right = this.Left + this.Width;
    this.Bottom = this.Top + this.Height;
    this.Centre = new $.Point(
		this.Left + (this.Width / 2),
		this.Top + (this.Height / 2));
}

$.Rectangle.prototype.IntersectRect = function (rectangle) {
    this.Update();
    rectangle.Update();

    return !(rectangle.Left > (this.Left + this.Width) ||
             (rectangle.Left + rectangle.Width) < this.Left ||
             rectangle.Top > (this.Top + this.Height) ||
             (rectangle.Top + rectangle.Height) < this.Top);
}

$.Rectangle.prototype.ContainsRect = function (rectangle) {
    this.Update();
    rectangle.Update();

    return (this.Left <= rectangle.Left &&
           rectangle.Right <= this.Right &&
           this.Top <= rectangle.Top &&
           rectangle.Bottom <= this.Bottom);
}

$.Rectangle.prototype.GetIntersectionDepth = function (rectangle) {
    this.Update();
    rectangle.Update();

    // Calculate half sizes.
    var halfWidthA = this.Width / 2.0;
    var halfHeightA = this.Height / 2.0;
    var halfWidthB = rectangle.Width / 2.0;
    var halfHeightB = rectangle.Height / 2.0;

    // Calculate centers.
    var centerA = this.Centre;
    var centerB = rectangle.Centre;

    // Calculate current and minimum-non-intersecting distances between centers.
    var distanceX = centerA.X - centerB.X;
    var distanceY = centerA.Y - centerB.Y;
    var minDistanceX = halfWidthA + halfWidthB;
    var minDistanceY = halfHeightA + halfHeightB;

    // If we are not intersecting at all, return (0, 0).
    if (Math.abs(distanceX) >= minDistanceX || Math.abs(distanceY) >= minDistanceY)
        return new $.Point(0, 0);

    // Calculate and return intersection depths.
    var depthX = distanceX > 0 ? minDistanceX - distanceX : -minDistanceX - distanceX;
    var depthY = distanceY > 0 ? minDistanceY - distanceY : -minDistanceY - distanceY;
    return new $.Point(depthX, depthY);
};
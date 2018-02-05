// This loads a new or saved game or continues from paused game.
// This tracks all game logic.

$.GamePlayTick = function () {
    if ($.LevelObject) {
        $.LevelObject.Update();
        $.LevelObject.Draw();
    }
};

$.GamePlayMouseMove = function () {
    if ($.LevelObject) { $.LevelObject.MouseMove(); }
};

$.GamePlayKeyDown = function () {
    if ($.LevelObject) { $.LevelObject.KeyDown(); }
};

$.GamePlayMouseUp = function () {
    if ($.LevelObject) { $.LevelObject.MouseUp(); }
};
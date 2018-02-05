$.Init = function () {
    $.Keys = [];
    $.KeyCodes = { ENTER: 13, SHIFT: 16, LEFT: 37, UP: 38, RIGHT: 39, DOWN: 40 };
    $.MousePoint = new $.Point(0, 0);
    $.Delta = 0;
    $.Then = Date.now();
    $.States = {};
    $.StateNames = {
        GameMenu: 'Game_Menu',
        GameLoad: 'Game_Load',
        GamePlay: 'Game_Play',
        GamePause: 'Game_Pause'
    };
    $.CanvasAspectRatio = new $.Point(800, 600);
    $.AspectRatio = $.CanvasAspectRatio.X / $.CanvasAspectRatio.Y;
    $.CanvasBounds = new $.Rectangle(0, 0, $.CanvasAspectRatio.X, $.CanvasAspectRatio.Y);
    $.WorldBounds = new $.Rectangle(0, 0, 10, 10);
    $.TileWidth = 96;//48;
    $.TileHeight = 64;//32;

    $.InitRequestAnimationFrame();
    $.InitWindowEvents();
    $.InitGameState();
    $.InitCanvas();
    $.InitMenu();
    $.SetGameState($.StateNames.GameMenu);
    $.GameTick();

    $.LevelObject = null;
    $.IsNewGame = true;
    $.AssetCount = 19;
    $.AssetLoadCount = 0;
    $.AssetsLoaded = false;
    $.AssetsLoading = false;
};

$.InitRequestAnimationFrame = function () {
    var requestAnimationFrame =
        window.requestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.msRequestAnimationFrame;

    window.requestAnimationFrame = requestAnimationFrame;
};

$.InitWindowEvents = function () {
    window.addEventListener('mousemove', $.MouseMove);
    window.addEventListener('mousedown', $.MouseDown);
    window.addEventListener('mouseup', $.MouseUp);
    window.addEventListener('keydown', $.KeyDown);
    window.addEventListener('keyup', $.KeyUp);
    window.addEventListener("keypress", $.KeyPress);
    window.addEventListener('resize', $.Resize);
};

$.InitGameState = function () {
    $.States.GameMenu = {
        Active: false,
        Tick: $.GameMenuTick,
    };

    $.States.GameLoad = {
        Active: false,
        Tick: $.GameLoadTick,
    };

    $.States.GamePlay = {
        Active: false,
        Tick: $.GamePlayTick,
    };

    $.States.GamePause = {
        Active: false,
        Tick: function () {
            // TODO:
            // This stops game play and draws
            // pause screen over it. Pause allows the player to 
            // continue game or save and quit to StartMenu.
        },
    };
};

$.InitCanvas = function () {
    $.Canvas = document.getElementById('canvas');
    $.Graphics = $.Canvas.getContext('2d');
    $.SetCanvas();
};

$.SetGameState = function (state) {
    $.States.GameMenu.Active = false;
    $.States.GameLoad.Active = false;
    $.States.GamePlay.Active = false;
    $.States.GamePause.Active = false;

    switch (state) {
        case $.StateNames.GameMenu:
            $.States.GameMenu.Active = true;
            break;
        case $.StateNames.GameLoad:
            $.States.GameLoad.Active = true;
            break;
        case $.StateNames.GamePlay:            
            $.States.GamePlay.Active = true;
            break;
        case $.StateNames.GamePause:
            $.States.GamePause.Active = true;
            break;
    }
};

$.SetCanvas = function () {
    if (!$ || !$.Canvas) { return; }

    var windowRatio = window.innerWidth / window.innerHeight;
    var newWidth = window.innerWidth;
    var newHeight = window.innerHeight;

    if (windowRatio > $.AspectRatio) {
        // window width is too wide relative to desired game width
        newWidth = newHeight * $.AspectRatio;
        //$.Canvas.style.height = newHeight + 'px';
        //$.Canvas.style.width = newWidth + 'px';
    }
    else {
        // window height is too high relative to desired game height
        newHeight = newWidth / $.AspectRatio;
        //$.Canvas.style.width = newWidth + 'px';
        //$.Canvas.style.height = newHeight + 'px';
    }

    if (newWidth < $.WorldBounds.Width) { newWidth = window.innerWidth; }

    $.Canvas.style.marginTop = (-newHeight / 2) + 'px';    
    $.Canvas.style.marginLeft = (-newWidth / 2) + 'px';

    $.Canvas.width = newWidth;
    $.Canvas.height = newHeight;
};

$.GameTick = function () {
    $.GameUpdate();

    if ($.States.GameMenu.Active) { $.States.GameMenu.Tick(); }
    else if ($.States.GameLoad.Active) { $.States.GameLoad.Tick(); }
    else if ($.States.GamePlay.Active) { $.States.GamePlay.Tick(); }
    else if ($.States.GamePause.Active) { $.States.GamePause.Tick(); }

    requestAnimationFrame($.GameTick);
};

$.GameUpdate = function () {
    // TODO:
    // Update delta

    $.CanvasBounds = new $.Rectangle(
        0, 0, $.Canvas.width, $.Canvas.height);
    $.CanvasBounds.Update();    
};

$.MouseMove = function (e) {
    $.MousePoint = new $.Point(e.clientX, e.clientY);

    if ($.States.GamePlay.Active) { $.GamePlayMouseMove(); }
};

$.MouseDown = function () {

};

$.MouseUp = function () {
    if ($.States.GamePlay.Active) { $.GamePlayMouseUp(); }
};

$.KeyDown = function (e) {
    $.Keys[e.keyCode] = true;

    if ($.States.GameMenu.Active) { $.SelectMenuItem(e.keyCode); }
    else if ($.States.GamePlay.Active) { $.GamePlayKeyDown(); }
};

$.KeyUp = function (e) {
    $.Keys[e.keyCode] = false;
};

$.KeyPress = function (e) {

};

$.Resize = function () {
    $.SetCanvas();
};

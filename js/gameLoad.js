$.GameLoadTick = function () {
    if ($.AssetsLoaded) {
        $.InitLevelData();
        $.LevelObject = new $.Level();
    }
    else {
        if ($.AssetsLoading) {
            if ($.AssetLoadCount == $.AssetCount) {
                $.AssetsLoaded = true;
            }
        }
        else {
            $.AssetsLoading = true;
            $.LoadAssets();
        }
    }

    if ($.LevelObject) {
        $.SetGameState($.StateNames.GamePlay);
        return;        
    }
};

$.LoadAssets = function () {
    $.BladesImage = new Image();
    $.BladesImage.onload = function () { $.AssetLoadCount += 1; }
    $.BladesImage.src = 'assets/blades.png';

    $.CheckPointImage = new Image();
    $.CheckPointImage.onload = function () { $.AssetLoadCount += 1; }
    $.CheckPointImage.src = 'assets/checkPoint.png';

    $.BackgroundImage = new Image();
    $.BackgroundImage.onload = function () { $.AssetLoadCount += 1; }
    $.BackgroundImage.src = 'assets/background.png';
    
    $.Ships1Image = new Image();
    $.Ships1Image.onload = function () { $.AssetLoadCount += 1; }
    $.Ships1Image.src = 'assets/ships_01.gif';

    $.Ships2Image = new Image();
    $.Ships2Image.onload = function () { $.AssetLoadCount += 1; }
    $.Ships2Image.src = 'assets/ships_02.gif';

    $.Ships3Image = new Image();
    $.Ships3Image.onload = function () { $.AssetLoadCount += 1; }
    $.Ships3Image.src = 'assets/ships_03.gif';

    $.Layer1Image = new Image();
    $.Layer1Image.onload = function () { $.AssetLoadCount += 1; }
    $.Layer1Image.src = 'assets/layer1.png';

    $.Layer2Image = new Image();
    $.Layer2Image.onload = function () { $.AssetLoadCount += 1; }
    $.Layer2Image.src = 'assets/layer2.png';

    $.BallImage = new Image();
    $.BallImage.onload = function () { $.AssetLoadCount += 1; }
    $.BallImage.src = 'assets/gears.png';

    $.EnemyHitParticleImage = new Image();
    $.EnemyHitParticleImage.onload = function () { $.AssetLoadCount += 1; }
    $.EnemyHitParticleImage.src = 'assets/enemyParticles.png';

    $.GreenGlowParticleImage = new Image();
    $.GreenGlowParticleImage.onload = function () { $.AssetLoadCount += 1; }
    $.GreenGlowParticleImage.src = 'assets/greenGlow.png';

    $.AreasImage = new Image();
    $.AreasImage.onload = function () { $.AssetLoadCount += 1; }
    $.AreasImage.src = 'assets/areas.png';

    $.YellowBotImage = new Image();
    $.YellowBotImage.onload = function () { $.AssetLoadCount += 1; }
    $.YellowBotImage.src = 'assets/botYellow.png';

    $.BlueBotImage = new Image();
    $.BlueBotImage.onload = function () { $.AssetLoadCount += 1; }
    $.BlueBotImage.src = 'assets/botBlue.png';

    $.PlatformsImage = new Image();
    $.PlatformsImage.onload = function () { $.AssetLoadCount += 1; }
    $.PlatformsImage.src = 'assets/platforms.png';

    $.PathsImage = new Image();
    $.PathsImage.onload = function () { $.AssetLoadCount += 1; }
    $.PathsImage.src = 'assets/tiles.png';    

    $.InfosImage = new Image();
    $.InfosImage.onload = function () { $.AssetLoadCount += 1; }
    $.InfosImage.src = 'assets/infos.png';

    $.LevelResultButtonsImage = new Image();
    $.LevelResultButtonsImage.onload = function () { $.AssetLoadCount += 1; }
    $.LevelResultButtonsImage.src = 'assets/levelResultButtons.png';

    $.LevelResultButtonsSelectedImage = new Image();
    $.LevelResultButtonsSelectedImage.onload = function () { $.AssetLoadCount += 1; }
    $.LevelResultButtonsSelectedImage.src = 'assets/levelResultButtonsSelected.png';
};
// GameMenuState, allows the player to start a new game, continue a 
// previous game, set options or go to main website. 

$.InitMenu = function () {
    $.Menu = document.getElementById('Menu');

    $.MenuTexts = [];
    $.MenuTexts.push(
        { Selected: false, Element: document.getElementById('NewGameText') });

    // TODO:
    // If any saved games exists, enable the saved game option.
    var savedGameExists = false;
    if (savedGameExists) {
        var savedGameText = document.getElementById('SavedGameText');
        savedGameText.className = 'itemText';
        $.MenuTexts.push({ Selected: false, Element: savedGameText });
    }

    $.MenuTexts.push(
        { Selected: false, Element: document.getElementById('OptionsText') });
    $.MenuTexts.push(
        { Selected: false, Element: document.getElementById('MainWebsiteText') });

    for (var i = 0; i < $.MenuTexts.length; i++) {
        $.MenuTexts[i].Element.addEventListener('mouseover', function () {
            for (var x = 0; x < $.MenuTexts.length; x++) {
                if (this == $.MenuTexts[x].Element) {
                    $.MenuTexts[x].Element.className = 'itemTextSelected';
                    $.MenuTexts[x].Selected = true;
                }
                else {
                    $.MenuTexts[x].Element.className = 'itemText';
                    $.MenuTexts[x].Selected = false;
                }
            }
        });
    }
};

$.SelectMenuItem = function (keyCode) {
    $.SelectedMenuIndex = -1;
    for (var x = 0; x < $.MenuTexts.length; x++) {
        if ($.MenuTexts[x].Selected) {
            $.SelectedMenuIndex = x;
            break;
        }
    }

    if (keyCode == $.KeyCodes.UP) {
        if ($.SelectedMenuIndex > 0) { $.SelectedMenuIndex -= 1; }
        else { $.SelectedMenuIndex = $.MenuTexts.length - 1; }

        for (var x = 0; x < $.MenuTexts.length; x++) {
            if (x == $.SelectedMenuIndex) {
                $.MenuTexts[x].Element.className = 'itemTextSelected';
                $.MenuTexts[x].Selected = true;
            }
            else {
                $.MenuTexts[x].Element.className = 'itemText';
                $.MenuTexts[x].Selected = false;
            }
        }
    }
    else if (keyCode == $.KeyCodes.DOWN) {
        if ($.SelectedMenuIndex + 1 < $.MenuTexts.length) { $.SelectedMenuIndex += 1; }
        else { $.SelectedMenuIndex = 0; }

        for (var x = 0; x < $.MenuTexts.length; x++) {
            if (x == $.SelectedMenuIndex) {
                $.MenuTexts[x].Element.className = 'itemTextSelected';
                $.MenuTexts[x].Selected = true;
            }
            else {
                $.MenuTexts[x].Element.className = 'itemText';
                $.MenuTexts[x].Selected = false;
            }
        }
    }
    else if (keyCode == $.KeyCodes.ENTER) {
        var selectedItem = $.MenuTexts[$.SelectedMenuIndex];
        if (selectedItem.Element.id == 'NewGameText') { $.NewGame(); }
        else if (selectedItem.Element.id == 'SavedGameText') { $.SavedGame(); }
        else if (selectedItem.Element.id == 'OptionsText') { $.Options(); }
        else if (selectedItem.Element.id == 'MainWebsiteText') { window.location = ''; }
    }
};

$.GameMenuTick = function () {
    var selectedItem = $.MenuTexts[$.SelectedMenuIndex];

    // TODO:
    // Animate selected item
    // Gradually grow and shrink text size.
};

$.NewGame = function () {
    $.IsNewGame = true;
    $.SetGameState($.StateNames.GameLoad);
    $.Menu.style.visibility = 'hidden';
};

$.SavedGame = function () {
    $.IsNewGame = false;
    $.SetGameState($.StateNames.GameLoad);
    $.Menu.style.visibility = 'hidden';
};

$.Options = function () {
    // TODO:
    // Show options
};


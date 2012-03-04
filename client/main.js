jQuery(document).ready(function () {
    var socket = io.connect('/builder');
    var resources = resourceManager({});
    
    var spells = spellList({
        'socket': socket,
    });
    resources.load(spells);
    
    var opponent = player({
        'socket': socket,
    });
    resources.load(opponent);
    
    var actions = [];
    actions.push({
        'left': "D",
        'right': "F",
    });
    actions.push({
        'left': "P",
        'right': "F",
    });
    actions.push({
        'left': "P",
        'right': "F",
        'spells': [
            {
                'name': "Amnesia",
                'hand': "left",
            },
            {
                'name': "Paralysis",
                'hand': "right",
            },
        ],
    });
    
    resources.onLoad(function () {
        console.log("Connected");
        socket.emit('ready', actions.shift());
    });
});

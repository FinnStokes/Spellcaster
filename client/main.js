jQuery(document).ready(function () {
    var resources = resourceManager({});
    var socket = io.connect();
    
    var spells = spellList({
        'socket': socket,
    });
    resources.load(spells);

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
        console.log("Loaded");
        socket.on('opponent connected', function () {
            console.log("Connected");
            socket.emit('ready', actions.shift());
        });
        socket.on('new turn', function () {
            socket.emit('ready', actions.shift());
        });
        socket.emit('find opponent');
    });
});

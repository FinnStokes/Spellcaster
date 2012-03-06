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
    
    var next = {};
    var playerActions = [];
    var opponentActions = [];
    
    $('#message').append("Loading... ");
    resources.onLoad(function () {
        $('#message').append("Done <br />");
        $('#message').append("Connecting... ");
        socket.on('opponent connected', function () {
            $('#message').append("Done <br />");
            $('#game').removeClass('hidden');
        });
        socket.on('new turn', function (otherNext) {
            playerActions.push(next);
            $('#playerLeft').append(next.left);
            $('#playerRight').append(next.right);
            opponentActions.push(otherNext);
            $('#opponentLeft').append(otherNext.left);
            $('#opponentRight').append(otherNext.right);
            next = actions.shift();
            socket.emit('ready', next);
        });
        socket.emit('find opponent');
    });
});

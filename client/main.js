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
    
    var ready = false;
    
    $('#message').append("Loading... ");
    resources.onLoad(function () {
        $('#message').append("Done <br />");
        $('#message').append("Connecting... ");
        socket.on('opponent connected', function () {
            $('#message').append("Done <br />");
            $('#game').removeClass('hidden');
            
            var toggleReady = function () {
                ready = !ready;
                $('#actionForm').children().each(function () {
                    $(this).disabled = ready;
                });
                $('#readyButton').disabled = false;
                if (ready) {
                    console.log("ready");
                    $('#readyButton').value = "Cancel";
                    next = actions.shift();
                    socket.emit('ready', next);
                } else { 
                    console.log("unready");
                    $('#readyButton').value = "Ready";
                    socket.emit('unready');
                }
            }
            $('readyButton').onpress = toggleReady;
            socket.on('new turn', function (otherNext) {
                playerActions.push(next);
                $('#playerLeft').append(next.left);
                $('#playerRight').append(next.right);
                opponentActions.push(otherNext);
                $('#opponentLeft').append(otherNext.left);
                $('#opponentRight').append(otherNext.right);
                if (ready) {
                    toggleReady();
                }
            });
        });
        socket.emit('find opponent');
    });
});

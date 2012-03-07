jQuery(document).ready(function () {
    var resources = resourceManager({});
    var socket = io.connect();
    
    var spells = spellList({
        'socket': socket,
    });
    resources.load(spells);
    
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

            var form = $('#actionForm');
            var readyButton = form.children('input[name="ready"]');
            
            var toggleReady = function () {
                ready = !ready;
                form.children().each(function () {
                    $(this).attr('disabled', ready);
                });
                readyButton.attr('disabled', false);
                if (ready) {
                    console.log("ready");
                    readyButton.attr('value', "Cancel");
                    next.left = form.children('input[name="left"]:checked').val();
                    next.right = form.children('input[name="right"]:checked').val();
                    socket.emit('ready', next);
                } else { 
                    console.log("unready");
                    readyButton.attr('value', "Ready");
                    socket.emit('unready');
                }
            }
            readyButton.bind('click', toggleReady);
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

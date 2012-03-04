var player = function(spec, my) {
    var that, connected;
    my = my || {};
    
    that = {};
    
    connected = false;
    
    that.load = function (callback) {
        spec.socket.on('connected', function () {
            connected = true;
            callback();
        });
    }

    that.loaded = function () {
        return connected;
    };
    
    return that;
};
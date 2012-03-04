var spellList = function (spec, my) {
    var that, spells;
    my = my || {};
    
    that = {};
    
    that.load = function (callback) {
        spec.socket.emit('get spell list');
        spec.socket.on('spell list', function (list) {
            spells = list;
            callback();
        });
    }
    
    that.loaded = function () {
        return !!spells;
    }
    
    return that;
}
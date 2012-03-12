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
    
    var checkAction = function (target, main, off) {
        if (!target || !main || !off) {
            return false;
        }
        var action = target.toUpperCase();
        if (action != target || action == "C") {
            return (action == main && action == off);
        } else {
            return (action == main);
        }
    }
    
    var castable = function (mainHand, offHand) {
        var list = [];
        for (i in spells) {
            var spell = spells[i];
            for (var offset = 0; offset < spell.actions.length-1; offset++) {
                var mainStart = mainHand.length - (spell.actions.length-offset);
                var offStart = mainHand.length - (spell.actions.length-offset);
                if (mainStart < 0 || offStart < 0) {
                    continue;
                }
                var action;
                for (action = 0; action < spell.actions.length-offset; action++;) {
                    if (!checkAction(spell.actions.charAt(action), mainHand[mainStart+action], offHand[offStart+action])) {
                        break;
                    }
                }
                if (action == spell.actions.length-offset) {
                    list.push({
                        'spell': spell, 
                        'incomplete': offset,
                    });
                }
            }
        }
        return list;
    }
    
    that.castable = function (player) {
        return {
            'left': castable(player.actions.left, player.actions.right),
            'right': castable(player.actions.left, player.actions.right),
        }
    }
    
    return that;
};

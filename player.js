var spell = require("./spell.js");

var LEGAL_ACTIONS = /^[FPSWDC ^]$/;

var queue = null;

exports.create = function(spec,my) {
    var that, next;
    my = my || {};

    my.actions = {'left': [], 'right': []};
    my.opponent = null;
    
    that = {};
    
    that.setOpponent = function (opponent) {
        my.opponent = opponent;
        spec.socket.emit('opponent connected');
    }
    
    that.ready = function () {
        return !!next;
    }

    that.newTurn = function (otherNext) {
        spec.socket.emit('new turn', otherNext);
        my.actions.left.push(next.left);
        my.actions.right.push(next.right);
        var temp = next;
        next = null;
        return temp;
    }
    
    my.isValid = function (action) {
        if ((typeof action.left != 'string') || !(action.left.match(LEGAL_ACTIONS))) {
            return false
        }
        if ((typeof action.right != 'string') || !(action.right.match(LEGAL_ACTIONS))) {
            return false
        }
        if (action.spells) {
            if (action.spells.left) {
                var s = spell.serverList[action.spells.left.name];
                if (!s || (s.twoHanded() && action.spells.right) || !s.castable('left',action,my.actions)) {
                    return false;
                }
            }
            if (action.spells.right) {
                var s = spell.serverList[action.spells.right.name];
                if (!s || (s.twoHanded() && action.spells.left) || !s.castable('right',action,my.actions)) {
                    return false;
                }
            }
        }
        
        return true;
    }
    
    my.isCastable = function (spell, actions, last) {
        var first = actions.length - spell.length + 1;
        var i;
        for (i = 0; i < spell.length - 1; i++) {
            if (spell[i] !== actions[first+i]) {
                return false;
            }
        }
        if (spell[i] !== last) {
            return false;
        }
        return true;
    }
    
    spec.socket.on('find opponent', function () {
        if (queue) {
            that.setOpponent(queue);
            queue.setOpponent(that);
            queue = null;
        } else {
            queue =  that
        }
    });
    
    spec.socket.on('ready', function (action) {
        if (action && !my.isValid(action)) {
            spec.socket.emit('error', "Invalid action");
            return;
        }
        
        next = action;
        
        if (that.ready() && my.opponent.ready()) {
            next = my.opponent.newTurn(next);
            that.newTurn(next);
        }
    });
    
    spec.socket.on('unready', function () {
        next = null;
    });
    
    spec.socket.emit('connected');

    return that;
}

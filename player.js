var game = require('./game');

var SPELL_LIST = [
    "Dispel magic",
    "Summon elemental",
    "Magic mirror",
    "Lightning bolt",
    "Cure heavy wounds",
    "Cure light wounds",
    "Amnesia",
    "Confusion",
    "Disease",
    "Blindness",
    "Delayed effect",
    "Raise dead",
    "Poison",
    "Paralysis",
    "Summon troll",
    "Fireball",
    "Shield",
    "Surrender",
    "Remove enchantment",
    "Invisibility",
    "Charm monster",
    "Charm person",
    "Summon ogre",
    "Finger of death",
    "Haste",
    "Missile",
    "Summon goblin",
    "Anti-spell",
    "Permanency",
    "Time stop",
    "Resist cold",
    "Fear",
    "Fire storm",
    "Lightning bolt 2",
    "Cause light wounds",
    "Summon giant",
    "Cause heavy wounds",
    "Counter-spell",
    "Ice storm",
    "Resist heat",
    "Protection from evil",
    "Counter-spell 2",
];

exports.create = function(spec,my) {
    var that, next;
    my = my || {};

    my.actions = {'left': [], 'right': []};
    my.opponent = null;
    
    that = {};
    
    that.findOpponent = function (queue) {
        if (queue) {
            var g = game.create({
                'player1': queue,
                'player2': that,
            });
            that.setOpponent(g);
            queue.setOpponent(g);
            return null;
        } else {
            return that
        }
    }
    
    that.setOpponent = function (opponent) {
        my.opponent = opponent;
        spec.socket.emit('connected');
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
        if ((typeof action.left != 'string') || !(action.left.match(/^[FPSWDCfpswdc ^]$/))) {
            return false
        }
        if ((typeof action.right != 'string') || !(action.right.match(/^[FPSWDCfpswdc ^]$/))) {
            return false
        }
        if (action.spells) {
            for (var i = 0; i < action.spells.length; i++) {
                var spell = SPELL_LIST.indexOf(action.spells[i].name);
                if (spell === -1) {
                    return false;
                }
                if (action.spells[i].hand !== "left" && action.spells[i].hand !== "right") {
                    return false;
                }
                if (!my.isCastable(SPELL_ACTIONS[id], my.actions[action.spells[i].hand], action[action.spells[i].hand])) {
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
    
    spec.socket.on('ready', function (action) {
        if (action && !my.isValid(action)) {
            spec.socket.emit('error', "Invalid action");
            return;
        }
        
        next = action;
        
        if (that.ready() && my.opponent.ready()) {
            next = opponent.newTurn(next);
            that.newTurn(next);
        }
    });
    
    spec.socket.on('unready', function () {
        next = null;
    });

    return that;
}

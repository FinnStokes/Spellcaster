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

var SPELL_ACTIONS = [
    "CDPW",
    "CSWWS",
    "Cw",
    "DFFDD",
    "DFPW",
    "DFW",
    "DPP",
    "DSF",
    "DSFFFC",
    "DWFFd",
    "DWSSSP",
    "DWWFWC",
    "DWWFWD",
    "FFF",
    "FPSFW",
    "FSSDD",
    "P",
    "p",
    "PDWP",
    "PPws",
    "PSDD",
    "PSDF",
    "PSFW",
    "PWPFSSSD",
    "PWPWWC",
    "SD",
    "SFW",
    "SPF",
    "SPFPSDW",
    "SPPC",
    "SSFP",
    "SWD",
    "SWWC",
    "WDDC",
    "WFP",
    "WFPSFW",
    "WPFD",
    "WPP",
    "WSSC",
    "WWFP",
    "WWP",
    "WWS",
];

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
                if (!my.isCastable(SPELL_ACTIONS[spell], my.actions[action.spells[i].hand], action[action.spells[i].hand])) {
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
        console.log("Find opponent:")
        if (queue) {
            console.log("Found")
            that.setOpponent(queue);
            queue.setOpponent(that);
            queue = null;
        } else {
            console.log("Waiting...")
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

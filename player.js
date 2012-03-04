var SPELLS = {
    'Dispel magic': spell.create({
        'actions': "CDPW",
    }),
    'Summon elemental': spell.create({
        'actions': "CSWWS",
    }),
    'Magic mirror': spell.create({
        'actions': "Cw",
    }),
    'Lightning bolt': spell.create({
        'actions': "DFFDD",
    }),
    'Cure heavy wounds': spell.create({
        'actions': "DFPW",
    }),
    'Cure light wounds': spell.create({
        'actions': "DFW",
    }),
    'Amnesia': spell.create({
        'actions': "DPP",
    }),
    'Confusion': spell.create({
        'actions': "DSF",
    }),
    'Disease': spell.create({
        'actions': "DSFFFC",
    }),
    'Blindness': spell.create({
        'actions': "DWFFd",
    }),
    'Delayed effect': spell.create({
        'actions': "DWSSSP",
    }),
    'Raise dead': spell.create({
        'actions': "DWWFWC",
    }),
    'Poison': spell.create({
        'actions': "DWWFWD",
    }),
    'Paralysis': spell.create({
        'actions': "FFF",
    }),
    'Summon troll': spell.create({
        'actions': "FPSFW",
    }),
    'Fireball': spell.create({
        'actions': "FSSDD",
    }),
    'Shield': spell.create({
        'actions': "P",
    }),
    'Surrender': spell.create({
        'actions': "p",
    }),
    'Remove enchantment': spell.create({
        'actions': "PDWP",
    }),
    'Invisibility': spell.create({
        'actions': "PPws",
    }),
    'Charm monster': spell.create({
        'actions': "PSDD",
    }),
    'Charm person': spell.create({
        'actions': "PSDF",
    }),
    'Summon ogre': spell.create({
        'actions': "PSFW",
    }),
    'Finger of death': spell.create({
        'actions': "PWPFSSSD",
    }),
    'Haste': spell.create({
        'actions': "PWPWWC",
    }),
    'Missile': spell.create({
        'actions': "SD",
    }),
    'Summon goblin': spell.create({
        'actions': "SFW",
    }),
    'Anti-spell': spell.create({
        'actions': "SPF",
    }),
    'Permanency': spell.create({
        'actions': "SPFPSDW",
    }),
    'Time stop': spell.create({
        'actions': "SPPC",
    }),
    'Resist cold': spell.create({
        'actions': "SSFP",
    }),
    'Fear': spell.create({
        'actions': "SWD",
    }),
    'Fire storm': spell.create({
        'actions': "SWWC",
    }),
    'Lightning bolt 2': spell.create({
        'actions': "WDDC",
    }),
    'Cause light wounds': spell.create({
        'actions': "WFP",
    }),
    'Summon giant': spell.create({
        'actions': "WFPSFW",
    }),
    'Cause heavy wounds': spell.create({
        'actions': "WPFD",
    }),
    'Counter-spell': spell.create({
        'actions': "WPP",
    }),
    'Ice storm': spell.create({
        'actions': "WSSC",
    }),
    'Resist heat': spell.create({
        'actions': "WWFP",
    }),
    'Protection from evil': spell.create({
        'actions': "WWP",
    }),
    'Counter-spell 2': spell.create({
        'actions': "WWS",
    }),
};

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
                var s = SPELLS[action.spells.left.name];
                if (!s || (s.twoHanded() && action.spells.right) || !s.castable('left',action,my.actions)) {
                    return false;
                }
            }
            if (action.spells.right) {
                var s = SPELLS[action.spells.right.name];
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

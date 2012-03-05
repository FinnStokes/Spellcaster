exports.create = function(spec,my) {
    var that, next;
    my = my || {};
    
    that = {};
    
    var checkAction = function (hand, target, actual) {
        if (!hand || !target || !actual) {
            return false;
        }
        var action = target.toUpperCase();
        if (action != target || action == "C") {
            return (action == actual['left'] && action == actual['right']);
        } else {
            return (action == actual[hand]);
        }
    }
    
    that.castable = function (hand, current, past) {
        if (hand !== 'left' && hand !== 'right') {
            return false;
        }
        for (var i = 0; i < spec.actions.length-1; i++) {
            if (!checkAction(hand, spec.actions.charAt(i), past[past.length + i - (spec.actions.length - 1)])) {
                return false;
            }
        }
        return checkAction(hand, spec.actions.charAt(i), current);
    };
    
    that.twoHanded = function () {
        var last = spec.actions.charAt(spec.actions.length-1)
        return (last.toUpperCase() != last);
    }
    
    return that;
};

exports.addSpell = function (spec) {
    exports.serverList[spec.name] = exports.create(spec);
    exports.clientList[spec.name] = spec;
};

exports.serverList = {};
exports.clientList = {};

exports.addSpell({
    'name': 'Dispel magic',
    'actions': "CDPW",
});
exports.addSpell({
    'name': 'Summon elemental',
    'actions': "CSWWS",
});
exports.addSpell({
    'name': 'Magic mirror',
    'actions': "Cw",
});
exports.addSpell({
    'name': 'Lightning bolt',
    'actions': "DFFDD",
});
exports.addSpell({
    'name': 'Cure heavy wounds',
    'actions': "DFPW",
});
exports.addSpell({
    'name': 'Cure light wounds',
    'actions': "DFW",
});
exports.addSpell({
    'name': 'Amnesia',
    'actions': "DPP",
});
exports.addSpell({
    'name': 'Confusion',
    'actions': "DSF",
});
exports.addSpell({
    'name': 'Disease',
    'actions': "DSFFFC",
});
exports.addSpell({
    'name': 'Blindness',
    'actions': "DWFFd",
});
exports.addSpell({
    'name': 'Delayed effect',
    'actions': "DWSSSP",
});
exports.addSpell({
    'name': 'Raise dead',
    'actions': "DWWFWC",
});
exports.addSpell({
    'name': 'Poison',
    'actions': "DWWFWD",
});
exports.addSpell({
    'name': 'Paralysis',
    'actions': "FFF",
});
exports.addSpell({
    'name': 'Summon troll',
    'actions': "FPSFW",
});
exports.addSpell({
    'name': 'Fireball',
    'actions': "FSSDD",
});
exports.addSpell({
    'name': 'Shield',
    'actions': "P",
});
exports.addSpell({
    'name': 'Surrender',
    'actions': "p",
});
exports.addSpell({
    'name': 'Remove enchantment',
    'actions': "PDWP",
});
exports.addSpell({
    'name': 'Invisibility',
    'actions': "PPws",
});
exports.addSpell({
    'name': 'Charm monster',
    'actions': "PSDD",
});
exports.addSpell({
    'name': 'Charm person',
    'actions': "PSDF",
});
exports.addSpell({
    'name': 'Summon ogre',
    'actions': "PSFW",
});
exports.addSpell({
    'name': 'Finger of death',
    'actions': "PWPFSSSD",
});
exports.addSpell({
    'name': 'Haste',
    'actions': "PWPWWC",
});
exports.addSpell({
    'name': 'Missile',
    'actions': "SD",
});
exports.addSpell({
    'name': 'Summon goblin',
    'actions': "SFW",
});
exports.addSpell({
    'name': 'Anti-spell',
    'actions': "SPF",
});
exports.addSpell({
    'name': 'Permanency',
    'actions': "SPFPSDW",
});
exports.addSpell({
    'name': 'Time stop',
    'actions': "SPPC",
});
exports.addSpell({
    'name': 'Resist cold',
    'actions': "SSFP",
});
exports.addSpell({
    'name': 'Fear',
    'actions': "SWD",
});
exports.addSpell({
    'name': 'Fire storm',
    'actions': "SWWC",
});
exports.addSpell({
    'name': 'Lightning bolt 2',
    'actions': "WDDC",
});
exports.addSpell({
    'name': 'Cause light wounds',
    'actions': "WFP",
});
exports.addSpell({
    'name': 'Summon giant',
    'actions': "WFPSFW",
});
exports.addSpell({
    'name': 'Cause heavy wounds',
    'actions': "WPFD",
});
exports.addSpell({
    'name': 'Counter-spell',
    'actions': "WPP",
});
exports.addSpell({
    'name': 'Ice storm',
    'actions': "WSSC",
});
exports.addSpell({
    'name': 'Resist heat',
    'actions': "WWFP",
});
exports.addSpell({
    'name': 'Protection from evil',
    'actions': "WWP",
});
exports.addSpell({
    'name': 'Counter-spell 2',
    'actions': "WWS",
});

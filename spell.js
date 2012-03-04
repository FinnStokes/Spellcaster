exports.create =  = function(spec,my) {
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

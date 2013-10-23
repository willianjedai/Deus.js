var NB = window.NB || {};
NB.Behaviors = {};
NB.Lang = {};

var instantFn = function (el) {
    var that = $(el);
    var behaviors = that.attr('data-fn');

    $.each(behaviors.split(" "), function (index, behaviorName) {
        try {
            var BehaviorsClass = NB.Behaviors[behaviorName];
            var initializedBehavior = new BehaviorsClass(that);
            that.data('inst' + behaviorName, initializedBehavior);
        }
        catch (e) {
            console.log(el);
            console.log('Erro', e);
        }
    });
}

NB.LoadBehavior = function (context) {
    if (context === undefined)
        context = $(document);

    if (typeof context.data('fn') !== 'undefined')
        instantFn(context);

    context.find('*[data-fn]').each(function (i) {
        instantFn(this);
    });
};

NB.onReady = function () {
    NB.LoadBehavior();
};

$(document).ready(function () {
    NB.onReady();
});
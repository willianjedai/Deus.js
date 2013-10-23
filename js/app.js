var NB = window.NB || {};
NB.Behaviors = {};
NB.Lang = {};
NB.Breakpoints = {
    small: 450,
    large: 758
};

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
            // Nenhuma operação
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

NB.instant = function (that, behaviorName) {
    try {
        var BehaviorsClass = NB.Behaviors[behaviorName];
        var initializedBehavior = new BehaviorsClass(that);
        that.data('inst' + behaviorName, initializedBehavior);
    }
    catch (e) {
        console.log(this);
        console.log('Erro', e);
        // Nenhuma operação
    }
};

NB.onReady = function () {
    //NB.Lang = lang;
    //if (Modernizr.borderradius)
    //    NB.loadCss('/Css/Border.css');

    NB.LoadBehavior();

    if ($.browser.msie)
        $('html').addClass('ie' + $.browser.version);

    if (!Modernizr.placeholder)
        $('input, textarea').placeholder();

    //$('form').on('submit', function (e) {
    //    e.preventDefault();
    //});

};

var ie = false;
$(document).ready(function () {
    NB.onReady();
});

/* TEMP */

function MoreNews(pWidget) {
    $.colorbox({
        href: '/NewsList.aspx?WidgetId=' + pWidget,
        height: '90%',
        width: '90%'
        /* iframe: true */
    });
}

function FilterWidget(pCategory) {
    $("#txtFilterWidget").val(pCategory);
    __doPostBack('lnkFilterWidget', '');
}

/* function LoadWidgetContent(pContainer, pWidgetId, pKeyworkObj, pPage) { 
HARD CODE FOR NOW
*/
function LoadWidgetContent(pWidgetId, pPage, pSearch) {
    $('.hold-news').load('/Services/GetFeedContent.aspx?WidgetId=' + pWidgetId + '&Page=' + pPage + '&Search=' + pSearch);
}

/* TEMP */
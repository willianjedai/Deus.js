NB.Behaviors.alert = function (that) {
    var param = that.data('param') || {};
    var methods = this;

    this.init = function () {
        that.on('click.alert', function(e) {
            e.preventDefault();
            alert(param.msg);
        });
    };
    methods.init();
};

NB.Behaviors.alert.param = 'msg';
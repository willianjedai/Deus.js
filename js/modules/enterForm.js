NB.Behaviors.enterForm = function (that) {
    var param = that.data('param') || {};
    var methods = this;

    this.init = function () {
        that.on('keydown', function(e) {
            if(e.which === 13) {
                e.preventDefault();
                that.find(param.submit).trigger('click');
            }
        });
    };
    methods.init();

};

NB.Behaviors.enterForm.param = 'submit';
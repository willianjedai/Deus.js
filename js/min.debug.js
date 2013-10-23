/*! http://mths.be/placeholder v2.0.7 by @mathias */
;(function(window, document, $) {

	var isInputSupported = 'placeholder' in document.createElement('input');
	var isTextareaSupported = 'placeholder' in document.createElement('textarea');
	var prototype = $.fn;
	var valHooks = $.valHooks;
	var propHooks = $.propHooks;
	var hooks;
	var placeholder;

	if (isInputSupported && isTextareaSupported) {

		placeholder = prototype.placeholder = function() {
			return this;
		};

		placeholder.input = placeholder.textarea = true;

	} else {

		placeholder = prototype.placeholder = function() {
			var $this = this;
			$this
				.filter((isInputSupported ? 'textarea' : ':input') + '[placeholder]')
				.not('.placeholder')
				.bind({
					'focus.placeholder': clearPlaceholder,
					'blur.placeholder': setPlaceholder
				})
				.data('placeholder-enabled', true)
				.trigger('blur.placeholder');
			return $this;
		};

		placeholder.input = isInputSupported;
		placeholder.textarea = isTextareaSupported;

		hooks = {
			'get': function(element) {
				var $element = $(element);

				var $passwordInput = $element.data('placeholder-password');
				if ($passwordInput) {
					return $passwordInput[0].value;
				}

				return $element.data('placeholder-enabled') && $element.hasClass('placeholder') ? '' : element.value;
			},
			'set': function(element, value) {
				var $element = $(element);

				var $passwordInput = $element.data('placeholder-password');
				if ($passwordInput) {
					return $passwordInput[0].value = value;
				}

				if (!$element.data('placeholder-enabled')) {
					return element.value = value;
				}
				if (value == '') {
					element.value = value;
					// Issue #56: Setting the placeholder causes problems if the element continues to have focus.
					if (element != document.activeElement) {
						// We can't use `triggerHandler` here because of dummy text/password inputs :(
						setPlaceholder.call(element);
					}
				} else if ($element.hasClass('placeholder')) {
					clearPlaceholder.call(element, true, value) || (element.value = value);
				} else {
					element.value = value;
				}
				// `set` can not return `undefined`; see http://jsapi.info/jquery/1.7.1/val#L2363
				return $element;
			}
		};

		if (!isInputSupported) {
			valHooks.input = hooks;
			propHooks.value = hooks;
		}
		if (!isTextareaSupported) {
			valHooks.textarea = hooks;
			propHooks.value = hooks;
		}

		$(function() {
			// Look for forms
			$(document).delegate('form', 'submit.placeholder', function() {
				// Clear the placeholder values so they don't get submitted
				var $inputs = $('.placeholder', this).each(clearPlaceholder);
				setTimeout(function() {
					$inputs.each(setPlaceholder);
				}, 10);
			});
		});

		// Clear placeholder values upon page reload
		$(window).bind('beforeunload.placeholder', function() {
			$('.placeholder').each(function() {
				this.value = '';
			});
		});

	}

	function args(elem) {
		// Return an object of element attributes
		var newAttrs = {};
		var rinlinejQuery = /^jQuery\d+$/;
		$.each(elem.attributes, function(i, attr) {
			if (attr.specified && !rinlinejQuery.test(attr.name)) {
				newAttrs[attr.name] = attr.value;
			}
		});
		return newAttrs;
	}

	function clearPlaceholder(event, value) {
		var input = this;
		var $input = $(input);
		if (input.value == $input.attr('placeholder') && $input.hasClass('placeholder')) {
			if ($input.data('placeholder-password')) {
				$input = $input.hide().next().show().attr('id', $input.removeAttr('id').data('placeholder-id'));
				// If `clearPlaceholder` was called from `$.valHooks.input.set`
				if (event === true) {
					return $input[0].value = value;
				}
				$input.focus();
			} else {
				input.value = '';
				$input.removeClass('placeholder');
				input == document.activeElement && input.select();
			}
		}
	}

	function setPlaceholder() {
		var $replacement;
		var input = this;
		var $input = $(input);
		var id = this.id;
		if (input.value == '') {
			if (input.type == 'password') {
				if (!$input.data('placeholder-textinput')) {
					try {
						$replacement = $input.clone().attr({ 'type': 'text' });
					} catch(e) {
						$replacement = $('<input>').attr($.extend(args(this), { 'type': 'text' }));
					}
					$replacement
						.removeAttr('name')
						.data({
							'placeholder-password': $input,
							'placeholder-id': id
						})
						.bind('focus.placeholder', clearPlaceholder);
					$input
						.data({
							'placeholder-textinput': $replacement,
							'placeholder-id': id
						})
						.before($replacement);
				}
				$input = $input.removeAttr('id').hide().prev().attr('id', id).show();
				// Note: `$input[0] != input` now!
			}
			$input.addClass('placeholder');
			$input[0].value = $input.attr('placeholder');
		} else {
			$input.removeClass('placeholder');
		}
	}

}(this, document, jQuery));

// var replaceString = function (str, args) {
//     return str.replace(/\{{(\w+)\}}/g, function (s, key) {
//         return args[key] || s;
//     });
// };

// // Calcula tamanho do box com padding e margens
// var calcRealBox = function($el) {
//     return {
//         height: $el.outerHeight() + parseInt($el.css('margin-top'), 10) + parseInt($el.css('margin-bottom'), 10) + parseInt($el.css('border-top-width'), 10) + parseInt($el.css('border-bottom-width'), 10),
//         widht: $el.outerWidth() + parseInt($el.css('margin-left'), 10) + parseInt($el.css('margin-right'), 10) + parseInt($el.css('border-left-width'), 10) + parseInt($el.css('border-right-width'), 10)
//     };
// };

// // Scrolla o box para a esquerda
// var scrollToLeft = function ($box, offsetLeft) {
//     $box.stop(true, false).animate({
//         scrollLeft: offsetLeft
//     }, 500);
// };

// // Retorna a diferenca entre duas datas conforme o tipo solicitado (month/day/year hh:mm:ss)
// var datediff = function (fromDate, toDate, interval) {
//     var second = 1000, minute = second * 60, hour = minute * 60, day = hour * 24, week = day * 7;
//     fromDate = new Date(fromDate);
//     toDate = new Date(toDate);
//     var timediff = toDate - fromDate;
//     if (isNaN(timediff)) return NaN;
//     switch (interval) {
//         case "years": return toDate.getFullYear() - fromDate.getFullYear();
//         case "months": return (
//                         (toDate.getFullYear() * 12 + toDate.getMonth()) -
//                         (fromDate.getFullYear() * 12 + fromDate.getMonth())
//                     );
//         case "weeks": return Math.floor(timediff / week);
//         case "days": return Math.floor(timediff / day);
//         case "hours": return Math.floor(timediff / hour);
//         case "minutes": return Math.floor(timediff / minute);
//         case "seconds": return Math.floor(timediff / second);
//         default: return undefined;
//     }
// };

// //Transforma o segundos em formato de horario 
// var convertTime = function(sec) {
//     var sec_numb = parseInt(sec, 10);
//     var hours = Math.floor(sec_numb / 3600);
//     var minutes = Math.round((sec_numb - (hours * 3600)) / 60);
//     var seconds = sec_numb - (hours * 3600) - (minutes * 60);
    
//     if (hours < 10) { hours = "0" + hours; }
//     if (minutes < 10) { minutes = "0" + minutes; }
//     if (seconds < 10) { seconds = "0" + seconds; }
    
//     var time;
//     time = (hours != "00")? hours + 'h ': '';
//     time += (minutes != "00")? minutes + 'min': '';
//     return time;
// };

// //Transforma hora em segundos ex(05:20:15)
// var converHourToSec = function (hour) {
//     var time = hour.split(':');
//     var sec = (+time[0]) * 60 * 60 + (+time[1]) * 60 + (+time[2]);

//     return sec;
// };

// //Transforma segundo em data completa
// var converToDate = function (secs) {
//     var t = new Date();
//     t.setTime(secs*1000);
//     return t;
// };

// // Função está sendo usada no backend
// var triggerClick = function (elem) {
//     $(function () {
//         $(elem).trigger('click');
//     });
// };

// /****/
// /** Funcao para placeholder em browser antigos **/
// /****/
// var add = function() {
//     if ($(this).val() === '') {
//         $(this).val($(this).attr('placeholder')).addClass('placeholder');
//     }
// };

// var remove = function() {
//     if ($(this).val() === $(this).attr('placeholder')) {
//         $(this).val('').removeClass('placeholder');
//     }
// };
// var placeHolder = function () {
//     // Create a dummy element for feature detection
//     if (!('placeholder' in $('<input>')[0])) {

//         // Select the elements that have a placeholder attribute
//         $('input[placeholder], textarea[placeholder]').not('input[type=password]').blur(add).focus(remove).each(add);

//         // Remove the placeholder text before the form is submitted
//         $('form').submit(function () {
//             $(this).find('input[placeholder], textarea[placeholder]').not('input[type=password]').each(remove);
//         });
//     }
//     //Função que retorna os valores default dos campos input do formulário
//     $('form').find('input[type=password][placeholder]').each(function (i) {
//         var $this = $(this),
// 			valPlaceholder = $this.attr('placeholder'),
// 			idPlaceholder = "placeholder" + i,
// 			$label = $("<label class='placeholder show' id='" + idPlaceholder + "'>" + valPlaceholder + "</label>");
//         if (valPlaceholder !== '') {
//             $this.before($label).addClass(idPlaceholder).css({ position: 'relative', zIndex: 1 }).on({
//                 'focus setVal': function () {
//                     $label.hide().removeClass('show');
//                 },
//                 'blur removeVal': function (e) {
//                     if (!$label.hasClass('show') && $this.val() === '') {
//                         $label.show().addClass('show');
//                     }
//                 }
//             });

//             if ($label.height() < 1)
//                 $label.height(17);
//             $label.css({
//                 color: $this.css('color'),
//                 marginTop: parseInt($this.height() - $label.height(), 10) / 2,
//                 marginLeft: $this.css('padding-left'),
//                 fontSize: $this.css('font-size'),
//                 height: $label.height(),
//                 left: 0,
//                 position: 'absolute',
//                 overflow: 'hidden',
//                 cursor: 'text',
//                 zIndex: 3
//             }).data({
//                 width: $label.width()
//             }).on('click', function () {
//                 $this.focus();
//             });

//             if ($this.val() !== '')
//                 $label.css({ width: 0 }).removeClass('show');

//         }
//     });
// };
// /****/
// /** FIM - Funcao para placeholder em browser antigos **/
// /****/

// // Trigger click caso haja hash na página
// var clickHash = function () {
//     var hash = window.location.hash;

//     if (typeof hash !== 'undefined') {
//         var elem = $(hash);

//         if (elem.length > 0)
//             elem.trigger('click');
//     }
// };

// $(function () {
//     if (!Modernizr.placeholder)
//         placeHolder();


//     document.onreadystatechange = function () {
//         if (document.readyState == "complete") {
//             clickHash();
//         }
//     };

//     //$('form')[0].reset();
// });

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
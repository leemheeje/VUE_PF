/*
* 호출할때, 
$(target).customScrollBar();
<div class="target">
    <div>내용내용</div>
</div>
*/
;
(function($) {
    $.fn.extend({
        customScrollBar: function(obj) {
            var defaults = {
                scrVal: {
                    num: 50,
                    callb: {
                        'duration': 300,
                        'easing': 'easeOutExpo',
                        'complete': function() {}
                    },
                },
                scrEl: {
                    bx: 'scr_wrap',
                    el: 'scr_bar',
                    btn: 'scr_btn',
                },
                drag: true,
            };

            function CustomScrollBar($this) {
                var _this = this;
                this.el = $this;
                this.scr = {
                    outw: $this.outerWidth(),
                    scrw: $this[0].clientWidth,
                    outh: $this.outerHeight(),
                    scrh: $this[0].scrollHeight,
                };
                this.scrClassName = {
                    wrap: 'scrWrap',
                    btn: 'scrBtn',
                    bar: 'scrBar',
                };
                this.html = '';
                this.obj = $.extend(true, defaults, obj);
                this.init();
            };
            CustomScrollBar.prototype = {
                init: function() {
                    if(this.scr.outw > this.scr.scrw) {
                        this.set();
                        this.bind();
                    } else {
                        this.el.closest('.' + this.scrClassName.wrap).find('.' + this.scrClassName.bar).hide();
                    }
                },
                set: function() {
                    var $this = this.el;
                    this.html = '<div class="' + this.obj.scrEl.el + ' ' + this.scrClassName.bar + '" ><span class="' + this.obj.scrEl.btn + ' ' + this.scrClassName.btn + '"></span></div>';
                    var scrBtnHei = (this.scr.outh / this.scr.scrh) * 100;
                    $this.closest('.' + this.scrClassName.wrap).find('.' + this.scrClassName.bar).show();
                    if(!$this.closest('.' + this.scrClassName.wrap).length) {
                        $this.wrap('<div class="' + this.obj.scrEl.bx + ' ' + this.scrClassName.wrap + '" style="width:' + this.scr.outw + 'px; overflow: hidden;"></div>').css({
                            'margin-right': -(this.scr.outw - this.scr.scrw),
                            'padding-right': this.scr.outw - this.scr.scrw,
                            'overflow-x': 'hidden'
                        });
                        $this.closest('.' + this.scrClassName.wrap).append(this.html);
                    }
                    $this.closest('.' + this.scrClassName.wrap).find('.' + this.scrClassName.btn).css('height', scrBtnHei + '%');
                },
                bind: function() {
                    var _this = this;
                    var $this = this.el;
                    var $thisWrap = $this.closest('.' + this.scrClassName.wrap);
                    var $thisBar = $thisWrap.find('.' + this.scrClassName.bar);
                    var $thisBtn = $thisWrap.find('.' + this.scrClassName.btn);
                    var vScrVal = 0;
                    var scrBarHei = Math.round($thisBar.height() - $thisBtn.height());
                    var scrInnerHei = $this.find('>*').height() - $this.height();
                    $this.scroll(function(e) {
                        var $thisScrTop = $(this).scrollTop();
                        var $thisScr = (scrBarHei * $thisScrTop) / scrInnerHei;
                        $thisBtn.css('top', $thisScr);
                    });
                    $thisBtn.mousedown(function() {
                        // $(window).scrollTop(0);
                    });
                    if(this.drag) {
                        $thisBtn.draggable({
                            scroll: false,
                            axis: "y",
                            containment: $thisBar[0],
                            drag: function() {
                                $top = Number($thisBtn.css('top').replace('px', ''));
                                vScrVal = Math.round((scrInnerHei * $top) / scrBarHei);
                                _this.el.scrollTop(vScrVal);
                            },
                        });
                    }
                },
                drag: function() {
                    var _this = this;
                },
            };
            this.each(function() {
                $.data(this, new CustomScrollBar($(this), obj));
            });
            return this;
        },
    });
})(jQuery);

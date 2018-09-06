/*
* 호출시 구문 
$('.button1').click(function() {
   $('[data-layerpop="tnvhtb"]').cmmLocLaypop({ 
       title: '타이틀112311', 
       width: 640, 
       targetBtnsName: ['aaaa', '확인'], 
       beforeCallback: function($el) {
       },
       afterCallback: function($el) {
       },
       submit: function($this) { 
           $this.cmmLocLaypop('close');
           $(this).cmmAlert({ 
               title: 'asdf', msg: 'asfasdfasdfasdfasfasdfasdf' 
           }); 
       }, 
       targetCustomBtnsName: [
           ['커스텀버튼1', 'asdf asdfasdf', function($button) {
               $(document).on('click' ,'.asdfasdf',function(){
                   console.log($(this));
               })
           }],
           ['커스텀버튼2', 'asdf asdfasdf12', function($button) {
               $(document).on('click' ,'.asdfasdf12',function(){
                   console.log($(this));
               })
           }]
       ]
   }); 
}); 

html : <div class="cmm_layerpop" data-layerpop="tnvhtb">내용</div>


* 오브젝트 default 
type: '',
align: ['center', 'center'], //['center' , 'center'] 배열에 css백그라운드 처럼 적용
width: 320, //너비적용
height: null, //그냥 주지않는게 편함
openAfterScroll: false, //팝업오픈 후 스크롤 막기 false 스크롤 안막기 true
title: '타이틀', //팝업 타이틀 
parentAddClass: '', //특정요소만 커스텀style 해야할때 추가
targetBtnsName: ['취소', '확인'], //버튼텍스트 [0][1] 인덱스 번호로 이벤트가 부여되니 순서 지켜야함
targetCustomBtnsName: null,
* 하단부에 추가적으로 노출되어야할 버튼
* [   [텍스트명, 클래스명, 함수명]    ]
['하단부 커스텀 버튼', 'asdf asdfasdf', function($button) {
    $(document).on('click' ,'.asdfasdf',function(){
        console.log($(this));
    })
}],
beforeCallback: null, //동적팝업이 형성되고, 시각화 되기전에 호출
afterCallback: null, //동적팝업이 형성되고, 시각화 되고 호출
submit: null, //확인버튼(targetBtnsName[1]) 클릭시 호출
closeCallb: null //x버튼, 취소버튼(targetBtnsName[2]) 클릭시 호출
*/
;
(function($) {
    $.fn.extend({
        cmmAlert: function(obj) {
            $('body').append('<span class="cmmAlert"></span>');
            $('.cmmAlert').cmmLocLaypop($.extend(true, {
                type: 'alert',
                title: '알림',
                targetBtnsName: ['확인'],
                msg: '',
                submit: function($el) {
                    $el.cmmLocLaypop('close');
                    $el.remove();
                },
                closeCallb: function($el) {
                    $el.cmmLocLaypop('close');
                    $el.remove();
                }
            }, obj));
        },
        cmmConfirm: function(obj) {
            $('body').append('<span class="cmmConfirm"></span>');
            $('.cmmConfirm').cmmLocLaypop($.extend(true, {
                type: 'confirm',
                title: '알림',
                targetBtnsName: ['취소', '확인'],
                msg: '',
                submit: function($el) {
                    $el.cmmLocLaypop('close');
                    $el.remove();
                },
                closeCallb: function($el) {
                    $el.cmmLocLaypop('close');
                    $el.remove();
                }
            }, obj));
        },
        cmmLocLaypop: function(obj) {
            var defaults = {
                type: '',
                align: ['center', 'center'], //['center' , 'center'] 배열에 css백그라운드 처럼 적용
                width: 320, //너비적용
                height: null, //그냥 주지않는게 편함
                openAfterScroll: false, //팝업오픈 후 스크롤 막기 false 스크롤 안막기 true
                title: '타이틀', //팝업 타이틀 
                parentAddClass: '', //특정요소만 커스텀style 해야할때 추가
                targetBtnsName: ['취소', '확인'], //버튼텍스트 [0][1] 인덱스 번호로 이벤트가 부여되니 순서 지켜야함
                targetCustomBtnsName: null,
                /*
                * 하단부에 추가적으로 노출되어야할 버튼
                * [   [텍스트명, 클래스명, 함수명]    ]
                ['하단부 커스텀 버튼', 'asdf asdfasdf', function($button) {
                    $(document).on('click' ,'.asdfasdf',function(){
                        console.log($(this));
                    })
                }],
                */
                beforeCallback: null, //동적팝업이 형성되고, 시각화 되기전에 호출
                afterCallback: null, //동적팝업이 형성되고, 시각화 되고 호출
                submit: null, //확인버튼(targetBtnsName[1]) 클릭시 호출
                closeCallb: null //x버튼, 취소버튼(targetBtnsName[2]) 클릭시 호출
            };

            function CmmLocLaypop($this) {
                var _this = this;
                this.target = $this;
                this.obj = typeof obj === 'object' ? $.extend(defaults, obj) : obj;
                this.dimmClsName = '.cmm_dimm';
                this.targetParent = '.laypopWarp';
                this.targetParentIn = '.laypopIn';
                this.targetTitle = '.laypopTit';
                this.targetTitleTxt = '.laypopTitTxt';
                this.targetCont = '.laypopCont';
                this.targetBottom = '.laypopBottom';
                this.targetBtns = ['.layClosebtn', '.laySmtbtn'];
                this.cont = '';
                this.title = '';
                this.bottom = '';
                this.init();
            };
            CmmLocLaypop.prototype = {
                init: function() {
                    if(this.obj == 'close') {
                        this.act().hide();
                        return;
                    }
                    this.set();
                    this.dimm().set();
                    this.act().show();
                    this.close();
                    this.submitFun();
                },
                set: function() {
                    this.cont += '<div class="' + this.clsFormat(this.targetParent) + ' ' + this.obj.parentAddClass + '">';
                    if(!this.obj.height) {
                        this.obj.height = 'auto';
                    } else {
                        this.obj.height = this.obj.height + 'px';
                    }
                    this.cont += '<div class="' + this.clsFormat(this.targetParentIn) + '" style="width: ' + this.obj.width + 'px; height : ' + this.obj.height + '">';
                    this.cont += '<div class="' + this.clsFormat(this.targetCont) + '">';
                    if(this.obj.type == 'alert' || this.obj.type == 'confirm') {
                        this.cont += '<div class="alert_msg">' + this.obj.msg + '</div>';
                    }
                    this.cont += '</div>';
                    this.cont += '</div>';
                    this.cont += '</div>';
                    this.title += '<div class="' + this.clsFormat(this.targetTitle) + '">';
                    this.title += '<span class="' + this.clsFormat(this.targetTitleTxt) + '">' + this.obj.title + '</span>';
                    this.title += '<a href="javascript: ;" class="' + this.clsFormat(this.targetBtns[0]) + '" title="팝업닫기"><span class="ti-close"></span></a>';
                    this.title += '</div>';
                    this.bottom += '<div class="' + this.clsFormat(this.targetBottom) + '">';
                    if(this.obj.type != 'alert') {
                        this.bottom += '<a href="javascript:;" class="' + this.clsFormat(this.targetBtns[0]) + '" title="팝업닫기">' + this.obj.targetBtnsName[0] + '</a>';
                        this.bottom += '<a href="javascript:;" class="' + this.clsFormat(this.targetBtns[1]) + '" title="확인">' + this.obj.targetBtnsName[1] + '</a>';
                    } else {
                        this.bottom += '<a href="javascript:;" class="' + this.clsFormat(this.targetBtns[1]) + '">' + this.obj.targetBtnsName[0] + '</a>';
                    }
                    this.bottom += '</div>';
                    if(!$(this.target).closest(this.targetParent).length) {
                        $(this.target).wrap(this.cont);
                        $(this.target).closest(this.targetParentIn).prepend(this.title);
                        $(this.target).closest(this.targetParentIn).append(this.bottom);
                        if(typeof this.obj.beforeCallback === 'function') {
                            this.obj.beforeCallback($(this.target));
                        }
                        //팝업 하단부 커스텀 버튼 생성
                        if(this.obj.targetCustomBtnsName && typeof this.obj.targetCustomBtnsName === 'object') {
                            for(var i = 0; i < this.obj.targetCustomBtnsName.length; i++) {
                                var clsn = this.obj.targetCustomBtnsName[i][1] ? this.obj.targetCustomBtnsName[i][1] : 'cst_btn';
                                var html = '<a href="javascript:;" class="' + clsn + '">' + this.obj.targetCustomBtnsName[i][0] + '</a>';
                                var $html = $(html);
                                console.log($html);
                                $(this.target).closest(this.targetParentIn).find(this.targetBottom).append(html);
                                if(typeof this.obj.targetCustomBtnsName[i][2] === 'function') {
                                    this.obj.targetCustomBtnsName[i][2]($html);
                                }
                            }
                        }
                        this.cont = '';
                        this.title = '';
                        this.bottom = '';
                    }
                    $(this.target).show();
                    $(this.target).closest(this.targetParent).hide();
                    this.alignFun();
                },
                alignFun: function() {
                    var _this = this;
                    var sc = {
                        val: $(document).scrollTop(),
                    };
                    var align = function($this) {
                        var v = null;
                        switch(_this.obj.align[0], _this.obj.align[1]) {
                            case 'center', 'center':
                                v = {
                                    'top': sc.val + ($(window).height() / 2) - ($this.outerHeight() / 2)
                                };
                                break;
                            case 'left', 'top':
                            case 'right', 'top':
                                v = {
                                    'top': sc.val + 50
                                };
                                break;
                        }
                        return v;
                    };
                    $(this.target).closest(this.targetParent).css(align($(this.target).closest(this.targetParent)));
                    if(typeof this.obj.afterCallback === 'function') {
                        this.obj.afterCallback($(this.target));
                    }
                },
                submitFun: function() {
                    var _this = this;
                    $(_this.target).closest(_this.targetParent).find(this.targetBtns[1]).off().on({
                        'click': function() {
                            if(typeof _this.obj.submit === 'function' && _this.obj.submit) {
                                _this.obj.submit($(this).closest(_this.targetParent));
                                if(_this.obj.type == 'alert' || _this.obj.type == 'confirm') {
                                    $(_this).closest(_this.targetParent).remove();
                                }
                            } else {
                                _this.act().hide();
                            }
                        }
                    });
                },
                scrLock: function(bool) {
                    if(!this.obj.openAfterScroll) {
                        if(bool) {
                            $('body').css({
                                'overflow-y': 'hidden'
                            });
                            $(this.target).closest(this.targetParent).find(this.dimmClsName).on('scroll mousemove touchmove touchstart', function(e) {
                                e.preventDefault();
                                e.stopPropagation();
                                return false;
                            });
                            $(this.target).closest(this.targetParent).on('touchmove', function(e) {
                                var cnt = true;
                                var lastY = 0;
                                if(e.originalEvent) {
                                    var currentY = e.originalEvent.touches[0].clientY;
                                    if(currentY != lastY) {
                                        cnt = false;
                                    }
                                    lastY = currentY;
                                }
                                return cnt;
                            });
                        } else {
                            $('body').css({
                                'overflow-y': 'visible'
                            });
                        }
                    }
                },
                close: function() {
                    var _this = this;
                    $(document).keyup(function() {
                        if(event.keyCode == 27) {
                            _this.act().hide();
                        }
                    });
                    $(_this.target).closest(_this.targetParent).find(this.targetBtns[0]).on({
                        'click': function() {
                            _this.act().hide();
                        }
                    });
                    $(_this.target).closest(_this.targetParent).find(this.dimmClsName).on({
                        'click': function() {
                            _this.act().hide();
                        }
                    });
                },
                act: function(bool) {
                    var _this = this;
                    return {
                        show: function() {
                            $(_this.target).closest(_this.targetParent).show();
                            _this.dimm().get(true);
                            _this.scrLock(true);
                        },
                        hide: function() {
                            $(_this.target).closest(_this.targetParent).hide();
                            _this.dimm().get(false);
                            _this.scrLock(false);
                            if(typeof _this.obj.closeCallb === 'function') {
                                _this.obj.closeCallb($(_this.target).closest(_this.targetParent));
                            }
                        }
                    };
                },
                dimm: function() {
                    var _this = this;
                    return {
                        set: function() {
                            $(_this.target).closest(_this.targetParent).append('<div class="' + _this.clsFormat(_this.dimmClsName) + '" style="display: none;"></div>');
                            $(_this.dimmClsName).css({
                                'position': 'fixed',
                                'z-index': 100,
                                'left': 0,
                                'top': 0,
                                'bottom': 0,
                                'width': '100%',
                                'opacity': 0,
                                'background': 'black'
                            });
                        },
                        get: function(bool, callb) {
                            if(bool) {
                                $(_this.target).closest(_this.targetParent).find(_this.dimmClsName).show().animate({
                                    'opacity': .2
                                }, $.extend({
                                    'complete': function() {}
                                }, callb));
                            } else {
                                $(_this.target).closest(_this.targetParent).find(_this.dimmClsName).animate({
                                    'opacity': 0
                                }, $.extend({
                                    'complete': function() {
                                        $(this).remove();
                                    }
                                }, callb));
                            }
                        },
                    };
                },
                aniCallb: function(obj) {
                    return $.extend({
                        'duration': 600,
                        'easing': 'swing',
                        'complete': function() {},
                        'step': function() {}
                    }, obj);
                },
                clsFormat: function(str) {
                    return str.replace('.', '');
                },
            };
            this.each(function() {
                $.data(this, new CmmLocLaypop($(this), obj));
            });
            return this;
        },
    });
})(jQuery);
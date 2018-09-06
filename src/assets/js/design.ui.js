;
(function($) {
    $.fn.extend({
        "cmmDataParse": function(url, callback) {
            var $this = $(this);
            $.getJSON(url, function(data) {
                if(typeof callback === "function") {
                    callback(data);
                }
            }).fail(function() {
                console.log('dataParseError');
            });
            return $this;
        },
        "cmmAsideLst": function(obj) {
            var $this = $(this);

            function AsideList(defaultss) {
                this.obj = $.extend(defaultss, obj);
                this.typingFunc = {
                    tar: '',
                    orgintxt: '',
                    txt: '',
                    loop: null
                }
                this.typingFuncBool = true;
                this.totallen = 0;
            };
            AsideList.prototype = {
                init: function() {
                    this.set();
                    this.bind();
                },
                set: function() {
                    var html = '';
                    for(var i = 0; i < this.obj.list.length; i++) {
                        html += '<ul class="lnb_list">';
                        html += '<li class="lst lst01">';
                        html += '<a href="javascript:;" class="mn lnbLink" data-list-num="' + i + '">';
                        html += '<span class="txt">' + this.obj.list[i].name + '</span>';
                        html += '<i class="num">' + this.obj.list[i].data.length + '</i>';
                        html += '</a>';
                        html += '</li>';
                        html += '</ul>';
                        $this.append(html);
                        html = '';
                    }
                },
                ext: function(oj) {
                    return $.extend(this.obj, oj);
                },
                bind: function() {
                    var _this = this;
                    $('.lnbLink').off().on({
                        'click': function() {
                            var listCnt = $(this).data('listNum');
                            $('.lnbLink').closest('li').removeClass('active');
                            $(this).closest('li').addClass('active');
                            _this.ext({
                                crrtListCnt: listCnt,
                                crrtTit: _this.obj.list[listCnt].name
                            });
                            _this.asideListGet($(this).data('listNum'));
                            $('.ssideHdTit').text(_this.obj.crrtTit);
                        }
                    });
                    if(!$('html').is('.mobile')) {
                        $('.container [data-list-num=0]').click();
                    } else {
                        $('[data-list-num=0]').click();
                    }
                },
                tagSpecFun: function(specmode) {
                    var mak = '';
                    var mode = specmode.split(',');
                    for(var i = 0; i < mode.length; i++) {
                        var cls = '';
                        var nm = '';
                        switch(mode[i]) {
                            case 'js':
                                cls = 'js';
                                nm = '자체제작JS';
                                break;
                            case 'res':
                                cls = 'res';
                                nm = '반응형';
                                break;
                            case 'cms':
                                cls = 'cms';
                                nm = 'CMS';
                                break;
                            case 'hyb':
                                cls = 'hyb';
                                nm = '하이브리드앱';
                                break;
                        }
                        cls ? mak += '<span class="s_label ' + cls + '">' + nm + '</span>' : '';
                    }
                    return mak;
                },
                asideListGet: function(cn) {
                    var _this = this;
                    var html = '';
                    $.each(_this.obj.list[cn].data, function(i, item) {
                        html += '<div class="lst">';
                        html += '<a href="javascript:;" class="item lnbsLink" data-list-snum="' + i + '">';
                        html += '<div class="item_bx">';
                        html += '<div class="img_area">';
                        html += '<i class="dot"></i>';
                        html += '<span class="img">';
                        html += ' <img src="' + item.thumbnail + '" alt="" /> ';
                        html += '</span>';
                        html += '</div>';
                        html += '<dl class="txt_list">';
                        html += '<dt>' + item.tit + '</dt>';
                        html += '<dd>';
                        if(item.detailsubj) {
                            html += '<span class="txt">' + item.detailsubj + '</span>';
                        } else {
                            html += '<span class="txt">' + _this.obj.nullTxt + '</span>';
                        }
                        html += '<div class="s_spec">';
                        html += _this.tagSpecFun(item.mode);
                        html += '</div>';
                        html += '</dd>';
                        html += '</dl>';
                        html += '</div>';
                        html += '</a>';
                        html += '</div>';
                    });
                    $('.sSideList').html(html);
                    html = '';
                    /*시컨스 인터벌 효과*/
                    _this.secInterval($('.container .lnbsLink[data-list-snum]').closest('.lst'), {
                        'margin-left': -50
                    }, {
                        'margin-left': 0
                    });
                    /* 스크롤바 호출*/
                    $('.subSideScrFun').customScrollBar();
                    _this.sbind();
                },
                secInterval: function($tar, to, from, timer, aniamteCallb, afterCallb) {
                    var loop = null;
                    var timer = timer ? timer : 100;
                    var lit = $tar.length;
                    var cnt = 0;
                    var aniamteCallb = aniamteCallb ? aniamteCallb : {
                        'duration': 300,
                        'easing': 'easeInOutExpo',
                        'complete': function() {}
                    };
                    $tar.css(to);
                    loop = setInterval(function() {
                        if(cnt > lit) {
                            clearInterval(loop);
                            if(typeof afterCallb === 'function') {
                                afterCallb(aniamteCallb);
                            }
                        }
                        $tar.eq(cnt).stop().animate(from, aniamteCallb);
                        cnt++;
                    }, timer);
                },
                sbind: function() {
                    var _this = this;
                    $('.lnbsLink').off().on({
                        'click': function() {
                            var $this = $(this);
                            var $data = $this.data('listSnum');
                            $('.lnbsLink').closest('.lst,li').removeClass('active');
                            $this.closest('.lst,li').addClass('active');
                            _this.ext({
                                crrtSlistNum: $data,
                                crrtItems: _this.obj.list[_this.obj.crrtListCnt].data[$data]
                            });
                            if($('.gnb').is('.active')) {
                                $('.gnb').removeClass('active');
                            }
                            _this.sbindCallb();
                            $('.cmmAsPannlPreloader').show().removeClass('closeLoader');
                        }
                    });
                    if(!$('html').is('.mobile')) {
                        $('.container [data-list-snum=0]').click();
                    } else {
                        $('[data-list-snum=0]').click();
                    }
                },
                sbindCallb: function() {
                    var _this = this;
                    var html = '';
                    if(this.obj.crrtItems.subImgs) {
                        for(var i = 0; i < this.obj.crrtItems.subImgs.length; i++) {
                            html += '<div class="animateMotion msg_bx selfie">';
                            html += '<div class="msg_in">';
                            html += '<div class="msg_img">';
                            html += '<span class="img">';
                            html += '<img src="" data-params-project-thumbnail="true" alt="" />';
                            html += '</span>';
                            html += '<div class="nm" data-params-project-tit="true"></div>';
                            html += '</div>';
                            html += '<div class="msg_area">';
                            html += '<div class="thumb">';
                            html += '<span class="img">';
                            html += '<img src="' + this.obj.crrtItems.subImgs[i] + '" alt="" />';
                            html += '</span>';
                            html += '</div>';
                            html += '</div>';
                            html += '</div>';
                            html += '</div>';
                        }
                    }
                    if(this.obj.crrtItems.githref) {
                        $('[data-params-project-githref="true"]').attr('href', this.obj.crrtItems.githref);
                    } else {
                        $('[data-params-project-githref="true"]').hide();
                    }
                    if(!this.obj.crrtItems.detailsubj) {
                        this.obj.crrtItems.detailsubj = this.obj.nullTxt;
                    }
                    if(!this.obj.crrtItems.device || this.obj.crrtItems.device != 'mob') {
                        $('.msg_bx.selfie.info').addClass('mobview_img');
                    } else {
                        $('.msg_bx.selfie.info').removeClass('mobview_img');
                    }
                    $('[data-params-project-subImgs="true"]').html(html);
                    $('[data-params-project-tit="true"]').text(this.obj.crrtItems.tit);
                    $('[data-params-project-stit="true"]').text(this.obj.crrtItems.subj);
                    $('[data-params-project-chat="true"]').text(this.obj.crrtItems.chat);
                    $('[data-params-project-thumb="true"]').attr('src', this.obj.crrtItems.img);
                    $('[data-params-project-thumbnail="true"]').attr('src', this.obj.crrtItems.thumbnail);
                    $('[data-params-project-spec="true"]').html(this.tagSpecFun(this.obj.crrtItems.mode));
                    $('[data-params-project-href="true"]').attr('href', this.obj.crrtItems.href);
                    _this.typingFuncInit($('[data-params-project-detailsubj="true"]'), this.obj.crrtItems.detailsubj);
                    $('.cmmAsPannlPreloader').addClass('closeLoader');
                    $('.valNu').stop().animate({
                        'width': 0
                    }, 0);
                    setTimeout(function() {
                        $('.contentScrFun').customScrollBar()
                    }, 100);
                    _this.secInterval($('.container .animateMotion'), {
                        'transform': 'translateY(-15px)',
                        'opacity': 0
                    }, {
                        'transform': 'translateY(0px)',
                        'opacity': 1
                    }, 300, {
                        'duration': 800
                    }, function() {
                        var timer = null;
                        clearTimeout(timer);
                        timer = setTimeout(function() {
                            $('.cmmAsPannlPreloader').hide();
                            if(!_this.obj.crrtItems.chat) {
                                _this.obj.crrtItems.chat = 100;
                            }
                            $('.valNu').stop().animate({
                                'width': _this.obj.crrtItems.chat + '%'
                            }, 2500);
                        }, 800);
                    });
                },
                typingFuncInit: function(tar, txt) {
                    if(this.typingFuncBool) {
                        clearInterval(this.typingFunc.loop);
                        this.typingFunc = {
                            preloader: '.cmmChatPreloader',
                            selfbox: '.msgSelfBox',
                            inputArea: '.chatInputFieldArea',
                            input: '.chatInputField',
                            tar: tar,
                            orgintxt: txt,
                            timer: 35,
                            loop: null
                        };
                        this.typingFuncLoop();
                    }
                },
                typingFuncLoop: function() {
                    var _this = this;
                    var rtxt = '';
                    var cnt = 0;
                    this.typingFunc.tar.html('');
                    $(this.typingFunc.selfbox).css({
                        'transform': 'translateY(-15px)',
                        'opacity': 0
                    });
                    $(this.typingFunc.preloader).show();
                    $(this.typingFunc.inputArea).show().css('bottom', 0);
                    this.typingFunc.loop = setInterval(function() {
                        var ib = true;
                        if(cnt >= _this.typingFunc.orgintxt.length) {
                            clearInterval(_this.typingFunc.loop);
                            _this.typingFunc.tar.html($(_this.typingFunc.input).html());
                            $(_this.typingFunc.preloader).hide();
                            $('.contentScrFun, html, body').animate({
                                'scrollTop': 0
                            })
                            _this.secInterval($('.container').find(_this.typingFunc.selfbox), {
                                'transform': 'translateY(-15px)',
                                'opacity': 0
                            }, {
                                'transform': 'translateY(0px)',
                                'opacity': 1
                            }, 300, {
                                'duration': 800
                            }, function(aniamteCallb) {
                                var aniamteCallb = $.extend(aniamteCallb, {
                                    'complete': function() {
                                        $(this).hide();
                                    }
                                });
                                $(_this.typingFunc.inputArea).stop().animate({
                                    'bottom': -$(_this.typingFunc.inputArea).outerHeight()
                                }, aniamteCallb);
                                $('.contentScrFun').customScrollBar();
                            });
                            ib = false;
                        }
                        rtxt = _this.typingFunc.orgintxt.slice(0, cnt);
                        var cnttt = cnt - 1;
                        if(cnttt < 0) {
                            cnttt = 0;
                        }
                        //rtxt = _this.typingFunc.orgintxt.slice(cnttt, cnt);
                        if(ib) {
                            $(_this.typingFunc.input).text(rtxt)
                        } else {
                            $(_this.typingFunc.input).text('');
                        }
                        cnt++;
                    }, this.typingFunc.timer);
                }
            };
            var asidelist = new AsideList({
                list: null
            });
            asidelist.init();
            return $this;
        },
        "cmmMobGnb": function(data) {
            var $this = $(this);
            var html = '';
            html += '<ul class="mgn_dp01">';
            for(var i = 0; i < data.length; i++) {
                html += '<li class="tp">';
                html += '<a href="javascript:;" class="tit lnbLink" data-list-num="' + i + '">' + data[i].name;
                html += '<span class="num">' + data[i].data.length + '</span>';
                html += '</a>';
                html += '<ul class="mgn_dp02">';
                for(var j = 0; j < data[i].data.length; j++) {
                    html += '<li class="tp">';
                    html += '<a href="javascript:;" class="txt lnbsLink" data-list-snum="' + j + '">' + data[i].data[j].tit + '</a>';
                    html += '</li>';
                }
                html += '</ul>';
                html += '</li>';
            }
            html += '</ul>';
            $('.mobGnb').html(html);
            html = '';
            $('.menu_btn').click(function() {
                $('.gnb').toggleClass('active');
            });
            return $this;
        }
    });
})(jQuery);

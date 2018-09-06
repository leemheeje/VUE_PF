/*
 * 제작자 : 임희재
 * 버전 : v.07
 * 수정내용 : cmmYoutubePlayPause 삭제
 */
/* Plugin */
;
(function($) {
    $.fn.extend({
        include: function(bool) {
            if(bool) {
                var include = [
                    ['header', {
                        target: '.gnbAreaInclude',
                        url: './include/header.html',
                        get: true
                    }],
                    ['asPannlInclude', {
                        target: '.asPannlInclude',
                        url: './include/asPannlInclude.html',
                        get: true
                    }],
                    ['lnPannlInclude', {
                        target: '.lnPannlInclude',
                        url: './include/lnPannlInclude.html',
                        get: true
                    }],
                    ['contentInclude', {
                        target: '.contentInclude',
                        url: './include/content.html',
                        get: true
                    }],
                    ['layerpop', {
                        target: 'body',
                        url: './include/layerpop.html',
                        get: true
                    }],
                    ['preloader', {
                        target: 'body',
                        url: './include/preloader.html',
                        get: true
                    }]
                    /*
                     * ['footer', { target: '.toolbar', url: '/public/include/toolbar.html', get: 'on' }],
                     */
                    /*
                     * ['asideNav', { target: '.aside_area', url: '/include/asideNav.html', get: 'on' }],
                     *['toolbar', { target: '.toolbar', url: '/include/toolbar.html', get: 'on' }]
                     */
                ];
                var appendHtml = function(target) {
                    $getUrl.done(function(data) {
                        $(target).append(function() {
                            $(this).append(data);
                            $(this).customTags();
                        });
                    });
                }
                for(var i = 0; i < include.length; i++) {
                    if(include[i]) {
                        if(include[i][1].get) {
                            var $getUrl = $.get(include[i][1].url);
                            var target = include[i][1].target;
                            appendHtml(target);
                        }
                    }
                }
            }
        },
        cmmYoutubePlayPause: function(opt) {
            var $this = $(this);
            var defaults = {
                action: 'stop', //stop, pause, play , onReady, playing
                eventCallback: null,
                actionCallback: null
            };

            function CmmYoutubePlayPause(_self) {
                var _this = this;
                this.el = _self;
                this.opt = $.extend(true, defaults, opt);
                this.obj = {
                    paramGubun: ['?', '&'],
                    params: 'enablejsapi=1&version=3&playerapiid=ytplayer&cc_load_policy=1',
                };
                this.init();
            }
            CmmYoutubePlayPause.prototype = {
                init: function() {
                    this.set();
                    if(this.opt.action) {
                        this.actions(this.opt.action);
                    }
                },
                set: function() {
                    var _this = this;
                    $(this.el).each(function() {
                        var $this = $(this);
                        var $thisSrc = $this.attr('src');
                        if($thisSrc.indexOf(_this.obj.params) == -1) {
                            if($thisSrc.indexOf(_this.obj.paramGubun[0]) != -1) {
                                $thisSrc = $thisSrc + _this.obj.paramGubun[1] + _this.obj.params;
                            } else {
                                $thisSrc = $thisSrc + _this.obj.paramGubun[0] + _this.obj.params;
                            }
                            $this.attr('src', $thisSrc);
                        }
                    });
                },
                actions: function(gubun) {
                    var _this = this;
                    var gubunv = '';
                    if(gubun == 'stop') {
                        gubunv = 'stopVideo';
                    } else if(gubun == 'pause') {
                        gubunv = 'pauseVideo';
                    } else if(gubun == 'play') {
                        gubunv = 'playVideo';
                    } else {
                        gubunv = gubun;
                    }
                    $(_this.el).load(function() {
                        this.contentWindow.postMessage('{"event" : "command","func" : "' + gubunv + '","args":""}', '*');

                        function onYouTubePlayerReady() {
                            console.log(123123123123123123123123123);
                        }
                        if(typeof _this.opt.eventCallback === 'function') {
                            _this.opt.eventCallback(this);
                        }
                    });
                }
            };
            this.each(function() {
                $.data($(this), new CmmYoutubePlayPause(this));
            });
            return $this;
        },
        cmmLimitTime: function(obj, callb) {
            /*$(this).cmmLimitTime({
            	datetype: 'minu',
            	limitdate: 201801151659
            }, function() {
            	console.log('맞다')
            	asdfasdf
            });*/
            function CmmLimitTime() {
                this.obj = $.extend(true, {
                    datetype: 'date', //year , month , date , hours, minu
                    limitdate: 0,
                }, obj);
                this.newdate = new Date();
                this.date = {
                    year: this.newdate.getFullYear(),
                    month: this.newdate.getMonth() + 1 >= 10 ? this.newdate.getMonth() + 1 : '0' + (this.newdate.getMonth() + 1),
                    date: this.newdate.getDate() >= 10 ? this.newdate.getDate() : '0' + this.newdate.getDate(),
                    hours: this.newdate.getHours() >= 10 ? this.newdate.getHours() : '0' + this.newdate.getHours(),
                    minu: this.newdate.getMinutes() >= 10 ? this.newdate.getMinutes() : '0' + this.newdate.getMinutes(),
                };
                this.fullDate = 0;
                this.callb = callb;
                this.init();
            };
            CmmLimitTime.prototype = {
                init: function() {
                    this.fulldateFun();
                    this.act();
                },
                fulldateFun: function() {
                    var d = 0;
                    switch (this.obj.datetype) {
                        case 'year':
                            d = Number(this.date.year);
                            break;
                        case 'month':
                            d = Number(this.date.year + '' + this.date.month);
                            break;
                        case 'date':
                            d = Number(this.date.year + '' + this.date.month + '' + this.date.date);
                            break;
                        case 'hours':
                            d = Number(this.date.year + '' + this.date.month + '' + this.date.date + '' + this.date.hours);
                            break;
                        case 'minu':
                            d = Number(this.date.year + '' + this.date.month + '' + this.date.date + '' + this.date.hours + '' + this.date.minu);
                            break;
                    }
                    this.fulldate = d;
                },
                act: function() {
                    if(this.obj.limitdate) {
                        if(this.fulldate >= this.obj.limitdate) {
                            if(typeof this.callb === 'function') {
                                this.callb();
                            }
                        }
                    }
                }
            };
            this.each(function() {
                $.data($(this), new CmmLimitTime($(this), obj));
            });
            return this;
        },
        cmmValidator: function(obj) {
            /*<form class="form">
                <div class="form-group">디바이스선택
                    <input type="radio" data-params='{"required" : true}' name="USER_DEVICE">
                    <label class="form-check-label">안드로이드</label>
                    <input type="radio" data-params='{"required" : true}' name="USER_DEVICE">
                    <label class="form-check-label">아이폰</label>
                    <input type="radio" data-params='{"required" : true}' name="USER_DEVICE">
                    <label class="form-check-label">아이폰A</label>
                    <input type="radio" data-params='{"required" : true}' name="USER_DEVICE">
                    <label class="form-check-label">아이폰C</label>
                    <input type="radio" data-params='{"required" : true}' name="USER_DEVICE">
                    <label class="form-check-label">아이폰D</label>
                    <input type="radio" data-params='{"required" : true}' name="USER_DEVICE">
                    <label class="form-check-label">아이폰E</label>
                </div>
        
                <div class="form-group">
                    <label>한글</label>
                    <input type="text" name="USER_NAME" data-params='{"ime" : "ko", "required" : true}' class="form-control valTest1" placeholder="한글만입력" title="한글">
                </div>
                <div class="form-group">
                    <label>숫자</label>
                    <input type="number" name="USER_NUMBER" data-params='{"ime" : "number", "required" : true}' class="form-control valTest2" placeholder="숫자만입력" title="숫자">
                </div>
        
                <div class="form-group">
                    <label>전화번호</label>
                    <input type="number" name="USER_PHONENUMBER" data-params='{"ime" : "tel", "required" : true}' class="form-control valTest3" placeholder="숫자만입력" title="숫자 전화번호">
                </div>
                <div class="form-group">
                    <label>영어</label>
                    <input type="text" name="USER_EN_NAME" data-params='{"ime" : "en", "required" : true}' class="form-control valTest4" placeholder="영어만입력" title="영어">
                </div>
                <div class="form-row">
                    <div class="form-group col-md-6">
                        <label>en,number = 이메일</label>
                        <input type="email" name="USER_EMAIL" data-params='{"ime" : "en,number", "required" : true}' class="form-control valTest5" placeholder="이메일" title="이메일">
                    </div>
                    <div class="form-group col-md-4">
                        <label>영어&특수문자</label>
                        <input type="email" name="USER_EMAIL_DOMAIN" data-params='{"ime" : "en,etc"}' class="form-control mailform valTes6" placeholder="이메일" title="이메일">
                    </div>
                    <div class="form-group col-md-2">
                        <label>선택</label>
                        <select class="form-control" onchange="$('.mailform').val(this.value)">
                            <option value="">직접입력</option>
                            <option value="naver.com">naver.com</option>
                            <option value="hanmail.net">hanmail.net
                                <option>
                        </select>
                    </div>
                </div>
                <div class="form-group">
                    <label>선택</label>
                    <select class="form-control valTest7" name="USER_GENDER" data-params='{"required" : true}'>
                        <option value="">선택</option>
                        <option value="1">남성</option>
                        <option value="2">여성</option>
                    </select>
                </div>
                <div class="form-group">개인정보A
                    <input type="radio" data-params='{"required" : true}' name="USER_AGREE1" class="valTest8 agree1">
                    <label class="form-check-label">동의</label>
                    <input type="radio" name="USER_AGREE1">
                    <label class="form-check-label">미동의</label>
                </div>
                <div class="form-group">개인정보B
                    <input type="radio" data-params='{"required" : true}' name="USER_AGREE2" class="agree2">
                    <label class="form-check-label">동의</label>
                    <input type="radio" name="USER_AGREE2">
                    <label class="form-check-label">미동의</label>
                </div>
                <div class="form-group form-check">
                    <input type="checkbox" name="USER_CHK1" data-params='{"required" : true}' class="form-check-input">
                    <label class="form-check-label"><span style="color: red">필수선택</span></label>
                </div>
                <div class="form-group form-check">
                    <input type="checkbox" name="USER_CHK2" class="form-check-input">
                    <label class="form-check-label">다중선택</label>
                </div>
                <div class="form-group form-check">
                    <input type="checkbox" name="USER_CHK3" class="form-check-input">
                    <label class="form-check-label">다중선택</label>
                </div>
                <div class="form-group form-check">
                    <input type="checkbox" name="USER_CHK4" class="form-check-input">
                    <label class="form-check-label">다중선택</label>
                </div>
                <div class="form-group">
                    <label>Example textarea</label>
                    <textarea class="form-control" name="USER_COMMENT" data-params='{"required" : true}' placeholder="텍스트에어리어"></textarea>
                </div>
                <button type="button" class="btn btn-primary">값전송</button>
                <button type="button" class="btn formClearBtn">값초기화</button>
            </form>
            
            $(document).ready(function() {
                $(this).find('.form').cmmValidator();
                $('.btn-primary').click(function() {
                    if (!$('[name="USER_DEVICE"]').cmmAjax()) {
                        alert('디바이스선택해주세요');
                        return false;
                    }
                    if (!$('[name="USER_NAME"]').cmmAjax()) {
                        alert('한글 비엇음');
                        return false;
                    }
                    if (!$('[name="USER_NUMBER"]').cmmAjax()) {
                        alert('숫자 비엇음');
                        return false;
                    }
                    if (!$('[name="USER_PHONENUMBER"]').cmmAjax()) {
                        alert('전화번호 비엇음');
                        return false;
                    }
                    if (!$('[name="USER_PHONENUMBER"]').cmmAjax('tel')) {
                        alert('전화번호는 010/011로 시작하여야합니다.');
                        return false;
                    }
                    if (!$('[name="USER_EN_NAME"]').cmmAjax()) {
                        alert('영어 비엇음');
                        return false;
                    }
                    if (!$('[name="USER_EMAIL"]').cmmAjax()) {
                        alert('USER_EMAIL 비엇음');
                        return false;
                    }
                    if (!$('[name="USER_EMAIL_DOMAIN"]').cmmAjax()) {
                        alert('USER_EMAIL_DOMAIN 비엇음');
                        return false;
                    }
                    if (!$('[name="USER_GENDER"]').cmmAjax()) {
                        alert('USER_GENDER 비엇음');
                        return false;
                    }
                    if (!$('[name="USER_AGREE1"]:required').cmmAjax()) {
                        alert('USER_AGREE1 동의필요');
                        return false;
                    }
                    if (!$('[name="USER_AGREE2"]:required').cmmAjax()) {
                        alert('USER_AGREE2 동의필요');
                        return false;
                    }
                    if (!$('[name="USER_CHK1"]:required').cmmAjax()) {
                        alert('USER_CHK1 체크필요');
                        return false;
                    }
                    if (!$('[name="USER_COMMENT"]').cmmAjax()) {
                        alert('USER_COMMENT 비엇음');
                        return false;
                    }
                    $('.form').cmmAjax('submit', {
                        'complete': function(data) {
                            console.log(data);
                        }
                    });
                    return false;
                });
                $('.formClearBtn').click(function() {
                    $('.form').cmmAjax('clear');
                });
            });*/
            var $this = $(this);
            var defaults = {
                ime: true,
                /*eventType: 'keyup blur keypress',
                keycodeGubun: false,*/
                eventType: 'keydown keyup blur',
                keycodeGubun: true
            };

            function CmmValidator($this) {
                this.el = $this;
                this.obj = $.extend(true, defaults, obj);
                this.opt = {
                    imeArry: ['number', 'tel', 'ko', 'en', 'email', 'ennumber', 'konumber', 'etc', 'enetc', 'koetc'],
                    ankeycode: [9, 8, 13, 16, 20, 21, 35, 36, 37, 38, 39, 40],
                    kokeycode: 229
                };
                this.input = null;
                this.inputArry = [];
                this.dataName = 'params';
                this.title = '';
                this.clearchk = false;
                this.init();
            };
            CmmValidator.prototype = {
                init: function() {
                    var _this = this;
                    this.set();
                    this.fnIme();
                },
                set: function() {
                    var _this = this;
                    var clsName = '';
                    this.el.find('input').each(function() {
                        var $this = $(this);
                        var $data = $this.data(_this.dataName);
                        if($data) {
                            if($data.required) {
                                $this.attr('required', $data.required);
                            }
                        }
                        if($data && $data.ime && !$this.is('[type="radio"]') && !$this.is('[type="checkbox"]')) {
                            switch ($data.ime) {
                                case _this.opt.imeArry[2]:
                                    clsName = 'IME_KO';
                                    break;
                                case _this.opt.imeArry[3]:
                                    clsName = 'IME_ONLY_EN';
                                    break;
                            }
                            $this.addClass(clsName);
                        }
                    });
                },
                fnImeExp: function(str, keycode) {
                    var exp = '';
                    var keygubun = '';
                    var callback = null;
                    if(str.indexOf(',') != -1) {
                        var arry = str.split(',');
                        var strArry = '';
                        for(var i = 0; i < arry.length; i++) {
                            strArry += arry[i];
                        }
                    } else {
                        strArry = str;
                    }
                    switch (strArry) {
                        case this.opt.imeArry[0]: //number
                        case this.opt.imeArry[1]: //tel
                            keygubun = (keycode >= 48 && keycode <= 57) || (keycode >= 96 && keycode <= 105) && keycode != this.opt.kokeycode;
                            exp = /[^0-9]/gi;
                            break;
                        case this.opt.imeArry[2]: //ko
                            keygubun = keycode == this.opt.kokeycode;
                            exp = /[^ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/gi;
                            break;
                        case this.opt.imeArry[3]: //en
                            keygubun = keycode >= 65 && keycode <= 90 && keycode != this.opt.kokeycode;
                            exp = /[^A-Za-z]/gi;
                            break;
                        case this.opt.imeArry[4]: //email
                            exp = /[^A-Za-z|0-9|@|.]/gi;
                            break;
                        case this.opt.imeArry[5]: //ennumber
                            exp = /[^A-Za-z|0-9]/gi;
                            break;
                        case this.opt.imeArry[6]: //konumber
                            exp = /[^ㄱ-ㅎ|ㅏ-ㅣ|가-힣|0-9]/gi;
                            break;
                        case this.opt.imeArry[7]: //etc
                            exp = /[^~!@\#$%<>^&*\()\-=+_\’.,/]/gi;
                            break;
                        case this.opt.imeArry[8]: //enetc
                            exp = /[^A-Za-z|~!@\#$%<>^&*\()\-=+_\’.,/]/gi;
                            break;
                        case this.opt.imeArry[9]: //koetc
                            exp = /[^ㄱ-ㅎ|ㅏ-ㅣ|가-힣|~!@\#$%<>^&*\()\-=+_\’.,/]/gi;
                            break;
                    }
                    callback = function($input) {
                        var $val = $input.val();
                        $input.val($val.replace(exp, ''));
                    };
                    return {
                        exp: exp,
                        keygubun: keygubun,
                        callback: callback
                    };
                },
                fnIme: function($input, ime) {
                    var _this = this;
                    this.el.find('input, textarea').on(_this.obj.eventType, function(e) {
                        var $this = $(this);
                        var _bool = true;
                        if(!$this.is('[type="checkbox"]') && !$this.is('[type="radio"]')) {
                            var $val = $this.val();
                            var $data = $this.data(_this.dataName);
                            var keycode = e.keyCode;
                            var str = '';
                            if($data.ime) {
                                str = _this.fnImeExp($data.ime, keycode);
                                if(_this.obj.keycodeGubun && str.keygubun != '' && navigator.userAgent.indexOf('Mobile') == -1) {
                                    if(str.keygubun || _this.opt.ankeycode.indexOf(keycode) != -1) {
                                        _bool = true;
                                    } else {
                                        _bool = false;
                                    }
                                    if(!_bool) {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        e.returnValue = false;
                                    }
                                    if(typeof str.callback === 'function') {
                                        str.callback($this);
                                    }
                                    return _bool;
                                } else {
                                    if(str.exp.test($val)) {
                                        $(this).val($val.replace(str.exp, ''));
                                    }
                                }
                            }
                        }
                    });
                },
            };
            this.each(function() {
                $.data($(this), new CmmValidator($(this), obj));
            });
            return this;
        },
        cmmAjax: function(obj) {
            var globalBool = true;
            var args = arguments;
            var radioBool = false;
            var defaults = {
                errorCall: 'alert', //alert , append
                errorStr: 'title',
                ajax: null,
                jsonParse: false
            };

            function CmmAjax($this) {
                this.el = $this;
                this.obj = typeof obj === 'string' ? obj : typeof obj === 'number' ? $.extend(true, defaults, {
                    minlength: args[0],
                    maxlength: args[1]
                }) : $.extend(true, defaults, obj);
                this.input = null;
                this.inputArry = [];
                this.title = '';
                this.clearchk = false;
                this.dataName = 'params';
                this.opt = {
                    chkmsg: ['을(를) 선택해주세요.', '을(를) 입력해주세요.'],
                }
                this.globalBool = true;
                this.init();
                globalBool = this.globalBool;
                if(this.obj == 'result') {
                    globalBool = this.el.serializeObject();
                    if(args[1] == 'json') {
                        globalBool = JSON.stringify(globalBool);
                    }
                }
            };
            CmmAjax.prototype = {
                init: function() {
                    var _this = this;
                    var chkleng = 0;
                    if(_this.obj == 'clear') {
                        _this.clear(this.el);
                    } else if(_this.obj == 'submit') {
                        _this.submitSet(args[1]);
                    }
                    _this.clear = false;
                    //_this.el.find('input, select, textarea').each(function() {
                    _this.el.each(function() {
                        var $this = $(this);
                        var $data = $this.data(_this.dataName);
                        chkleng++;
                        if($data && $data.required) {
                            _this.input = $this;
                            _this.clear = false;
                            _this.chk();
                            if(_this.clear) {
                                _this.clearchk = false;
                                return false;
                            } else {
                                _this.clearchk = true;
                                if($this.is('input[type="checkbox"]') || $this.is('input[type="radio"]')) {
                                    _this.input = _this.input.prop('checked') ? _this.input : null;
                                }
                                if(_this.input) {
                                    _this.inputArry.push(_this.input);
                                }
                            }
                        }
                    });
                },
                chk: function() {
                    var _this = this;
                    if(this.obj == 'tel') {
                        _this.typeInputGubun(_this.el);
                    }
                    if(this.input.is('input[type="checkbox"]')) {
                        this.errorFun(this.input.prop('checked'), this.opt.chkmsg[0]);
                    } else if(this.input.is('input[type="radio"]')) {
                        var $name = this.input.attr('name');
                        if(this.input.is(':checked') && this.input.data(_this.dataName) && this.input.data(_this.dataName).required) {
                            radioBool = true;
                        }
                        this.errorFun(radioBool, this.opt.chkmsg[0]);
                    } else {
                        var inputbool = this.input.val();
                        var trim = inputbool.replace(/\s+/, '');
                        if(this.input.is('textarea') && trim == '') {
                            inputbool = false;
                        }
                        if(this.obj.maxlength && this.obj.minlength && (this.obj.minlength > this.input.val().length || this.obj.maxlength < this.input.val().length)) {
                            //글자수체크 함수명 뒤에 arguments[0] : min , arguments[1] : max
                            inputbool = false;
                        }
                        this.errorFun(inputbool, this.opt.chkmsg[1]);
                    }
                },
                errorFun: function(bool, bmsg) {
                    if(!bool) {
                        /*switch(this.obj.errorCall) {
                            case 'alert':
                                //alert('\'' + this.title + '\'' + bmsg);
                                //console.log('\'' + this.title + '\'' + bmsg);
                                break;
                            case 'layerpop':
                                //console.log(this.data(this.dataName));
                                console.log(this.input.data('fun'))
                                break;
                        }*/
                        this.input.focus();
                        this.clear = true;
                        this.globalBool = false;
                    }
                },
                typeInputGubun: function($this) {
                    //var $this = this.el;
                    var $val = $this.val();
                    var bool = false;
                    if($this.data(this.dataName).ime == 'tel' && $val) {
                        if($this.val().indexOf('010') == 0 || $this.val().indexOf('011') == 0) {
                            bool = true;
                        }
                    }
                    this.errorFun(bool, this.opt.chkmsg[1]);
                },
                submitSet: function(_args) {
                    if(!_args || typeof _args === 'object') {
                        var ajaxobj = $.extend(true, {
                            url: '',
                            type: 'post',
                            data: this.el.serializeObject(),
                            dataType: 'json',
                            success: function(data) {},
                            error: function(r, s, e) {
                                console.error("cmmAjax.submitSet() ERROR : \ncode:" + r.status + "\n" + "message:" + r.responseText + "\n" + "error:" + e);
                            }
                        }, _args);
                        if(!this.obj.jsonParse) {
                            //ajaxobj.data = JSON.stringify(ajaxobj.data);
                        }
                        $.ajax(ajaxobj);
                    } else if(typeof _args === 'function') {
                        _args();
                    }
                },
                clear: function($this) {
                    $this.find('input, textarea, select').each(function() {
                        var $this = $(this);
                        if($this.is('[type="checkbox"]') || $this.is('[type="radio"]')) {
                            $this.prop('checked', false);
                        } else {
                            $this.val('');
                        }
                    });
                }
            };
            this.each(function() {
                $.data($(this), new CmmAjax($(this), obj));
            });
            return globalBool;
        },
        serializeObject: function() {
            var $this = $(this);
            var o = {};
            var a = this.serializeArray();
            $.each(a, function() {
                if(o[this.name]) {
                    if(!o[this.name].push) {
                        o[this.name] = [o[this.name]];
                    }
                    o[this.name].push(this.value || '');
                } else {
                    o[this.name] = this.value || '';
                }
            });
            return o;
        },
        cmmVisualEffect: function(obj) {
            var defaults = {};

            function CmmMycanavs($this) {
                this.canvas = document.getElementById($this[0].id);
                this.ctx = this.canvas.getContext('2d');
                console.log(123123123123)
            };
            CmmMycanavs.prototype = {
                init: function() {},
                set: function() {},
                update: function() {},
                draw: function() {},
                callb: function() {}
            };
            this.each(function() {
                $.data($(this), new CmmMycanavs($(this), obj));
            });
            return this;
        },
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
            /*
             * $('.button1').click(function() {
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
             */
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
                this.currentScrolltop = $(document).scrollTop();
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
                    this.title += '<a href="javascript: ;" class="' + this.clsFormat(this.targetBtns[0]) + '" title=""><span class="ti-close"></span></a>';
                    this.title += '</div>';
                    this.bottom += '<div class="' + this.clsFormat(this.targetBottom) + '">';
                    if(this.obj.type != 'alert') {
                        this.bottom += '<a href="javascript:;" class="' + this.clsFormat(this.targetBtns[0]) + '" title="">' + this.obj.targetBtnsName[0] + '</a>';
                        this.bottom += '<a href="javascript:;" class="' + this.clsFormat(this.targetBtns[1]) + '" title="">' + this.obj.targetBtnsName[1] + '</a>';
                    } else {
                        this.bottom += '<a href="javascript:;" class="' + this.clsFormat(this.targetBtns[1]) + '">' + this.obj.targetBtnsName[0] + '</a>';
                    }
                    this.bottom += '</div>';
                    if(!$(this.target).closest(this.targetParent).length) {
                        $(this.target).wrap(this.cont);
                        $(this.target).closest(this.targetParentIn).prepend(this.title);
                        $(this.target).closest(this.targetParentIn).append(this.bottom);
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
                    if(typeof this.obj.beforeCallback === 'function') {
                        this.obj.beforeCallback($(this.target));
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
                        switch (_this.obj.align[0], _this.obj.align[1]) {
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
                                'overflow-y': 'hidden',
                                'position': 'fixed',
                                'width': '100%',
                                'margin-top': -this.currentScrolltop
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
                                'overflow-y': 'visible',
                                'position': 'static',
                                'width': 'auto',
                                'margin-top': 0
                            });
                            $(document).scrollTop(this.currentScrolltop);
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
                        'click': function(e) {
                            _this.act().hide();
                            return false;
                        }
                    });
                    $(_this.target).closest(_this.targetParent).find(this.dimmClsName).on({
                        'click': function() {
                            _this.act().hide();
                            return false;
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
        multiEllip: function(opt) {
            var defaults = {
                len: 0,
                ellips: '...',
                space: false,
                initTxtAppend: true,
            };

            function MultiEllip($this) {
                this.el = $this;
                this.txt = '';
                this.initTxt = '';
                this.obj = $.extend(true, defaults, opt);
                this.init();
            };
            MultiEllip.prototype = {
                init: function() {
                    this.set();
                },
                set: function() {
                    var _this = this;
                    this.el.each(function() {
                        var $thistxt = $(this).text();
                        _this.initTxt = $thistxt;
                        if(_this.obj.initTxtAppend) {
                            _this.append();
                        }
                        _this.slc($thistxt);
                    });
                },
                append: function() {
                    this.el.after('<span class="mult_init_txt multInitTxt" style="display: none;">' + this.initTxt + '</span>');
                },
                slc: function(txt) {
                    var txt = txt.replace(/(^\s*)|(\s*$)/g, '');
                    var len = this.obj.space ? txt.replace(/ /gi, '').length : txt.length;
                    if(len > this.obj.len) {
                        this.txt = txt.slice(0, this.obj.len);
                        this.el.text(this.txt + this.obj.ellips);
                    }
                },
            };
            this.each(function() {
                $.data(this, new MultiEllip($(this), opt));
            });
            return this;
        },
        getParams: function(param, str, amp, url) {
            var url = url ? url : location.search;
            if(url) {
                var arry = url.split(str ? str : '?');
                var amp = amp ? amp : '&';
                var result = null;
                var arryDp = arry[1].split(amp);
                for(var i = 0; i < arryDp.length; i++) {
                    var resArry = arryDp[i].split('=');
                    for(var j = 0; j < resArry.length; j++) {
                        if(resArry[0] == param) {
                            result = resArry[1];
                        }
                    }
                }
                return result;
            }
        },
        mapApiSortFun: function(obj) {
            var defaults = {
                LatReturn: null,
                LngReturn: null,
                level: 3,
                marker: {
                    src: '/common/images/sub/baseIco02.png',
                    size: [70, 95],
                },
            };

            function DaumMapLoad($this) {
                var LatReturn = null;
                var LngReturn = null;
                var level = null;
                var map = null;
                this.el = $this;
                this.obj = $.extend(true, defaults, obj);
                this.init();
            };
            DaumMapLoad.prototype = {
                init: function() {
                    LatReturn = this.obj.LatReturn;
                    LngReturn = this.obj.LngReturn;
                    level = this.obj.level;
                    var mapContainer = this.el[0] ? this.el[0] : null;
                    var mapOption = {
                        center: new daum.maps.LatLng(LatReturn, LngReturn),
                        level: level
                    };
                    map = new daum.maps.Map(mapContainer, mapOption);
                    this.marker();
                    this.overlay();
                },
                marker: function() {
                    var imageSrc = this.obj.marker.src;
                    var imageSize = new daum.maps.Size(this.obj.marker.size[0], this.obj.marker.size[1]);
                    var markerImage = new daum.maps.MarkerImage(imageSrc, imageSize);
                    var markerPosition = new daum.maps.LatLng(LatReturn, LngReturn);
                    var marker = new daum.maps.Marker({
                        position: markerPosition,
                        image: markerImage
                    });
                    marker.setMap(map);
                },
                overlay: function() {
                    var content = '';
                    var position = new daum.maps.LatLng(LatReturn, LngReturn);
                    var customOverlay = new daum.maps.CustomOverlay({
                        map: map,
                        position: position,
                        content: content,
                        yAnchor: 1
                    });
                },
            };
            this.each(function() {
                $.data(this, new DaumMapLoad($(this), obj));
            });
            return this;
        },
        numberEffect: function(obj) {
            var defaults = {
                mode: 'typing',
                speed: 1500
            };

            function NumberEffect($this) {
                this.el = $this;
                this.obj = $.extend(true, defaults, obj);
                this.init();
            };
            NumberEffect.prototype = {
                init: function() {
                    var _this = this;
                    _this.el.each(function() {
                        var $this = $(this);
                        var speed = 10;
                        var $thisTxt = Number($this.text());
                        $this.css({
                            'width': $this.width()
                        });
                        $this.text('');
                        $this.animate({
                            'num': $thisTxt
                        }, {
                            'duration': _this.obj.speed,
                            'step': function(t, o) {
                                var stepNum = Math.ceil(o.now);
                                $this.text(stepNum);
                            },
                            'complete': function() {
                                $this.css({
                                    'width': 'auto'
                                });
                            }
                        });
                    });
                },
            };
            this.each(function() {
                $.data(this, new NumberEffect($(this), obj));
            });
            return this;
        },
        cmmShowHideTabs: function(obj) {
            var defaults = {
                tabUl: '',
                tabDivs: '',
                tabAnimate: false,
                tabAnitype: '',
                tabhref: '.href',
                tabInSlide: false,
                callb: function() {},
            };

            function CmmShowHideTabs($this) {
                this.tabWrap = $this;
                this.obj = $.extend(true, defaults, obj);
                this.li = null;
                this.idx = null;
                this.init();
            };
            CmmShowHideTabs.prototype = {
                init: function() {
                    if(!this.tabWrap.is(this.obj.tabhref)) {
                        this.set();
                        this.bind();
                    } else {
                        this.tabHref();
                    }
                },
                set: function() {
                    if(this.obj.tabInSlide) {
                        $(this.tabWrap).find(this.obj.tabDivs + '>div,' + this.obj.tabDivs + '>ul').css({
                            'overflow': 'hidden',
                            'height': 0
                        });
                    } else {
                        $(this.tabWrap).find(this.obj.tabDivs + '>div,' + this.obj.tabDivs + '>ul').hide();
                    }
                },
                bind: function() {
                    var _this = this;
                    this.tabWrap.find(this.obj.tabUl + '>li').on({
                        'click': function(e) {
                            e.preventDefault();
                            _this.li = $(this);
                            _this.idx = $(this).index();
                            _this.show();
                            return false;
                        },
                    });
                    _this.tabWrap.find(_this.obj.tabUl + '>li:eq(0)').click();
                },
                show: function() {
                    this.tabWrap.find(this.obj.tabUl + '>li').removeClass('active');
                    this.li.addClass('active');
                    if(this.obj.tabInSlide) {
                        $(this.tabWrap).find(this.obj.tabDivs + '>div,' + this.obj.tabDivs + '>ul').css({
                            'overflow': 'hidden',
                            'height': 0
                        });
                        $(this.tabWrap).find(this.obj.tabDivs + '>div:eq(' + this.idx + ') ,' + this.obj.tabDivs + '>ul:eq(' + this.idx + ')').css({
                            'overflow': 'visible',
                            'height': 'auto'
                        });
                    } else {
                        $(this.tabWrap).find(this.obj.tabDivs + '>div,' + this.obj.tabDivs + '>ul').hide();
                        $(this.tabWrap).find(this.obj.tabDivs + '>div:eq(' + this.idx + ') ,' + this.obj.tabDivs + '>ul:eq(' + this.idx + ')').show();
                    }
                    if(typeof this.obj.callb === 'function') {
                        this.obj.callb(this.tabWrap, this.idx, this.li);
                    }
                },
                tabHref: function() {
                    var _this = this;
                    this.tabWrap.attr('data-coldiv');
                    this.tabWrap.find(this.obj.tabUl + '>li').each(function() {
                        if($(this).is('.active')) {
                            var $color = $(this).find('.txt').attr('data-color');
                            _this.tabWrap.attr('data-coldiv', $color);
                        }
                    });
                },
            };
            this.each(function() {
                $.data(this, new CmmShowHideTabs($(this), obj));
            });
            return this;
        },
        rspGrid: function(obj) {
            var _settings = {
                setBox: {
                    items: '.item',
                    width: 230,
                    margin: null
                },
                animate: true,
                animateOfOptions: {
                    mode: 'flip', // flip,opacity
                    duration: 300,
                    ease: 'easeOutExpo',
                    queue: false,
                    complete: function() {},
                },
                renderAfterCallb: function() {},
                animateAfterCallb: function() {},
            };

            function RspGrid(el, obj) {
                this.col = null;
                this.itemGroup = 'itemsGroup';
                this.opt = $.extend(true, _settings, obj);
                this.el = $(el);
                this.box = this.el.find(this.opt.setBox.items);
                this.init();
            };
            RspGrid.prototype = {
                init: function() {
                    var _this = this;
                    this.el.addClass('clearfix');
                    this.setItem();
                    this.renderItem();
                    $(window).smartresize(function() {
                        _this.resizeble();
                    });
                },
                setItem: function() {
                    var thisOtp = this.opt.setBox;
                    var w = Math.floor(this.el.width() / thisOtp.width);
                    var boxw = 100 / w;
                    this.col = w;
                    for(var i = 0; i < this.col; i++) {
                        var div = $('<div></div>').addClass(this.itemGroup).css({
                            'width': boxw + '%',
                            'float': 'left',
                            'box-sizing': 'border-box',
                            '-webkit-box-sizing': 'border-box',
                            '-moz-box-sizing': 'border-box',
                            '-ms-box-sizing': 'border-box',
                            '-o-box-sizing': 'border-box',
                        }).attr('itemGroup', i);
                        this.el.append(div);
                    }
                },
                renderItem: function(evt, resizeYN) {
                    var itemArry = [];
                    var _this = this;
                    var num = 0;
                    this.box.each(function(idx) {
                        num++;
                        var $this = $(this);
                        $this.css({
                            'padding': _this.opt.setBox.margin / 2
                        });
                        if(idx % _this.col == 0) {
                            num = 0;
                        }
                        $this.attr('itemGroupBox', num);
                        var $thisGroupNum = $this.attr('itemGroupBox');
                        $('.' + _this.itemGroup + '[itemgroup="' + $thisGroupNum + '"]').append($this);
                        if(resizeYN != 'N') _this.renderAnimate($this, idx);
                    });
                    if(typeof this.opt.renderAfterCallb === 'function') {
                        this.opt.renderAfterCallb();
                    }
                },
                renderAnimate: function($this, idx) {
                    var thisOpt = this.opt.animateOfOptions;
                    if(this.opt.animate) {
                        var funs = function() {};
                        if(!thisOpt.queue) {
                            var time = idx * 150;
                        } else {
                            var time = 0;
                        }
                        switch (thisOpt.mode) {
                            case 'flip':
                                $this.css({
                                    'display': 'none'
                                });
                                funs = function() {
                                    $this.slideDown({
                                        'duration': thisOpt.duration,
                                        'easing': thisOpt.ease,
                                        'complete': thisOpt.complete()
                                    });
                                }
                                break;
                            case 'opacity':
                                $this.css({
                                    'opacity': .1
                                });
                                funs = function() {
                                    $this.stop().animate({
                                        'opacity': 1
                                    }, {
                                        'duration': thisOpt.duration,
                                        'easing': thisOpt.ease,
                                        'complete': thisOpt.complete()
                                    });
                                }
                                break;
                            case 'pars':
                                break;
                        }
                        setTimeout(funs, time);
                    }
                    if(typeof this.opt.animateAfterCallb === 'function') {
                        this.opt.animateAfterCallb();
                    }
                },
                resizeble: function() {
                    this.el.find('>').remove();
                    this.setItem();
                    this.renderItem('', 'N');
                }
            };
            this.each(function() {
                $.data(this, new RspGrid($(this), obj));
            });
            return this;
        },
        uiSwiper: function(obj) {
            /*
             * slick.js 기반의 플러그인(http://kenwheeler.github.io/slick/) slick 옵션+커스텀옵션 추가, 제작자 : 임희재 버전 : v.01
             */
            var $this = $(this);
            var defaults = {
                /** slickJS 전용객체 */
                slideObj: {
                    draggable: false,
                },
                /** 페이징+버튼 */
                uiBtnsApp: {
                    target: 'contr',
                    uiDot: true,
                    uiShortDot: false,
                    uiPrev: null,
                    uiNext: null,
                    uiPause: null,
                    uiPlay: null,
                },
                /** dot관련 */
                dotThumb: false,
                dotTabs: false,
                dotTabsLst: '',
                uicallback: function() {},
                /** 슬라이드 콜백관련 */
                callb: function() {},
            };

            function CmmUiSwiper() {
                this.obj = $exObj;
                this.acallb = function(o) {
                    var cb = {
                        duration: 300,
                        ease: 'easeInExpo',
                        complete: function() {}
                    };
                    if(typeof o === 'object') {
                        var $exCb = $.extend(true, cb, o);
                        return $exCb;
                    }
                };
                this.init();
            };
            CmmUiSwiper.prototype = {
                init: function() {
                    this.slickSlide();
                },
                slickSlide: function() {
                    $this.slick($.extend(true, {}, this.obj.slideObj));
                    if(typeof this.obj.callb === 'function') {
                        $this.on({
                            'beforeChange swipe edge': this.obj.callb
                        });
                    }
                    this.initButtons();
                },
                initButtons: function() {
                    if(typeof this.obj.uiBtnsApp !== 'object') {
                        $this.find('.slick-prev').show();
                        $this.find('.slick-next').show();
                        return;
                    }
                    $this.find('.slick-prev').hide();
                    $this.find('.slick-next').hide();
                    this.buttons();
                },
                buttons: function() {
                    var uiBtnsAppTarget = this.obj.uiBtnsApp.target;
                    var buttons = {
                        uiDot: this.obj.uiBtnsApp.uiDot ? $this.find('.slick-dots') : null,
                        uiPrev: this.obj.uiBtnsApp.uiPrev ? this.obj.uiBtnsApp.uiPrev : 'uiSlidePrev',
                        uiNext: this.obj.uiBtnsApp.uiNext ? this.obj.uiBtnsApp.uiNext : 'uiSlideNext',
                        uiPause: this.obj.uiBtnsApp.uiPause ? this.obj.uiBtnsApp.uiPause : 'uiSlidePause',
                        uiPlay: this.obj.uiBtnsApp.uiPlay ? this.obj.uiBtnsApp.uiPlay : 'uiSlidePlay',
                        uiShortDot: this.obj.uiBtnsApp.uiShortDot ? 'uiSlideShortDot' : null,
                    };
                    $this.parent().append('<div class="' + uiBtnsAppTarget + '"></div>');
                    var $uiBtnsAppTarget = $this.parent().find('.' + uiBtnsAppTarget);
                    for(var i in buttons) {
                        var buttonsVal = buttons[i];
                        var html = '';
                        switch (i) {
                            case 'uiPrev':
                                html = $('<a href="#" class="uislide_prev ' + buttonsVal + '" title="이전슬라이드"></a>');
                                break;
                            case 'uiNext':
                                html = $('<a href="#" class="uislide_next ' + buttonsVal + '" title="다음슬라이드"></a>');
                                break;
                            case 'uiPause':
                                if(this.obj.slideObj.autoplay) {
                                    html = $('<a href="#" class="uislide_pause ' + buttonsVal + '" title="슬라이드 일시정지"></a>');
                                }
                                break;
                            case 'uiPlay':
                                if(this.obj.slideObj.autoplay) {
                                    html = $('<a href="#" class="uislide_play ' + buttonsVal + '" title="슬라이드 재생"></a>');
                                }
                                break;
                            case 'uiShortDot':
                                if(this.obj.uiBtnsApp.uiShortDot) {
                                    html = $('<div class="uislide_shortdot ' + buttonsVal + '"></div>');
                                }
                                break;
                            default:
                                html = buttonsVal;
                        }
                        $uiBtnsAppTarget.append(html);
                    }
                    if(this.obj.slideObj.dots) {
                        if(this.obj.dotThumb) {
                            this.dotThumb(buttons);
                        } else if(this.obj.dotTabs && this.obj.dotTabsLst) {
                            var _this = this;
                            this.dotTabs();
                            $this.on({
                                'afterChange swipe edge': function() {
                                    _this.dotTabs();
                                }
                            });
                        }
                    }
                    if(this.obj.uiBtnsApp.uiShortDot) {
                        var _this = this;
                        this.dotShort(buttons);
                        $this.on({
                            'afterChange swipe edge': function() {
                                _this.dotShort(buttons);
                            }
                        });
                    }
                    this.buttonsEvent(buttons);
                },
                dotThumb: function(buttons) {
                    var imgSrc = null;
                    buttons.uiDot.find('>li').each(function() {
                        var $thisIdx = $(this).index();
                        var imgSrc = '';
                        $this.find('.slick-slide').each(function() {
                            if($(this).data('slick-index') == $thisIdx) {
                                imgSrc = $(this).find('img').attr('src');
                            }
                        });
                        $(this).find('button').html('<img src="' + imgSrc + '" alt="슬라이드이미지 썸네일" class="uislide_dotimg" />');
                    });
                },
                dotShort: function(buttons) {
                    var $dots = $this.parent().find('.slick-dots li');
                    var $activeDot = null;
                    var allTxt = $dots.length;
                    $dots.each(function() {
                        if($(this).is('.slick-active')) {
                            $activeDot = $(this).index() + 1;
                        }
                    });
                    if(!$activeDot) $activeDot = 0;
                    $this.parent().find('.' + buttons.uiShortDot).text($activeDot + '/' + allTxt);
                },
                dotTabs: function() {
                    var _this = this;
                    var $ul = $(this.obj.dotTabsLst);
                    var $li = $ul.find('li');
                    var $dots = $this.parent().find('.slick-dots');
                    var $activeDot = null;
                    $dots.find('li').each(function() {
                        if($(this).is('.slick-active')) {
                            $activeDot = $(this).index();
                        }
                    });
                    $li.removeClass('active');
                    $ul.find('li:eq(' + $activeDot + ')').addClass('active');
                    $li.off().on({
                        'mouseenter click': function() {
                            var $thisIdx = $(this).closest('li').index();
                            $li.removeClass('active');
                            $dots.find('li:eq(' + $thisIdx + ')').click();
                            return false;
                        },
                    });
                },
                buttonsEvent: function(buttons) {
                    // $this.parent().find('.' + buttons.uiPause).css('opacity', 1);
                    $this.parent().find('.' + buttons.uiPlay).css('opacity', .5);
                    $this.parent().find('.' + buttons.uiPrev).on({
                        'click': function() {
                            $this.find('.slick-prev').click();
                            return false;
                        }
                    });
                    $this.parent().find('.' + buttons.uiNext).on({
                        'click': function() {
                            $this.find('.slick-next').click();
                            return false;
                        }
                    });
                    $this.parent().find('.' + buttons.uiPause).on({
                        'click': function() {
                            $this.slick('slickPause');
                            $(this).css('opacity', .5);
                            $this.parent().find('.' + buttons.uiPlay).css('opacity', 1);
                            return false;
                        }
                    });
                    $this.parent().find('.' + buttons.uiPlay).on({
                        'click': function() {
                            $this.slick('slickPlay');
                            $(this).css('opacity', .5);
                            $this.parent().find('.' + buttons.uiPause).css('opacity', 1);
                            return false;
                        }
                    });
                    if(typeof this.obj.uicallback === 'function') {
                        this.obj.uicallback();
                    }
                },
            };
            var $exObj = $.extend(true, defaults, obj);
            this.each(function() {
                $.data(this, new CmmUiSwiper($exObj));
            });
            return $this;
        },
        musMoveEffect: function(obj) {
            var $this = $(this);
            var opt = $.extend(true, {
                dots: {
                    leng: 40,
                    maxw: 80,
                    minw: 10,
                    type: 'circle',
                    color: ['#fac863', '#c594c5', '#6699cc', '#ec5f67', '#5fb3b3'],
                    group: null,
                    css: {}
                },
                pos: {
                    left: null,
                    top: null,
                },
                move: {
                    dir: 'h', // v , h , vh
                    easing: null,
                    maxRange: 30,
                    distance: 50,
                    delay: 3000,
                    rever: false,
                },
            }, obj);

            function MusMoveEvt(el) {
                this.target = el;
                this.init();
            };
            MusMoveEvt.prototype = {
                init: function() {
                    this.dotDraw();
                    this.bind();
                },
                dotDraw: function() {
                    var $thisTarget = $(this.target);
                    var dots = opt.dots;
                    var pos = this.pos;
                    var dotsType = dots.type == 'circle' ? '50%' : '';
                    $thisTarget.css({
                        'overflow': 'hidden'
                    });
                    for(var i = 1; i <= dots.leng; i++) {
                        var _this = this;
                        var random = Math.random();
                        var ran = Math.floor(random * (dots.maxw - dots.minw + 1)) + dots.minw;
                        var bg = Math.floor(random * ((dots.color.length - 1) - 0 + 1)) + 0;
                        var bg = dots.color[bg];
                        var dotsSize = ran;
                        var pos = function() {
                            var random = Math.random();
                            var left = $(_this.target).width() * random;
                            var top = $(_this.target).height() * random;
                            return {
                                left: left,
                                top: top
                            };
                        };
                        var html = '';
                        html = '<span style="display: inline-block; width: ' + dotsSize + 'px; height: ' + dotsSize + 'px;  border-radius: ' + dotsType + ';  background: ' + bg + ';position: absolute; left: ' + pos().left + 'px; top: ' + pos().top + 'px; opacity: .05; transform: scale(0);"></span>';
                        $thisTarget.append(html);
                        var o = i - 1;
                        $thisTarget.find('span:eq(' + o + ')').animate({
                            'transform': 'scale(1)'
                        }, {
                            'duration': 700,
                            'easing': 'easeInExpo'
                        });
                    }
                    if(typeof dots.css === 'object') {
                        $thisTarget.find('span').css(dots.css);
                    }
                },
                bind: function() {
                    var $thisTarget = $(this.target);
                    var _this = this;
                    var moveObj = opt.move;
                    var lastPos = {
                        x: null,
                        y: null
                    };
                    var leftArry = [];
                    var topArry = [];
                    $thisTarget.find('span').each(function() {
                        var $thisLeft = Number($(this).css('left').replace('px', ''));
                        var $thisTop = Number($(this).css('top').replace('px', ''));
                        leftArry.push($thisLeft);
                        topArry.push($thisTop);
                    });
                    $thisTarget.on({
                        'mousemove': function(e) {
                            if(true) {
                                if(!moveObj.rever) {
                                    var distance = {
                                        x: event.pageX > lastPos.x ? moveObj.distance : -moveObj.distance,
                                        y: event.pageY > lastPos.y ? moveObj.distance : -moveObj.distance,
                                    };
                                } else {
                                    var distance = {
                                        x: event.pageX < lastPos.x ? moveObj.distance : -moveObj.distance,
                                        y: event.pageY < lastPos.y ? moveObj.distance : -moveObj.distance,
                                    };
                                }
                                lastPos = {
                                    x: event.pageX,
                                    y: event.pageY
                                };
                                for(var i = 0; i < leftArry.length; i++) {
                                    if(moveObj.dir == 'h') {
                                        var aa = leftArry.length / 2;
                                        if(i <= aa) {
                                            $(this).find('span:eq(' + i + ')').stop().animate({
                                                'left': leftArry[i] + distance.x,
                                            }, {
                                                'duration': moveObj.delay,
                                                'easing': 'easeOutExpo'
                                            });
                                        } else {
                                            $(this).find('span:eq(' + i + ')').stop().animate({
                                                'left': leftArry[i] + ((distance.x + 30) * -1),
                                            }, {
                                                'duration': (moveObj.delay * 2),
                                                'easing': 'easeOutExpo'
                                            });
                                        }
                                    } else if(moveObj.dir == 'v') {
                                        $(this).find('span:eq(' + i + ')').stop().animate({
                                            'top': topArry[i] + distance.y
                                        }, {
                                            'duration': moveObj.delay,
                                            'easing': 'easeInExpo'
                                        });
                                    } else if(moveObj.dir == 'vh') {
                                        $(this).find('span:eq(' + i + ')').stop().animate({
                                            'left': leftArry[i] + distance.x,
                                            'top': topArry[i] + distance.y
                                        }, {
                                            'duration': moveObj.delay,
                                            'easing': 'easeInExpo'
                                        });
                                    }
                                }
                            }
                        },
                        'mouseleave': function() {
                            for(var i = 0; i < leftArry.length; i++) {
                                $(this).find('span:eq(' + i + ')').stop().animate({
                                    'left': leftArry[i],
                                    'top': topArry[i]
                                }, {
                                    'duration': moveObj.delay,
                                    'easing': 'easeInExpo'
                                });
                            }
                        }
                    });
                },
            };
            this.each(function() {
                $.data(this, new MusMoveEvt(this));
            });
            return $this;
        },
        cmmCalendal: function(obj) {
            var defaults = {
                format: {
                    day: {
                        sun: '일',
                        mon: '월',
                        tue: '화',
                        wed: '수',
                        thu: '목',
                        fri: '금',
                        sat: '토'
                    },
                    month: [
                        [1, 'January'],
                        [2, 'February'],
                        [3, 'March'],
                        [4, 'April'],
                        [5, 'May'],
                        [6, 'June'],
                        [7, 'July'],
                        [8, 'August'],
                        [9, 'September'],
                        [10, 'October'],
                        [11, 'November'],
                        [12, 'December']
                    ]
                },
                sch: {
                    schMax: 4,
                    schItem: []
                }
            };

            function CmmCalendal(el, obj) {
                var _this = this;
                var date = new Date();
                this.y = date.getFullYear();
                this.m = date.getMonth();
                this.d = date.getDate();
                this.theDate = new Date(this.y, this.m, 1);
                this.theDay = this.theDate.getDay();
                this.el = $(el);
                this.opt = $.extend(true, defaults, obj);
                this.initPasing();
                this.initSch();
                this.schParsing();
                $(window).smartresize(function() {
                    _this.resize();
                });
            }
            CmmCalendal.prototype = {
                initPasing: function() {
                    var last = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
                    if(this.y % 4 && this.y % 100 != 0 || this.y % 400 === 0) {
                        lastDate = last[1] = 29;
                    }
                    var lastDate = last[this.m];
                    var row = Math.ceil((this.theDay + lastDate) / 7);
                    this.el.html("<div class='cal_top'><div class=''><a href='#' class='btns_cal cal_prev'>&lt;</a><a href='#' class='btns_cal cal_next'>&gt;</a></div><span class='cal_year'>" + this.y + "</span><span class='cal_month'>" + (this.m + 1) + "</span></div>");
                    var calendar = '';
                    var commColgroup = [7, '14.285%'];
                    calendar += "<div class='calTableGroup'>";
                    calendar += "<div class='calTheadGroup'>";
                    calendar += "<table class='calendar_table'>";
                    calendar += "<colgroup>";
                    for(var i = 0; i < commColgroup[0]; i++) {
                        calendar += "<col width='" + commColgroup[1] + "'/>";
                    }
                    calendar += "</colgroup>";
                    calendar += "<thead>";
                    calendar += "<tr>";
                    calendar += "<th class='SUN'>" + this.opt.format.day.sun + "</th>";
                    calendar += "<th>" + this.opt.format.day.mon + "</th>";
                    calendar += "<th>" + this.opt.format.day.tue + "</th>";
                    calendar += "<th>" + this.opt.format.day.wed + "</th>";
                    calendar += "<th>" + this.opt.format.day.thu + "</th>";
                    calendar += "<th>" + this.opt.format.day.fri + "</th>";
                    calendar += "<th class='SAT'>" + this.opt.format.day.sat + "</th>";
                    calendar += "</tr>";
                    calendar += "</thead>";
                    calendar += "</table>";
                    calendar += "</div>"; // calTheadGroup
                    var dNum = 1;
                    for(var i = 1; i <= row; i++) {
                        calendar += "<div class='calTbodyGroup'>";
                        calendar += "<table class='calendar_table'>";
                        calendar += "<colgroup>";
                        for(var o = 0; o < commColgroup[0]; o++) {
                            calendar += "<col width='" + commColgroup[1] + "'/>";
                        }
                        calendar += "</colgroup>";
                        calendar += "<tbody>";
                        calendar += "<tr>";
                        for(var k = 1; k <= 7; k++) {
                            if(i === 1 && k <= this.theDay || dNum > lastDate) {
                                calendar += "<td> &nbsp; </td>";
                            } else {
                                calendar += "<td>" + dNum + "</td>";
                                dNum++;
                            }
                        }
                        calendar += "</tr>";
                        calendar += "</tbody>";
                        calendar += "</table>";
                        calendar += "</div>"; // calTbodyGroup
                    }
                    calendar += "</div>"; // calTableGroup
                    this.el.append(calendar);
                    $('.calendar_table tr').each(function() {
                        $(this).find('td:first').addClass('SUN');
                        $(this).find('td:last').addClass('SAT');
                    });
                },
                initSch: function() {
                    var html = '';
                    var _this = this;
                    var $calTbodyGroup = $('.calTbodyGroup');
                    var $calTbl = $('.cal_tbl');
                    html += '<div class="scVirTableGroup">';
                    html += '<table>';
                    html += '<colgroup><col width="14.285%"><col width="14.285%"><col width="14.285%"><col width="14.285%"><col width="14.285%"><col width="14.285%"><col width="14.285%"></colgroup>';
                    html += '<tbody>';
                    html += '<tr>';
                    for(var i = 0; i < 7; i++) {
                        html += '<td>&nbsp;</td>';
                    }
                    html += '</tr>';
                    html += '</tbody>';
                    html += '</table>';
                    html += '</div>';
                    for(var i = 0; i < this.opt.sch.schItem.length; i++) {
                        var time = '<td class="txt_left"><b>' + this.opt.sch.schItem[i][5] + '</b></td>';
                        var suj = '<td class="txt_left">' + this.opt.sch.schItem[i][2] + '</td>';
                        var suj2 = '<td class="txt_left">' + this.opt.sch.schItem[i][4] + '</td>';
                        $calTbl.find('tbody').append('<tr>' + time + suj + suj2 + '</tr>');
                    }
                    $calTbodyGroup.each(function() {
                        for(var i = 0; i < _this.opt.sch.schMax; i++) {
                            $(this).append(html);
                        }
                    });
                },
                schParsing: function() {
                    var _this = this;
                    var $tbl = $('.calTbodyGroup .calendar_table');
                    for(var i = 0; i < this.opt.sch.schItem.length; i++) {
                        $tbl.find('td').each(function() {
                            var $thisIdx = $(this).index();
                            var $thisTxt = $(this).text();
                            var $thisParent = $(this).closest('.calTbodyGroup');
                            if($thisTxt == _this.opt.sch.schItem[i][1]) {
                                if(_this.opt.sch.schItem[i][0] != 1) {
                                    for(var o = 1; o < _this.opt.sch.schItem[i][0]; o++) {
                                        $thisParent.find('.scVirTableGroup td:eq(' + $thisIdx + ')').next().remove();
                                    }
                                }
                                var $spanW = 200;
                                $thisParent.find('.scVirTableGroup td:eq(' + $thisIdx + ')').attr('colspan', _this.opt.sch.schItem[i][0]).append('<span class="' + _this.opt.sch.schItem[i][3] + '" style="width:' + ($spanW * _this.opt.sch.schItem[i][0]) + 'px">' + (_this.opt.sch.schItem[i][5] + _this.opt.sch.schItem[i][2]) + '</span>');
                            }
                        });
                    }
                },
                resize: function() {
                    $('.calTbodyGroup').find('.scVirTableGroup td span').remove();
                    this.schParsing();
                }
            };
            this.each(function() {
                $.data(this, new CmmCalendal($(this), obj));
            });
            return this;
        },
        musMoveDragPraxx: function(obj) {
            /** 작업소스 예시
            $('.list li').each(function () {
            var $this = $(this);
            var $thisImg = $this.find('img');
            var $thisSpan = $this.find('.asdf');
            $this.musMoveDragPraxx({
            motions: [
            [$thisImg, '1', '0', '0', '5', '5'],
            ],
            offset: true,
            });
            });
            $('.item01').musMoveDragPraxx({
            motions: [
            ['.i01', '1', '3', '3', '5', '5'],
            ['.i02', '1', '6', '6', '5', '2'],
            ]
            });*/
            var defaults = {
                centerMode: true,
                perspective: 1000,
                motions: [
                    // [클래스, 방향, x거리 , y거리 , x축, y축]
                ],
                callb: {
                    'duration': 0,
                    'easing': 'swing',
                    'complete': function() {}
                },
                offset: true
            };

            function MusMoveDragParxx($this) {
                var _this = this;
                this.el = $this;
                this.elw = $this.width();
                this.elh = $this.height();
                this.obj = $.extend(true, defaults, obj);
                this.callb = function(callbObj) {
                    var extd = $.extend(true, _this.obj.callb, callbObj);
                    return extd;
                };
                this.setOffsetX = this.obj.centerMode ? this.el.width() / 2 : 0;
                this.setOffsetY = this.obj.centerMode ? this.el.height() / 2 : 0;
                this.init();
            };
            MusMoveDragParxx.prototype = {
                init: function() {
                    this.bind();
                },
                bind: function() {
                    var _this = this;
                    this.el.off().on({
                        'mousemove': function(event) {
                            _this.dir(event);
                        },
                        'mouseleave': function(event) {
                            _this.moving2('reset', '', '', event);
                        }
                    });
                },
                dir: function(event, offsetX) {
                    var crtOffsetX = this.obj.offset ? event.offsetX : event.clientX;
                    var crtOffsetY = this.obj.offset ? event.offsetY : event.clientY;
                    this.moving2('', crtOffsetX, crtOffsetY, event);
                },
                moving: function(direction, crtOffsetX, crtOffsetY) {
                    var _this = this;
                    var motions = this.obj.motions;
                    var transform = null;
                    for(var i = 0; i < motions.length; i++) {
                        var distance = function() {
                            var x = (crtOffsetX - _this.setOffsetX) * (motions[i][2] * 0.01);
                            var y = (crtOffsetY - _this.setOffsetY) * (motions[i][3] * 0.01);
                            var rx = (crtOffsetX - _this.setOffsetX) * (motions[i][5] * 0.01);
                            var ry = -(crtOffsetY - _this.setOffsetY) * (motions[i][4] * 0.01);
                            return {
                                x: x,
                                y: y,
                                rx: rx,
                                ry: ry
                            };
                        };
                        if(direction == 'reset') {
                            $(motions[i][0]).animate({
                                'transform': 'translateX(0) translateY(0) rotateX(0) rotateY( 0)'
                            }, 500);
                            return;
                        } else {
                            transform = 'translateX(' + distance().x + 'px) translateY(' + distance().y + 'px) rotateX(' + distance().ry + 'deg) rotateY( ' + distance().rx + 'deg)';
                        }
                        $(motions[i][0]).parent().css('perspective', '1000px');
                        $(motions[i][0]).css({
                            'transform': transform
                        });
                        $(motions[i][0]).find('.ppgr_inner').css('pointer-events', 'none');
                    }
                },
                moving2: function(direction, crtOffsetX, crtOffsetY, event) {
                    var _this = this;
                    var motions = this.obj.motions;
                    var transform = null;
                    var target = {
                        centerWidth: event.target.clientWidth / 2,
                        centerHeight: event.target.clientHeight / 2
                    };
                    for(var i = 0; i < motions.length; i++) {
                        var distance = function() {
                            var x = ((crtOffsetX - target.centerWidth) * -motions[i][2]) / target.centerWidth;
                            var y = ((crtOffsetY - target.centerHeight) * -motions[i][3]) / target.centerHeight;
                            var rx = ((crtOffsetX - target.centerWidth) * -motions[i][4]) / target.centerWidth;
                            var ry = ((crtOffsetY - target.centerHeight) * -motions[i][5]) / target.centerHeight;
                            return {
                                x: x,
                                y: y,
                                rx: rx,
                                ry: ry
                            };
                        };
                        if(direction == 'reset') {
                            $(motions[i][0]).addClass('animate');
                            $(motions[i][0]).find('.ppgr_img').addClass('animate');
                            $(motions[i][0]).find('.ppgr_inner').addClass('initboxshadow').css({
                                'pointer-events': 'inherit'
                            });
                            return;
                        } else {
                            transform = 'translateX(' + distance().x + 'px) translateY(' + distance().y + 'px) rotateX(' + distance().ry + 'deg) rotateY( ' + distance().rx + 'deg)';
                        }
                        $(motions[i][0]).parent().css('perspective', '1000px');
                        $(motions[i][0]).removeClass('animate').css({
                            'transform': transform
                        });
                        $(motions[i][0]).find('.ppgr_img').removeClass('animate').css({
                            'transform': transform
                        });
                        $(motions[i][0]).find('.ppgr_inner').removeClass('initboxshadow').css({
                            'pointer-events': 'none',
                            'box-shadow': '' + -(distance().x * 4) + 'px ' + (distance().y * 2) + 'px 0px rgba(0,0,0,0.05)'
                        });
                    }
                },
            }
            this.each(function() {
                $.data(this, new MusMoveDragParxx($(this), obj));
            });
            return this;
        },
        fileTreeUpdown: function(obj) {
            var defaults = {
                list: {
                    left: '', // ul태그만
                    right: '', // ul태그만
                },
                btns: {
                    left: '',
                    right: '',
                },
                contrBtns: {
                    up: '',
                    down: '',
                    maxUp: '',
                    maxDown: '',
                },
                dupChk: false,
                callb: function() {}
            };

            function FileTreeUpdown($this) {
                this.el = $this;
                this.num = 0;
                this.idx = 0;
                this.arry = null;
                this.obj = $.extend(true, defaults, obj);
                this.init();
            };
            FileTreeUpdown.prototype = {
                init: function() {
                    this.set();
                    this.updown();
                    this.bind();
                },
                set: function() {},
                updown: function() {
                    var btns = this.obj.contrBtns;
                    var _this = this;
                    var $target = $(this.obj.list.left + ',' + this.obj.list.right).find('>li');
                    $target.off().on({
                        'click': function() {
                            if($(this).is('.active')) {
                                $(this).removeClass('active');
                                return;
                            }
                            if(!_this.dupChk) {
                                $target.removeClass('active');
                            }
                            $(this).addClass('active');
                        },
                    });
                    this.el.find(btns.up).on({
                        'click': function() {
                            _this.updownMoving('up');
                            return false;
                        }
                    });
                    this.el.find(btns.down).on({
                        'click': function() {
                            _this.updownMoving('down');
                            return false;
                        }
                    });
                    this.el.find(btns.maxUp).on({
                        'click': function() {
                            _this.updownMoving('maxUp');
                            return false;
                        }
                    });
                    this.el.find(btns.maxDown).on({
                        'click': function() {
                            _this.updownMoving('maxDown');
                            return false;
                        }
                    });
                },
                updownMoving: function(type) {
                    var list = this.obj.list;
                    var _this = this;
                    var $this = null;
                    _this.arry = [];
                    this.el.find(this.obj.list.left + '>li').each(function() {
                        if($(this).is('.active')) {
                            switch (type) {
                                case 'up':
                                    $(this).prev().before($(this));
                                    break;
                                case 'down':
                                    _this.arry.unshift([$(this), $(this).index()]);
                                    break;
                                case 'maxUp':
                                    $(_this.obj.list.left).prepend($(this));
                                    break;
                                case 'maxDown':
                                    $(_this.obj.list.left).append($(this));
                                    break;
                            }
                        }
                    });
                    if(type == 'down') {
                        for(var i = 0; i < this.arry.length; i++) {
                            this.el.find(this.obj.list.left + '>li:eq(' + (this.arry[i][1] + 1) + ')').after(this.arry[i][0]);
                        }
                    }
                },
                bind: function() {
                    var btns = this.obj.btns;
                    var _this = this;
                    this.el.find(btns.right + ',' + btns.left).on({
                        'click': function(e) {
                            _this.moving(e.target);
                            return false;
                        },
                    });
                },
                moving: function(btnType) {
                    var lst = this.obj.list;
                    if(btnType == $(this.obj.btns.right)[0]) {
                        $(lst.left).find('>li').each(function() {
                            if($(this).is('.active')) {
                                $(lst.right).append($(this));
                            }
                        });
                    } else {
                        $(lst.right).find('>li').each(function() {
                            if($(this).is('.active')) {
                                $(lst.left).append($(this));
                            }
                        });
                    }
                    if(typeof this.obj.callb === 'function') {
                        this.obj.callb();
                    }
                },
            };
            this.each(function() {
                $.data(this, new FileTreeUpdown($(this), obj));
            });
            return this;
        },
        customScrollBar: function(obj) {
            /*
            $(target).customScrollBar();
            <div class="target">
            	<div>내용내용</div>
            </div>
            */
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
        swipListBtns: function(obj) {
            var defaults = {
                minDistance: 20,
                maxDistance: 30,
                animatecallb: {
                    'duration': 50,
                    'easing': 'easeOutExpo',
                }
            };

            function SwipListBtns($this) {
                this.el = $this;
                this.oriEvents = null;
                this.moveObj = {};
                this.obj = $.extend(true, defaults, obj);
                this.clientXArry = [];
                this.movedir = function(dirobj) {
                    if(dirobj) {
                        return $.extend(true, {
                            'start': null,
                            'end': null
                        }, dirobj);
                    }
                };
                this.initNum = 0;
                this.acallb = $.extend(true, {
                    'duration': 300,
                    'easing': 'easeOutExpo',
                    'complete': function() {}
                }, this.obj.animatecallb);
                this.init();
            };
            SwipListBtns.prototype = {
                init: function() {
                    this.bind();
                },
                bind: function() {
                    var _this = this;
                    var distanceStart = null;
                    var distanceEnd = null;
                    this.el.each(function() {
                        $(this).bind({
                            'touchstart': function(event) {
                                distanceStart = event.originalEvent.changedTouches[0].clientX;
                            },
                            // 'touchmove': function(event) {
                            // var offsetX = event.originalEvent.changedTouches[0].clientX;
                            // //if (offsetX > _this.obj.minDistance && offsetX < _this.obj.maxDistance) _this.cnt(offsetX);
                            // },
                            'touchend': function(event) {
                                distanceEnd = event.originalEvent.changedTouches[0].clientX;
                                // this.clientXArry = new Array();
                                _this.moveSet(distanceStart, distanceEnd);
                            },
                        });
                    });
                },
                moveSet: function(distanceStart, distanceEnd) {
                    var movedir = this.movedir({
                        'start': distanceStart,
                        'end': distanceEnd
                    });
                    if(Math.abs(movedir.start - movedir.end) > this.obj.minDistance) this.move(movedir);
                },
                move: function(movedir) {
                    if(movedir.start > movedir.end) { // 열기
                        this.el.stop().animate({
                            'transform': 'translateX(-' + this.obj.maxDistance + 'px)'
                        }, this.acallb);
                    } else { // 닫기
                        this.el.stop().animate({
                            'transform': 'translateX(0px)'
                        }, this.acallb);
                    }
                },
            };
            this.each(function() {
                $.data(this, new SwipListBtns($(this), obj));
            });
            return this;
        },
        rowGraph: function(obj) {
            /** 미병 */
            var defaults = {
                line: null,
                lineClassName: 'sline',
                value: null,
                responsive: true,
                animated: false,
            };

            function RowGraph($this) {
                var _this = this;
                this.el = $this;
                this.obj = $.extend(true, defaults, obj);
                this.w = function() {
                    return (this.obj.value.current / this.obj.value.max) * 100;
                };
                this.init();
                if(this.obj.responsive) {
                    $(window).smartresize(function() {
                        _this.resize();
                    });
                }
            };
            RowGraph.prototype = {
                init: function() {
                    this.settings();
                    this.move();
                },
                settings: function() {
                    if(this.obj.imgcut.stepimgs) {
                        for(var i = 1; i < this.obj.imgcut.stepimgs.length; i++) {
                            this.el.append($('<i></i>').addClass(this.obj.lineClassName + ' ' + this.obj.lineClassName + (i - 1)));
                        }
                    }
                },
                imgcuts: function() {
                    var imgcut = this.obj.imgcut;
                    var cnt = 0;
                    var num = 0;
                    while(!(this.w() - cnt <= (100 / imgcut.stepimgs.length))) {
                        cnt += 100 / imgcut.stepimgs.length;
                        num++;
                    }
                    $(imgcut.targetimg).addClass(imgcut.stepimgs[num][0]);
                    $(imgcut.targettxt).text(imgcut.stepimgs[num][1]);
                },
                move: function() {
                    var duration = this.obj.animated ? 1000 : 0;
                    $(this.obj.bar).stop().animate({
                        'width': this.w() + '%'
                    }, {
                        'duration': duration,
                        'easing': 'easeOutExpo'
                    });
                    this.imgcuts();
                },
                resize: function() {
                    // this.move();
                },
            };
            this.each(function() {
                $.data(this, new RowGraph($(this), obj));
            });
            return this;
        },
    });
})(jQuery);
/*
 * smartresize 기반의 resize개념 https://gist.github.com/Pushplaybang/3341936
 */
(function($, sr) {
    var debounce = function(func, threshold, execAsap) {
        var timeout;
        return function debounced() {
            var obj = this,
                args = arguments;

            function delayed() {
                if(!execAsap) func.apply(obj, args);
                timeout = null;
            };
            if(timeout) clearTimeout(timeout);
            else if(execAsap) func.apply(obj, args);
            timeout = setTimeout(delayed, threshold || 150);
        };
    }
    jQuery.fn[sr] = function(fn) {
        return fn ? this.bind('resize', debounce(fn)) : this.trigger(sr);
    };
})(jQuery, 'smartresize');
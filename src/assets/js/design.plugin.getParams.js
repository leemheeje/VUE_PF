/*
* 호출할때, 
$(document).ready(function(){
$(this).getParams('testparams');
});
* arguments[0] = 구하려고하는 파라미터명 생략불가능
* arguments[1] = 파라미터 시작점문구 특별하게 변경하지않는한 "?" 생략가능
* arguments[2] = 파라미터 연결점문구 특별하게 변경하지않는한 "&" 생략가능
* arguments[3] = 구하고자 하는 location 을 입력 생략가능
*/
;
(function($) {
    $.fn.extend({
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
    });
})(jQuery);
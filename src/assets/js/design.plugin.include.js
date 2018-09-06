/*
* 호출할때, 
$(document).ready(function(){
$(this).include(true);
});
*/
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
    });
})(jQuery);

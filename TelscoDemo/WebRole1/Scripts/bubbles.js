
//$(function () {
//    function fadingScroller($el) {
//        $el.animate({ 'opacity': 0 }, 1000);
//        $el.hide('slow', function () {
//            $el.parent().append($el);
//            $el.show();
//            $el.animate({ 'opacity': 1 }, 1000);
//            setTimeout(function ($el) {
//                return function () {
//                    fadingScroller($($el.selector));
//                };
//            }($el), 2000);
//        });
//    }
//    fadingScroller($('#container div:first'));
//});

//$(document).ready(function () {

//    var addCircle = function (option) {
//        var $circle = $('<div class="circle"></div>');
//        $circle.animate({
//            'width': '300px',
//            'height': '300px',
//            'margin-top': '-150px',
//            'margin-left': '-150px',
//            'opacity': '0'
//        }, 4000);
//        $(option).append($circle);

//        setTimeout(function __remove() {
//            $circle.remove();
//        }, 1000);
//    }
//    addCircle("#mainDot");
//    setInterval(function () { addCircle("#mainDot"); }, 1200);
//    addCircle("#mainDot1");
//    setInterval(function () { addCircle("#mainDot1"); }, 1200);
//    addCircle("#mainDot");
//    setInterval(function () { addCircle("#mainDot2"); }, 1200);

//});
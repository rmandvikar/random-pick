//{ stubs

if (typeof console === "undefined") {
    console = {
        log: function() {},
        info: function() {},
        warn: function() {},
        error: function() {}
    };
}

//}

//{ random

function Random() {}
Random.prototype.next = function(limit) {
    return Math.floor((Math.random() * limit));
}

//}

//{ init

var random = new Random();
var msv = ['foo', 'bar', 'baz', 'qux', 'norf'];
var count = 0;

function getItem(item) {
    return '<p class="element rounded">' +
        '&nbsp;<span contenteditable="true">' + (item || msv[random.next(msv.length)]) + '</span>&nbsp;' +
        '<a href="#" class="cross circle" tabindex="-1">x</a>' +
        '</p>';
}

function showCount() {
    $('.feedback span:eq(-1)').stop(true).text(count).hide().fadeIn(1000).fadeOut(1000);
}

$(document).ready(function() {
    // remove element
    $('.elements').on('click', 'p.element a.cross', function(e) {
        e.preventDefault();
        $(this).parent().remove();
        count--;
        showCount();
        return false;
    });
    // pick command
    $('.commands a.pick').click(function(e) {
        e.preventDefault();
        var elementCount = $('.elements p.element').length;
        var winnerIndex = random.next(elementCount);
        console.log(winnerIndex + " /" + "0.." + (elementCount - 1));
        $('.elements p.element').removeClass('transition tilecolor2048').each(function(e) {
            $(this).find('span').removeClass('winner');
        });
        setTimeout(function() {
            $('.elements p.element').eq(winnerIndex).addClass('transition tilecolor2048').each(function(e) {
                $(this).find('span').addClass('winner');
            });
        }, 0);
        return false;
    });
    // add command
    $('.commands a.add').click(function(e) {
        e.preventDefault();
        $(getItem()).hide().appendTo('.elements').fadeIn();
        count++;
        showCount();
        return false;
    });
    // create elements
    for (var i = 0; i < msv.length; i++) {
        (function(index) {
            setTimeout(function() {
                $('.elements').append(getItem(msv[index]));
            }, (index+1) * 111);
        })(i);
        count++;
    }
    // avoid enter key in editable
    $('.elements').on('keypress', '[contenteditable=true]', function(e) {
        if (e.keyCode == 13) {
            e.preventDefault();
            return false;
        }
    });
    // show
    $('div.pick').fadeIn(1000);
    setTimeout(function() {
        showCount();
    }, 1000);
});

//}
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

function getItem(item) {
    return '<p class="element rounded">' +
        '&nbsp;<span contenteditable="true">' + (item || msv[random.next(msv.length)]) + '</span>&nbsp;' +
        '<a href="#" class="cross circle" tabindex="-1">x</a>' +
        '</p>';
}

function showCount() {
    var count = $('.elements p.element').length;
    $('.feedback span:eq(-1)').stop(true).text(count).hide().fadeIn(1000).fadeOut(1000);
}

$(document).ready(function() {
    // remove element
    $('.elements').on('click', 'p.element a.cross', function(e) {
        e.preventDefault();
        $(this).parent().remove();
        showCount();
        return false;
    });
    // pick command
    $('.commands a.pick').click(function(e) {
        e.preventDefault();
        var elementCount = $('.elements p.element').length;
        var winnerIndex = random.next(elementCount);
        console.log(winnerIndex + " /" + "0.." + (elementCount - 1));
        $('.elements p.element').removeClass('tilecolor2048').each(function(e) {
            $(this).find('span').removeClass('winner');
        });
        $('.elements p.element').eq(winnerIndex).addClass('tilecolor2048').each(function(e) {
            $(this).find('span').addClass('winner');
        });
        return false;
    });
    // add command
    $('.commands a.add').click(function(e) {
        e.preventDefault();
        $('.elements').append(getItem());
        showCount();
        return false;
    });
    // create elements
    for (var i = 0; i < msv.length; i++) {
        $('.elements').append(getItem(msv[i]));
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
    }, 0);
});

//}
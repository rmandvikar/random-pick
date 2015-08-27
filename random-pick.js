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
var isbiased = false;
var id = 0;

function getItem(item) {
    return '<p class="element rounded">' +
        '<a href="#" class="cross circle" tabindex="-1">x</a>' +
        '<input type="text" class="rounded" value="' + (item || msv[random.next(msv.length)]) + '" id="' + id++ + '">' +
        '</p>';
}

function showCount() {
    $('.feedback span:eq(-1)').stop(true).text(count).hide().fadeIn(1000).fadeOut(1000);
}

window.onbeforeunload = function () {
    console.log('onbeforeunload');
    saveItems();
}

function saveItems() {
    if (localStorage) {
        var items = [];
        $('.elements p.element input').each(function() {
            items.push($(this).val());
        });
        localStorage['randompick.items'] = JSON.stringify(items);
    }
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
        if (isbiased) {
            $('.elements p.element').each(function(index) {
                if ($(this).find('input').val().toLowerCase() == "hippy") {
                    winnerIndex = index;
                    return false;
                }
            });
        }
        console.log(winnerIndex + " /" + "0.." + (elementCount - 1));
        $('.elements p.element').removeClass('transition tilecolor2048').each(function(e) {
            $(this).find('input').removeClass('transition winner tilecolor2048');
        });
        $('.elements p.element').eq(winnerIndex).each(function(e) {
            $(this).find('input').addClass('winner');
        });
        setTimeout(function() {
            $('.elements p.element').eq(winnerIndex).addClass('transition tilecolor2048').each(function(e) {
                $(this).find('input').addClass('transition tilecolor2048');
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
    var items = msv;
    if (localStorage) {
        if (localStorage['randompick.items']) {
            var lsitems = JSON.parse(localStorage['randompick.items']);
            if (lsitems != null && lsitems.length > 0) {
                items = lsitems;
            }
        }
        items = items || msv;
    }
    for (var i = 0; i < items.length; i++) {
        (function(index) {
            setTimeout(function() {
                $('.elements').append(getItem(items[index]));
            }, (index+1) * 111);
        })(i);
        count++;
    }
    $('.elements').on('focus tap', 'input', function(e) {
        $(this).select();
    });
    // keep tab keypress rotating
    $(".elements").on('keydown', 'input', function(e) { 
        var keyCode = e.keyCode || e.which;
        if (keyCode == 9) {
            if ($(this).attr('id') == $('.elements p.element input').last().attr('id')) {
                e.preventDefault();
                $('.elements p.element input').first().select();
                return false;
            }
        }
        return true;
    });
    // show
    $('div.pick').fadeIn(1000);
    setTimeout(function() {
        showCount();
    }, 1000);
    // bias hack
    $('.footer').click(function() {
        isbiased = !isbiased;
        console.log(isbiased);
        $('.footer a').toggleClass('horns nohorns');
    });
});

//}
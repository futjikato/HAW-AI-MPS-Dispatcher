(function($) {
    $('nav').on('click', 'a', function(e) {
        e.preventDefault();

        var page = $(this).attr('href').substr($(this).attr('href').indexOf('#') + 1);

        $('div.pages>div').hide();
        $('div.pages>div[data-anchor="' + page + '"]').show();
    });
})($);
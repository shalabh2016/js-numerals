'use strict';

function numberToWord() {
    var num = $('#number').val();
    $('#toWord').text(process(num));
}

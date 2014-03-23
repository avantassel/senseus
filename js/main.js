function loadIframe(iframeName, url) {
    var $iframe = $('#' + iframeName);
    if ( $iframe.length ) {
        $iframe.attr('src',url);   
        return false;
    }
    return true;
}

$(document).ready(function() {

	$('.bottom .btn').on('click', function() {
		$('.bottom .btn').removeClass('active');
		$(this).addClass('active');

		var newData = $(this).text();
		$('#first').html(newData + ' <span class="glyphicon glyphicon-remove-sign"></span>');
	});

	$('.big span').on('click', function() {
		$('.big span').removeClass('active');
		$(this).addClass('active');
	});

});
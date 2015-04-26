$(function () {
	$('.pagination .disabled a').on('click', function(e) {
		e.preventDefault();
		return false;
	})
});

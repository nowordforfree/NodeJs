$(function () {
	var initIsbn = window.location.href.match(/\d{3}-\d{10}/);
	$("#createForm").on("submit", function(e) {
		$(".with-errors").empty();
		var pass = true;
		if (!$("#name").val().length) {
			pass = false;
			setError($("#name").parent().find(".help-block.with-errors"), "Please set name of new Book");
			$("#name").closest(".form-group").addClass("has-error");
		} else { $("#name").closest(".form-group").removeClass("has-error").addClass("has-success"); }
		if (!$("#isbn").val().length || !$("#isbn").val().match(/^\d{3}-\d{10}$/)) {
			pass = false;
			setError($("#isbn").parent().find(".help-block.with-errors"), "Please provide correct ISBN number");
			$("#isbn").closest(".form-group").addClass("has-error");
		} else {
			$.ajax({
				dataType: "json",
				async: false,
				url: initIsbn ? window.location.href.replace(/update.+/i, "getbook") : window.location.href.replace(/create/i, "getbook"),
				data: "isbn=" + $("#isbn").val(),
				complete: IsbnValidate
			});
		}
		if (!$("#year").val().length) {
			pass = false;
			setError($("#year").parent().find(".help-block.with-errors"), "Please provide year of this book");
			$("#year").closest(".form-group").addClass("has-error");
		} else { $("#year").closest(".form-group").removeClass("has-error").addClass("has-success"); }
		if (!$("#author").val().length) {
			pass = false;
			setError($("#author").parent().find(".help-block.with-errors"), "Please provide author of this book");
			$("#author").closest(".form-group").addClass("has-error");
		} else { $("#author").closest(".form-group").removeClass("has-error").addClass("has-success"); }
		if (!$("#pages").val().match(/^\d+$/)) {
			pass = false;
			setError($("#pages").parent().find(".help-block.with-errors"), "Please provide correct number of pages in this book");
			$("#pages").closest(".form-group").addClass("has-error");
		} else { $("#pages").closest(".form-group").removeClass("has-error").addClass("has-success"); }
		if ($("#url").val().length > 0 && !$("#url").val().match(/^http[s]?:\/\/www.amazon.com.+/)) {
			pass = false;
			setError($("#url").parent().find(".help-block.with-errors"), "Only url to amazon is valid");
			$("#url").closest(".form-group").addClass("has-error");
		} else { $("#url").closest(".form-group").removeClass("has-error").addClass("has-success"); }

		function IsbnValidate (data) {
			if (data.responseJSON.length) {
				if (initIsbn && data.responseJSON[0].isbn == initIsbn)
					{ $("#isbn").closest(".form-group").removeClass("has-error").addClass("has-success"); }
				else {
					pass = false;
					setError($("#isbn").parent().find(".help-block.with-errors"), "Book with such ISBN number is already exist in database. Please provide unique number");
					$("#isbn").closest(".form-group").addClass("has-error");
				}
			}
			else $("#isbn").closest(".form-group").removeClass("has-error").addClass("has-success");
		}

	if (!pass) {
		e.preventDefault();
		return false;
	}
})
function setError(container, errorMessage) {
	$(container).append("<p>" + errorMessage + "</p>");
}
});

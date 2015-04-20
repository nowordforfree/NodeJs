$(function() {

	$("#filter").click(function(e) {
		e.preventDefault();
		$("#wrapper").toggleClass("toggled");
	});

	var rows = $("#books-data tbody>tr");
	for (var i = 0; i < rows.length; i++) {
		$(rows[i]).on('click', function() {
			window.location.href = window.location.href.replace(/home(.+)?/i,
				'view?isbn=' + $(this).children(':first').text() );
		});
		$(rows[i]).find(".glyphicon-pencil").parent().on('click', function(e) {
			e.stopPropagation();
			window.location.href = window.location.href.replace(/home(.+)?/i,
				'update?isbn=' + $(this).closest('tr').children(':first').text());
			return false;
		});
		$(rows[i]).find(".glyphicon-trash").parent().on('click', function(e) {
			e.stopPropagation();
			var booksummary = "<div class='form-group'><label class='col-sm-3 control-label' for='isbn'>ISBN13:</label>" +
								"<div class='col-sm-9'>" +
								"<input class='form-control' type='text' name='isbn' id='isbn' value='" +
								$(this).closest('tr').children()[0].textContent + "' readonly /> </div> </div>" +
							  "<div class='form-group'><label class='col-sm-3 control-label' for='name'>Book Name:</label>" +
								"<div class='col-sm-9'>" +
								"<input class='form-control' type='text' name='name' value='" +
								$(this).closest('tr').children()[1].textContent + "' readonly /> </div> </div>";
			$("#bookDeleteModal .modal-body .summary").html(booksummary);
			$("#bookDeleteModal .modal-body .row").val($(this).closest('tr').index() + 1);
			$("#bookDeleteModal").modal("show", { backdrop: "static" });
			return false;
		});
	};

	$("#bookDeleteModal .btn-danger").on('click', function() {
		var index = $("#bookDeleteModal .modal-body .row").val()
		$.ajax({
			type: 'DELETE',
			url: window.location.href.replace(/home.+/i, 'delete') + '?isbn=' + $("#bookDeleteModal #isbn").val(),
			complete: function() {
				$("#books-data tr:eq("+index+")").remove();
			}
		});
	});
})
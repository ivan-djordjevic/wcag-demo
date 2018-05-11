/**
 * Method for displaying modal.
 * Options object disables built-in Bootstrap functionallity - hide on ESC key and auto focus of the modal
 */
var showModal = function() {
	var options = {
		keyboard: false, // disable "ESC" key press for dismissing the modal
		focus: false // disable auto focus of modal elements
	};
	
	$('#exampleModal').modal(options);
};
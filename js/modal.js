/**
 * Container element for modal dialog markup
 */
var modalContainer = $('#exampleModal');

/**
 * Array of elements inside the modal which can receive focus
 */
var modalFocusableItems = [];

/**
 * jQuery selector for all elements that can receive focus
 */
var focusableSelector =  ":input, a[href], area[href], iframe";

/**
 * Element which was focused right before modal was displayed
 */
var modalTriggerElement;

/**
 * Method for displaying modal.
 * Options object disables built-in Bootstrap functionallity - hide on ESC key and auto focus of the modal
 */
var showModal = function() {
	modalTriggerElement = document.activeElement;
	var options = {
		keyboard: false, // disable "ESC" key press for dismissing the modal
		focus: false // disable auto focus of modal elements
	};
	
	modalContainer.modal(options);
};

/**
 * Method for showing the modal when span is focused
 */
handleSpanKeydown = function(event) {
	if (event.which === 32 || event.which === 13) {
		showModal();
	}
};

/**
 * Handler for all keydown events inside the modal.
 * It traps the focus inside it - if last focusable element is currently focused and user presses TAB focus is moved to the first focusable element. Same for SHIFT + TAB - if first elements is focused after that focus is moved to the last in the list.
 * On ESC key modal is closed 
 */
modalContainer.on("keydown", function(event)
{
	// handle only tab key press
	if (event.which === 9)
	{
		// check if we already have list of focusable elements
		if (modalFocusableItems.length < 1)
		{
			enumFocusable(modalContainer);
		}
		
		var focusedElement = $(document.activeElement);
		var lastFocusable =  findLastFocusable();
		var firstFocusable = findFirstFocusable();
		
		if (!event.shiftKey && lastFocusable !== false && focusedElement[0] == lastFocusable[0])
		{
			event.stopPropagation();
			event.preventDefault();
			firstFocusable[0].focus();
		}
		else if (event.shiftKey && firstFocusable !== false && focusedElement[0] == firstFocusable[0])
		{
			event.stopPropagation();
			event.preventDefault();
			lastFocusable[0].focus();
		}
	}
	else if (event.which === 27) // handle ESC key
	{
		modalContainer.modal('hide');
	}
});

/**
 * Bootstrap event handler when modal is shown.
 * Focus first focusable element inside the modal or last visible button
 */
modalContainer.on('shown.bs.modal', function (e) {

	var modalBody = modalContainer.find('.modal-body');
	if(modalBody.length > 0)
	{
		var focusableElements = modalBody.find(focusableSelector + ' [tabindex]:not([tabindex="-1"])');
		if(focusableElements.length > 0)
		{
			focusableElements[0].focus();
			return true;
		}
	}
	//otherwise we just focus the last visible button
	var lastVisibleButton = modalContainer.find('button:visible:last');
	lastVisibleButton.focus();
});

/**
 * Bootstrap event handler when modal is hidden.
 * Set focus back to the element which triggered the modal
 */
modalContainer.on('hidden.bs.modal', function (e) {
	if (modalTriggerElement)
	{
		modalTriggerElement.focus();
	}
});

/**
 * Helper function used for finding all the focusable elements in the list
 */
var canFocus = function(el)
{
	var tabIndex = +$(el).attr( "tabindex" );
	tabIndex = isNaN( tabIndex ) ? -1 : tabIndex;
	return $(el).is(focusableSelector) || tabIndex > -1;
};

/**
 * Helper function used for indexing all the focusable elements.
 * Populates the array of focusable elements. Recursively parses all the child elements.
 */
var enumFocusable = function(node)
{
	//clear the previous array if we are starting from the root node
	if (node === modalContainer) 
	{
		modalFocusableItems = [];
	}

	node = $(node);
	var nodeC = node.children();
	
	if(canFocus(node))
	{
		modalFocusableItems.push(node);
	}
	
	if(nodeC && nodeC.length)
	{
		for (var i = 0; i < nodeC.length; i++)
		{
			enumFocusable(nodeC[i]);
		}
	}
};

/**
 * Helper function that returns the first element in the list of currently focusable elements
 */
var findFirstFocusable = function()
{
	for (var index = 0; index < modalFocusableItems.length; index++)
	{
		if (!$(modalFocusableItems[index]).is(':hidden') && !$(modalFocusableItems[index]).is(':disabled'))
		{
			return modalFocusableItems[index];
		}
	}
	return false;
};

/**
 * Helper function that returns the last element in the list of currently focusable elements
 */
var findLastFocusable = function()
{
	for (var index = modalFocusableItems.length - 1; index >= 0; index--)
	{
		if (!$(modalFocusableItems[index]).is(':hidden') && !$(modalFocusableItems[index]).is(':disabled'))
		{
			return modalFocusableItems[index];
		}
	}
	return false;
};
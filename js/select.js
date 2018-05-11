/**
 * Container element for custom select dropdown
 */
var selectbox = $('.dropdown.selectbox');

/**
 * Array of elements representing options of the custom select element
 */
var options = selectbox.find('.dropdown-item');

/**
 * Handle click event on each custom option
 */
options.on('click', function(event){
	event.preventDefault();
	var me = $(this);
	var myParent = me.parents('.dropdown.selectbox');
	var myButton = myParent.find('.dropdown-toggle');
	var myOptions = myParent.find('.dropdown-item');
	myButton.html(me.html()); // update the value of the button container with selected option
	myOptions.removeClass('active'); // close the dropdown
	me.addClass('active');
	myButton.focus(); // set focus back to the toggle button
});

/**
 * Select the entire "tree" container
 */
var tree = $('.tree');
tree.find('.treegroup').addClass('hidden'); // collapse all the sublevels

/**
 * Select all icons in front of an option
 */
var treeExpands = tree.find(".expcoll");
treeExpands.html("+"); // set their value to "+", since they are all collapsed

/**
 * Handle click event on each "plus" or "minus" sign
 */
treeExpands.on('click',function(event){
	var me = $(this);
	myNode = me.parent('.treenode');
	mySubTree = myNode.find("> .treegroup");
	
	if(mySubTree.hasClass('hidden')){ // if sublevels are hidden - we will show them and change the icon to "-"
		mySubTree.removeClass('hidden');
		me.html("-");
	} else { // if sublevels are displayed - we will hide them and change icont to "+"
		mySubTree.addClass('hidden');
		me.html("+");
	}
});

$('.expcoll').attr('aria-hidden', true); // set aria-hidden attribute to true for plus/minus elements so they are not read by the screen reader

/**
 * Select all the list items that contain subitems. They have tabindex set to 0 so they are focusable. We'll handle key events triggered on them later
 */
var treeNodeWithChildren = $('.treenode').has('.treegroup');
treeNodeWithChildren.attr('aria-expanded', false); // set aria-expanded to false - since they are all initially collapsed

treeNodeWithChildren.on('keydown',function(event){
	if (event.target == event.currentTarget) // ignore events that come from child elements
	{
		event.stopPropagation();
	
		var me = $(this);
		var mySubTree = $(me.find("> ul.treegroup")[0]);
		var plusMinus = $(me.find('> .expcoll')[0]);	
		var myAction = me.find('> .treeLinkl');
		
		if (event.keyCode === 39){ // on right arrow show the sublevel, inform the screen reader and change the icon to -
			me.attr('aria-expanded', true);
			mySubTree.removeClass('hidden');
			plusMinus.html("-");
		} else if (event.keyCode === 37){ // on left arrow show the sublevel, inform the screen reader and change the icon to -
			me.attr('aria-expanded', false);
			mySubTree.addClass('hidden');
			plusMinus.html("+");
		}
	}
});

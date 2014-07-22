function resizeEditor(){
	var contet_edit = $('.editor-main');
	var editorDiv = contet_edit.closest('div.editor');
	var child_height = editorDiv.height();

	contet_edit.css('height', child_height);
	$( ".accordion" ).accordion('refresh');
}



$(function(){
	var menys = new Object();
	menys.left = Meny.create({
	    menuElement: document.querySelector( '.meny_left' ),
	    contentsElement: document.querySelector( '#many_wrapper_menu_left' ),
	    position: 'left',
	    height: 200,
	    width: 300,
	    mouse: true,
	    touch: true
	});
	
	menys.right = Meny.create({
	    menuElement: document.querySelector( '.meny_right' ),
	    contentsElement: document.querySelector( '#many_wrapper_menu_right' ),
	    position: 'right',
	    height: 200,
	    width: 260,
	    mouse: true,
	    touch: true,
	});
	menys.top = Meny.create({
	    menuElement: document.querySelector( '.meny_top' ),
	    contentsElement: document.querySelector( '#many_wrapper_menu_top' ),
	    position: 'top',
	    height: 200,
	    width: 260,
	    mouse: true,
	    touch: true,
	    threshold:10,
	});

	menys.bottom = Meny.create({
	    menuElement: document.querySelector( '.meny_bottom' ),
	    contentsElement: document.querySelector( '#many_wrapper_menu_bottom' ),
	    position: 'bottom',
	    height: 200,
	    width: 260,
	    mouse: true,
	    touch: true,
	    threshold:20,
	});
	
});


$(function() {
	$( ".accordion" ).accordion({
		heightStyle: "fill"
	});
   
	
	resizeEditor();
	$(window).resize(function() {
		resizeEditor();
		});
});



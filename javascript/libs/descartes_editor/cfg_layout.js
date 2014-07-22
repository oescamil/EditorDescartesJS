function cfgOuterDescartesEditorLayout(element){
	var layoutSettings_Outer = {
			name: "outerLayout" // NO FUNCTIONAL USE, but could be used by custom code to 'identify' a layout
			// options.defaults apply to ALL PANES - but overridden by pane-specific settings
		,	defaults: {
				size:					"auto"
			,	minSize:				50
			,	paneClass:				"pane" 		// default = 'ui-layout-pane'
			,	resizerClass:			"resizer"	// default = 'ui-layout-resizer'
			,	togglerClass:			"toggler"	// default = 'ui-layout-toggler'
			,	buttonClass:			"button"	// default = 'ui-layout-button'
			,	contentSelector:		".content"	// inner div to auto-size so only it scrolls, not the entire pane!
			,	contentIgnoreSelector:	"span"		// 'paneSelector' for content to 'ignore' when measuring room for content
			,	togglerLength_open:		35			// WIDTH of toggler on north/south edges - HEIGHT on east/west edges
			,	togglerLength_closed:	35			// "100%" OR -1 = full height
			,	hideTogglerOnSlide:		true		// hide the toggler when pane is 'slid open'
			,	togglerTip_open:		"Close This Pane"
			,	togglerTip_closed:		"Open This Pane"
			,	resizerTip:				"Resize This Pane"
			//	effect defaults - overridden on some panes
			,	fxName:					"slide"		// none, slide, drop, scale
			,	fxSpeed_open:			750
			,	fxSpeed_close:			1500
			,	fxSettings_open:		{ easing: "easeInQuint" }
			,	fxSettings_close:		{ easing: "easeOutQuint" }
		}
		,	north: {
				paneSelector:			"#scenes-prop"
				,	size:					250
				,	spacing_closed:			21			// wider space when closed
				,	togglerLength_closed:	21			// make toggler 'square' - 21x21
				,	togglerAlign_closed:	"top"		// align to top of resizer
				,	togglerLength_open:		0			// NONE - using custom togglers INSIDE west-pane
				,	togglerTip_open:		"Close West Pane"
				,	togglerTip_closed:		"Open West Pane"
				,	resizerTip_open:		"Resize West Pane"
				,	slideTrigger_open:		"click" 	// default
				,	initClosed:				true
				//	add 'bounce' option to default 'slide' effect
				,	fxSettings_open:		{ easing: "easeOutBounce" }
			}
		,	south: {
				paneSelector:			"#programa",
				maxSize:				200
			,	spacing_closed:			0			// HIDE resizer & toggler when 'closed'
			,	slidable:				false		// REFERENCE - cannot slide if spacing_closed = 0
			,	initClosed:				true
			//	CALLBACK TESTING...
			,	onhide_start:			function () { return confirm("START South pane hide \n\n onhide_start callback \n\n Allow pane to hide?"); }
			,	onhide_end:				function () { alert("END South pane hide \n\n onhide_end callback"); }
			,	onshow_start:			function () { return confirm("START South pane show \n\n onshow_start callback \n\n Allow pane to show?"); }
			,	onshow_end:				function () { alert("END South pane show \n\n onshow_end callback"); }
			,	onopen_start:			function () { return confirm("START South pane open \n\n onopen_start callback \n\n Allow pane to open?"); }
			,	onopen_end:				function () { alert("END South pane open \n\n onopen_end callback"); }
			,	onclose_start:			function () { return confirm("START South pane close \n\n onclose_start callback \n\n Allow pane to close?"); }
			,	onclose_end:			function () { alert("END South pane close \n\n onclose_end callback"); }
			//,	onresize_start:			function () { return confirm("START South pane resize \n\n onresize_start callback \n\n Allow pane to be resized?)"); }
			,	onresize_end:			function () { alert("END South pane resize \n\n onresize_end callback \n\n NOTE: onresize_start event was skipped."); }
			}
		,	south: {
				paneSelector:			"#programa"
			,	size:					250
			,	spacing_closed:			21			// wider space when closed
			,	togglerLength_closed:	21			// make toggler 'square' - 21x21
			,	togglerAlign_closed:	"top"		// align to top of resizer
			,	togglerLength_open:		2			// NONE - using custom togglers INSIDE west-pane
			,	togglerTip_open:		"Close West Pane"
			,	togglerTip_closed:		"Open West Pane"
			,	resizerTip_open:		"Resize West Pane"
			,	slideTrigger_open:		"click" 	// default
			,	initClosed:				true
			//	add 'bounce' option to default 'slide' effect
			,	fxSettings_open:		{ easing: "easeOutBounce" }
		}
		,	east: {
				paneSelector:			"#menu-preconfig" 
			,	size:					250
			,	spacing_closed:			21			// wider space when closed
			,	togglerLength_closed:	21			// make toggler 'square' - 21x21
			,	togglerAlign_closed:	"top"		// align to top of resizer
			,	togglerLength_open:		0			// NONE - using custom togglers INSIDE west-pane
			,	togglerTip_open:		"Close West Pane"
			,	togglerTip_closed:		"Open West Pane"
			,	resizerTip_open:		"Resize West Pane"
			,	slideTrigger_open:		"over" 	// default
			,	initClosed:				false
			//	add 'bounce' option to default 'slide' effect
			,	fxSettings_open:		{ easing: "easeOutBounce" }
			}
		,	west: {
				paneSelector:			"#menu-objects" 
			,	size:					250
			,	spacing_closed:			21			// wider space when closed
			,	togglerLength_closed:	21			// make toggler 'square' - 21x21
			,	togglerAlign_closed:	"top"		// align to top of resizer
			,	togglerLength_open:		0 			// NONE - using custom togglers INSIDE east-pane
			,	togglerTip_open:		"Close East Pane"
			,	togglerTip_closed:		"Open East Pane"
			,	resizerTip_open:		"Resize East Pane"
			,	slideTrigger_open:		"mouseover"
			,	initClosed:				false
			//	override default effect, speed, and settings
			,	fxName:					"drop"
			,	fxSpeed:				"normal"
			,	fxSettings:				{ easing: "" } // nullify default easing
			}
		,	center: {
				paneSelector:			"#escenes" 			// sample: use an ID to select pane instead of a class
			,	minWidth:				200
			,	minHeight:				200
			}
		};
	
	layoutSettings_Outer_2 = {
			name: "outerLayout"
			,	defaults: {
					size:					"auto"
				,	hideTogglerOnSlide:		true		// hide the toggler when pane is 'slid open'
				,	fxSpeed_open:			750
				,	fxSpeed_close:			800
				,	fxSettings_open:		{ easing: "easeOutBounce" }
				,	fxSettings_close:		{ easing: "easeOutBounce" }
			}
			,	south: {
					paneSelector:	".program-pane"
				,	size :		"20%"
				,	initClosed:				false
				,	slideTrigger_open:		"over"
			}
			
			,	west: {
					paneSelector:	".menu-objects-pane" 
				,	minSize:	160
			}
			,	east: {
					paneSelector:	".menu-preconfig-pane"
				,	minSize:	250
			}
			,	center: {
					paneSelector:	"div.scenes-pane" 	
			}
	};
	
	return $(element).layout(layoutSettings_Outer_2);
};
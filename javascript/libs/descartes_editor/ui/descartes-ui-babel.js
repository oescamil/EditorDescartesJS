var descartes = (function(descartes){
	if(typeof(descartes) == 'undefined') {descartes = {};};
	if(!descartes.hasOwnProperty('editor')){ descartes.editor = {};}
	if(!descartes.editor.hasOwnProperty('ui_config')){ descartes.editor.ui_config= {};}

	/**
	 * Babel objects
	 */
	descartes.editor.ui_config.babel = {
		t : function(text,replaceCfg){
			text = String(text);
			for ( var search in replaceCfg) {
				var replace = replaceCfg[search];
				text = text.replace(search, replace);
			}
			return text.charAt(0).toUpperCase() + text.slice(1);
		},
	};
	
	return descartes;
})(descartes || {});
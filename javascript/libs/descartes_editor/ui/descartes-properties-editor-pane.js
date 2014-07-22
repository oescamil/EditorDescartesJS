(function( $ ) {
$.widget( "descartes_editor.descartesPropEditorPane", {
	version: "1.10.3",
	// default options
	options : {
		structure : [],
		babel : descartes.editor.ui_config.babel,
		descartesContext : {},
	},
	
	setObject:function (obj,type){
		delete this.element.editor;
		this.element.empty();
		
		var editorPane = this.getHandlerForType(obj);
		var htmlGUI = editorPane.getVisualGUI();

		this.element.editor = editorPane;
		this.element.append(htmlGUI);
		
		htmlGUI.on('descartes.fieldchanged',$.proxy(function(event, fieldname, allFields){
			console.log("Field modificado, disparando evento desde la lista de propiedades");
			// Para pasar el mensaje a los listenes, como el wisgyg o la lista de objetos izquierda
			this.element.trigger('descartes.fieldchanged',fieldname, allFields);
		},this));
		
		/*
		//PONEMOS LOS CHECKBOX COMO SWITCHES
		if(!($.browser))
			$.browser = {msie : (navigator.appVersion.indexOf("MSIE") > -1),};
		$('.field-editor-checkbox',this.element).switchbutton({
			checkedLabel: 'YES',
			uncheckedLabel: 'NO'
		});
		*/
	},
	
	getHandlerForType : function(object){
		var handler = null;
		var context = this.options.descartesContext;
		var stType = object['#superType'];
		
		try{
			
		var classHandler = descartes.editor.ui_config.getClassHandlerFor(stType);
		console.log("Vamos a llamar el handler para : ",stType,classHandler);
		
		handler = new classHandler(object,context);
		}catch(e){
			console.log('NO SE ENCONTRO LA CLASE PARA EXPONER : ',stType,e);
			handler = new DescartesEditObjectPane(object,context);
		}
		
		return handler;
	},
	
	
	/**
	 * 
	 */
	update: function (){
		var editorPane = this.element.editor;
		editorPane.updateValues();
		return; // EXPERIMENTANDO CON EL NUEVO MODELO 
	},
	
	// the constructor
	_create : function() {	},
	// events bound via _on are removed automatically
	// revert other modifications here
	_destroy : function() {
		// remove generated elements
		delete this.element.editor;
		delete this.element.empty();
	},
	_setOptions : function() {
		this._superApply(arguments);
	},
	_setOption : function(key, value) {
		this._super(key, value);
	},
});
}( jQuery ) );

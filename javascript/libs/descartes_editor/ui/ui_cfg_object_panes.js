(function(descartes,$){
	descartes = (descartes || {});
	descartes.editor = (descartes.editor || {});
	descartes.editor.ui_config = (descartes.editor.ui_config || {});
	descartes.editor.ui_config.utils = (descartes.editor.ui_config.utils || {});
	
	var nsUtils = descartes.editor.ui_config.utils;

	
	
/**
 * //TODO TODELETE
 * Auxiliar function for config.
 */
nsUtils.get_AuxWidgetFor = function (inputDest,fieldName,objToBind,objWidgetCfg) {
		var dialogTitle = 
			objWidgetCfg.hasOwnProperty(fieldName) 
			&& objWidgetCfg[fieldName].hasOwnProperty('label') 
			&& $.trim(objWidgetCfg[fieldName]['label'].toString()).length > 0; 
		
			dialogTitle = (dialogTitle)?objWidgetCfg[fieldName]['label']:fieldName;		
		
		var wrapLabel = $(descartes.editor.ui_config.utils.getWrapperTraductorLabel());
		dialogTitle = $('<span>').append(wrapLabel.html(dialogTitle));
		dialogTitle = dialogTitle.html();
		var openDialog = function(){
			if($(inputDest).is(":disabled"))
				return;
			var win = $("<div class='auxiliar-prop-popuot'>").appendTo($('body'));
			var newInput = $('<input>').appendTo(win);
			newInput.val(inputDest.val());
			dlgSettings = {
				title : dialogTitle,
				modal : true,
				buttons:{
					ok : function(){
						$(inputDest).val(newInput.val());
						$(inputDest).trigger('change');
						$(this).dialog('close');
					},
					cancel : function(){
						$(this).dialog('close');
					},
				},
				close : function(){
					$(this).dialog('destroy').remove();
				}
			};
			win = win.dialog(dlgSettings);
		};
		var btnSettings = {
				text: false,
				icons:{
					primary : "ui-icon-newwin",
				},
		};
		var wrapLabel = $(descartes.editor.ui_config.utils.getWrapperTraductorLabel());
		wrapLabel.text('Open in a new window');
		var btn = $("<button>").append(wrapLabel).button(btnSettings);
		btn.click(openDialog);
		return btn;
	};

	
/**
 * //TODO TO DELETE 
 */	
nsUtils.get_WrapperTraductorLabel = function (){
		return '<span class="descartes-traductible-label"></span>';
};

/**
 * 
 */
nsUtils.getObjectTypeTree = function(babel){
		if(!babel){	babel = descartes.editor.ui_config.babel;}
		function runAux(panesCfg){
			var res = {};
			for (var typeId in panesCfg) {
				var tmp = panesCfg[typeId];
				if(!$.isFunction(tmp) && typeof(tmp) == 'object'){
					tmp = runAux(tmp);
				}
				res[typeId] = tmp;
			}
			return res;
		}
		
		var numList = descartes.editor.ui_config.panes;
		var res = runAux(numList);
		
		return res;
	};
	
	
	
/**
 *  //TODO TO DELETE
 */	
nsUtils.get_CtrNumericGUITypes = function(babel){
		if(!babel){
			babel = descartes.editor.ui_config.babel;
		}
		var numList = descartes.editor.ui_config.panes.controls.numeric;
		var res = [];
		
		for ( var typeId in numList) {
			res.push({
				name : babel.t(numList[typeId]),
				value : typeId,
			});
			
		}
		return res;
	},
	
/**
 * 
 */	
nsUtils.getSpacesListForMenu = function(context){
		if(!context || !context.hasOwnProperty("spaces")){
			var st = this.getStackTrace();
			var msg = "Invalid context from the function "+st[1].name;
			alert(msg);
			console.log(msg,context);
			return [];
		}
		var spaces = context.spaces;
		var res = $.extend(true,[],spaces);
		return res;
	},
	
	
/**
 * 
 */	
nsUtils.getStackTrace =  function (){
		var f = arguments.callee;
		var ret = [];
		var item = {};
		var iter = 0;
		try{
			while ( f = f.caller ){ // Initialize
				item = {
					name: f.name || null,
					args: [], // Empty array = no arguments passed
					callback: f
				};
	
				// Function arguments
				if ( f.arguments ){
					for ( iter = 0; iter<f.arguments.length; iter++ ){
						item.args[iter] = f.arguments[iter];
					}
				} else {
					item.args = null; // null = argument listing not supported
				}
				ret.push( item );
			}
		} catch (e) {}
		return ret;
};




var nsUiCfg = descartes.editor.ui_config;

/**
 * 
 */	
nsUiCfg.getCfgFor = function(cfgPathArray,descartesContext){
	try{
		var cfgPane = this.getClassHandlerFor(cfgPathArray);
		var objHandler = new cfgPane({},descartesContext);
		cfgPane = objHandler.getConfig();
		cfgPane = $.extend(true,{},cfgPane);
		return cfgPane;
	} catch (e){
		throw e;
	}
};



nsUiCfg.getBindingCfgFor = function(cfgPathArray,descartesContext){
	try{
		
		var cfgPane = this.getClassHandlerFor(cfgPathArray);
		var objHandler = new cfgPane({},descartesContext);
		cfgPane = objHandler.getBindingCfg();
		cfgPane = $.extend(true,{},cfgPane);
		cfgPane['#superType'] = cfgPathArray.slice(); 
		
		return cfgPane;
	} catch (e){
		throw e;
	}
};

/**
 * 
 */	
nsUiCfg.getClassHandlerFor = function(cfgPathArray,descartesContext){
	if(!cfgPathArray || !$.isArray(cfgPathArray)){
		var exception = {message : "No valid path suply",stackTrace: nsUtils.getStackTrace(),supliedPath: cfgPathArray};
		throw exception;
		return;
	}
	
	var cfgPane = descartes.editor.ui_config.panes;
	var sType = cfgPathArray.join(',');
	for ( var i = 0; i < cfgPathArray.length; i++) {
		var cfgName = cfgPathArray[i];
		if(!cfgPane.hasOwnProperty(cfgName) || !cfgPane[cfgName]){
			console.log("Ya no encontré : ",cfgName," en : ",cfgPane);
			var exception = {message : "Internal. Configuration for ["+sType+"] not found",stackTrace: nsUtils.getStackTrace(), lastCfg:cfgPane};
			throw exception;
		}
		cfgPane = cfgPane[cfgName];
	}
	return cfgPane;
};

nsUiCfg.panes = {
		/*
		 * ******************************************************************
		 * *                   SPACES                                      *
		 * ******************************************************************
		 */
		space : {
			R2			: DescartesEditObjectPane, 
			R3 			: DescartesEditObjectPane, 
			HTMLIFrame	: DescartesEditObjectPane, 
		},
		
		/*
		 * ******************************************************************
		 * *                   CONTROLS                                     *
		 * ******************************************************************
		 */
		control : {
			numeric : {
				spinner		: DescartesNumericControlSpinnerEditPane,
				textfield	: DescartesNumericControlTextfieldEditPane,
				choice		: DescartesNumericControlMenuEditPane,
				scrollbar	: DescartesNumericControlScrollEditPane,
				button		: DescartesNumericControlButtonEditPane
			},
			text	: DescartesEditObjectPane, 
			video	: DescartesEditObjectPane, 
			audio 	: DescartesEditObjectPane, 
			graphic : DescartesEditObjectPane, 
		},
		
		
		graphic : {
			/*
			 * ******************************************************************
			 * *                   GRAPHICS R2                                  *
			 * ******************************************************************
			 */
			R2 : {
				equation : DescartesGraphics2DEditPane,
				curve	 : DescartesGraphics2DEditPane,
				sequence : DescartesGraphics2DEditPane,
				point	 : DescartesGraphics2DEditPane,
				segment	 : DescartesGraphics2DEditPane,
				arrow	 : DescartesGraphics2DEditPane,
				polygon	 : DescartesGraphics2DEditPane,
				arc		 : DescartesGraphics2DEditPane,
				fill	 : DescartesGraphics2DEditPane,
				text	 : DescartesGraphics2DEditPane,
				image	 : DescartesGraphics2DEditPane,
				macro	 : DescartesGraphics2DEditPane,
			},
			
			/*
			 * ******************************************************************
			 * *                   GRAPHICS R3                                  *
			 * ******************************************************************
			 */
			R3 : {
				point		: DescartesEditObjectPane, //TODO implementar
				segment		: DescartesEditObjectPane, //TODO implementar
				polygon		: DescartesEditObjectPane, //TODO implementar
				curve		: DescartesEditObjectPane, //TODO implementar
				triangle	: DescartesEditObjectPane, //TODO implementar
				face		: DescartesEditObjectPane, //TODO implementar
				surface		: DescartesEditObjectPane, //TODO implementar
				text		: DescartesEditObjectPane, //TODO implementar
				macro		: DescartesEditObjectPane, //TODO implementar
				regpoly		: DescartesEditObjectPane, //TODO implementar
				equation	: DescartesEditObjectPane, //TODO implementar
			}
		},
		
		/*
		 * ******************************************************************
		 * *                   AUXILIARS                                    *
		 * ******************************************************************
		 */
		auxiliar : {
			array		: DescartesAuxiliarEditPane, 
			matrix		: DescartesAuxiliarEditPane, 
			constant 	: DescartesAuxiliarEditPane, 
			variable	: DescartesAuxiliarEditPane, 
			algorithm	: DescartesAuxiliarEditPane, 
			'function'	: DescartesAuxiliarEditPane, 
		},
	};

return descartes;
})((descartes||{}),jQuery);
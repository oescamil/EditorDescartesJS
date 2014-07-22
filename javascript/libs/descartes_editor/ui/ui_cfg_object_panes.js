(function(descartes,$){
	descartes = (descartes || {});
	descartes.editor = (descartes.editor || {});
	descartes.editor.ui_config = (descartes.editor.ui_config || {});
	descartes.editor.ui_config.utils = (descartes.editor.ui_config.utils || {});
	
	var nsUtils = descartes.editor.ui_config.utils;
/**
 * Auxiliar function for config.
 */
nsUtils.getAuxWidgetFor = function (inputDest,fieldName,objToBind,objWidgetCfg) {
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
 * 
 */	
nsUtils.getWrapperTraductorLabel = function (){
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
 * 
 */	
nsUtils.getCtrNumericGUITypes = function(babel){
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

/**
 * 
 */
function isInAdvanceMod(paneContext){
	return (paneContext.hasOwnProperty('advance')) &&(paneContext.advance == true);
}


/**
 * 
 */
function getCfgSpaceR2(){
	var cfg = {};
		cfg.id 			= {type : 'textfield',		label : 'ID', 						value : '', 		'#weight' : (idx=0),	};
		cfg.type		= {type:'textfield',		label:'Type',						value:'R2',			'#weight' : (++idx),	};
		cfg.left		= {type:'codetextfield',	label:'X',							value:'',			'#weight' : (++idx),	}; 
		cfg.top			= {type:'codetextfield',	label:'Y',							value:'',			'#weight' : (++idx),	}; 
		cfg.width		= {type:'textfield',		label:'Width',						value:'',			'#weight' : (++idx),	}; 
		cfg.height		= {type:'textfield',		label:'Height',						value:'',			'#weight' : (++idx),	}; 
		cfg['draw-if']	= {type:'codetextfield',	label:'Draw if',					value:'',			'#weight' : (++idx),	}; 
		cfg.fixed		= {type:'checkbox',			label:'Fixed',						value:false,		'#weight' : (++idx),	}; 
		cfg.scale		= {type:'textfield',		label:'Escale',						value:32,			'#weight' : (++idx),	}; 
		cfg['O.x']		= {type:'textfield',		label:'Ox',							value:0,			'#weight' : (++idx),	}; 
		cfg['O.y']		= {type:'textfield',		label:'Oy',							value:0,			'#weight' : (++idx),	}; 
		cfg.bg_image	= {type:'image',			label:'Background image',			value:'',			'#weight' : (++idx),	};
		cfg.bg_display 	= {type:'combobox',			label:'Background display type',	value:0,			'#weight' : (++idx),	}; 
		cfg.background	= {type:'color', 			label:'Color',						value:'00f0f8fA',	'#weight' : (++idx),	}; 
		cfg.net			= {type:'checkbox_color', 	label:'Net color',					value:'no,gray',	'#weight' : (++idx),	}; 
		cfg.net10		= {type:'checkbox_color', 	label:'Net 10 color',				value:'no,gray',	'#weight' : (++idx),	}; 
		cfg.axes		= {type:'checkbox_color', 	label:'Axes color',					value:'no,gray',	'#weight' : (++idx),	}; 
		cfg.text		= {type:'checkbox_color', 	label:'Text color',					value:'no,gray',	'#weight' : (++idx),	}; 
		cfg.sensitive_to_mouse_movements
						= {type:'checkbox',			label:'Mouse move listener',		value:false,		'#weight' : (++idx),	};
		cfg.numbers		= {type:'checkbox',			label:'Show escale',				value:false,		'#weight' : (++idx),	}; 
		cfg['x-axis']	= {type:'textfield',		label:'X axis label',				value:'',			'#weight' : (++idx),	}; 
		cfg['y-axis']	= {type:'textfield',		label:'Y axis label',				value:'',			'#weight' : (++idx),	};

		cfg['#form']		= function(form,form_values,all_scene_data){}; 
		cfg['#validate']	= function(form,form_values,all_scene_data){};
	
	return cfg;
}

/**
 * 
 */
function getCfgSpaceR3(){
	var cfg = getCfgSpaceR2();
	cfg.type['value'] = 'R3';
	delete cfg.net;
	delete cfg.net10;
	delete cfg.net;
	delete cfg.net; 
	delete cfg.net10; 
	delete cfg.axes; 
	delete cfg.text; 
	delete	cfg.numbers; 
	delete cfg['x-axis']; 
	delete cfg['y-axis'];
	cfg['#form']		= function(form,form_values,all_scene_data){};
	cfg['#validate']	= function(form,form_values,all_scene_data){};
	return cfg;		
}


/**
 * 
 */
function getCfgSpaceHTMLIFrame(){
	var cfg = getCfgSpaceR2();
		cfg.type['value'] = 'HTMLIFrame';
		cfg.file = {type:'file', label:'File', value:'', enable:true};
		
		delete  //Unset unused properties 
			cfg.scale, 
			cfg['O.x'], 
			cfg['O.y'], 
			cfg.fixed, 
			cfg.net, 
			cfg.net10, 
			cfg.axes, 
			cfg.text, 
			cfg.numbers, 
			cfg['x-axis'], 
			cfg['y-axis'],
			cfg.sensitive_to_mouse_movements;
		
		cfg['#form']		= function(form,form_values,all_scene_data){};
		cfg['#validate']	= function(form,form_values,all_scene_data){};
	return cfg;
}


var nsUiCfg = descartes.editor.ui_config;

/**
 * 
 */	
nsUiCfg.getCfgFor = function(cfgPathArray,descartesContext){
	try{
			
		var cfgPane = this.getClassHandlerFor(cfgPathArray);
		var objHandler = new cfgPane({},descartesContext);
		cfgPane = objHandler.getConfig();
		console.log("Creando el objecto : ",cfgPane); 
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
			var exception = {message : "Internal. Configuration for ["+sType+"] not found",stackTrace: nsUtils.getStackTrace()};
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
			R2			: DescartesEditObjectPane, //TODO implementar 
			R3 			: DescartesEditObjectPane, //TODO implementar
			HTMLIFrame	: DescartesEditObjectPane, //TODO implementar
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
			text	: DescartesEditObjectPane, //TODO implementar
			video	: DescartesEditObjectPane, //TODO implementar
			audio 	: DescartesEditObjectPane, //TODO implementar
			graphic : DescartesEditObjectPane, //TODO implementar
		},
		
		
		graphic : {
			/*
			 * ******************************************************************
			 * *                   GRAPHICS R2                                  *
			 * ******************************************************************
			 */
			R2 : {
				equation	: DescartesEditObjectPane,  //TODO implementar
				text		: DescartesEditObjectPane, //TODO implementar
				curve		: DescartesEditObjectPane, //TODO implementar
				
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
			array		: DescartesAuxiliarEditPane, //TODO implementar
			matrix		: DescartesAuxiliarEditPane, //TODO implementar
			constant 	: DescartesAuxiliarEditPane, //TODO implementar
			variable	: DescartesAuxiliarEditPane, //TODO implementar
			algorithm	: DescartesAuxiliarEditPane, //TODO implementar
			'function'	: DescartesAuxiliarEditPane, //TODO implementar
		},
	};

return descartes;
})((descartes||{}),jQuery);
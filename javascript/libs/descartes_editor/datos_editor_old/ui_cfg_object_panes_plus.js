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
			for ( var typeId in panesCfg) {
				var tmp = panesCfg[typeId];
				if(tmp == null || tmp == undefined || typeof(tmp) != 'object')
					return false;
				 tmp = runAux(tmp);
				
				 if(tmp == false)
					return null;
				
				 if(tmp == null || !$.isEmptyObject(tmp))
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


var expToModeAdvance = '(context.mode == "advance")';
var nsUiCfg = descartes.editor.ui_config;

/**
 * 
 */	
nsUiCfg.getCfgFor = function(cfgPathArray){
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
		
		cfgPane = $.extend(true,{},cfgPane);
		cfgPane['#superType'] = cfgPathArray.slice(); 
			
		return cfgPane;
};

nsUiCfg.panes = {
		/*
		 * ******************************************************************
		 * *                   SPACES                                      *
		 * ******************************************************************
		 */
		space : {
			R2			: getCfgSpaceR2(),
			R3 			: getCfgSpaceR3(),
			HTMLIFrame	: getCfgSpaceHTMLIFrame(),
		},
		
		/*
		 * ******************************************************************
		 * *                   CONTROLS                                     *
		 * ******************************************************************
		 */
		control : {
			numeric : {
				spinner : {
					id					: {type:'textfield',		label:'ID',						value:'',			'#weight' : (idx=0),	enable:true,	visible: expToModeAdvance,	},
					name				: {type:'textfield',		label:'Name',					value:'',			'#weight' : (++idx),	enable:true,	visible: expToModeAdvance,	},
					type				: {type:'textfield',		label:'Type',					value:'numeric',	'#weight' : (++idx),	enable:false,	visible: false,				},
					expresion			: {type:'codetextfield',	label:'Initial position',		value:'(0,0)',		'#weight' : (++idx),	enable:false,	visible: true,				group:'Operative',	auxiliarEditor:{type:'coordinates', length:2, labels:['x','y'], bracked:')', separator:','}},
					gui					: {type:'combobox',			label:'Interface',				value:'spinner',	'#weight' : (++idx),	enable:false,	visible: false,				options:descartes.editor.ui_config.utils.getCtrNumericGUITypes},
					space				: {type:'combobox',			label:'Space',					value:0,			'#weight' : (++idx),	enable:false, 	visible: false, 			group:'Operative',	options:descartes.editor.ui_config.utils.getSpacesListForMenu},
					value				: {type:'codetextfield',	label:'Value',					value:'',			'#weight' : (++idx),	enable:true,	visible: expToModeAdvance,	},
					max					: {type:'codetextfield',	label:'Maximun',				value:'',			'#weight' : (++idx),	enable:true,	visible: expToModeAdvance,	},
					min					: {type:'codetextfield',	label:'Minimum',				value:'',			'#weight' : (++idx),	enable:true,	visible: expToModeAdvance,	},
					incr				: {type:'codetextfield',	label:'Increase',				value:'0.1',		'#weight' : (++idx),	enable:true,	visible: expToModeAdvance,	},
					'draw-if'			: {type:'codetextfield',	label:'Draw if',				value:'',			'#weight' : (++idx),	enable:true,	visible: true,},
					'active-if'			: {type:'codetextfield',	label:'Enable if',				value:'',			'#weight' : (++idx),	enable:true,	visible: expToModeAdvance,},
					'exponential-if'	: {type:'codetextfield', 	label:'Show exponential if',	value:'',			'#weight' : (++idx),	enable:true,	visible: expToModeAdvance,},
					decimals			: {type:'codetextfield',	label:'Decimals',				value:'2',			'#weight' : (++idx),	enable:true,	visible: false,				group:'Visual',},
					fixed				: {type:'checkbox',			label:'Fixed',					value:true,			'#weight' : (++idx),	enable:true,	visible: false,				group:'Visual',},
					visible				: {type:'checkbox',			label:'Show text field',		value:true,			'#weight' : (++idx),	enable:true,	visible: false,				group:'Visual',},
					region				: {type:'combobox',			label:'Region',					value:'',			'#weight' : (++idx),	enable:false, 	visible: false, 			group:'Operative',	options:descartes.editor.ui_config.utils.getSpacesListForMenu},
					action				: {type:'combobox',			label:'Action',					value:'',			'#weight' : (++idx),	enable:true,	visible: true,				options:descartes.editor.ui_config.utils.getCtrNumericGUITypes},
					parameter			: {type:'textfield',		label:'Parameter',				value:'',			'#weight' : (++idx),	enable:true,	visible: expToModeAdvance,	},
					tooltip				: {type:'codetextfield',	label:'Tooltip',				value:'',			'#weight' : (++idx),	enable:true,	visible: expToModeAdvance,	group:'Information',},
					evaluate			: {type:'checkbox',			label:'Evaluate',				value:true,			'#weight' : (++idx),	enable:true,	visible: false,				group:'Visual',},
					answer				: {type:'textfield',		label:'Answer',					value:'',			'#weight' : (++idx),	enable:true,	visible: expToModeAdvance,	},
					expl				: {type:'codetextfield',	label:'Descriptor',				value:'',			'#weight' : (++idx),	enable:true,	visible: expToModeAdvance,	group:'information',},
					text				: {type:'codetextfield',	label:'Type',					value:'(0,0)',		'#weight' : (++idx),	enable:false,	visible: true,				group:'Visual',	auxiliarEditor:{type:'rtfEditor'}},
					info				: {type:'textfield',		label:'Comments',				value:'',			'#weight' : (++idx),	enable:true,	visible: true,},
				},
				textfield :  {
					//id='n2' tipo='numérico' interfaz='campo de texto' espacio='E1' nombre='n2' min='0' max='0' fijo='no' exponencial-si='0' visible='no' acción='calcular' parámetro='asd' dibujar-si='as' activo-si='asd' evaluar='sí' respuesta='krypto_nlgbtpf9e0' peso='2'

					id					: {type:'textfield',		label:'ID',						value:'',			'#weight' : (idx=0),	enable:true,	visible: expToModeAdvance,	},
					name				: {type:'textfield',		label:'Name',					value:'',			'#weight' : (++idx),	enable:true,	visible: expToModeAdvance,	},
					type				: {type:'textfield',		label:'Type',					value:'textfield',	'#weight' : (++idx),	enable:false,	visible: false,				},
					expresion			: {type:'codetextfield',	label:'Initial position',		value:'(0,0)',		'#weight' : (++idx),	enable:false,	visible: true,				group:'Operative',	auxiliarEditor:{type:'coordinates', length:2, labels:['x','y'], bracked:')', separator:','}},
					gui					: {type:'combobox',			label:'Interface',				value:'spinner',	'#weight' : (++idx),	enable:false,	visible: false,				options:descartes.editor.ui_config.utils.getCtrNumericGUITypes},
					only_text			: {type:'checkbox',			label:'Text only',				value:true,			'#weight' : (++idx),	enable:true,	visible: false,				group:'Visual',},
					space				: {type:'combobox',			label:'Space',					value:0,			'#weight' : (++idx),	enable:false, 	visible: false, 			group:'Operative',	options:descartes.editor.ui_config.utils.getSpacesListForMenu},
					value				: {type:'codetextfield',	label:'Value',					value:'',			'#weight' : (++idx),	enable:true,	visible: expToModeAdvance,	},
					max					: {type:'codetextfield',	label:'Maximun',				value:'',			'#weight' : (++idx),	enable:true,	visible: expToModeAdvance,	},
					min					: {type:'codetextfield',	label:'Minimum',				value:'',			'#weight' : (++idx),	enable:true,	visible: expToModeAdvance,	},
					incr				: {type:'codetextfield',	label:'Increase',				value:'0.1',		'#weight' : (++idx),	enable:true,	visible: expToModeAdvance,	},
					'draw-if'			: {type:'codetextfield',	label:'Draw if',				value:'',			'#weight' : (++idx),	enable:true,	visible: true,},
					'active-if'			: {type:'codetextfield',	label:'Enable if',				value:'',			'#weight' : (++idx),	enable:true,	visible: expToModeAdvance,},
					'exponential-if'	: {type:'codetextfield', 	label:'Show exponential if',	value:'',			'#weight' : (++idx),	enable:true,	visible: expToModeAdvance,},
					decimals			: {type:'codetextfield',	label:'Decimals',				value:'2',			'#weight' : (++idx),	enable:true,	visible: false,				group:'Visual',},
					fixed				: {type:'checkbox',			label:'Fixed',					value:true,			'#weight' : (++idx),	enable:true,	visible: false,				group:'Visual',},
					visible				: {type:'checkbox',			label:'Show text field',		value:true,			'#weight' : (++idx),	enable:true,	visible: false,				group:'Visual',},
					region				: {type:'combobox',			label:'Region',					value:'',			'#weight' : (++idx),	enable:false, 	visible: false, 			group:'Operative',	options:descartes.editor.ui_config.utils.getSpacesListForMenu},
					action				: {type:'combobox',			label:'Action',					value:'',			'#weight' : (++idx),	enable:true,	visible: true,				options:descartes.editor.ui_config.utils.getCtrNumericGUITypes},
					parameter			: {type:'textfield',		label:'Parameter',				value:'',			'#weight' : (++idx),	enable:true,	visible: expToModeAdvance,	},
					tooltip				: {type:'codetextfield',	label:'Tooltip',				value:'',			'#weight' : (++idx),	enable:true,	visible: expToModeAdvance,	group:'Information',},
					evaluate			: {type:'checkbox',			label:'Evaluate',				value:true,			'#weight' : (++idx),	enable:true,	visible: false,				group:'Visual',},
					answer				: {type:'textfield',		label:'Answer',					value:'',			'#weight' : (++idx),	enable:true,	visible: expToModeAdvance,	},
					expl				: {type:'codetextfield',	label:'Descriptor',				value:'',			'#weight' : (++idx),	enable:true,	visible: expToModeAdvance,	group:'information',},
					text				: {type:'codetextfield',	label:'Type',					value:'(0,0)',		'#weight' : (++idx),	enable:false,	visible: true,				group:'Visual',	auxiliarEditor:{type:'rtfEditor'}},
					info				: {type:'textfield',		label:'Comments',				value:'',			'#weight' : (++idx),	enable:true,	visible: true,},
				},
				choice: {
					id					: {type:'textfield',		label:'ID',						value:'',			'#weight' : (idx=0),	enable:true,	visible: expToModeAdvance,	},
					name				: {type:'textfield',		label:'Name',					value:'',			'#weight' : (++idx),	enable:true,	visible: expToModeAdvance,	},
					type				: {type:'textfield',		label:'Type',					value:'textfield',	'#weight' : (++idx),	enable:false,	visible: false,				},
					expresion			: {type:'codetextfield',	label:'Initial position',		value:'(0,0)',		'#weight' : (++idx),	enable:false,	visible: true,				group:'Operative',	auxiliarEditor:{type:'coordinates', length:2, labels:['x','y'], bracked:')', separator:','}},
					gui					: {type:'combobox',			label:'Interface',				value:'spinner',	'#weight' : (++idx),	enable:false,	visible: false,				options:descartes.editor.ui_config.utils.getCtrNumericGUITypes},
					space				: {type:'combobox',			label:'Space',					value:0,			'#weight' : (++idx),	enable:false, 	visible: false, 			group:'Operative',	options:descartes.editor.ui_config.utils.getSpacesListForMenu},
					value				: {type:'codetextfield',	label:'Value',					value:'',			'#weight' : (++idx),	enable:true,	visible: expToModeAdvance,	},
					options				: {type:'choiceOptions',	label:'Options',				value:'',			'#weight' : (++idx),	enable:true,	visible: true,},
					'draw-if'			: {type:'codetextfield',	label:'Draw if',				value:'',			'#weight' : (++idx),	enable:true,	visible: true,},
					'active-if'			: {type:'codetextfield',	label:'Enable if',				value:'',			'#weight' : (++idx),	enable:true,	visible: expToModeAdvance,},
					'exponential-if'	: {type:'codetextfield', 	label:'Show exponential if',	value:'',			'#weight' : (++idx),	enable:true,	visible: expToModeAdvance,},
					decimals			: {type:'codetextfield',	label:'Decimals',				value:'2',			'#weight' : (++idx),	enable:true,	visible: false,				group:'Visual',},
					fixed				: {type:'checkbox',			label:'Fixed',					value:true,			'#weight' : (++idx),	enable:true,	visible: false,				group:'Visual',},
					visible				: {type:'checkbox',			label:'Show text field',		value:true,			'#weight' : (++idx),	enable:true,	visible: false,				group:'Visual',},
					region				: {type:'combobox',			label:'Region',					value:'',			'#weight' : (++idx),	enable:false, 	visible: false, 			group:'Operative',	options:descartes.editor.ui_config.utils.getSpacesListForMenu},
					action				: {type:'combobox',			label:'Action',					value:'',			'#weight' : (++idx),	enable:true,	visible: true,				options:descartes.editor.ui_config.utils.getCtrNumericGUITypes},
					parameter			: {type:'textfield',		label:'Parameter',				value:'',			'#weight' : (++idx),	enable:true,	visible: expToModeAdvance,	},
					evaluate			: {type:'checkbox',			label:'Evaluate',				value:true,			'#weight' : (++idx),	enable:true,	visible: false,				group:'Visual',},
					answer				: {type:'textfield',		label:'Answer',					value:'',			'#weight' : (++idx),	enable:true,	visible: expToModeAdvance,	},
					tooltip				: {type:'codetextfield',	label:'Tooltip',				value:'',			'#weight' : (++idx),	enable:true,	visible: expToModeAdvance,	group:'Information',},
					expl				: {type:'codetextfield',	label:'Descriptor',				value:'',			'#weight' : (++idx),	enable:true,	visible: expToModeAdvance,	group:'information',},
					text				: {type:'codetextfield',	label:'Type',					value:'(0,0)',		'#weight' : (++idx),	enable:false,	visible: true,				group:'Visual',	auxiliarEditor:{type:'rtfEditor'}},
					info				: {type:'textfield',		label:'Comments',				value:'',			'#weight' : (++idx),	enable:true,	visible: true,},
				},
				scrollbar : {
					id					: {type:'textfield',		label:'ID',						value:'',			'#weight' : (idx=0),	enable:true,	visible: expToModeAdvance,	},
					name				: {type:'textfield',		label:'Name',					value:'',			'#weight' : (++idx),	enable:true,	visible: expToModeAdvance,	},
					type				: {type:'textfield',		label:'Type',					value:'numeric',	'#weight' : (++idx),	enable:false,	visible: false,				},
					expresion			: {type:'codetextfield',	label:'Initial position',		value:'(0,0)',		'#weight' : (++idx),	enable:false,	visible: true,				group:'Operative',	auxiliarEditor:{type:'coordinates', length:2, labels:['x','y'], bracked:')', separator:','}},
					gui					: {type:'combobox',			label:'Interface',				value:'scrollbar',	'#weight' : (++idx),	enable:false,	visible: false,				options:descartes.editor.ui_config.utils.getCtrNumericGUITypes},
					space				: {type:'combobox',			label:'Space',					value:0,			'#weight' : (++idx),	enable:false, 	visible: false, 			group:'Operative',	options:descartes.editor.ui_config.utils.getSpacesListForMenu},
					value				: {type:'codetextfield',	label:'Value',					value:'',			'#weight' : (++idx),	enable:true,	visible: expToModeAdvance,	},
					max					: {type:'codetextfield',	label:'Maximun',				value:'',			'#weight' : (++idx),	enable:true,	visible: expToModeAdvance,	},
					min					: {type:'codetextfield',	label:'Minimum',				value:'',			'#weight' : (++idx),	enable:true,	visible: expToModeAdvance,	},
					incr				: {type:'codetextfield',	label:'Increase',				value:'0.1',		'#weight' : (++idx),	enable:true,	visible: expToModeAdvance,	},
					'draw-if'			: {type:'codetextfield',	label:'Draw if',				value:'',			'#weight' : (++idx),	enable:true,	visible: true,},
					'active-if'			: {type:'codetextfield',	label:'Enable if',				value:'',			'#weight' : (++idx),	enable:true,	visible: expToModeAdvance,},
					'exponential-if'	: {type:'codetextfield', 	label:'Show exponential if',	value:'',			'#weight' : (++idx),	enable:true,	visible: expToModeAdvance,},
					decimals			: {type:'codetextfield',	label:'Decimals',				value:'2',			'#weight' : (++idx),	enable:true,	visible: false,				group:'Visual',},
					fixed				: {type:'checkbox',			label:'Fixed',					value:true,			'#weight' : (++idx),	enable:true,	visible: false,				group:'Visual',},
					visible				: {type:'checkbox',			label:'Show text field',		value:true,			'#weight' : (++idx),	enable:true,	visible: false,				group:'Visual',},
					region				: {type:'combobox',			label:'Region',					value:'',			'#weight' : (++idx),	enable:false, 	visible: false, 			group:'Operative',	options:descartes.editor.ui_config.utils.getSpacesListForMenu},
					action				: {type:'combobox',			label:'Action',					value:'',			'#weight' : (++idx),	enable:true,	visible: true,				options:descartes.editor.ui_config.utils.getCtrNumericGUITypes},
					parameter			: {type:'textfield',		label:'Parameter',				value:'',			'#weight' : (++idx),	enable:true,	visible: expToModeAdvance,	},
					tooltip				: {type:'codetextfield',	label:'Tooltip',				value:'',			'#weight' : (++idx),	enable:true,	visible: expToModeAdvance,	group:'Information',},
					evaluate			: {type:'checkbox',			label:'Evaluate',				value:true,			'#weight' : (++idx),	enable:true,	visible: false,				group:'Visual',},
					answer				: {type:'textfield',		label:'Answer',					value:'',			'#weight' : (++idx),	enable:true,	visible: expToModeAdvance,	},
					expl				: {type:'codetextfield',	label:'Descriptor',				value:'',			'#weight' : (++idx),	enable:true,	visible: expToModeAdvance,	group:'information',},
					text				: {type:'codetextfield',	label:'Type',					value:'(0,0)',		'#weight' : (++idx),	enable:false,	visible: true,				group:'Visual',	auxiliarEditor:{type:'rtfEditor'}},
					info				: {type:'textfield',		label:'Comments',				value:'',			'#weight' : (++idx),	enable:true,	visible: true,},
				},
				button : {
					id					: {type:'textfield',		label:'ID',						value:'',			'#weight' : (idx=0),	enable:true,	visible: expToModeAdvance,	},
					name				: {type:'textfield',		label:'Name',					value:'',			'#weight' : (++idx),	enable:true,	visible: expToModeAdvance,	},
					type				: {type:'textfield',		label:'Type',					value:'button',		'#weight' : (++idx),	enable:false,	visible: false,				},
					expresion			: {type:'codetextfield',	label:'Initial position',		value:'(0,0)',		'#weight' : (++idx),	enable:false,	visible: true,				group:'Operative',	auxiliarEditor:{type:'coordinates', length:2, labels:['x','y'], bracked:')', separator:','}},
					gui					: {type:'combobox',			label:'Interface',				value:'spinner',	'#weight' : (++idx),	enable:false,	visible: false,				options:descartes.editor.ui_config.utils.getCtrNumericGUITypes},
					space				: {type:'combobox',			label:'Space',					value:0,			'#weight' : (++idx),	enable:false, 	visible: false, 			group:'Operative',	options:descartes.editor.ui_config.utils.getSpacesListForMenu},
					value				: {type:'codetextfield',	label:'Value',					value:'',			'#weight' : (++idx),	enable:true,	visible: expToModeAdvance,	},
					max					: {type:'codetextfield',	label:'Maximun',				value:'',			'#weight' : (++idx),	enable:true,	visible: expToModeAdvance,	},
					min					: {type:'codetextfield',	label:'Minimum',				value:'',			'#weight' : (++idx),	enable:true,	visible: expToModeAdvance,	},
					incr				: {type:'codetextfield',	label:'Increase',				value:'0.1',		'#weight' : (++idx),	enable:true,	visible: expToModeAdvance,	},
					'draw-if'			: {type:'codetextfield',	label:'Draw if',				value:'',			'#weight' : (++idx),	enable:true,	visible: true,},
					'active-if'			: {type:'codetextfield',	label:'Enable if',				value:'',			'#weight' : (++idx),	enable:true,	visible: expToModeAdvance,},
					'exponential-if'	: {type:'codetextfield', 	label:'Show exponential if',	value:'',			'#weight' : (++idx),	enable:true,	visible: expToModeAdvance,},
					decimals			: {type:'codetextfield',	label:'Decimals',				value:'2',			'#weight' : (++idx),	enable:true,	visible: false,				group:'Visual',},
					fixed				: {type:'checkbox',			label:'Fixed',					value:true,			'#weight' : (++idx),	enable:true,	visible: false,				group:'Visual',},
					visible				: {type:'checkbox',			label:'Show text field',		value:true,			'#weight' : (++idx),	enable:true,	visible: false,				group:'Visual',},
					region				: {type:'combobox',			label:'Region',					value:'',			'#weight' : (++idx),	enable:false, 	visible: false, 			group:'Operative',	options:descartes.editor.ui_config.utils.getSpacesListForMenu},
					action				: {type:'combobox',			label:'Action',					value:'',			'#weight' : (++idx),	enable:true,	visible: true,				options:descartes.editor.ui_config.utils.getCtrNumericGUITypes},
					parameter			: {type:'textfield',		label:'Parameter',				value:'',			'#weight' : (++idx),	enable:true,	visible: expToModeAdvance,	},
					tooltip				: {type:'codetextfield',	label:'Tooltip',				value:'',			'#weight' : (++idx),	enable:true,	visible: expToModeAdvance,	group:'Information',},
					evaluate			: {type:'checkbox',			label:'Evaluate',				value:true,			'#weight' : (++idx),	enable:true,	visible: false,				group:'Visual',},
					answer				: {type:'textfield',		label:'Answer',					value:'',			'#weight' : (++idx),	enable:true,	visible: expToModeAdvance,	},
					expl				: {type:'codetextfield',	label:'Descriptor',				value:'',			'#weight' : (++idx),	enable:true,	visible: expToModeAdvance,	group:'information',},
					text				: {type:'codetextfield',	label:'Type',					value:'(0,0)',		'#weight' : (++idx),	enable:false,	visible: true,				group:'Visual',	auxiliarEditor:{type:'rtfEditor'}},
					info				: {type:'textfield',		label:'Comments',				value:'',			'#weight' : (++idx),	enable:true,	visible: true,},
				},
			},
			text:{
				id				: {type:'textfield',		label:'ID',					value:'',			'#weight' : (idx=0),	enable:true,	visible: expToModeAdvance,	},
				type			: {type:'textfield',		label:'Type',				value:'text',		'#weight' : (++idx),	enable:false,	visible: false,				},
				region			: {type:'combobox',			label:'Region',					value:'',			'#weight' : (++idx),	enable:false, 	visible: false, 			group:'Operative',	options:descartes.editor.ui_config.utils.getSpacesListForMenu},
				space			: {type:'combobox',			label:'Region',				value:0,			'#weight' : (++idx),	enable:false, 	visible: false, 			group:'Operative',	options:descartes.editor.ui_config.utils.getSpacesListForMenu},
				expresion		: {type:'codetextfield',	label:'Initial position',	value:'(0,0)',		'#weight' : (++idx),	enable:false,	visible: true,				group:'Operative',	auxiliarEditor:{type:'coordinates', length:2, labels:['x','y'], bracked:')', separator:','}},
				'draw-if'		: {type:'codetextfield',	label:'Draw if',			value:'',			'#weight' : (++idx),	enable:true,	visible: true,},
				'active-if'		: {type:'codetextfield',	label:'Enable if',			value:'',			'#weight' : (++idx),	enable:true,	visible: expToModeAdvance,},
				text			: {type:'codetextfield',	label:'Type',				value:'(0,0)',		'#weight' : (++idx),	enable:false,	visible: true,				group:'Visual',	auxiliarEditor:{type:'rtfEditor'}},
				tooltip			: {type:'codetextfield',	label:'Tooltip',			value:'',			'#weight' : (++idx),	enable:true,	visible: expToModeAdvance,	group:'Information',},
				info			: {type:'textfield',		label:'Comments',			value:'',			'#weight' : (++idx),	enable:true,	visible: true,				},
				Buttons			: {type:'checkbox',			label:'Buttons',			value:false,		'#weight' : (++idx),	enable:true,	visible: true,				},
			},
			video:{
				id				: {type:'textfield',		label:'ID',					value:'',			'#weight' : (idx=0),	enable:true,	visible: expToModeAdvance,	},
				type			: {type:'textfield',		label:'Type',				value:'video',		'#weight' : (++idx),	enable:false,	visible: false,				},
				region			: {type:'combobox',			label:'Region',				value:'',			'#weight' : (++idx),	enable:false, 	visible: false, 			group:'Operative',	options:descartes.editor.ui_config.utils.getSpacesListForMenu},
				space			: {type:'combobox',			label:'Region',				value:0,			'#weight' : (++idx),	enable:false, 	visible: false, 			group:'Operative',	options:descartes.editor.ui_config.utils.getSpacesListForMenu},
				expresion		: {type:'codetextfield',	label:'Initial position',	value:'(0,0)',		'#weight' : (++idx),	enable:false,	visible: true,				group:'Operative',	auxiliarEditor:{type:'coordinates', length:2, labels:['x','y'], bracked:')', separator:','}},
				file 			: {type:'file', 			label:'File', 				value:'', 			'#weight' : (++idx),	enable:true,	visible: true,},
				'draw-if'		: {type:'codetextfield',	label:'Draw if',			value:'',			'#weight' : (++idx),	enable:true,	visible: true,},
				'active-if'		: {type:'codetextfield',	label:'Enable if',			value:'',			'#weight' : (++idx),	enable:true,	visible: expToModeAdvance,},
				text			: {type:'codetextfield',	label:'Type',				value:'(0,0)',		'#weight' : (++idx),	enable:false,	visible: true,				group:'Visual',	auxiliarEditor:{type:'rtfEditor'}},
				tooltip			: {type:'codetextfield',	label:'Tooltip',			value:'',			'#weight' : (++idx),	enable:true,	visible: expToModeAdvance,	group:'Information',},
				info			: {type:'textfield',		label:'Comments',			value:'',			'#weight' : (++idx),	enable:true,	visible: true,				},
			},
			audio :{
				id				: {type:'textfield',		label:'ID',					value:'',			'#weight' : (idx=0),	enable:true,	visible: expToModeAdvance,	},
				type			: {type:'textfield',		label:'Type',				value:'video',		'#weight' : (++idx),	enable:false,	visible: false,				},
				region			: {type:'combobox',			label:'Region',				value:'',			'#weight' : (++idx),	enable:false, 	visible: false, 			group:'Operative',	options:descartes.editor.ui_config.utils.getSpacesListForMenu},
				space			: {type:'combobox',			label:'Region',				value:0,			'#weight' : (++idx),	enable:false, 	visible: false, 			group:'Operative',	options:descartes.editor.ui_config.utils.getSpacesListForMenu},
				expresion		: {type:'codetextfield',	label:'Initial position',	value:'(0,0)',		'#weight' : (++idx),	enable:false,	visible: true,				group:'Operative',	auxiliarEditor:{type:'coordinates', length:2, labels:['x','y'], bracked:')', separator:','}},
				file 			: {type:'file', 			label:'File', 				value:'', 			'#weight' : (++idx),	enable:true,	visible: true,},
				'draw-if'		: {type:'codetextfield',	label:'Draw if',			value:'',			'#weight' : (++idx),	enable:true,	visible: true,},
				'active-if'		: {type:'codetextfield',	label:'Enable if',			value:'',			'#weight' : (++idx),	enable:true,	visible: expToModeAdvance,},
				text			: {type:'codetextfield',	label:'Type',				value:'(0,0)',		'#weight' : (++idx),	enable:false,	visible: true,				group:'Visual',	auxiliarEditor:{type:'rtfEditor'}},
				tooltip			: {type:'codetextfield',	label:'Tooltip',			value:'',			'#weight' : (++idx),	enable:true,	visible: expToModeAdvance,	group:'Information',},
				info			: {type:'textfield',		label:'Comments',			value:'',			'#weight' : (++idx),	enable:true,	visible: true,				},
			},
			graphic : {
				id			: {type:'textfield',		label:'ID',					value:'',			'#weight' : (idx=0),	enable:true,	visible: expToModeAdvance,	},
				type		: {type:'textfield',		label:'Type',				value:'graphic',	'#weight' : (++idx),	enable:false,	visible: false,				},
				constrain	: {type:'codetextfield',	label:'Constraint',			value:'',			'#weight' : (++idx),	enable:true,	visible: expToModeAdvance,	group:'Operative',},
				expr		: {type:'codetextfield',	label:'Initial position',	value:'(0,0)',		'#weight' : (++idx),	enable:false,	visible: true,				group:'Operative',	auxiliarEditor:{type:'coordinates', length:2, labels:['x','y'], bracked:')', separator:','}},
				space		: {type:'combobox',			label:'Region',				value:0,			'#weight' : (++idx),	enable:false, 	visible: false, 			group:'Operative',	options:descartes.editor.ui_config.utils.getSpacesListForMenu},
				'draw-if'	: {type:'codetextfield',	label:'Draw if',			value:'',			'#weight' : (++idx),	enable:true,	visible: true,				},
				'active-if'	: {type:'codetextfield',	label:'Enable if',			value:'',			'#weight' : (++idx),	enable:true,	visible: expToModeAdvance,	},
				colour		: {type:'color', 			label:'Color',				value:'blue',		'#weight' : (++idx),	enable:true,	visible: expToModeAdvance,	group:'Visual',},
				'int-colour': {type:'color',		 	label:'Fill',				value:'blue',		'#weight' : (++idx),	enable:true,	visble:true,				group:'Visual',},
				trace		: {type:'checkbox_color', 	label:'Trace color',		value:'no,gray',	'#weight' : (++idx),	enable:true,	visble:true,				group:'Visual',},	
				size		: {type:'codetextfield',	label:'Size',				value:'4',			'#weight' : (++idx),	enable:true,	visible: expToModeAdvance,	group:'Visual',},
				text		: {type:'codetextfield',	label:'Type',				value:'(0,0)',		'#weight' : (++idx),	enable:false,	visible: true,				group:'Visual',	auxiliarEditor:{type:'rtfEditor'}},
				decimals	: {type:'codetextfield',	label:'Decimals',			value:'2',			'#weight' : (++idx),	enable:true,	visible: false,				group:'Visual',},
				fixed		: {type:'checkbox',			label:'Fixed',				value:false,		'#weight' : (++idx),	enable:true,	visible: false,				group:'Visual',},
				image		: {type:'image',			label:'Image',				value:'',			'#weight' : (++idx),	enable:true,	visible: true,				group:'Visual',},
				tooltip		: {type:'codetextfield',	label:'Tooltip',			value:'',			'#weight' : (++idx),	enable:true,	visible: expToModeAdvance,	group:'Information',},
				expl		: {type:'codetextfield',	label:'Descriptor',			value:'',			'#weight' : (++idx),	enable:true,	visible: expToModeAdvance,	group:'information',},
				info		: {type:'textfield',		label:'Comments',			value:'',			'#weight' : (++idx),	enable:true,	visible: true,				},
			},
		},
		
		
		graphic : {
			/*
			 * ******************************************************************
			 * *                   GRAPHICS R2                                  *
			 * ******************************************************************
			 */
			R2 : {
				equation: {
					id			: { type:'textfield', 		label:'ID', 				value:'',			'#weight' : (idx=0),	enable:true, 	visible: true,		},
					type		: { type:'textfield',		label:'Type',				value:'equation',	'#weight' : (++idx),	enable:false,	visible: false,	 	},
					'draw-if'	: { type:'codetextfield',	label:'Draw if',			value:'',			'#weight' : (++idx),	enable:true,	visible: true,		},
					expresion	: { type:'codetextfield',	label:'Expresion',			value:'x=y',		'#weight' : (++idx),	enable:false,	visible: true, 		},
					colour		: { type:'colorpicker',		label:'Colour',				value:'0020303a',	'#weight' : (++idx),	enable:false,	visible: true, 		},
					trace		: { type:'checkbox_color',	label:'Trace color',		value:'no,gray',	'#weight' : (++idx),	enable:true,	visble:true,		},
					fillplus	: { type:'checkbox_color',	label:'Fill color',			value:'no,green',	'#weight' : (++idx),	enable:true,	visble:true,		},
					fillminus	: { type:'checkbox_color',	label:'Fill minus color',	value:'no,orange',	'#weight' : (++idx),	enable:true,	visble:true,		},
					widthness	: { type:'textfield', 		label:'Widthness', 			value:'1',			'#weight' : (++idx),	enable:true, 	visible: false,		},
					visible		: { type:'checkbox',		label:'Visible',			value:false,		'#weight' : (++idx),	enable:true,	visible: true,		},
					background	: { type:'checkbox',		label:'Visible',			value:false,		'#weight' : (++idx),	enable:true,	visible: true,		},
					editable	: { type:'checkbox',		label:'Editable',			value:false,		'#weight' : (++idx),	enable:true,	visible: true,		},
					abscoor		: { type:'radio_options',	label:'Coordinates',		value:false,		'#weight' : (++idx),	enable:true,	visible: true,		options: [{label:'Absolutes',value:true},{label:'Relatives',value:false}]},
					space		: { type:'combobox',		label:'Region',				value:0,			'#weight' : (++idx),	enable:true, 	visible: true, 			group:'Operative',	options:descartes.editor.ui_config.utils.getSpacesListForMenu},
					info		: { type:'textfield',		label:'Comments',			value:'',			'#weight' : (++idx),	enable:true,	visible: true,		},
					family		: { type:'familyfield',		label:'Family',				value:{param:'t',init:0,end:1,step:8},			'#weight' : (++idx),	enable:true,	visible: true,		},
				},
				text: {
					id			: { type:'textfield', 		label:'ID', 				value:'',			'#weight' : (idx=0),	enable:true, 	visible: true,		},
					type		: { type:'textfield',		label:'Type',				value:'equation',	'#weight' : (++idx),	enable:false,	visible: false,	 	},
					'draw-if'	: { type:'codetextfield',	label:'Draw if',			value:'',			'#weight' : (++idx),	enable:true,	visible: true,		},
					expr		: { type:'codetextfield',	label:'Expresion',			value:'x=y',		'#weight' : (++idx),	enable:false,	visible: true, 		},
					widthness	: { type:'textfield',		label:'Widthness', 			value:'1',			'#weight' : (++idx),	enable:true, 	visible: false,		},
					visible		: { type:'checkbox',		label:'Visible',			value:false,		'#weight' : (++idx),	enable:true,	visible: true,		},
					editable	: { type:'checkbox',		label:'Editable',			value:false,		'#weight' : (++idx),	enable:true,	visible: true,		},
					abscoor		: { type:'radio_options',	label:'Coordinates',		value:false,		'#weight' : (++idx),	enable:true,	visible: true,		options: [{label:'Absolutes',value:true},{label:'Relatives',value:false}]},
					space		: { type:'combobox',		label:'Region',				value:0,			'#weight' : (++idx),	enable:true, 	visible: true, 			group:'Operative',	options:descartes.editor.ui_config.utils.getSpacesListForMenu},
					info		: { type:'textfield',		label:'Comments',			value:'',			'#weight' : (++idx),	enable:true,	visible: true,		},
					family		: { type:'familyfield',		label:'Family',				value:{param:'t',init:0,end:1,step:8},			'#weight' : (++idx),	enable:true,	visible: true,		},
				},
				curve: {
					id			: { type:'textfield', 		label:'ID', 				value:'',			'#weight' : (idx=0),	enable:true, 	visible: true,		},
					type		: { type:'textfield',		label:'Type',				value:'curve',		'#weight' : (++idx),	enable:false,	visible: false,	 	},
					cond		: { type:'codetextfield',	label:'Draw if',			value:'',			'#weight' : (++idx),	enable:true,	visible: true,		},
					expresion	: { type:'codetextfield',	label:'Expresion',			value:'x=y',		'#weight' : (++idx),	enable:false,	visible: true, 		},
					trace		: { type:'checkbox_color',	label:'Trace color',		value:'no,gray',	'#weight' : (++idx),	enable:true,	visble:true,		},
					colour		: { type:'colorpicker',		label:'Colour',				value:'0020303a',	'#weight' : (++idx),	enable:false,	visible: true, 		},
					fill		: { type:'checkbox_color',	label:'Fill color',			value:'no,green',	'#weight' : (++idx),	enable:true,	visble:true,		},
					widthness	: { type:'textfield', 		label:'Widthness', 			value:'1',			'#weight' : (++idx),	enable:true, 	visible: false,		},
					background	: { type:'checkbox',		label:'Visible',			value:false,		'#weight' : (++idx),	enable:true,	visible: true,		},
					visible		: { type:'checkbox',		label:'Visible',			value:false,		'#weight' : (++idx),	enable:true,	visible: true,		},
					editable	: { type:'checkbox',		label:'Editable',			value:false,		'#weight' : (++idx),	enable:true,	visible: true,		},
					abscoor		: { type:'radio_options',	label:'Coordinates',		value:false,		'#weight' : (++idx),	enable:true,	visible: true,		options: [{label:'Absolutes',value:true},{label:'Relatives',value:false}]},
					space		: { type:'combobox',		label:'Region',				value:0,			'#weight' : (++idx),	enable:true, 	visible: true, 			group:'Operative',	options:descartes.editor.ui_config.utils.getSpacesListForMenu},
					info		: { type:'textfield',		label:'Comments',			value:'',			'#weight' : (++idx),	enable:true,	visible: true,		},
					family		: { type:'familyfield',		label:'Family',				value:{param:'t',init:0,end:1,step:8},			'#weight' : (++idx),	enable:true,	visible: true,		},
				},
				
			},
			/*
			 * ******************************************************************
			 * *                   GRAPHICS R3                                  *
			 * ******************************************************************
			 */
			R3 : {
				point: {
					name		: { type:'textfield',			label:'Name',				value:'',			'#weight' : (idx=0),	enable:false,	visible: false,	 },
					type		: { type:'textfield',			label:'Type',				value:'point',		'#weight' : (++idx),	enable:false,	visible: false,	 },
					space		: { type:'combobox',			label:'Region',				value:0,			'#weight' : (++idx),	enable:true, 	visible: true, 		group:'Operative',	options:descartes.editor.ui_config.utils.getSpacesListForMenu},
					'draw-if'	: { type:'codetextfield',		label:'Draw if',			value:'',			'#weight' : (++idx),	enable:true,	visible: true,	 },
					background	: { type:'checkbox',			label:'On Background',		value:false,		'#weight' : (++idx),	enable:true,	visible: true,	 },
					colour		: { type:'colorpicker', 		label:'Colour',				value:'00eeffaa',	'#weight' : (++idx),	enable:true,	visble:true,	 },
					backcolor	: { type:'colorpicker', 		label:'Background color',	value:'006090a0',	'#weight' : (++idx),	enable:true,	visble:true,	 },
					family 		: { type:'familyfield', 		label:'Family',				value:{param:'s',init:0,end:1,steps:8},	'#weight' : (++idx),	enable:true,	visble:true,	 },
					expresion	: { type:'codetextfield',		label:'Expresion',			value:'x=y',		'#weight' : (++idx),	enable:false,	visible: true, 	 },
					width		: { type:'textfield', 			label:'Widthness', 			value:'1',			'#weight' : (++idx),	enable:true, 	visible: true,	 },
					split		: { type:'checkbox',			label:'On Background',		value:false,		'#weight' : (++idx),	enable:true,	visible: true,	 },
					inirot		: { type:'vectorfield',			label:'Init rotation',		value:'(0,0,0)',	'#weight' : (idx=0),	enable:true,	visible: true,	 'ui-params':{size:3} },
					inipos		: { type:'vectorfield',			label:'Init Position',		value:'(0,0,0)',	'#weight' : (idx=0),	enable:true,	visible: true,	 'ui-params':{size:3} },
					finrot		: { type:'vectorfield',			label:'Final rotation',		value:'(0,0,0)',	'#weight' : (idx=0),	enable:true,	visible: true,	 'ui-params':{size:3} },
					finpos		: { type:'vectorfield',			label:'Final position',		value:'(0,0,0)',	'#weight' : (idx=0),	enable:true,	visible: true,	 'ui-params':{size:3} },
					text		: { type:'richtextfield',		label:'Type',				value:'point',		'#weight' : (++idx),	enable:false,	visible: false,	 },
					decimal		: { type:'textfield',			label:'Amount of decimals',	value:'point',		'#weight' : (++idx),	enable:false,	visible: false,	 },
					fixed		: { type:'checkbox',			label:'Fixed Decimals',		value:false,		'#weight' : (++idx),	enable:true,	visible: true,	 },
					info		: { type:'textfield',			label:'Comments',			value:'',			'#weight' : (++idx),	enable:true,	visible: true,	 },
				},
				segment: {
					name		: { type:'textfield',			label:'Name',				value:'',			'#weight' : (idx=0),	enable:false,	visible: false,	 },
					type		: { type:'textfield',			label:'Type',				value:'segment',	'#weight' : (++idx),	enable:false,	visible: false,	 },
					space		: { type:'combobox',			label:'Region',				value:0,			'#weight' : (++idx),	enable:true, 	visible: true, 		group:'Operative',	options:descartes.editor.ui_config.utils.getSpacesListForMenu},
					'draw-if'	: { type:'codetextfield',		label:'Draw if',			value:'',			'#weight' : (++idx),	enable:true,	visible: true,	 },
					background	: { type:'checkbox',			label:'On Background',		value:false,		'#weight' : (++idx),	enable:true,	visible: true,	 },
					colour		: { type:'colorpicker', 		label:'Colour',				value:'00eeffaa',	'#weight' : (++idx),	enable:true,	visble:true,	 },
					backcolor	: { type:'colorpicker', 		label:'Background color',	value:'006090a0',	'#weight' : (++idx),	enable:true,	visble:true,	 },
					family 		: { type:'familyfield', 		label:'Family',				value:{param:'s',init:0,end:1,steps:8},	'#weight' : (++idx),	enable:true,	visble:true,	 },
					expresion	: { type:'codetextfield',		label:'Expresion',			value:'(0,0,0)(1,1,1)',		'#weight' : (++idx),	enable:false,	visible: true, 	 },
					width		: { type:'textfield', 			label:'Widthness', 			value:'1',			'#weight' : (++idx),	enable:true, 	visible: true,	 },
					split		: { type:'checkbox',			label:'On Background',		value:false,		'#weight' : (++idx),	enable:true,	visible: true,	 },
					inirot		: { type:'vectorfield',			label:'Init rotation',		value:'(0,0,0)',	'#weight' : (idx=0),	enable:true,	visible: true,	 'ui-params':{size:3} },
					inipos		: { type:'vectorfield',			label:'Init Position',		value:'(0,0,0)',	'#weight' : (idx=0),	enable:true,	visible: true,	 'ui-params':{size:3} },
					finrot		: { type:'vectorfield',			label:'Final rotation',		value:'(0,0,0)',	'#weight' : (idx=0),	enable:true,	visible: true,	 'ui-params':{size:3} },
					finpos		: { type:'vectorfield',			label:'Final position',		value:'(0,0,0)',	'#weight' : (idx=0),	enable:true,	visible: true,	 'ui-params':{size:3} },
					Nu			: { type:'textfield',			label:'U param steps',		value:'point',		'#weight' : (++idx),	enable:false,	visible: false,	 },
					info		: { type:'textfield',			label:'Comments',			value:'',			'#weight' : (++idx),	enable:true,	visible: true,	 },
				},
				
				polygon: {
					name		: { type:'textfield',			label:'Name',				value:'',			'#weight' : (idx=0),	enable:false,	visible: false,	 },
					type		: { type:'textfield',			label:'Type',				value:'polygon',	'#weight' : (++idx),	enable:false,	visible: false,	 },
					space		: { type:'combobox',			label:'Region',				value:0,			'#weight' : (++idx),	enable:true, 	visible: true, 		group:'Operative',	options:descartes.editor.ui_config.utils.getSpacesListForMenu},
					'draw-if'	: { type:'codetextfield',		label:'Draw if',			value:'',			'#weight' : (++idx),	enable:true,	visible: true,	 },
					background	: { type:'checkbox',			label:'On Background',		value:false,		'#weight' : (++idx),	enable:true,	visible: true,	 },
					colour		: { type:'colorpicker', 		label:'Colour',				value:'00eeffaa',	'#weight' : (++idx),	enable:true,	visble:true,	 },
					expresion	: { type:'codetextfield',		label:'Expresion',			value:'(0,0,0)(1,0,0)(1,1,0)(1,1,1)',		'#weight' : (++idx),	enable:false,	visible: true, 	 },
					family 		: { type:'familyfield', 		label:'Family',				value:{param:'s',init:0,end:1,steps:8},	'#weight' : (++idx),	enable:true,	visble:true,	 },
					inirot		: { type:'vectorfield',			label:'Init rotation',		value:'(0,0,0)',	'#weight' : (idx=0),	enable:true,	visible: true,	 'ui-params':{size:3} },
					inipos		: { type:'vectorfield',			label:'Init Position',		value:'(0,0,0)',	'#weight' : (idx=0),	enable:true,	visible: true,	 'ui-params':{size:3} },
					finrot		: { type:'vectorfield',			label:'Final rotation',		value:'(0,0,0)',	'#weight' : (idx=0),	enable:true,	visible: true,	 'ui-params':{size:3} },
					finpos		: { type:'vectorfield',			label:'Final position',		value:'(0,0,0)',	'#weight' : (idx=0),	enable:true,	visible: true,	 'ui-params':{size:3} },
					split		: { type:'checkbox',			label:'On Background',		value:false,		'#weight' : (++idx),	enable:true,	visible: true,	 },
					width		: { type:'textfield', 			label:'Widthness', 			value:'1',			'#weight' : (++idx),	enable:true, 	visible: true,	 },
					Nu			: { type:'textfield',			label:'U param steps',		value:'point',		'#weight' : (++idx),	enable:false,	visible: false,	 },
					info		: { type:'textfield',			label:'Comments',			value:'',			'#weight' : (++idx),	enable:true,	visible: true,	 },
				},
				curve: {
					name		: { type:'textfield',			label:'Name',				value:'',			'#weight' : (idx=0),	enable:false,	visible: false,	 },
					space		: { type:'combobox',			label:'Region',				value:0,			'#weight' : (++idx),	enable:true, 	visible: true, 		group:'Operative',	options:descartes.editor.ui_config.utils.getSpacesListForMenu},
					type		: { type:'textfield',			label:'Type',				value:'curve',		'#weight' : (++idx),	enable:false,	visible: false,	 },
					background	: { type:'checkbox',			label:'On Background',		value:false,		'#weight' : (++idx),	enable:true,	visible: true,	 },
					colour		: { type:'colorpicker', 		label:'Colour',				value:'00eeffaa',	'#weight' : (++idx),	enable:true,	visble:true,	 },
					'draw-if'	: { type:'codetextfield',		label:'Draw if',			value:'',			'#weight' : (++idx),	enable:true,	visible: true,	 },
					expresion	: { type:'codetextfield',		label:'Expresion',			value:'x=cos(4*pi*u) y=sen(4*pi*u) z=2*u-1',		'#weight' : (++idx),	enable:false,	visible: true, 	 },
					family 		: { type:'familyfield', 		label:'Family',				value:{param:'s',init:0,end:1,steps:8},	'#weight' : (++idx),	enable:true,	visble:true,	 },
					inirot		: { type:'vectorfield',			label:'Init rotation',		value:'(0,0,0)',	'#weight' : (idx=0),	enable:true,	visible: true,	 'ui-params':{size:3} },
					inipos		: { type:'vectorfield',			label:'Init Position',		value:'(0,0,0)',	'#weight' : (idx=0),	enable:true,	visible: true,	 'ui-params':{size:3} },
					finrot		: { type:'vectorfield',			label:'Final rotation',		value:'(0,0,0)',	'#weight' : (idx=0),	enable:true,	visible: true,	 'ui-params':{size:3} },
					finpos		: { type:'vectorfield',			label:'Final position',		value:'(0,0,0)',	'#weight' : (idx=0),	enable:true,	visible: true,	 'ui-params':{size:3} },
					split		: { type:'checkbox',			label:'On Background',		value:false,		'#weight' : (++idx),	enable:true,	visible: true,	 },
					width		: { type:'textfield', 			label:'Widthness', 			value:'1',			'#weight' : (++idx),	enable:true, 	visible: true,	 },
					Nu			: { type:'textfield',			label:'U param steps',		value:'point',		'#weight' : (++idx),	enable:false,	visible: false,	 },
					info		: { type:'textfield',			label:'Comments',			value:'',			'#weight' : (++idx),	enable:true,	visible: true,	 },
				},
				triangle: {
					name		: { type:'textfield',			label:'Name',				value:'',			'#weight' : (idx=0),	enable:false,	visible: false,	 },
					space		: { type:'combobox',			label:'Region',				value:0,			'#weight' : (++idx),	enable:true, 	visible: true, 		group:'Operative',	options:descartes.editor.ui_config.utils.getSpacesListForMenu},
					type		: { type:'textfield',			label:'Type',				value:'triangle',	'#weight' : (++idx),	enable:false,	visible: false,	 },
					background	: { type:'checkbox',			label:'On Background',		value:false,		'#weight' : (++idx),	enable:true,	visible: true,	 },
					colour		: { type:'colorpicker', 		label:'Colour',				value:'00eeffaa',	'#weight' : (++idx),	enable:true,	visble:true,	 },
					backcolor	: { type:'colorpicker', 		label:'Background color',	value:'006090a0',	'#weight' : (++idx),	enable:true,	visble:true,	 },
					'draw-if'	: { type:'codetextfield',		label:'Draw if',			value:'',			'#weight' : (++idx),	enable:true,	visible: true,	 },
					expresion	: { type:'codetextfield',		label:'Expresion',			value:'(1,0,0)(0,1,0)(0,0,1)',		'#weight' : (++idx),	enable:false,	visible: true, 	 },
					family 		: { type:'familyfield', 		label:'Family',				value:{param:'s',init:0,end:1,steps:8},	'#weight' : (++idx),enable:true,	visble:true,	 },
					inirot		: { type:'vectorfield',			label:'Init rotation',		value:'(0,0,0)',	'#weight' : (idx=0),	enable:true,	visible: true,	 'ui-params':{size:3} },
					inipos		: { type:'vectorfield',			label:'Init Position',		value:'(0,0,0)',	'#weight' : (idx=0),	enable:true,	visible: true,	 'ui-params':{size:3} },
					finrot		: { type:'vectorfield',			label:'Final rotation',		value:'(0,0,0)',	'#weight' : (idx=0),	enable:true,	visible: true,	 'ui-params':{size:3} },
					finpos		: { type:'vectorfield',			label:'Final position',		value:'(0,0,0)',	'#weight' : (idx=0),	enable:true,	visible: true,	 'ui-params':{size:3} },
					split		: { type:'checkbox',			label:'On Background',		value:false,		'#weight' : (++idx),	enable:true,	visible: true,	 },
					edges		: { type:'checkbox',			label:'Show edges',			value:false,		'#weight' : (++idx),	enable:true,	visible: true,	 },
					model		: { type:'combobox',			label:'Model',				value:'metal',		'#weight' : (++idx),	enable:true, 	visible: true, 	options:{'Colour':'color','Light':'ligth','Metal':'metal','Wire':'wire'}},
					info		: { type:'textfield',			label:'Comments',			value:'',			'#weight' : (++idx),	enable:true,	visible: true,	 },
				},
				face: {
					name		: { type:'textfield',			label:'Name',				value:'',			'#weight' : (idx=0),	enable:false,	visible: false,	 },
					space		: { type:'combobox',			label:'Region',				value:0,			'#weight' : (++idx),	enable:true, 	visible: true, 		group:'Operative',	options:descartes.editor.ui_config.utils.getSpacesListForMenu},
					type		: { type:'textfield',			label:'Type',				value:'face',		'#weight' : (++idx),	enable:false,	visible: false,	 },
					background	: { type:'checkbox',			label:'On Background',		value:false,		'#weight' : (++idx),	enable:true,	visible: true,	 },
					colour		: { type:'colorpicker', 		label:'Colour',				value:'00eeffaa',	'#weight' : (++idx),	enable:true,	visble:true,	 },
					backcolor	: { type:'colorpicker', 		label:'Background color',	value:'006090a0',	'#weight' : (++idx),	enable:true,	visble:true,	 },
					'draw-if'	: { type:'codetextfield',		label:'Draw if',			value:'',			'#weight' : (++idx),	enable:true,	visible: true,	 },
					expresion	: { type:'codetextfield',		label:'Expresion',			value:'(0,0)(0,1)(1,1)',		'#weight' : (++idx),	enable:false,	visible: true, 	 },
					family 		: { type:'familyfield', 		label:'Family',				value:{param:'s',init:0,end:1,steps:8},	'#weight' : (++idx),enable:true,	visble:true,	 },
					inirot		: { type:'vectorfield',			label:'Init rotation',		value:'(0,0,0)',	'#weight' : (idx=0),	enable:true,	visible: true,	 'ui-params':{size:3} },
					inipos		: { type:'vectorfield',			label:'Init Position',		value:'(0,0,0)',	'#weight' : (idx=0),	enable:true,	visible: true,	 'ui-params':{size:3} },
					finrot		: { type:'vectorfield',			label:'Final rotation',		value:'(0,0,0)',	'#weight' : (idx=0),	enable:true,	visible: true,	 'ui-params':{size:3} },
					finpos		: { type:'vectorfield',			label:'Final position',		value:'(0,0,0)',	'#weight' : (idx=0),	enable:true,	visible: true,	 'ui-params':{size:3} },
					split		: { type:'checkbox',			label:'On Background',		value:false,		'#weight' : (++idx),	enable:true,	visible: true,	 },
					edges		: { type:'checkbox',			label:'Show edges',			value:false,		'#weight' : (++idx),	enable:true,	visible: true,	 },
					model		: { type:'combobox',			label:'Model',				value:'metal',		'#weight' : (++idx),	enable:true, 	visible: true, 	options:{'Colour':'color','Light':'ligth','Metal':'metal','Wire':'wire'}},
					info		: { type:'textfield',			label:'Comments',			value:'',			'#weight' : (++idx),	enable:true,	visible: true,	 },
				},
				regpoly: {
					name		: { type:'textfield',			label:'Name',				value:'',			'#weight' : (idx=0),	enable:false,	visible: false,	 },
					space		: { type:'combobox',			label:'Region',				value:0,			'#weight' : (++idx),	enable:true, 	visible: true, 		group:'Operative',	options:descartes.editor.ui_config.utils.getSpacesListForMenu},
					type		: { type:'textfield',			label:'Type',				value:'regpoly',	'#weight' : (++idx),	enable:false,	visible: false,	 },
					background	: { type:'checkbox',			label:'On Background',		value:false,		'#weight' : (++idx),	enable:true,	visible: true,	 },
					colour		: { type:'colorpicker', 		label:'Colour',				value:'00eeffaa',	'#weight' : (++idx),	enable:true,	visble:true,	 },
					backcolor	: { type:'colorpicker', 		label:'Background color',	value:'006090a0',	'#weight' : (++idx),	enable:true,	visble:true,	 },
					'draw-if'	: { type:'codetextfield',		label:'Draw if',			value:'',			'#weight' : (++idx),	enable:true,	visible: true,	 },
					
					
					expresion	: { type:'combobox',			label:'Expresion',			value:'(0,0)(0,1)(1,1)',		'#weight' : (++idx),	enable:false,	visible: true, 	 },
					family 		: { type:'familyfield', 		label:'Family',				value:{param:'s',init:0,end:1,steps:8},	'#weight' : (++idx),enable:true,	visble:true,	 },
					inirot		: { type:'vectorfield',			label:'Init rotation',		value:'(0,0,0)',	'#weight' : (idx=0),	enable:true,	visible: true,	 'ui-params':{size:3} },
					inipos		: { type:'vectorfield',			label:'Init Position',		value:'(0,0,0)',	'#weight' : (idx=0),	enable:true,	visible: true,	 'ui-params':{size:3} },
					finrot		: { type:'vectorfield',			label:'Final rotation',		value:'(0,0,0)',	'#weight' : (idx=0),	enable:true,	visible: true,	 'ui-params':{size:3} },
					finpos		: { type:'vectorfield',			label:'Final position',		value:'(0,0,0)',	'#weight' : (idx=0),	enable:true,	visible: true,	 'ui-params':{size:3} },
					split		: { type:'checkbox',			label:'On Background',		value:false,		'#weight' : (++idx),	enable:true,	visible: true,	 },
					edges		: { type:'checkbox',			label:'Show edges',			value:false,		'#weight' : (++idx),	enable:true,	visible: true,	 },
					model		: { type:'combobox',			label:'Model',				value:'metal',		'#weight' : (++idx),	enable:true, 	visible: true, 	options:{'Colour':'color','Light':'ligth','Metal':'metal','Wire':'wire'}},
					info		: { type:'textfield',			label:'Comments',			value:'',			'#weight' : (++idx),	enable:true,	visible: true,	 },
				},
				
				
				
				equation: {
					id			: { type:'textfield', 			label:'ID', 				value:'',			'#weight' : (idx=0),	enable:true,	visible: true,	 },
					type		: { type:'textfield',			label:'Type',				value:'equation',	'#weight' : (++idx),	enable:false,	visible: false,	 },
					'draw-if'	: { type:'codetextfield',		label:'Draw if',			value:'',			'#weight' : (++idx),	enable:true,	visible: true,	 },
					expr		: { type:'codetextfield',		label:'Expresion',			value:'x=y',		'#weight' : (++idx),	enable:false,	visible: true, 	 },
					trace		: { type:'checkbox_color', 		label:'Trace color',		value:'no,gray',	'#weight' : (++idx),	enable:true,	visble:true,	 },
					fillplus	: { type:'checkbox_color', 		label:'Fill color',			value:'no,green',	'#weight' : (++idx),	enable:true,	visble:true,	 },
					fillminus	: { type:'checkbox_color', 		label:'Fill minus color',	value:'no,orange',	'#weight' : (++idx),	enable:true,	visble:true,	 },
					widthness	: { type:'textfield', 			label:'Widthness', 			value:'1',			'#weight' : (++idx),	enable:true, 	visible: false,	 },
					visible		: { type:'checkbox',			label:'Visible',			value:false,		'#weight' : (++idx),	enable:true,	visible: true,	 },
					editable	: { type:'checkbox',			label:'Editable',			value:false,		'#weight' : (++idx),	enable:true,	visible: true,	 },
					abscoor		: { type:'radio_options',		label:'Coordinates',		value:false,		'#weight' : (++idx),	enable:true,	visible: true,		options: [{label:'Absolutes',value:true},{label:'Relatives',value:false}]},
					space		: { type:'combobox',			label:'Region',				value:0,			'#weight' : (++idx),	enable:true, 	visible: true, 		group:'Operative',	options:descartes.editor.ui_config.utils.getSpacesListForMenu},
					info		: { type:'textfield',			label:'Comments',			value:'',			'#weight' : (++idx),	enable:true,	visible: true,	 },
				},
			}
		},
		
		/*
		 * ******************************************************************
		 * *                   AUXILIARS                                    *
		 * ******************************************************************
		 */
		auxiliar : {
			array : {
				id			: {type:'textfield',		label:'ID',				value:'',			'#weight' : (idx=0),},
				expresion	: {type:'textfield',		label:'Expresion',		value:'',			'#weight' : (++idx),},
				evaluate	: {type:'checkbox',			label:'Evaluate',		value:'',			'#weight' : (++idx),},
				array		: {type:'checkbox',			label:'Is array',		value:'true',		'#weight' : (++idx),},
			},
			matrix : {
				id			: {type:'textfield',		label:'ID',				value:'',			'#weight' : (idx=0),},
				expresion	: {type:'textfield',		label:'Expresion',		value:'',			'#weight' : (++idx),},
				evaluate	: {type:'checkbox',			label:'Evaluate',		value:'',			'#weight' : (++idx),},
				matrix		: {type:'checkbox',			label:'Is matrix',		value:'true',		'#weight' : (++idx),},
			},
			constant : {
				id			: {type:'textfield',		label:'ID',				value:'',			'#weight' : (idx=0),},
				expresion	: {type:'textfield',		label:'Expresion',		value:'0',			'#weight' : (++idx),},
				evaluate	: {type:'checkbox',			label:'Evaluate',		value:'',			'#weight' : (++idx),},
				constant	: {type:'checkbox',			label:'Is contant',		value:'true',		'#weight' : (++idx),},
			},
			variable : {
				id			: {type:'textfield',		label:'ID',				value:'',			'#weight' : (idx=0),},
				expresion	: {type:'textfield',		label:'Expresion',		value:'0',			'#weight' : (++idx),},
				
			},
			algorithm : {
				id			: {type:'textfield',		label:'ID',				value:'',			'#weight' : (idx=0),},
				expresion	: {type:'textfield',		label:'Expresion',		value:'',			'#weight' : (++idx),},
				local		: {type:'textfield',		label:'Local',			value:'',			'#weight' : (++idx),},
				init		: {type:'textfield',		label:'Inicio',			value:'',			'#weight' : (++idx),},
				'do'		: {type:'codetextfield', 	label:'Do',				value:'',			'#weight' : (++idx),},
				'while'		: {type:'textfield',		label:'While',			value:'',			'#weight' : (++idx),},
				algorithm	: {type:'checkbox',			label:'Algorithm',		value:'true',		'#weight' : (++idx),},
			},
			'function' : {
				id			: {type:'textfield',		label:'ID',				value:'',			'#weight' : (idx=0),},
				expresion	: {type:'textfield',		label:'Expresion',		value:'x',			'#weight' : (++idx),},
				range		: {type:'textfield',		label:'Range',			value:'',			'#weight' : (++idx),},
				local		: {type:'textfield',		label:'Local',			value:'',			'#weight' : (++idx),},
				init		: {type:'textfield',		label:'Inicio',			value:'',			'#weight' : (++idx),},
				'do'		: {type:'codetextfield', 	label:'Do',				value:'',			'#weight' : (++idx),},
				'while'		: {type:'textfield',		label:'While',			value:'',			'#weight' : (++idx),},
				algorithm	: {type:'checkbox',			label:'Is contant',		value:'false',		'#weight' : (++idx),},
			},
		},
	};

return descartes;
})((descartes||{}),jQuery);
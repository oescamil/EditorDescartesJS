var DescartesNumericControlEditPane = (function(){
var _super_ = DescartesControlEditPane;
	
function DescartesNumericControlEditPane(objectToBind,descartes_context){
	 _super_.call(this, objectToBind,descartes_context);
}

var proto = DescartesNumericControlEditPane;
proto.prototype = Object.create(_super_.prototype);
proto.prototype.constructor = proto;
proto = proto.prototype;

var regSpcSep = '--';

/**
 * 
 */
proto.getCtrNumericGUITypes = function (){
	
	var ctrsCfg = descartes.editor.ui_config.utils.getObjectTypeTree();;
	
	var options = {};
	for(var guiId in ctrsCfg.numeric){
		options[guiId] = this.babel.t(guiId);
	}
	return options;
};

/**
 * 
 */
proto.createVisualComponentForTypeAlter = function(fieldName, fieldCfg, fieldValues,htmlNodeToAlter){
	if(fieldName == 'regionOrSpace'){
		var regionOrSpace = $('.field-input-regionOrSpace', htmlNodeToAlter);
		var space 	= fieldValues.space || '';
		var region	= fieldValues.region || 'south';
		
		var value = 'region'+regSpcSep+'south';
		if(region == 'interior'){
			value = 'space'+regSpcSep+space;
		} else {
			value = 'region'+regSpcSep+region;
		}
		regionOrSpace.val(value);
	}
	return htmlNodeToAlter;
};

/**
 * 
 */
proto.getVisualGUIAlter = function(htmlNodeToAlter){
	return htmlNodeToAlter;
};


proto.getCtrNumericGUIActions = function(){
	return {
		calculate	: 'Calculate',
		init		: 'Reinit',
		pause		: 'Pause',
		animate		: 'Animate',
		'open URL'	: 'Open URL',
		play		: 'Play', 
		
	};
};


proto.getSpacesListForMenu = function (){
	
	var regOpt = this.getRegionOptionsList();
	var spcOpt = this.getSpaceOptionsList();
	
	var tmpOpt = {};
	var sep = regSpcSep;
	for ( var idOpt in regOpt) {
		tmpOpt['region'+sep+idOpt] = regOpt[idOpt];
	}
	regOpt = tmpOpt;
	
	tmpOpt = {};
	for ( var idOpt in spcOpt) {
		tmpOpt['space'+sep+idOpt] = spcOpt[idOpt];
	}
	spcOpt = tmpOpt;
	
	return  {
			regions : {
				label		: 'Regions',
				children	: regOpt
			},
			spaces : {
				label		: 'Spaces',
				children	: spcOpt,
			}
	};
};


/**
 * 
 */
proto.getConfig = function(){
	var origCfg = _super_.prototype.getConfig.call(this);
	
	
	/*
	 * *******************************************
	 * Operative GROUP 
	 * *******************************************
	 */
	var operChilds = origCfg.operativeGroup.children;
	
	operChilds.type.value = 'numeric';
	
	operChilds.only_text = {
		type	: 'checkbox',
		label	: 'Text only',
	};
	operChilds.value = {
		type:'codetextfield',	
		label:'Value',					 	
		value:'',				
	};
	operChilds.sup				= {type : 'codetextfield',	label : 'Maximun',				value:'',									};
	operChilds.inf				= {type : 'codetextfield',	label : 'Minimum',				value:'',									};
	operChilds.incr				= {type : 'codetextfield',	label : 'Increase',				value:'0.1',								};
	operChilds.discrete			= {type : 'checkbox', 		label : 'Discrete',				value:'no'									};
	operChilds.text				= {type : 'codetextfield',	label : 'Text',					value:'',			auxiliarEditor:{type:'rtfEditor'}	};
	
	
	origCfg.actionGroup = {
			type	: 'fieldset',
			label	: 'Action',
			children : {
				action			: {type:'combobox',			label:'Action',					value:'',			options:$.proxy(this.getCtrNumericGUIActions,this)	},
				parameter		: {type:'textfield',		label:'Parameter',				value:'',												},
			}
	};
	
	
	/*
	 * ********************************************
	 * Visual GROUP 
	 * *******************************************
	 */
	var oldVisual = origCfg.visualGroup;
	delete(origCfg.visualGroup); // Para pasarlo al final
	origCfg.visualGroup = oldVisual;
	var visualChilds = oldVisual.children;
	
	visualChilds.gui = {
		type	: 'textfield',			
		label	: 'Interface',				
		value	: 'spinner',		
		enable  : false,	
		visible	: false,				
	};
	visualChilds.name = {
		type:'textfield',		
		label:'Label',
		value:'',
	};
	visualChilds.regionOrSpace = {
		type	: 'combobox',			
		label	: 'Region',					
		value	: 'region_south',				
		options	: $.proxy(this.getSpacesListForMenu,this),
		justCallBack : true,
		callback : $.proxy(function(fieldName,value,fieldValues,input){ // Tenemos que actualizar region y espacio.
			value = value.split(regSpcSep);
			var spaceList = this.getSpaceOptionsList();
			var spaceVal = '';
			
			console.log("Se selecciono el valor de region : ",value);
			var regionVal = 'south';
			if(value[0] == 'space' && spaceList.hasOwnProperty(value[1])){
				spaceVal = value[1];
				regionVal = 'interior';
			} else {
				spaceVal = '';
				regionVal = value[1];	
			}
			
			$('.field-input-space',this.visualComponent).val(spaceVal).trigger('change');
			$('.field-input-region',this.visualComponent).val(regionVal).trigger('change');
		},this),
	};
	
	
	visualChilds.region.value = 'south'; 
	visualChilds.region.enable = false; 
	visualChilds.region.visible = false; 

	visualChilds.space.value = ''; 
	visualChilds.space.enable = false; 
	visualChilds.space.visible = false; 
	

	visualChilds.visible				= {type:'checkbox',			label:'Show value',		value:true,};
	visualChilds['exponential-if']		= {type:'codetextfield', 	label:'Show exponential if',	value:'',};
	visualChilds.decimalGroup 			= {
		type		: 'fieldset',
		label		: 'Decimals',
		attr 		: {'class' : 'inline-container'},
		children : {
			decimals			: {type:'codetextfield',	label:'',				value:'2', },
			fixed				: {type:'checkbox',			label:'Fixed',			value:true, labelposition : 'right'},
		}
	};
	visualChilds.tooltip	= {type:'codetextfield',	label:'Tooltip',				value:'',};
	visualChilds.expl		= {type:'codetextfield',	label:'Descriptor',				value:'',};
	
	origCfg.evaluate		= {
		type	: 'checkboxfieldset',			
		label	: 'Evaluate',				
		value	: 'yes',	
		children : {
			answer : {type:'textfield',		label:'Answer',	value:'', },
			weight : {type:'textfield',		label:'Weight',	value:'2', },
		},
	};
	/*
	 * *******************************************
	 * COMMENTS GROUP 
	 * *******************************************
	 */
	var oldInfo = origCfg.commentsGroup;
	delete origCfg.commentsGroup;
	origCfg.commentsGroup = oldInfo; // Asi queda como el ultimo elemento
	
	
	return origCfg;
};







return DescartesNumericControlEditPane; })();
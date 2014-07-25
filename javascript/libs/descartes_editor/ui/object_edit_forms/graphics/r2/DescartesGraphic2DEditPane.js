var DescartesGraphics2DEditPane = (function(){
	var _super_ = DescartesEditObjectPane;

	var Class = function(objectToBind,descartes_context){
		_super_.call(this, objectToBind,descartes_context);
	};

	var proto = Class;
	proto.prototype = Object.create(_super_.prototype);
	proto.prototype.constructor = proto;
	proto = proto.prototype;

	
	
	
	
	
	
	
	/**
	 * 
	 * @param fieldName
	 * @param value
	 * @param fieldValues
	 */
	proto.updateFamilyParamFromInput = function(fieldName,value,fieldValues){
		value = $.trim(value);
		if(!value || value.length <= 0){
			console.log("Invalid value for family param : ",value);
			value = 't';
			$input = $()
		}
		
		
		
		
		
		var origVal = $.trim(fieldValues['family']);
		var orgFamValues = {};
		if(origVal && origVal.length > 0 ){
			if(fieldValues.hasOwnProperty(origVal)){
				orgFamValues = fieldValues[origVal];
				delete fieldValues[origVal];
			}
		} 
		
		fieldValues[value] = orgFamValues;
	};
	
	/**
	 * 
	 * @param fieldName
	 * @param value
	 * @param fieldValues
	 */
	proto.updateFamilyIntervalInitFromInput = function(fieldName,value,fieldValues){
		var origVal = $.trim(fieldValues['family']);
		if(origVal && origVal.length > 0 ){
			var orgFamValues = {};
			if(fieldValues.hasOwnProperty(origVal)){
				orgFamValues = fieldValues[origVal];
				delete fieldValues[origVal];
			}
			
			fieldValues[origVal] = orgFamValues;
		} else {
			console.log("El valor del parametro para la familia no era un string valido. valor :",origVal);
		}
	};
	
	
	/**
	 * 
	 */
	proto.getConfig = function(){
		var origCfg = _super_.prototype.getConfig.call(this);
		
		var commentsGroup 	= origCfg.commentsGroup;
		var operativeGroup	= origCfg.operativeGroup;
		var visualGroup 	= origCfg.visualGroup;
		//id='a2' type='audio' region='external' space='E1' expresion='(01,01)' draw-if='aaa' file='aaa'

		delete origCfg.operativeGroup;
		delete origCfg.visualGroup;
		delete origCfg.commentsGroup;
		
		origCfg.space = {
				type	: 'combobox',
				label	: 'Region',
				value	: 0,
				options	: $.proxy(this.getSpaceOptionsList,this),
		};
		
		origCfg.type = { 
			type:'textfield',
			label:'Type',
			value:'equation',
			enable:false,	
			visible: false,
			forcevalue : true,
		};
		
		origCfg.abscoor = {
			type:'radios',
			label:'Coordinates',
			value:'no',
			options	: {
				yes	: 'Absolutes',
				no	: 'Relatives',
			}
		};
		origCfg.background	= {
			type	: 'checkbox',
			label	: 'Draw in background',
			value	: 'no',
		};
		
		origCfg.family = {
				type	: 'checkboxfieldset',	
				label	: 'Family',
				value	: {param:'t',init:0,end:1,step:8},
				value	: 'no',
				children : {
					param : {
						type 	: 'textfield',
						label 	: 'Parameter',
						value	: 't',
						justcallback: true,
						callback : $.proxy(this.updateFamilyParamFromInput,this),
					},
					interevalGroup :{
						type		: 'fieldset',	
						label		: 'Interval',
						children	: {
							init : {
								type 	: 'textfield',
								label 	: 'Init',
								value	: '0',
								justcallback: true,
							},
							end : {
								type 	: 'textfield',
								label 	: 'End',
								value	: '1',
								justcallback: true,
							},
						}
					}, 
					steps : {
						type 	: 'textfield',
						label 	: 'Steps',
						value	: '8',
						justcallback: true,
					},
				}
			};
		
		
		
		origCfg['draw-if'] = { 
			type:'codetextfield',
			label:'Draw if',
			value:'',
		};
		
		origCfg.expresion = { 
			type:'codetextfield',
			label:'Expresion',
			value:'x=y',
		};
		
		origCfg.widthness	= {
				type:'textfield',
				label:'Widthness',
				value:'1',
		};
		
		origCfg.colour = { 
			type:'colorpicker',
			label:'Colour',
			value:'0020303a',
		};
		
		origCfg.trace = { 
			type:'checkbox_color',
			label:'Trace color',
			value:'no,gray',
		};
		
		origCfg.fillplus = {
			type:'checkbox_color',
			label:'Fill color',	
			value:'no,green',
		};
		
		origCfg.fillminus	= {
			type:'checkbox_color',	
			label:'Fill minus color',	
			value:'no,orange',
		};
		
		
		origCfg.expresionGroup = {
			type	: 'fieldset',
			label 	: 'Expression interaction',
			children :  {
				visible : { 
					type:'checkbox',
					label:'Visible',
					value:'yes',
				},
				editable : {
					type:'checkbox',
					label:'Editable',
					value:'no',
				},
			},
		};
		
		
	
		
		
		
		origCfg.commentsGroup = commentsGroup;	
		return origCfg ;
	};

	//No register, is abstract class
	//DescartesEditObjectPane.registerHandler('control.audio',Class);
	
	return Class; })();
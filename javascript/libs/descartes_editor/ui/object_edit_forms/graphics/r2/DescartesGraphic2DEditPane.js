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
	 * OVERIDE
	 * @returns {___anonymous455_456}
	 */
	proto.getBindingCfg = function(){
		var onlyBindingFields = _super_.prototype.getBindingCfg.call(this);
		onlyBindingFields.family = {
				type 	: 'object',
				value	: {parameter : 't',steps:8,interval:' [0,1]'},
		};
		
		//Id we have family, we known the object 't' (Or whatever its name is	)
		if(this.fields['family'] && this.fields['family'].length > 0 ){
			var famParam = this.fields['family'];
			onlyBindingFields[famParam] = {
					type 	: 'object',
					value	: {steps:8,interval:' [0,1]'},
			};
		}
		
		console.log("Regrsando como valores conocidos : ",onlyBindingFields);
		return onlyBindingFields;
	};
	
	
	
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
			$input = $('.field-container--familyparam .field-input-sup-familyparam');
			$input.val(value);
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
		var paramKey = (fieldValues['family'])?$.trim(fieldValues['family']):'t';
		if(!fieldValue.hasOwnProperty(paramKey)){
			fieldValue[paramKey] = {};
		}
		
		var fieldFamilyValue = fieldValues[paramKey];
		if(!fieldFamilyValue.hasOwnProperty('interval')){
			fieldFamilyValue.interval = "[0,1]"; 
		}
		
		var fieldValue = fieldFamilyValue.interval;
		var regExp = /^\[(.+)\,(.+)\]$/;
		if(!regExp.test(fieldValue)){
			console.log("Invalid value for field family interval : ",fieldValue,fieldFamilyValue,fieldValues);
		} 
		
		value = $.trim(value);
		fieldValue = fieldValue.replace(regExp,"["+value+",$1]");
		fieldFamilyValue.interval = fieldValue;
		
	};
	
	
	/**
	 * 
	 * @param fieldName
	 * @param value
	 * @param fieldValues
	 */
	proto.updateFamilyIntervalEndFromInput = function(fieldName,value,fieldValues){
		var paramKey = (fieldValues['family'])?$.trim(fieldValues['family']):'t';
		if(!fieldValue.hasOwnProperty(paramKey)){
			fieldValue[paramKey] = {};
		}
		
		var fieldFamilyValue = fieldValues[paramKey];
		if(!fieldFamilyValue.hasOwnProperty('interval')){
			fieldFamilyValue.interval = "[0,1]"; 
		}
		
		var fieldValue = fieldFamilyValue.interval;
		var regExp = /^\[(.+)\,(.+)\]$/;
		if(!regExp.test(fieldValue)){
			console.log("Invalid value for field family interval : ",fieldValue,fieldFamilyValue,fieldValues);
		} 
		
		value = $.trim(value);
		fieldValue = fieldValue.replace(regExp,"[$1,"+value+"]");
		fieldFamilyValue.interval = fieldValue;
		
	};
	
	/**
	 * 
	 * @param fieldName
	 * @param value
	 * @param fieldValues
	 */
	proto.updateFamilyIntervalStepsFromInput = function(fieldName,value,fieldValues){
		var paramKey = (fieldValues['family'])?$.trim(fieldValues['family']):'t';
		if(!fieldValue.hasOwnProperty(paramKey)){
			fieldValue[paramKey] = {};
		}
		
		var fieldFamilyValue = fieldValues[paramKey];
		if(!fieldFamilyValue.hasOwnProperty('steps')){
			fieldFamilyValue.steps = 8; 
		} 
		
		fieldFamilyValue.steps = value;
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
					familyparam : {
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
							familyinit : {
								type 	: 'textfield',
								label 	: 'Init',
								value	: '0',
								justcallback: true,
							},
							familyend : {
								type 	: 'textfield',
								label 	: 'End',
								value	: '1',
								justcallback: true,
							},
						}
					}, 
					familysteps : {
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
			label:'Expression',
			value:'x=y',
		};
		
		origCfg.widthness	= {
				type:'textfield',
				label:'Widthness',
				value:'1',
		};
		origCfg.size	= {
				type	: 'textfield',
				label	: 'Size',
				value	: '1',
		};
		
		origCfg.decimalGroup  = {
			type		: 'fieldset',
			label		: 'Decimals',
			attr 		: {'class' : 'inline-container'},
			children : {
				decimals			: {type:'codetextfield',	label:'',				value:'2', },
				fixed				: {type:'checkbox',			label:'Fixed',			value:true, labelposition : 'right'},
			}
		};
		
		origCfg.color = { 
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
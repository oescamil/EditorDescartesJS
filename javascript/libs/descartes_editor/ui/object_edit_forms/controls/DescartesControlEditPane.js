var DescartesControlEditPane = (function(){
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
	 * @returns {___anonymous406_498}
	 */
	proto.getRegionOptionsList = function(){

		var options = {
			'north' : 'North',	
			'south' : 'South',	
			'east'	: 'East',	
			'west'	: 'West',	
		};
		return options;
	};
	

	/**
	 * 
	 */
	proto.getConfig = function(){
		console.log("LLamado desde que tipo de Control : ", this.constructor, this);
		var origCfg = _super_.prototype.getConfig.call(this);
		var operativeGroup	= origCfg.operativeGroup.children;
		var visualGroup 	= origCfg.visualGroup.children;
		//id='a2' type='audio' region='external' space='E1' expresion='(01,01)' draw-if='aaa' file='aaa'

		operativeGroup.type = {
			type	: 'textfield',
			label	: 'Type',
			value	: 'audio',
			enable	: false,
			visible	: false,
		};
		
		
		
		visualGroup.region = {
			type	: 'textfield',			
			label	: 'Region',					
			value	: 'interior',				
			enable	: false, 	
			visible	: false, 			
		};
		
		visualGroup.space = {
			type	: 'combobox',
			label	: 'Space',
			value	: '',
			options	: $.proxy(this.getSpaceOptionsList,this),
		};
		
		visualGroup.expresion = {
				type	: 'textfield',
				label	: 'Initial position',
				value	: '(0,0)',
		};
		
		
		visualGroup['draw-if']		= {type : 'codetextfield',	label : 'Draw if',				value:'',	};
		visualGroup['active-if']	= {type : 'codetextfield',	label : 'Enable if',			value:'',	};
	  
		return origCfg ;
	};

	//No register, is abstract class
	//DescartesEditObjectPane.registerHandler('control.audio',Class);
	
	return Class; })();
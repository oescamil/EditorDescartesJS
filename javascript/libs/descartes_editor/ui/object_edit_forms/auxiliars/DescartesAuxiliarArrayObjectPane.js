var DescartesAuxiliarArrayEditPane = (function(){
	var _super_ = DescartesAuxiliarEditPane;

	var Class = function(objectToBind,descartes_context){
		_super_.call(this, objectToBind,descartes_context);
	};

	var proto = Class;
	proto.prototype = Object.create(_super_.prototype);
	proto.prototype.constructor = proto;
	proto = proto.prototype;

	
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
		
		origCfg.array = {
				type		: 'checkbox', 
				label		: 'Array',
				value		: 'yes',
				visible 	: false,
				enable  	: false,
				forceValue	: true,
		};

		origCfg.evaluate = {
				type			: 'radios', 
				label			: 'Evaluate',
				value			: '3',
				options			: {
					'only-once' : 'Only once',
					always 		: 'Always',
				},
		};
		
		origCfg.size = {
				type		: 'textfield', 
				label		: 'Size',
				value		: '3',
		};

		origCfg.file = {
				type		: 'file', 
				label		: 'File',
				value		: '',
		};
		
		origCfg.expresion = {
				type			: 'codetextarea', 
				label			: 'Values algorithm',
				labelPosition	: 'top',
				value			: 'yes',
				visible 		: false,
				enable  		: false,
		};	
		
		
		origCfg.commentsGroup = commentsGroup;	
		return origCfg ;
	};

	DescartesEditObjectPane.registerHandler('auxiliar.array',Class);
	
	return Class; })();
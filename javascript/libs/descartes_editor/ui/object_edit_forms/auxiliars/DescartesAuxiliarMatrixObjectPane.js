var DescartesAuxiliarMatrixEditPane = (function(){
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
//columns='6' rows='6'
		delete origCfg.operativeGroup;
		delete origCfg.visualGroup;
		delete origCfg.commentsGroup;
		
		origCfg.matrix = {
				type		: 'checkbox', 
				label		: 'Matrix',
				value		: 'yes',
				visible 	: false,
				enable  	: false,
				forceValue	: true,
		};

		origCfg.evaluate = {
				type			: 'radios', 
				label			: 'Evaluate',
				value			: 'only-once',
				options			: {
					'only-once' : 'Only once',
					always 		: 'Always',
				},
				forcevalue 		: true,
		};
		

		origCfg.file = {
				type		: 'file', 
				label		: 'File',
				value		: '',
		};
		origCfg.columns = {
				type		: 'textfield', 
				label		: 'Columns',
				value		: '3',
		};
		origCfg.rows = {
				type		: 'textfield', 
				label		: 'Rows',
				value		: '3',
		};
		
		origCfg.expresion = {
				type			: 'codetextarea', 
				label			: 'Values algorithm',
				labelposition	: 'top',
				value			: 'yes',
		};	
		
		
		origCfg.commentsGroup = commentsGroup;	
		return origCfg ;
	};

	DescartesEditObjectPane.registerHandler('auxiliar.matrix',Class);
	
	return Class; })();
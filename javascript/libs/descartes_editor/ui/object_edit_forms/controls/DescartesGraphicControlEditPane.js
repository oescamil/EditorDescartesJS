var DescartesGraphicControlEditPane = (function(){
	var _super_ = DescartesControlEditPane	;

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
	proto.createVisualComponentForTypeAlter = function(fieldName, fieldCfg, fieldValues,htmlNodeToAlter){
		_super_.prototype.createVisualComponentForTypeAlter.call(this,fieldName, fieldCfg, fieldValues,htmlNodeToAlter);
	};

	/**
	 * 
	 */
	proto.getVisualGUIAlter = function(htmlNodeToAlter){
		_super_.prototype.getVisualGUIAlter.call(this,htmlNodeToAlter);
	
	};


	/**
	 * 
	 */
	proto.getConfig = function(){
		var origCfg = _super_.prototype.getConfig.call(this);
		
		var operativeGroup	= origCfg.operativeGroup.children;
		var visualGroup 	= origCfg.visualGroup.children;
		//id='g2' type='graphic' space='E1' colour='01406080' int-colour='01cc0022' size='5' expresion='(01,01)' constraint='CONSTRAIN' image='IMAGE' draw-if='DRAWIF' active-if='ACTIVEIF'
		 
		
		operativeGroup.type.value = 'graphic';
		operativeGroup.constraint = {
				type	: 'textfield',
				label	: 'Constraint',
				value	: '',
		};
		
		visualGroup.colour = {
			type	: 'textfield',
			label	: 'Colour',
			value	: '00406080',
			
		};
		visualGroup.image = {
			type	: 'image',
			label	: 'Image',
			value	: '',
			
		};
		
		visualGroup['int-colour'] = {
				type	: 'textfield',
				label	: 'Interior colour',
				value	: '00cc0022',
				
		};
		
		return origCfg ;
	};

	DescartesEditObjectPane.registerHandler('control.graphic',Class);
	
	return Class; })();
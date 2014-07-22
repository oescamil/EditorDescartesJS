var DescartesTextControlEditPane = (function(){
	var _super_ = DescartesControlEditPane;

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
		console.log("LLamado desde : ", this);
		var origCfg = _super_.prototype.getConfig.call(this);
		
		var operativeGroup	= origCfg.operativeGroup.children;
		var visualGroup 	= origCfg.visualGroup.children;
		//id='t2' type='text' space='E1' expresion='(10,10)' text='TEXTO' Buttons='yes' answer='krypto_dvgvqgf4sv' draw-if='aaa' active-if='aaa'
		 
		 
		
		
		operativeGroup.type.value  ='text';
		operativeGroup.text = {
				type	: 'richtext',
				label	: 'Initial text',
				value	: '',
		};
		operativeGroup.answer = {
				type	: 'textfield',
				label	: 'Answer',
				value	: '',
		};
		visualGroup.Buttons = {
				type	: 'checkbox',
				label	: 'Buttons',
				value	: 'no',
		};
		return origCfg ;
	};

	
	DescartesEditObjectPane.registerHandler('control.text',Class);
	
	return Class; })();
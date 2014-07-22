var DescartesVideoControlEditPane = (function(){
	var _super_ = DescartesAudioControlEditPane;

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
		
		return origCfg ;
	};

	
	
	
	DescartesEditObjectPane.registerHandler('control.video',Class);
return Class; })();
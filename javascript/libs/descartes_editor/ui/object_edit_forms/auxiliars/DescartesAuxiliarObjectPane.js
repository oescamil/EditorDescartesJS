var DescartesAuxiliarEditPane = (function(){
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
		
		
		
		origCfg.commentsGroup = commentsGroup;	
		return origCfg ;
	};

	//No register, is abstract class
	//DescartesEditObjectPane.registerHandler('control.audio',Class);
	
	return Class; })();
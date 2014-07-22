var DescartesSpaceR2EditPane = (function(){
var _super_ = DescartesSpaceEditPane;

var Class = function (objectToBind,descartes_context){
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
	htmlNodeToAlter = _super_.prototype.createVisualComponentForTypeAlter.call(this,fieldName, fieldCfg, fieldValues,htmlNodeToAlter);
	return htmlNodeToAlter;
};

/**
 * 
 */
proto.getVisualGUIAlter = function(htmlNodeToAlter){
	htmlNodeToAlter = _super_.prototype.getVisualGUIAlter.call(this,htmlNodeToAlter);
	return htmlNodeToAlter;
};


/**
 * 
 */
proto.getConfig = function(){
	var origCfg = _super_.prototype.getConfig.call(this);
	origCfg.type.value = 'R2';
	return origCfg ;
};

DescartesEditObjectPane.registerHandler('space.R2',Class);

return Class; })();
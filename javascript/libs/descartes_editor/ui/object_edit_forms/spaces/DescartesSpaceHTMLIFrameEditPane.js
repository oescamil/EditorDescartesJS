var DescartesSpaceHTMLIFrameEditPane = (function(){
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
	origCfg.type.value = 'HTMLIFrame';
	
	var positionGroup = origCfg.positionGroup;
	var imageGroup = origCfg.imageGroup; 
	var commentsGroup = origCfg.commentsGroup; 

	
	delete origCfg.positionGroup;
	delete origCfg.imageGroup;
	delete origCfg.axesGroup;
	delete origCfg.commentsGroup;
	delete origCfg.netGroup;
	delete origCfg['O.x']; 
	delete origCfg['O.y'];
	delete origCfg.fixed;
	delete origCfg.scale;
	delete origCfg.sensitive_to_mouse_movements;
	
	origCfg.file = {
		type	: 'file',
		label	: 'File',
		value 	: '',
	};
	
	origCfg.positionGroup 	= positionGroup;
	origCfg.imageGroup 		= imageGroup;
	origCfg.commentsGroup	= commentsGroup;
	
	return origCfg ;
};

DescartesEditObjectPane.registerHandler('space.HTMLIFrame',Class);

return Class; })();
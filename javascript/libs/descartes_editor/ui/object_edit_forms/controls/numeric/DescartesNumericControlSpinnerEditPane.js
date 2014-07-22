var DescartesNumericControlSpinnerEditPane = (function(){
	var _super_ = DescartesNumericControlEditPane;

function DescartesNumericControlSpinnerEditPane(objectToBind,descartes_context){
	_super_.call(this, objectToBind,descartes_context);
}

var proto = DescartesNumericControlSpinnerEditPane;
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
	
	var operativeGroup	= origCfg.operativeGroup.children;
	var visualGroup 	= origCfg.visualGroup.children;
	
	visualGroup.gui.value	=	'spinner';
	
	delete operativeGroup.only_text;
	delete operativeGroup.text;
		
	return origCfg ;
};

return DescartesNumericControlSpinnerEditPane; })();
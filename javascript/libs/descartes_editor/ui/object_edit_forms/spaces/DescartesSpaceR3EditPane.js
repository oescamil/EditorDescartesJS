var DescartesSpaceR3EditPane = (function(){
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
	var commentsGroup = origCfg.commentsGroup;
	
	delete origCfg.netGroup;
	delete origCfg.axesGroup;
	delete origCfg.netGroup;
	delete origCfg.commentsGroup;

	
	
	origCfg.type.value = 'R3';
	//render='painter' split='yes' R3='yes'
	var renderGroup = {
		type		: 'fieldset',
		label 		: 'Render options',
		children	: [],
	};
	
	origCfg.renderGroup = renderGroup;
	origCfg.R3 = {
		type	: 'combobox',
		value	: 'yes',
		enable	: false,
		visible	: false,
	};
	
	renderGroup = renderGroup.children; 
	renderGroup.render = {
		type	: 'combobox',
		label	: 'Method',
		value	: 'sort',
		options : {
			'sort' 		: 'Sorting',
			'painter' 	: 'Painter',
			'ray trace' : 'Ray Tracer',
		},
	};
	renderGroup.split = {
		type	: 'checkbox',
		label	: 'Split faces',
		value 	: 'no',
	};
	
	
	origCfg.commentsGroup = commentsGroup;
	
	return origCfg ;
};

DescartesEditObjectPane.registerHandler('space.R3',Class);

return Class; })();
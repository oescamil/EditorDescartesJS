var DescartesNumericControlMenuEditPane = (function(){
	var _super_ = DescartesNumericControlEditPane;

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
		
		if(fieldName == 'fontStyleGroup'){
			var styleChecks = $('.field-container',htmlNodeToAlter);
			console.log('Vamos a modificar los botones fe font style',styleChecks);
			styleChecks.each(function(idx, element){
				$this = $(this);
				var idCheck = (new Date().getTime())+"_CK_"+idx;
				var $label	= $("label",$this); 
				var $check	= $("input",$this);
				$label.text($label.text().substring(0,1));
				
				$label.prop('for',idCheck);
				$check.prop('id',idCheck);
				
				$check.button();
				//$label.remove();
			}); 
		}
		 
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
		console.log("LLamado desde el control button");
		var origCfg = _super_.prototype.getConfig.call(this);
		
		var operativeGroup	= origCfg.operativeGroup.children;
		var visualGroup 	= origCfg.visualGroup.children;
		
		visualGroup.gui.value	=	'choice';
		
		delete operativeGroup.only_text;
		delete operativeGroup.text;
		delete operativeGroup.inf;
		delete operativeGroup.sup;
		delete operativeGroup.incr;
		delete operativeGroup.discrete;

		delete visualGroup['exponential-if'];
		
		
		operativeGroup.options = {
				type	: 'textfield',
				label	: 'Options',
				value  : '',
		};
		return origCfg ;
	};

	return Class; })();
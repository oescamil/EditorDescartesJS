var DescartesNumericControlButtonEditPane = (function(){
	var _super_ = DescartesNumericControlEditPane;

	function DescartesNumericControlButtonEditPane(objectToBind,descartes_context){
		_super_.call(this, objectToBind,descartes_context);
	}

	var proto = DescartesNumericControlButtonEditPane;
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
		var origCfg = _super_.prototype.getConfig.call(this);
		console.log("LLamado desde el control button");
		
		var operativeGroup	= origCfg.operativeGroup.children;
		var visualGroup 	= origCfg.visualGroup.children;
		
		visualGroup.gui.value	=	'button';
		
		delete operativeGroup.only_text;
		delete operativeGroup.text;
		delete operativeGroup.sup;
		delete operativeGroup.inf;
		delete operativeGroup.incr;
		delete operativeGroup.discrete;

		delete visualGroup['exponential-if'];
		delete visualGroup.decimalGroup;
		delete visualGroup.visible;
		
		
		
		visualGroup.image = {
			type	: 'image',
			label	: 'Image',
			value	: '',	
		};
		//colour='242222' int-colour='f1f8ff' bold='yes' italics='yes' underlined='yes' font size='24'
		visualGroup['int-colour'] = {
			type	: 'Background Colour',
			label	: 'colour',
			value	: '242222',
		};
		
		visualGroup.fontGroup = {
				type : 'fieldset',
				label : 'Font',
				children: {
					colour : {
						type	: 'colorpicker',
						label	: 'colour',
						value	: '242222',
					},
					font_size	: {
						type 	: 'spinner',
						label	: 'Size',
						value	: '12',
					},
					fontStyleGroup : {
						type		: 'container',
						label		: 'Style',
						attr 		: {'class' : 'inline-container'},
						children	: {
							bold 		: { type : 'checkbox', label:'Bold', 		value:'no', labelposition:'right'	},
							italics 	: { type : 'checkbox', label:'Italics',		value:'no', labelposition:'right'	},
							underlined	: { type : 'checkbox', label:'underline',	value:'no', labelposition:'right'	},
						}
					}
				}
		};
			
		return origCfg ;
	};

	return DescartesNumericControlButtonEditPane; })();
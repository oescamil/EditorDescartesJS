var DescartesNumericControlTextfieldEditPane = (function(){
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
		
		if(fieldName == 'only_text'){
			var $input = $('input',htmlNodeToAlter);
			var toHide = ['sup','inf','incr','discrete','decimalGroup'];
			var prefix = '.field-container--';
			$input.on('change',function(){
				var selected = $input.prop('checked');
				console.log("Vamos a ocultar/mostrar los campos : ",selected);
				var parent = $input.closest('.descartes-object-editor-container');
				for(var i = 0 ,key ;key = toHide[i];i++  ){
					var idCalss = prefix+key;
					if(selected){
						$(idCalss,parent).hide('slow');	
					} else {
						$(idCalss,parent).show('slow');
					}
				}
			});
			
			// Puede que aun no esten insertados los objetos, esperamos
			// un tiempo para que ya esten en el padre y los podamos ocultar
			setTimeout(function(){$input.trigger('change');},10);
		}
		
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
		
		visualGroup.gui.value	=	'textfield';
		
		operativeGroup.only_text;
		
		delete operativeGroup.text;
		delete visualGroup['exponential-if'];
		
		/*
		operativeGroup.options = {
				type	: 'textfield',
				label	: 'Options',
				value  : '',
		};
		*/
		return origCfg ;
	};
	
	//DescartesEditObjectPane.registerHandler('control.numeric.textfield',Class);

	return Class; })();
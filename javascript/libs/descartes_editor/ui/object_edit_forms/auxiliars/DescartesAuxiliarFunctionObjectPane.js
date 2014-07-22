var DescartesAuxiliarFunctionEditPane = (function(){
	var _super_ = DescartesAuxiliarEditPane;

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
	proto.createVisualComponentForTypeAlter = function(fieldName, fieldCfg, fieldValues, htmlNodeToAlter){
		if(fieldName == 'algorithm'){
			var $input = $('input',htmlNodeToAlter);
			var toHide = ['local','init','do','while'];
			var prefix = '.field-container--';
			$input.on('change',function(){
				var selected = $input.prop('checked');
				console.log("Vamos a ocultar/mostrar los campos : ",selected);
				var parent = $input.closest('.descartes-object-editor-container');
				for(var i = 0 ,key ;key = toHide[i];i++  ){
					var idCalss = prefix+key;
					if(selected){
						$(idCalss,parent).show('slow');
					} else {
						$(idCalss,parent).hide('slow');	
					}
				}
			});
			
			// Puede que aun no esten insertados los objetos, esperamos
			// un tiempo para que ya esten en el padre y los podamos ocultar
			setTimeout(function(){$input.trigger('change');},10);
		}
		
		
		return htmlNodeToAlter;
	};
	
	
	/**
	 * 
	 */
	proto.getConfig = function(){
		var origCfg = _super_.prototype.getConfig.call(this);
		
		var commentsGroup 	= origCfg.commentsGroup;
		var operativeGroup	= origCfg.operativeGroup;
		var visualGroup 	= origCfg.visualGroup;
		//id='f2(x)' expresion='x' range='asdfasdf' algorithm='yes'
		//Local='asdfasdf' init='asdfasdf' do='asdfasdf' while='adsfasdfa'
		 
		delete origCfg.operativeGroup;
		delete origCfg.visualGroup;
		delete origCfg.commentsGroup;
		
		origCfg.expresion = {
				type		: 'textfield', 
				label		: 'Return value',
				value		: 'x',
		};
		
		origCfg.range = {
				type		: 'textfield', 
				label		: 'Range',
				value		: '',
		};

		origCfg.algorithm = {
				type		: 'checkbox', 
				label		: 'Algorithm',
				value		: 'no',
		};
		
		origCfg.local = {
				type		: 'textfield', 
				label		: 'Local variables',
				value		: '',
		};

		origCfg.init = {
				type			: 'codetextarea', 
				label			: 'Initial process',
				value			: '',
				labelposition	: 'top'
		};
		
		origCfg['do'] = {
				type			: 'codetextarea', 
				label			: 'Do',
				value			: '',
				labelposition	: 'top'
		};

		origCfg['while'] = {
				type		: 'textfield', 
				label		: 'Loop condition',
				value		: '',
		};
		
		
		origCfg.commentsGroup = commentsGroup;	
		return origCfg ;
	};

	DescartesEditObjectPane.registerHandler('auxiliar.function',Class);
	
	return Class; })();
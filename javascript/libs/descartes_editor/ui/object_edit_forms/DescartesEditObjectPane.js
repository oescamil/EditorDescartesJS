var DescartesEditObjectPane = (function(){
	function DescartesEditObjectPane(objectToBind,descartes_context){
		
		this.fields				= objectToBind;
		this.visualComponent	= false;
		this.descartesContext	= descartes_context;
		this.isAdvanceMode		= false;
		this.babel = descartes_context.babel || descartes.editor.ui_config.babel;
		
		
		this.defaults = {
				enable	: true,
				visible	: true,
				type	: 'textfield',
				value	: '',
				labelposition : 'left',
		}; 
	};

	var prototype = DescartesEditObjectPane.prototype;
	
		
	/**
	 * 
	 */
	prototype.getValues = function(ids){
		return this.fields;
	};
	
	
	
	/**
	 * 
	 */
	prototype.setValues = function(values){
		for ( var fieldName in values) {
			if(fieldName.substring(0,1) == '#')
				continue;
			this.fields[fieldName] = values[fieldName];
		}
		this.updateValue();
	};

	
	/**
	 * 
	 */
	prototype.updateValues = function (){
		for(var fieldName in this.fields){
			if(fieldName.substring(0,1) == '#')
				continue;
			this._updateValue(fieldName,this.fields[fieldName]);
		}
	};
	
	/**
	 * 
	 */
	prototype._updateValue = function (fieldName,newValue){
		var input = $('.field-input-'+fieldName,this.visualComponent).get(0);
		input = $(input);
		var value = newValue;
		
		if(input.attr('type') == 'radios'){
			var allSelector = 'input[name=radio_'+fieldName+']';
			$(allSelector,input).prop('checked',null);
			
			var $element = $(allSelector+'[value='+ value + ']',input);
			$element.attr('checked', true).button('refresh');
			$element.trigger('change');
		} else {
			input.val(value);
		}
		
		
	};

	/**
	 * 
	 */
	prototype.getVisualGUI = function(){
		if(this.visualComponent){
			this.visualComponent.remove();	
			delete(this.visualComponent);
		}
		
		var cfgObj = $.extend({},this.getConfig());
		var superType = this.fields['#superType'].join('-');
		var result = $('<div>',{'class':'descartes-object-editor-container editor--'+superType});
		
		var unknownFields = $.extend({},this.fields);
		var someUnkownField = false; 
		(function (cfg,unknownFields){
			function checkRecursive(cfgRec,unknownFields){
				for (var propKey in cfgRec) {
					var obj = cfgRec[propKey];
					if($.isFunction(obj) ||	!$.isPlainObject(obj))
						continue;
					if(! obj.hasOwnProperty('children')){
						checkRecursive(obj,unknownFields);
					} else {
						delete(unknownFields[propKey]);
						someUnkownField = true;
					}
					
				}
			}
			checkRecursive(cfg,unknownFields);
		})(cfgObj,unknownFields);
		
		if(someUnkownField){
			cfgObj.unknows = {
				type : 'fieldset',
				label : 'Unknow',
				children : {},
			};
			var children = cfgObj.unknows.children;
			for(var fieldName in unknownFields){
				if(fieldName.substring(0,1) == '#') continue;
				children[fieldName] = {
					type  : 'textfield',
					label : fieldName,
				};	
			}
		}
		
		for(var fieldName in cfgObj){
			var fieldCfg		= cfgObj[fieldName];
			var htmlFieldCont	= this.createVisualComponentForType(fieldName,fieldCfg, this.fields);
			result.append(htmlFieldCont);
		}
		
		this.visualComponent = result;
		this.getVisualGUIAlter(this.visualComponent);
	
		return this.visualComponent;
	};

	/**
	 * 
	 */
	prototype.getVisualGUIAlter = function(htmlNodeToAlter){
		return htmlNodeToAlter;
	};
	
	/**
	 * 
	 */
	prototype.createVisualComponentForTypeAlter = function(fieldName, fieldCfg, fieldValues, htmlNodeToAlter){
		return htmlNodeToAlter;
	};
	
	
	
	/**
	 * 
	 */
	prototype.createVisualComponentForType = function(fieldName,fieldCfgOrig, fieldValues){
		fieldCfg				= $.extend({label : fieldName},this.defaults,fieldCfgOrig);
		var fieldType			= fieldCfg['type'];
		var fieldDefVal			= fieldCfg['value'];
		var fieldLabel			= fieldCfg['label'];
		var fieldJustCallBack	= fieldCfg['justCallBack'];
		var fieldCallBack		= fieldCfg['callback'];
		
		fieldLabel 	= this.babel.t(fieldLabel);
		var currVal = fieldValues[fieldName];
		
		
		var htmlFieldCont	= $('<div>',{'class':'field-container field-container--'+fieldName}); 
		var htmlFieldLabel	= $('<label>',{'class':'field-label'}); 
		var input = $('<input>',{type:'textfield'});
		var addAuxBtn = false;
		var bindEvent = 'change';
		
		switch (fieldType) {
		case 'fieldset' :
			var oldFieldC = htmlFieldCont; 
			htmlFieldCont	= $('<fieldset>');
			htmlFieldCont.addClass(oldFieldC.get(0).className);
			htmlFieldLabel	= $('<legend>',{'class':'field-label'});
			var children = fieldCfg.children;
			for (var childKey  in children){
				var child = this.createVisualComponentForType(childKey,children[childKey], fieldValues);
				child.appendTo(htmlFieldCont);
			}
			input = undefined;
			break;
		case 'checkboxfieldset' :
			 
			
			var oldFieldC = htmlFieldCont; 
			htmlFieldCont	= $('<fieldset>');
			htmlFieldCont.addClass(oldFieldC.get(0).className);
			
			htmlFieldLabel	= $('<legend>',{'class':'field-label'});
			var fieldSetContent = $('<div>',{'class':'fieldset-content'}).appendTo(htmlFieldCont);
			
			
			var children = fieldCfg.children;
			for (var childKey  in children){
				var child = this.createVisualComponentForType(childKey,children[childKey], fieldValues);
				child.appendTo(fieldSetContent);
			}
			
			input = $('<input>',{type:'checkbox'}).appendTo(htmlFieldLabel);
			input.on('change',function(event){
				if(input.prop('checked')){
					fieldSetContent.show('fast');
				} else {
					fieldSetContent.hide('fast');
				}
			});
			fieldSetContent.hide();
			break;
		case 'container' :
			
			var oldFieldC = htmlFieldCont; 
			htmlFieldCont	= $('<div>');
			htmlFieldCont.addClass(oldFieldC.get(0).className);
			
			var children = fieldCfg.children;
			for (var childKey  in children){
				var child = this.createVisualComponentForType(childKey,children[childKey], fieldValues);
				child.appendTo(htmlFieldCont);
			}
			input = undefined;
			break;
			
		case 'combobox':
			input = $('<select>',{type:'select'});
			options = fieldCfg['options'];
			
			if($.isFunction(options)){
				var optionCallBack = options; 
				options = optionCallBack();
			}
			
			if($.isArray(options)){
				var optionsObj = {};
				for(var i = 0,option = null; option = options[i]; i ++ ){
					var opLabel = this.babel.t(option);
					var opValue = option;
					optionsObj[opValue] = opLabel;
				}
				options = optionsObj;
			}
			
			for(var valOp in options){
				var currLabel = options[valOp];
				if(currLabel == null)
					console.log("La etiqueta fue null ??? ",options);
				if(currLabel.hasOwnProperty('children')){
					var optGroup = currLabel;
					currentLabel = this.babel.t(optGroup.label);
					var htmlOptG = $('<optgroup>',{label : currentLabel}).appendTo(input);

					for(var valChild in optGroup.children){
						var htmlOpt = $('<option>',{value : valChild});
						htmlOpt.text(this.babel.t(optGroup.children[valChild]));
						htmlOpt.appendTo(htmlOptG);
					}
					
				} else {
					var htmlOpt = $('<option>',{value : valOp});
					htmlOpt.text(this.babel.t(currLabel));
					htmlOpt.appendTo(input);
				}
			}
			break;
		case 'radios':
			input = $('<div>',{'class':'radio-buttons-group'});
			options = fieldCfg['options'];
			
			if($.isFunction(options)){
				var optionCallBack = options; 
				options = optionCallBack();
			}
			
			if($.isArray(options)){
				var optionsObj = {};
				for(var i = 0,option = null; option = options[i]; i ++ ){
					var opLabel = this.babel.t(option);
					var opValue = option;
					optionsObj[opValue] = opLabel;
				}
				options = optionsObj;
			}
			
			var currR = 0 ;
			for(var valOp in options){
				var currLabel = options[valOp];
				if(currLabel == null)
					console.log("La etiqueta fue null ??? ",options);
				
				var name = 'radio_'+fieldName;
				var rId = name+"_value"+currR; 
				var htmlOpt = $('<input>', {type:'radio',	value : valOp,	name : name, id : rId});
				var labelR = $('<label>' , {'for':rId, });
				labelR.text(this.babel.t(currLabel));
				htmlOpt.on('change',function(event){
					input.attr('value', $(this).val());
					input.trigger('change');
				});
				htmlOpt.appendTo(input);
				labelR.appendTo(input);
				currR ++ ; 
			}
			
			break;
		case 'checkbox':
			input	= $('<input>',{type:'checkbox'});
			break;
		case 'textarea':
		case 'richtext':
			input	= $('<textarea>');
			addAuxBtn = true;
			break;
			
		default:
			//console.log("No se reconoce el tipo de control : "+fieldType,fieldCfg);
		case 'textfield':
			addAuxBtn = true;
			input = $('<input>',{type:'textfield'});
			break;
		}
		
		
		
		
		if(fieldCfg.attr){
			for ( var attrName in fieldCfg.attr) {
				
				if(attrName == 'class')
					htmlFieldCont.addClass(fieldCfg.attr[attrName]);
				else
					htmlFieldCont.attr(attrName,fieldCfg.attr[attrName]);
			}
		}
		htmlFieldCont.data('fieldCfg',fieldCfg);
		
		if(!fieldCfg.visible){
			htmlFieldCont.hide();
		}
		
		if(fieldCfg['label']){
			var txtNode = document.createTextNode(fieldLabel);
			htmlFieldLabel.prepend(txtNode);
			if(fieldType == 'container')
				htmlFieldLabel.prependTo(htmlFieldCont);
			else
				htmlFieldLabel.appendTo(htmlFieldCont);
		}
		
		if(input){
			input.addClass('field-editor-'+fieldType+' field-input field-input-'+fieldName);
			if(input.attr('type') == 'checkbox'){
				if(currVal == 'yes' || currVal == true) 
					input.attr('checked','checked');
				else
					input.removeAttr('checked');
			} else if(fieldType == 'radios'){
				var selector =  'input[name=x][value=' + currVal + ']';
				var $element = $(selector,input); 
				$element.attr('checked', true).button('refresh');
				$element.trigger('change');
			} else {
				input.val(currVal);
			}
			
			input.attr('placeholder',fieldDefVal);
			var listenerVisualComponent = $(this.visualComponent);
			input.on(bindEvent,$.proxy(function(e){
				var val = input.val();
				if(input.attr('type') == 'checkbox'){
					val = (input.prop('checked'))?'yes':'no';
				}
				console.log('Cambiado ',fieldName,val);
				if(!fieldJustCallBack)
					fieldValues[fieldName] = val;
				if(fieldCallBack)
					fieldCallBack(fieldName,val,fieldValues);
				
				listenerVisualComponent.trigger('descartes.fieldchanged',[fieldName],fieldValues);
			},this));
			
			
			if(fieldType != 'checkboxfieldset'){
				input.appendTo(htmlFieldCont);
			}
			
			if(fieldType == 'radios'){
				input.buttonset();
			}
			
			if(addAuxBtn){
				var btnAux = this._getAuxWidgetFor(input,fieldName,fieldValues,fieldCfg);
				btnAux.appendTo(htmlFieldCont);
			}
		}

		//Label position
		if(fieldCfg.labelposition == 'right'){
			htmlFieldCont.addClass('label-right');
		} else if (fieldCfg.labelposition == 'top'){
			htmlFieldCont.addClass('label-top');
		}
		
		
		this.createVisualComponentForTypeAlter(fieldName,fieldCfg, fieldValues, htmlFieldCont);
		return htmlFieldCont;
	};
	
	
	
	
	
	
	
	
	
	
	/**
	 * 
	 */
	prototype._getAuxWidgetFor = function (inputDest,fieldName,objToBind,objWidgetCfg) {
		var dialogTitle = (objWidgetCfg.label)?objWidgetCfg.label:fieldName;		
		var openDialog = function(){
			if($(inputDest).is(":disabled"))
				return;
			var win = $("<div class='auxiliar-prop-popuot'>").appendTo($('body'));
			var newInput = $('<input>').appendTo(win);
			newInput.val(inputDest.val());
			dlgSettings = {
				title : dialogTitle,
				modal : true,
				buttons:{
					ok : function(){
						$(inputDest).val(newInput.val());
						$(inputDest).trigger('change');
						$(this).dialog('close');
					},
					cancel : function(){
						$(this).dialog('close');
					},
				},
				close : function(){
					$(this).dialog('destroy').remove();
				}
			};
			win = win.dialog(dlgSettings);
		};
		var btnSettings = {
				text: false,
				icons:{
					primary : "ui-icon-newwin",
				},
		};
		var wrapLabel = $(descartes.editor.ui_config.utils.getWrapperTraductorLabel());
		wrapLabel.text('Open in a new window');
		var btn = $("<button>",{'class':'aux-editor'}).append(wrapLabel).button(btnSettings);
		btn.click(openDialog);
		return btn;
	};
	
	/**
	 ********************************************************************** 
	 ******************** BASE CONFIGURATION ****************************** 
	 ********************************************************************** 
	 */
	prototype.getConfig = function(){
		return {
			id : {
				type:'textfield',		
				label:'ID',						
				value:'',
			},
			operativeGroup : {
				type		: 'fieldset',
				label		: 'operative',
				children	: {
					
				}
			},
			visualGroup : {
				type		: 'fieldset',
				label		: 'visual',
				children	: {
				}
			},
			commentsGroup:{
				type		: 'fieldset',
				label		: 'Comments',
				children	: {
					info : {
						type:'textarea',
						value:'Comments',
						labelposition:'top',
					},
				}
			},
		};
	};
	
	
	
	/**
	 * 
	 * @param pathInConfigString
	 * 	Example : 'control.numeric.sppiner';
	 * @param functionClass
	 * Class objyect to handler this object type in the porperti pane
	 */
	DescartesEditObjectPane.registerHandler  = function (pathInConfigString, functionClass){
		
		var pathArray = pathInConfigString.split('.');
		var configPanes = descartes.editor.ui_config.panes;
		
		if(pathArray.length <= 1){
			var msg = "Error reg new Handler. The path must be 2 depth at less";
			console.log(msg, pahtArray);
			throw {message:msg, param : pahtArray};
		}
		
		var lastKey = pathArray.pop();
		var configPane = configPanes;
		for ( var i = 0;  i < pathArray.length ; i++) {
			var currCfgKey = pathArray[i];
			if(!configPane.hasOwnProperty(currCfgKey)){
				configPane[currCfgKey] = {};
			}
			
			var currCfg = configPane[currCfgKey];
			if($.isFunction(currCfg)){
				var msg = "Bad path configuration, The item at index "+i+' is a handler, not a property';
				console.log(msg, pahtArray);
				throw {message:msg, param : pahtArray};
			}
			configPane = currCfg;
		}
		
		configPane[lastKey] = functionClass;
	};
	
	
	
	return DescartesEditObjectPane; })();

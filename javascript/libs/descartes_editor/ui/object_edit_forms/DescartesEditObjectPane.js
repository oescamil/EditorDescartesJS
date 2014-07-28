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
	 * @returns {___anonymous533_534}
	 */
	prototype.getSpaceOptionsList = function(){
		var utils = descartes.editor.ui_config.utils;
		var ctx = this.descartesContext;
		var spaces = utils.getSpacesListForMenu(ctx);
		var options = {};
		for ( var i = 0, space; space = spaces[i]; i++) {
			spaceType = space['#superType'][1];
			if($.inArray(spaceType,['R2','R3']) == -1)
				continue;
			var id = space.id;
			options[id] = id;
			
		}
		return options;
	};
	
	
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
		input = $(input); // Just First
		this._updateInputValue(input,fieldName,newValue);
	};
	
	
	/**
	 * 
	 */
	prototype._updateInputValue = function (input,fieldName,newValue){
		var inputType = input.attr('type');
		switch (inputType) {
		case 'radios':
			this._updateValueRadiosField(input, fieldName, newValue);
			break;
		case 'checkbox':
			this._updateValueCheckboxField(input, fieldName, newValue);
			break;
		case 'codetextarea':
			this._updateValueCodeTextField(input,fieldName, newValue);
			break;
		default:
			input.val(newValue);
			break;
		}
	};
	
	/**
	 * 
	 */
	prototype._updateValueRadiosField = function (input,fieldName,newValue){
		console.log("Actualizando el valor para un radios",fieldName,newValue,input);
		var allSelector = 'input[name=radio_'+fieldName+']';
		$allRadios = $(allSelector,input); 
		$allRadios.removeAttr('checked');
		
		var $element = $(allSelector+'[value='+ newValue + ']',input);
		
		if($element.length <= 0){  // Value not in the list of options, select default
			$element = $(allSelector+'[isdefault=1]',input);
		}
		
		$element.prop('checked','checked');
		input.buttonset('refresh');
		// FORCE VISUAL UPDATE
		var idR = "label[for="+$element.attr('id')+"]"; 
		labelSel = 	$(idR,input);
		labelSel.attr('aria-pressed','true');
		labelSel.addClass('ui-state-active');
		
		$element.trigger('change');
	};
	
	
	/**
	 * 
	 */
	prototype._updateValueCodeTextField = function (input,fieldName,newValue){
		
		newValue = new String(newValue || '');
		var value = newValue.replace(/;/g,'\n');
		input.val(value);
	};

	/**
	 * 
	 */
	prototype._updateValueCheckboxField = function (input,fieldName,newValue){
		if(newValue == 'yes' || newValue == true) 
			input.attr('checked','checked');
		else
			input.removeAttr('checked');
		
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
		var knownFields = this.getBindingCfg();
		
		for (var propKey in unknownFields) {
			if(!knownFields.hasOwnProperty(propKey)){
				someUnkownField = true;
			} else {
				delete (unknownFields[propKey]);
			}
		}
		
		
		if(someUnkownField){
			var childCount = 0;
			var unknows = {
				type : 'fieldset',
				label : 'Unknow',
				children : {},
			};
			var children = unknows.children;
			for(var fieldName in unknownFields){
				if(fieldName.substring(0,1) == '#') continue;
				children[fieldName] = {
					type  : 'textfield',
					label : fieldName,
				};
				childCount ++;
			}
			if(childCount > 0)
				cfgObj.unknows = unknows;
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
		var fieldCfg			= $.extend({label : fieldName},this.defaults,fieldCfgOrig);
		var fieldType			= fieldCfg['type'];
		var fieldDefVal			= fieldCfg['value'];
		var fieldLabel			= fieldCfg['label'];
		var fieldJustCallBack	= fieldCfg['justCallBack'];
		var fieldCallBack		= fieldCfg['callback'];
		
		fieldLabel 	= this.babel.t(fieldLabel);
		var currVal = fieldValues[fieldName];
		
		
		var htmlFieldCont	= $('<div>',{'class':'field-container '+fieldType+'--field-container field-container--'+fieldName}); 
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
				options = options();
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
			input = $('<div>',{'class':'radio-buttons-group',type:'radios'});
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
				console.log("Checando si el el default ", valOp,valOp,fieldDefVal == valOp);
				if(fieldDefVal == valOp){
					htmlOpt.attr('isdefault',"1");
				}
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
			input.buttonset();
			break;
		case 'checkbox':
			input	= $('<input>',{type:'checkbox'});
			break;
		case 'codetextarea':
		case 'richtext':
		case 'textarea':
			var nLines = (fieldType == 'textarea')?4:6;
			input	= $('<textarea>',{type:fieldType,rows:nLines});
			addAuxBtn = true;
			break;
			
		default:
			//console.log("No se reconoce el tipo de control : "+fieldType,fieldCfg);
		case 'textfield':
			addAuxBtn = true;
			input = $('<input>',{type:'textfield'});
			break;
		}
		
		
		
		
		htmlFieldCont.data('fieldCfg',fieldCfg);
		if(fieldCfg.attr){
			for ( var attrName in fieldCfg.attr) {
				if(attrName == 'class')
					htmlFieldCont.addClass(fieldCfg.attr[attrName]);
				else
					htmlFieldCont.attr(attrName,fieldCfg.attr[attrName]);
			}
		}
		if(!fieldCfg.visible){htmlFieldCont.hide();}
		
		if(fieldCfg['label']){
			var txtNode = document.createTextNode(fieldLabel);
			htmlFieldLabel.prepend(txtNode);
			if(fieldType == 'container')
				htmlFieldLabel.prependTo(htmlFieldCont);
			else
				htmlFieldLabel.appendTo(htmlFieldCont);
		}
		
		if(input){
			// Class are needed to update values
			input.attr('placeholder',fieldDefVal);
			input.addClass('field-editor-'+fieldType+' field-input field-input-'+fieldName);
			
			if(fieldType != 'checkboxfieldset') // Was added after
				input.appendTo(htmlFieldCont);
		
			if(addAuxBtn){ // button for aux widget 
				var btnAux = this._getAuxWidgetFor(input,fieldName,fieldValues,fieldCfg);
				btnAux.appendTo(htmlFieldCont);
			}			
			
			this._updateInputValue(input,fieldName,currVal);
			
			
			// LISTENER TO UPDATE VALUES ON CONTEXT OBJECT
			var listenerVisualComponent = $(this.visualComponent);
			input.on(bindEvent,$.proxy(function(e){
				var val = input.val();
				if(input.attr('type') == 'checkbox'){
					val = (input.prop('checked'))?'yes':'no';
				} else if(input.attr('type') == 'radios'){
					val = input.attr('value');
				}
				
				console.log('Cambiado ',fieldName,val);
				if(!fieldJustCallBack)
					fieldValues[fieldName] = val;
				if(fieldCallBack)
					fieldCallBack(fieldName,val,fieldValues);
				
				listenerVisualComponent.trigger('descartes.fieldchanged',[fieldName],fieldValues);
			},this));
			
			
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
		var wrapLabel = $("<span>");
		wrapLabel.text('Open in a new window');
		var btn = $("<button>",{'class':'aux-editor'}).append(wrapLabel).button(btnSettings);
		btn.click(openDialog);
		return btn;
	};
	
	
	
	/**
	 * 
	 */
	prototype.getBindingCfg = function(){
		var cfgPane = this.getConfig();
		var onlyBindingFields = {};
		var clearFunction = function(origCfg,store){
			
			function auxRecursive(origCfg,store){
				for (var propKey in origCfg) {
					var obj = origCfg[propKey];
					if($.isFunction(obj) ||	!$.isPlainObject(obj))
						continue;
					
					var isBindable =
						$.inArray(obj.type,['fieldset','container']) < 0	&&
						!obj['justcallbak'] ; 
						
					if(isBindable){
						store[propKey] = obj;
					}
					
					if(obj.hasOwnProperty('children')){
						var children = obj.children;
						auxRecursive(children,store);
					}
				}
			};
			
			auxRecursive(origCfg,store); //check recursive for binding fields 
		};
		
		clearFunction(cfgPane,onlyBindingFields);
		return onlyBindingFields;
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

(function(descartes,$){
	descartes = (descartes || {});
	descartes.editor = (descartes.editor || {});
/**
 * 
 * @param container
 * @returns {descartes.editor.EditorDescartes}
 */
descartes.editor.EditorDescartes = function(container){
	this.panes = {},
	this.scenesCfg = {};
	this.sceneCfgActiva = {};
	this.babel = descartes.editor.ui_config.babel;
	this.element = container;
	this.init();
};


descartes.editor.EditorDescartes.version = '6.0, 2013-12-06';
/**
 * 
 */
descartes.editor.EditorDescartes.prototype.init = function(){
	this.panes.center 	= $(".scenes-pane",this.element);	
	this.panes.south 	= $(".program-pane",this.element).selectorTabs({ heightStyle: "auto"});	
	this.panes.left		= $(".menu-objects-pane > div.container",this.element).accordion({heightStyle:'fill'});	
	this.panes.right 	= $(".menu-preconfig-pane > div.container",this.element).accordion({heightStyle:'fill'});	
	this.preConfigPaneCtr = $(".menu-preconfig-pane > div.container .object-properties-pane-content",this.element).descartesPropEditorPane({descartesContext:this.sceneCfgActiva});
	this.objectPropPane = $(".menu-preconfig-pane > div.container > div.object-proprties-pane-content", this.element)[0];

	var instanceToCall = this;
	this.auxList = $(".menu-objects-pane div.descartes-objects-list.descartes-objects-list-auxilars",this.element);
	this.auxList = this.auxList.descartesAuxiliarsList({
			onSelect: function(event,data){
				var cfgObj				= data.cfgObj; 
				var type				= data.objectType;
				if(cfgObj){
					instanceToCall.preConfigPaneCtr.descartesPropEditorPane("setObject",cfgObj,type);
					var h3Link = instanceToCall.preConfigPaneCtr.prev('h3');
					var h3LinkId = h3Link.attr('id');
					h3LinkId = parseInt(h3LinkId.split('-').pop());
					instanceToCall.panes.right.accordion( "option", "active", 2);
				} else {
					console.log("No es uno de los nodos que esperamos ");
				}
			},
			});
	
	this.objectList = $(".menu-objects-pane div.descartes-objects-list-objects.descartes-objects-list",this.element);
	this.objectList = this.objectList.descartesObjectsList({
		data: {},
		onSelect: function(event,data){
			var cfgObj				= data.cfgObj; 
			var type				= data.objectType;
			if(cfgObj){
				instanceToCall.setActiveObjCfg(cfgObj);
			} else {
				console.log("No es uno de los nodos que esperamos ");
			}
		}
	});
	
	
	
    
    // Create the hints to auto complete
    CodeMirror.commands.autocomplete = function(cm) {
        CodeMirror.showHint(cm, CodeMirror.hint.javascript);
     };
     
     // Create the coding panel
     
    this.initPane = $(".program-pane-init",this.element)[0];
    this.initPane.textarea = $('<textarea class="code-editor"></textarea> ').appendTo(this.initPane);
    this.initPane.textarea = this.initPane.textarea[0];
    this.initPane.editor = CodeMirror.fromTextArea(this.initPane.textarea, {
        lineNumbers: true,
        extraKeys: {"Ctrl-Space": "autocomplete"}
      });
       
    
    this.calculusPane = $(".program-pane-calculus",this.element)[0];
    this.calculusPane.textarea = $('<textarea class="code-editor"></textarea> ').appendTo(this.calculusPane);
    this.calculusPane.textarea = this.calculusPane.textarea[0];
    this.calculusPane.editor = CodeMirror.fromTextArea(this.calculusPane.textarea, {
        lineNumbers: true,
        extraKeys: {"Ctrl-Space": "autocomplete"}
      });
    
    /*
     * Creating the animation pane, global pane and buttons pane
    */
    this.animationPane	= $(".program-pane-animation",this.element)[0];
    this.scenePane		= $(".program-pane-scene",this.element)[0];
    var cfgGlobalCont = $('<div>').addClass('config-global-wrapper app-config-wrapper').appendTo(this.scenePane);
    $("<h2></h2>").appendTo(cfgGlobalCont).html(this.babel.t('App config'));
    
    var buttonsCont = $('<div>').addClass('config-global-wrapper buttons-wrapper').appendTo(this.scenePane);
    $("<h2></h2>").appendTo(buttonsCont).html(this.babel.t('Buttons'));
    
    var cfgFields = [
                     //Animation pane
                     {'name':'delay',		'label':'delay',			'type':'text-code',		'container':this.animationPane,	'pane':this.animationPane},
                     {'name':'controls',	'label':'Show Controls',	'type':'checkbox',		'container':this.animationPane,	'pane':this.animationPane},
                     {'name':'loop',		'label':'Loop animation',	'type':'checkbox',		'container':this.animationPane,	'pane':this.animationPane},
                     {'name':'auto',		'label':'Init automatical',	'type':'checkbox',		'container':this.animationPane,	'pane':this.animationPane},
                     {'name':'anim.init',	'label':'Init',				'type':'text-code',		'container':this.animationPane,	'pane':this.animationPane},
                     {'name':'doExpr',		'label':'Do',				'type':'textarea-code',	'container':this.animationPane,	'pane':this.animationPane},
                     {'name':'whileExpr',	'label':'While',			'type':'text-code',		'container':this.animationPane,	'pane':this.animationPane},
                     
                     // GLOBAL
                     {'name':'name',			'label':'Name',				'type':'text',		'container':cfgGlobalCont,	'pane':this.scenePane},
                     {'name':'decimal_symbol',	'label':'Decimal symbol',	'type':'select',	'container':cfgGlobalCont,	'pane':this.scenePane,
                    	 'options':[
		        	            {'value':',','label':','},
		        	            {'value':'.','label':'.'},
	        	            ],
                     },
                     {'name':'antialias',		'label':'Antialias',		'type':'checkbox',	'container':cfgGlobalCont,	'pane':this.scenePane},
                     {'name':'width',		'label':'Width',				'type':'text',		'container':cfgGlobalCont,	'pane':this.scenePane},
                     {'name':'height',		'label':'Height',				'type':'text',		'container':cfgGlobalCont,	'pane':this.scenePane},
                     //Buttons
                    {'name':'about',	'label':'about',			'type':'checkbox',	'container':buttonsCont,	'pane':this.scenePane},
                    {'name':'clear',	'label':'clear',			'type':'checkbox',	'container':buttonsCont,	'pane':this.scenePane},
                    {'name':'config',	'label':'config',			'type':'checkbox',	'container':buttonsCont,	'pane':this.scenePane},
                    {'name':'init',		'label':'init',				'type':'checkbox',	'container':buttonsCont,	'pane':this.scenePane},
                    ];
    
    for ( var i = 0; i < cfgFields.length; i++) {
    	var currCfg = cfgFields[i];

    	var fieldName = currCfg.name.split('.').pop();
    	fieldName = 'field_'+fieldName;

    	var container = currCfg.container;
    	var type = currCfg.type.split('-');
    	var fieldWrapper = $('<div />').appendTo(container).addClass('field-wrapper');
    	
    	var labelHTML = $('<label></label>').html(this.babel.t(currCfg.label)).attr('for',fieldName);
    	var inputHTML;
    	
    	switch (type[0]) {
		case 'textarea':
			inputHTML = $('<textarea />');
			break;
		case 'select':
			inputHTML = $('<select />');
			var options = currCfg.options;
			for ( var j = 0; j < options.length; j++) {
				var opAct = options[j];
				var opLabel = this.babel.t((opAct.label || opAct.value)); 
				var opHTML = $('<option>').attr('value',opAct.value).html(opLabel);
				opHTML.appendTo(inputHTML);
			}
			break;
		default:
			inputHTML = $('<input>');
			inputHTML.attr('type',type[0]);
			break;
		}
    	inputHTML.attr('name',fieldName);

    	labelHTML.appendTo(fieldWrapper);
    	inputHTML.appendTo(fieldWrapper);
    	currCfg.pane[fieldName] = inputHTML; 
	}
    
       
    /*
     * Creating the general toolbar
     */
    this.toolbar = $(".tootlbar",this.element);
    var btnOpen = $('<button>',{text : this.babel.t("Open file") })
    	.button({text:false, icons: {primary:'ui-icon-folder-open'}});
    btnOpen.appendTo(this.toolbar);
   
    var btnSave = $('<button>',{text : this.babel.t("Save") })
		.button({text:false, icons: {primary:'ui-icon-disk'}});
    btnSave.appendTo(this.toolbar);		
    
    var callbackOpen = function(e,fileName,textContent,filePath){
		filePath = (filePath)?filePath:('file:///media/WinDoc/Documentos/Trabajo/LITE/2013/Herramientas_CONACyT/herramientas/ArrastrarSoltar/'+fileName);
		console.log('Leyendo el arcivo ',fileName);
		instanceToCall.loadFromString(
				textContent,
				filePath,
				fileName);
	};
    
	
	
    btnSave.on('click',this,function(e){
    	var editor = e.data;
    	var content = editor.getHTMLString([],[],false,false);
    	descartes.editor.io.showDialogToSave(content,'Algo.html');
    });
    btnOpen.on('click',callbackOpen,function(e){
    	descartes.editor.io.showDialogToOpen(e.data,'');
    });
    
    
    var btnUpdatePrev = $('<button>',{text : this.babel.t("Update preview") })
	.button({text:false, icons: {primary:'ui-icon-refresh'}});
    btnUpdatePrev.appendTo(this.toolbar);
    btnUpdatePrev.on('click',this, function(e){
    	var editor = e.data;
    	var documentBase = $("#basePathInput").val();
    	if(documentBase.indexOf ('file://') != 0){
    		documentBase = 'file://'+documentBase;
    		$("#basePathInput").val(documentBase);
    	}
    	editor.scenesCfg.fileBase = documentBase;
    	editor.updateIframeContent();
    });
    
    
    var btnTest = $('<button>',{text : this.babel.t("Update preview") })
	.button({text:false, icons: {primary:'ui-icon-lightbulb'}});
    btnTest.appendTo(this.toolbar);
    btnTest.on('click',this, function(e){
    	var editor = e.data;
    	var iframe = $('#descartes-editor-prev');
    	var contents = iframe.contents();
    	var contentsElem = contents[0];
    	var wyswygList = $('.WYSWYG_editor',contentsElem);
    	console.log("Lista de wyswyg : ",wyswygList,contents);
    	wyswygList.hide();
    });
    
    
    var basePathC = $('<div class="basePathContainer"><label>Base</label><input id="basePathInput" type="textfield" value = "" /></div>');
    basePathC.appendTo(this.toolbar);
    
    
    
    
    
    this.mainLayout = cfgOuterDescartesEditorLayout($('> .main-content',this.element));
    this.mainLayout.options.east.onresize = function () {
    	$(".menu-preconfig-pane > div.container",instanceToCall.element).accordion('refresh');	
    };
    
    this.mainLayout.options.west.onresize = function () {
    	$(".menu-objects-pane > div.container",instanceToCall.element).accordion('refresh');	
    };
    this.mainLayout.options.south.onresize = function () {
    	instanceToCall.initPane.editor.refresh();
    	instanceToCall.calculusPane.editor.refresh();
    };
    this.panes.south.on( "tabsactivate", function( event, ui ) {instanceToCall.mainLayout.options.south.onresize();} );
    
    
    this.mainLayout.options.west.onresize();
    this.mainLayout.options.east.onresize();
    this.mainLayout.options.south.onresize();
};


/**
 * 
 * @param objectCfg
 */
descartes.editor.EditorDescartes.prototype.setActiveObjCfg = function (objectCfg){
	var cfgObj				= objectCfg; 

	if(cfgObj){
		var type		= cfgObj['#superType'];
		var objPanel	= this.panes.left;
		var objProp		= this.panes.right;
		var tabIndex = 0; // 0 => Controls, Spaces, graphics, 1 => auxiliars
		if(type[0] == 'auxiliar'){
			tabIndex = 1;
			this.auxList.descartesAuxiliarsList('option'	, {'active':objectCfg,});
		} else {
			this.objectList.descartesObjectsList('option'	, {'active':objectCfg,});
		}
		
		if(this.wyswyg){
			this.wyswyg.setActive(objectCfg);
		}
		
		objPanel.accordion('option','active',tabIndex);
		this.preConfigPaneCtr.descartesPropEditorPane("setObject",cfgObj,type);
		objProp.accordion( "option", "active", 2);
		this.preConfigPaneCtr.hide();
		this.preConfigPaneCtr.fadeIn();
		
	} else {
		console.log("No es uno de los nodos que esperamos ");
	}
};

/**
 * 
 */
descartes.editor.EditorDescartes.prototype.updateFormCfg = function (){
	this.preConfigPaneCtr.descartesPropEditorPane("update");
	this.objectList.descartesObjectsList('update');
	//this.objectList.descartesAuxiliarsList('update');
	
};

/**
 * 
 * @param sceneCfg
 * @returns {DescartesEditorProto.setSceneCfgActiva}
 */
descartes.editor.EditorDescartes.prototype.setSceneCfgActiva = function(sceneCfg){
	this.sceneCfgActiva = sceneCfg;
	
	
	
	this.objectList.descartesObjectsList('option',{data:this.sceneCfgActiva,});
	this.auxList.descartesAuxiliarsList('option',{data:this.sceneCfgActiva,});
	this.preConfigPaneCtr.descartesPropEditorPane('option',{descartesContext:this.sceneCfgActiva,});
	/*
	 * ******************************************************************************
	 * *                   BINDING INIT  & CALCULUS  ALGORITHMS                     *
	 * ******************************************************************************
	 */
	var tmpInitCode = this.initPane.editor;
	var tmpVal = this.sceneCfgActiva.program.initial;
	tmpVal = tmpVal.replace(/;/g,"\n");
	tmpInitCode.off('change');
	tmpInitCode.setValue(tmpVal+'');
	// When the code is changed, get the new text from CodeMirror instance (instCM)
	tmpInitCode.on('change', $.proxy(function(instCM, changeObj){
		this.sceneCfgActiva.program.initial = instCM.doc.getValue(';');
	},this));
	
	tmpInitCode = this.calculusPane.editor;
	tmpVal = this.sceneCfgActiva.program.calculus;
	tmpVal = tmpVal.replace(/;/g,"\n");
	tmpInitCode.off('change');
	tmpInitCode.setValue(tmpVal+'');
	// When the code is changed, get the new text from CodeMirror instance (instCM)
	tmpInitCode.on('change', $.proxy(function(instCM, changeObj){
		this.sceneCfgActiva.program.calculus = instCM.doc.getValue(';');
	},this));
	
	
	/*
	 * ******************************************************************************
	 * * Binding scene global properties *
	 * ******************************************************************************
	 */
	var keyUpEvent = 'keyup.descartes.editor';
	var changeEvent = 'change.descartes.editor';
	var toLink = {
			name			: {pane:this.scenePane,event:keyUpEvent,	cfgToBind:	this.sceneCfgActiva.global,	isCheckBox : false,	},
			width			: {pane:this.scenePane,event:keyUpEvent,	cfgToBind:	this.sceneCfgActiva.global,	isCheckBox : false,	},
			height			: {pane:this.scenePane,event:keyUpEvent	,	cfgToBind:	this.sceneCfgActiva.global,	isCheckBox : false,	},
			decimal_symbol	: {pane:this.scenePane,event:changeEvent,	cfgToBind:	this.sceneCfgActiva.global,	isCheckBox : false,	},
			antialias 		: {pane:this.scenePane,event:changeEvent,	cfgToBind:	this.sceneCfgActiva.global,		isCheckBox : true,	},
			
			about		: {pane:this.scenePane,event:changeEvent,	cfgToBind:	this.sceneCfgActiva.Buttons,	isCheckBox : true,	},
			clear		: {pane:this.scenePane,event:changeEvent,	cfgToBind:	this.sceneCfgActiva.Buttons,	isCheckBox : true,	},
			config		: {pane:this.scenePane,event:changeEvent,	cfgToBind:	this.sceneCfgActiva.Buttons,	isCheckBox : true,	},
			init		: {pane:this.scenePane,event:changeEvent,	cfgToBind:	this.sceneCfgActiva.Buttons,	isCheckBox : true,	},
			
			
			delay 			: {pane:this.animationPane ,event:keyUpEvent,	cfgToBind:	this.sceneCfgActiva.Animation,	isCheckBox : false,	},
			controls		: {pane:this.animationPane ,event:changeEvent,	cfgToBind:	this.sceneCfgActiva.Animation,	isCheckBox : true,	},
			auto			: {pane:this.animationPane ,event:changeEvent,	cfgToBind:	this.sceneCfgActiva.Animation,	isCheckBox : true,	},
			loop			: {pane:this.animationPane ,event:changeEvent,	cfgToBind:	this.sceneCfgActiva.Animation,	isCheckBox : true,	},
			'anim.init'		: {pane:this.animationPane ,event:keyUpEvent,	cfgToBind:	this.sceneCfgActiva.Animation,	isCheckBox : false,	},
			'whileExpr'		: {pane:this.animationPane ,event:keyUpEvent,	cfgToBind:	this.sceneCfgActiva.Animation,	isCheckBox : false,	},
			'doExpr'		: {pane:this.animationPane ,event:keyUpEvent,	cfgToBind:	this.sceneCfgActiva.Animation,	isCheckBox : false,	},
			
	};
	
	//FOR OTHERS THAN CHECKBOX OR RADIO
	for ( var fieldName in toLink) {
		var cfgAct = toLink[fieldName];
		var fileName2 = fieldName.split('.').pop();
		var scenePaneProp = 'field_'+fileName2;
		var sceneConfProp = fileName2;
		var eventToLink = cfgAct.event;
		
		var fieldVal = cfgAct.cfgToBind[sceneConfProp];
		
		var fieldTmp = cfgAct.pane[scenePaneProp];
		if(!fieldTmp){
			console.log("No se encontro la propiedad "+scenePaneProp+" en el panel ", cfgAct.pane);
			continue;
		}
		
		fieldTmp.off(eventToLink);
		
		if(cfgAct.isCheckBox){
			fieldTmp.attr('checked',(fieldVal == 'yes' || fieldVal == 'true' || fieldVal == true));
		}else {
			fieldTmp.val(fieldVal);
		}
		
		fieldTmp.on(eventToLink,null,
				[sceneConfProp,cfgAct], // to event.data
				$.proxy(function(event){
			    	var field = $(event.target);
			    	var fieldName = event.data[0];
			    	var cfgAct =  event.data[1];
			    	var fieldVal;
			    	if(cfgAct.isCheckBox){
			    		fieldVal = field.prop('checked');
			    		fieldVal = (fieldVal)?'true':'false';
			    	}else {
				    	fieldVal = field.val();
			    	}
			    	cfgAct.cfgToBind[fieldName] = fieldVal;
	    },this));
	}
};






/**
 * 
 * @param strCfgApplet
 * @returns {this.loadFromString}
 */
descartes.editor.EditorDescartes.prototype.loadFromString_webview = function(strCfgApplet,fileBase, fileName){
this.scenesCfg = new descartes.editor.ScenesConfiguration(strCfgApplet);
	

	
	this.panes.center.html('');
	var iframe = document.createElement('webview');
	
	$iframe = $(iframe);
	$iframe.css('width','100%').css('height','100%');
	$iframe.attr('name','appDescartesContainer');
	$iframe.attr('id','descartes-player-content-webview');
	$iframe.attr('src','a');
	$iframe.appendTo(this.panes.center);
	
	iframe =  document.querySelector('#descartes-player-content-webview');

	
	var stringBase = document.baseURI;
	stringBase = stringBase.substring(0,stringBase.lastIndexOf('/')+1);
	
	
	iframe.addEventListener('contentload', function() {
		iframe.executeScript({file: stringBase+"javascript/libs/jquery/jquery-1.10.2.min.js"									});
		iframe.executeScript({file: stringBase+"javascript/libs/jquery/jquery-ui-1.10.3/js/jquery-ui-1.10.3.custom.js"    });
		iframe.executeScript({file: stringBase+"javascript/libs/descartes.js"                                           });
		iframe.executeScript({file: stringBase+"javascript/libs/descartes_editor/ui/descartes-editor-wyswyg.js"        });
		console.log("El webview",iframe);

		iframe.insertCSS({file: stringBase+'javascript/libs/jquery/jquery-ui-1.10.3/css/start/jquery-ui-1.10.3.custom.css'});
		iframe.insertCSS({file:stringBase+'css/wysiwyg.css'});	
	});
	
	iframe.src  = "file://"+fileBase+'/'+fileName;
	
	
//	var htmlStr = this.getHTMLString(jsToAdd,cssToAdd,fileBase,false);
	
	this.setSceneCfgActiva(this.scenesCfg.scenes[0]);
};

/**
 * 
 * @param strCfgApplet
 * @param fileBase
 * @param fileName
 */
descartes.editor.EditorDescartes.prototype.loadFromString = function(strCfgApplet,fileBase, fileName){
	this.scenesCfg = new descartes.editor.ScenesConfiguration(strCfgApplet);
	
	
	
	this.scenesCfg.fileBase = $("#basePathInput").val();
	this.updateIframeContent();
	this.setSceneCfgActiva(this.scenesCfg.scenes[0]);
};

/**
 * 
 */
descartes.editor.EditorDescartes.prototype.updateIframeContent = function(){
	this.panes.center.html('');
	var iframe = $("<iframe>");
	iframe.css('width','100%').css('height','100%');
	iframe.attr('name','appDescartesContainer');
	iframe.attr('id','descartes-editor-prev');
	iframe.appendTo(this.panes.center);
	
	 
	
	
	var stringBase = document.baseURI;
	stringBase = stringBase.substring(0,stringBase.lastIndexOf('/')+1);
	
	var jsToAdd = [];
	jsToAdd.push( stringBase+"javascript/libs/jquery/jquery-1.10.2.min.js"									);
	jsToAdd.push( stringBase+"javascript/libs/jquery/jquery-ui-1.10.3/js/jquery-ui-1.10.3.custom.js"    );
	jsToAdd.push( stringBase+"javascript/libs/descartes.js"                                           );
	jsToAdd.push( stringBase+"javascript/libs/descartes_editor/ui/descartes-editor-wyswyg.js"        );
	var cssToAdd = [];
	cssToAdd.push(stringBase+'javascript/libs/jquery/jquery-ui-1.10.3/css/start/jquery-ui-1.10.3.custom.css');
	cssToAdd.push(stringBase+'css/wysiwyg.css');
	
	var htmlStr = this.getHTMLString(jsToAdd,cssToAdd,this.scenesCfg.fileBase,false);
	
	var contents = $(iframe).contents();
	var contentsElem = contents[0];
	
	contentsElem.baseURI = this.scenesCfg.fileBase;
	var iframeTag = iframe.get(0);
	iframeTag.srcdoc  = htmlStr;
	console.log(contentsElem.location);
};

descartes.editor.EditorDescartes.prototype.getHTMLString = function(jsLibsList,cssLibsList, fileBase,mantainRef){
	var classKeyDelete = 'DESCARTES_EDITOR_DELETE';
	var contentsElem = document.implementation.createHTMLDocument("Prerender");
	
	console.log("********************* File base : "+fileBase);
	var parser = new DOMParser();
	var htmlNew = contentsElem;
	if(mantainRef){
		htmlNew = this.scenesCfg.originalDom;	
	} else {
		htmlNew = $('html',this.scenesCfg.originalDom)[0];
		var stringData = htmlNew.outerHTML;
		var newDom = parser.parseFromString(stringData,"text/html");
		htmlNew = $('html',newDom)[0];
	}
	
	if($('html',htmlNew).length<=0){
		var tmpHtml = contentsElem.createElement('html');
		$(tmpHtml).append(htmlNew);
		htmlNew = tmpHtml;
		if(mantainRef)
			this.scenesCfg.originalDom = htmlNew; 
	};
	
	var head = htmlNew.getElementsByTagName('head');
	if(head.length <= 0 ){
		head =  $(contentsElem.createElement('head'));
		$(htmlNew).prepend(head);
	} 
	head = head[0]; 
	
	if(fileBase){
		var baseTag =  contentsElem.createElement('base');
		baseTag.href = fileBase;
		baseTag.target = '_blank';
		baseTag.className = classKeyDelete;
		head.appendChild(baseTag);
	}
	
	
	htmlNew = $('html',htmlNew)[0];
	var applets = $('applet, ajs',htmlNew);
	for(var i = 0, sceneAct;sceneAct = this.scenesCfg.scenes[i];i++ ){
		var tmpHtmlStr = sceneAct.sceneCfgObjectsToHtmlString();
		var newAppElement = parser.parseFromString(tmpHtmlStr,"text/html");
		if(mantainRef){
			sceneAct.originalDOM = $(sceneAct.originalDOM).replaceWith(newAppElement.body.firstChild);
		} else{
			$(applets[i]).replaceWith(newAppElement.body.firstChild);
		}
	}
	
	var cssToAdd = (cssLibsList)?cssLibsList:[];
	var jsToAdd = (jsLibsList)?jsLibsList:[];
	
	for ( var i = 0; i < cssToAdd.length; i++) {
		var css   = contentsElem.createElement("link");
		css.type  = "text/css";
		css.href   = cssToAdd[i];    // use this for linked script
		css.rel="stylesheet";
		css['data-id'] = classKeyDelete;
		head.appendChild(css);
	}
		
	for ( var i = 0; i < jsToAdd.length; i++) {
		script   = contentsElem.createElement("script");
		script.type  = "text/javascript";
		script.src   = jsToAdd[i];    // use this for linked script
		script['data-id'] = classKeyDelete;
		head.appendChild(script);
	}
	var resStr = this.formatXml(htmlNew.outerHTML); 
	
	$("."+classKeyDelete,htmlNew).remove();
	
	resStr = resStr.replace(/&amp;/g,'&');
	return resStr;
};

	descartes.editor.EditorDescartes.prototype.formatXml = function(xml) {
		var formatted = '';
		var reg = /(>)(<)(\/*)/g;
		xml = xml.replace(reg, '$1\r\n$2$3');
		var pad = 0;
		jQuery.each(xml.split('\r\n'), function(index, node) {
			var indent = 0;
			if (node.match(/.+<\/\w[^>]*>$/)) {
				indent = 0;
			} else if (node.match(/^<\/\w/)) {
				if (pad != 0) {
					pad -= 1;
				}
			} else if (node.match(/^<\w[^>]*[^\/]>.*$/) && !(node.match(/^<param\ [^>]*>.*$/i))) {
				indent = 1;
			} else {
				indent = 0;
			}

			var padding = '';
			for ( var i = 0; i < pad; i++) {
				padding += ' ';
			}

			formatted += padding + node + '\r\n';
			pad += indent;
		});

		return formatted;
	};


})((descartes||{}),jQuery);
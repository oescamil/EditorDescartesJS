(function( $ ) { 	
/**
 * 
 */	
$.widget( "descartes_editor.descartesObjectsList", {
		version: "1.10.3",
		classNameWidget : "descartes-object-list",
		/**
		 * The key to store the object config in the metadata of nodes
		 */
		objectCfgkey : 'objectCfg',
		/**
		 * Default Options for the widget
		 */
		options : {
			active : null,
			data: null,
			babel : descartes.editor.ui_config.babel,
			icons: {
				down	: "ui-icon-triangle-1-s",
				up		: "ui-icon-triangle-1-n",
				remove 	: 'ui-icon-trash',
				create	: 'ui-icon-document' ,
				copy	: 'ui-icon-copy',	
				code	: 'ui-icon-circle-arrow-s',	
			},
			spaceSubContainers : 
				{
					controls 	: {label: 'Controls', forSpaceTypes : [['space'],['region']], contentTypes: [['control']]},
					graphics 	: {label: 'Graphics', forSpaceTypes : [['space','R2']], contentTypes: [['graphic','R2']]},
					graphics3D 	: {label: 'Graphics', forSpaceTypes : [['space','R3']], contentTypes: [['graphic','R3']]},
				},
			onSelect: function(event,domTreeNode, cfgObj, type){},
		},
		
		// the constructor
		_create : function() {
			// add a class for theming
			this.element.addClass(this.classNameWidget);
			
			this._createToolBar();
			this._createList();
			var tableExt = $("<table>").appendTo(this.element);
			tableExt.addClass('content_ext'); 
			$("<tr>").append($('<td>').append(this.toolBar).addClass('toolbar')).appendTo(tableExt);
			$("<tr>").append($('<td>').append(this.list).addClass('tree')).appendTo(tableExt);
		},
		/**
		 * 
		 */
		_createList: function(){
			var reformedData = this._formatDataToJSTree(this.options.data);
			var searchPlg =  {
					case_insensitive : true,
					search_method : "contains",
					show_only_matches : true,
					};
			var dndPlug = {
				"drop_finish" : function () {alert("DROP");},
				"drag_finish" : function (data) {alert("DRAG OK");}
			};
			var crrmPlug = { move : { check_move: $.proxy(this._check_dnd_valid_move,this),}, 	};
			this.list = $('<div>', {'class':'descartes-object-list-list'});
			this.list = this.list.jstree({
						plugins : [ "themes", "json_data","dnd","crrm", "ui",'search'],
						core : { open_parents : true},
						dnd : dndPlug,
						json_data : {data:reformedData},
						search : searchPlg,
						ui : {select_limit:1,selected_parent_open:true},
						crrm: crrmPlug,
					});
			this.list.data('jstree',$.jstree._reference(this.list));

			this.list.bind("select_node.jstree",$.proxy(this._callback_nodeSelected,this));
			this.list.bind("before.jstree", $.proxy(this._callback_before_jstree,this));
			this.list.bind("move_node.jstree", $.proxy(this._callback_node_move_jstree,this));
			this.list.bind("delete_node.jstree", $.proxy(this._callback_node_deleted_jstree,this) );
		},
				
		_createToolBar: function(){
			var babel = this.options.babel;
			this.toolBar = $("<div>",{
				'class':'descartes-object-list-toolbar ui-widget-header ui-corner-all',
			});
			this.list = $("<div>",{
				'class':'descartes-object-list-list'
			});
			var trAux = $('<table>',{style:'width:100%;'}).appendTo(this.toolBar);
			trAux = $('<tr>').appendTo(trAux);
			
			this.btnAdd = $("<button>", {
				text : babel.t("Add new"),
				"class" : "descartes-object-list-toolbar-button-add"
			}).button({
					text:false,
					icons: {primary:this.options.icons.create}});

			

			this.btnCopy = $("<button>", {
				text : babel.t('Copy'),
				"class" : "descartes-object-list-toolbar-button-copy"
			}).button({
					text:false,
					icons: {primary:this.options.icons.copy}});


			this.btnDel = $("<button>", {
				text : babel.t("Delete"),
				"class" : "descartes-object-list-toolbar-button-delete"
			}).button({
				text:false,
				icons: {primary:this.options.icons.remove}});
			
			
			this.spinContainer = $('<span>',{'class':'descartes-object-list-toolbar-button-spin-container'});
			
			this.btnSpinUp = $("<button>", {
				text : babel.t("Move Up"),
				"class" : "descartes-object-list-toolbar-button-spin-btn descartes-object-list-toolbar-button-spin-up"
			}).appendTo(this.spinContainer).button({
				text:false,
				icons: {primary:this.options.icons.up}});

			this.btnSpinDw = $("<button>", {
				text : babel.t("Move Down"),
				"class" : "descartes-object-list-toolbar-button-spin-btn descartes-object-list-toolbar-button-spin-dw"
			}).appendTo(this.spinContainer).button({
				text:false,
				icons: {primary:this.options.icons.down}});
			this.spinContainer.buttonset();
			this.spinContainer.css('white-space','nowrap');
			this.spinContainer.css('margin','1px');
			
			this.btnCode = $("<button>", {
				text : babel.t("Show Code"),
				"class" : "descartes-object-list-toolbar-button-code"
			}).button({
				text:false,
				icons: {primary:this.options.icons.code}});
			this.btnCode.css('width','100%');
			
			var tdAux = $("<td>").appendTo(trAux);
			this.btnAdd.appendTo(tdAux);
			tdAux.width(this.btnAdd.width());
			
			tdAux = $("<td>").appendTo(trAux);
			this.btnCopy.appendTo(tdAux);
			tdAux.width(this.btnCopy.width());

			tdAux = $("<td>").appendTo(trAux);
			this.btnDel.appendTo(tdAux);
			tdAux.width(this.btnDel.width());

			tdAux = $("<td>").appendTo(trAux);
			this.spinContainer.appendTo(tdAux);
			tdAux.width(this.spinContainer.width());

			tdAux = $("<td>").appendTo(trAux);
			this.btnCode.appendTo(tdAux);
			
			this.inputSearch = $('<input>',{type:'text','class':'ui-autocomplete-input'});
			this.inputSearch.appendTo(this.toolBar);
			
			
			// _on won't call when widget is disabled
			this._on(this.btnAdd,		{ click : "_callback_createNode" });
			this._on(this.btnCopy,		{ click : "_callback_copyNode" });
			this._on(this.btnDel,		{ click : "_callback_removeNode" });
			this._on(this.btnSpinDw,	{ click : "_callback_moveDown" });
			this._on(this.btnSpinUp,	{ click : "_callback_moveUp" });
			this._on(this.btnCode,		{ click : "_callback_showCode" });
			this._on(this.inputSearch,	{ keyup : '_callback_searchText'});
		},
		
		/*
		 * *************************************************************
		 * *JQUERY IU API*
		 * *************************************************************
		 */
		// called when created, and later when changing options
		_refresh : function() {
		},
		
		// events bound via _on are removed automatically
		// revert other modifications here
		_destroy : function() {
			this.list.unbind("select_node.jstree");
			this.list.unbind("before.jstree");
			this.list.unbind("after.jstree");
			this.toolbar.remove();
			this.list.remove();
			this.element.removeClass(this.classNameWidget);
		},
		
		_setOptions : function() {
			this._superApply(arguments);
		},
		
		_setOption : function(key, value) {
			this._super(key, value);
			switch (key) {
			case 'data':
				var jsTree = this.list.data('jstree');
				var reformedData = this._formatDataToJSTree(this.options.data);
				
				jsTree._get_settings().json_data.data = reformedData;
				jsTree.refresh(false);
				
				//To select the first space when change the data
				//I don't now why don't work in line
				var fTime = $.proxy(function (){
					var roots = this.list.children("ul").children('li');
					jsTree.select_node(roots[0]);
				},this); 
				window.setTimeout(fTime,0);
				break;
			case 'active':
				var objCfg = this.options.active;
				if((!objCfg) || (!objCfg.hasOwnProperty('#superType'))){
					//console.log('Lo que se paso no es una configuración',objCfg);
					return;
				}
				
				var jsTreeRef = this.list.data('jstree');
				var selectedNode = jsTreeRef.get_selected();
				if(selectedNode.length > 0){
					selectedNode = $(selectedNode[0]);
					var tmpCfg = selectedNode.data(this.objectCfgkey); 
					if( tmpCfg == objCfg){ //Is selected, nothing to do
					//	console.log("Ya está seleccionado , no hacemos nada",tmpCfg, objCfg);
						return;
					}
				}
				
				jsTreeRef.deselect_all();
				var type = objCfg['#superType'];
				var elements = [];
				if(type[0] == 'space'){
					elements = this.list.children("ul").children('li');
				} else {
					elements = $('.jstree-leaf',this.list);
				}
					
				elements.each(function(idx,element){
					var cfgAct   = $(element).data(this.objectCfgkey);
					cfgAct = cfgAct.objectCfg;
					if(cfgAct == objCfg){
						jsTreeRef.select_node(element);
						return false;
					}
				});
				break;
			default:
				break;
			}
		},
		/**
		 * 
		 */
		update : function(){
			
		},
		/*
		 * ************************************************
		 * *CALLBACKS*
		 * ************************************************
		 */
		
		/**
		 * 
		 * @param event
		 * @param data
		 * @returns
		 */
		_callback_before_jstree : function(event,data){
			//console.log(data.func);
				switch (data.func) {
					case "select_node":
					case "hover_node":
						return  this._check_node_to_select(event,data);
					case "start_drag":
						return this._check_node_to_init_drag(event,data);
					case "close_node": //CHECK IF node is not a space
						var treeRef = this.list.data('jstree');
						if(treeRef._get_parent(data.args[0]) == -1)
							return ;//false; //test allow close node to iser experience
				}
				return;
		},
		/**
		 * 
		 * @param event
		 * @param data
		 */
		_callback_node_move_jstree : function(event , data){
			/*
			 * Properties of data.rslt
			.o - the node being moved
			.r - the reference node in the move
			.ot - the origin tree instance
			.rt - the reference tree instance
			.p - the position to move to (may be a string - "last", "first", etc)
			.cp - the calculated position to move to (always a number)
			.cop - the calculated old position form where to move (always a number)
			.np - the new parent
			.oc - the original node (if there was a copy)
			.cy - boolen indicating if the move was a copy
			.cr - same as np, but if a root node is created this is -1
			.op - the former parent
			.or - the node that was previously in the position of the moved node
			 */
			
			var jsTree = data.inst;
			var t = this.options.babel.t;
			var refNData = data.rslt.r.data(this.objectCfgkey);
			var movedNData = data.rslt.o.data(this.objectCfgkey);
			
			var ctx = this;
			var toRollBack = function(cfgSel){
				jsTree.deselect_all();
				var fTime = function (){
					var roots = ctx.list.children("ul").children('li');
					var leafs = $('li.jstree-leaf',ctx.list);
					$.merge(leafs,roots);
					for(var i = 0;i < leafs.length ; i++){
						if($(leafs[i]).data(ctx.objectCfgkey) == cfgSel){
							jsTree.select_node(leafs[i]);
							return;
						}
					}
				}; 
				window.setTimeout(fTime,0);
			};
			var isSpace = false;
			if(isSpace)
				return;
			var spaceNode = this._getSpaceNodeForNode(data.rslt.r);
			var spaceData = spaceNode.data(this.objectCfgkey);
			console.log("Event ",event,
					"\nData :",data,
					"\nRefData",refNData,
					"\nMoved:",movedNData,
					"\Root : ",spaceNode,spaceData,
					"\nRelative Pos : ",data.rslt.p);
			var supType = movedNData['#superType'][0]+"s";
			var destListOrig = this.options.data[supType];
			var destList  = destListOrig.slice();
			
			if(refNData){
				if($.inArray(data.rslt.p,['after','before']) < 0){
					descartes.editor.ui.utils.showMsg(t('The destination node is not a container and try to add inside'));
					$.jstree.rollback(data.rlbk);
					toRollBack(movedNData);
					return;
				}
			} else { // No refNData, so, ref node is a container [controls, graphics, etc]
				if($.inArray(data.rslt.p,['last','first','inside']) < 0){
					descartes.editor.ui.utils.showMsg(t('The destination node is a container, just inside position is allowed. Position to move : [%pos]',{'%pos': data.rstl.p}));
					$.jstree.rollback(data.rlbk);
					toRollBack(movedNData);
					return;
				}
				var listChild = jsTree._get_children(data.rslt.r);
				if(listChild.length > 1){// If the container have more nodes and not just this one, calculate a new reference node to find in the cfg list 
					refNData = (data.rslt.p == 'first')?0:(listChild.length-1); 
					refNData = $(listChild[refNData]);
					refNData = refNData.data(this.objectCfgkey);
				}
			}
			
			if(refNData){ // The moved node should be in relative position (after or before) the reference node
				var idxOld = $.inArray(movedNData,destList);
				if(refNData != movedNData) // If reference and moved is the same object don't delete 
					destList.splice(idxOld,1);
				var idxNew = $.inArray(refNData,destList);
			
				if(idxOld < 0 || idxNew <0){
					
					var msg = t('One element there is not in the list of objects'); 
					descartes.editor.ui.utils.showMsg(msg);
					console.log(msg,'\nidxNew',idxNew,'\nrefNode',refNData, '\nidxOld',idxOld,'\nMoved node',movedNData);
					$.jstree.rollback(data.rlbk);
					toRollBack(movedNData);
					return;
				}
				if('after' == data.rslt.p){
					idxNew ++;
				}
				destListOrig.splice(idxOld,1);
				destListOrig.splice(idxNew,0,movedNData);
			} // No node reference, there for the moved node is the onlyone in the container. No matter its position. 
			
			if(spaceData['#superType'][0] == 'region'){
				movedNData.region = spaceData.id;
				movedNData.space = '';
			} else {
				movedNData.space = spaceData.id;
				movedNData.region = 'interior';
			}
			console.log("La configuracion quedo : ",this.options.data);
			
		} ,
		/**
		 * 
		 * @param e
		 * @param data
		 */
		_callback_nodeSelected: function (e, data) {
			var cfgObj = data.rslt.obj.data(this.objectCfgkey);
			this.inputSearch.val('');
			this.inputSearch.trigger('keyup');
			this._scrollTreeContainerTo(data.rslt.obj);
			
			var type = this._getObjectType(cfgObj,data.rslt.obj,data.inst);
			
			var newData = {};
			newData.inst		= data.inst;  
			newData.selected	= data.rslt.obj; 
			newData.cfgObj		= cfgObj; 
			newData.objectType	= type;
			this._trigger('onSelect',e,newData);
		},
		/**
		 * 
		 * @param e
		 */
		_callback_searchText: function(e){
			var text = this.inputSearch.val();
			if(text.length >= 1 && this.list){
				this.list.jstree("search",text);
			}else {
				this.list.jstree("clear_search");
			}
		},
		/**
		 * 
		 * @param e
		 * @returns {Boolean}
		 */
		_callback_createNode: function(e){
			var types = this._get_objects_type_list();
			var select = $("<ul>");
			select.selectedValue = false;
			
			var options = (function createItem(itemName,itemData,parent_type,babel){
				var anchor = $('<a href="#">').text(babel.t(itemName));
				anchor.data("selected-value",itemName);
				var new_p_type = $.extend([],parent_type);
				new_p_type.push(itemName);

				anchor.html(anchor.text()+"&nbsp;&nbsp;&nbsp;&nbsp;");
				anchor.css("white-space","nowrap");
				
				var liP = $("<li>").append(anchor);
				if(!$.isFunction(itemData)){
					var subList = $("<ul>");
					for ( var type in itemData) {
						var newData =  itemData[type];
						var li = createItem(type,newData,new_p_type,babel);
						li.appendTo(subList);
					}
					if(itemName == '_INIT_ALG_'){
						liP = subList;
					} else {
						subList.insertAfter(anchor);
					}
				} else {
					anchor.data("selected-value",new_p_type);
					anchor.addClass('add-object-menu-tmp');
				}
				
				return liP;
			})('_INIT_ALG_',types,[],this.options.babel);
			
			options.appendTo($('body'));
			options.zIndex(3000);
			options.menu();
			options.css('display',"inline-block");
			options.css('position',"absolute");
			options.position({
				 of: this.btnAdd,
				 my: 'left top',
				 at: 'left bottom',
			});
			
			var removeMenu = function(){options.remove();} ;
			$(document).one("click", removeMenu);
			
			
			this._on($('a.add-object-menu-tmp',options),{click : function(event){
				var target = $(event.target);
				var value = target.data("selected-value");
				value.shift();
				
				var newData = this._create_new_object_aux(value,this.options.data);
				if(newData != false){
					this.options.data = newData;
					//this._setOption('data',newData);
				}
				removeMenu();
			}});
			var doNothing = function (event) {return false;};
			this._on($('a',options),{click : doNothing});
			return false;
		},
		/**
		 * Callback trigger when the delete button is clicked
		 */
		_callback_removeNode: function(){
			var jsTreeRef = this.list.data('jstree');
			var t = $.proxy(this.options.babel.t,this.options.babel);
			var selectedNode = jsTreeRef.get_selected();
			if(selectedNode.length < 1){
				descartes.editor.ui.utils.showMsg(t('Error: Nothing selected'));
				return;
			}
			
			selectedNode = selectedNode[0];
			descartes.editor.ui.utils.confirmMsg(
						t('Do you really want delete the item ?'),
						$.proxy(function(haveToDelete){ if(haveToDelete) jsTreeRef.delete_node(selectedNode); },this),
						t("Delete item ?")
					);
			
		},
		/**
		 * Add a copy of current selected item.
		 */
		_callback_copyNode: function(){
			var t = $.proxy(this.options.babel.t,this.options.babel);
			var originalData = this.options.data;
			var jstreeRef = this.list.data('jstree');
			var selectedNode = jstreeRef.get_selected();
			
			var cfgObject = false;
			if(selectedNode && selectedNode.length > 0){
				selectedNode = selectedNode[0];
				cfgObject = $(selectedNode).data(this.objectCfgkey);
			}
			
			if(!cfgObject){
				var msg = t('No item selected');
				descartes.editor.ui.utils.showMsg(msg);
				return;
			}
			
			var typeToInst = cfgObject['#superType'];
			var where = originalData[typeToInst[0]+"s"];
			var cfgProtoObj = {};
			try{ 
				cfgProtoObj =  descartes.editor.ui_config.getCfgFor(typeToInst); 
			} catch(e){ 
				console.log(e);
				var msg = t("Could't find the configuration for type [%type]",{'%type':typeToInst.join(',')}); 
				console.log(msg);
			}
			var cfgObjCp = {};
			for (var prop in cfgProtoObj) {
				var tmpVal = cfgProtoObj[prop];
				if(prop.indexOf('#') != 0){
					tmpVal = (tmpVal.hasOwnProperty('value'))?tmpVal.value:'';
				}
				cfgObjCp[prop] = tmpVal;
			}
			cfgObjCp = $.extend(cfgObjCp,cfgObject);
			if(!this._add_newobject_to_tree(cfgObjCp,where,originalData)){
				return false;
			}
			return originalData;
		},
		
		/**
		 * Move current selected item one position up in the list. Update the data and change the espace or container if needed
		 */
		_callback_moveUp: function(){
			this._aux_moveNodeUpOrDown(true);
		},
		/**
		 * Move current selected item one position down in the list. Update the data and change the espace or container if needed
		 */
		_callback_moveDown: function(){
			this._aux_moveNodeUpOrDown(false);
			
		},
		/**
		 * 
		 */
		_callback_showCode: function(){
			console.log(this.options.data);
			var descCfg = this.options.data;
			 
			var babel = this.options.babel;
			var tmpKeys = ['spaces','graphics','controls'];
			cfgDialog = {};
			for ( var i = 0; i < tmpKeys.length; i++) {
				var currKey = tmpKeys[i];
				var title = babel.t(currKey);
				
				var txtArea = $("<textarea>").attr('wrap','off').text(descCfg.sceneCfgObjectsToString(currKey));
				txtArea = txtArea[0];
				cfgDialog[title] = txtArea.outerHTML; 
			}
			
			//TODO falta implementar si es que se cambia algo en la configuración manualmente
			var funcOk 		= $.proxy(function(cfgDialog){console.log("Ok",cfgDialog);});
			var funcCancel 	= $.proxy(function(cfgDialog){console.log('Cancel',cfgDialog);});
			
			descartes.editor.ui.utils.showTabbedDialogForm(cfgDialog,funcOk,funcCancel,550,350,babel);
		},
			
	/*
	 * ***************************************************
	 * *CALLBACKS AUXILIARS*
	 * ***************************************************
	 */
		/**
		 * @param m
		 */
		_check_dnd_valid_move: function(m){
			var cfgOrg = m.o.data(this.objectCfgkey);
			var jstreeRef = this.list.data('jstree');
			var isContainerIner = m.o.attr('type') == 'container' && m.o.attr('contentType') == 'internal';
			var isRoot = (jstreeRef._get_parent(m.o) == -1);
			
			if(cfgOrg == undefined && !isContainerIner) // It's not a object or folder
				return false;
			
			var cfgParent = m.np.data(this.objectCfgkey);
			
			var newGP = {};
			newGP.dom = jstreeRef._get_parent(m.np);
			var newP = {};
			newP.dom = m.np;
			newP.isRoot = (newGP.dom == -1); 
			
			if(newP.isRoot)
				return false;
			
			if(cfgParent){
			//	console.log("Tiene configuracion, checando que sea un espacio",cfgParent);
			//	console.log("Su padre es ",newP.isRoot,grandP);
				if(!newP.isRoot){
					//console.log("No paso, es un objeto y no es un espacio");
					return false;
				}
			} 
			
			if(!newP.isRoot){
				
				newP.type = newP.dom.attr('type');
				newP.ctype = newP.dom.attr('contentType');
				newP.isContInt = (newP.type == 'container') && (newP.ctype == 'internal'); 
	
				var oldP = {};
				oldP.dom = m.op;
				oldP.type = oldP.dom.attr('type');
				oldP.ctype = oldP.dom.attr('contentType');
				oldP.isContInt = (oldP.type == 'container') && (oldP.ctype == 'internal');
				
				var toCompOldP = oldP; 
				var toCompNewP = newP;
				
				if(oldP.isContInt){
					toCompOldP = {};
					toCompOldP.dom		= jstreeRef._get_parent(oldP.dom);
					toCompOldP.type		= toCompOldP.dom.attr('type');
					toCompOldP.ctype	= toCompOldP.dom.attr('contentType');
				} 
	
				if(newP.isContInt){
					toCompNewP = {};
					toCompNewP.dom		= jstreeRef._get_parent(newP.dom);
					toCompNewP.type		= toCompNewP.dom.attr('type');
					toCompNewP.ctype	= toCompNewP.dom.attr('contentType');
				} 
				
				
				if(toCompNewP.ctype != toCompOldP.ctype){
					//console.log("No paso, es una capeta y no es del mismo tipo que la de origen");
					return false;
				}
			}
			if((newP.isRoot) &&  (m.p != "inside") && (m.p != "last")){
				//console.log("No paso, es un espacio pero no se quiere poner dentro sino en :"+m.p);
				return false;
			}
			
			if(isRoot){
				var tmpCfgRef = m.r.data(this.objectCfgkey);
				if(tmpCfgRef && tmpCfgRef['#superType'][0] == 'region')
					return false;
			}
			
			return true;
		},
		/**
		 * 
		 * @param event
		 * @param data
		 * @returns {Boolean}
		 */
		_check_node_to_select:function(event, data){
			 var element = $(data.args[0]).closest("li");
			 var cfg =  element.data(this.objectCfgkey);
			if(cfg === undefined || cfg['#superType'][0] == 'region'){
				event.stopImmediatePropagation();
				return false; 	
			}
			
			//console.log("Checando seleccion.(Type,contentType,cfg, obj) : ", type,contentType,cfg,element);
		},
		/**
		 * 
		 * @param event
		 * @param data
		 * @returns {Boolean}
		 */
		_check_node_to_init_drag: function(event, data){
			var element = $(data.args[0]).closest("li");
			var esContentInt = element.attr('type') == 'container' && element.attr('contentType') == 'internal';
			if(esContentInt)
				return;
			var cfg =  element.data(this.objectCfgkey);
			if(cfg === undefined || cfg['#superType'][0] == 'region'){
				event.stopImmediatePropagation();
				return false; 	
			}
		},
		/**
		 * 
		 * @returns
		 */
		_get_objects_type_list: function() {
			var res = descartes.editor.ui_config.utils.getObjectTypeTree();
			// We don't wanna auxiliars in this list
			delete res.auxiliar;
			return res;  
		},
		
		/**
		 * This method need to overwrite 
		 * @param typeToInst
		 */
		_create_new_object_aux : function(typeToInst, originalData){
			var t = $.proxy(this.options.babel.t,this.options.babel);
			var where = originalData[typeToInst[0]+"s"];
			var cfgProtoObj = {};
			
			try{ cfgProtoObj =  descartes.editor.ui_config.getCfgFor(typeToInst,this.options.data); } catch(e){ console.log(e);	}
			var cfgObj = {};
			if(cfgProtoObj){
				for (var prop in cfgProtoObj) {
					var tmpVal = cfgProtoObj[prop];
					if(prop.indexOf('#') != 0){
						tmpVal = (tmpVal.hasOwnProperty('value'))?tmpVal.value:'';
					}
					cfgObj[prop] = tmpVal;
				}
			} else {
				var msg = t("Could't find the configuration for type [%type]",{'%type':typeToInst.join(',')}); 
				console.log(msg);
			}
	
			if(!this._add_newobject_to_tree(cfgObj,where,originalData)){
				return false;
			}
			return originalData;
		},
		/**
		 * Auxiliar function to put in place a new object in the tree. Additional put in place in the list where
		 * according to its position in the tree.
		 * @param cfgNewObject the configuration for the new object
		 * @param where The array to add this new object
		 * @param originalData The global object container of all configuration
		 * @returns {Boolean}
		 */
		_add_newobject_to_tree : function(cfgNewObject,where,originalData){
			var cfgObj = cfgNewObject;
			var typeToInst = cfgObj['#superType'].slice(1);
			var suffix = (where.length > 0)?"_"+where.length:'';
			cfgObj.id = typeToInst.join("_")+suffix;
			
			
			var jstreeRef = this.list.data('jstree');
			var selectedNode = jstreeRef.get_selected();
			var isSpace = (where == originalData.spaces);
			var idxDest = -1;
			if(selectedNode.length <= 0){
				selectedNode = null;
			} else {
				selectedNode = selectedNode[0];
				var tmpCfgObj = $(selectedNode).data(this.objectCfgkey);
				idxDest = $.inArray(tmpCfgObj,where);
				console.log("Checando si esta : ",where,tmpCfgObj);
			}
			var canInsertInSpace = $.proxy(this,"_canInsertInSpace");
			if(!isSpace){ //It's not a space, search for one space id to insert
				var parentSp = false;
				var parentNd = false;
				if(selectedNode != null){ //something selected ? 
					var nodeP = this._getSpaceNodeForNode($(selectedNode)); 
					var spObjCfg = nodeP.data(this.objectCfgkey);
					//Is space suitiable for the type of this new object
					if(this._canInsertInSpace(cfgObj,spObjCfg)){
						parentSp = spObjCfg.id;
						parentNd = nodeP; 
						if(idxDest < 0){ // Not the same type
							selectedNode = this._getContainerFromSpaceFor(cfgObj,parentNd);
						}
					}
				} 
				
				if(parentSp == false) { //Selected don't have a suitable space, search for any
					var liList = $(this.list).children('ul').children('li'); // get space node list, root nodes
					 
					liList.each(function(idx,element){
						var tmpSp = $(element).data(this.objectCfgkey);
						if(canInsertInSpace(cfgObj,tmpSp)){
							parentSp = tmpSp.id;
							parentNd = jstreeRef._get_node(element)[0];
							idxDest = -1;
							selectedNode = this._getContainerFromSpaceFor(cfgObj,parentNd);
							return false;
						}
					});
				}
				
				if(parentSp == false){
					descartes.editor.ui.utils.showMsg(
							this.options.babel.t('No space'), 
							this.options.babel.t('There is no space to add an object of this type'),
							'warning');
					return false;
				}
				cfgObj.space = parentSp;
				
			} else {
				if(selectedNode != null){ //something selected ? 
					selectedNode = this._getSpaceNodeForNode($(selectedNode)); 
					var tmpCfgObj = $(selectedNode).data(this.objectCfgkey);
					idxDest = $.inArray(tmpCfgObj,where);
				}
			}
			
			var res = null;
			var json = this._formatObjectDataToJSTree(cfgObj);
			var sPos = 'last';
			if(idxDest < 0){
				where.push(cfgObj);
				if(isSpace){
					selectedNode = null;
				} 
			} else {
				where.splice(idxDest+1,0,cfgObj);
				sPos = 'after';
			}
			res = jstreeRef.create(selectedNode,sPos,json,$.noop,true);
			
			if(isSpace){
				for(var i= 0 ; i< json.children.length;i++){
					var childJson = json.children[i];
					jstreeRef.create(res,'last',childJson,$.noop,true);
				}
			}
			jstreeRef.select_node(res,true);
			return true;
		},
		/**
		 * Move the selected item one position up or down. This method dont che if is a valida moved, check 
		 * check_move method.  
		 * @param toUp if the move is to up. Default is false
		 */
		_aux_moveNodeUpOrDown : function(toUp){
			var treeFun,jqFun,insertWhere,insertWhereOp,errorMsg1;
			if(toUp){
				treeFun			= '_get_prev';
				jqFun			= 'prev';
				insertWhere		= 'before';
				insertWhereOp	= 'last';
				errorMsg1		= 'Its the first item';
			} else {
				treeFun 		= '_get_next';
				jqFun 			= 'next';
				insertWhere 	= 'after';
				insertWhereOp	= 'first';
				errorMsg1 		= 'Its the last item';
			}
			
			errorMsg1 = this.options.babel.t(errorMsg1);
			
			var jstreeRef = this.list.data('jstree');
			var selectedNode = jstreeRef.get_selected();
			if(selectedNode.length < 1){
				descartes.editor.ui.utils.showMsg('Error: Nothing selected');
				return;
			}
			selectedNode = $(selectedNode[0]);
			var selCfg = selectedNode.data(this.objectCfgkey);
			if(!selCfg){
				descartes.editor.ui.utils.showMsg('Error: Item selected is not object');
				return;
			}
			var isSpace = selCfg['#superType'][0] == 'space';
			var next = jstreeRef[treeFun](selectedNode);
			var nextCfg = false;
			
			if(next == false || next.length <= 0){ // No prev node. Could be a root, search for prev root 
				next = selectedNode[jqFun]('li');
				if(next.length <= 0){
					descartes.editor.ui.utils.showMsg(errorMsg1);
					return;
				}
			}
			
			next = next[0];
			var positionRef = insertWhere;
			if(isSpace){ // Its a root, search for next/prev root
				next = this._getSpaceNodeForNode(next);
			} else {
				nextCfg = $(next).data(this.objectCfgkey);
				if(!nextCfg){ // Its a container, search for root
					var tmpNext = this._getSpaceNodeForNode(next);
					tmpNext = $(tmpNext)[jqFun]('li');
					next = false;
					if(tmpNext.length > 0){
						next = tmpNext[0];
						nextCfg = $(next).data(this.objectCfgkey);
					}
				}
				if(nextCfg && $.inArray(nextCfg['#superType'][0],['space','region']) >= 0){
					next = this._getContainerFromSpaceFor(selCfg,next);
					positionRef = insertWhereOp;
				}
			}
			if(!next){
				descartes.editor.ui.utils.showMsg(errorMsg1);
				return;
			}
			nextCfg = $(next).data(this.objectCfgkey);
			jstreeRef.move_node(selectedNode,next,positionRef);
			jstreeRef.clean_node(-1);
			/*	
			console.log(
					"\nSelected : ",selectedNode,selCfg,
					"\nnext : ",next,nextCfg,
					""
					);
					*/
		},
		/**
		 * Call back trigger when a node is deleted
		 * @param e
		 * @param data
		 */
		_callback_node_deleted_jstree : function (e,data) {
			var jsTree = data.inst;
			var node = data.rslt.obj;
			var cfgNode = $(node).data(this.objectCfgkey);
			var type = cfgNode["#superType"][0]+"s";
			var where = this.options.data[type];
			var isRoot = jsTree._get_parent(node) == -1;
			var idx = $.inArray(cfgNode,where);
			if(idx >= 0 ){
				if(isRoot){
					var callRec = $.proxy(this._callback_node_deleted_jstree,this);
					var tmpKey = this.objectCfgkey;
					var recData = {inst:jsTree, args:data.args, rlbk:data.rlbk};
					recData.rslt = {parent:node,prev:data.rslt.prev,obj:null};
					var listLeaf = $('li.jstree-leaf',node); 
					listLeaf.each(function(idx, element){
						var cfgObj = $(element).data(tmpKey);
						if(cfgObj){
							recData.rslt.obj = element;
							callRec(e,recData);
						}
					});
				}
				where.splice(idx,1);
			} else {
				alert("No se encontro la configuracion");
			}
			
		},
		/*
		 * ***************************************************
		 * * MY FUNCTIONS  *
		 * ***************************************************
		 */
		
		createNode: function(){
			alert('Creando un nodeo');
		},
		removeNode: function(){
			alert('quitando un nodo');
		},
		copyNode: function(object){
			alert('copiando el nodo');
		},
		
		moveToNode: function(object,parent,index){
			alert('moviendo el objecto a '+parent+" \n"+index);
		},
		
		moveUp: function(object){
			alert('Moviendo Objeto para arriba');
		},
		
		moveDown: function(object){
			alert('Moviendo Objeto para abajo');
			
		},
		/*
		 * ******************************************************************************
		 * *AUXILIAR FUNCTIONS*
		 * ******************************************************************************
		 */
		
		/**
		 * 
		 * @param descCfgData
		 * @returns
		 */
		_formatDataToJSTree: function(descCfgData){
			var spaces = this._getSecuredValue(descCfgData,'spaces');
			if(spaces == false){
				return {};
			}
			
			var exampleData = [];
			var tmpObjects	= {};
			var noSpaceCfgKey = '_NO_SPACE_NAME_';
			/*
			 * Controls y graphics
			 */
			var tmpCtrs = this._getSecuredValue(descCfgData, 'controls');
			var tmpGrp = this._getSecuredValue(descCfgData, 'graphics');
			var tmpSearchCfg = [
			                    (tmpCtrs || []), 
			                    (tmpGrp || []) , 
			                    ];
			for ( var m = 0; m < tmpSearchCfg.length; m++) {
				var tmpSetCfg = tmpSearchCfg[m];
				
				for ( var i = 0; i < tmpSetCfg.length; i++) {
					var ctrCfg = tmpSetCfg[i];
					var treeObj = this._formatObjectDataToJSTree(ctrCfg);
					var sType = ctrCfg['#superType']; 
					var spId = this._getSecuredValue(ctrCfg,'space');
					var spaceKey = 'space';
					
					if(spId == false){
						if(sType[0] == 'control'){
							spaceKey = 'region';
							var region = this._getSecuredValue(ctrCfg,'region');
							if(!region){
								console.log("Control sin region ni espacio");
							}
							spId = region;
						} else {
							spId = noSpaceCfgKey;
						}
					}	
					spId = spaceKey+'-'+spId;
					
					if(!tmpObjects[spId]) tmpObjects[spId] = [];
					tmpObjects[spId].push(treeObj);
				}
			}
			/**
			 * 
			 * Aux function to use in next for
			 */
			function _testForContainers(treeObjInt, spType, containers,context){
				for ( var l = 0; (l < containers.length); l++) {
					var subContainer = containers[l];
					var contentTypes = subContainer.metadata.contentTypes;
					
					for ( var l1 = 0; l1 < contentTypes.length; l1++) {
						var cTypes = contentTypes[l1];
						if(context._isSubTypeOf(spType,cTypes)){
							return subContainer;
						}
					}
				}
				return false;
			}
			
			/*
			 * Spaces and REGIONS
			 */
			
			//REGIONS
			var regionsCfg = [
			                  {id:'north'},
			                  {id:'south'},
			                  {id:'east'},
			                  {id:'west'},
			                  ];
			for ( var k = 0; k < regionsCfg.length; k++) {
				var tmpReg = regionsCfg[k];
				tmpReg.type = tmpReg.id;
				var sType = ['region',tmpReg.type];
				tmpReg['#superType'] = sType;
			}
			var tmpIter = [].concat(descCfgData.spaces,regionsCfg);
			               
			for ( var i = 0; i < tmpIter.length; i++) {
				var spCfg = tmpIter[i];
				var objListKey = spCfg['#superType'][0]+"-"+spCfg.id; 
				var treeObj = this._formatObjectDataToJSTree(spCfg);
				exampleData.push(treeObj);
				
				/*
				 * Try to add objects to this space 
				 */
				var listsToTest = [];
				if(tmpObjects[objListKey])
					listsToTest.push(tmpObjects[objListKey]);

				var tmpKey = 'region-'+noSpaceCfgKey;
				if(tmpObjects[tmpKey])
					listsToTest.push(tmpObjects[tmpKey]);
				
				var tmpKey = 'space-'+noSpaceCfgKey;
				if(tmpObjects[tmpKey])
					listsToTest.push(tmpObjects[tmpKey]);
				
				
				for ( var k = 0; k < listsToTest.length; k++) {
					var listObj = listsToTest[k];
					for ( var j = listObj.length-1; j >= 0 ; j--) {
						var treeObjInt = listObj[j];
						var spType = treeObjInt.metadata.objectCfg['#superType'];
						var whereIns = _testForContainers(treeObjInt,spType,treeObj.children,this);
						if(whereIns != false){
							whereIns.children.unshift(treeObjInt); //The list of object is traversed in inverse order
							listObj.splice(j,1);
						}
					}
				}
			}
			
			
			//Check if some object still without space
			var someError = false;
			var logStr = '';
			for (var spId in tmpObjects) {
				var listObj = tmpObjects[spId];
				if(listObj.length > 0){
					someError = true;
					for ( var i = 0; i < listObj.length; i++) {
						var cfgMal = listObj[i].metadata[this.objectCfgkey];
						logStr += "id :'"+cfgMal.id+"' space : '"+cfgMal.space+"' <br>";	
					}
				}
			}
			if(someError){
				var msg = this.options.babel.t("There is objects can't be inserted in any space, check log for more information"); 
				console.log(msg,"\nObjects : ",tmpObjects,"\n All config data : ",descCfgData);
				msg += "<p>"+logStr+"</p>";
				descartes.editor.ui.utils.showMsg(msg);
			}
			return exampleData;
		},
		/**
		 * Create JSON object for a object [space,control or graphic]. The kind of tree node is determinated by 
		 * property '#superType' of the var objectData
		 * @param objectData The data to create the node and reference to orignial object
		 * 
		 */
		_formatObjectDataToJSTree : function (objectData){
			var spType = objectData['#superType'].slice();
			var icon = spType[0]+' '+spType.join('-');
			var toolTipText = this._getDataToTooltip(objectData);
			var treeObj = {
					data		: { title: objectData.id,	icon:icon,	attr : {title:toolTipText}},
					metadata	: { objectCfg : objectData	},
					
			};
			
			if(spType[0] == 'space' || spType[0] == 'region'){ //it's a space, add containers to 
				var t = this.options.babel.t;
				var containers = this.options.spaceSubContainers;
				treeObj.children = [];
				//treeObj.state = 'open'; 
				for (var contId in containers) {
					var cfgCont = containers[contId];
					var some = false;
					var testF = $.proxy(function(a,b){return this._isSubTypeOf(a,b);},this);
					var forSpaceTypesList = cfgCont.forSpaceTypes;
					$.each(forSpaceTypesList,function(idx,element){
						if(testF(objectData['#superType'], element)){
							some = true;
							return false;
						}
					});
					if(!some)
						continue;
					var contTreeNode = 
						{
							data		: { title:t(cfgCont.label),	icon:contId+'-container',	attr:{}	},
							metadata	: { contentTypes : cfgCont.contentTypes.slice()	},
							attr		: { type:'container',	contentType:contId	},
							//state 		: 'open',
							children:[],
						};
					treeObj.children.push(contTreeNode);
				}
			}
			return treeObj;
		},
		/**
		 * Extract and format information of  [space,control or graphic] to show has tooltip. The kind of tree node is determinated by 
		 * property '#superType' of the var objectData
		 * @param objectData The data to create the node tooltip
		 */
		_getDataToTooltip: function(objData){
			return objData.id;
		},
		/**
		 * 
		 * @param cfgObjDescartes
		 * @param objInTree
		 * @param treeInstance
		 * @returns
		 */
		_getObjectType : function (cfgObjDescartes,objInTree,treeInstance){
			var type = cfgObjDescartes['#superType'];
			return type;
		},
		/**
		 * 
		 * @param objToIns
		 * @param spaceIntoIns
		 * @returns
		 */
		_canInsertInSpace : function(objToIns,spaceIntoIns){
			var spType 		= spaceIntoIns['#superType'].slice();
			var spTypes = this._getSpaceTypesAllowedFor(objToIns);
			
			var canInsert = false;
			var testF = $.proxy(this,'_isSubTypeOf');
			$.each(spTypes,function(idx,element){
				if(testF(spType, element)){
					canInsert = true;
					return false;
				}
			});
			return  canInsert;
				
		},
		
		/**
		 * Shearch for the spaces type where the object is allowed to insert
		 * @param objToIns
		 * @returns
		 */
		_getSpaceTypesAllowedFor : function(cfgObj) {
			var supType = cfgObj['#superType'].slice();
			
			for(var containerT in this.options.spaceSubContainers){
				var container = this.options.spaceSubContainers[containerT];
				var contTps = container.contentTypes;
				for ( var i = 0; i < contTps.length; i++) {
					var contTp = contTps[i];
					if(this._isSubTypeOf(supType,contTp))
						return container.forSpaceTypes;
				}
			}
			return false;
		},
		/**
		 * 
		*/
		_getContainerFromSpaceFor : function(cfgObject, spaceTreeNode){
			var jstreeRef = this.list.data('jstree');
			
			var containers = $('> ul > li',spaceTreeNode); 
				
			var objType = cfgObject['#superType'];
			for ( var l = 0; (l < containers.length); l++) {
				var subContainer = containers[l];
				var objSubContainer = jstreeRef.get_json(subContainer);
				objSubContainer = objSubContainer[0];
				var contentTypes = objSubContainer.metadata.contentTypes;
				for ( var l1 = 0; l1 < contentTypes.length; l1++) {
					var cTypes = contentTypes[l1];
					if(this._isSubTypeOf(objType,cTypes)){
						return subContainer;
					}
				}
			}
			return false;
		},
		/**
		 * Shearch for the spaces tree node of the argumente.
		 * @param treeNode a tree node to search parents
		 * @returns
		 */
		_getSpaceNodeForNode : function(treeNode) {
			var jstreeRef = this.list.data('jstree');
			var nodeP = jstreeRef._get_parent(treeNode);
			var nodePAux = treeNode;
			while(nodeP != false && nodeP != -1){ // if parent is -1, is a root node (or a space in this case)
				nodePAux = nodeP;
				nodeP = jstreeRef._get_parent(nodeP);
			}
			
			return nodePAux;
		},
		/**
		 * Check if the path of type [arrayType] is sub type of [arraySuperType]
		 * Examples :   
		 * 		_isSubTypeOf(['control','numeric','button'],['control','numeric'])	= true; 
		 *		_isSubTypeOf(['control','numeric','button'],['control'])			= true; 
		 * 		_isSubTypeOf(['control','numeric','button'],['control','graphic']) = false;
		 * 
		 * @param {Array} arrayType Type path to test
		 * @param {Array} arraySuperType Type path to test if is super type
		 * @returns {Boolean} true if the path of type [arrayType] is sub type of [arraySuperType]. Or false otherwise
		 */
		_isSubTypeOf:function(arrayType,arraySuperType){
			if( !$.isArray(arrayType) || !$.isArray(arraySuperType) ||
				 (arrayType.length < arraySuperType.length)
			) return false;
			
			// return the elements in arrayType not in the same position in arraySuperType
			var diff = $.grep(arrayType,function(x,idx) {return (x == arraySuperType[idx])?false:x;});
			var nDiff = arrayType.length - arraySuperType.length ; 
			
			return (diff.length == nDiff);
		},
		/**
		 * 
		 * @param object
		 * @param key
		 * @returns
		 */
		_getSecuredValue: function(object,key){
			if(object && object.hasOwnProperty(key) 
					&& object[key] 
					&& 	$.trim(object[key]).length > 0)
					return object[key];
			return false;
		},
		/**
		 * 
		 */
		_scrollTreeContainerTo: function (elementToDisplay){
			elementJQ = $(elementToDisplay);
			var top = 0 ;
			var cont		= elementJQ.closest('div')[0];
			var parent		= elementJQ;
			while(parent[0] != cont){
				var position	= parent.position();
				if(!position){
					console.log("No pude determinar la posicion : ",parent);
				} else {
					top += position.top;
					
				}
				parent = parent.parent();
			}
			cont.scrollTop = top-10;
		},
	});

 
 }( jQuery ) );
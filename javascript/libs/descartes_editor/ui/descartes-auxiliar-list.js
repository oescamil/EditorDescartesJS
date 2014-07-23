(function( $ ) { 	
/**
 * 
 */	
$.widget( "descartes_editor.descartesAuxiliarsList", 
{
	version: "1.10.3",
	classNameWidget : "descartes-auxiliars-list",
	/**
	 * The key to store the object config in the metadata of nodes
	 */
	objectCfgkey : 'objectCfg',
	/**
	 * Default Options for the widget
	 */
	options : {
		active:null,
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
		onSelect: function(event,domTreeNode, cfgObj, type){},
	},

	/**
	 * 
	 */
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
		this.list = $('<div>', {'class':'descartes-auxiliar-list-list'});
		this.list = this.list.jstree({
					plugins : [ "themes", "json_data","dnd","crrm", "ui",'search'],
					core : { open_parents : true},
					dnd : dndPlug,
					json_data : {data:reformedData},
					search : searchPlg,
					ui : {select_limit:1,},
					crrm: crrmPlug,
				});
		this.list.data('jstree',$.jstree._reference(this.list));

		this.list.bind("select_node.jstree",	$.proxy(this._callback_nodeSelected,		this));
		this.list.bind("before.jstree", 		$.proxy(this._callback_before_jstree,		this));
		this.list.bind("move_node.jstree", 		$.proxy(this._callback_node_move_jstree,	this));
		this.list.bind("delete_node.jstree", 	$.proxy(this._callback_node_deleted_jstree,	this));
	},
	
	/**
	 * 
	 */		
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
		this._on(this.btnAdd,		{ click : "_callback_createNode"	});
		this._on(this.btnCopy,		{ click : "_callback_copyNode"		});
		this._on(this.btnDel,		{ click : "_callback_removeNode"	});
		this._on(this.btnSpinDw,	{ click : "_callback_moveDown"		});
		this._on(this.btnSpinUp,	{ click : "_callback_moveUp"		});
		this._on(this.btnCode,		{ click : "_callback_showCode"		});
		this._on(this.inputSearch,	{ keyup : '_callback_searchText'	});
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
				break;
			case 'active':
				var objCfg = this.options.active;
				if((!objCfg) || (!objCfg.hasOwnProperty('#superType'))){
					console.log('Lo que se paso no es una configuración',objCfg);
					return;
				}
				
				var jsTreeRef = this.list.data('jstree');
				var selectedNode = jsTreeRef.get_selected();
				if(selectedNode.length > 0){
					selectedNode = selectedNode[0];
					if(selectedNode.data(this.objectCfgkey) == objCfg){ //Is selected, nothing to do
						return;
					}
				}
				
				var elements = $('.jstree-leaf',this.list);
				elements.each(function(idx,element){
					var cfgAct   = $(element).data(this.objectCfgkey);
					if(cfgAct == objCfg){
						jsTreeRef.select_node(element);
						return false;
					}
				});
				break;
		}
	},
	/**
	 * 
	 */
	update : function(){
		
	},
	/* 
	 * **********************************************************************
	 * *                       JSTREE LISTENERS                             *
	 * **********************************************************************
	 */
	/**
	 * 
	 * @param m
	 * @returns {Boolean}
	 */
	_check_dnd_valid_move : function (m) {
		var jstreeIns = this.list.data('jstree');
	    var p = jstreeIns._get_parent(m.o);
	    if(!p) return false;
	    p = (p == -1) ? this.get_container() : p;
	    if(p === m.np) return true;
	    if(p[0] && m.np[0] && p[0] === m.np[0]) return true;
	    	return false;
	},
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
		var type = cfgObj['#superType']; 
		
		var newData = {};
		newData.inst		= data.inst;  
		newData.selected	= data.rslt.obj; 
		newData.cfgObj		= cfgObj; 
		newData.objectType	= type;
		this._trigger('onSelect',e,newData);
	},
	
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
			}
			return;
	},
	/**
	 * 
	 * @param event
	 * @param data
	 */
	_check_node_to_select : function(event, data){
		var element = $(data.args[0]).closest("li");
		 var cfg =  element.data(this.objectCfgkey);
		if(cfg === undefined){
			event.stopImmediatePropagation();
			return false; 	
		}
	},
	/**
	 * 
	 * @param event
	 * @param data
	 */
	_check_node_to_init_drag: function(event,data){
		var element = $(data.args[0]).closest("li");
		var cfg =  element.data(this.objectCfgkey);
		if(cfg === undefined){
			event.stopImmediatePropagation();
			return false; 	
		}
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
		var ctx = this;
		var t = this.options.babel.t;
		var refNData = data.rslt.r.data(this.objectCfgkey);
		var movedNData = data.rslt.o.data(this.objectCfgkey);
		var supType = movedNData['#superType'][0]+"s";
		var destListOrig = this.options.data[supType];
		var destList  = destListOrig.slice();
		console.log("Event ",event,
				"\nData :",data,
				"\nRefData",refNData,
				"\nMoved:",movedNData,
				"\nRelative Pos : ",data.rslt.p);
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
		} else {
			var msg = t('The element can\'t move'); 
			descartes.editor.ui.utils.showMsg(msg);
			$.jstree.rollback(data.rlbk);
		}// No node reference, there for the moved node is the onlyone in the container. No matter its position. 
		
	},
	/**
	 * Call back trigger when a node is deleted
	 * @param e
	 * @param data
	 */
	_callback_node_deleted_jstree : function (e,data) {
		var node = data.rslt.obj;
		var cfgNode = $(node).data(this.objectCfgkey);
		var type = cfgNode["#superType"][0]+"s";
		var where = this.options.data[type];
		var idx = $.inArray(cfgNode,where);
		if(idx >= 0 ){
			where.splice(idx,1);
		} else {
			descartes.editor.ui.utils.showMsg(t('Configuration not found in [@where]',{'@where':where,}));
		}
		
	},
	
	/* 
	 * **********************************************************************
	 * *                              My Functions                         *
	 * **********************************************************************
	 */
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
			value.unshift('auxiliar'); // Agregamod que todos son subtipos de auxiliar
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
	 */
	_callback_showCode: function(){
		var descCfg = this.options.data;
		 
		var babel = this.options.babel;
		var tmpKeys = ['auxiliars'];
		cfgDialog = {};
		console.log(this.options.data);
		try{
		for ( var i = 0; i < tmpKeys.length; i++) {
			var currKey = tmpKeys[i];
			var title = babel.t(currKey);
			console.log("Scando la configuracion : "+currKey);
			var tmpStr = descCfg.sceneCfgObjectsToString(currKey);
			cfgDialog[title] = "<textarea wrap='off'>"+tmpStr+"</textarea>"; 
			console.log("Como van los paneles : "+cfgDialog);
		}
		}catch(e){
			console.log(e);
			return;
		}
		
		
		//TODO falta implementar si es que se cambia algo en la configuración manualmente
		var funcOk 		= $.proxy(function(cfgDialog){console.log("Ok",cfgDialog);});
		var funcCancel 	= $.proxy(function(cfgDialog){console.log('Cancel',cfgDialog);});
		
		descartes.editor.ui.utils.showTabbedDialogForm(cfgDialog,funcOk,funcCancel,550,350,babel);
	},
	
	/**
	 * This method need to overwrite 
	 * @param typeToInst
	 */
	_create_new_object_aux : function(typeToInst, originalData){
		var t = $.proxy(this.options.babel.t,this.options.babel);
		var where = originalData[typeToInst[0]+"s"];
		var cfgProtoObj = {};
		
		try{ cfgProtoObj = descartes.editor.ui_config.getBindingCfgFor(typeToInst,this.options.data); } catch(e){ console.log(e);	}
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
	 * 
	 */
	_add_newobject_to_tree : function(cfgNewObject,where,originalData){
		var cfgObj = cfgNewObject;
		var typeToInst = cfgObj['#superType'].slice(1);
		var suffix = (where.length > 0)?"_"+where.length:'';
		cfgObj.id = typeToInst.join("_")+suffix;
		if(typeToInst == 'function'){
			cfgObj.id += '(x)';
		}
		
		var jstreeRef = this.list.data('jstree');
		var selectedNode = jstreeRef.get_selected();
		var idxDest = -1;
		
		if(selectedNode.length > 0){
			selectedNode = selectedNode[0];
			var tmpCfgObj = $(selectedNode).data(this.objectCfgkey);
			idxDest = $.inArray(tmpCfgObj,where);
			var typeTmpCfg = tmpCfgObj['#superType'][1];
			if(typeTmpCfg != typeToInst){
				selectedNode = null;
				idxDest = -1;
			}
		} else {
			selectedNode = null;	
		}
		
		
		
		if(selectedNode == null){
			var myTreeContainer = jstreeRef.get_container();
	        var roots = myTreeContainer.find(" > ul > li");
			roots.each(function(idx,element){
				var type = $(element).data('type');
				console.log("buscando en :",element,typeToInst,type);
				if(type == typeToInst){
					selectedNode = element;
					return false;
				}
			});
			
		}
		
		
		var res = null;
		var json = this._formatObjectDataToJSTree(cfgObj);
		var sPos = 'last';
		if(idxDest < 0){
			where.push(cfgObj);
		} else {
			where.splice(idxDest+1,0,cfgObj);
			sPos = 'after';
		}
		res = jstreeRef.create(selectedNode,sPos,json,$.noop,true);
		jstreeRef.select_node(res,true);
		return true;
		
	},
	/* 
	 * **********************************************************************
	 * *                         Auxiliar Functions                         *
	 * **********************************************************************
	 */
	
	/**
	 * Move the selected item one position up or down. This method dont che if is a valida moved, check 
	 * check_move method.  
	 * @param toUp if the move is to up. Default is false
	 */
	_aux_moveNodeUpOrDown : function(toUp){
		var treeFun,insertWhere,insertWhereOp,errorMsg1;
		if(toUp){
			treeFun			= '_get_prev';
			insertWhere		= 'before';
			errorMsg1		= 'Its the first item';
		} else {
			treeFun 		= '_get_next';
			insertWhere 	= 'after';
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
		var next = jstreeRef[treeFun](selectedNode);
		if(next == false || next.length <= 0){ // No prev node. Could be a root, search for prev root 
			descartes.editor.ui.utils.showMsg(errorMsg1);
			return;
		}
		
		next = next[0];
		var nextCfg = $(next).data(this.objectCfgkey);
		if(!nextCfg){ // Its a container
			descartes.editor.ui.utils.showMsg(errorMsg1);
			return;
		}
		jstreeRef.move_node(selectedNode,next,insertWhere);
		jstreeRef.clean_node(-1);
		
		console.log(
				"\nSelected : ",selectedNode,selCfg,
				"\nnext : ",next,nextCfg,
				""
				);
				
	},
	/**
	 * 
	 * @returns
	 */
	_get_objects_type_list: function() {
		var res = descartes.editor.ui_config.utils.getObjectTypeTree();
		// We don't wanna auxiliars in this list
		delete res.control;
		delete res.space;
		delete res.graphic;
		delete res.auxiliar.algorithm;
		return res.auxiliar;  
	},
	
	/**
	 * 
	 * @param descCfgData
	 * @returns
	 */
	_formatDataToJSTree: function(descCfgData){
		var spaces = descartes.editor.ui.utils.getSecuredValue(descCfgData,'spaces');
		if(spaces == false){
			return {};
		}
		var t = $.proxy(this.options.babel.t,this.options.babel);
		var exampleData = [];
		var tmpObjects	= {};
		/*
		 * Controls y graphics
		 */
		var tmpSetCfg = descartes.editor.ui.utils.getSecuredValue(descCfgData, 'auxiliars');
		for ( var i = 0; i < tmpSetCfg.length; i++) {
			var objCfg = tmpSetCfg[i];
			var treeObj = this._formatObjectDataToJSTree(objCfg);
			var sType = objCfg['#superType']; 
			var typeId = sType[1];
			
			if(!tmpObjects[typeId]){ 
				var label = t(typeId);
				var treeObjCont = {
						data		: { title:label, icon:'auxiliar-'+typeId+'-container', attr : {title:label}},
						metadata 	: { type : typeId },
						children 	: [],
				};
				tmpObjects[typeId] = treeObjCont;
				exampleData.push(tmpObjects[typeId]);
			}
			tmpObjects[typeId].children.push(treeObj);
		}
		
		
		var someError = false;
		if(someError){
			var msg = t("There is objects can't be inserted in any space, check log for more information"); 
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
		
		var oldTop	= cont.scrollTop; 
		cont.scrollTop = top-10;
		
	},
});

 
}( jQuery ) );
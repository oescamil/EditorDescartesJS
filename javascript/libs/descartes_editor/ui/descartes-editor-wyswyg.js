 var descartes = (function(descartes){
	descartes.editor = (descartes.editor || {});
	
	descartes.editor.WYSIWYG = function(){
		this.appContainerDom = null ;
		this.descConfig = null;
		this.app = null;
	};
	var protoWYSIWYG = descartes.editor.WYSIWYG.prototype;
	
	
	protoWYSIWYG.createDivDragForControl = function(descAppControl, descEditorCtrCfg,descEditor){
		var ctrAct = descAppControl;
		var ctrActCfg = descEditorCtrCfg;
		var isNumeric = (ctrAct.type=='numeric'); 
		var divCont = (isNumeric)?ctrAct.containerControl:ctrAct.container;
		if(isNumeric && ctrAct.gui == 'button'){
			divCont = ctrAct.canvas;
		}
		divCont = $(divCont);
		var divWYSWYG = $("<div></div>");
		var newCont = divCont.closest('.DescartesSpace2DContainer');
		var selector = '.WYSWYG_space';
		
		if(newCont.length <= 0){
			selector = '#descartesJS_northRegion,#descartesJS_southRegion,#descartesJS_westRegion,descartesJS_eastRegion';
			newCont = divCont.closest(selector);
		} else {
			newCont = newCont.next(selector);
		}
		
		
		divWYSWYG.appendTo(newCont);
		divWYSWYG.height(divCont.height());
		divWYSWYG.width(divCont.width());
	//	divWYSWYG.css('background-color','rgba(255,0,0,0.5)');
		divWYSWYG.css('z-index','1001');
		divWYSWYG.css('position','absolute');
		divWYSWYG.addClass('WYSWYG_editor');
		divWYSWYG.addClass('WYSWYG_editor_component');
		divWYSWYG.addClass('WYSWYG_control');
		
		ctrAct.editorCont = divCont;
		divWYSWYG[0].toUpdate = ctrAct;
		divWYSWYG[0].cfgToUpdate = ctrActCfg;
		divWYSWYG.position({
			 my: "left top",
			 at: "left top",
			 of: divCont,
		});
		var updateSelectionInEditor = function(event){
			var onEdit = event.data.cfgToUpdate;
			descEditor.setActiveObjCfg(onEdit);
		};
		divWYSWYG.on(
				'mousedown.editorDescartes',
				{'cfgToUpdate':ctrActCfg},
				updateSelectionInEditor
				);
		if(isNumeric && ctrAct.region && ctrAct.region != 'interior'){
			return divWYSWYG;
		}
		var updatePos = function(event, ui){
			var onEdit = event.target.toUpdate;
			var elementAct = $(event.target); 
			var position = elementAct.position();
			newExpAttr = [position.left,position.top,elementAct.width(),elementAct.height()];
			newExpStr = "("+newExpAttr.join(',')+")";
			newExp = onEdit.evaluator.parser.parse(newExpStr);
			onEdit.expresion = newExp;
			onEdit.updatePositionAndSize(); 
			
			
			var cfgAct = event.target.cfgToUpdate;
			cfgAct.expresion = newExpStr; 
			descEditor.updateFormCfg();
		};
		
		divWYSWYG.draggable({
			containment: 'parent',
				drag : updatePos,
				stop : updatePos,
			
		});
		
		if(isNumeric){
			var updateSize = function(event, ui){
				var onEdit = event.target.toUpdate;
				var cfgAct = event.target.cfgToUpdate;
				var elementAct = $(event.target); 
				var position = elementAct.position();
				
				newExpAttr = [onEdit.x,onEdit.y,ui.size.width,ui.size.height];
				newExpStr = "("+newExpAttr.join(',')+")";
				var newExp = onEdit.evaluator.parser.parse(newExpStr);
				onEdit.expresion = newExp;
				onEdit.updatePositionAndSize(); 
				
				cfgAct.expresion = newExpStr; 
				descEditor.updateFormCfg();
			};
			divWYSWYG.resizable({
				alsoResize : divCont,
				containment: "parent",
				resize	: updateSize,
				stop 	: updateSize,
			});	
		}
		return divWYSWYG;
	};
	
	protoWYSIWYG.createDivDragForSpace = function(descAppSp, descEditorSpCfg,editorRef){
		var spCont = $(descAppSp.container);
		
		var divWYSWYG = $("<div></div>");
		divWYSWYG.insertAfter(spCont);
		divWYSWYG.addClass('WYSWYG_editor');
		divWYSWYG.addClass('WYSWYG_editor_component');
		divWYSWYG.addClass('WYSWYG_space');
		divWYSWYG.height(spCont.height());
		divWYSWYG.width(spCont.width());
		//divWYSWYG.css('background-color','rgba(0,0,255,0.5)');
		divWYSWYG.css('z-index','1000');
		divWYSWYG[0].toUpdate = descAppSp;
		divWYSWYG[0].cfgToUpdate = descEditorSpCfg;
		
		var updateSelected = function(event,ui){
			var onEdit = event.target.cfgToUpdate;
			editorRef.setActiveObjCfg(onEdit);
		};
		
		var updatePos = function(event, ui){
			var onEdit = event.target.toUpdate;
		
			/*
			 * Captura de pantalla del spacio 
			 * CTX es el context del canvas que donde voy a dibujar
		space_i = app.spaces[i];

        // draw the content of a 2D space
        if (space_i.type === "R2") {
          ctx.drawImage(space_i.backgroundCanvas, space_i.x, space_i.y);
          ctx.drawImage(space_i.canvas, space_i.x, space_i.y);

          getScreenshotControls(ctx, space_i.container, space_i.ctrs);
        }
			 * 
			 * 
			 */
			var position	= $(event.target).position();
			
			position.left = (position.left-onEdit.displaceRegionWest);
			position.top = (position.top-onEdit.displaceRegionNorth-onEdit.plecaHeight);
			onEdit.xExpr = onEdit.evaluator.parser.parse(''+position.left);
			onEdit.yExpr = onEdit.evaluator.parser.parse(''+position.top);
			onEdit.update(true);
			
			var cfgUpdate	= event.target.cfgToUpdate;
			cfgUpdate['left']	= position.left;
			cfgUpdate['top']	= position.top;
			editorRef.updateFormCfg();
			
		};

		var updateSize = function(event, ui){
			var onEdit = event.target.toUpdate;
			onEdit.w  = ui.size.width;
			onEdit.h  = ui.size.height;
			onEdit.init();
			onEdit.update(true);
			
			var cfgUpdate = event.target.cfgToUpdate;
			cfgUpdate['width'] = ui.size.width;
			cfgUpdate['height'] = ui.size.height;
			editorRef.updateFormCfg();
		};
		
		divWYSWYG.draggable({
			containment	: 'parent',
			start	: updateSelected, 
			drag 	: updatePos,
			stop 	: updatePos,
		}).resizable({
			start	: updateSelected, 
			resize	: updateSize,
			stop 	: updateSize,
		}).position({
			 my: "left top",
			 at: "left top",
			 of: spCont,
		});

		return divWYSWYG;
	};
	
	
	
	protoWYSIWYG.setActive = function(objCfg){
		var strClass = 'activado';
		var compList = this.components;
		var active = $('.WYSWYG_editor.'+strClass,this.appContainerDom);
		if(active.length > 0 ){
			activeAct = active[0];
			if(active.cfgToUpdate == objCfg){
				return;
			} 
			$(active).removeClass(strClass);
		}
		//console.log("El listado ", compList);
		for(var i = 0;i < compList.length; i++){
			var compAct = compList[i];
			var mismo = compAct.cfgToUpdate == objCfg; 
			//console.log("Comparando : ",mismo,objCfg,compAct.cfgToUpdate);
			if(mismo){
				//console.log("Activando");
				$(compAct).addClass(strClass);
				return;
			}
		}
	};
	
	descartes.editor.WYSIWYG.install = function(){
		if(!descartesJS || !descartesJS.loadLib){
			var funct = $.proxy(this.install,this);
			setTimeout(funct,'100');
		}
		var listaALigar = $('.DescartesAppContainer .DescartesSpace2DContainer');
		var descEditor = parent.descartes.editor.instances[0];
		if((listaALigar.length <=0) || (!descEditor)){
			var funct = $.proxy(this.install,this);
			setTimeout(funct,'100');
			return;
		}
		
		
		for(var i = 0; i < descartesJS.apps.length; i++){
			var descApp = descartesJS.apps[i];
			var descEditor = parent.descartes.editor.instances[i];
			var objScenesConfiguration = descEditor.scenesCfg.scenes[i];
			
			
			
			var descWYSWYG = new descartes.editor.WYSIWYG();
			descWYSWYG.appContainerDom = descApp.container ;
			descWYSWYG.descConfig	= objScenesConfiguration;
			descWYSWYG.app			= descApp;
			descWYSWYG.editorRef	= descEditor;
			descWYSWYG.components = [];
			descEditor.wyswyg = descWYSWYG;
			
			var controls = descApp.controls;
			var spaces = descApp.spaces;
			var controlsCfg = objScenesConfiguration.controls;
			var spacesCfg = objScenesConfiguration.spaces;

			/*
			 * *******************************************************************
			 * *Para espacios*
			 * *******************************************************************
			 */
			
			
			for (var i = 0; i < spaces.length;i++ ){
				var spAct		= spaces[i];
				var spActCfg	= spacesCfg[i];
				var component	= descWYSWYG.createDivDragForSpace(spAct,spActCfg,descEditor);
				descWYSWYG.components.push(component[0]);
			}
			
			/*
			 * ***************************************************
			 * PARA CONTROLES
			 * ***************************************************
			 */
			for(var i = 0 ;i < 	controls.length ;i++){
				var ctrAct		= controls[i];
				var ctrActCfg	= controlsCfg[i];
				var component	= descWYSWYG.createDivDragForControl(ctrAct,ctrActCfg,descEditor);
				descWYSWYG.components.push(component[0]);
			}
		}
	};
	
	
	
	var funct = $.proxy(descartes.editor.WYSIWYG.install ,descartes.editor.WYSIWYG);
	setTimeout(funct,'100');
	
	
	return descartes;
})(descartes || {});



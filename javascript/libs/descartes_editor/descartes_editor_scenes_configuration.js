(function(descartes,$){
	
	descartes.editor = (descartes.editor)?descartes.editor:{};
	
	/**
	 * @param htmlString The string content the configuration of scenes
	 */
	descartes.editor.ScenesConfiguration = function(htmlString){
		this.originalString = htmlString;
		this.originalDom = null;
		this.scenes = [];
		this.loadFromString(htmlString);
	};
	
	
	var scenesCfgProto = descartes.editor.ScenesConfiguration.prototype;
	/**
	 * 
	 * @param stringData
	 * @returns SceneConfiguration
	 */
	scenesCfgProto.loadFromString = function(stringData){
		stringData = this._purgeStrOfBadFormatParams(stringData);
		
		var parser = new DOMParser();
		var newDom = parser.parseFromString(stringData,"text/html");
		this.originalDom = newDom; 
		var domScenes = $('applet, ajs',newDom);
		this.scenes = [];
		
		for ( var i = 0; i < domScenes.length; i++) {
			var domScene = domScenes[i];
			var scene = this.loadSceneFromDom(domScene);
			scene.context = this;
			scene.originalDOM = domScene;
			this.scenes.push(scene);
		}
	};
	
	/**
	 *  Load a single scene from a DOM object. 
	 */
	scenesCfgProto.loadSceneFromDom = function(sceneDom){
		var cfgScene = new descartes.editor.SceneConfig();
		cfgScene['global'] = {};
		sceneDom = $(sceneDom);
		var attrToCp = ['width','height','archive','codebase','code',];
		
		for ( var i = 0; i < attrToCp.length; i++) {
			var attrName = attrToCp[i];
			var value = $('<span />').html(sceneDom.attr(attrName)).text();
			cfgScene['global'][attrName] = value;
		}
		
		var sceneGlobalCfg = $('param',sceneDom)
								.not('[name^=E_]')
								.not('[name^=A_]')
								.not('[name^=C_]')
								.not('[name^=G_]')
								.not('[name^=S_]');
		
		for ( var i = 0; i < sceneGlobalCfg.length; i++) {
			var param = $(sceneGlobalCfg[i]);
			var name = param.attr('name');
			var name2 = this.babel[name];
			
			name = (name2) ? name2 : name;
			var value = param.attr('value');
			if($.inArray(name,['pleca','Buttons','Animation']) > -1){
				var tmpTag  = $.parseHTML("<span "+value+">")[0];
				value = {};
				for ( var j = 0; j < tmpTag.attributes.length; j++) {
					this._auxAppendInfoToCfg(value, tmpTag.attributes[j]);
				}
				cfgScene[name] = value;
			} else {
				var value2 = this.babel[value];
				value = (value2)?value2:value;
				cfgScene['global'][name] = value;
			}
		}
		
		cfgScene.spaces		= [];
		cfgScene.controls	= [] ;
		cfgScene.auxiliars	= [];
		cfgScene.program	= {};
		cfgScene.graphics	= [];	
		
		var tmpParse = [];
		tmpParse.push(['spaces',	$('param[name^="E_"]',sceneDom),	['space']			]);
		tmpParse.push(['controls', 	$('param[name^="C_"]',sceneDom),	['control']			]);
		tmpParse.push(['auxiliars',	$('param[name^="A_"]',sceneDom),	['auxiliar']		]);
		tmpParse.push(['graphics',	$('param[name^="G_"]',sceneDom),	['graphic','R2']	]);
		tmpParse.push(['graphics',	$('param[name^="S_"]',sceneDom),	['graphic','R3']	]);

		for(var i = 0; i < tmpParse.length;i++){
			var destCfg = tmpParse[i][0];
			var domCfg  = tmpParse[i][1];
			var supType = tmpParse[i][2];
			
			for ( var j = 0; j < domCfg.length; j++) {
				var objCfg = {};
				var param = $(domCfg[j]);
				var value = param.attr('value');
				var tmpTag  = $.parseHTML("<span "+value+">")[0];
				objCfg['#superType'] = supType.slice();
				
				
				for ( var k = 0; k < tmpTag.attributes.length; k++) {
					this._auxAppendInfoToCfg(objCfg, tmpTag.attributes[k]);
				}
				cfgScene[destCfg].push(objCfg); 	
			}
		}
		
		
		

		this._completeRequiereInfoIfNeed(cfgScene);
		
		//Search for Algorithms (not algorithm functions) to translate into functions and add calls to INIT OR CALCULOS depends in
		//the 'evaluate' attribute.
		var bodys = {init:{idx:1000,prefix:'',suffix:''},calc:{idx:1000,prefix:'',suffix:''}};
		for ( var i = 0; i < cfgScene.auxiliars.length; i++) {
			var auxCfg = cfgScene.auxiliars[i];
			var type = auxCfg['#superType'][1];
			
			if(type == 'algorithm' && !this.isFunction(auxCfg)){
				var idxBody = $.inArray(auxCfg['id'],['INICIO','CALCULOS']);
				if(idxBody > -1){
					var bodyWhere = (idxBody == 0 )?bodys.init:bodys.calc; 
					var whileExpr = (auxCfg['while'])?auxCfg['while']:''; 
					var init = (auxCfg['init'])?auxCfg['init']:'';
					var toFunction = (whileExpr.length > 0) || (init.length > 0);
					var doStr = (auxCfg['do'])?auxCfg['do']:'';
					bodyWhere.idx = i;
					if(!toFunction){
						bodyWhere.suffix = doStr+";"+bodyWhere.suffix;
						cfgScene.auxiliars.splice(i,1); //Delete de ALG, user can only edit 'do' propertie
						i--;
						continue;
					}
				}
				
				auxCfg['id'] = auxCfg['id']+"_alg_"+i+"()";
				var always = (auxCfg['evaluate'])?eval(auxCfg['evaluate'] == 'always'):false;
				var where = (always)?bodys.calc:bodys.init;
				auxCfg['#superType'][1] = 'function';
				if(where.idx > i){
					where.prefix += auxCfg['id']+";";
				} else {
					where.suffix += ";"+auxCfg['id'];
				}
			}
		}
		
		cfgScene.program.initial = bodys.init.prefix+bodys.init.suffix;
		cfgScene.program.calculus = bodys.calc.prefix+bodys.calc.suffix;
		console.log('Como quedo la configuracion leida : ',cfgScene);
		return cfgScene;
	};
	
	/**
	 * Create the html string for save the configuration as applet or ajs element 
	 */
	scenesCfgProto.toString = function(){
		// TODO Implementar el tostring de toda la escena
	};
	
	
	/**
	 * Check if the objCfg define a function. The check process use the id property to find it.
	 */
	scenesCfgProto.isFunction = function(objCfg){
		var regExp = /\s*([a-zA-Z]|_)\w*\s*\(\s*(([a-zA-Z]|_)\w*\s*(,\s*([a-zA-Z]|_)\w*\s*)*)*\)/;
		var objId = objCfg['id'] + '';
		var match = objId .match(regExp);
		return match!=null;
	};
	
	
	/**
	 * There is params names in objects configuration without standar form. 
	 * Example : 
	 * 	fuente puntos = '12';
	 * This method converts to 
	 * 	fuente_puntos = '12'
	 */
	scenesCfgProto._purgeStrOfBadFormatParams = function(strCfgScenes){
		var toAlter = ["fuente puntos","font size","font punts","puntu iturria","source points","fonte puntos","fonte pontos","font_size"];
		for ( var i = 0; i < toAlter.length; i++) {
			var search = toAlter[i];
			var replace = this.t(search);
			search = RegExp.escape(search);
			var regexp = new RegExp(search,"g");
			strCfgScenes = strCfgScenes.replace(regexp,replace);
		}
		return strCfgScenes;
	};
	
	
	/**
	 * Add information of fills omited by have the default value.
	 */
	scenesCfgProto._completeRequiereInfoIfNeed = function(scene){
		var sections = ['spaces','controls','auxiliars','graphics'];
		
		var unamedSpace = false ; 
		var isPropertiIn = function (obj, property){
			return obj.hasOwnProperty(property) && obj[property] && obj[property] != ''; 
		};
		
		for(var i = 0; i < sections.length;i++){
			var destCfg = sections[i];
			var section = scene[destCfg]; 
			var defIdPre = destCfg.substring(0,destCfg.length-1)+"_"; 
			for ( var j = 0; j < section.length; j++) {
				var objCfg = section[j];
				if(!objCfg.hasOwnProperty('id') || objCfg.id.length == 0){
					objCfg.id = defIdPre+j;
					if(destCfg == 'spaces'){
						unamedSpace = objCfg.id;
					}
				}
				// FILL FOR SPACES
				if(destCfg == 'spaces'){
					if(!isPropertiIn(objCfg,'type')){
						objCfg.type = 'R2';
					}
					objCfg['#superType'].push(objCfg.type);
				}
				
				// FILL FOR CONTROLS
				if(destCfg == 'controls'){
					this._completeRequiereInfoIfNeed_aux_Control(objCfg,unamedSpace,scene);
				}
				// FILL FOR CONTROLS
				if(destCfg == 'graphics'){
					this._completeRequiereInfoIfNeed_aux_Graphics(objCfg,unamedSpace,scene);
				}
				// FILL FOR AUXILIARS
				if(destCfg == 'auxiliars'){
					this._completeRequiereInfoIfNeed_aux_Auxiliars(objCfg);
				}
			}
		
		}
	};
	
	/**
	 * Auxiliar function to fill requiered info if needed in objects of type auxiliars
	 * Posible lost value properties : 
	 * 	#superType
	 */
	scenesCfgProto._completeRequiereInfoIfNeed_aux_Auxiliars = function(objCfg){
		var auxType = 'variable';
		var toTest = ['constant','array','matrix','algorithm'];
		var isPropertiIn = function (obj, property){
			return obj.hasOwnProperty(property) && obj[property] && obj[property] != ''; 
		};
		
		for ( var l = 0; l < toTest.length; l++) {
			var pName = toTest[l];
			if(isPropertiIn(objCfg,pName) && objCfg[pName] == 'yes'){
				auxType = pName;
			}
		}
		
		if(!isPropertiIn(objCfg,'id')){
			objCfg['id'] = auxType+"_"+i;
		}
				
		
		if(this.isFunction(objCfg)){
			auxType = 'function';
		}
		objCfg['#superType'].push(auxType);
	};
	/**
	 * Auxiliar function to fill requiered info if needed in graphics object.
	 * Posible lost value properties : 
	 * space, id (sufix of space), type, space
	 */
	scenesCfgProto._completeRequiereInfoIfNeed_aux_Graphics = function(objCfg,unamedSpace){
		var isPropertiIn = function (obj, property){
			return obj.hasOwnProperty(property) && obj[property] && obj[property] != ''; 
		};
		if(!isPropertiIn(objCfg,'type')){
			objCfg.type = 'equation';
		}
		objCfg['#superType'].push(objCfg.type);
	};
	/**
	 * Auxiliar function to fill requiered info if needed in objects of type controls.
	 * Posible lost value properties : 
	 * space, id (sufix of space), type, gui, region and #superType
	 */
	scenesCfgProto._completeRequiereInfoIfNeed_aux_Control = function(objCfg,unamedSpace,scene){
		var spCtrModId = ['Ox','Oy','scale'];
		var isPropertiIn = function (obj, property){
			return obj.hasOwnProperty(property) && obj[property] && obj[property] != ''; 
		};
		
		if(!isPropertiIn(objCfg,'type')){
			objCfg.type = 'numeric';
		}
		var isNumeric = objCfg.type == 'numeric'; 
		if( isNumeric && (!isPropertiIn(objCfg,'gui'))){
			objCfg.gui = 'spinner';
		}
		if(isNumeric){
			addGui = true;
			if(objCfg.region){
				if(objCfg.region == 'interior'){
					var spaces = scene['spaces'];
					var firstSp = spaces[0];
					if(!objCfg.space){
						objCfg.space = firstSp.id;
					} else {
						var notFound = true;
						for ( var i = 0; i < spaces.length; i++) {
							var spaceT = spaces[i];
							if(objCfg.space == spaceT.id){
								notFound = false;
								break;
							}
						}
						if(notFound){
							objCfg.space = firstSp.id;
						}
					}
				} 
			} else {
				objCfg.region = 'south';
				objCfg.space = false;
			}
		}
		
		if(!isPropertiIn(objCfg,'id')){
			objCfg.id = objCfg.type;
			if(isNumeric){
				objCfg.id += "_"+objCfg.gui;
			}
			objCfg.id += "_"+j;
		}
								
		if(unamedSpace !== false && spCtrModId.indexOf(objCfg.id) >=0 ){
			objCfg.id = unamedSpace+"."+objCfg.id;
		}
		objCfg['#superType'].push(objCfg.type);
		if(isPropertiIn(objCfg,'gui')){
			objCfg['#superType'].push(objCfg.gui);
		}
	
	};
	
	/**
	 * 
	 */
	scenesCfgProto.getContolType = function(cfgControl){
		
	};
	/**
	 * There is params names in objects configuration without standar form. To legacy, 
	 * change the more standar form to old version. 
	 * Example : 
	 * 	fuente_puntos = '12'
	 * This method converts to 
	 * 	fuente puntos = '12';
	 */
	scenesCfgProto._returnBadFormatParams = function(strCfgScenes){
		return strCfgScenes;
	};
	/**
	 * Extract the info from a auxiliar span. The span was generated using value attribute
	 * from a param tag:
	 * 	<param name='' value='[cfg] '> => <spam [cfg]>
 	 */
	scenesCfgProto._auxAppendInfoToCfg = function(cfgObjToAppend, domAttribute){
		var attr		= domAttribute;
		var toPutIn		= cfgObjToAppend;
		var attrName	= this.t(attr.name);
		var valueInn	= this.t(attr.value.decodeHTML(),true);
		var superType 	= cfgObjToAppend['#superType'];
		var isSpace 	= (superType) && (superType[0] == 'space');
		
		if(attrName.indexOf('.') > 0 && (!isSpace) && ($.inArray(attrName.toLowerCase(),['o.x','o.y']) == -1)){
			var attrsTree = attrName.split('.');
			var tmpObj = toPutIn;
			var l = 0;
			for ( l = 0; l < attrsTree.length-1; l++) {
				var attrActName = this.t(attrsTree[l]);
				if(!tmpObj.hasOwnProperty(attrActName)){
					tmpObj[attrActName] = {};
				} else if(typeof(tmpObj[attrActName]) === 'string'){
					tmpObj[attrActName] = {value:tmpObj[attrActName] };
				} 
				tmpObj = tmpObj[attrActName];
			}
			attrName = this.t(attrsTree[l]);
			toPutIn = tmpObj;
		}
		attrName = this.t(attrName);
		if(toPutIn.hasOwnProperty(attrName) &&  $.isPlainObject(toPutIn[attrName])){
			toPutIn[attrName].value = valueInn;
		} else {
			toPutIn[attrName] = valueInn; 
		}
	};
	
	/**
	 * Auxiliar function to translate strings from configuration
	 */
	scenesCfgProto.t = function(strToTranslate,isParamVal)
	{
		if(isParamVal){
			var isColour = strToTranslate == 'red';
			strToTranslate = (isColour)?'rojo':strToTranslate;
		}
		
		var res = this.babel[strToTranslate];
		return (res)?res:strToTranslate;
	};

	
	
	descartes.editor.SceneConfig = function(){
		this.global	= {
			width		: 0,
			height		: 0,
			archive		: '',
			codebase	: '',
			code		: '',
		};
		this.Animation 	= [];
		this.global	= [];
		this.Buttons 	= [];	
		this.spaces 	= [];	
		this.controls	= []; 
		this.auxiliars	= [];
		this.graphics	= [];	
	};
	
	var sceneCfgProto = descartes.editor.SceneConfig.prototype;
	
	
	/**
	 * @param type one of ['spaces','controls','auxiliars','graphics']
	 * @param id
	 */
	sceneCfgProto.getObjectById = function(type,id){
		var res = [];
		if(!this.hasOwnProperty(type) || !$.isArray(this[type]))
			return res;
		var toSearch = this[type];
		for ( var i = 0; i < toSearch.length; i++) {
			var obj = toSearch[i];
			if(obj.id == id){
				res.push(obj);
			}
		}
	};
	
	
	/**
	 * 
	 */
	sceneCfgProto.getSpaceById = function(id){
		return this.getObjectById('spaces', id);
	};
	
	/**
	 * 
	 */
	sceneCfgProto.getControlById = function(id){
		return this.getObjectById('controls', id);
	};
	
	/**
	 * 
	 */
	sceneCfgProto.getGraphicById = function(id){
		return this.getObjectById('graphics', id);
	};
	
	
	/**
	 * @param forObjecsCfg one of [controls, graphics, spaces, auxiliars, ... etc]
	 */
	sceneCfgProto.sceneCfgObjectsToString = function(forObjecsCfg){
		var whatToString = this[forObjecsCfg];
		var result = '';
		for(var i= 0 ; i < whatToString.length ; i++){
			var currCfg = whatToString[i];
			var currCfgStr = this.sceneCfgObjectToStringAux(currCfg);
			if(currCfgStr.length > 0)
				result += currCfgStr+"\n"; 
		}
		return result;
	};
	/**
	 * 
	 */
	sceneCfgProto.sceneCfgObjectToStringAux = function(cfgObject){
		var cfgMeta = descartes.editor.ui_config;
		var currCfg = $.extend({},cfgObject);
		var currType = currCfg['#superType'];
		var currMetaCfg = {};
		try{
			currMetaCfg = cfgMeta.getBindingCfgFor(currType);
		} catch(e){
			//console.warn("No se pudo obtener la configuración para :",currType);
		}
		var currCfgStr = '';
		
		var CfgForKeys = $.extend(currCfg,currMetaCfg);		
		
		// We need get the keys in the order within cfgMeta
		// Plus que extract object an serialize the params, for example in family, parameter in controls, etc.
		var arraySortKeys = {};
		for (var key2 in CfgForKeys) {
			var key = key2;
			if(!currCfg.hasOwnProperty(key))
				continue;
			var value = currCfg[key];
			if(key == 'family'){ // family='t' t.steps = '0' t.interval = '[0,2]';
				arraySortKeys[key] = value;
				
				key		= value; 
				value	= currCfg[key];
			}
			
			if($.isPlainObject(value)){
				var tmpObj = value;
				for (var keyInt in tmpObj) { // Just have 1 level of nested
					var valInt = tmpObj[keyInt];
					var newKey = key+((keyInt == 'value')?'':"."+keyInt);
					arraySortKeys[newKey] = valInt;
				}
			} else {
				arraySortKeys[key] = value;
			}
		}
		
		for (var propName in arraySortKeys) {
			if(propName.indexOf('#') == 0){
				continue;
			}
			var value 			= $.trim(arraySortKeys[propName]);
			var metaFieldCfg	= currMetaCfg[propName];
			
			metaVal 			= (metaFieldCfg && metaFieldCfg.hasOwnProperty('value'))?metaFieldCfg.value:'';
			var forceVal 		= (metaFieldCfg && metaFieldCfg.hasOwnProperty('forcevalue'))?metaFieldCfg.forcevalue:false;
			
			if(value.length <= 0 && forceVal )
				value = metaVal;
			if(value.length < 1 || metaVal == value)
				continue;
			
			var valueEncode = value.encodeHTML();
			currCfgStr = propName+"='"+valueEncode+"' "+currCfgStr; 
			
		}
		currCfgStr = $.trim(currCfgStr);
		return currCfgStr;
	};
	
	/**
	 * 
	 */
	sceneCfgProto.sceneCfgObjectsToHtmlString = function(){
		var rootTag = 'ajs';
		rootTag = 'applet';
		var root = $("<"+rootTag+">");
		
		var attrToCp = ['width','height','archive','codebase','code','name','archive'];
		var globalCfg = this['global'];
		globalCfg.size = globalCfg.width+'x'+globalCfg.height;
		globalCfg.Version = descartes.editor.EditorDescartes['version'];
		globalCfg.Language = 'english';
		
		delete globalCfg.language; // Its casesensitive in the Descartes Editor JAVA  
		delete globalCfg.version; 
		for (var attr in globalCfg) {
			var attrVal = globalCfg[attr];
			if(!attrVal ){
				console.log("No hay "+attr+" en la configuracion");
				continue;
			}
			attrVal = attrVal.encodeHTML();
			if($.inArray(attr,attrToCp) > -1){
				root.attr(attr,attrVal);
			} else {
				var newP = {
						'value':attrVal,
						'name':attr,
						};
				newP = $("<param>",newP);
				newP.appendTo(root);
			}
		}
		
		var cfgGen2 = {'pleca':this.pleca, 'Buttons':this.Buttons, 'Animation':this.Animation};
		for (var attrName in cfgGen2) {
			var cfgObj = cfgGen2[attrName];
			if(!cfgObj ){
				console.log("No hay "+attrName+" en la configuracion");
				continue;
			}
			var attrVal = this.sceneCfgObjectToStringAux(cfgObj);
			if(attrVal.length < 0 )
				continue;
			var newP = {
					'value':attrVal,
					'name':attrName,
					};
			newP = $("<param>",newP);
			newP.appendTo(root);
		}
		
		//Rearrange the auxiliars
		var tmpAuxiliars = this.auxiliars.slice();
		tmpAuxiliars.push({'id':'CALCULOS',	'do':this.program.calculus,	'algorithm':'true','evaluate':'always'});
		tmpAuxiliars.push({'id':'INICIO',	'do':this.program.initial,	'algorithm':'true','evaluate':'only-once'});
		
		//Rearrange the graphics
		var tmpG2 = [];
		var tmpG3 = [];
		for ( var i = 0, cfgObj; cfgObj = this.graphics[i]; i++) {
			var spaceType = cfgObj['#superType'][1];
			if(spaceType == 'R3'){
				tmpG3.push(cfgObj);
			}else {
				tmpG2.push(cfgObj);
			}
		}
		
		var cfgToString = {
				'spaces'		: {'pre':'E_', 'cfg':this.spaces},
				'controls'		: {'pre':'C_', 'cfg':this.controls},
				'auxiliars'		: {'pre':'A_', 'cfg':tmpAuxiliars},
				'graphics'		: {'pre':'G_', 'cfg':tmpG2},
				'graphics3D'	: {'pre':'S_', 'cfg':tmpG3},
		};
		
		for (var attrName in cfgToString) {
			var listCfgObj = cfgToString[attrName];
			var nDig = (listCfgObj.length+"").length;
			for ( var i = 0, cfgObj; cfgObj = listCfgObj.cfg[i];i++) {
				var attrVal = this.sceneCfgObjectToStringAux(cfgObj);
				var objIdx = ((i+1)+'').lpad('0',2);
				var newP = {
						'value':attrVal,
						'name':listCfgObj.pre+objIdx,
						};
				newP = $("<param>",newP);
				newP.appendTo(root);
			}
		}
		
		//console.log("Vamos a regresar :",root);
		return root[0].outerHTML;
	};
	
	
	
	/**
	 * 
	 * FROM DESCARTES INTERPRETER babel.js
	 */
	scenesCfgProto.babel = (function(){
		var babel = {};
			 
		//babel["espa\u00F1ol"] = babel["english"] = babel["catal\u00E0"] = babel["euskera"] = babel["fran\u00E7ais"] = babel["galego"] = babel["portugu\u00EAs"] = babel["valenci\u00E0"] = "";
		babel["falso"] = babel["false"] = babel["fals"] = babel["gezurra"] = babel["faux"] = babel["fals"] = "false";
		babel["verdadero"] = babel["true"] = babel["veritable"] = babel["egia"] = babel["vrai"] = babel["verdadeiro"] = babel["veritable"] = "true";
		babel["no"] = babel["ez"] = babel["non"] = babel["n\u00E3o"] = "no";
		babel["s\u00ED"] = babel["yes"] = babel["bai"] = babel["oui"] = babel["si"] = babel["sim "] = "yes";
		babel["negro"] = babel["black"] = babel["negre"] = babel["beltza"] = babel["noir"] = babel["preto"] = "000000";
		babel["maxenta"] = babel["magenta"] = "ff00ff";
		babel["azul"] = babel["blue"] = babel["blau"] = babel["urdina"] = babel["bleu"] = "0000ff";
		babel["turquesa"] = babel["cyan"] = babel["turkesa"] = babel["turquoise"] = "00ffff";
		babel["verde"] = babel["green"] = babel["verd"] = babel["berdea"] = babel["vert"] = "00ff00";
		babel["amarillo"] = babel["yellow"] = babel["groc"] = babel["horia"] = babel["jaune"] = babel["amarelo"] = "ffff00";
		babel["naranja"] = babel["orange"] = babel["taronja"] = babel["laranja"] = babel["laranxa"] = "ffc800";
		babel["rojo"] = babel["red"] = babel["vermell"] = babel["gorria"] = babel["rouge"] = babel["vermello"] = babel["vermelho"] = "ff0000";
		babel["pink"] = babel["rosa"] = babel["arrosa"] = babel["rose"] = "ffafaf";
		babel["grisObscuro"] = babel["darkGray"] = babel["grisFosc"] = babel["gris iluna"] = babel["grisObscur"] = babel["grisEscuro"] = babel["cinzaEscuro"] = "404040";
		babel["gris"] = babel["gray"] = babel["grisa"] = babel["cinza"] = "808080";
		babel["grisClaro"] = babel["lightGray"] = babel["grisClar"] = babel["gris argia"] = babel["grisClair"] = babel["cinzaClaro"] = "c0c0c0";
		babel["blanco"] = babel["white"] = babel["blanc"] = babel["zuria"] = babel["branco"] = "ffffff";
		babel["escala"] = babel["scale"] = babel["eskala"] = babel["\u00E9chelle"] = "scale";
			//  babel["Se puede copiar este texto y pegarlo en una p\u00E1gina Web."] = babel["You may copy this text and paste it on a Web page."] = babel["Podeu copiar aquest text i enganxar-lo en una p\u00E0gina web."] = babel["Testu hau kopia dezakezu eta web orri batean itsasi."] = babel["Vous pouvez copier ce texte et l'accrocher en une page web."] = babel["Pode copiar este texto e pegalo nunha p\u00E1xina Web."] = babel["Voc\u00EA pode copiar este texto e col\u00E1-lo em uma p\u00E1gina WEB."] = babel["Podeu copiar aquest text i enganxar-lo en una p\u00E0gina web."] = "";
		babel["nombre"] = babel["name"] = babel["nom"] = babel["izena"] = babel["nome"] = "name";
			//  babel["editable"] = babel["editable"] = babel["editable"] = babel["editagarria"] = babel["editable"] = babel["editable"] = babel["modific\u00E1vel"] = babel["editable"] = "";
		babel["ikusgai"] = babel["vis\u00EDvel"] = babel["visible"] = "visible";
		babel["rastro"] = babel["trace"] = babel["rastre"] = babel["arrastoa"] = "trace";
			//   babel["control"] = babel["control"] = babel["control"] = babel["kontrola"] = babel["contr\u00F4le"] = babel["control"] = babel["controle"] = babel["control"] = "";
		babel["fondo"] = babel["background"] = babel["fons"] = babel["hondoa"] = babel["fond"] = babel["fundo"] = "background";
		babel["colour"] = babel["color"] = babel["kolorea"] = babel["couleur"] = babel["cor"] = "color";
		babel["par\u00E1metro"] = babel["parameter"] = babel["parametroa"] = babel["par\u00E2metro"] = babel["par\u00E0metre"] = "parameter";
		babel["sucesi\u00F3n"] = babel["sequence"] = babel["successi\u00F3"] = babel["segida"] = babel["succession"] = babel["seq\u00FC\u00EAncia"] = "sequence";
		babel["tama\u00F1o"] = babel["size"] = babel["neurria"] = babel["taille"] = babel["tamanho"] = babel["grand\u00E0ria"] = "size";
		babel["decimales"] = babel["decimals"] = babel["hamartarra"] = babel["d\u00E9cimales"] = babel["decimais"] = "decimals";
		babel["red"] = babel["net"] = babel["xarxa"] = babel["sarea"] = babel["r\u00E9seau"] = babel["rede"] = babel["malha"] = "net";
		babel["red10"] = babel["net10"] = babel["xarxa10"] = babel["sarea10"] = babel["r\u00E9seau10"] = babel["rede10"] = babel["malha10"] = "net10";
		babel["ejes"] = babel["axes"] = babel["eixos"] = babel["ardatzak"] = babel["eixes"] = "axes";
		babel["texto"] = babel["text"] = babel["testua"] = babel["texte"] = "text";
			  //////////////////////////////
			  // configuration buttons
			  //////////////////////////////
		babel["cr\u00E9ditos"] = babel["about"] = babel["cr\u00E8dits"] = babel["kreditoak"] = babel["cr\u00E9dits"] = babel["sobre"] = "about";
		babel["config"] = babel["konfig"] = babel["configura\u00E7\u00E3o"] = "config";
		babel["inicio"] = babel["init"] = babel["inici"] = babel["hasiera"] = babel["commencement"] = babel["in\u00EDcio"] = "init";
		babel["limpiar"] = babel["clear"] = babel["neteja"] = babel["ezabatu"] = babel["nettoye"] = babel["limpar"] = "clear";
			  //////////////////////////////
		babel["incr"] = babel["gehi"] = babel["incremento"] = "incr";
		babel["min"] = babel["inf"] = "min";
		babel["max"] = babel["sup"] = babel["m\u00E1x"] = "max";
		babel["relleno"] = babel["fill"] = babel["ple"] = babel["betea"] = babel["plein"] = babel["recheo"] = babel["preencher"] = "fill";
		babel["relleno+"] = babel["fill+"] = babel["ple+"] = babel["betea+"] = babel["plein+"] = babel["recheo+"] = babel["preencher+"] = "fillP";
		babel["relleno-"] = babel["fill-"] = babel["ple-"] = babel["betea-"] = babel["plein-"] = babel["recheo-"] = babel["preencher-"] = "fillM";
		babel["flecha"] = babel["arrow"] = babel["fletxa"] = babel["gezia"] = babel["fl\u00E8che"] = babel["frecha"] = babel["seta"] = "arrow";
		babel["ancho"] = babel["width"] = babel["ample"] = babel["zabalera"] = babel["large"] = babel["largura"] = "width";
		babel["punta"] = babel["spear"] = babel["muturra"] = babel["pointe"] = babel["ponta"] = "spear";
		babel["regi\u00F3n"] = babel["region"] = babel["regi\u00F3"] = babel["eskualde"] = babel["r\u00E9gion"] = babel["rexi\u00F3n"] = babel["regi\u00E3o"] = "region";
		babel["norte"] = babel["north"] = babel["nord"] = babel["ipar"] = "north";
		babel["sur"] = babel["south"] = babel["sud"] = babel["hego"] = babel["sul"] = "south";
		babel["este"] = babel["east"] = babel["est"] = babel["ekialde"] = babel["leste"] = "east";
		babel["oeste"] = babel["west"] = babel["oest"] = babel["hegoalde"] = babel["ouest"] = "west";
		babel["exterior"] = babel["external"] = babel["kanpoalde"] = babel["externo"] = "external";
		babel["expresi\u00F3n"] = babel["expression"] = babel["expresion"] = babel["expresi\u00F3"] = babel["adierazpen"] = babel["express\u00E3o"] = "expresion";
		babel["tipo"] = babel["type"] = babel["tipus"] = babel["mota"] = "type";
		babel["posici\u00F3n"] = babel["position"] = babel["posici\u00F3"] = babel["posizio"] = babel["posi\u00E7\u00E3o"] = "position";
		babel["constricci\u00F3n"] = babel["constraint"] = babel["constricci\u00F3"] = babel["beharte"] = babel["constriction"] = babel["constrici\u00F3n"] = babel["restri\u00E7\u00E3o"] = "constraint";
			//  babel["infinito"] = babel["infinity"] = babel["infinit"] = babel["infinitu"] = babel["infini"] = babel["infinito"] = babel["infinito"] = babel["infinit"] = "";
		babel["valor"] = babel["value"] = babel["balio"] = babel["valeur"] = "value";
		babel["ecuaci\u00F3n"] = babel["equation"] = babel["equaci\u00F3"] = babel["ekuazio"] = babel["\u00E9quation"] = babel["equa\u00E7\u00E3o"] = "equation";
		babel["curva"] = babel["curve"] = babel["corba"] = babel["kurba"] = babel["courbe"] = "curve";
		babel["texto"] = babel["text"] = babel["testu"] = babel["texte"] = "text";
		babel["punto"] = babel["point"] = babel["punt"] = babel["puntu"] = babel["ponto"] = "point";
		babel["segmento"] = babel["segment"] = babel["zuzenki"] = "segment";
		babel["arco"] = babel["arc"] = babel["arku"] = "arc";
		babel["pol\u00EDgono"] = babel["polygon"] = babel["pol\u00EDgon"] = babel["poligono"] = babel["polygone"] = "polygon";
		babel["imagen"] = babel["image"] = babel["imatge"] = babel["irudi"] = babel["imaxe"] = babel["imagem"] = "image";
		babel["Versi\u00F3n"] = babel["Version"] = babel["Versi\u00F3"] = babel["Vers\u00E3o"] = "version";
		babel["Idioma"] = babel["Language"] = babel["Hizkuntza"] = babel["Langue"] = "language";
			//  babel["Espacio"] = babel["Space"] = babel["Espai"] = babel["Espazioa"] = babel["Espace"] = babel["Espazo"] = babel["Espa\u00E7o"] = babel["Espai"] = "";
		babel["O.x"] = babel["o.x"] = "O.x";
		babel["O.y"] = babel["o.y"] = "O.y";
			//  babel["Controles"] = babel["Controls"] = babel["Controls"] = babel["Kontrolak"] = babel["Contr\u00F4les"] = babel["Controis"] = babel["Controles"] = babel["Controls"] = "";
			//  babel["Auxiliares"] = babel["Auxiliaries"] = babel["Auxiliars"] = babel["Laguntzaile"] = babel["Auxiliaires"] = babel["Auxiliares"] = babel["Auxiliares"] = babel["Auxiliars"] = "";
			//  babel["Gr\u00E1ficos"] = babel["Graphics"] = babel["Gr\u00E0fics"] = babel["Grafikoak"] = babel["Graphiques"] = babel["Gr\u00E1ficos"] = babel["Gr\u00E1ficos"] = babel["Gr\u00E0fics"] = "";
		babel["Botones"] = babel["Buttons"] = babel["Botons"] = babel["Botoiak"] = babel["Boutons"] = babel["Bot\u00F3ns"] = babel["Bot\u00F5es"] = babel["Botons"] = "Buttons";
		babel["Animaci\u00F3n"] = babel["Animation"] = babel["Animaci\u00F3"] = babel["Animazio"] = babel["Anima\u00E7\u00E3o"] = "Animation";
		babel["constante"] = babel["constant"] = babel["Konstante"] = "constant";
			//  babel["original"] = babel["original"] = babel["original"] = babel["jatorrizkoa"] = babel["original"] = babel["orixinal"] = babel["original"] = babel["original"] = "";
			//  babel["nueva"] = babel["new"] = babel["nova"] = babel["berria"] = babel["nouvelle"] = babel["novo"] = babel["novo"] = babel["nova"] = "";
			//  babel["aplicar"] = babel["apply"] = babel["aplica"] = babel["ezarri"] = babel["appliquer"] = babel["aplicar"] = babel["aplicar"] = babel["aplica"] = "";
			//  babel["cerrar"] = babel["close"] = babel["tanca"] = babel["itxi"] = babel["fermer"] = babel["pechar"] = babel["fechar"] = babel["tanca"] = "";
			//  babel["cancelar"] = babel["cancel"] = babel["anulÂ·la"] = babel["baliogabetu"] = babel["annuler"] = babel["cancelar"] = babel["cancelar"] = babel["anulÂ·la"] = "";
			//  babel["aceptar"] = babel["ok"] = babel["accepta"] = babel["onartu"] = babel["accepter"] = babel["aceptar"] = babel["ok"] = babel["accepta"] = "";
			//  babel["agregar"] = babel["add"] = babel["afegeix"] = babel["erantsi"] = babel["ajouter"] = babel["engadir"] = babel["acrescentar"] = babel["afegeix"] = "";
			//  babel["insertar"] = babel["insert"] = babel["insereix"] = babel["tartekatu"] = babel["ins\u00E9rer"] = babel["inserir"] = babel["inserir"] = babel["insereix"] = "";
			//  babel["eliminar"] = babel["delete"] = babel["elimina"] = babel["kendu"] = babel["\u00E9liminer"] = babel["eliminar"] = babel["apagar"] = babel["elimina"] = "";
			//  babel["arriba"] = babel["up"] = babel["amunt"] = babel["gora"] = babel["en haut"] = babel["arriba"] = babel["acima"] = babel["amunt"] = "";
			//  babel["abajo"] = babel["down"] = babel["avall"] = babel["behera"] = babel["en bas"] = babel["abaixo"] = babel["abaixo"] = babel["avall"] = "";
			//  babel["renombrar"] = babel["rename"] = babel["reanomenar"] = babel["berrizendatu"] = babel["r\u00E9appeler"] = babel["renomear"] = babel["renomear"] = babel["reanomenar"] = "";
			//  babel["auxiliar"] = babel["auxiliary"] = babel["auxiliar"] = babel["laguntzaile"] = babel["auxiliaire"] = babel["auxiliar"] = babel["auxiliar"] = babel["auxiliar"] = "";
		babel["fuente"] = babel["font"] = babel["iturri"] = babel["source"] = babel["fonte"] = "font";
			//  babel["deshacer"] = babel["undo"] = babel["desf\u00E9s"] = babel["desegin"] = babel["d\u00E9faire"] = babel["desfacer"] = babel["desfazer"] = babel["desf\u00E9s"] = "";
			//  babel["rehacer"] = babel["redo"] = babel["ref\u00E9s"] = babel["berregin"] = babel["refaire"] = babel["refacer"] = babel["refazer"] = babel["ref\u00E9s"] = "";
		babel["num\u00E9rico"] = babel["numeric"] = babel["num\u00E8ric"] = babel["zenbakizko"] = babel['numérico'] = babel["num\u00E9rique"] = "numeric";
		babel["gr\u00E1fico"] = babel["graphic"] = babel["gr\u00E0fic"] = babel["grafiko"] = babel["graphique"] = "graphic";
		babel["texto"] = babel["text"] = babel["testu"] = babel["texte"] = "text";
			//  babel["pos"] = babel["pos"] = babel["pos"] = babel["pos"] = babel["pos"] = babel["pos"] = babel["pos"] = babel["pos"] = "";
		babel["inicio"] = babel["init"] = babel["inici"] = babel["hasiera"] = babel["commencement"] = babel["in\u00EDcio"] = "init";
		babel["hacer"] = babel["do"] = babel["fer"] = babel["egin"] = babel["faire"] = babel["facer"] = babel["fazer"] = "do";
		babel["mientras"] = babel["while"] = babel["mentre"] = babel["bitartean"] = babel["tandis que"] = babel["mentres"] = babel["enquanto"] = "while";
		babel["evaluar"] = babel["evaluate"] = babel["avalua"] = babel["ebaluatu"] = babel["\u00E9valuer"] = babel["avaliar"] = "evaluate";
		babel["variable"] = babel["aldagaia"] = babel["vari\u00E1vel"] = "variable";
		babel["funci\u00F3n"] = babel["function"] = babel["funci\u00F3"] = babel["funtzio"] = babel["fonction"] = babel["fun\u00E7\u00E3o"] = "function";
		babel["algoritmo"] = babel["algorithm"] = babel["algorisme"] = babel["algorithme"] = "algorithm";
		babel["vector"] = babel["array"] = babel["bektore"] = babel["vecteur"] = babel["matriz"] = "array";
			//  babel["zoom"] = babel["zoom"] = babel["zoom"] = babel["zoom"] = babel["zoom"] = babel["zoom"] = babel["zoom"] = babel["zoom"] = "";
		babel["dibujar-si"] = babel["draw-if"] = babel["marraztu-baldin"] = babel["dessiner-si"] = babel["debuxar-se"] = babel["desenhar-se"] = babel["dibuixa-si"] = "draw-if";
		babel["dominio"] = babel["range"] = babel["domini"] = babel["izate-eremua"] = babel["domain"] = babel["dom\u00EDnio"] = "range";
		babel["pausa"] = babel["delay"] = babel["eten"] = "delay";
			//  babel["detener"] = babel["stop"] = babel["atura"] = babel["geldiarazi"] = babel["arr\u00EAter"] = babel["deter"] = babel["parar"] = babel["atura"] = "";
		babel["eje-x"] = babel["x-axis"] = babel["eix-x"] = babel["x-ardatza"] = babel["axe-x"] = babel["eixe-x"] = babel["eixo-x"] = "x-axis";
		babel["eje-y"] = babel["y-axis"] = babel["eix-y"] = babel["y-ardatza"] = babel["axe-y"] = babel["eixe-y"] = babel["eixo-y"] = "y-axis";
		babel["n\u00FAmeros"] = babel["numbers"] = babel["nombres"] = babel["zenbakiak"] = "numbers";
		babel["exponencial-si"] = babel["exponential-if"] = babel["esponentzial-baldin"] = babel["exponentiel-si"] = babel["exponencial-se"] = "exponentialif";
		babel["familia"] = babel["family"] = babel["fam\u00EDlia"] = babel["famille"] = "family";
		babel["intervalo"] = babel["interval"] = babel["tarte"] = babel["intervalle"] = "interval";
		babel["pasos"] = babel["steps"] = babel["passos"] = babel["pausoak"] = babel["pas"] = "steps";
		babel["centro"] = babel["center"] = babel["centre"] = babel["zentro"] = "center";
		babel["radio"] = babel["radius"] = babel["radi"] = babel["erradio"] = babel["rayon"] = babel["raio"] = "radius";
		babel["fin"] = babel["end"] = babel["fi"] = babel["bukaera"] = babel["fim"] = "end";
		babel["una-sola-vez"] = babel["only-once"] = babel["una-sola-vegada"] = babel["behin-bakarrik"] = babel["une-seule-fois"] = babel["unha-soa-vez"] = babel["apenas-uma-vez"] = "only-once";
		babel["siempre"] = babel["always"] = babel["sempre"] = babel["beti"] = babel["toujours"] = "always";
			//  babel["copiar"] = babel["copy"] = babel["copia"] = babel["kopiatu"] = babel["copier"] = babel["copiar"] = babel["copiar"] = babel["copia"] = "";
			//  babel["pegar"] = babel["paste"] = babel["enganxa"] = babel["itsatsi"] = babel["accrocher"] = babel["pegar"] = babel["colar"] = babel["enganxa"] = "";
		babel["color-int"] = babel["int-colour"] = babel["barruko-kolore"] = babel["couleur-int"] = babel["cor-int"] = "int-colour";
		babel["repetir"] = babel["loop"] = babel["repeteix"] = babel["errepikatu"] = babel["r\u00E9p\u00E9ter"] = "loop";
		babel["controles"] = babel["controls"] = babel["kontrolak"] = babel["contr\u00F4les"] = babel["controis"] = "controls";
			//  babel["c\u00F3digo"] = babel["<applet>"] = babel["</*applet*/>"] = babel["<applet>"] = babel["<applet>"] = babel["c\u00F3digo"] = babel["<applet>"] = babel["<applet>"] = "";
			//  babel["Esta versi\u00F3n no permite editar."] = babel["Runtime only. No editing allowed."] = babel["Nom\u00E9s execuci\u00F3. Aquesta versi\u00F3 no permet l'edici\u00F3"] = babel["Bertsio honek ez du editatzen uzten."] = babel["Seulement ex\u00E9cution. Cette version ne permet pas l'\u00E9dition."] = babel["Esta versi\u00F3n non permite editar."] = babel["Somente para execu\u00E7\u00E3o. N\u00E3o \u00E9 poss\u00EDvel editar o c\u00F3digo."] = babel["Nom\u00E9s execuci\u00F3. Aquesta versi\u00F3 no permet l'edici\u00F3"] = "" ;
		babel["animar"] = babel["animate"] = babel["anima"] = babel["animatu"] = babel["animer"] = "animate";
			//  babel["pausa"] = babel["pause"] = babel["pausa"] = babel["eten"] = babel["pause"] = babel["pausa"] = babel["pausa"] = babel["pausa"] = "";
		babel["auto"] = "auto";
		babel["alto"] = babel["height"] = babel["alt"] = babel["altu"] = babel["haut"] = babel["altura"] = "height";
		
		babel["espacio"] = babel["space"] = babel["espai"] = babel["espazio"] = babel["espace"] = babel["espazo"] = babel["espa\u00E7o"] = "space";
		babel["Nu"] = "Nu";
		babel["Nv"] = "Nv";
		babel["ancho"] = babel["depth"] = babel["amplada"] = babel["zabalera"] = babel["largeur"] = babel["ancho"] = babel["profundidade"] = babel["amplada"] = "width";
		babel["largo"] = babel["length"] = babel["llargada"] = babel["luzera"] = babel["longueur"] = babel["longo"] = babel["comprimento"] = babel["llargada"] = "length";
		babel["alto"] = babel["height"] = babel["al\u00E7ada"] = babel["altu"] = babel["hauteur"] = babel["alto"] = babel["altura"] = babel["al\u00E7ada"] = "height";
		babel["color_reverso"] = babel["backcolor"] = babel["color_revers"] = babel["atzealde kolorea"] = babel["couleur_revers"] = babel["cor_reverso"] = babel["cor_de_fundo"] = "backcolor";
		babel["aristas"] = babel["edges"] = babel["arestes"] = babel["ertzak"] = babel["ar\u00EAtes"] = babel["arestas"] = "edges";
		babel["rotini"] = babel["inirot"] = "inirot";
		babel["posini"] = babel["inipos"] = "inipos";
		babel["tri\u00E1ngulo"] = babel["triangle"] = babel["hirukia"] = babel["tri\u00E2ngulo"] = "triangle";
		babel["cara"] = babel["face"] = babel["aurpegi"] = "face";
		babel["polireg"] = babel["regpoly"] = babel["pol\u00EDgonoRegular"] = "polireg";
		babel["superficie"] = babel["surface"] = babel["superf\u00EDcie"] = babel["azalera"] = "surface";
		babel["cubo"] = babel["cube"] = babel["cub"] = babel["kubo"] = "cube";
		babel["paralelep\u00edpedo"] = babel["box"] = babel["paralÂ·lelep\u00edpede"] = babel["paralelepipedo"] = babel["parall\u00e9l\u00e9pip\u00e8de"] = "box";
		babel["cono"] = babel["cone"] = babel["con"] = babel["kono"] = babel["c\u00f4ne"] = "cone";
		babel["cilindro"] = babel["cylinder"] = babel["cilindre"] = babel["zilindro"] = babel["cylindre"] = "cylinder";
		babel["esfera"] = babel["sphere"] = babel["sph\u00e8re"] = "sphere";
		babel["tetraedro"] = babel["tetrahedron"] = babel["tetraedre"] = babel["t\u00e9tra\u00e8dre"] = "tetrahedron";
		babel["octaedro"] = babel["octahedron="] = babel["octaedre"] = babel["oktaedro"] = babel["octa\u00e8dre"] = "octahedron";
		babel["dodecaedro"] = babel["dodecahedron"] = babel["dodecaedre"] = babel["dodekaedro"] = babel["dod\u00e9ca\u00e8dre"] = "dodecahedron";
		babel["icosaedro"] = babel["icosahedron"] = babel["icosaedre"] = babel["ikosaedro"] = babel["icosa\u00e8dre"] = "icosahedron";
		babel["elipsoide"] = babel["ellipsoid"] = babel["elÂ·lipsoide"] = babel["ellipso\u00efde"] = babel["elips\u00f3ide"] = "ellipsoid";
		babel["macro"] = babel["makro"] = "macro";
		babel["id"] = "id";
		babel["modelo"] = babel["model"] = babel["eredu"] = babel["mod\u00E8le"] = "model";
		babel["color"] = babel["kolore"] = babel["couleur"] = babel["cor"] = "color";
			
		babel["luz"] = babel["light"] = babel["llum"] = babel["argia"] = babel["lumi\u00E8re"] = "light";
		babel["metal"] = babel["metall"] = babel["m\u00E9tal"] = "metal";
		babel["alambre"] = babel["wire"] = babel["filferro"] = babel["alanbre"] = babel["fil de fer"] = babel["arame"] = "wire";
			
		babel["cortar"] = babel["split"] = babel["talla"] = babel["moztu"] = babel["couper"] = babel["dividir"] = "split";
		babel["despliegue"] = babel["render"] = babel["desplegament"] = babel["zabaltze"] = babel["d\u00E8ploiement"] = babel["despregamento"] = babel["processar"] = "render";
		babel["orden"] = babel["sort"] = babel["ordre"] = babel["ordena"] = babel["orde"] = babel["ordenar"] = "sort";
		babel["pintor"] = babel["painter"] = babel["margolari"] = babel["peintre"] = "painter";
		babel["trazado de rayos"] = babel["ray trace"] = babel["tra\u00E7at de raigs"] = babel["izpi trazadura"] = babel["trace de rayons"] = babel["trazado de raios"] = babel["tra\u00E7ado de raios"] = "raytrace";
		babel["imagen"] = babel["bg_image"] = babel["imatge"] = babel["irudia"] = babel["imaxe"] = babel["imagem_de_fundo"] = "image";
		babel["despl_imagen"] = babel["bg_display"] = babel["despl_imatge"] = babel["irudi desplazamendu"] = babel["despl_image"] = babel["despr_imaxe"] = babel["apresenta\u00E7\u00E3o_de_imagem"] = "bg_display";
		babel["arr-izq"] = babel["topleft"] = babel["dalt-esq"] = babel["goi-ezk"] = babel["au-dessus-gau"] = babel["arr-esq"] = babel["acima-esquerda"] = "topleft";
		babel["expand."] = babel["stretch"] = babel["hedatu"] = babel["expandir "] = "stretch";
		babel["mosaico"] = babel["patch"] = babel["mosaic"] = babel["mosaiko"] = babel["mosa\u00EFque"] = "patch";
		babel["centrada"] = babel["center"] = babel["zentratu"] = babel["centr\u00E9e"] = babel["centrado"] = "center";
		babel["archivo"] = babel["file"] = babel["fitxer"] = babel["artxibo"] = babel["fichier"] = babel["arquivo"] = "file";
			//   babel["loc"] = babel["loc"] = babel["lloc"] = babel["lok"] = babel["lieu"] = babel["loc"] = babel["loc"] = babel["lloc"] = "";
			//   babel["rot"] = babel["rot"] = babel["gir"] = babel["rot"] = babel["tour"] = babel["rot"] = babel["rot"] = babel["gir"] = "";
			//   babel["macro"] = babel["macro"] = babel["macro"] = babel["makro"] = babel["macro"] = babel["macro"] = babel["macro"] = babel["macro"] = "";
		babel["tipo_de_macro"] = babel["macro_type"] = babel["tipus_de_macro"] = babel["makro_mota"] = babel["type_de_macro"] = babel["tipo_de_macro"] = babel["tipo_de_macro"] = babel["tipus_de_macro"] = "macro_type";
			//   babel["Poniendo este texto en un archivo <nombre> en el subdirectorio macros/g2d/ se crea la macro <nombre>"] = babel["Puting this text in a file <name> in subdirectory macros/g2d/ creates the macro <name>"] = babel["Posant aquest text en un fitxer <nom> en el subdirectori macros/g2d/ es crea la macro <nom>"] = babel["Artxibo batean testu hau jarriz <izena> macros/g2d/ izeneko azpidirektorioan"] = babel["En mettant ce texte dans un fichier <nom> dans le sous-r\u00E9pertoire macros/g2d/ la macro <nom> est cr\u00E9e "] = babel["Po\u00F1endo este texto nun arquivo <nombre> no subdirectorio macros/g2d/ cr\u00E9ase a macro <nombre>"] = babel["Colocando este texto num arquivo <nome> no subdiret\u00F3rio macros/g2d/ voc\u00EA criar\u00E1 a macro <nome>"] = babel["Posant aquest text en un fitxer <nom> en el subdirectori macros/g2d/ es crea la macro <nom>"] = "";
			//   babel["codigo HTML"] = babel["HTML encoding"] = babel["codi HTML"] = babel[" <izena>duen makroa sortzen da"] = babel["code HTML"] = babel["c\u00F3digo HTML"] = babel["codigo HTML"] = babel["codi HTML"] = "";
		babel["filas_norte"] = babel["rows_north"] = babel["files_nord"] = babel["HTML kodea"] = babel["files_nord"] = babel["filas_norte"] = babel["linhas_norte"] = babel["files_nord"] = "rowsNorth";
		babel["filas_sur"] = babel["rows_south"] = babel["files_sud"] = babel["ipar_lerro"] = babel["files_sud"] = babel["filas_sur"] = babel["linhas_sul"] = babel["files_sud"] = "rowsSouth";
		babel["ancho_este"] = babel["width_east"] = babel["ample_est"] = babel["hego_lerro"] = babel["ample_est"] = babel["ancho_leste"] = babel["largura_leste"] = babel["ample_est"] = "widthEast";
		babel["ancho_oeste"] = babel["width_west"] = babel["ample_oest"] = babel["ekialde_zabalera"] = babel["ample_ouest"] = babel["ancho_oeste"] = babel["largura_oeste"] = babel["ample_oest"] = "widthWest";
		babel["fijo"] = babel["fixed"] = babel["fix"] = babel["hegoalde_zabalera"] = babel["fixe"] = babel["fixo"] = "fixed";
		babel["Reiniciar Animaci\u00F3n"] = babel["Init Animation"] = babel["Reinicia Animaci\u00F3"] = babel["finko"] = babel["Recommencer l'Animation"] = babel["Reiniciar Anima\u00E7\u00E3o"] = "initAnimation";
			//   babel["emergente"] = babel["pop"] = babel["emergent"] = babel["Animazioa bberrabiatu"] = babel["\u00E9mergent"] = babel["emerxente"] = babel["pop"] = babel["emergent"] = "";
			//   babel[" "] = babel[" "] = babel[" "] = babel["azaleratzaile"] = babel[" "] = babel["00:"] = babel["  "] = babel[" "] = "";
			//   babel["="] = babel["="] = babel["="] = babel["="] = babel["="] = babel["="] = babel["="] = babel["="] = "";
		babel["Explicaci\u00F3n"] = babel["Explanation"] = babel["Azalpena"] = babel["Explication"] = babel["Explica\u00E7\u00E3o"] = babel["Explicaci\u00F3"] = "Explanation";
			//   babel["gr\u00E1ficos 3D"] = babel["graphics 3D"] = babel["gr\u00E0fics 3D"] = babel["3d grafikoak"] = babel["graphiques 3D"] = babel["gr\u00E1ficos 3D"] = babel["gr\u00E1ficos 3D"] = babel["gr\u00E0fics 3D"] = "";
			//   babel["?"] = babel["?"] = babel["?"] = babel["?"] = babel["?"] = babel["?"] = babel["?"] = babel["?"] = "";
		babel["tooltip"] = babel["dica"] = "tooltip";
			//   babel["clic derecho"] = babel["right click"] = babel["clic dret"] = babel["lik eskuina"] = babel["clic droit"] = babel["clic dereito"] = babel["clique com o bot\u00E3o direito"] = babel["clic dret"] = "";
		babel["discreto"] = babel["discrete"] = babel["discret"] = babel["diskretu"] = "discrete";
		babel["interfaz"] = babel["gui"] = babel["interf\u00EDcie"] = babel["interfaze"] = babel["interface"] = "gui";
		babel["pulsador"] = babel["spinner"] = babel["polsador"] = babel["pultsadore"] = babel["bouton"] = "spinner";
		babel["campo de texto"] = babel["textfield"] = babel["camp de text"] = babel["testu esarrua"] = babel["champ de texte"] = "textfield";
		babel["men\u00FA"] = babel["choice"] = babel["menu"] = babel["escolha"] = "menu";
		babel["barra"] = babel["scrollbar"] = babel["barre"] = "scrollbar";
		babel["opciones"] = babel["options"] = babel["opcions"] = babel["aukerak"] = babel["opci\u00F3ns"] = babel["op\u00E7\u00F5es"] = "options";
		babel["interior"] = babel["barruko"] = babel["int\u00E9rieur"] = "interior";
		babel["condici\u00F3n"] = babel["condition"] = babel["condici\u00F3"] = babel["baldintza"] = babel["condi\u00E7\u00E3o"] = "condition";
		babel["acci\u00F3n"] = babel["action"] = babel["acci\u00F3"] = babel["ekintza"] = babel["a\u00E7\u00E3o"] = "action";
		babel["evento"] = babel["event"] = babel["esdeveniment"] = babel["gertaera"] = babel["\u00E9v\u00E9nement"] = "event";
		babel["abrir URL"] = babel["open URL"] = babel["obre URL"] = babel["URL zabaldu"] = babel["ouvrir URL"] = "openURL";
		babel["abrir Escena"] = babel["open Scene"] = babel["obre Escena"] = babel["eszena zabaldu"] = babel["ouvrir Escena"] = babel["abrir Cena"] = "openScene";
		babel["bot\u00F3n"] = babel["button"] = babel["bot\u00F3"] = babel["botoi"] = babel["bouton"] = babel["bot\u00E3o"] = "button";
		babel["mensaje"] = babel["message"] = babel["mezua"] = babel["mensaxe"] = babel["mensagem"] = babel["missatge"] = "message";
		babel["alternar"] = babel["alternate"] = babel["alterna"] = babel["txandakatu"] = babel["alterner"] = "alternate";
		babel["ejecuci\u00F3n"] = babel["execution"] = babel["execuci\u00F3"] = babel["gauzatze"] = babel["ex\u00E9cution"] = babel["execuci\u00F3n"] = babel["execu\u00E7\u00E3o"] = "execution";
		babel["calcular"] = babel["calculate"] = babel["calcula"] = babel["kalkulatu"] = babel["calculer"] = "calculate";
			//   babel["s\u00EDmbolo"] = babel["symbol"] = babel["s\u00EDmbol"] = babel["sinbolo"] = babel["symbole"] = babel["s\u00EDmbolo"] = babel["s\u00EDmbolo"] = babel["s\u00EDmbol"] = "";
			//   babel["UNIDAD"] = babel["UNIT"] = babel["UNITAT"] = babel["UNITATE"] = babel["UNIT\u00C9"] = babel["UNIDADE"] = babel["UNIDADE"] = babel["UNITAT"] = "";
			//   babel["CURSO"] = babel["COURSE"] = babel["CURS"] = babel["IKASTAROA"] = babel["COURS"] = babel["CURSO"] = babel["CURSO"] = babel["CURS"] = "";
			//   babel["animado"] = babel["animated"] = babel["animat"] = babel["animatu"] = babel["anim\u00E9"] = babel["animado"] = babel["animado"] = babel["animat"] = "";
			//   babel["frecuencia"] = babel["frequency"] = babel["freq\u00FC\u00E8ncia"] = babel["maiztasun"] = babel["fr\u00E9quence"] = babel["frecuencia"] = babel["freq\u00FC\u00EAncia"] = babel["freq\u00FC\u00E8ncia"] = "";
		babel["coord_abs"] = babel["abs_coord"] = babel["koor_abs"] = "abs_coord";
			//   babel["Editor de F\u00F3rmulas"] = babel["Formula Editor"] = babel["Editor de F\u00F2rmules"] = babel["Formula-editore"] = babel["\u00C9diteur de Formules"] = babel["Editor de F\u00F3rmulas"] = babel["Editor de F\u00F3rmulas"] = babel["Editor de F\u00F2rmules"] = "";
			//   babel["Editor de Textos"] = babel["Text Editor"] = babel["Editor de Textos"] = babel["Testu-editore"] = babel["\u00C9diteur de Textes"] = babel["Editor de Textos"] = babel["Editor de Textos"] = babel["Editor de Textos"] = "";
			//   babel["s\u00EDmbolos"] = babel["symbols"] = babel["s\u00EDmbols"] = babel["sinboloak"] = babel["symboles"] = babel["s\u00EDmbolos"] = babel["s\u00EDmbolos"] = babel["s\u00EDmbols"] = "";
			//   babel["fracci\u00F3n"] = babel["fraction"] = babel["fracci\u00F3"] = babel["zatiki"] = babel["fraction"] = babel["fracci\u00F3n"] = babel["fra\u00E7\u00E3o"] = babel["fracci\u00F3"] = "";
			//   babel["ra\u00EDz cuadrada"] = babel["square Root"] = babel["arrel quadrada"] = babel["erro karratu"] = babel["racine carr\u00E9e"] = babel["ra\u00EDz cadrada"] = babel["raiz quadrada"] = babel["arrel quadrada"] = "";
			//   babel["sub\u00EDndice"] = babel["subindex"] = babel["sub\u00EDndex"] = babel["azpi-indize"] = babel["subindice"] = babel["sub\u00EDndice"] = babel["sub\u00EDndice"] = babel["sub\u00EDndex"] = "";
			//   babel["super\u00EDndice"] = babel["superindex"] = babel["super\u00EDndex"] = babel["goi-indize"] = babel["superindice"] = babel["super\u00EDndice"] = babel["super\u00EDndice"] = babel["super\u00EDndex"] = "";
			//   babel["editar"] = babel["edit"] = babel["edita"] = babel["editatu"] = babel["\u00E9diter"] = babel["editar"] = babel["editar"] = babel["edita"] = "";
			//   babel["mostrar"] = babel["show"] = babel["mostra"] = babel["erakutsi"] = babel["montrer"] = babel["mostrar"] = babel["exibir"] = babel["mostra"] = "";
		babel["negrita"] = babel["bold"] = babel["negreta"] = babel["lodi"] = babel["caract\u00E8re gras"] = babel["negra"] = babel["negrito"] = "bold";
		babel["cursiva"] = babel["italics"] = babel["etzana"] = babel["italique"] = babel["it\u00E1lico"] = "italics";
		babel["subrayada"] = babel["underlined"] = babel["subratllat"] = babel["azpimarratua"] = babel["soulignement"] = babel["subli\u00F1ada"] = babel["sublinhado"] = "underlined";
			//   babel["super-rayada"] = babel["overlined"] = babel["sobreratllat"] = babel["goimarratua"] = babel["surrayure"] = babel["super-raiada"] = babel["linha-superior"] = babel["sobreratllat"] = "";
			//   babel["f\u00F3rmula"] = babel["formula"] = babel["f\u00F3rmula"] = babel["formula"] = babel["formule"] = babel["f\u00F3rmula"] = babel["f\u00F3rmula"] = babel["f\u00F3rmula"] = "";
			//   babel["Lat\u00EDno b\u00E1sico"] = babel["Basic Latin"] = babel["Llat\u00ED b\u00E0sic"] = babel["Oinarrizko Latindarra"] = babel["Latin basique"] = babel["Lat\u00EDn b\u00E1sico"] = babel["Latim B\u00E1sico"] = babel["Llat\u00ED b\u00E0sic"] = "";
			//   babel["Latino "] = babel["Latin "] = babel["Llat\u00ED 1"] = babel["Latindar "] = babel["Latin 1"] = babel["Latin "] = babel["Latim 1"] = babel["Llat\u00ED "] = "";
			//   babel["Latino extendido A"] = babel["Latin Extended A"] = babel["Llat\u00ED est\u00E8s A"] = babel["Latindar zabaldua A"] = babel["Latin r\u00E9pandu A"] = babel["Latin extendido A"] = babel["Latim estendido A"] = babel["Llat\u00ED est\u00E8s A"] = "";
			//   babel["Latino extendido B"] = babel["Latin Extended B"] = babel["Llat\u00ED est\u00E8s B"] = babel["Latindar zabaldua B"] = babel["Llat\u00ED r\u00E9pandu B"] = babel["Latin extendido B"] = babel["Latim estendido B"] = babel["Llat\u00ED est\u00E8s B"] = "";
			//   babel["Griego b\u00E1sico"] = babel["Basic Greek"] = babel["Grec b\u00E0sic"] = babel["Oinarrizko Grekera"] = babel["Grec basique"] = babel["Grego b\u00E1sico"] = babel["Grego B\u00E1sico"] = babel["Grec b\u00E0sic"] = "";
			//   babel["Cir\u00EDlico"] = babel["Cyrillic"] = babel["Cir\u00EDlÂ·lic"] = babel["Ziriliko"] = babel["Cyrillique"] = babel["Cir\u00EDlico"] = babel["Cir\u00EDlico"] = babel["Cir\u00EDlÂ·lic"] = "";
			//   babel["Hebreo b\u00E1sico"] = babel["Basic Hebrew"] = babel["Hebreu b\u00E0sic"] = babel["Oinarrizko Hebrear"] = babel["H\u00E9breu basique"] = babel["Hebreo b\u00E1sico"] = babel["Hebreu B\u00E1sico"] = babel["Hebreu b\u00E0sic"] = "";
			//   babel["\u00C1rabe b\u00E1sico"] = babel["Basic Arab"] = babel["\u00C0rab b\u00E0sic"] = babel["Oinarrizko Arabiarra"] = babel["Arabe basique"] = babel["\u00C1rabe b\u00E1sico"] = babel["\u00C1rabe B\u00E1sico"] = babel["\u00C0rab b\u00E0sic"] = "";
			//   babel["Puntuaci\u00F3n general"] = babel["General Punctuation"] = babel["Puntuaci\u00F3 general"] = babel["Puntuazio orokorra"] = babel["Ponctuation g\u00E9n\u00E9rale"] = babel["Puntuaci\u00F3n xeral"] = babel["Pontua\u00E7\u00E3o Geral"] = babel["Puntuaci\u00F3 general"] = "";
			//   babel["S\u00EDmbolos de moneda"] = babel["Currency Symbols"] = babel["S\u00EDmbols de moneda"] = babel["Txanpon sinboloak"] = babel["Symboles de monnaie"] = babel["S\u00EDmbolos de moeda"] = babel["S\u00EDmbolos Monet\u00E1rios"] = babel["S\u00EDmbols de moneda"] = "";
			//   babel["S\u00EDmbolos tipo carta"] = babel["Letterlike Symbols"] = babel["S\u00EDmbols tipus carta"] = babel["karta motako sinboloak"] = babel["Symboles types lettre"] = babel["S\u00EDmbolos tipo carta"] = babel["S\u00EDmbolos Tipo Carta"] = babel["S\u00EDmbols tipus carta"] = "";
			//   babel["Formatos de n\u00FAmeros"] = babel["Number Forms"] = babel["Formats de n\u00FAmeros"] = babel["Zenbaki formatua"] = babel["Form\u00E9s de num\u00E9ros"] = babel["Formatos de n\u00FAmeros"] = babel["Formatos de N\u00FAmeros"] = babel["Formats de n\u00FAmeros"] = "";
			//   babel["Operadores matem\u00E1ticos"] = babel["Mathematical Operators"] = babel["Operadors matem\u00E0tics"] = babel["Eragile matematikoak"] = babel["Op\u00E9rateurs math\u00E9matiques"] = babel["Operadores matem\u00E1ticos"] = babel["Operadores Matem\u00E1ticos"] = babel["Operadors matem\u00E0tics"] = "";
			//   babel["Bordes de cuadros"] = babel["Box Drawing"] = babel["Vores de quadres"] = babel["Koadro ertzak"] = babel["Bord de carr\u00E9s"] = babel["Bordes de cadros"] = babel["Bordas"] = babel["Vores de quadres"] = "";
			//   babel["Elementos de bloque"] = babel["Block Elements"] = babel["Elements de bloc"] = babel["Blokearen elementuak"] = babel["\u00C9l\u00E9ments de bloc"] = babel["Elementos de bloque"] = babel["Elementos de Blocos"] = babel["Elements de bloc"] = "";
			//   babel["S\u00EDmbolos variados"] = babel["Miscelaneous Symbols"] = babel["S\u00EDmbols variats"] = babel["Askotariko sinboloak"] = babel["Symboles vari\u00E9s"] = babel["S\u00EDmbolos variados"] = babel["S\u00EDmbolos Diversos"] = babel["S\u00EDmbols variats"] = "";
			//   babel["Alfabetos Unicode"] = babel["Unicode Alphabets"] = babel["Alfabets Unicode"] = babel["Unicode alfabetoa"] = babel["Alphabets Unicode"] = babel["Alfabetos Unicode"] = babel["Alfabetos Unicode"] = babel["Alfabets Unicode"] = "";
			//   babel["Base Unicode"] = babel["Unicode Base"] = babel["Base Unicode"] = babel["Unicode oina"] = babel["Base Unicode"] = babel["Base Unicode"] = babel["Unicode Base"] = babel["Base Unicode"] = "";
		babel["imagen"] = babel["image"] = babel["imatge"] = babel["irundia"] = babel["imaxe"] = babel["imagem"] = "image";
			//   babel["Doc"] = babel["Doc"] = babel["Doc"] = babel["Dok"] = babel["Doc"] = babel["Doc"] = babel["Doc"] = babel["Doc"] = "";
			//   babel["Aux"] = babel["Aux"] = babel["Aux"] = babel["lagunt"] = babel["Aux"] = babel["Aux"] = babel["Aux"] = babel["Aux"] = "";
			//   babel["clic"] = babel["click"] = babel["clic"] = babel["klik"] = babel["clic"] = babel["clic"] = babel["clique"] = babel["clic"] = "";
		babel["pos_mensajes"] = babel["msg_pos"] = babel["pos_missatges"] = babel["mezuen_pos"] = babel["pos_messages"] = babel["pos_mensaxes"] = "msg_pos";
			//   babel["arr_izq"] = babel["top_left"] = babel["dalt_esq"] = babel["goi_ezk"] = babel["au-dessus_gauche"] = babel["arr_esq"] = babel["acima_esquerda"] = babel["dalt_esq"] = "";
			//   babel["arriba"] = babel["top_center"] = babel["dalt"] = babel["goian"] = babel["au-dessus"] = babel["arriba"] = babel["acima_centro"] = babel["dalt"] = "";
			//   babel["arr_der"] = babel["top_right"] = babel["dalt_dreta"] = babel["goi_eskuin"] = babel["au-dessus_droite"] = babel["arr_der"] = babel["acima_direita"] = babel["dalt_dreta"] = "";
		babel["izquierda"] = babel["left"] = babel["esquerra"] = babel["eskerrean"] = babel["gauche"] = babel["esquerda"] = babel["esquerda"] = babel["esquerra"] = "left";
		babel["derecha"] = babel["right"] = babel["dreta"] = babel["eskuinan"] = babel["droite"] = babel["dereita"] = babel["direita"] = babel["dreta"] = "right";
			//   babel["ab_izq"] = babel["bottom_left"] = babel["avall_esq"] = babel["Behe_ezk"] = babel["en bas_gauche"] = babel["ab_esq"] = babel["abaixo_esquerda"] = babel["avall_esq"] = "";
			//   babel["abajo"] = babel["bottom"] = babel["avall"] = babel["behean"] = babel["en bas"] = babel["abaixo"] = babel["abaixo"] = babel["avall"] = "";
			//   babel["ab_der"] = babel["bottom_right"] = babel["avall_dreta"] = babel["behe_eskuin"] = babel["en bas_droite"] = babel["ab_der"] = babel["abaixo_direita"] = babel["avall_dreta"] = "";
			//   babel["img"] = babel["img"] = babel["img"] = babel["irud"] = babel["img"] = babel["img"] = babel["img"] = babel["img"] = "";
		babel["sensible_a_los_movimientos_del_rat\u00F3n"] = babel["sensitive_to_mouse_movements"] = babel["sensible_als_moviments_del_ratol\u00ED"] = babel["xagu mugimenduarekiko sentikorra"] = babel["sensible_aux_mouvements_du_souris"] = babel["sensible_aos_movementos_do_rato"] = babel["sens\u00EDvel_aos_movimentos_do_mouse"] = "sensitive_to_mouse_movements";
		babel["reproducir"] = babel["play"] = babel["reprodueix"] = babel["erreproduzitu"] = babel["reproduire"] = babel["reproduzir"] = "playAudio";
			//   babel["infoind"] = babel["indinfo"] = babel["infoind"] = babel["baninf"] = babel["infoind"] = babel["infoind"] = babel["infoind"] = babel["infoind"] = "";
			//   babel["infoest"] = babel["statinfo"] = babel["infoest"] = babel["estinf"] = babel["infoest"] = babel["infoest"] = babel["infoest"] = babel["infoest"] = "";
		babel["activo-si"] = babel["active-if"] = babel["actiu-si"] = babel["altiboa-baldin"] = babel["actif-si"] = babel["activo-se"] = babel["ativo-se"] = "active-if";
		babel["rotfin"] = babel["finrot"] = babel["bukrot"] = "endrot";
		babel["posfin"] = babel["finpos"] = babel["bukpos"] = "endpos";
		babel["editable"] = babel["editagarria"] = babel["edit\u00E1vel"] = "editable";
			//   babel["camposMixtos"] = babel["mixedTF"] = babel["CampsMixtes"] = babel["esparruMistoa"] = babel["ChampsMixtes"] = babel["camposMixtos"] = babel["camposMixtos"] = babel["CampsMixtes"] = "";
			//   babel["sonido"] = babel["sound"] = babel["so"] = babel["soinu"] = babel["son"] = babel["son"] = babel["som"] = babel["so"] = "";
			//   babel["\u00E1lgebra"] = babel["algebra"] = babel["\u00E0lgebra"] = babel["aljebra"] = babel["alg\u00E8bre"] = babel["\u00E1lxebra"] = babel["\u00E1lgebra"] = babel["\u00E0lgebra"] = "";
			//   babel["RAD"] = babel["RAD"] = babel["RAD"] = babel["RAD"] = babel["RAD"] = babel["RAD"] = babel["RAD"] = babel["RAD"] = "";
		babel["tipo"] = babel["type"] = babel["tipus"] = babel["mota"] = "type";
		babel["R2"] = "R2";
		babel["R3"] = "R3";
			//   babel["TA"] = babel["TA"] = babel["TA"] = babel["TA"] = babel["TA"] = babel["TA"] = babel["TA"] = babel["TA"] = "";
			//   babel["TX"] = babel["TX"] = babel["TX"] = babel["TX"] = babel["TX"] = babel["TX"] = babel["TX"] = babel["TX"] = "";
			//   babel["D"] = babel["D"] = babel["D3"] = babel["D"] = babel["D3"] = babel["D"] = babel["D3"] = babel["D"] = "";
		babel["vectores"] = babel["bektoreak"] = babel["vecteurs"] = babel["vetores"] = babel["vectors"] = "vectors";
			//   babel["fuente tipo"] = babel["font type"] = babel["font tipus"] = babel["iturri mota"] = babel["source type"] = babel["fonte tipo"] = babel["tipo de fonte"] = babel["font tipus"] = "";
		babel["fuente puntos"] = babel["font size"] = babel["font punts"] = babel["puntu iturria"] = babel["source points"] = babel["fonte puntos"] = babel["fonte pontos"] = "font_size";
			//   babel["SansSerif"] = "SansSerif";
			//   babel["Serif"] = "Serif";
			//   babel["Monoespaciada"] = babel["Monospaced"] = babel["Monoespazada"] = "Monospaced";
			//   babel["\u00E1rbol"] = babel["tree"] = babel["arbre"] = babel["zuhitz"] = babel["arbre"] = babel["\u00E1rbore"] = babel["\u00E1rvore"] = babel["arbre"] = "";
			//   babel["sensible"] = babel["sensible"] = babel["sensible"] = babel["sentikor"] = babel["sensible"] = babel["sensible"] = babel["sens\u00EDvel"] = babel["sensible"] = "";
			//   babel["paso de l\u00EDnea"] = babel["step size"] = babel["pas de l\u00EDnia"] = babel["lerro igarotze"] = babel["pas de ligne"] = babel["paso de li\u00F1a"] = babel["passo de linha"] = babel["pas de l\u00EDnia"] = "";
			//   babel["s\u00EDmbolo de multiplicaci\u00F3n"] = babel["multiplication symbol"] = babel["s\u00EDmbol del producte"] = babel["biderketa sinboloa"] = babel["symbole du produit"] = babel["s\u00EDmbolo de multiplicaci\u00F3n"] = babel["s\u00EDmbolo de multiplica\u00E7\u00E3o"] = babel["s\u00EDmbol del producte"] = "";
			//   babel["par\u00E9ntesis siempre"] = babel["parenthesis always"] = babel["par\u00E8ntesis sempre"] = babel["beti parentesia"] = babel["par\u00E8nth\u00E8ses toujours"] = babel["par\u00E9ntese sempre"] = babel["par\u00E9ntesis sempre"] = babel["par\u00E8ntesis sempre"] = "";
			//   babel["modo"] = babel["mode"] = babel["model"] = babel["modu"] = babel["mod\u00E8le"] = babel["modo"] = babel["modo"] = babel["model"] = "";
			//   babel["autom\u00E1tico"] = babel["automatic"] = babel["autom\u00E0tic"] = babel["autom\u00E1tiko"] = babel["automatique"] = babel["autom\u00E1tico"] = babel["autom\u00E1tico"] = babel["autom\u00E0tic"] = "";
			//   babel["clic y arrastre"] = babel["click and drag"] = babel["clica i arrossega"] = babel["klik eta arrastatu"] = babel["cliquer et tr\u00E2iner"] = babel["clic e arrastre"] = babel["clique e arraste"] = babel["clica i arrossega"] = "";
			//   babel["clic y escribir"] = babel["click and write"] = babel["clica i y escriu"] = babel["klik eta idatzi"] = babel["cliquer et \u00E9crire"] = babel["clic e escribir"] = babel["clique e escrever"] = babel["clica i y escriu"] = "";
			//   babel["escribir"] = babel["write"] = babel["escriu"] = babel["idatzi"] = babel["\u00E9crire"] = babel["escribir"] = babel["escrever"] = babel["escriu"] = "";
			//   babel["guiado"] = babel["guided"] = babel["guiat"] = babel["gidatua"] = babel["guid\u00E9"] = babel["guiado"] = babel["guiado"] = babel["guiat"] = "";
		babel["ecuaci\u00F3n"] = babel["equation"] = babel["equaci\u00F3"] = babel["ekuazio"] = babel["\u00E9quation"] = babel["equa\u00E7\u00E3o"] = "equation";
			//   babel["ejercicios"] = babel["exercises"] = babel["exercicis"] = babel["ariketak"] = babel["exercices"] = babel["exercicios"] = babel["exerc\u00EDcios"] = babel["exercicis"] = "";
		babel["punto"] = babel["dot"] = babel["punt"] = babel["puntu"] = babel["point"] = babel["ponto"] = "point";
			//   babel["aspas"] = babel["cross"] = babel["aspes"] = babel["gurutzeak"] = babel["ailes"] = babel["aspas"] = babel["aspas"] = babel["aspes"] = "";
		babel["escenario"] = babel["scenario"] = babel["escenari"] = babel["agertoki"] = babel["sc\u00E8ne"] = babel["cen\u00E1rio"] = "scenario";
		babel["cID"] = "cID";
		babel["matriz"] = babel["matrix"] = babel["matriu"] = babel["matrice"] = "matrix";
		babel["filas"] = babel["rows"] = babel["files"] = "rows";
		babel["columnas"] = babel["columns"] = babel["colonnes"] = "columns";
		babel["solo_texto"] = babel["only_text"] = babel["seulement_texte"] = babel["s\u00F3_texto"] = babel["tan_sols_texte"] = "only_text";
		babel["evaluar"] = babel["evaluate"] = "evaluate";
		babel["respuesta"] = babel["answer"] = "answer";
			//   babel["peso"] = babel["weight"] = babel["pes"] = babel["peso"] = babel["peso"] = babel["peso"] = babel["peso"] = babel["pes"] = "";
		babel["decimal_symbol"] = babel["signo decimal"] = babel["decimal symbol"] = "decimal_symbol";
		babel["info"] = "info";
			//   babel["No se encuentra"] = babel["Not Found"] = babel["No es troba"] = babel["Ez da aurkitzen"] = babel["Il ne se trouve pas"] = babel["Non se atopa"] = babel["N\u00E3o Encontrado"] = babel["No es troba"] = "";
			  
			  ////////////////////////
			  //  new options added
			//   babel["borde"] = babel["border"] = babel["contour"] = "border";
		babel["color_contorn_text"] = babel["color_text_border"] = babel["color_borde_texto"] = babel["muga_testuaren_kolorea"] = babel["couleur_contour_texte"] = babel["cor_borde_texto"] = babel["colore_bordo_testo"] = babel["cor_borda_texto"] = babel["color_contorn_text"] = "color_text_border";
		babel["video"] = babel["vid\u00e9o"] = "video";
		babel["audio"] = babel["\u00e0udio"] = "audio"; 
		babel["autoplay"] = "autoplay";
		babel["loop"] = "loop";
		babel["poster"] = "poster";
		babel["opacidad"] = babel["opacity"] = babel["opacit\u00E9"] = babel["opacitat"] = babel["opacidade"] = "opacity";
		babel["alinear"] = babel["align"] = babel["ali\u00F1ar"] = babel["aligner"] = "align";
		babel["malla"] = babel["mesh"] = "mesh";
		babel["local"] = babel["Local"] = "local";
			  ////////////////////////
		babel.loadLib = true;
		
		return babel; })();
	
return descartes;})((descartes||{}),jQuery);
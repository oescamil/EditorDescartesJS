var DescartesSpaceEditPane = (function(){
	var _super_ = DescartesEditObjectPane;

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
	proto.getConfig = function(){
		var origCfg = _super_.prototype.getConfig.call(this);
		
		var commentsGroup 	= origCfg.commentsGroup;
		var operativeGroup	= origCfg.operativeGroup;
		var visualGroup 	= origCfg.visualGroup;
		//id='a2' type='audio' region='external' space='E1' expresion='(01,01)' draw-if='aaa' file='aaa'

		delete origCfg.operativeGroup;
		delete origCfg.visualGroup;
		delete origCfg.commentsGroup;
		
		origCfg.type = {
			type	: 'textfield',		
			label	: 'Type asdasd',						
			value	: 'R2',
			enable	: false,
			visible	: false,
		};
		
		origCfg['draw-if'] = {
				type:'codetextfield',	
				label:'Draw if',
				value:''
		}; 
		
		
		
		var  positionGroup = {
				type	: 'fieldset',
				label	: 'Position',
				children:[],
		};
		origCfg.positionGroup = positionGroup;
		positionGroup = positionGroup.children;
		positionGroup.left = {
			type:'codetextfield',	
			label:'X',							
			value:'',			
		};
		
		positionGroup.top	 = {
			type:'codetextfield',	
			label:'Y',							
			value:'',
		}; 
		
		positionGroup.width = {
			type:'textfield',		
			label:'Width',						
			value:'',
		}; 
		
		positionGroup.height = {
			type:'textfield',		
			label:'Height',						
			value:'',			
		}; 
		
		
		
		
		origCfg['O.x'] = {
			type:'textfield',		
			label:'Ox',							
			value:0,
		}; 
		
		origCfg['O.y'] = {
			type:'textfield',
			label:'Oy',
			value:0,
		}; 

		origCfg.fixed	= {
				type:'checkbox',
				label:'Fixed',
				value:false,
		}; 
		
		origCfg.scale = {
				type:'textfield',		
				label:'Escale',						
				value:32,
		}; 
		
		origCfg.sensitive_to_mouse_movements = {
			type:'checkbox',
			label:'Mouse move listener',
			value:false,
		};
		

		var  imageGroup = {
				type	: 'fieldset',
				label	: 'Position',
				children:[],
		};
		origCfg.imageGroup = imageGroup;
		imageGroup = imageGroup.children;
		imageGroup.background	= {
				type:'color', 			
				label:'Color',
				value:'00f0f8fA',
		}; 
		imageGroup.bg_image = {
			type:'image',
			label:'Background image',
			value:'',
		};
		
		imageGroup.bg_display 	= {
			type	: 'combobox',
			label	: 'Position',
			value	: 0,
			options	: {
				topleft	: 'Top left',
				strech	: 'Strech',
				patch	: 'Repeat',
				center	: 'centert',
			},
		}; 
		
		imageGroup.previewImg 	= {
			type		: 'fieldset',
			label		: 'Preview',
			children	: {},
		};
		
		
		
		var axesGroup = {
			type : 'fieldset',
			label : 'Axes',
			children : {},
		};
		origCfg.axesGroup = axesGroup;
		axesGroup = axesGroup.children;
		
		axesGroup.axes	= {
			type:'checkbox_color', 
			label:'Axes color',
			value:'no,gray',	
		}; 
		axesGroup.numbers = {
				type:'checkbox',
				label:'Show escale',
				value:false,
		};
		axesGroup['x-axis'] = {
				type:'textfield',
				label:'X label',
				value:'',
		}; 
		
		axesGroup['y-axis']	= {
				type:'textfield',
				label:'Y label',
				value:'',
		};
		
		
		var netGroup = {
			type : 'fieldset',
			label : 'Net',
			children : {},
			};
		origCfg.netGroup = netGroup;
		netGroup = netGroup.children;
		
		
		netGroup.net = {
			type:'checkbox_color',
			label:'Net color',
			value:'no,gray',
		}; 
		
		netGroup.net10	= {
			type:'checkbox_color',
			label:'Net 10 color',
			value:'no,gray',
		};
			
		netGroup.text = {
			type:'checkbox_color',
			label:'Text color',
			value:'no,gray',
		}; 
		
		origCfg.commentsGroup = commentsGroup;	
		return origCfg ;
	};

	//No register, is abstract class
	//DescartesEditObjectPane.registerHandler('control.audio',Class);
	
	return Class; })();
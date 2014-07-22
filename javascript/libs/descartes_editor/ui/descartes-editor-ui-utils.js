/**
 * @author oescamil
 */
(function(descartes){
	
	descartes.editor = (descartes.editor || {});
	descartes.editor.ui = (descartes.editor.ui || {});
	
	/**
	 * Utils for gui
	 */
	descartes.editor.ui.utils = 
	{
		/**
		 * Open a message dialog with the html text especified by htmlText and title.
		 * @param title The header of dialog
		 * @param htmlText The content of dialog
		 * @param type Indicates the icon to show in the dialog
		 * @param babel Custom babel object to translate the button's labels. If null it will use  "descartes.editor.ui_config.babel"
		 * @see descartes.editor.ui_config.babel
		 */
			
		showMsg : function (htmlText,title,type, babel) {
			title = (title)?title:'Message';
			type = (type)?type:'Message';
			babel = (babel)?babel:descartes.editor.ui_config.babel;
			
			var t = descartes.editor.ui_config.babel.t; 
			if(babel && babel.hasOwnProperty('t') && typeof(babel.t) == 'function')
				t = babel.t;
				
			var win = $("<div class='auxiliar-prop-popuot'>");
			var okLabel = t('ok');
			
			var cfgBtns = {};
			cfgBtns[okLabel] = function(){	$(this).dialog('close');}; 
			
			var dlgSettings = {
				title : title,
				modal : true,
				buttons:cfgBtns,
				close : function(){
					$(this).dialog('destroy').remove();
				},
				show: {
					effect: "fade",
					duration: 500,
				},
				hide: {
					 effect: "explode",
					 duration: 1000
				}
			};
			
			win.html(htmlText);
			win.appendTo($('body'));
			win = win.dialog(dlgSettings);
		},
		/**
		 * 
		 * @param htmlText
		 * @param callback
		 * @param title
		 * @param type
		 * @param babel
		 */
		confirmMsg : function (htmlText,callback,title,type, babel) {
			title = (title)?title:'Message';
			type = (type)?type:'Message';
			babel = (babel)?babel:descartes.editor.ui_config.babel;
			
			var t = descartes.editor.ui_config.babel.t; 
			if(babel && babel.hasOwnProperty('t') && typeof(babel.t) == 'function')
				t = babel.t;
				
			var win = $("<div class='auxiliar-prop-popuot'>");
			var okLabel = t('ok');
			var cancelLabel = t('cancel');
			
			var cfgBtns = {};
			cfgBtns[okLabel] 	= function(){$(this).data('callback_called',true);$(this).dialog('close'); callback(true);}; 
			cfgBtns[cancelLabel] = function(){	$(this).data('callback_called',true);$(this).dialog('close'); callback(false);}; 
			
			var dlgSettings = {
				title : title,
				modal : true,
				buttons:cfgBtns,
				close : function(){
					$(this).dialog('destroy').remove();
					if(!$(this).data('callback_called'))
						callback(false);
				},
				show: {
					effect: "fade",
					duration: 500,
				},
				hide: {
					 effect: "explode",
					 duration: 1000
				}
			};
			
			win.html(htmlText);
			win.appendTo($('body'));
			win = win.dialog(dlgSettings);
		},
		/**
		 * 
		 * @param cfg  A object like hashtable to get titles and contents. 
		 * 	Example : {
		 * 		'title1 ' : "CONTENT For TITLE 1" , 
		 * 		'title2 ' : "CONTENT for TITLE 2" 
		 * 		}
		 * @param okCallBack
		 * @param cancelCallBack
		 * @param babel
		 */
		showTabbedDialogForm : function(cfg, okCallBack, cancelCallBack,width,height,babel){
			babel = (babel)?babel:descartes.editor.ui_config.babel;
			babel = (babel.t)?babel:descartes.editor.ui_config.babel;
			var t = $.proxy(babel.t,babel); 
						
			var okLabel = t('ok');
			var cancelLabel = t('cancel');
			
			var cfgBtns = {};
			cfgBtns[okLabel]		= function(){  $(this).data('callback_called',true);$(this).dialog('close'); okCallBack(cfg);}; 
			cfgBtns[cancelLabel]	= function(){	$(this).data('callback_called',true);$(this).dialog('close'); cancelCallBack(cfg);}; 
			
			var dlgSettings = {
				title : false,
				modal : true,
				buttons:cfgBtns,
				dialogClass : 'ui-tabbed-dialog',
				open: function() {
		            $(this).find('.ui-dialog-titlebar-close').blur();
		        },
				close : function(){
					if(!$(this).data('callback_called'))
						cancelCallBack(cfg);
					$(this).dialog('destroy').remove();
				},
				show: {
					effect: "fade",
					duration: 500,
				},
				hide: {
					 effect: "explode",
					 duration: 1000
				}
			};
			
			if(width)
				dlgSettings.width = width;
			if(height)
				dlgSettings.height = height;
			
			var idPre = Math.random();
			var winId = "win_"+idPre;
			var tabsId = "tabs_"+idPre;
			var win = $("<div id='"+winId+"' class='auxiliar-prop-popuot'>");
			var tabs = $("<div id = '"+tabsId+"' class = 'tabs-info'>").appendTo(win);
			var ul = $("<ul>").appendTo(tabs);
			var i = 0;
			
			for ( var title in cfg) {
				var content = cfg[title];
				var idSubTab = tabsId+"_tab"+i;
				var li = $("<li>").appendTo(ul); 
				var a = $("<a>").appendTo(li);
				a.attr('href',"#"+idSubTab);
				a.html(title);
				var div = $("<div>").html(content).appendTo(tabs);
				div.attr('id',idSubTab);
				i++;
			}
			
			win.appendTo($('body'));
			tabs.tabs();
			win = win.dialog(dlgSettings);
			$('textarea',tabs).css('width','98%').css('height','98%');
			var winTitleBar = win.closest('.ui-dialog').children('.ui-dialog-titlebar');
			var newTitle = $("<div class='ui-tabs ui-widget'>").append( tabs.children('ul') ); 
			winTitleBar.append(newTitle);
			winTitleBar.children('span').remove(); // remove the span for the title in the original dialog config
			
		},
		/**
		 * 
		 * @param object
		 * @param key  
		 */
		getSecuredValue: function(object,key){
			if(object && object.hasOwnProperty(key) 
					&& object[key] 
					&& 	$.trim(object[key]).length > 0)
					return object[key];
			return false;
		},
		
		decode_htmlentities: function(strin_html){
			var div = document.createElement('div');
			div.innerHTML = strin_htm;
			return div.firstChild.nodeValue;
		},
		
		encode_htmlentities: function(string_html){
			
		},
		
	};
})(descartes || {});


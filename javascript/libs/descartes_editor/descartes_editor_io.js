descartes = (function(){
	descartes.editor = (descartes.editor || {} );
	
	var mode = 'html';  
	// Check for the various File API support.
	if (window.File && window.FileReader && window.FileList && window.Blob) {
		mode = 'html5';
	} else {
		mode = 'no-soported';
	}
	
	descartes.editor.io = (descartes.editor.io || {});
	descartes.editor.io.babel =  descartes.editor.ui_config.babel, 
	
	descartes.editor.io.input_file = $("<input>");
	descartes.editor.io.input_file.appendTo($('body'));
	descartes.editor.io.input_file.attr('type','file');
	descartes.editor.io.input_file.hide();
	
	switch(mode){
		case 'html5':
			instanceFunctionsForHTML5(descartes.editor.io);
		break;
		
		case 'app':
			instanceFunctionsForApp(descartes.editor.io);
		break;
		default:
			descartes.editor.io.loadFile = function (url){
				var msg = this.babel.t('The descartes.editor.io utility not function in your browser');
				alert(msg);
				return '';
			};
			descartes.editor.io.saveToFile = function(url, stringData){
				var msg = this.babel.t('The descartes.editor.io utility not function in your browser');
				alert(msg);
			};
			descartes.editor.io.showDialogToOpen = function(callBack,allowedExt){
				var msg = this.babel.t('The descartes.editor.io utility not function in your browser');
				alert(msg);
			};
			descartes.editor.io.showDialogToSave = function(callBack,allowedExt){
				var msg = this.babel.t('The descartes.editor.io utility not function in your browser');
				alert(msg);
			};
	}
	
	function instanceFunctionsForApp(descartes_editor_io){
		descartes.editor.io.loadFile = function (url){
			var msg = this.babel.t('Not implemented yet');
			alert(msg);
			return '';
		};
		descartes.editor.io.saveToFile = function(url, stringData){
			var msg = this.babel.t('Not implemented yet');
			alert(msg);
		};
		descartes.editor.io.showDialogToOpen = function(callBack,allowedExt){
			var msg = this.babel.t('Not implemented yet');
			alert(msg);
		};
		descartes.editor.io.showDialogToOpen = function(callBack,allowedExt){
			var msg = this.babel.t('Not implemented yet');
			alert(msg);
		};
		descartes.editor.io.showDialogToSave = function(textToWrite,allowedExt,fileName){
			var msg = this.babel.t('Not implemented yet');
			alert(msg);
		};
	}
	
	
	
	/**
	 * 
	 */
	function instanceFunctionsForHTML5(descartes_editor_io){
		/**
		 * 
		 */
		descartes_editor_io.loadFile = function (url){
		};
		/**
		 * 
		 */
		descartes_editor_io.saveToFile = function(url, stringData){
		};
		/**
		 * 
		 */
		descartes_editor_io.showDialogToOpen = function(callBack,allowedExt){
			function myCallBk(evt){
				var files = evt.target.files;
				reader = new FileReader();
				if (files.length >0) {
			    	f = files[0];
			    	if (true || f.type === "text/html") {
			    		console.log("Vamos a leer el archivo "+f.path);
			    		reader.onload = function(evt) {
			    			callBack(evt,escape(f.name),evt.target.result,f.path);
			    			descartes_editor_io.input_file.off('change',myCallBk);
			    		};
			    		reader.readAsText(f);
			      } else {
			        alert("No fue un html");
			      }
			    }
			};
			descartes_editor_io.input_file.on('change', myCallBk); 
			descartes_editor_io.input_file.trigger('click');
		};
		/**
		 * 
		 */
		descartes_editor_io.showDialogToSave = function(textToWrite,fileName){
			
			var textFileAsBlob = new Blob([textToWrite], {type:'text/html'});
			var fileNameToSaveAs = (fileName)?fileName:'index.html';

			var downloadLink = document.createElement("a");
			downloadLink.download = fileNameToSaveAs;
			downloadLink.innerHTML = "Download File";
			if (window.webkitURL != null)
			{
				// Chrome allows the link to be clicked
				// without actually adding it to the DOM.
				downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
			}
			else
			{
				// Firefox requires the link to be added to the DOM
				// before it can be clicked.
				downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
				downloadLink.onclick = function(event){ $(downloadLink).remove();};
				downloadLink.style.display = "none";
				document.body.appendChild(downloadLink);
			}

			downloadLink.click();
			
		};
	}
	
	
	
	
	
	return descartes;	
})(descartes || {});
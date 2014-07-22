// you should use function below

/* 
 * DOMParser HTML extension 
 * 2012-02-02 
 * 
 * By Eli Grey, http://eligrey.com 
 * Public domain. 
 * NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK. 
 */  

/*! @source https://gist.github.com/1129031 */  
/*global document, DOMParser*/  

(function() {  
"use strict";  
    if(DOMParser){
    	var DOMParser_proto = DOMParser.prototype, real_parseFromString = DOMParser_proto.parseFromString;
    	var isSupported = false;
    	
		// Firefox/Opera/IE throw errors on unsupported types
		try {
			// WebKit returns null on unsupported types
			if ((new DOMParser).parseFromString("", "text/html")) {
				
				isSupported = true;
			}
		} catch (ex) {	}

		if(!isSupported){
			DOMParser_proto.parseFromString = function(markup, type) {
				if (/^\s*text\/html\s*(?:;|$)/i.test(type)) {
					var doc = document.implementation.createHTMLDocument(""), doc_elt = doc.documentElement, first_elt;
	
					doc_elt.innerHTML = markup;
					first_elt = doc_elt.firstElementChild;
	
					if (doc_elt.childElementCount === 1
							&& first_elt.localName.toLowerCase() === "html") {
						doc.replaceChild(first_elt, doc_elt);
					}
	
					return doc;
				} else {
					return real_parseFromString.apply(this, arguments);
				}
			};
		}
    }
    if (!String.prototype.decodeHTML) {
    	String.prototype.decodeHTML = function () {
    		
    		var res =  this
    			.replace(/&apos;/g		, "'"		)
    			.replace(/&squot;/g		, "'"		)
    			.replace(/&quot;/g		, '"'		)
    			.replace(/&gt;/g		, '>'		)
    			.replace(/&lt;/g		, '<'		)
    			.replace(/&aacute;/g	, "\u00e1"	)
    			.replace(/&eacute;/g	, "\u00e9"	)
    			.replace(/&iacute;/g	, "\u00ed"	)
    			.replace(/&oacute;/g	, "\u00f3"	)	
    			.replace(/&uacute;/g	, "\u00fa"	)
    			.replace(/&Aacute;/g	, "\u00c1"	)
    			.replace(/&Eacute;/g	, "\u00c9"	)
    			.replace(/&Iacute;/g	, "\u00cd"	)
    			.replace(/&Oacute;/g	, "\u00d3"	)
    			.replace(/&Uacute;/g	, "\u00da"	)
    			.replace(/&ntilde;/g	, "\u00f1"	)
    			.replace(/&Ntilde;/g	, "\u00d1"	)
    			.replace(/\r/g			, ""		)
    			.replace(/&amp;/g		, '&'		)
    			;
    		return res;
    	  };
    }
    
    if (!String.prototype.encodeHTML) {
    	  String.prototype.encodeHTML = function () {
    		
    		 return this.htmlentities(this); 
    	    
    		 /*
    		 return this.replace(/&/g, '&amp;')
    	               .replace(/</g, '&lt;')
    	               .replace(/>/g, '&gt;')
    	               .replace(/"/g, '&quot;')
    	               .replace(/'/g, '&squote;')
    	               .replace(/á/g, '&aacute;')
    	               .replace(/Á/g, '&Aacute;')
    	               .replace(/é/g, '&eacute;')
    	               .replace(/É/g, '&Eacute;')
    	               .replace(/í/g, '&iacute;')
    	               .replace(/Í/g, '&Iacute;')
    	               .replace(/ó/g, '&oacute;')
    	               .replace(/Ó/g, '&Oacute;')
    	               .replace(/ú/g, '&uacute;')
    	               .replace(/Ú/g, '&Uacute;')
    	               .replace(/ñ/g, '&ntilde;')
    	               .replace(/Ñ/g, '&Ntilde;')
    	               .replace(/ö/g, '&Ntilde;')
    	               .replace(/ô/g, '&Ntilde;')
    	               ;*/
    	  };
    }
    
    if (!String.prototype.htmlentities) {
    	String.prototype.htmlentities = function(string, quote_style,double_encode) {
    	  var hash_map = this.get_html_translation_table(),
    	    symbol = '';
    	  if (!hash_map) {
    		  return false;
    	  }
    	  string = string == null ? '' : string + '';

    	  string = string.replace(/\&/g,'&amp;');
    	  string = string.replace(/\'/g,'&squot;');
	    for (symbol in hash_map) {
	      if (hash_map.hasOwnProperty(symbol)) {
	    	var replacement = hash_map[symbol];
	    	var string2 = string.split(symbol).join(replacement);
	    	string = string2;
	      }
	    }
	  

    	  return string;
    	};
    }
    if (!String.prototype.get_html_translation_table) {   
    	String.prototype.get_html_translation_table = function() {
	    	var entities = {}, hash_map = {};
	    	//entities['160'] = '&nbsp;';
			entities['161'] = '&iexcl;';
			entities['162'] = '&cent;';
			entities['163'] = '&pound;';
			entities['164'] = '&curren;';
			entities['165'] = '&yen;';
			entities['166'] = '&brvbar;';
			entities['167'] = '&sect;';
			entities['168'] = '&uml;';
			entities['169'] = '&copy;';
			entities['170'] = '&ordf;';
			entities['171'] = '&laquo;';
			entities['172'] = '&not;';
			entities['173'] = '&shy;';
			entities['174'] = '&reg;';
			entities['175'] = '&macr;';
			entities['176'] = '&deg;';
			entities['177'] = '&plusmn;';
			entities['178'] = '&sup2;';
			entities['179'] = '&sup3;';
			entities['180'] = '&acute;';
			entities['181'] = '&micro;';
			entities['182'] = '&para;';
			entities['183'] = '&middot;';
			entities['184'] = '&cedil;';
			entities['185'] = '&sup1;';
			entities['186'] = '&ordm;';
			entities['187'] = '&raquo;';
			entities['188'] = '&frac14;';
			entities['189'] = '&frac12;';
			entities['190'] = '&frac34;';
			entities['191'] = '&iquest;';
			entities['192'] = '&Agrave;';
			entities['193'] = '&Aacute;';
			entities['194'] = '&Acirc;';
			entities['195'] = '&Atilde;';
			entities['196'] = '&Auml;';
			entities['197'] = '&Aring;';
			entities['198'] = '&AElig;';
			entities['199'] = '&Ccedil;';
			entities['200'] = '&Egrave;';
			entities['201'] = '&Eacute;';
			entities['202'] = '&Ecirc;';
			entities['203'] = '&Euml;';
			entities['204'] = '&Igrave;';
			entities['205'] = '&Iacute;';
			entities['206'] = '&Icirc;';
			entities['207'] = '&Iuml;';
			entities['208'] = '&ETH;';
			entities['209'] = '&Ntilde;';
			entities['210'] = '&Ograve;';
			entities['211'] = '&Oacute;';
			entities['212'] = '&Ocirc;';
			entities['213'] = '&Otilde;';
			entities['214'] = '&Ouml;';
			entities['215'] = '&times;';
			entities['216'] = '&Oslash;';
			entities['217'] = '&Ugrave;';
			entities['218'] = '&Uacute;';
			entities['219'] = '&Ucirc;';
			entities['220'] = '&Uuml;';
			entities['221'] = '&Yacute;';
			entities['222'] = '&THORN;';
			entities['223'] = '&szlig;';
			entities['224'] = '&agrave;';
			entities['225'] = '&aacute;';
			entities['226'] = '&acirc;';
			entities['227'] = '&atilde;';
			entities['228'] = '&auml;';
			entities['229'] = '&aring;';
			entities['230'] = '&aelig;';
			entities['231'] = '&ccedil;';
			entities['232'] = '&egrave;';
			entities['233'] = '&eacute;';
			entities['234'] = '&ecirc;';
			entities['235'] = '&euml;';
			entities['236'] = '&igrave;';
			entities['237'] = '&iacute;';
			entities['238'] = '&icirc;';
			entities['239'] = '&iuml;';
			entities['240'] = '&eth;';
			entities['241'] = '&ntilde;';
			entities['242'] = '&ograve;';
			entities['243'] = '&oacute;';
			entities['244'] = '&ocirc;';
			entities['245'] = '&otilde;';
			entities['246'] = '&ouml;';
			entities['247'] = '&divide;';
			entities['248'] = '&oslash;';
			entities['249'] = '&ugrave;';
			entities['250'] = '&uacute;';
			entities['251'] = '&ucirc;';
			entities['252'] = '&uuml;';
			entities['253'] = '&yacute;';
			entities['254'] = '&thorn;';
			entities['255'] = '&yuml;';
			entities['34'] = '&quot;';
		//	entities['60'] = '&lt;';
		//	entities['62'] = '&gt;';
	    	
			
			
			// ascii decimals to real symbols
			for (var decimal in entities) {
				if (entities.hasOwnProperty(decimal)) {
					hash_map[String.fromCharCode(decimal)] = entities[decimal];
				}
			}
			
			return hash_map;
    	};
    }
    
    
}());
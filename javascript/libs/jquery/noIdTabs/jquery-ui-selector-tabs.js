(function( $ ){
    $.fn.selectorTabs = function(options) {
       return this.each(function(){
            var rand = 'spec' + (new Date()).getTime() + Math.floor((Math.random()*25)+65);
            var parent = this;
            $(this).find('ul:first li a').each(function (index) {
            	var sel = $(this).attr("href");
 
            	var idNew = rand + index.toString();
            	var list = $(sel,parent);
            	if(list.length <= 0){
            		alert('selectorTabs : \n The element with selector ['+sel+'] not found in \n ['+$(parent).html());
            		return;
            	}
            	list.each(function(index){
            		$(this).attr('id',idNew);
            	});
            	$(this).attr("href", "#" +idNew );
            });
            
            var result = $(this).tabs(options); 
            	
            $(".ui-tabs-panel",result).css('height','100%');
            return $(this);
        });
    };
})( jQuery );
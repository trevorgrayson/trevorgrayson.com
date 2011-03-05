$.each($('link'),function(I,link){
		$(link).remove();$.ajax({url:link.href,context:link,success:function(){
			(n=document.createElement('link')).setAttribute('href',link.href); n.setAttribute('type','text/css'); n.setAttribute('rel','stylesheet');n.setAttribute('media',link.media);
			document.getElementsByTagName('head')[0].appendChild(n);}});});void(0);

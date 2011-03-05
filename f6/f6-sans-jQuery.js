links=document.getElementsByTagName('link');for( i in links){
var link=links[i]; var clone = link.cloneNode(false);
console.log(link);
if(link.href){
		$(link).remove();$.ajax({url:clone.href,context:clone.cloneNode(false),success:function(){
			(n=document.createElement('link')).setAttribute('href',this.href); n.setAttribute('type','text/css'); n.setAttribute('rel','stylesheet');n.setAttribute('media',this.media);
			//document.getElementsByTagName('head')[0].appendChild(n);}});
}};
void(0);

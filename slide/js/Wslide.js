function slideImg(param){
	var _this=this;
	this.index=0;
	this.imgSlideLength=0;
	
	if(param.dom[0]=='.'){
		for(var i=0;i<document.getElementsByTagName('*').length;i++){
			var allDom=document.getElementsByTagName('*')[i].className;
			if(allDom.match(param.dom.slice(1))){
				_this.parentDom=document.getElementsByTagName('*')[i];
			};
		};
	}
	else if(param.dom[0]=='#'){
		_this.parentDom=document.getElementById(param.dom.slice(1))
	};
	
	for(var i=0;i<this.parentDom.getElementsByTagName('*').length;i++){
		var hd=_this.parentDom.getElementsByTagName('*')[i].className;
		if(hd.match('hd')){
			_this.hdDom=_this.parentDom.getElementsByTagName('*')[i];
		};
	};

	for(var i=0;i<this.parentDom.getElementsByTagName('*').length;i++){
		var bd=_this.parentDom.getElementsByTagName('*')[i].className;
		if(bd.match('bd')){
			_this.bdDom=_this.parentDom.getElementsByTagName('*')[i];
			_this.imgSlideLength=_this.bdDom.getElementsByTagName('li').length;
		};
	};
	
	for(var i=0;i<_this.imgSlideLength;i++){
		_this.hdDom.appendChild(document.createElement("li"));
		_this.hdDom.getElementsByTagName('li')[0].className='on';
	};
	
	this.beforeDom=document.createElement("li"); 
	this.beforeDom.innerHTML=this.bdDom.getElementsByTagName('li')[this.imgSlideLength-1].innerHTML,
	this.beforeDom.style.left=-document.getElementsByTagName('body')[0].offsetWidth+'px';
	this.beforeDom.style.position='absolute';
	this.bdDom.appendChild (this.beforeDom)
	this.afterDom=document.createElement("li"); 
	this.afterDom.innerHTML=this.bdDom.getElementsByTagName('li')[0].innerHTML,
	this.bdDom.appendChild (this.afterDom)
	
	this.parentDom.addEventListener('touchstart', function(event) {//准备滑动
		_this.tStart=event.touches[0].clientX;
		_this.tStartY=event.touches[0].clientY;
	}, false);
	this.parentDom.addEventListener('touchmove', function(event) {//正在滑动
		_this.tMove=event.touches[0].clientX;
		_this.tMoveY=event.touches[0].clientY;
		_this.timer ? clearInterval(_this.timer) : '';
		if(Math.abs(_this.tMoveY-_this.tStartY)<Math.abs(_this.tMove-_this.tStart) || _this.horizontal){
			_this.horizontal=true;
			event.preventDefault();
			_this.bdDom.className=_this.bdDom.className.replace(/ animation/g,'');
			_this.bdDom.style.transform="translateX("+(_this.index*_this.bdDom.getElementsByTagName('li')[0].offsetWidth+_this.tMove-_this.tStart)+"px)";
			if(_this.index*_this.bdDom.getElementsByTagName('li')[0].offsetWidth+_this.tMove-_this.tStart>0 && _this.tMove-_this.tStart>0 ){
				_this.index=-_this.imgSlideLength;
				_this.bdDom.style.transform="translateX(-"+_this.imgSlideLength*_this.bdDom.getElementsByTagName('li')[0].offsetWidth+"px)";
			}
			else if(_this.index*_this.bdDom.getElementsByTagName('li')[0].offsetWidth+_this.tMove-_this.tStart<-_this.imgSlideLength*_this.bdDom.getElementsByTagName('li')[0].offsetWidth && _this.tMove-_this.tStart<0){
				_this.index=0;
				_this.bdDom.style.transform="translateX(0)";
			};
		};
	}, false);
	this.parentDom.addEventListener('touchend', function(event) {//停止滑动
		_this.bdDom.className.match('animation')=='animation' ? '' : _this.bdDom.className=_this.bdDom.className+" animation";
		setTimeout(function(){
			_this.horizontal=false;
			_this.tEnd=event.changedTouches[0].clientX;
			if(_this.tEnd-_this.tStart>80){//向右滑动
				_this.index++;
				if(_this.index>0){
					_this.bdDom.className=_this.bdDom.className.replace(/ animation/g,'');
					_this.bdDom.style.transform="translateX(-"+_this.imgSlideLength*_this.bdDom.getElementsByTagName('li')[0].offsetWidth+"px)";
					_this.index=-_this.imgSlideLength;
				};
			}
			else if(_this.tEnd-_this.tStart<-80){//向左滑动
				_this.index--;
				if(_this.index<-_this.imgSlideLength){
					_this.bdDom.className=_this.bdDom.className.replace(/ animation/g,'');
					_this.bdDom.style.transform="translateX(0px)";
					_this.index=0;
				};
			};
			_this.runSlide();
			_this.autoPlay();
		},1);
	}, false);
	
	_this.autoPlay=function(){
		_this.timer ? clearInterval(_this.timer) : '';
		_this.timer=setInterval(function(){
			_this.bdDom.className.match('animation')=='animation' ? '' : _this.bdDom.className=_this.bdDom.className+" animation";
			_this.index--;
			if(_this.index<-_this.imgSlideLength){
				_this.index=0;
			};
			_this.runSlide();
		},param.playTimer ? param.playTimer : 3000)
	}
	
	if(param.autoPlay){
		_this.autoPlay();
	};   
	
	this.runSlide=function(){
		for(var i=0;i<_this.imgSlideLength;i++){
			_this.hdDom.getElementsByTagName('li')[i].className='';
			if(Math.abs(_this.index)<=_this.imgSlideLength-1){
				_this.hdDom.getElementsByTagName('li')[Math.abs(_this.index)].className='on';
			};
			_this.index==-_this.imgSlideLength ? _this.hdDom.getElementsByTagName('li')[0].className='on' : '';
		};
		_this.bdDom.style.transform="translateX("+_this.index*_this.bdDom.getElementsByTagName('li')[0].offsetWidth+"px)";
		_this.bdDom.addEventListener('webkitTransitionEnd', function(){
			if(_this.index*_this.bdDom.getElementsByTagName('li')[0].offsetWidth==-_this.imgSlideLength*_this.bdDom.getElementsByTagName('li')[0].offsetWidth){
				_this.bdDom.style.transform="translateX(0)";
				_this.index=0;
				_this.bdDom.className=_this.bdDom.className.replace(/ animation/g,'');
			}
		}, false);  
	};
	
	if(param.imgClick=='toBig'){//点击图片放大
		for(var i=0;i<_this.parentDom.getElementsByTagName('*').length;i++){
			var toBig=_this.parentDom.getElementsByTagName('*')[i].className;
			if(toBig.match('to-big-wrap')){
				_this.toBigDom=_this.parentDom.getElementsByTagName('*')[i];
			};
		};
		
		_this.bigStart=function(event){//准备滑动
			_this.tStartBig=event.touches[0].clientX;
			_this.tStartYBig=event.touches[0].clientY;
		};
		_this.bigMove=function(event){//正在滑动
			_this.toBigMainDom.className=_this.toBigMainDom.className.replace(/ animation/g,'');
			_this.tMoveBig=event.touches[0].clientX;
			event.preventDefault();
			if(_this.toBigIndex>=_this.imgSlideLength-1 || _this.toBigIndex<=0){
				_this.toBigMainDom.style.transform="translateX("+(_this.toBigIndex*-document.getElementsByTagName('body')[0].offsetWidth+((_this.tMoveBig-_this.tStartBig)/3))+"px)";
			}
			else{
				_this.toBigMainDom.style.transform="translateX("+(_this.toBigIndex*-document.getElementsByTagName('body')[0].offsetWidth+_this.tMoveBig-_this.tStartBig)+"px)";	
			};
		};
		_this.bigEnd=function(event){//停止滑动
			_this.toBigMainDom.className.match('animation')=='animation' ? '' : _this.toBigMainDom.className=_this.toBigMainDom.className+" animation";
			_this.tEndBig=event.changedTouches[0].clientX;
			if(_this.tEndBig-_this.tStartBig>80){//向右滑动
				_this.toBigIndex--;
				_this.toBigIndex<0 ? _this.toBigIndex=0 : '';
			}
			else if(_this.tEndBig-_this.tStartBig<-80){//向左滑动
				_this.toBigIndex++;
				_this.toBigIndex>_this.imgSlideLength-1 ? _this.toBigIndex=_this.imgSlideLength-1 : '';
			};
			setTimeout(function(){
				_this.toBigMainDom.style.transform="translateX("+(_this.toBigIndex*-document.getElementsByTagName('body')[0].offsetWidth)+"px)";	
			},1)	
		};
		
		
		for(var i=0;i<_this.imgSlideLength;i++){
			_this.toBigIndex=0;
			_this.bdDom.getElementsByTagName('li')[i].index=i;
			_this.toBigMainDom=_this.toBigDom.getElementsByTagName('div')[0];
			_this.toBigMainDom.appendChild(document.createElement("img"));
			_this.toBigDom.getElementsByTagName('img')[i].src=_this.bdDom.getElementsByTagName('li')[i].getElementsByTagName('img')[0].src;
			_this.toBigDom.getElementsByTagName('img')[i].style.width=document.getElementsByTagName('body')[0].offsetWidth+'px';
			
			_this.bdDom.getElementsByTagName('li')[i].onclick=function(){
				_this.toBigIndex=this.index;
				_this.toBigMainDom.style.transform="translateX("+(_this.toBigIndex*-document.getElementsByTagName('body')[0].offsetWidth)+"px)";	
				_this.toBigDom.className.match('on')=='on' ? '' : _this.toBigDom.className=_this.toBigDom.className+" on";
				_this.toBigDom.addEventListener('touchstart', _this.bigStart, false);//准备滑动
				_this.toBigDom.addEventListener('touchmove', _this.bigMove, false);//正在滑动
				_this.toBigDom.addEventListener('touchend',_this.bigEnd, false);//停止滑动
			};	
		};
		
		_this.bigClose=_this.toBigDom.getElementsByTagName('i')[0];
		_this.bigClose.onclick=function(){
			_this.toBigDom.className=_this.toBigDom.className.replace(/ on/g,'');
			_this.toBigDom.removeEventListener('touchstart',_this.bigStart,false)
			_this.toBigDom.removeEventListener('touchmove',_this.bigMove,false)
			_this.toBigDom.removeEventListener('touchend',_this.bigEnd,false)
		}
	};
};

function loadMore(param){
	var _this=this;
	this.posiion='upper';
	if(param.dom[0]=='.'){
		for(var i=0;i<document.getElementsByTagName('*').length;i++){
			var allDom=document.getElementsByTagName('*')[i].className;
			if(allDom.match(param.dom.slice(1))){
				_this.parentDom=document.getElementsByTagName('*')[i];
				_this.winHeight=_this.parentDom.offsetHeight;
				for(var i=0;i<_this.parentDom.getElementsByTagName('*').length;i++){
					if(_this.parentDom.getElementsByTagName('*')[i].className.match('load-status')){
						_this.statusTextDom=_this.parentDom.getElementsByTagName('*')[i];
						_this.statusTextDomHeight=_this.statusTextDom.offsetHeight;
					};	
					if(_this.parentDom.getElementsByTagName('*')[i].className.match('upper')){
						_this.upperDom=_this.parentDom.getElementsByTagName('*')[i];
						_this.upperDomHeight=_this.upperDom.offsetHeight;
					};	
					if(_this.parentDom.getElementsByTagName('*')[i].className.match('lower')){
						_this.lowerDom=_this.parentDom.getElementsByTagName('*')[i];
						_this.lowerDomHeight=_this.lowerDom.offsetHeight;
					};	
					if(_this.parentDom.getElementsByTagName('*')[i].className.match('load-more-main')){
						_this.mainDom=_this.parentDom.getElementsByTagName('*')[i];
						_this.mainDom=_this.mainDom.offsetHeight;
					};	
				};
				break;
			};
		};
	}
	else if(param.dom[0]=='#'){
		_this.parentDom=document.getElementById(param.dom.slice(1))
	};
	
	for(var i=0;i<this.parentDom.getElementsByTagName('*').length;i++){
		var touchDom=_this.parentDom.getElementsByTagName('*')[i].className;
		if(touchDom.match('load-more-main')){
			_this.touchDom=_this.parentDom.getElementsByTagName('*')[i];
		};
	};
	
	this.tStart=function(event){//准备滑动
		_this.startY=event.touches[0].clientY;
		_this.startTimestamp=event.timeStamp;
		_this.startSeconds=new Date(event.timeStamp).getSeconds();
		_this.startMilliseconds=new Date(event.timeStamp).getMilliseconds();
		_this.retain ? '' : _this.retain=0;
		if(_this.retain >=-(_this.upperDomHeight-_this.winHeight)){
			_this.position='upper';
		}
		else{
			_this.position='lower';	
		};
	};
	this.tMove=function(event){//正在滑动
		_this.moveY=event.touches[0].clientY;
		if(_this.position=='upper'){
			_this.touchDom.className.match('animation')=='animation' ? _this.touchDom.className=_this.touchDom.className.replace(/ animation/g,'') : '';
			if(_this.retain+_this.moveY-_this.startY>0 || _this.retain+_this.moveY-_this.startY<-(_this.upperDomHeight-_this.winHeight)){
				_this.touchDom.style.transform="translateY("+(_this.retain+(_this.moveY-_this.startY)/2)+"px)";
			}
			else{
				_this.touchDom.style.transform="translateY("+(_this.retain+_this.moveY-_this.startY)+"px)";
			};
			if(_this.retain+_this.moveY-_this.startY<-(_this.upperDomHeight-_this.winHeight+(_this.statusTextDomHeight+100)*2)){
				_this.statusTextDom.innerHTML='松开加载更多~';
				_this.goDown='yes';
			}
			else if(_this.retain+_this.moveY-_this.startY>-(_this.upperDomHeight-_this.winHeight+(_this.statusTextDomHeight+100)*2) && _this.retain+_this.moveY-_this.startY<-(_this.upperDomHeight-_this.winHeight)){
				_this.statusTextDom.innerHTML='往上拉加载更多~';	
				_this.goDown='no';
			};
		}
		else if(_this.position=='lower'){
			_this.touchDom.className.match('animation')=='animation' ? _this.touchDom.className=_this.touchDom.className.replace(/ animation/g,'') : '';
			_this.touchDom.style.transform="translateY("+(_this.retain+_this.moveY-_this.startY)+"px)";
			if(_this.retain+_this.moveY-_this.startY < -(_this.upperDomHeight+_this.statusTextDomHeight) || _this.retain+_this.moveY-_this.startY > -(_this.upperDomHeight+_this.statusTextDomHeight)){
				_this.touchDom.style.transform="translateY("+(_this.retain+(_this.moveY-_this.startY)/2)+"px)";
			}
			else{
				_this.touchDom.style.transform="translateY("+(_this.retain+_this.moveY-_this.startY)+"px)";
			};
			if(_this.retain+_this.moveY-_this.startY > -(_this.statusTextDomHeight+_this.upperDomHeight-(_this.statusTextDomHeight+100)*2)){
				_this.statusTextDom.innerHTML='松开放回上层~';
				_this.goUp='yes';
			}
			else if(_this.retain+_this.moveY-_this.startY < -(_this.statusTextDomHeight+_this.upperDomHeight-(_this.statusTextDomHeight+100)*2) && _this.retain+_this.moveY-_this.startY > -(_this.statusTextDomHeight+_this.upperDomHeight)){
				_this.statusTextDom.innerHTML='往下拉返回上层~';	
				_this.goUp='no';
			};
		}
	};
	this.tEnd=function(event){//停止滑动
		_this.touchDom.removeEventListener('touchstart', _this.tStart, false);//准备滑动
		_this.touchDom.removeEventListener('touchmove', _this.tMove, false);//正在滑动
		_this.touchDom.removeEventListener('touchend',_this.tEnd, false);//停止滑动
		
		_this.endTimestamp=event.timeStamp;
		_this.endSeconds=new Date(event.timeStamp).getSeconds();
		_this.endMilliseconds=new Date(event.timeStamp).getMilliseconds();
		_this.endY=event.changedTouches[0].clientY;
		_this.retain=_this.retain+_this.endY-_this.startY;
		
		if(_this.retain>0){//过顶
			_this.touchDom.className.match('animation')=='animation' ? '' : _this.touchDom.className=_this.touchDom.className+' animation';
			_this.retain=0;
			setTimeout(function(){
				_this.touchDom.style.transform="translateY(0)";		
				_this.refresh();
			},1);
			return false
		}
		else if(_this.retain<-(_this.mainDom-_this.winHeight)){//过底
			_this.touchDom.className.match('animation')=='animation' ? '' : _this.touchDom.className=_this.touchDom.className+' animation';
			_this.retain=-(_this.mainDom-_this.winHeight);
			setTimeout(function(){
				_this.touchDom.style.transform="translateY("+_this.retain+"px)";
				_this.refresh();			
			},1);
			return false
		};
		if(_this.goDown=='yes'){
			_this.touchDom.className.match('animation')=='animation' ? '' : _this.touchDom.className=_this.touchDom.className+' animation';	
			setTimeout(function(){
				_this.retain=-(_this.upperDomHeight+_this.statusTextDomHeight);
				_this.touchDom.style.transform="translateY("+_this.retain+"px)";	
				_this.goDown=false;
				_this.position='upper';
				_this.refresh();	
			},1);
			return false	
		}
		else if(_this.goDown=='no'){
			_this.touchDom.className.match('animation')=='animation' ? '' : _this.touchDom.className=_this.touchDom.className+' animation';	
			setTimeout(function(){
				_this.retain=-(_this.upperDomHeight-_this.winHeight);
				_this.touchDom.style.transform="translateY("+_this.retain+"px)";
				_this.goDown=false;	
				_this.refresh();
			},1);
			return false
		};
		if(_this.goUp=='yes'){
			_this.touchDom.className.match('animation')=='animation' ? '' : _this.touchDom.className=_this.touchDom.className+' animation';	
			setTimeout(function(){
				_this.retain=-(_this.upperDomHeight-_this.winHeight);
				_this.touchDom.style.transform="translateY("+_this.retain+"px)";
				_this.goUp=false;	
				_this.position='lower';
				_this.refresh();
			},1);
			return	false;
		}
		else if(_this.goUp=='no'){
			_this.touchDom.className.match('animation')=='animation' ? '' : _this.touchDom.className=_this.touchDom.className+' animation';	
			setTimeout(function(){
				_this.retain=-(_this.upperDomHeight+_this.statusTextDomHeight);
				_this.touchDom.style.transform="translateY("+_this.retain+"px)";
				_this.goUp=false;	
				_this.refresh();
			},1);
			return false
		};
		
		if(_this.endTimestamp-_this.startTimestamp<60000 && _this.endY-_this.startY != 0){
			_this.upTop=function(){
				_this.touchDom.removeEventListener("webkitTransitionEnd", _this.upTop, false);
				_this.retain=0;															
				_this.touchDom.style.transform="translateY("+_this.retain+"px)";
				_this.refresh();
			};
			_this.upBottom=function(){
				_this.touchDom.removeEventListener("webkitTransitionEnd", _this.upBottom, false);
				_this.retain=-(_this.upperDomHeight-_this.winHeight);															
				_this.touchDom.style.transform="translateY("+_this.retain+"px)";
				_this.refresh();
			};
			_this.downTop=function(){
				_this.touchDom.removeEventListener("webkitTransitionEnd", _this.downTop, false);
				_this.retain=-_this.upperDomHeight-_this.statusTextDomHeight;															
				_this.touchDom.style.transform="translateY("+_this.retain+"px)";
				_this.refresh();
			};
			_this.downBottom=function(){
				_this.touchDom.removeEventListener("webkitTransitionEnd", _this.downBottom, false);
				_this.retain=-(_this.mainDom-_this.winHeight);												
				_this.touchDom.style.transform="translateY("+_this.retain+"px)";
				_this.refresh();
			};
			
			if(_this.endSeconds-_this.startSeconds==0){
				_this.retain=parseInt(_this.retain+(_this.moveY-_this.startY)*50/(_this.endMilliseconds-_this.startMilliseconds));
				_this.touchDom.className.match('animation')=='animation' ? '' : _this.touchDom.className=_this.touchDom.className+' animation';	
				setTimeout(function(){
					if(_this.position=='upper'){
						if(_this.retain>0){
							_this.retain=_this.statusTextDomHeight;
							_this.touchDom.style.transform="translateY("+_this.retain+"px)";
							_this.touchDom.addEventListener("webkitTransitionEnd", _this.upTop, false); 
							return false;
						};
						if(_this.retain < -(_this.upperDomHeight-_this.winHeight)){
							_this.retain=-(_this.upperDomHeight-_this.winHeight+_this.statusTextDomHeight);	
							_this.touchDom.style.transform="translateY("+_this.retain+"px)";
							_this.touchDom.addEventListener("webkitTransitionEnd", _this.upBottom, false); 
							return false;
						};
						_this.touchDom.style.transform="translateY("+_this.retain+"px)";
						_this.touchDom.addEventListener('touchstart', _this.tStart, false);//准备滑动
						_this.touchDom.addEventListener('touchmove', _this.tMove, false);//正在滑动
						_this.touchDom.addEventListener('touchend',_this.tEnd, false);//停止滑动		
					}
					else if(_this.position=='lower'){
						if(_this.retain > -_this.upperDomHeight){
							_this.retain=-_this.upperDomHeight;	
							_this.touchDom.style.transform="translateY("+_this.retain+"px)";
							_this.touchDom.addEventListener("webkitTransitionEnd", _this.downTop, false); 
							return false;
						}
						if(_this.retain < -(_this.mainDom-_this.winHeight)){
							_this.retain=-(_this.mainDom-_this.winHeight+_this.statusTextDomHeight);
							_this.touchDom.style.transform="translateY("+_this.retain+"px)";
							_this.touchDom.addEventListener("webkitTransitionEnd", _this.downBottom, false); 
							return false;
						};
						_this.touchDom.style.transform="translateY("+_this.retain+"px)";	
						_this.refresh();
					}
				},1);
			}
			else if(_this.endSeconds-_this.startSeconds>0 && _this.endSeconds-_this.startSeconds<3){
				_this.retain=parseInt(_this.retain+(_this.moveY-_this.startY)*10/((_this.endMilliseconds-_this.startMilliseconds)+(_this.endSeconds-_this.endSeconds)*1000));
				_this.touchDom.className.match('animation')=='animation' ? '' : _this.touchDom.className=_this.touchDom.className+' animation';	
				setTimeout(function(){
					if(_this.position=='upper'){
						if(_this.retain>0){
							_this.retain=_this.statusTextDomHeight;
							_this.touchDom.style.transform="translateY("+_this.retain+"px)";
							_this.touchDom.addEventListener("webkitTransitionEnd", _this.upTop, false); 
							return false;
						};
						if(_this.retain < -(_this.upperDomHeight-_this.winHeight)){
							_this.retain=-(_this.upperDomHeight-_this.winHeight+_this.statusTextDomHeight);	
							_this.touchDom.style.transform="translateY("+_this.retain+"px)";
							_this.touchDom.addEventListener("webkitTransitionEnd", _this.upBottom, false); 
							return false;
						};
						_this.touchDom.style.transform="translateY("+_this.retain+"px)";
						_this.refresh();	
					}
					else if(_this.position=='lower'){
						if(_this.retain > -_this.upperDomHeight){
							_this.retain=-_this.upperDomHeight;	
							_this.touchDom.style.transform="translateY("+_this.retain+"px)";
							_this.touchDom.addEventListener("webkitTransitionEnd", _this.downTop, false); 
							return false;
						}
						if(_this.retain < -(_this.mainDom-_this.winHeight)){
							_this.retain=-(_this.mainDom-_this.winHeight+_this.statusTextDomHeight);	
							_this.touchDom.style.transform="translateY("+_this.retain+"px)";
							_this.touchDom.addEventListener("webkitTransitionEnd", _this.downBottom, false); 
							return false;
						};
						_this.touchDom.style.transform="translateY("+_this.retain+"px)";	
						_this.refresh();
					}
				},1);
			};
			return false;
		};
		
		_this.refresh();
	};
	
	this.refresh=function(){	
		_this.touchDom.addEventListener('touchstart', _this.tStart, false);//准备滑动
		_this.touchDom.addEventListener('touchmove', _this.tMove, false);//正在滑动
		_this.touchDom.addEventListener('touchend',_this.tEnd, false);//停止滑动
	};
	this.refresh();
}


function swipeDel(param){
	var _this=this;
	_this.isDelStatus=false;
	if(param.dom[0]=='.'){
		for(var i=0;i<document.getElementsByTagName('*').length;i++){
			var allDom=document.getElementsByTagName('*')[i].className;
			if(allDom.match(param.dom.slice(1))){
				_this.parentDom=document.getElementsByTagName('*')[i];
				_this.delBtnWidth=_this.parentDom.getElementsByTagName('a')[0].offsetWidth;
			};
		};
	}
	else if(param.dom[0]=='#'){
		_this.parentDom=document.getElementById(param.dom.slice(1))
	};
	
	this.tStart=function(event){
		this.startX=event.touches[0].clientX;
		this.retain ? '' : this.retain=0;
	};
	this.tMove=function(event){
		this.moveX=event.touches[0].clientX;
		this.getElementsByTagName('div')[0].className.match('animation')=='animation' ? this.getElementsByTagName('div')[0].className=this.getElementsByTagName('div')[0].className.replace(/ animation/g,'') : '';
		if(this.isDelStatus){
			this.getElementsByTagName('div')[0].style.transform="translateX("+(-_this.delBtnWidth+(this.moveX-this.startX)/3)+"px)";
			_this.delBtnWidth+(this.moveX-this.startX)/3>60 ? this.reound=false : this.reound=true;
		}else{
			if(this.retain+(this.moveX-this.startX)>0){
				this.getElementsByTagName('div')[0].style.transform="translateX(0)";	
				return false;
			};
			if(this.moveX-this.startX<-_this.delBtnWidth){
				this.reound=true;
				this.getElementsByTagName('div')[0].style.transform="translateX("+(-_this.delBtnWidth+(this.moveX-this.startX-this.maxSwipe)/3)+"px)";	
			}
			else{
				this.reound=false;
				this.maxSwipe=this.moveX-this.startX;
				this.getElementsByTagName('div')[0].style.transform="translateX("+(this.retain+(this.maxSwipe))+"px)";	
			};	
		}
	};
	this.tEnd=function(event){
		this.getElementsByTagName('div')[0].className.match('animation')=='animation' ? '' : this.getElementsByTagName('div')[0].className=this.getElementsByTagName('div')[0].className+' animation';
		var _self=this;
		setTimeout(function(){
			if(_self.reound){
				_self.isDelStatus=true;
				_self.retain=-_this.delBtnWidth;
				_self.getElementsByTagName('div')[0].style.transform="translateX("+_self.retain+"px)";	
			}
			else{
				_self.isDelStatus=false;
				_self.retain=0;
				_self.getElementsByTagName('div')[0].style.transform="translateX(0)";	
			};
		},1)
	};
	
	for(var i=0;i<this.parentDom.getElementsByTagName('ul')[0].getElementsByTagName('li').length;i++){
		_this.parentDom.getElementsByTagName('ul')[0].getElementsByTagName('li')[i].addEventListener('touchstart', _this.tStart, false);//准备滑动
		_this.parentDom.getElementsByTagName('ul')[0].getElementsByTagName('li')[i].addEventListener('touchmove', _this.tMove, false);//正在滑动
		_this.parentDom.getElementsByTagName('ul')[0].getElementsByTagName('li')[i].addEventListener('touchend',_this.tEnd, false);//停止滑动
	};	
}
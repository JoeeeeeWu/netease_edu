window.onload=function(){
    (function(){
        /*轮播图*/
         /*函数调用关系：_timer > autoPlay > toShow (> startMove > doMove) > getStyle*/
        var _slide = document.querySelector('.m-sld');
        var _lists = _slide.getElementsByTagName('li');
        var _ctrls = _slide.getElementsByTagName('span');
        var _iNow = 0;
        /*给每一个按钮绑定点击事件，当点击按钮时轮播到对应的图片*/
        for(var i=0;i<_ctrls.length;i++){
            _ctrls[i].index = i;
            _ctrls[i].onclick = function(){
                clearInterval(_timer);
                _timer = setInterval(autoPlay,3000);
                _iNow = this.index;
                toShow();
            };
        }
        /* 启动自动轮播，3秒轮播一次*/
        var _timer = setInterval(autoPlay,3000);  

        _slide.onmouseover=function(){
            clearInterval(_timer);
        }

        _slide.onmouseout=function(){
            _timer = setInterval(autoPlay,3000); 
        }

        /*自动轮播函数*/
        function autoPlay(){
            if(_iNow==_lists.length-1){
                _iNow = 0;
            }
            else{
                _iNow++;
            }
            toShow();
        }
       
        
        /*轮播图片展示*/
        function toShow(){
             var zIdx = 3;
            for(var i=0;i<_ctrls.length;i++){
                _ctrls[i].className="";
            }
            /*将所有轮播图片淡出*/
            for(var i=0;i<_lists.length;i++){
                startMove(_lists[i],{opacity:0});
            }
            /*将当前图片对应的按钮class设置为z-crt，class为z-crt的按钮背景为红色*/
            _ctrls[_iNow].className = 'z-crt';
            /*进行轮播当前图片的淡进，z-index增大*/
            startMove(_lists[_iNow],{opacity:100},function(){
                _lists[_iNow].style.zIndex = zIdx++;                    
            });
            /*当前轮播图片淡进，以30毫秒的速度淡进*/
            function startMove(obj,json,fnEnd){
                clearInterval(obj._timer);
                obj._timer = setInterval(function(){
                    doMove(obj,json,fnEnd);
                },30);
                    /*当前轮播图片淡进的关键帧*/
                function doMove(obj,json,fnEnd){
                    var iCur = 0;
                    var attr = null;
                    var bStop = true;
                    for(attr in json){
                        /*针对非IE*/
                        if(attr=='opacity'){
                            if(parseInt(100*getStyle(obj,attr))==0){
                                iCur = parseInt(100*getStyle(obj,attr));
                            }
                            else{
                                iCur = parseInt(100*getStyle(obj,attr)) || 100;
                            }
                        }
                        /*针对IE*/
                        else{
                            iCur = parseInt(getStyle(obj,attr)) || 0;
                        }
                        var iSpeed = (json[attr] - iCur)/5;
                        iSpeed = (iSpeed>0) ? Math.ceil(iSpeed) : Math.floor(iSpeed);
                        if(json[attr]!=iCur){
                            bStop = false;
                        }
                        obj.style.filter = 'alpha(opacity='+ (iCur + iSpeed) +')';
                        obj.style.opacity = (iCur + iSpeed)/100;
                    }
                    /*清除定时器，将当前轮播图片z-index增大*/
                    if(bStop){
                        clearInterval(obj._timer);
                        if(fnEnd){
                            fnEnd.call(obj);
                        }
                    }
                }
            }
        }
    })()
    
    var coursebox=document.querySelector('.m-coursebox');
    var designData=coursebox.querySelector('#designdata');
    var codeData=coursebox.querySelector('#codedata');

    /*获取服务器数据后的回调函数，将数据放进模板，并插进文档中*/
    function insert(data,element){   
        var data = JSON.parse(data);
        var templ='<li class="m-team"><img src="{{smallPhotoUrl}}"><h3 class="coursename f-toe">{{name}}</h3><span class="provider">{{provider}}</span><span class="learnerCount"> {{learnerCount}} </span><strong>{{price}}</strong><a><img src="{{smallPhotoUrl}}"><h3 class="coursename">{{name}}</h3><span class="learnerCount">{{learnerCount}}人在学</span><span class="provider">发布者：{{provider}}</span><span class="clearfix">分类：{{categoryName}}</span><p class="description">{{description}}</p></a></li>';
        var out_templ=[];
        for (var i=0; i<data.list.length;i++){
            if (data.list[i].price==0){
                data.list[i].price="免费";
            }
            else{
                data.list[i].price="￥"+data.list[i].price;
            }
            var _html_templ=templ.replace(/{{smallPhotoUrl}}/g,data.list[i].bigPhotoUrl)
                                 .replace(/{{name}}/g,data.list[i].name)
                                 .replace(/{{provider}}/g,data.list[i].provider)
                                 .replace(/{{learnerCount}}/g,data.list[i].learnerCount)
                                 .replace(/{{categoryName}}/g,data.list[i].categoryName)
                                 .replace(/{{description}}/g,data.list[i].description)
                                 .replace(/{{price}}/g,data.list[i].price);
            out_templ.push(_html_templ);
        }
        element.innerHTML=out_templ.join('');
    }

    get('http://study.163.com/webDev/couresByCategory.htm',insert,{pageNo:1,psize:20,type:10},designData);
    get('http://study.163.com/webDev/couresByCategory.htm',insert,{pageNo:1,psize:20,type:20},codeData);
    
   /* 产品设计与编程语言切换  */  
   var designBtn = coursebox.querySelector('.u-btn1');
   var codeBtn = coursebox.querySelector('.u-btn2');
   var courseDesign = coursebox.querySelector('.m-coursedesign');
   var courseCode = coursebox.querySelector('.m-coursecode');
   var pageDesign = courseDesign.querySelector('.m-page');
   var pageCode = courseCode.querySelector('.m-page');
   var pageNumDesign = pageDesign.querySelectorAll("li");
   var pageNumCode = pageCode.querySelectorAll("li");
   var pageprvDesign = courseDesign.querySelector('.pageprv');
   var pageprvCode = courseCode.querySelector('.pageprv');
   var pagenxtDesign = courseDesign.querySelector('.pagenxt');
   var pagenxtCode = courseCode.querySelector('.pagenxt');

   designBtn.onclick = function(){
        courseDesign.style.display = 'block';
        this.className = 'u-btn1 z-crt';
        courseCode.style.display = 'none';
        codeBtn.className = 'u-btn2';       
    };
    codeBtn.onclick = function(){
        courseDesign.style.display = 'none';
        designBtn.className = 'u-btn1';
        courseCode.style.display = 'block';
        this.className = 'u-btn2 z-crt';
    };
    for(var i=1;i<pageNumDesign.length-1;i++){
        pageNumDesign[i].index=i;
        pageNumCode[i].index=i;
        (function(n){
            pageNumDesign[i].onclick=function(){
                get('http://study.163.com/webDev/couresByCategory.htm',insert,{pageNo:n,psize:20,type:10},designData);
                for(var j=1;j<pageNumDesign.length-1;j++){
                    pageNumDesign[j].className="";
                }
                pageNumDesign[n].className="z-crt";
            };
            pageNumCode[i].onclick=function(){
                get('http://study.163.com/webDev/couresByCategory.htm',insert,{pageNo:n,psize:20,type:20},codeData);
                for(var j=1;j<pageNumDesign.length-1;j++){
                    pageNumCode[j].className="";
                }
                pageNumCode[n].className="z-crt";
            }
        })(i)
    }

    pageprvDesign.onclick=function(){
        var curLi=pageDesign.querySelector(".z-crt");
        var m=curLi.index;
        if(m>1){
            m--;
            for(var x=1;x<pageNumDesign.length-1;x++){
                    pageNumDesign[x].className="";
                }
                pageNumDesign[m].className="z-crt";
            get('http://study.163.com/webDev/couresByCategory.htm',insert,{pageNo:m,psize:20,type:10},designData);
        }
    }

    pagenxtDesign.onclick=function(){
        var curLi=pageDesign.querySelector(".z-crt");
        var m=curLi.index;
        if(m<pageNumDesign.length-2){
            m++;
            for(var x=1;x<pageNumDesign.length-1;x++){
                    pageNumDesign[x].className="";
                }
            pageNumDesign[m].className="z-crt";

            get('http://study.163.com/webDev/couresByCategory.htm',insert,{pageNo:m,psize:20,type:10},designData);
        }
    }

    pageprvCode.onclick=function(){
        var curLi=pageCode.querySelector(".z-crt");
        var m=curLi.index;
        if(m>1){
            m--;
            for(var x=1;x<pageNumCode.length-1;x++){
                    pageNumCode[x].className="";
                }
            pageNumCode[m].className="z-crt";
            get('http://study.163.com/webDev/couresByCategory.htm',insert,{pageNo:m,psize:20,type:20},codeData);
        }
    }

    pagenxtCode.onclick=function(){
        var curLi=pageCode.querySelector(".z-crt");
        var m=curLi.index;
        if(m<pageNumCode.length-2){
            m++;
            for(var x=1;x<pageNumCode.length-1;x++){
                    pageNumCode[x].className="";
                }
                pageNumCode[m].className="z-crt";
            get('http://study.163.com/webDev/couresByCategory.htm',insert,{pageNo:m,psize:20,type:20},codeData);
        }
    };

    /*最热排行特效*/
    (function(){
        var topList=document.querySelector(".m-top");
        /*最热排行*/
        
        get('http://study.163.com/webDev/hotcouresByCategory.htm',function(data){
            var _templ='<li><div><img src="{{smallPhotoUrl}}" alt="hot"></div><span class="name">{{name}}</span><span class="learnerCount">{{learnerCount}}</span></li>';
            var _templOut=[];
            var data = JSON.parse(data);
            for (var i=0; i<data.length;i++){
                var _templIn=_templ.replace(/{{smallPhotoUrl}}/g,data[i].smallPhotoUrl)
                                     .replace(/{{name}}/g,data[i].name)
                                     .replace(/{{learnerCount}}/g,data[i].learnerCount);
                _templOut.push(_templIn);
            }
            topList.innerHTML=_templOut.join('');        
        });
        /*最热排行滚动*/
        var scroll=setInterval(autoscroll,3000); 
        topList.onmouseover = function(){
            clearInterval( scroll );
            };
        topList.onmouseout = function(){
            scroll=setInterval(autoscroll,3000);
            };

        function autoscroll(){
            if( topList.style.top == '-700px'){
                topList.style.top = 0;
            }else{

                topList.style.top = parseFloat(getStyle(topList,'top')) - 70 + 'px';
           }
        }
    })()
    
    
    /*关于cookie的方法要设置两个，一个是获取cookie，一个是设置cookik，之后需要操作cookie的地方都是调用这两个方法*/

   
    var oCookie={
        /*设置cookie,设置时间单位是天*/
        setCookie : function(name,value,d){
            var date=new Date();
            date.setTime(date.getTime()+(d*24*60*60*1000));
            document.cookie=encodeURIComponent(name)+"="+encodeURIComponent(value)+";expires="+date.toGMTString();
        },
        /*设置获取cookie*/
        getCookie : function(name){
            var list=document.cookie.split(";");
            for(var i=0;i<list.length;i++){
                var item=list[i].split("=");
                if(item[0].replace(/(^\s*)|(\s*$)/g, "")===name){
                    return encodeURIComponent(item[1]);
                }
            }
        },
         /*设置删除cookie*/
         removeCookie : function(name){
             this.setCookie(name,"",-1);
         }
    };
    

    /*顶栏的事件绑定和cookie设置*/
    (function(){
        var topBar=document.querySelector(".m-topBar");
        var close=topBar.getElementsByTagName("span");
        if(oCookie.getCookie("close")){
            topBar.style.display="none";
        }else{
            close[0].onclick=function(){
                topBar.style.display="none";
                oCookie.setCookie("close",1,2);
            }
        }
    })();

    /*点击"关注"显示登录框*/
    (function(){
        var _followBtn=document.querySelector(".follow");
        var _layer=document.querySelector(".m-layer");
        var _followCleBtn=document.querySelector(".followcle");  
        var _logIpt=_layer.querySelectorAll("input");
        var _logLab=_layer.querySelectorAll("label");
        var _closeBtn=_layer.querySelector(".close");
        var _submitBtn=_layer.querySelector(".submit");
       if(!oCookie.getCookie("loginSuc")){
            _followBtn.onclick=function(){
                _layer.style.display="block";
            }
        }else {
            _followBtn.onclick=function(){
                oCookie.setCookie("followSuc","1",2);
                _followBtn.value="已关注";
                _followBtn.disabled=true;
                _followCleBtn.style.display="inline-block";
            }
            if(oCookie.getCookie("followSuc")){  
            _followBtn.value="已关注";
            _followBtn.disabled=true;
            _followCleBtn.style.display="inline-block";
            }       
        }

        _closeBtn.onclick=function(){
            _layer.style.display="none";
        }

         function focus(i){
            _logIpt[i].onfocus=function(){
                _logLab[i].style.display="none";
            }
            _logIpt[i].onblur=function(){
                if(this.value==""){
                    _logLab[i].style.display="block";
                }
            }
         }
         focus(0);
         focus(1);
         /*点击登录按钮*/
         _submitBtn.onclick=function(){
            var userName1=hex_md5(_logIpt[0].value);
            var password1=hex_md5(_logIpt[1].value);
            get("http://study.163.com/webDev/login.htm",submitMsg,{userName:userName1,password:password1});
         }

         function submitMsg(a){
            if(a==="1"){
                _layer.style.display="none";
                oCookie.setCookie("loginSuc","1",2);
                get("http://study.163.com/webDev/attention.htm",function(b){
                    if(b==="1"){
                        oCookie.setCookie("followSuc","1",2);
                        _followBtn.value="已关注";
                        _followBtn.disabled=true;
                        _followCleBtn.style.display="inline-block";
                        _followBtn.onclick=function(){
                            oCookie.setCookie("followSuc","1",2);
                            _followBtn.value="已关注";
                            _followBtn.disabled=true;
                            _followCleBtn.style.display="inline-block";
                        };
                    }
                },"")
                }else{
                  alert("帐号密码错误，请重新输入");
                }
         }
         _followCleBtn.onclick=function(){
            oCookie.removeCookie("followSuc");
            _followBtn.value="+ 关注";
            _followBtn.disabled=false;
            this.style.display="none";
         }     
    })();

    /*视频播放*/
    (function(){
        var poster=document.querySelector(".poster");
        var videop=document.querySelector(".m-layer1");
        var closeVideo=videop.querySelector(".close");
        var myVideo=videop.getElementsByTagName("video")[0];
        poster.onclick=function(){
            videop.style.display="block";
        }
        closeVideo.onclick=function(){
            videop.style.display="none";
            myVideo.pause();
        }
    })()

    /*获取元素的最终style（兼容IE6、7、8）*/
    function getStyle(obj,attr){
        if(obj.currentStyle){
            return obj.currentStyle[attr];
        }
        else{
            return getComputedStyle(obj)[attr];
        }
    }

       /*ajax异步获取方法*/
   function get(url,callback,options,elem){
        var xhr=new XMLHttpRequest();
        /*请求参数序列化*/
        function serialize(data){
            if(!data) return '';
            var pairs=[];
            for (var name in data){
                if(!data.hasOwnProperty(name)) continue;
                if(typeof data[name]==='function') continue;
                var value=data[name].toString();
                name=encodeURIComponent(name);
                value=encodeURIComponent(value);
                pairs.push(name+'='+value);
            }
            return pairs.join('&');
        }
        xhr.onreadystatechange=function(){
            if (xhr.readyState==4){
                if((xhr.status>=200 && xhr.status<300) || xhr.status==304){
                    callback(xhr.responseText,elem);
                }else{
                    alert("request failed:"+xhr.status);
                }
            }    
        }
        if(options==undefined){
           
            xhr.open("get",url,true);
        }
        else{
            xhr.open("get",url+"?"+serialize(options),true);
        }
        xhr.send(null);
    }

}
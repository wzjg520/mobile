/**
 * Created by Alan on 14-7-31.
 * Email: 1480801@qq.com
 */
var jq = jQuery.noConflict();
var app = app || {};
app.Client = {};
app.Client.isIOS = ( /iPhone|iPod|iPad/i ).test( navigator.userAgent );
app.Client.isAndroid = ( /Android/i ).test( navigator.userAgent );
app.Client.isMobile = app.Client.isIOS || app.Client.isAndroid;

window.onload=function(){setTimeout(scrollTo,0,0,0);}
jq(function(){
    jq('.active').on('touchstart',function(){jq(this).addClass('activeStyle');}).on('touchend',function(){jq(this).removeClass('activeStyle');});
    jq('#M_navi,#M_order').on('touchstart',function(){
        var _offsetHeight = jq(this).height();
        jq(this).next('.navi-Sub').toggle().css({bottom:_offsetHeight});
        jq(this).toggleClass('cur');
    });

    jq('#cityMore .cityList>li').on('touchend',function(){
        var _cityName= jq(this).attr('data-name');
        jq(this).addClass('selectedIcon').siblings().removeAttr('class');
        jq('#cityMore').hide('fast');
        jq('#P_Header .m-city').removeClass('on').find('var').text(_cityName);
    });
});


//返回顶部
jq.backTop = function(){
    var _backTopBox = jq('<div>',{'id':'backTop','class':'backTop'}).appendTo("body");
    _backTopBox.append(jq('<div>',{'class':'center'}).text('TOP'));
    var scroller = jq('#scroller');
    _backTopBox.on('touchstart',function(){
        if(scroller.length==0){
            jq('html,body').scrollTop(0);
        }else{
            jq('#scroller').css({'transform':' translate(0px, 0px) translateZ(0px)','transition':' -webkit-transform 0ms cubic-bezier(0.33, 0.66, 0.66, 1)'})
        }
    });
};

function loadImg(obj){
    setTimeout(function(){
        jq('.proImg', obj).each(function(){
            var imgEle = jq(this);
            imgEle.attr('src',imgEle.attr('data-img')).removeAttr('data-img');
        });
    },600);
}

//自定义弹窗
app.Popup = {
    templates: ['<div class="Popup Popup-box alanDialog">',
        '<div class="Popup-Content"> ',
        '<table class="pop_table_border">',
        '<tr>',
        '<td>','<table class="alan_dialog">',
        '<tr>','<td class="pop_frame"></td>','</tr>','</table>',
        '</td>',
        '</tr>',
        '</table>',
        '</div>',
        '</div>',
    ].join(''),
    top: function(obj){
        return (jq(window).height() - obj.height()) / 2;  //CSS属性为position:fixed时启用开行
    },
    left: function(obj){
        return (jq(window).width() - obj.width()) / 2 + jq(window).scrollLeft() + (jq('html').hasClass('sift-move') && !obj.hasClass('Popup-Content') ? jq(window).width() : 0);
    },
    setPosition: function(obj){
        var top = this.top(obj),left = this.left(obj);
        top = top < 0 ? 0 : top,left = left < 0 ? 0 : left;
        obj.css({left:left,top:top,zIndex:8888,display:'block'});
    },
    Loading : function(isVisible, options){//是否显示loading
        options = jq.extend({
            autoClose:false,
            Speed:1000,
            text:"正在查询中，请稍后...",
            parentEle:"body",
            autoTop:true,
            extend:function(){}
        },options);
        jq("#loading").remove();
        if (options.autoClose){
            setTimeout(function(){
                app.Popup.Loading(false)
            },options.Speed)
        }
        if(!isVisible) return;
        var obj = jq("<div>",{"id":"loading","class":"loading"}).text(options.text).append('<img src="/loading2.gif" width="32" height="32" />');
        if(options.autoTop){
            obj.css({top:jq(options.parentEle).offset()['top']});
        }else{
            obj.css({top:0});
        }
        jq(options.parentEle).append(obj);
        options.extend(obj);
    },
    dialog : function(options){
        options = jq.extend({
            id:"popup_Dialog",
            closeEle:".close",
            LayerVisible:true,
            content:"",
            Init:function(){},
            closeFun:function(){}
        },options);
        var popupObj = jq(this.templates).attr({"id":options.id});
        popupObj.find(".pop_frame").append('<div class="pop_content"></div>');

        if(jq("#"+options.id).length>0){
            popupObj = jq("#"+options.id);
            popupObj.find(".pop_title").text(options.title);
        }else{
            popupObj.appendTo("#eyepp_v01");
        }

        if(typeof options.content == "function"){
            options.content(popupObj);
        }else{
            popupObj.find(".pop_frame").html(options.content);
        }

        this.setPosition(popupObj.find('.Popup-Content'));
        jq(window).resize(function(){
            app.Popup.setPosition(popupObj.find('.Popup-Content'));
        });

        options.Init(popupObj);
        jq(options.closeEle,jq("#"+options.id)).click(function(){
            options.closeFun(popupObj);
            jq(popupObj).hide('fast',function(){
                jq(popupObj).remove();
                return false;
            });
        });
    },
    alert : function(content,options){
        options = jq.extend({
            id:"pop_alert",
            width:"220",
            Speed:3000,
            Init:function(){}
        },options);
        var templates = [
            '<div class="Popup-Float-Wrap">',
            '<div class="modeMsg">',
            '<div class="content">' + content + '</div>',
            '</div>',
            '</div>'
        ].join('');
        var popupObj = jq(templates).attr({"id":options.id});


        options.Init(popupObj);
        if(jq("#"+options.id).length>0){
            popupObj = jq("#"+options.id);
        }else{
            popupObj.appendTo("body");
        }

        this.setPosition(popupObj);
        jq(window).resize(function(){
            app.Popup.setPosition(popupObj);
        });
        popupObj.css({opacity:1}).one('webkitTransitionEnd',function(){jq(this).addClass('shadow');});
        options.Init(popupObj);
        setTimeout(function(){
            //jq(popupObj).remove();
            jq(popupObj).css({opacity:0}).one('webkitTransitionEnd',function(){jq(this).remove();});;

        },options.Speed);
    },
    confirm : function(content,options){
        options = jq.extend({
            id:"pop_confirm",
            cancelEle:".cancel",
            LayerVisible:true,
            okVal:"确定",
            ok:function(){},
            cancelVal:"取消",
            cancel:function(){},
            isClose:false,
            Init:function(){}
        },options);
        var templates = [
            '<div class="confirm-content">'+content+'</div>',
            '<div class="btn-box">',
            '<span class="cancel">'+options.cancelVal+'</span>',
            '<span class="ok">'+options.okVal+'</span>',
            '</div>'
        ].join('');

        var popupObj = jq(this.templates).attr({"id":options.id}).addClass('pop_confirm');
        popupObj.appendTo("#eyepp_v01");
        popupObj.find(".pop_frame").html(templates);

        this.setPosition(popupObj.find('.Popup-Content'));
        jq(window).resize(function(){
            app.Popup.setPosition(popupObj.find('.Popup-Content'));
        });
        options.Init(popupObj);
        jq(popupObj).delegate('.cancel,.ok','touchstart',function(e){
            var _event = e.originalEvent.changedTouches[0];
            var _X = _event.clientX,_Y = _event.clientY;
            jq(this).one('touchend',function(e){
                var _event = e.originalEvent.changedTouches[0];
                if(_X==_event.clientX&&_Y==_event.clientY){
                    if(jq(this).hasClass('cancel')){
                        jq(popupObj).hide();
                        jq(popupObj).remove();
                        options.cancel();
                        return false;
                    }else if(jq(this).hasClass('ok')){
                        jq(popupObj).remove();
                        options.ok(popupObj);
                    }
                }
            });
        });
    },
    closePopup : function(obj){//清空所有弹出层
        if(obj){
            jq(obj).remove();
        }else{
            jq('.Popup').remove();
        }
    }
};
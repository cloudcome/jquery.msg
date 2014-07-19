/*!
 * jquery.msg.js
 * @author ydr.me
 * @versio 1.1
 * 2014年6月21日20:55:17
 */







module.exports = function($){
    'use strict';

    var prefix = 'jquery_msg____',
        udf,
        win = window,
        defaults = {
            // 动画时间
            duration: 123,

            // 延迟消失时间，默认3s
            // 如果有button时，则不会自动消失
            delay: 3000,

            // 按钮
            // 如果存在按钮，则不会自动消失
            // 可以是单个按钮，也可以是多个按钮
            // 因为按钮是有顺序之分的，因此是一个数组
            // 格式如下：
            // [
            //     "确定": function(){
            //        alert("你单击了确定");
            //     },
            //     "取消": function(){
            //        alert("你单击了取消");
            //     }
            // ]
            buttons: null,

            // 指定按下 ESC 后触发的按钮，默认触发最后一个按钮事件
            // 比如上面定义的2个按钮，定义触发取消事件，
            // 那么此处填1，即第2个按钮索引
            esc: -1,

            // 标题，为空不显示
            title: '提示',

            // 消息内容
            msg: 'Hi!',

            // 消息类型:inverse/warning/error/success/info/muted(默认)
            type: 'muted',

            // 层级
            zIndex: 99999,

            // 消息位置，默认水平垂直居中
            position: null
        },
        // 上一条消息实例对象
        lastMsg,
        timeid;
        


    $.msg = function(type, msg){
        var options = {};
        if($.type(type)==='object') options = type;
        else if(arguments.length===2){
            options.type = type;
            options.msg = msg;
        }else options.msg = type;
        
        return new Msg($.extend({}, defaults, options))._init();
    };
    $.msg.defaults = defaults;

    
    // 鼠标悬停与移开
    $(document)
    .on('mouseenter', '.' + prefix, function(){
        if(timeid) clearTimeout(timeid);
    })
    .on('mouseleave', '.' + prefix, function(){
        if(timeid) clearTimeout(timeid);
        if(lastMsg && !lastMsg.options.buttons){
            timeid = setTimeout(function(){
                lastMsg.hide();
            }, lastMsg.options.delay);
        }
    })
    .on('click', '.' + prefix + ' button', function(e){
        if(lastMsg) lastMsg.hide(e);
    })
    .keyup(function(e){
        if(e.which==27 && lastMsg) lastMsg.hide();
    });


    function Msg(options){
        this.options = options;
    }

    Msg.prototype = {
        _init: function(){
            var that = this, 
                options = that.options, 
                width = 100/(options.buttons && options.buttons.length||1) + '%',
                html = '<div style="display:none" class="' + prefix + ' ' + prefix + options.type + '">';
            if(options.title)html+='<div class="' + prefix + 'title">'+options.title+'</div>';
            html  += '<div class="' + prefix + 'body">' + options.msg + '</div>';
            
            if(options.buttons){
                that.callbacks = [];
                html+='<div class="' + prefix + 'footer">';
                $.each(options.buttons, function(index, button){
                    var keyval = _getKeyVal(button);
                    html += '<button style="width:'+width+'" class="' + prefix + 'button">' + keyval.key + '</button>';
                    that.callbacks.push(keyval.val);
                });
                html += '</div>';
                that.$bg = $('<div/>').appendTo('body').css({
                    position: 'fixed',
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0,
                    zIndex: options.zIndex-1
                });
            }

            that.$msg = $(html + '</div>').appendTo('body');
            that._show();

            return that;
        },
        _show: function(){
            var that = this,
                options = that.options,
                $msg = that.$msg,
                winW = $(win).width(),
                winH = $(win).height(),
                theW = $msg.outerWidth(),
                theH = $msg.outerHeight(),
                pos = {
                    left: options.position && options.position.left!==udf ? options.position.left : (winW-theW)/2,
                    top: options.position && options.position.top!==udf ? options.position.top : (winH-theH)/3
                };

            if(pos.left<0) pos.left = 0;
            if(pos.top<0) pos.top = 0;

            $msg.css(pos);

            if(lastMsg){
                lastMsg.hide(function(){
                    $msg.fadeIn(options.duration);
                    next();
                });
            }
            else{
                $msg.fadeIn(options.duration);
                next();
            }

            function next(){
                lastMsg = that;
                $msg.data(prefix, that);
                
                if(timeid) clearTimeout(timeid);
                if(!options.buttons){
                    timeid = setTimeout(function(){
                        that.hide();
                    }, options.delay);
                }
            }
        },
        hide: function(callback_event){
            var that = this,
                options = that.options,
                $msg = that.$msg,
                isAutoHide = $.isFunction(callback_event),
                callback = isAutoHide ? callback_event : $.noop,
                e = isAutoHide ? udf: callback_event;

            if(timeid) clearTimeout(timeid);
            timeid = 0;

            $msg.stop(!0, !0).fadeOut(options.duration, function(){
                var index, cb;
                $msg.remove();
                lastMsg = null;
                if(that.$bg) that.$bg.remove();
                callback();

                // 不是自动关闭的 && 有按钮的
                if(!isAutoHide && that.options.buttons){
                    index = e && $(e.target).length ? $(e.target).index() : options.esc;
                    cb = that.callbacks.slice(index);
                    cb = cb.length ? cb[0] : $.noop;
                    cb();
                }
            });
        }
    };

    function _getKeyVal(obj){
        for(var i in obj)
            return {
                key: i,
                val: obj[i]
            };
    }
};

# jquery.msg [![spm version](http://spmjs.io/badge/jquery.msg)](http://spmjs.io/package/jquery.msg)
弹出指定格式、样式消息，可以是alert、confirm等其他类型信息

# DEMO
[http://festatic.aliapp.com/js/jquery.msg/](http://festatic.aliapp.com/js/jquery.msg/)


#USAGE
**index.html**
```
<script src="sea.js"></script>
<script src="sea-style.js"></script>
<script>
    seajs.config({
        base: 'path/to/dist'
    });
    seajs.use('demo');
</script>
```

**demo.js**
```
var $ = require('jquery');
require('jquery.msg.css');
require('jquery.msg')($);

// 1. 弹出消息，
$.msg("msg");


// 2. 弹出指定类型消息，
$.msg("type","msg");


// 3. 详细配置弹出消息
$.msg(settings);
```



#DEFAULTS
```
$.msg.defaults = {
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
};
```

//缓存方法的封装
var cache = {
    "set": function(key, value, endtime) {
        var key = arguments[0] ? arguments[0] : '';
        var value = arguments[1] ? arguments[1] : '';
        var endtime = arguments[2] ? arguments[2] : 30 * 60 * 1000;

        if (key == '') {
            return false;
        }
        if (key && value == '') {
            return cache.del(key);
        }
        if (key && value != '') {
            var saveobj = {
                data: value,
                //time: time(), //保存时间
                etime: time() + endtime
            }
            localStorage.setItem(key, JSON.stringify(saveobj));
            return true;
        }
    },
    "clear": function() {
        localStorage.clear();
    },
    "del": function(key) {
        localStorage.removeItem(key);
    },
    "get": function(key) {
        var res = json_decode(localStorage.getItem(key));
        if (!res) {
            return false;
        }
        if (res.etime < time()) {
            localStorage.removeItem(key);
            return false;
        }else{
            this.set(key,res.data);
        }
        return res.data;
    },
    "all": function() {
        var a = new Array();
        for (var i = 0; i < localStorage.length; i++) {
            var key = localStorage.key(i);
            var res = json_decode(localStorage.getItem(localStorage.key(i)));
            if (res.etime < time()) {
                localStorage.removeItem(key);
            } else {
                a[key] = res.data;
            }
        }
        return a;
    },
    "gc": function() {
        var ctime = time();
        for (var i = 0; i < localStorage.length; i++) {
            var key = localStorage.key(i);
            var res = json_decode(localStorage.getItem(localStorage.key(i)));
            if (res.etime < time()) {
                localStorage.removeItem(key);
            }
        }
    },
    "init": function() {
        var s = arguments[0] ? arguments[0] : 3;
        s = s * 1000;
        cache.gc();
        setInterval(function() {
            cache.gc();
        }, s);
    }
}
 
//Json数值处理
function json_encode(obj) {
    return JSON.stringify(obj)
}
 
function json_decode(s) {
    var j = eval('(' + s + ')');
    return j;
}
 
//获取当前时间戳
function time() {
    return Math.floor(new Date().getTime());
}

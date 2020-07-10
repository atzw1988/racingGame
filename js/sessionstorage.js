//缓存方法的封装
var sessioncache = {
    "set": function(key, value) {
        var key = arguments[0] ? arguments[0] : '';
        var value = arguments[1] ? arguments[1] : '';
        if (key == '') {
            return false;
        }
        if (key && value == '') {
            return cache.del(key);
        }
        if (key && value != '') {
            var saveobj = {
                data: value,
            }
            sessionStorage.setItem(key, JSON.stringify(saveobj));
            return true;
        }
    },
    "clear": function() {
        sessionStorage.clear();
    },
    "del": function(key) {
        sessionStorage.removeItem(key);
    },
    "get": function(key) {
        var res = json_decode(sessionStorage.getItem(key));
        if (!res) {
            return false;
        }else{
            this.set(key,res.data);
        }
        return res.data;
    },
    "all": function() {
        var a = new Array();
        for (var i = 0; i < sessionStorage.length; i++) {
            var key = sessionStorage.key(i);
            var res = json_decode(sessionStorage.getItem(sessionStorage.key(i)));
            a[key] = res.data;
        }
        return a;
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

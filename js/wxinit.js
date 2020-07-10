var customShareKey;
var customId;
var shareDataKey = "shareData";
var shareLink;
var wxinit = {
    "init": function wxinit() {
        var useragent = navigator.userAgent;
        // if (useragent.match(/MicroMessenger/i) != 'MicroMessenger') {
        //     alert('已禁止本次访问：您必须使用微信内置浏览器访问本页面！');
        // }
        var url = location.href.split('#')[0];//url不能写死
        console.log(url)
        $.ajax({
            type: "get",
            url: "/activity/api/wx/ticket",
            dataType: "json",
            async: false,
            data: {url: url},
            success: function (data) {
                console.log(data);
                if (data.success) {
                    wx.config({
                        debug: false,////生产环境需要关闭debug模式
                        appId: data.data.appId,//appId通过微信服务号后台查看
                        timestamp: data.data.timestamp,//生成签名的时间戳
                        nonceStr: data.data.nonceStr,//生成签名的随机字符串
                        signature: data.data.signature,//签名
                        jsApiList: [//需要调用的JS接口列表
                            'checkJsApi',//判断当前客户端版本是否支持指定JS接口
                            'onMenuShareTimeline',//分享给好友
                            'onMenuShareAppMessage',//分享到朋友圈
                            'translateVoice',//隐藏部分分享功能
                            "hideMenuItems",//隐藏部分分享功能
                            "showMenuItems",//显示部分分享功能
                            "hideAllNonBaseMenuItem",
                            "showAllNonBaseMenuItem"
                        ]
                    });
                    wx.ready(function () {
                        var shareData = cache.get(shareDataKey);
                        if (shareData == false) {
                            shareData = addShare();
                            cache.set(shareDataKey, JSON.stringify(shareData))
                        } else {
                            shareData = JSON.parse(shareData);
                        }
                        wx.onMenuShareAppMessage({
                            title: shareData.title, // 分享标题
                            desc: shareData.desc, // 分享描述
                            link: shareData.link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                            imgUrl: shareData.imgUrl, // 分享图标
                            type: '', // 分享类型,music、video或link，不填默认为link
                            dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                            success: function (e) {// 用户确认分享后执行的回调函数
                                console.log(e);
                                var data = {
                                    shareId: shareData.shareId,
                                    shareType: 1,
                                    status: 1
                                };
                                confirmShare(data);
                            },
                            cancel: function (e) {// 用户取消分享后执行的回调函数
                                console.log(e);
                                var data = {
                                    shareId: shareData.shareId,
                                    shareType: 1,
                                    status: 0
                                };
                                confirmShare(data);
                            }
                        });
                        //分享朋友圈
                        wx.onMenuShareTimeline({
                            title: shareData.title,
                            desc: shareData.desc,
                            link: shareData.link,
                            imgUrl: shareData.imgUrl,// 自定义图标
                            trigger: function (res) {
                            },
                            success: function (res) {
                                var data = {
                                    shareId: shareData.shareId,
                                    shareType: 2,
                                    status: 1
                                };
                                confirmShare(data);
                            },
                            cancel: function (res) {
                                var data = {
                                    shareId: shareData.shareId,
                                    shareType: 2,
                                    status: 0
                                };
                                confirmShare(data);
                            },
                            fail: function (res) {
                                //alert(JSON.stringify(res));
                            }
                        });
                        wx.error(function (res) {
                            console.log(res);
                            alert(res.errMsg);
                        });
                    });
                }
            },
            error: function (xhr, status, error) {
            }
        });
    },
    "clearShareData": function clearShareData() {

    },
    "setCustomShareKey":function (customKey) {
        customShareKey = customKey;
    },
    "setCustomId":function (id) {
        customId = id;
    },
    "setShareDataKey":function (key) {
        shareDataKey = key;
        cache.del(shareDataKey);
    }
};

function addShare() {
    var returnData;
    var data = {
        openid: cache.get('openid'),
        subscribe: cache.get('subscribe'),
        activityId: cache.get('activityId'),
        activityType: cache.get('activityType'),
        activityTypeId: cache.get('activityTypeId'),
        nowUrl: location.href.split('#')[0],
        status: -1
    };
    if (customShareKey) {
        data.customShareKey = customShareKey;
    }
    if(customId){
        data.customId = customId;
    }
    $.ajax({
        type: "POST",
        url: "/activity/api/activityShare/setShare",
        dataType: "json",
        contentType: "application/json",
        async: false,
        data: JSON.stringify(data),
        success: function (data) {
            if (data.success) {
                returnData = data.data;
                shareLink = data.data.link;
            } else {

            }
        },
        error: function (msg) {

        }
    });
    return returnData;
}

function confirmShare(data) {
    $.ajax({
        type: "POST",
        url: "/activity/api/activityShare/confirmShare",
        dataType: "json",
        contentType: "application/json",
        async: false,
        data: JSON.stringify(data),
        success: function (data) {
            if (data.success) {

            } else {

            }
        },
        error: function (msg) {

        }
    });
}


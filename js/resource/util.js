var AppUtil = (function () {　　　
    var _this = {};

    _this.Init = function () {
        // 构造函数代码 
        InitMetaData();
        return _this;
    };

    var InitMetaData = function () {　　　　
        var jd = {};　　　　　　
        jd.image = '#spec-n1 img';　　
        jd.name = '.sku-name';
        jd.price　　 = '.price';

        var meta = {
            jd: jd
        }

        localStorage.setItem('AppMeta', JSON.stringify(meta));

        return;
    }　　

    //judge element is empty
    _this.isEmpty = function (element) {
        if (element == null || element == undefined || element == '' || (Object.prototype.isPrototypeOf(element) && Object.keys(element).length == 0)) {
            return true;
        } else {
            return false
        }
    }

    //judge url is image request
    _this.JudgeURLIsImage = function (url) {
        var reg = /(http|https)?:\/\/.+\.(jpg|bmp|gif|png|jpeg).*/i;
        return reg.test(url);
    }

    // parse the url
    _this.ParseURL = function (url) {
        //创建一个a标签
        var a = document.createElement('a');
        //将url赋值给标签的href属性。
        a.href = url;
        return {
            source: url,
            protocol: a.protocol.replace(':', ''), //协议
            host: a.hostname, //主机名称
            port: a.port, //端口
            query: a.search, //查询字符串
            params: (function () { //查询参数
                var ret = {},
                    seg = a.search.replace(/^\?/, '').split('&'),
                    len = seg.length,
                    i = 0,
                    s;
                for (; i < len; i++) {
                    if (!seg[i]) {
                        continue;
                    }
                    s = seg[i].split('=');
                    ret[s[0]] = s[1];
                }
                return ret;
            })(),
            file: (a.pathname.match(/\/([^\/?#]+)$/i) || [, ''])[1], //文件名
            hash: a.hash.replace('#', ''), //哈希参数
            path: a.pathname.replace(/^([^\/])/, '/$1'), //路径
            relative: (a.href.match(/tps?:\/\/[^\/]+(.+)/) || [, ''])[1], //相对路径
            segments: a.pathname.replace(/^\//, '').split('/') //路径片段
        };
    }

    return _this;
}());
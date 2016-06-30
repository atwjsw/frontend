// 0.1 跨域AJAX方法
//------------------------------------------------------------------------------------------
//创建XHR对象. 浏览器兼容
function createCORSRequest(method, url) {
    var xhr = new XMLHttpRequest();
    if ("withCredentials" in xhr) {
        // XHR for Chrome/Firefox/Opera/Safari.
        xhr.open(method, url, true);
    } else if (typeof XDomainRequest != "undefined") {
        // XDomainRequest for IE.
        xhr = new XDomainRequest();
        xhr.open(method, url);
    } else {
        // CORS not supported.
        xhr = null;
    }
    return xhr;
}

// 触发跨域请求CORS request.
function makeCorsRequest(url, options, method, callback) {
    var URL = url + "?" + serialize(options);
    var text = null;
    var xhr = createCORSRequest(method, URL);
    if (!xhr) {
        console.log('CORS not supported');
        return;
    }
    // Response handlers.
    xhr.onload = function() {
        text = xhr.responseText;
        callback(text);
    };
    xhr.onerror = function() {
        console.log('Woops, there was an error making the request.');
        return -1;
    };
    xhr.send();
}

//生成参数串
function serialize(data) {
    if (!data) {
        return '';
    }
    var pairs = [];
    for (var name in data) {
        if (!data.hasOwnProperty(name)) {
            continue;
        }
        if (typeof data[name] === 'function') {
            continue;
        }
        var value = data[name].toString();
        name = encodeURIComponent(name);
        value = encodeURIComponent(value);
        pairs.push(name + '=' + value);
    }
    return pairs.join('&');
}

//0.2 Cookie操作
//------------------------------------------------------------------------------------------
function setCookie(name, value, iTime) {
    var oDate = new Date();
    oDate.setDate(oDate.getDate() + iTime);
    document.cookie = name + '=' + value + ';expires=' + oDate.toGMTString();
}

function getCookie(name) {
    var arr = document.cookie.split("; ");
    for (var i = 0; i < arr.length; i++) {
        if (arr[i].split("=")[0] == name) {
            return arr[i].split("=")[1];
        }
    }
    return '';
}

function removeCookie(name) {
    setCookie(name, 1, -1);
}

//0.3 以下为Utility类通用函数
//------------------------------------------------------------------------------------------
//选择器，兼容IE8/9
var $ = function(selector) {
    return Array.prototype.concat.apply([], document.querySelectorAll(selector)).slice();
}

//for each兼容IE8/9
if (typeof Array.prototype.forEach != 'function') {
    Array.prototype.forEach = function(callback) {
        for (var i = 0; i < this.length; i++) {
            callback.apply(this, [this[i], i, this]);
        }
    };
}

//事件处理浏览器兼容
function addEvent(node, event, handler) {
    if (!!node.addEventListener) {
        node.addEventListener(event, handler);
    } else {
        node.attachEvent('on' + event, handler);
    }
}

//获取事件对象浏览器兼容
function getTarget(evt) {
    evt = evt || window.event;
    var targetElement = evt.target || evt.srcElement;
    if (targetElement.nodeName.toLowerCase() == 'li') {
        return targetElement;
    } else if (targetElement.parentNode.nodeName.toLowerCase() == 'li') {
        return targetElement.parentNode;
    } else {
        return targetElement;
    }
}

//获取事件对象浏览器兼容
function getStyle(el, prop) {
    if (window.getComputedStyle) {
        return window.getComputedStyle(el).getPropertyValue(prop);
    } else {
        return el.currentStyle[prop];
    }
}

//Array.trim()方法浏览器兼容
if (!String.prototype.trim) {
    String.prototype.trim = function() {
        return this.replace(/(^\s*)|(\s*$)/g, "");
    }
};

//CSS类切换方法
var util = (function() {
    return {
        addClass: function(node, className) {
            var current = node.className || "";
            if ((" " + current + " ").indexOf(" " + className + " ") === -1) {
                node.className = current ? (current + " " + className) : className;
            }
        },
        delClass: function(node, className) {
            var current = node.className || "";
            node.className = (" " + current + " ").replace(" " + className + " ", " ").trim();
        }
    }
})()

//1.1 关闭顶部通知条 - 通过Cookie实现不再提醒
//-----------------------------------------------------------------------------------
if (getCookie("reminder")) {
    $('.g-notice')[0].style.display = "none";
}

//点击不再提醒按钮，设置Cookie，关闭通知条
addEvent($('.g-notice a.noremind')[0], "click", function() {
    setCookie("reminder", "true", 30);
    $('.g-notice')[0].style.display = "none";
    return false;
});

//1.2 关注“网易教育产品部”/登录
//------------------------------------------------------------------------------------
//判断关注的cookie是否已设置（followSuc），如果已设置登录Cookie,显示不可点的“已关注”状态
if (getCookie('followSuc')) {
    $('.g-top1 .attention')[0].style.display = "none";
    $('.g-top1 .attnDone')[0].style.display = "inline-block";
    //如果未设置登录cookie，则显示关注按钮
} else {
    $('.g-top1 .attention')[0].style.display = "inline-block";
}

//点击关注按钮，如果未设置登录cookie(loginSuc)，则弹出登录框,否则直接调用关注API，设置登录cookie。
addEvent($('.g-top1 .attention')[0], "click", function() {
    if (!getCookie('loginSuc')) {
        $('.g-login')[0].style.display = "block";
        $('.mask')[0].style.display = "block";
    } else {
       makeCorsRequest("http://study.163.com/webDev/attention.htm", {}, "GET", handleAttention);
    }
});

//登录框交互
var form = document.forms.loginForm,
    nmsg = document.getElementById('message');

//登录错误信息显示
function showMessage(clazz, msg) {
    if (!clazz) {
        nmsg.innerHTML = '';
        util.delClass(nmsg, 'j-err');
    } else {
        nmsg.innerHTML = msg;
        util.addClass(nmsg, clazz);
    }
}

//清除输入框验证错误显示
function clearInvalid(node) {
    showMessage();
    util.delClass(node, 'j-error');
}

//用户输入框验证事件
addEvent(form.userName,
    'invalid',
    function(event) {
        event.preventDefault ? event.preventDefault() : (event.returnValue = false);
        // var input = form.userName;
        util.addClass(form.userName, 'j-error');
        // invalidInput(input, '请输入账号');
    }
);

//密码输入框验证事件
addEvent(form.password,
    'invalid',
    function(event) {
        event.preventDefault ? event.preventDefault() : (event.returnValue = false);
        // var input = form.password;
        util.addClass(form.password, 'j-error');
        // invalidInput(input, '请输入密码');
    }
);

//输入框输入时触发清楚错误状态
addEvent(form,
    'input',
    function(event) {
        // 还原错误状态
        clearInvalid(event.target);
        // 还原登录按钮状态
        // disableSubmit(false);
    }
);

//输入框输入时触发清楚错误状态。兼容IE8，9代码
addEvent(form.userName,
    'focus',
    function(event) {
        clearInvalid(form.userName);
    }
);

//输入框输入时触发清楚错误状态。兼容IE8，9代码
addEvent(form.password,
    'focus',
    function(event) {
        clearInvalid(form.password);
    }
);

//提交登录信息
addEvent(form,
    'submit',
    function(event) {
        event.preventDefault ? event.preventDefault() : (event.returnValue = false);
        if (form.userName.value == '') {
            util.addClass(form.userName, 'j-error');
        };
        if (form.password.value == '') {
            util.addClass(form.password, 'j-error');
        };
        if (form.userName.value == '' || form.password.value == '') {
            showMessage();
            return false;
        }
        makeCorsRequest("http://study.163.com/webDev/login.htm", { userName: md5(form.userName.value), password: md5(form.password.value) }, "GET", handleLogin);
    });

// 成功后设置登录cookie 登录成功后， 调用关注API 
// 登录后“ 关注” 按钮变成不可点的“ 已关注” 状态。 
function handleLogin(data) {
    if (data == 1) {
        hideLoginWindow();        
        setCookie("loginSuc", "true", 30);   
        makeCorsRequest("http://study.163.com/webDev/attention.htm", {}, "GET", handleAttention);     
    } else if (data == 0) {
        showMessage('j-err', '登录错误，请重新尝试。');
    } else {
        showMessage('j-err', '系统出错，请稍后再尝试。');
    }
}

//处理关注API返回结果
function handleAttention(data) {
    if (data == 1) {
        setCookie("followSuc", "true", 30);
        $('.g-top1 .attention')[0].style.display = "none";
        $('.g-top1 .attnDone')[0].style.display = "inline-block";
    }
}

//点击取消关注按钮
addEvent($('.g-top1 .attnDone a')[0], "click", function() {
    $('.g-top1 .attention')[0].style.display = "inline-block";
    $('.g-top1 .attnDone')[0].style.display = "none";
    removeCookie("followSuc");
    return false;
});

// 点击登录框关闭按钮
addEvent($('.g-login .close')[0], "click", function() {
    hideLoginWindow();
});

//关闭登录框时清除输入内容和错误消息
function hideLoginWindow() {
    $('.g-login')[0].style.display = "none";
    $('.mask')[0].style.display = "none";
    nmsg.innerHTML = "";
    util.delClass(nmsg, 'j-err');
    form.userName.value = "";
    form.password.value = "";
    util.delClass(form.userName, 'j-error');
    util.delClass(form.password, 'j-error');
}

// 1.4 三张轮播图轮播效果
//-----------------------------------------------------------------------------------
(function(_slides) {
    each(_slides, function(_slide, i) {
        var _ctrls = _slide.getElementsByTagName('i');
        var _lists = _slide.getElementsByTagName('li');
        each(_ctrls, function(_ctrl, i) {
            _ctrl.onclick = function() {
                each(_lists, function(_list, i) {
                    delClass(_list, "z-crt");
                });
                each(_ctrls, function(_ctrl, i) {
                    delClass(_ctrl, "z-crt");
                });
                addClass(_lists[i], "z-crt");
                addClass(_ctrls[i], "z-crt");
            }
        });
    });

    //模拟点击Controls触发切换
    var i = 0;

    function clickControl() {
        var _ctrls = _slides[0].getElementsByTagName('i');
        // 兼容IE
        if (document.all) {
            _ctrls[i].click();
        } else { // 其它浏览器    
            var e = document.createEvent("MouseEvents");
            e.initEvent("click", true, true);
            _ctrls[i].dispatchEvent(e);
        };
        i++;
        if (i >= _ctrls.length) {
            i = 0;
        };
    };

    // 每隔五秒点击切换
    var intervalId = setInterval(clickControl, 5000);

    //鼠标悬停某张图片，则暂停切换；
    var imgs = $('.m-slide img');
    imgs.forEach(function(img, index) {
        addEvent(img, "mouseenter", function() {
            // alert("mouseover");
            clearInterval(intervalId);
        })

    });

    //鼠标离开后，恢复切换；
    imgs.forEach(function(img, index) {
        addEvent(img, "mouseleave", function() {
            // alert("mouseout");
            intervalId = setInterval(clickControl, 5000)
        })
    });

    //轮播图辅助函数
    function hasClass(_object, _clsname) {
        var _clsname = _clsname.replace(".", "");
        var _sCls = " " + (_object.className) + " ";
        return (_sCls.indexOf(" " + _clsname + " ") != -1) ? true : false;
    }

    function toClass(_str) {
        var _str = _str.toString();
        _str = _str.replace(/(^\s*)|(\s*$)/g, "");
        _str = _str.replace(/\s{2,}/g, " ");
        return _str;
    }

    function addClass(_object, _clsname) {
        var _clsname = _clsname.replace(".", "");
        if (!hasClass(_object, _clsname)) {
            _object.className = toClass(_object.className + (" " + _clsname));
        }
    }

    function delClass(_object, _clsname) {
        var _clsname = _clsname.replace(".", "");
        if (hasClass(_object, _clsname)) {
            _object.className = toClass(_object.className.replace(new RegExp("(?:^|\\s)" + _clsname + "(?=\\s|$)", "g"), " "));
        }
    }

    function each(_objects, _fn) {
        for (var i = 0, len = _objects.length; i < len; i++) {
            _fn(_objects[i], i);
        }
    }
})($('.m-slide'));

// 1.5 内容区tab切换
//-----------------------------------------------------------------------------------
//当前页码，初始为1.
var pageNo = 1;
//当前筛选类型（10：产品设计；20：编程语言）；初始为10.
var type = 10;
//每页返回课程个数;宽屏未20，窄屏为15。初始为20.
var psize = 20;

var courseURL = "http://study.163.com/webDev/couresByCategory.htm";

//判断屏幕样式，如果是窄屏模式，将每页返回课程个数设置为15.
var width = getStyle($('.g-body')[0], "width");
if (width == '960px') {
    psize = 15;
}

//初始渲染。AJAX请求取回课程列表第一页
makeCorsRequest(courseURL, { pageNo: 1, psize: psize, type: 10 }, "GET", processCourselist);

//处理课程列表数据
function processCourselist(data) {
    var arr = JSON.parse(data).list;
    var courselist = $('.m-list')[0];
    //清除现有列表DOM元素
    courselist.innerHTML = "";
    //使用输入课程数据重新渲染课程列表和课程浮层卡片
    render(courselist, arr, courseListContent);
    //课程列表元素注册Mouseente事件
    addMouseenterHandler($('.m-list div.normal'));
    //课程列表元素注册Mouseout事件
    addMouseoutHandler($('.m-list div.hover'));
}

//使用trimpath生成课程列表模板
var courseListContent = TrimPath.parse(
    document.getElementById('courselist').innerHTML
);

//使用trimpath渲染DOM内容
function render(parent, list, template) {
    var html = TrimPath.merge(
        template, { courselist: list }
    );
    parent.insertAdjacentHTML('afterBegin', html);
}

// 点击“产品设计”tab，实现下方课程内容的更换
addEvent($('.m-tab .product')[0], "click", function(event) {
    event.preventDefault ? event.preventDefault() : (event.returnValue = false);
    type = 10;
    makeCorsRequest(courseURL, { pageNo: 1, psize: psize, type: type }, "GET", processCourselist);
    $('.m-tab .program')[0].style.backgroundColor = "white";
    $('.m-tab .program a')[0].style.color = "#666";
    $('.m-tab .product')[0].style.backgroundColor = "#39a030";
    $('.m-tab .product a')[0].style.color = "white";
    util.delClass($('.m-page .z-crt')[0], "z-crt");
    util.addClass($('.m-page .pgi')[0], "z-crt");
    return false;
});

// 点击“编程语言”tab，实现下方课程内容的更换
addEvent($('.m-tab .program')[0], "click", function(event) {
    event.preventDefault ? event.preventDefault() : (event.returnValue = false);
    type = 20;
    makeCorsRequest(courseURL, { pageNo: 1, psize: psize, type: type }, "GET", processCourselist);
    $('.m-tab .program')[0].style.backgroundColor = "#39a030";
    $('.m-tab .program a')[0].style.color = "white";
    $('.m-tab .product')[0].style.backgroundColor = "white";
    $('.m-tab .product a')[0].style.color = "#666";
    util.delClass($('.m-page .z-crt')[0], "z-crt");
    util.addClass($('.m-page .pgi')[0], "z-crt");
    return false;
});

// 1.6 查看课程详情
//-----------------------------------------------------------------------------------
// 鼠标悬停“产品设计”或“编程语言”tab下的任意课程卡片，出现浮层显示该课程的课程详情；鼠标离开课程详情浮层，则浮层关闭。
function addMouseenterHandler(nodes) {
    function helper(i) {
        return function() {
            util.addClass($('.m-list div.hover')[i], "z-crt");
        }
    }
    for (var i = 0; i < nodes.length; i++) {
        addEvent(nodes[i], "mouseenter", helper(i))
    }
}

function addMouseoutHandler(nodes) {
    function helper(i) {
        return function() {
            util.delClass($('.m-list div.hover')[i], "z-crt");
        }
    }
    for (var i = 0; i < nodes.length; i++) {
        addEvent(nodes[i], "mouseleave", helper(i));
    }
}

// 1.7 右侧“机构介绍”中的视频介绍
//------------------------------------------------------------------------------------------
var video = document.getElementById("video");

// 点击“机构介绍”中的整块图片区域，调用弹窗播放介绍视频。
addEvent($('.m-introduction img')[0], "click", function() {
    $('.g-video')[0].style.display = "block";
    $('.mask')[0].style.display = "block";
});

// 点击浮层关闭按钮，暂停播放介绍视频，关闭视频弹窗。
addEvent($('.g-video .close')[0], "click", function() {
    if (video.pause) {
        video.pause();
    }
    $('.g-video')[0].style.display = "none";
    $('.mask')[0].style.display = "none";
});


//1.8  右侧“热门推荐”。AJAX请求取回热门推荐列表
//------------------------------------------------------------------------------------------
makeCorsRequest("http://study.163.com/webDev/hotcouresByCategory.htm", {}, "GET", processHotlist);

//处理热门推荐返回数据
function processHotlist(data) {
    var arr = JSON.parse(data);
    var hotlist = $('.m-hotlist .hotlist')[0];
    hotlist.innerHTML = "";
    render(hotlist, arr.slice(0, 10), hotListContent);
    // 展示前10门课程，隔5秒更新一门课程，实现滚动更新热门课程的效果
    setInterval(function() {
        hotlist.innerHTML = "";
        render(hotlist, arr.slice(0, 10), hotListContent);
        var firstItem = arr.shift();
        arr.push(firstItem);
    }, 5000)
}

//使用trimpath生成热门推荐列表模板
var hotListContent = TrimPath.parse(
    document.getElementById('hotlist').innerHTML
);

//翻页器交互（无明确需求，实现8页内点击页码和前后键翻页）
//------------------------------------------------------------------------------------------
var currentPage = 1;
//翻页器页码节点
var pageIndexes = $('.m-page .pgi');
//翻页器前后键节点
var prev = $('.m-page .prev')[0];
var next = $('.m-page .next')[0];

//翻页器页码点击事件注册
addClickHandler(pageIndexes);

//翻页器交互, 点击页码翻页
function addClickHandler(nodes) {
    function helper(i) {
        return function() {
            util.delClass($('.m-page .z-crt')[0], "z-crt");
            currentPage = i + 1;
            makeCorsRequest(courseURL, { pageNo: currentPage, psize: psize, type: type }, "GET", processCourselist);
            util.addClass(nodes[i], "z-crt");
        }
    }
    for (var i = 0; i < nodes.length; i++) {
        addEvent(nodes[i], "click", helper(i));
    }
}

//翻页器交点击向前键翻页
addEvent(prev, "click", function() {
    // alert("prev" + currentPage);
    if (currentPage > 1) {
        currentPage = currentPage - 1;
        makeCorsRequest(courseURL, { pageNo: currentPage, psize: psize, type: type }, "GET", processCourselist);
        util.delClass(pageIndexes[currentPage], "z-crt");
        util.addClass(pageIndexes[currentPage - 1], "z-crt");
    }
})

//翻页器交点击向后键翻页
addEvent(next, "click", function() {
    if (currentPage < 8) {
        currentPage = currentPage + 1;
        makeCorsRequest(courseURL, { pageNo: currentPage, psize: psize, type: type }, "GET", processCourselist);
        util.delClass(pageIndexes[currentPage - 2], "z-crt");
        util.addClass(pageIndexes[currentPage - 1], "z-crt");
    }
})
//AJAX请求操作
function get(url, options, callback) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
                callback(xhr.responseText);
            } else {
                console.log('Request was unsuccessful: ' + xhr.status);
                callback(2);
            }
        }
    }
    var URL = url + "?" + serialize(options);
    // alert(URL);
    xhr.open('get', URL, true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.send(null);
}

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

function callback(data) {
    if (data == 1) {
        alert("loing suc " + data);
        $('.m-form')[0].style.display = "none";
        $('.mask')[0].style.display = "none";
        $('.g-top1 a.attention')[0].style.display = "none";
        $('.g-top1 .attnDone')[0].style.display = "inline-block";
        setCookie("loginSuc", "true", 30);
    } else if (data == 0) {
        alert("login failure " + data);
        showMessage('j-err', '登录错误，请重新尝试。');
    } else {
        alert("login failure " + data);
        showMessage('j-err', '系统出错，请稍后再尝试。');
    }
}

//Cookie操作
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

//通知条部分交互 - 通过Cookie实现不再提醒
if (getCookie("reminder") == "false") {
    $('.g-notice')[0].style.display = "none";
}

$('.g-top1 .attnDone a')[0].addEventListener("click", function() {
    $('.g-top1 a.attention')[0].style.display = "inline-block";
    $('.g-top1 .attnDone')[0].style.display = "none";
    removeCookie("loginSuc");
    return false;
});

//关注按钮交互
if (getCookie('loginSuc') == "true") {
    $('.g-top1 a.attention')[0].style.display = "none";
    $('.g-top1 .attnDone')[0].style.display = "inline-block";
}

$('.g-top1 a.attention')[0].addEventListener("click", function() {
    $('.m-form')[0].style.display = "block";
    $('.mask')[0].style.display = "block";   
});

$('.g-notice a.noremind')[0].addEventListener("click", function() {
    setCookie("reminder", "false", 30);
    $('.g-notice')[0].style.display = "none";
    return false;
});

// 关闭登录框
$('.m-form .close')[0].addEventListener("click", function() {
    $('.m-form')[0].style.display = "none";
    $('.mask')[0].style.display = "none";      
});



//登录框交互
var form = document.forms.loginForm,
    nmsg = document.getElementById('message');

function showMessage(clazz, msg) {
    if (!clazz) {
        nmsg.innerHTML = '';
        nmsg.classList.remove('j-suc');
        nmsg.classList.remove('j-err');
    } else {
        nmsg.innerHTML = msg;
        nmsg.classList.add(clazz);
    }
}

function disableSubmit(disabled) {
    form.loginBtn.disabled = !!disabled;
    var method = !disabled ? 'remove' : 'add';
    form.loginBtn.classList[method]('j-disabled');
}

function invalidInput(node, msg) {
    // showMessage('j-err',msg);
    node.classList.add('j-error');
    node.focus();
}

function clearInvalid(node) {
    showMessage();
    node.classList.remove('j-error');
}

form.userName.addEventListener(
    'invalid',
    function(event) {
        event.preventDefault();
        var input = form.userName;
        invalidInput(input, '请输入账号');
    }
);

form.password.addEventListener(
    'invalid',
    function(event) {
        event.preventDefault();
        var input = form.password;
        invalidInput(input, '请输入密码');
    }
);

form.addEventListener(
    'input',
    function(event) {
        // 还原错误状态
        clearInvalid(event.target);
        // 还原登录按钮状态
        disableSubmit(false);
    }
);
form.addEventListener(
    'submit',
    function(event) {
        event.preventDefault();
        get("http://study.163.com/webDev/login.htm", { userName: md5(form.userName.value), password: md5(form.password.value) }, callback);
    });



//视频弹窗交互

var video = $('.g-video video')[0];

$('.m-introduction video')[0].addEventListener("click", function() {
    $('.g-video')[0].style.display = "block";
    $('.mask')[0].style.display = "block";
    // $('.g-video video')[0].style.display = "block";
    $('.g-video')[0].appendChild(video);
});

$('.g-video .close')[0].addEventListener("click", function() {
    $('.g-video')[0].removeChild(video);
    // $('.g-video video')[0].style.display = "none";
    $('.g-video')[0].style.display = "none";
    $('.mask')[0].style.display = "none";   
});


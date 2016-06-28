function handleLogin(data) {
    if (data == 1) {
        // alert("loing suc " + data);
        hideLoginWindow();
        $('.g-top1 .attention')[0].style.display = "none";
        $('.g-top1 .attnDone')[0].style.display = "inline-block";
        setCookie("loginSuc", "true", 30);
    } else if (data == 0) {
        // alert("login failure " + data);
        showMessage('j-err', '登录错误，请重新尝试。');
    } else {
        // alert("login failure " + data);
        showMessage('j-err', '系统出错，请稍后再尝试。');
    }
    disableSubmit(false);
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

addEvent($('.g-top1 .attnDone a')[0],"click", function() {
    $('.g-top1 .attention')[0].style.display = "inline-block";
    $('.g-top1 .attnDone')[0].style.display = "none";
    removeCookie("loginSuc");
    return false;
});

//关注按钮交互
if (getCookie('loginSuc') == "true") {
    $('.g-top1 .attention')[0].style.display = "none";
    $('.g-top1 .attnDone')[0].style.display = "inline-block";
} else {
    $('.g-top1 .attention')[0].style.display = "inline-block";
}

addEvent($('.g-top1 .attention')[0], "click", function() {
    $('.m-form')[0].style.display = "block";    
    $('.mask')[0].style.display = "block";   
});

addEvent($('.g-notice a.noremind')[0],"click", function() {
    setCookie("reminder", "false", 30);
    $('.g-notice')[0].style.display = "none";
    return false;
});

// 关闭登录框
addEvent($('.m-form .close')[0],"click", function() {
     hideLoginWindow();    
});

function hideLoginWindow() {
    form.style.display = "none";    
    $('.mask')[0].style.display = "none";
    nmsg.innerHTML="";
    util.delClass(nmsg, 'j-err');
    form.userName.value=""; 
    form.password.value="";
    util.delClass(form.userName, 'j-error');
    util.delClass(form.password, 'j-error');    
}


//登录框交互
var form = document.forms.loginForm,
    nmsg = document.getElementById('message');

function showMessage(clazz, msg) {
    if (!clazz) {
        nmsg.innerHTML = '';
        util.delClass(nmsg, 'j-suc');
        util.delClass(nmsg, 'j-err');
        // nmsg.classList.remove('j-suc');
        // nmsg.classList.remove('j-err');
    } else {
        nmsg.innerHTML = msg;
        util.addClass(nmsg, clazz);
        // nmsg.classList.add(clazz);
    }
}

function disableSubmit(disabled) {
    form.loginBtn.disabled = !!disabled;
    var method = !disabled ? 'remove' : 'add';
    if (method=="add") {
    // form.loginBtn.classList[method]('j-disabled');
        util.addClass(form.loginBtn, 'j-disabled');
    } else {
        util.delClass(form.loginBtn, 'j-disabled');
    }
}

function invalidInput(node, msg) {
    // showMessage('j-err',msg);

    util.addClass(node, 'j-error');
    // node.classList.add('j-error');
    // node.focus();
}

function clearInvalid(node) {
    showMessage();
    util.delClass(node, 'j-error');
    // node.classList.remove('j-error');
}

addEvent(form.userName,
    'invalid',
    function(event) {
        // event.preventDefault();
        event.preventDefault ? event.preventDefault() : (event.returnValue = false);
        var input = form.userName;
        invalidInput(input, '请输入账号');
    }
);


addEvent(form.password,
    'invalid',
    function(event) {
        // event.preventDefault();
        event.preventDefault ? event.preventDefault() : (event.returnValue = false);
        var input = form.password;
        invalidInput(input, '请输入密码');
    }
);


addEvent(form,
    'input',
    function(event) {
        // 还原错误状态
        clearInvalid(event.target);
        // 还原登录按钮状态
        disableSubmit(false);
    }
);

//兼容IE8，9代码
addEvent(form.userName,
    'focus',
    function(event) {
       clearInvalid(form.userName);
    }
);

addEvent(form.password,
    'focus',
    function(event) {
         clearInvalid(form.password);
    }
);

addEvent(form,
    'submit',
    function(event) {
        // event.preventDefault();
        event.preventDefault ? event.preventDefault() : (event.returnValue = false);
        // if (form.userName.value.replace(/^ +| +$/g,'')=='') {
        if (form.userName.value =='') {
            var input = form.userName;
            invalidInput(input, '请输入账号'); 
        };           
        if (form.password.value =='') {
            var input = form.password;
            invalidInput(input, '请输入密码');           
        };
        if (form.userName.value ==''|| form.password.value ==''){
            showMessage();
            return false;
        } 
        var responseText = makeCorsRequest("http://study.163.com/webDev/login.htm", { userName: md5(form.userName.value), password: md5(form.password.value) }, "GET", handleLogin);       

    });  


//视频弹窗交互
// var video = $('.g-video .video')[0];
var video =  document.getElementById("video");

var html = video.innerHTML;

addEvent($('.m-introduction img')[0], "click", function() {
    $('.g-video')[0].style.display = "block";
    $('.mask')[0].style.display = "block";
    // $('.g-video .video')[0].style.display = "block";    
    $('.g-video .video')[0].appendChild(video);
});

addEvent($('.g-video .close')[0], "click", function() {
    // $('.g-video')[0].removeChild(video);    
    // $('.g-video video')[0].style.display = "none";
    // $('.g-video .video')[0].pause();
    // $('.g-video .video')[0].stop();
    // $('span.video')[0].parentElement.removeNode($('span.video')[0]);
    if(video.pause) {
        video.pause();
    }
    $('.g-video')[0].style.display = "none";
    $('.mask')[0].style.display = "none";   
});
 (function(){
            var form = document.forms.loginForm,
                nmsg = document.getElementById('message');
            
            // function md5(msg){
            // 	return msg;
            // }
        
            function showMessage(clazz,msg){
            	if (!clazz){
        	    	nmsg.innerHTML = '';
        	    	nmsg.classList.remove('j-suc');
        	    	nmsg.classList.remove('j-err');
            	}else{
        	    	nmsg.innerHTML = msg;
        	    	nmsg.classList.add(clazz);
            	}
            }
        
            function disableSubmit(disabled){
            	form.loginBtn.disabled = !!disabled;
            	var method = !disabled?'remove':'add';
                form.loginBtn.classList[method]('j-disabled');
            }
        
            function invalidInput(node,msg){
            	// showMessage('j-err',msg);
            	node.classList.add('j-error');
            	node.focus();
            }
        
            function clearInvalid(node){
            	showMessage();
            	node.classList.remove('j-error');
            }
        
            form.userName.addEventListener(
            	'invalid',function(event){
            		event.preventDefault();
            		var input = form.userName;
        			invalidInput(input,'请输入账号');
            	}
            );

            form.password.addEventListener(
                'invalid',function(event){
                    event.preventDefault();
                    var input = form.password;
                    invalidInput(input,'请输入密码');
                }
            );
        
            form.addEventListener(
                'input',function(event){
                	// 还原错误状态
                	clearInvalid(event.target);
                    // 还原登录按钮状态
                    disableSubmit(false);
                }
            );
        
            form.addEventListener(
                'submit',function(event){
                    // 密码验证
                    // var input = form.password,
                    //     pswd = input.value,
                    event.preventDefault();
                    var emsg = '';

                    // alert(form.userName.value);
                    // alert(form.password.value);
                    // alert(md5(form.password.value));

                    get("http://study.163.com/webDev/login.htm", {userName: md5(form.userName.value), password: md5(form.password.value)}, callback
     );             
                    // console.log('emsg = ' + emsg);

                    showMessage('j-err','系统故障！');

                    if (!!emsg){
                    	event.preventDefault();
                    	invalidInput(input,emsg);
            			return;
                    }
                   
                    // 禁用提交按钮
                    // disableSubmit(true);
                }
            );
            
            // var frame = document.getElementById('result');
            // frame.addEventListener(
            // 	'load',function(event){
            // 		try{
            //  //            var result = JSON.parse(
        				// 	// frame.contentWindow.document.body.textContent
            // 	// 		);
            // 			//还原登录按钮状态
            //             // console.log(frame.contentWindow.document.body.textContent);
            //             // alert("xxx " + frame.contentWindow.document.body.textContent);
            // 			disableSubmit(false);
            //         	// 识别登录结果
            // 			if (result.code===200){
            // 				showMessage('j-suc','登录成功！');
            // 				form.reset();
            // 			}
            // 		}catch(ex){
            // 			console.log(ex);
            // 		}
            // 	}
            // );
            
        })();

        //AJAX请求
        function get(url, options, callback) {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4) {
                if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
                    callback(xhr.responseText);
                } else {
                    console.log('Request was unsuccessful: ' + xhr.status);
                }
            }
        }
        var URL = url + "?" + serialize(options);
        console.log(URL);   
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
        if (data==1) {
            alert("loing suc");
            $('.m-form')[0].style.display="none"; 
            $('.mask')[0].style.display="none";     
        } else {
            alert("login failure")
        }


    }
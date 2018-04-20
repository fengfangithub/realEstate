$(function () {
    //导航栏
    var spans = $(".nav_bar_left li a span");
    var lis = $(".nav_bar_left li");
    for(var i = 0; i < lis.length; i++){
        lis[i].onmouseover = function () {
            var s = i;
            return function () {
                spans[s].className = "span_show";
            }
        }();
        lis[i].onmouseout = function () {
            var s = i;
            return function () {
                spans[s].className = "span_hidden";
            }
        }();
    }

    //登录、注册
    var login = $(".nav_bar_right .login_register a")[0];
    var register = $(".nav_bar_right .login_register a")[1];
    var dialog = $(".dialog");
    var login_content = $(".login_content");
    var register_content = $(".register_content");
    var login_cancel = $(".login_content_header button");
    var register_cancel = $(".register_content_header button");
    //登录弹出框事件
    login.onclick = function () {
        dialog.css("display", "block");
        login_content.css("display", "block");
        $(document).bind("mousewheel", function (event, delta) {
            return false;
        })
    };
    login_cancel.click(function () {
        dialog.css("display", "none");
        login_content.css("display", "none");
        $(document).unbind("mousewheel");
    });
    //注册弹出框事件
    register.onclick = function () {
        dialog.css("display", "block");
        register_content.css("display", "block");
        $(document).bind("mousewheel", function (event, delta) {
            return false;
        })
    };
    register_cancel.click(function () {
        dialog.css("display", "none");
        register_content.css("display", "none");
        $(document).unbind("mousewheel");
    });
    //性别选择事件
    var checkbox = $(".gender input");
    for(var i = 0; i < checkbox.length; i++){
        checkbox[i].onclick = function () {
                if(this.checked){
                    for(var j = 0; j < checkbox.length; j++){
                        if(this != checkbox[j]){
                            checkbox[j].checked = false;
                        }
                    }

                }
        };
    }

    //登录事件
    var login_event = $(".login_body button");
    login_event.click(function () {
        var account = $(".login_body input[type='text']").val();
        var password = $(".login_body input[type='password']").val();
        var login_check = $(".func input[type='checkbox']")[0].checked;
        var p = $(".login_body p");
        var login_information = $(".login_information");
        var login_register = $(".login_register");
        var text = $(".login_information a span:last-child");
        if(account == ""){
            $(p[1]).html("账号为空");
            return;
        }else{
            $(p[1]).html("");
        }
        if(password == ""){
            $(p[2]).html("密码为空");
            return;
        }else{
            $(p[2]).html("");
        }
        if(!login_check){
            $(p[3]).html("同意用户协议");
            return;
        }else{
            $(p[3]).html("");
        }
        $.ajax({
            url: "http://www.xhban.com:8080/EM/user/login",
            type: "post",
            dataType: "json",
            crossDomain: true,
            data: {
                phone: account,
                password: password
            },
            success: function (data) {
                if(data.state != 0){
                    $(p[0]).text(data.message);
                }else{
                    login_register.css("display", "none");
                    login_information.css("display", "block");
                    text.text(account);
                    login_cancel.click();
                    cookie.set("phone", account, 1);
                }
            },
            error: function (data) {
                console.log(data.state());
            }
        });
    });
    //注册事件
    var register_event = $(".register_body button");
    register_event.click(function () {
        var inputs = $(".register_form input");
        var phone = $(inputs[0]).val();
        var password = $(inputs[1]).val();
        var sure_password = $(inputs[2]).val();
        var name = $(inputs[3]).val();
        var address = $(inputs[4]).val();
        var checkbox = $(".gender input");
        var sex = null;
        var p = $(".register_body p");
        for(var i = 0; i < checkbox.length ;i++){
            if(checkbox[i].checked){
                sex = $(checkbox[i]).val();
            }
        }
        if(phone == ""){
            $(p[1]).html("电话号码为空");
            return;
        }else{
            $(p[1]).html("");
        }
        if(password == ""){
            $(p[2]).html("密码为空");
            return;
        }else{
            $(p[2]).html("");
        }
        if(!(password == sure_password)){
            $(p[3]).html("两次密码不匹配");
            return;
        }else{
            $(p[3]).html("");
        }
        if(name == ""){
            $(p[4]).html("用户名为空");
            return;
        }else{
            $(p[4]).html("");
        }
        if(sex == null){
            $(p[5]).html("请选择性别");
            return;
        }else {
            $(p[5]).html("");
        }
        $.ajax({
            url: "http://www.xhban.com:8080/EM/user/register",
            type: "post",
            async: false,
            data:{
                name: name,
                sex: sex,
                phone: phone,
                password: password,
                address: address
            },
            dataType: "json",
            success: function (data) {
                    $(p[0]).text(data.message);
            },
            error: function (data) {
                console.log(data);
            }
        });
    });
    // 设置cookie
    var cookie = {
        set: function (c_name, value, expiredays){
            var exdate=new Date();
            exdate.setDate(exdate.getDate() + expiredays);
            document.cookie=c_name+ "=" + escape(value) + ((expiredays==null) ? "" : ";expires="+exdate.toGMTString());
        },
        get: function (name)
        {
            var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");

            if(arr=document.cookie.match(reg))

                return (arr[2]);
            else
                return null;
        },
        clear: function (name)
        {
            var exp = new Date();
            exp.setTime(exp.getTime() - 1);
            var cval=this.get(name);
            if(cval!=null)
                document.cookie= name + "="+cval+";expires="+exp.toGMTString();
        }
    }
    function state() {
        var phone = cookie.get("phone");
        var login_information = $(".login_information");
        var login_register = $(".login_register");
        var text = $(".login_information a span:last-child");
        if(phone != null){
            login_register.css("display", "none");
            login_information.css("display", "block");
            text.text(phone);
        }
        var exit = $(".login_information a:last-child");
        exit.click(function () {
            cookie.clear("phone");
            login_register.css("display", "block");
            login_information.css("display", "none");
        });
    }
    state();
});

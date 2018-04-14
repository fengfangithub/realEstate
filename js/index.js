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
    var login = $(".nav_bar_right li a")[0];
    var register = $(".nav_bar_right li a")[1];
    var dialog = $(".dialog");
    var login_content = $(".login_content");
    var register_content = $(".register_content");
    var login_cancel = $(".login_content_header button");
    var register_cancel = $(".register_content_header button");
    //登录弹出框事件
    login.onclick = function () {
        dialog.css("display", "block");
        login_content.css("display", "block");
    };
    login_cancel.click(function () {
        dialog.css("display", "none");
        login_content.css("display", "none");
    });
    //注册弹出框事件
    register.onclick = function () {
        dialog.css("display", "block");
        register_content.css("display", "block");
    };
    register_cancel.click(function () {
        dialog.css("display", "none");
        register_content.css("display", "none");
    });

    //登录事件
    var login_event = $(".login_body button");
    login_event.click(function () {

        var account = $(".login_body input[type='text']").val();
        var password = $(".login_body input[type='password']").val();
        var login_check = $(".func input[type='checkbox']")[0].checked;
        var p = $(".login_body p");

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
            data: {
                phone: account,
                password: password
            },
            success: function (data) {
                console.log(data);
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
        var name = $(inputs[0]).val();
        var password = $(inputs[1]).val();
        var sure_password = $(inputs[2]).val();
        var phone = $(inputs[3]).val();
        var address = $(inputs[4]).val();
        var checkbox = $(".gender input");
        var sex = null;
        var p = $(".register_form p");
        console.log(inputs);
        console.log(p);
        for(var i = 0; i < checkbox.length ;i++){
            if(checkbox[i].checked){
                sex = $(checkbox[i]).val();
            }
        }
        if(name == ""){
            $(p[0]).html("用户名为空");
            return;
        }else{
            $(p[0]).html("");
        }
        if(password == ""){
            $(p[1]).html("密码为空");
            return;
        }else{
            $(p[1]).html("");
        }
        if(name){
            $(p[2]).html("两次密码不匹配");
            return;
        }else{
            $(p[2]).html("");
        }
        if(phone == ""){
            $(p[3]).html("电话为空");
            return;
        }else{
            $(p[3]).html("");
        }

    });
});

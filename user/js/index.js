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
        console.log("dfdf");
        dataLoad("http://www.xhban.com:8080/EM/user/login",{phone: account,password: password},loginBack);
        function loginBack(data){
            console.log(data);
            if(data.state != 0){
                $(p[0]).text(data.message);
            }else{
                login_register.css("display", "none");
                login_information.css("display", "block");
                text.text(account);
                login_cancel.click();
            }
        }
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
        var registerData = {
            name: name,
            sex: sex,
            phone: phone,
            password: password,
            address: address
        }
        dataLoad("http://www.xhban.com:8080/EM/user/register",registerData,registerBack);
        function registerBack(data){
            window.alert(data.message);
            window.location.href = window.location.href;
        }
    });
    //退出登录
    var exit = $(".login_information a:last-child");
    exit.click(function () {
        dataLoad("http://www.xhban.com:8080/EM/user/logout",null,null);
        var login_information = $(".login_information");
        var login_register = $(".login_register");
        login_register.css("display","block");
        login_information.css("display","none");
    });
    //判断登录
    function loginState() {
        dataLoad("http://www.xhban.com:8080/EM/user/lookinfo",null,stateBack);
        function stateBack(data) {
            var login_information = $(".login_information");
            var login_register = $(".login_register");
            var span = $(".login_information a span:last-child");
            if(data.state == 0){
                span.text(data.resultData[0].phone);
                login_register.css("display","none");
                login_information.css("display","block");
            }else{
                login_register.css("display","block");
                login_information.css("display","none");
            }
        }
    }
    loginState();
    //搜索
    var serach_input = $(".nav_bar_right input");
    var serach = $(".nav_bar_right .search_icon");
    serach.click(function () {
        window.location.href = "advanced_search.html?serach="+encodeURI(encodeURI(serach_input.val()));
    });
    //轮播图
    (function sf() {
        var list_image = $("#list img");
        dataLoad("http://www.xhban.com:8080/EM/user/listthreeimages",{},sfBack);
        function sfBack(data){
            if(data.state == 0 && data.resultData.length == 3){
                for(var i = 0; i < list_image.length; i++){
                    if(i == 0){
                        $(list_image[i]).attr("src",data.resultData[2].path);
                    }else if(i > 0 && i < 4){
                        $(list_image[i]).attr("src",data.resultData[i-1].path)
                    }else{
                        $(list_image[i]).attr("src",data.resultData[0].path);
                    }
                }
            }
        }
    })();
    //快速浏览
    (function look() {
        var a = $(".poins");
        dataLoad("http://www.xhban.com:8080/EM/user/listprettyhousesbyparameterandorderbydefault",{kind:"出售"},shopsBack);
        function shopsBack(data) {
            if(data.state == 0 && data.resultData.length >= 3){
                var ul = $(".content_img ul");
                ul.html("");
                for(var i = 0; i < 3; i++){
                    ul.append("<li><div><a><img class='img' src='"+data.resultData[i].image+"'></a><br>"+
                        "<span class='house_name'>"+data.resultData[i].name+"</span><br>" +
                        "<span>场价:</span><span>"+Math.ceil(data.resultData[i].price/data.resultData[i].size)+"</span><span>万元/m<sup>2</sup></span><br>" +
                        "<span>地址:</span><span>"+data.resultData[i].address+"</span></div></li>")
                }
            }
        }
        $(a[0]).mouseenter(function () {
            dataLoad("http://www.xhban.com:8080/EM/user/listprettyhousesbyparameterandorderbydefault",{kind:"出租"},shopsBack);
            function shopsBack(data) {
                if(data.state == 0 && data.resultData.length >= 3){
                    var ul = $(".content_img ul");
                    ul.html("");
                    for(var i = 0; i < 3; i++){
                        ul.append("<li><div><a><img class='img' src='"+data.resultData[i].image+"'></a><br>"+
                            "<span class='house_name'>"+data.resultData[i].name+"</span><br>" +
                            "<span>场价:</span><span>"+Math.ceil(data.resultData[i].price/data.resultData[i].size)+"</span><span>万元/m<sup>2</sup></span><br>" +
                            "<span>地址:</span><span>"+data.resultData[i].address+"</span></div></li>")
                    }
                }
            }
        });
        $(a[1]).mouseenter(function () {
            dataLoad("http://www.xhban.com:8080/EM/user/listprettyhousesbyparameterandorderbydefault",{kind:"出售"},shopsBack);
            function shopsBack(data) {
                if(data.state == 0 && data.resultData.length >= 3){
                    var ul = $(".content_img ul");
                    ul.html("");
                    for(var i = 0; i < 3; i++){
                        ul.append("<li><div><a><img class='img' src='"+data.resultData[i].image+"'></a><br>"+
                            "<span class='house_name'>"+data.resultData[i].name+"</span><br>" +
                            "<span>场价:</span><span>"+Math.ceil(data.resultData[i].price/data.resultData[i].size)+"</span><span>万元/m<sup>2</sup></span><br>" +
                            "<span>地址:</span><span>"+data.resultData[i].address+"</span></div></li>")
                    }
                }
            }
        });
        $(a[2]).mouseenter(function () {
            dataLoad("http://www.xhban.com:8080/EM/user/listprettyhousesbyparameterandorderbydefault",{kind:"商铺"},shopsBack);
            function shopsBack(data) {
                if(data.state == 0 && data.resultData.length >= 3){
                    var ul = $(".content_img ul");
                    ul.html("");
                    for(var i = 0; i < 3; i++){
                        ul.append("<li><div><a><img class='img' src='"+data.resultData[i].image+"'></a><br>"+
                            "<span class='house_name'>"+data.resultData[i].name+"</span><br>" +
                            "<span>场价:</span><span>"+Math.ceil(data.resultData[i].price/data.resultData[i].size)+"</span><span>万元/m<sup>2</sup></span><br>" +
                            "<span>地址:</span><span>"+data.resultData[i].address+"</span></div></li>")
                    }
                }
            }
        });
    })();

    function dataLoad(url, data, callback) {
        $.ajax({
            url: url,
            type: "post",
            dataType: "json",
            data: data,
            async: true,
            xhrFields: {
                withCredentials: true
            },
            crossDomain: true,
            success: callback
        });
    }
});

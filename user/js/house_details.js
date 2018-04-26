$(function () {
    var index = getQueryString("index");
    var house_id = getQueryString("house_id");


    //请求房屋信息
    var dataResult = null;
    $.ajax({
        url: "http://www.xhban.com:8080/EM/user/listprettyhouses",
        type: "post",
        dataType: "json",
        async: false,
        success: function (data) {
            dataResult = data.resultData[0];
        },
        error: function (data) {
            console.log(data);
        }
    });



    //图片播放
    var list = $("#list");
    var prev = $("#prev")
    var next = $("#next");
    var num = 1;
    var contain_img_menu = $(".contain_img_menu img");
    $(contain_img_menu[num-1]).css("border", "1px solid red");
    function animate(offset){
        if(num > 2){
            list.css("left","0px");
            num = 1;
        }else if(num < 1){
            list.css("left", "-650px")
            num = 2;
        }else{
            var newLeft = parseInt(list.css("left")) + offset;
            list.css("left",newLeft);
        }
    }
    next.click (function () {
        num+=1;
        animate(-650);
        for(var i = 0;i < contain_img_menu.length; i++){
            if($(contain_img_menu[i]).css("border") != "none"){
                $(contain_img_menu[i]).css("border", "none");
            }
        }
        $(contain_img_menu[num-1]).css("border", "1px solid red");
    });

    prev.click(function () {
        num-=1;
        animate(650);
        console.log(num);
    });


    //获取地址的值
    function getQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var reg_rewrite = new RegExp("(^|/)" + name + "/([^/]*)(/|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        var q = window.location.pathname.substr(1).match(reg_rewrite);
        if(r != null){
            return unescape(r[2]);
        }else if(q != null){
            return unescape(q[2]);
        }else{
            return null;
        }
    }
});
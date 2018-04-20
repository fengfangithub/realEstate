
$(function () {
    var price = getQueryString("price");
    var doorModel = getQueryString("doorModel");
    var area = getQueryString("area");
    var type = getQueryString("type");
    var checkbox_1 = $("#check_content_1 .check_box_content input");
    var checkbox_2 = $("#check_content_2 .check_box_content input");
    var checkbox_3 = $("#check_content_3 .check_box_content input");
    var checkbox_4 = $("#check_content_4 .check_box_content input");
    checkBox(checkbox_1, 1);
    checkBox(checkbox_2, 2);
    checkBox(checkbox_3, 3);
    checkBox(checkbox_4, 4);
    loading();
    if(price != null){
        price ="null";
    }
    if(doorModel != null){
        doorModel ="null";
    }
    if(area != null){
        area ="null";
    }
    if(type != null){
        type ="null";
    }
    console.log(price != "null");
    console.log(doorModel != "null");
    console.log(area != "null");
    console.log(type != "null");
    //执行页面加载
    function loading() {
        // if(price != null){
        //     checkbox_1[price].checked = true;
        // }
        // console.log(doorModel != null);
        // if(doorModel != null){
        //     checkbox_2[doorModel].checked = true;
        // }
        // if(area != null){
        //     checkbox_3[area].checked = true;
        // }
        // if(type != null){
        //     checkbox_4[type].checked = true;
        // }
    }
    //checkbox点击事件
    function checkBox(checkbox, n) {
        for(var i = 0; i < checkbox.length; i++){
            checkbox[i].onclick = function () {
                var s= i;
                return function () {
                   if(n == 1){
                       price = s;
                   }else if(n == 2){
                       doorModel = s;
                   }else if(n == 3){
                       area = s;
                   }else{
                       type = s;
                   }
                   var url = "advanced_search.html?"+"price="+price+"&doorModel="+doorModel+"&area="+area+"&type="+type;
                   window.location = url;
                }
            }();
        }
    }
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
    //请求图片信息
    $.ajax({
        url: "http://www.xhban.com:8080/EM/user/listimages",
        type: "post",
        dataType: "json",
        async: false,
        data: {
            house_id: dataResult.id
        },
        success: function (data) {
            console.log(data);
        }
    });
    //页面加载
    function dataLoad() {
        var content1Div1Span = $("#content1_div1 span");
        var content1Div2Span = $("#content1_div2 span");
        var content1Div3Span = $("#content1_div3 span");
        var price = $("#content1 .content_price span");
        var are = $("#content1 .content_are span");
        var a = $("#content1 .content_show a");
        $(content1Div1Span[0]).text(dataResult.type);
        $(content1Div1Span[2]).text(dataResult.kind);
        $(content1Div1Span[4]).text(dataResult.area);
        $(content1Div1Span[6]).text(dataResult.time);
        $(content1Div2Span[1]).text(dataResult.contact);
        $(content1Div2Span[3]).text(dataResult.phone);
        $(content1Div3Span[1]).text(dataResult.address);
        a.text(dataResult.name);
        price.text(dataResult.price);
        are.text(dataResult.size);
    }
    dataLoad();
    //页面跳转到详细房屋信息
    function details() {
        var a = $("#content1 .content_show a");
        a.click(function () {
            var index = 0;
            var house_id = 0;
            var url = "house_details.html?"+"index="+index+"&house_id="+house_id;
            window.location.href = url;
        });
    }
    details();

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


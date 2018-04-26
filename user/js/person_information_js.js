$(function () {

    var a = $(".left ul li a");
    var li = $(".left ul li");
    var div = $(".right>div");
    var page_id;
    var header = $(".right header");
    var header_menu_a = $(".header_menu a");
    var person_information_div = $(".person_information>div");
    var num_page;
    var manger_id = getQueryString("manger_id");
    if(getQueryString("page_id") == null){
        page_id = 0;
    } else{
        page_id = getQueryString("page_id");
    }

    if(getQueryString("num_page") == null){
        num_page = 0;
    } else{
        num_page = getQueryString("num_page");
    }



    //页面加载动画
    jump();
    function display() {
        $(li[page_id]).css("background-color", "#3cb570");
        var text = $(a[page_id]).text();
        header.text(text);
        $(div[6]).css("display", "block");
    }
    display();

    if(page_id == 0){
        person_information_show();
        modify_information();
        modify_password();
    }
    if(page_id == 1){
        publish_house();
    }
    if(page_id == 2 && manger_id == null){
        releaseRecord();
    }
    if(page_id == 2 && manger_id != null){
        modificationHouse();
    }
    if(page_id == 3){
        tradingRecord();
    }


    //页面个人数据显示
    //个人信息
    function person_information_show() {
        dataLoad("http://www.xhban.com:8080/EM/user/lookinfo", {}, personInformationBack);
        function personInformationBack(person) {
            if(person.state == 0){
                var person_information_input = $(".menu_person_information .content input");
                $(div[6]).css("display", "none");
                $(div[page_id]).css("display", "block");
                $(person_information_input[0]).val(person.resultData[0].name);
                $(person_information_input[1]).val(person.resultData[0].phone);
                if(person.resultData[0].sex == ""){
                    $(person_information_input[2]).val("不公开");
                }else{
                    $(person_information_input[2]).val(person.resultData[0].sex);
                }
                $(person_information_input[3]).val(person.resultData[0].address);
            }
        }
    }
    //个人信息修改
    function modify_information() {
        var button = $(".modify_information button");
        button.click(function () {
            var input = $(".modify_information input");
            var name = $(input[0]).val();
            var sex = $(input[1]).val();
            var address = $(input[2]).val();
            var data = {
                name: name,
                sex: sex,
                address: address
            };
            dataLoad("http://www.xhban.com:8080/EM/user/updateinfo", data, modifyInformationBack);
            function modifyInformationBack(callBackData){
                window.alert(callBackData.message);
                window.location.href = "person_information.html"
            }
        });
    }
    //密码修改
    function modify_password() {
        var button = $(".modify_password button");
        button.click(function () {
            var input = $(".modify_password input");
            var o = $(input[0]).val();
            var n = $(input[1]).val();
            var data = {
                password: o,
                new_password: n
            };
            dataLoad("http://www.xhban.com:8080/EM/user/updatepassword", data, modifyPassword);
            function modifyPassword(data){
                window.alert(data.message);
                window.location.href = "index.html"
            }
        });
    }


    //发布房屋信息
    function publish_house () {
        $(div[6]).css("display", "none");
        $(div[page_id]).css("display", "block");
        var input = $(".publish_house .house_content input");
        var p = $(".publish_house .house_content p");
        var file = $("#file");
        var file_img = $(".house_img img");
        var button = $(".publish_house .button button");
        file_img.css("display", "none");
        file.change(function () {
            for(var i = 0; i < this.files.length; i++){
                var reader = new FileReader();
                reader.readAsDataURL(this.files[i]);
                reader.onload = function () {
                    var num = i;
                    return function(){
                        if(num < 5){
                            $(file_img[num]).attr("src", this.result);
                            $(file_img[num]).css("display", "block");
                        }
                    }
                }();
            }
        });
        button.click(function () {
            var data = {
                name: $(input[0]).val(),
                kind: $(input[1]).val(),
                area: $(input[2]).val(),
                village: $(input[3]).val(),
                address: $(input[4]).val(),
                size: $(input[5]).val(),
                contact: $(input[6]).val(),
                phone: $(input[7]).val(),
                type: $(input[8]).val(),
                price: $(input[9]).val()

            };
            dataLoad("http://www.xhban.com:8080/EM/user/relasehouse", data, publishHouseBack);
            function publishHouseBack(data) {
                var form_img = $("#form_img")[0];
                var form_data = new FormData(form_img);
                form_data.append("house_id", data.resultData[0].id);
                form_data.append("image_type", "1");
                $.ajax({
                    url: "http://www.xhban.com:8080/EM/user/uploadimage",
                    type: "post",
                    async: true,
                    cache: false,
                    data: form_data,
                    //必须false才会避开jQuery对 formdata 的默认处理
                    // XMLHttpRequest会对 formdata 进行正确的处理
                    processData: false,
                    //必须false才会自动加上正确的Content-Type
                    contentType: false,
                    xhrFields: {
                        withCredentials: true
                    },
                    crossDomain: true,
                    success: function (imageData) {
                        console.log(imageData);
                        if(data.state == 0 && imageData.state == 0){
                            window.alert("发布成功");
                            window.location.href = "person_information.html?page_id=1";
                        }else if(data.state ==0 && imageData.state != 0){
                            window.alert("房屋发布成功，图片上传失败");
                            window.location.href = "person_information.html?page_id=1";
                        } else{
                            window.alert("发布失败");
                            window.location.href = "person_information.html?page_id=1";
                        }
                    }
                });
            }
        });
    }


    //展示发布房屋信息
    function releaseRecord() {
        dataLoad("http://www.xhban.com:8080/EM/user/listmyhouses", null, releaseRecordBack);
        function releaseRecordBack(data) {
            if(data.state == 0){
                $(div[6]).css("display", "none");
                $(div[page_id]).css("display", "block");
                var ul_div = $("#release ul");
                var numberPage = Math.ceil(data.resultData.length/5);
                var paging = $("#release .paging");
                for(var i =numberPage ;i >= 1; i--){
                    paging.prepend("<a>"+ i +"</a>");
                }
                page(numberPage);
                var a = $("#release .paging a");
                a.css("background-color", "#fff");
                $(a[num_page]).css("background-color", "#eaeaea");

                for(var j = parseInt(num_page)*5; j < (parseInt(num_page)+1)*5 && j < data.resultData.length; j++) {
                    var house_data = data.resultData[j];
                    var house_id = house_data.id;//房屋id
                    var name = house_data.name;//房屋名字
                    var kind = house_data.kind;//房屋类型
                    var village = house_data.village;//小区
                    var size = house_data.size;//大小
                    var type = house_data.type;// 户型
                    var time = house_data.time.slice(0, 9);//时间
                    var price = house_data.price;//价格
                    var traded;//是否售出
                    var img_path = house_data.image;
                    if (house_data == true) {
                        traded = "已售卖";
                    } else {
                        traded = "未售卖";
                    }
                    var qualified;
                    if (house_data.qualified == true) {
                        qualified = "审核通过";
                    } else {
                        qualified = "审核中";
                    }
                    ul_div.append(
                        "<li>" +
                        "<div class='record_content'>" +
                        "<span class='glyphicon glyphicon-chevron-down'></span>" +
                        "<a><img src='" + img_path + "'></a>" +
                        "<div class='record_describe'>" +
                        "<h3><a>" + name + "</a></h3>" +
                        "<div class='address'><span>" + village + "</span><span>" + kind + "</span><span>" + size + "</span></div>" +
                        "<div class='detailed'><span>" + type + "</span><span>" + kind + "</span><span>" + time + "</span></div>" +
                        "<div class='state'><span>" + traded + "</span><span>" + qualified + "</span></div>" +
                        "<div class='price'><span>" + price + "万</span><br><span>" + Math.ceil(price / size) + "万/m<sup>2</sup></span></div>" +
                        "</div>" +
                        "<div class='record_menu'><ul><li>修改信息</li><li>下架房屋</li><li>详细信息</li></ul></div>" +
                        "</div>" +
                        "</li>");

                    //下拉菜单事件
                    var span = $(".record_content>span");
                    var record_menu = $(".record_menu");
                    record_menu.css("display", "none");
                    $(span[j%5]).click(function () {
                        var num = j%5;
                        return function () {
                            if ($(record_menu[num]).css("display") == "none") {
                                $(record_menu[num]).css("display", "block");
                            } else {
                                $(record_menu[num]).css("display", "none");
                            }
                        }
                    }());
                    $(record_menu[j%5]).mouseleave(function () {
                        var num = j%5;
                        return function () {
                            if ($(record_menu[num]).css("display") == "block") {
                                $(record_menu[num]).css("display", "none");
                            }
                        }
                    }());
                    //功能点击事件
                    var ul = $(".record_menu ul");
                    var li = $(ul[j%5]).find("li");
                    $(li[0]).click(function () {
                        var hd = house_id;
                        return function(){
                            var url = "person_information.html?page_id=" + page_id + "&manger_id=" + hd;
                            window.location.href = url;
                        }
                    }());
                    $(li[1]).click(function () {
                        var hd = house_id;
                        return function(){
                            dataLoad("http://www.xhban.com:8080/EM/user/deletehouse", {house_id: hd}, deleteHouseBack);
                        }
                        function deleteHouseBack(data) {
                            window.alert(data.message)
                            window.location.href = window.location.href;
                        }
                    }());
                    $(li[2]).click(function () {
                        var hd = house_id;
                        return function(){
                            window.location.href = "house_details.html?house_id="+hd;
                        }
                    }());
                }
            }
        }
    }

    //房屋信息修改
    function modificationHouse() {
        $(div[6]).css("display", "none");
        $(div[5]).css("display", "block");
    }

    //展示交易记录
    function tradingRecord() {
        dataLoad("http://www.xhban.com:8080/EM/user/listtradeinfos",null, tradingRecordBack);
        function tradingRecordBack(data){
            if(data.state == 0){
                console.log(data);
                $(div[6]).css("display", "none");
                $(div[page_id]).css("display", "block");
                var ul_div = $("#trading ul");
                var numberPage = Math.ceil(data.resultData.length/5);
                var paging = $("#trading .paging");
                for(var i = numberPage; i >= 1; i--){
                    paging.prepend("<a>"+ i +"</a>");
                }
                page(numberPage);
                var a = $("#trading .paging a");
                a.css("background-color", "#fff");
                $(a[num_page]).css("background-color", "#eaeaea");
                for(var j = parseInt(num_page)*5; j < (parseInt(num_page)+1)*5 && j < data.resultData.length; j++){
                    var house_data= data.resultData[j];
                    var house_id = house_data.id;//房屋id
                    var name = house_data.name;//房屋名字
                    var kind = house_data.kind;//房屋类型
                    var village = house_data.village;//小区
                    var size = house_data.size;//大小
                    var type = house_data.type;// 户型
                    var time = house_data.time.slice(0,9);//时间
                    var price = house_data.price;//价格
                    var traded;//是否售出
                    var img_path = house_data.image;
                    if(house_data == true){
                        traded = "已售卖";
                    }else{
                        traded = "未售卖";
                    }
                    var qualified;
                    if(house_data.qualified == true){
                        qualified = "通过审核";
                    }else{
                        qualified = "未过审核";
                    }
                    ul_div.append(
                        "<li>" +
                        "<div class='record_content'>" +
                        "<a><img src='"+img_path+"'></a>" +
                        "<div class='record_describe'>" +
                        "<h3><a>"+name+"</a></h3>" +
                        "<div class='address'><span>"+village+"</span><span>"+kind+"</span><span>"+size+"</span></div>" +
                        "<div class='detailed'><span>"+type+"</span><span>"+kind+"</span><span>"+time+"</span></div>" +
                        "<div class='state'><span>"+traded+"</span><span>"+qualified+"</span></div>" +
                        "<div class='price'><span>"+price+"万</span><br><span>"+Math.ceil(price/size)+"万/m<sup>2</sup></span></div>" +
                        "</div>" +
                        "<button class='modify_button'>修改</button>"+
                        "</div>" +
                        "</li>");
                }
            }
        }
    }





    //页面跳转点击事件
    function jump() {
        for(var i = 0; i < a.length; i++){
            $(li[i]).click(function () {
                var variable = i;
                return function () {
                    var page_id = variable;
                    var url = "person_information.html?page_id=" + page_id;
                    window.location.href = url;
                }
            }());
        }
        for(var i = 0; i < header_menu_a.length; i++){
            $(header_menu_a[i]).click(function () {
                var variable = i;
                return function () {
                    header_menu_a.attr("class", "");
                    $(header_menu_a[variable]).attr("class", "header_menu_a");
                    for(var i =1 ;i < person_information_div.length; i++){
                        $(person_information_div[i]).css("display", "none");
                    }
                    $(person_information_div[variable+1]).css("display", "block");
                }
            }());
        }
    }
    function page(n) {
        var a = $(".paging a");
        for(var i = 0; i < a.length - 1; i++){
            $(a[i]).click(function () {
                var num = i;
                return function () {
                    var url = "person_information.html?page_id=" + page_id + "&num_page=" + num;
                    window.location.href = url;
                }
            }());
        }
        a[a.length-1].click(function () {
            if(num_page+1 <= n){
                var url = "person_information.html?page_id=" + page_id + "&num_page=" + num_page+1;
                window.location.href = url;
            }
        });
    }

    //页面数据加载
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
            success: callback,
            error: function (data) {
                console.log(data)
            }
        });
    }

    //获取地址栏值
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


    //下拉列表
    var selectText = $("#select1 input");
    var li = $("#select_send_1 li");
    var ul = $("#select_send_1");
    var selectDiv = $("#select1");
    var selectText_1 = $("#select2 input");
    var li_1 = $("#select_send_2 li");
    var ul_1 = $("#select_send_2");
    var selectDiv_1 = $("#select2");
    function selectFunction(text, lis, div, content){
        text.val($(lis[0]).text());
        div.click(function () {
           content.css("display", "block");
        });
        content.mouseleave(function () {
            content.css("display", "none");
        });
        for(var i = 0; i < lis.length; i++){
            $(lis[i]).click(function () {
                var index = i;
                return function () {
                    text.val($(lis[index]).text());
                    content.css("display", "none");
                };
            }());
        }
}
    selectFunction(selectText, li, selectDiv, ul);
    selectFunction(selectText_1, li_1, selectDiv_1, ul_1);
 });
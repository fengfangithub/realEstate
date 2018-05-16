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
    dataLoad("http://www.xhban.com:8080/EM/user/lookinfo", {}, personInformationBack);
    function personInformationBack(data){
        console.log(data);
        if(data.state == 0){
            var person_name = $(".person_name>a");
            var person_span = $(".person a span:last-child");
            person_name.text("欢迎您，"+data.resultData[0].name);
            var person_exit = $(".person a:last-child");
            $(person_span[0]).text(data.resultData[0].phone);
            person_exit.click(function () {
                dataLoad("http://www.xhban.com:8080/EM/user/logout",null,null);
                window.location.href = "index.html";
            });
            if(page_id == 0 && data.state == 0){
                person_information_show(data);
                modify_information();
                modify_password();
            }
        }else {
            window.alert(data.message)
            window.location.href = "index.html";
        }

    }
    if(page_id == 1){
        publish_house();
    }
    if(page_id == 2 && manger_id == null){
        releaseRecord();
    }
    if (page_id ==2 && manger_id !=null){
        dataLoad("http://www.xhban.com:8080/EM/user/lookhouseinfo",{house_id: manger_id},Back);
        function Back(data) {
            if (data.state == "查询成功") {
                modificationHouse(data.resultData[0]);
            }
        }
    }
    if(page_id == 3){
        tradingRecord();
    }
    if(page_id == 4){
        buyRecord();
    }
    if(page_id == 5){
        collection()
    }


    //页面个人数据显示
    //个人信息
    function person_information_show(person) {
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
    //个人信息修改
    function modify_information() {
        var button = $(".modify_information button");
        button.click(function () {
            var input = $(".modify_information input");
            var name = $(input[0]).val();
            var sex;
            var address = $(input[4]).val();
            for(var i = 1; i < 4; i++){
                if(input[i].checked){
                   sex = $(input[i]).val();
                }
            }
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
            var map=new AMap.Map("map",{
                zoom:10,
                resizeEnable:true
            });
            var geolocation;
            map.plugin('AMap.Geolocation', function() {
                geolocation = new AMap.Geolocation({
                    enableHighAccuracy: true,//是否使用高精度定位，默认:true
                    timeout: 10000,          //超过10秒后停止定位，默认：无穷大
                    buttonOffset: new AMap.Pixel(50, 50),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
                    // zoomToAccuracy: true,      //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
                    buttonPosition:'RB'
                });
                map.addControl(geolocation);
                geolocation.getCurrentPosition();
                AMap.event.addListener(geolocation, 'complete', onComplete);//返回定位信息
                AMap.event.addListener(geolocation, 'error', onError);      //返回定位出错信息
            });
            function onComplete(data){
                if(data){
                    AMap.plugin('AMap.Geocoder',function(){
                        var geocoder = new AMap.Geocoder({
                        });
                        var address = $(input[4]).val();
                        geocoder.getLocation(address,function(status,result){
                            if(status=='complete'&&result.geocodes.length){
                                var latitude=result.geocodes[0].location.lat;
                                var longtitude=result.geocodes[0].location.lng;
                                var elevator,heating;
                                if($(input[10]).val()=="有电梯"){
                                    elevator=1;
                                }else{
                                    elevator=0;
                                }
                                if ($(input[11]).val()=="有供暖"){
                                    heating=1;
                                } else {
                                    heating=0;
                                }
                                var textarea=$(".house_textarea textarea");
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
                                    price: $(input[9]).val(),
                                    elevator:elevator,
                                    heating:heating,
                                    direction:$(input[12]).val(),
                                    floor:$(input[13]).val(),
                                    finishtime:$(input[14]).val(),
                                    decoration:textarea.val(),
                                    latitude:latitude,
                                    longtitude:longtitude
                                };
                                console.log(result)
                                console.log(data);
                                dataLoad("http://www.xhban.com:8080/EM/user/relasehouse", data, publishHouseBack);
                            }else{
                                $(p[2]).text("地址不清楚");
                            }
                        })
                    });
                }
            }
            function publishHouseBack(data) {
                console.log(data);
                if(data.state != 0){
                    window.alert("发布失败");
                    window.location.href = window.location.href;
                }else{
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

            }
        });
    }

    //展示发布房屋信息
    function releaseRecord() {
        dataLoad("http://www.xhban.com:8080/EM/user/listmyhouses", null, releaseRecordBack);
        function releaseRecordBack(data) {
            if (data.state == 0) {
                $(div[6]).css("display", "none");
                $(div[page_id]).css("display", "block");
                var ul_div = $("#release ul");
                var numberPage = Math.ceil(data.resultData.length / 5);
                //添加分页a标签
                var paging = $("#release .paging");
                paging.append("<a class='next_previous'>上一页</a>");
                for (var i = 1; i <= numberPage; i++) {
                    paging.append("<a class='paging_a'>" + i + "</a>");
                }
                paging.append("<a class='next_previous'>下一页</a>")
                //数据加载
                for (var j = parseInt(num_page) * 5; j < (parseInt(num_page) + 1) * 5 && j < data.resultData.length; j++) {
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
                        "<div class='address'><span>" + village + "</span><span>" + kind + "</span><span>" + size +"  平米"+ "</span></div>" +
                            "<div class='detailed'><span>" + type+"一厅"+ "</span><span>" + house_data.area + "</span><span>" + time + "</span></div>" +
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
                    $(span[j % 5]).click(function () {
                        var num = j % 5;
                        return function () {
                            if ($(record_menu[num]).css("display") == "none") {
                                $(record_menu[num]).css("display", "block");
                            } else {
                                $(record_menu[num]).css("display", "none");
                            }
                        }
                    }());
                    $(record_menu[j % 5]).mouseleave(function () {
                        var num = j % 5;
                        return function () {
                            if ($(record_menu[num]).css("display") == "block") {
                                $(record_menu[num]).css("display", "none");
                            }
                        }
                    }());
                    //功能点击事件
                    var ul = $(".record_menu ul");
                    var li = $(ul[j % 5]).find("li");
                    $(li[0]).click(function () {
                        var hd = house_id;
                        return function () {
                            var url = "person_information.html?page_id=" + page_id + "&manger_id=" + hd;
                            window.location.href = url;
                        }
                    }());
                    $(li[1]).click(function () {
                        var hd = house_id;
                        return function () {
                            dataLoad("http://www.xhban.com:8080/EM/user/deletehouse", {house_id: hd}, deleteHouseBack);
                        }

                        function deleteHouseBack(data) {
                            window.alert(data.message)
                            window.location.href = window.location.href;
                        }
                    }());
                    $(li[2]).click(function () {
                        var hd = house_id;
                        return function () {
                            var k;
                            if(kind == "出售"){
                                k = 0;
                            }else if(kind == "出租"){
                                k = 1;
                            }else{
                                k = 2;
                            }
                            window.location.href = "house_details.html?house_id=" + hd+"&kind="+k;
                        }
                    }());
                }
                //分页点击事件
                var a = $("#release .paging a");
                a.css("background-color", "#fff");
                $(a[parseInt(num_page)+1]).css("background-color", "#eaeaea");
                for (var i = 1; i < a.length - 1; i++) {
                    $(a[i]).click(function () {
                        var num = i - 1;
                        return function () {
                            var url = "person_information.html?page_id=" + page_id + "&num_page=" + num;
                            window.location.href = url;
                        }
                    }());
                }
                $(a[0]).click(function () {
                    if (num_page - 1 >= 0) {
                        var previous = parseInt(num_page) - 1;
                        var url = "person_information.html?page_id=" + page_id + "&num_page=" + previous;
                        window.location.href = url;
                    }
                });
                $(a[a.length - 1]).click(function () {
                    if (num_page + 1 < numberPage) {
                        var next = parseInt(num_page) + 1;
                        var url = "person_information.html?page_id=" + page_id + "&num_page=" + next;
                        window.location.href = url;
                    }
                });
            }
        }
    }

    //房屋信息修改
    function modificationHouse(house_data) {;
        $(div[6]).css("display", "none");
        $(div[5]).css("display", "block");
        var input = $(".manage_input input");
        var action_img = $(".action_img");
        $(input[0]).val(house_data.name);
        $(input[1]).val(house_data.area);
        $(input[2]).val(house_data.village);
        $(input[3]).val(house_data.address);
        $(input[4]).val(house_data.contact);
        $(input[5]).val(house_data.phone);
        $(input[6]).val(house_data.kind);
        $(input[7]).val(house_data.size);
        $(input[8]).val(house_data.type);
        $(input[9]).val(house_data.price);
        imgdelete(house_data);
        function imgdelete(house_data){
            dataLoad("http://www.xhban.com:8080/EM/user/listimages",{house_id: house_data.id},actionImgBack);
            function actionImgBack(data) {
                for(var i = 0; i < data.resultData.length; i++){
                    action_img.append("<div><span class='tglyphicon glyphicon-minus'></span><img src='"+data.resultData[i].path+"'></div>")
                }
                var img_span = $(".action_img span");
                for(var i = 0; i < img_span.length; i++){
                    $(img_span[i]).click(function () {
                        var n = i;
                        return function () {
                            dataLoad("http://www.xhban.com:8080/EM/user/deleteimage",{house_id: house_data.id,image_id:data.resultData[n].id},imgBack);
                        };
                    }());
                }
            }
            function imgBack(data){
                if(data.state == 0){
                    action_img.html("");
                    modificationHouse(house_data);
                }
            }
        }
        var button = $(".manger_button");
        button.click(function () {
            var name = $(input[0]).val();
            var area = $(input[1]).val();
            var village = $(input[2]).val();
            var address = $(input[3]).val();
            var contact = $(input[4]).val();
            var phone = $(input[5]).val();
            var kind = $(input[6]).val();
            var size = $(input[7]).val();
            var type = $(input[8]).val();
            var price = $(input[9]).val();
            console.log(house_data.id);
            dataLoad("http://www.xhban.com:8080/EM/user/updatehouse",{id:house_data.id,price:price,name:name,area: area,village:village,address:address,contact:contact,phone:phone,kind:kind,size:size,type:type},mangerBack);
            function mangerBack(data) {
                window.alert(data.message);
                window.location.href = window.location.href;
            }
        });
    }

    //展示售出记录
    function tradingRecord() {
        dataLoad("http://www.xhban.com:8080/EM/user/listsellinfos", null, tradingRecord);
        function tradingRecord(data) {
            console.log(data);
            if (data.state == 0) {
                $(div[6]).css("display", "none");
                $(div[page_id]).css("display", "block");
                var ul_div = $("#trading ul");
                var numberPage = Math.ceil(data.resultData.length / 5);
                //添加分页a标签
                if(numberPage != 0){
                    var paging = $("#trading .paging");
                    paging.append("<a class='next_previous'>上一页</a>");
                    for (var i = 1; i <= numberPage; i++) {
                        paging.append("<a class='paging_a'>" + i + "</a>");
                    }
                    paging.append("<a class='next_previous'>下一页</a>");
                }
                //数据加载
                for (var j = parseInt(num_page) * 5; j < (parseInt(num_page) + 1) * 5 && j < data.resultData.length; j++) {
                    var house_data = data.resultData[j].house;
                    var buyer_data = data.resultData[j].buyer;
                    var seller_data = data.resultData[j].seller;

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
                        "<b class='seller_log'>已卖</b>" +
                        "<a><img src='"+house_data.image+"'></a>" +
                        "<div class='record_describe'>" +
                        "<h3><a>"+house_data.name+"</a></h3>" +
                        "<div class='buyer'>" +
                        "<div class='trad_content'><label>买家：</label><span>"+buyer_data.name+"</span></div>" +
                        "<div class='trad_content'><label>类型：</label><span>"+house_data.type+"一厅"+"</span></div>" +
                        "<div class='trad_content'><label>价格：</label><span>"+house_data.price+"</span></div>" +
                        "</div>"+
                        "<div class='buyer'>" +
                        "<div class='trad_content'><label>卖家：</label><span>"+seller_data.name+"</span></div>" +
                        "<div class='trad_content'><label>面积：</label><span>"+house_data.size+"平"+"</span></div>" +
                        "<div class='trad_content'><label>时间：</label><span>"+house_data.time.slice(0, 9)+"</span></div>" +
                        "</div>" +
                        "</div>"+
                        "</div>" +
                        "</li>");
                }
                //分页点击事件
                var a = $("#trading .paging a");
                a.css("background-color", "#fff");
                $(a[parseInt(num_page)+1]).css("background-color", "#eaeaea");
                for (var i = 1; i < a.length - 1; i++) {
                    $(a[i]).click(function () {
                        var num = i - 1;
                        return function () {
                            var url = "person_information.html?page_id=" + page_id + "&num_page=" + num;
                            window.location.href = url;
                        }
                    }());
                }
                $(a[0]).click(function () {
                    if (num_page - 1 >= 0) {
                        var previous = parseInt(num_page) - 1;
                        var url = "person_information.html?page_id=" + page_id + "&num_page=" + previous;
                        window.location.href = url;
                    }
                });
                $(a[a.length - 1]).click(function () {
                    if (num_page + 1 < numberPage) {
                        var next = parseInt(num_page) + 1;
                        var url = "person_information.html?page_id=" + page_id + "&num_page=" + next;
                        window.location.href = url;
                    }
                });
            }
        }
    }

    //展示购买记录
    function buyRecord() {
        dataLoad("http://www.xhban.com:8080/EM/user/listbuyinfos", {}, tradingRecord);
        function tradingRecord(data) {
            console.log(data);
            if (data.state == 0) {
                $(div[6]).css("display", "none");
                $(div[page_id]).css("display", "block");
                var ul_div = $("#buy ul");
                var numberPage = Math.ceil(data.resultData.length / 5);
                //添加分页a标签
                if(numberPage != 0){
                    var paging = $("#buy .paging");
                    paging.append("<a class='next_previous'>上一页</a>");
                    for (var i = 1; i <= numberPage; i++) {
                        paging.append("<a class='paging_a'>" + i + "</a>");
                    }
                    paging.append("<a class='next_previous'>下一页</a>");
                }
                //数据加载
                for (var j = parseInt(num_page) * 5; j < (parseInt(num_page) + 1) * 5 && j < data.resultData.length; j++) {
                    var house_data = data.resultData[j].house;
                    var buyer_data = data.resultData[j].buyer;
                    var seller_data = data.resultData[j].seller;

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
                        "<b class='seller_log'>已买</b>" +
                        "<a><img src='"+house_data.image+"'></a>" +
                        "<div class='record_describe'>" +
                        "<h3><a>"+house_data.name+"</a></h3>" +
                        "<div class='buyer'>" +
                        "<div class='trad_content'><label>买家：</label><span>"+buyer_data.name+"</span></div>" +
                        "<div class='trad_content'><label>类型：</label><span>"+house_data.type+"一厅"+"</span></div>" +
                        "<div class='trad_content'><label>价格：</label><span>"+house_data.price+"</span></div>" +
                        "</div>"+
                        "<div class='buyer'>" +
                        "<div class='trad_content'><label>卖家：</label><span>"+seller_data.name+"</span></div>" +
                        "<div class='trad_content'><label>面积：</label><span>"+house_data.size+"平"+"</span></div>" +
                        "<div class='trad_content'><label>时间：</label><span>"+house_data.time.slice(0, 9)+"</span></div>" +
                        "</div>" +
                        "</div>"+
                        "</div>" +
                        "</li>");
                }
                //分页点击事件
                var a = $("#buy .paging a");
                a.css("background-color", "#fff");
                $(a[parseInt(num_page)+1]).css("background-color", "#eaeaea");
                for (var i = 1; i < a.length - 1; i++) {
                    $(a[i]).click(function () {
                        var num = i - 1;
                        return function () {
                            var url = "person_information.html?page_id=" + page_id + "&num_page=" + num;
                            window.location.href = url;
                        }
                    }());
                }
                $(a[0]).click(function () {
                    if (num_page - 1 >= 0) {
                        var previous = parseInt(num_page) - 1;
                        var url = "person_information.html?page_id=" + page_id + "&num_page=" + previous;
                        window.location.href = url;
                    }
                });
                $(a[a.length - 1]).click(function () {
                    if (num_page + 1 < numberPage) {
                        var next = parseInt(num_page) + 1;
                        var url = "person_information.html?page_id=" + page_id + "&num_page=" + next;
                        window.location.href = url;
                    }
                });
            }
        }
    }

    //展示个人收藏
    function collection() {
        $(div[6]).css("display", "none");
        $(div[7]).css("display","block");
        dataLoad("http://www.xhban.com:8080/EM/user/list_all_collections", null, releaseRecordBack);
        function releaseRecordBack(data) {
            if (data.state == 0) {
                console.log(data);
                $(div[6]).css("display", "none");
                $(div[7]).css("display", "block");
                var ul_div = $("#collection ul");
                var numberPage = Math.ceil(data.resultData.length / 5);
                //添加分页a标签
                var paging = $("#collection .paging");
                paging.append("<a class='next_previous'>上一页</a>");
                for (var i = 1; i <= numberPage; i++) {
                    paging.append("<a class='paging_a'>" + i + "</a>");
                }
                paging.append("<a class='next_previous'>下一页</a>")
                //数据加载
                for (var j = parseInt(num_page) * 5; j < (parseInt(num_page) + 1) * 5 && j < data.resultData.length; j++) {
                    var house_data = data.resultData[j].house;
                    var house_id = house_data.id;//房屋id
                    var name = house_data.name;//房屋名字
                    var kind = house_data.kind;//房屋类型
                    var village = house_data.village;//小区
                    var size = house_data.size;//大小
                    var type = house_data.type;// 户型
                    var time = house_data.time;//时间
                    var price = house_data.price;//价格
                    var traded;//是否售出
                    var img_path = house_data.image;
                    var collection_id=data.resultData[j].id;
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
                        "<div class='address'><span>" + village + "</span><span>" + kind + "</span><span>" + size +"  平米"+ "</span></div>" +
                        "<div class='detailed'><span>" + type+"一厅"+ "</span><span>" + house_data.area + "</span><span>" + time + "</span></div>" +
                        "<div class='state'><span>" + traded + "</span><span>" + qualified + "</span></div>" +
                        "<div class='price'><span>" + price + "万</span><br><span>" + Math.ceil(price / size) + "万/m<sup>2</sup></span></div>" +
                        "</div>" +
                        "<div class='record_menu'><ul><li>删除收藏</li><li>详细信息</li></ul></div>" +
                        "</div>" +
                        "</li>");

                    //下拉菜单事件
                    var span = $(".record_content>span");
                    var record_menu = $(".record_menu");
                    record_menu.css("display", "none");
                    $(span[j % 5]).click(function () {
                        var num = j % 5;
                        return function () {
                            if ($(record_menu[num]).css("display") == "none") {
                                $(record_menu[num]).css("display", "block");
                            } else {
                                $(record_menu[num]).css("display", "none");
                            }
                        }
                    }());
                    $(record_menu[j % 5]).mouseleave(function () {
                        var num = j % 5;
                        return function () {
                            if ($(record_menu[num]).css("display") == "block") {
                                $(record_menu[num]).css("display", "none");
                            }
                        }
                    }());
                    //功能点击事件
                    var ul = $(".record_menu ul");
                    var li = $(ul[j % 5]).find("li");
                    $(li[0]).click(function () {
                        var id = collection_id;
                        return function () {
                            dataLoad("http://www.xhban.com:8080/EM/user/delete_collection",{collection_id:id},collectionDeleteBack);
                            function collectionDeleteBack(data) {
                                console.log(data);
                                if(data.state==0){
                                    window.alert(data.message);
                                    window.location.href=window.location.href;
                                }
                            }
                        }
                    }());
                    $(li[1]).click(function () {
                        var hd = house_id;
                        var kind=kind;
                        return function () {
                            var k;
                            if(kind == "出售"){
                                k = 0;
                            }else if(kind == "出租"){
                                k = 1;
                            }else{
                                k = 2;
                            }
                            window.location.href = "house_details.html?house_id=" + hd+"&kind="+k;
                        }
                    }());
                }
                //分页点击事件
                var a = $("#release .paging a");
                a.css("background-color", "#fff");
                $(a[parseInt(num_page)+1]).css("background-color", "#eaeaea");
                for (var i = 1; i < a.length - 1; i++) {
                    $(a[i]).click(function () {
                        var num = i - 1;
                        return function () {
                            var url = "person_information.html?page_id=" + page_id + "&num_page=" + num;
                            window.location.href = url;
                        }
                    }());
                }
                $(a[0]).click(function () {
                    if (num_page - 1 >= 0) {
                        var previous = parseInt(num_page) - 1;
                        var url = "person_information.html?page_id=" + page_id + "&num_page=" + previous;
                        window.location.href = url;
                    }
                });
                $(a[a.length - 1]).click(function () {
                    if (num_page + 1 < numberPage) {
                        var next = parseInt(num_page) + 1;
                        var url = "person_information.html?page_id=" + page_id + "&num_page=" + next;
                        window.location.href = url;
                    }
                });
            }
        }
    }

    //页面跳转点击事件
    function jump() {
        for(var i = 0; i < a.length; i++){
            $(li[i]).click(function () {
                var variable = i;
                return function () {
                    var url = "person_information.html?page_id=" + variable;
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

    //页面数据下载
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

    var selectText_2 = $("#select3 input");
    var li_2 = $("#select_send_3 li");
    var ul_2 = $("#select_send_3");
    var selectDiv_2 = $("#select3");

    var selectText_3 = $("#select4 input");
    var li_3 = $("#select_send_4 li");
    var ul_3 = $("#select_send_4");
    var selectDiv_3 = $("#select4");

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
    selectFunction(selectText_2, li_2, selectDiv_2, ul_2);
    selectFunction(selectText_3, li_3, selectDiv_3, ul_3);
 });
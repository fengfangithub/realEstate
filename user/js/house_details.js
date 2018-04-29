$(function () {
    if(getQueryString("house_id") != null){
        var house_id = getQueryString("house_id");
        var kind = getQueryString("kind");
        var person_a = $(".person a");
        var current = $(".top a");
        dataLoad("http://www.xhban.com:8080/EM/user/lookinfo", {}, personInformationBack);
        function personInformationBack(data){
            if(data.state == 0){
                $(person_a[0]).text(data.resultData[0].phone);
                $(person_a[0]).attr("href","person_information.html");
            }else{
                $(person_a[0]).text("xxx");
            }
            $(person_a[1]).click(function () {
                dataLoad("http://www.xhban.com:8080/EM/user/logout",null,null);
            });
        }
        var href = "advanced_search.html?kind="+kind;
        current.attr("href",href);
        if(kind == 0){
            current.text("出售房");
        }else if(kind == 1){
            current.text("出租房");
        }else{
            current.text("商铺");
        }
        details();
    }else{
        window.location.href = "advanced_search.html?kind=0"
    }
    function details() {
        dataLoad("http://www.xhban.com:8080/EM/user/lookhouseinfo",{house_id: house_id}, detailsBack);
    }
    function detailsBack(data){
        dataLoad("http://www.xhban.com:8080/EM/user/listimages",{house_id: house_id}, imgBack);
        function imgBack(imgdata) {
            console.log(data);
            console.log(imgdata);

            //图片展示
            var resultImgData = imgdata.resultData;
            img(resultImgData);
            //信息展示
            var resultData = data.resultData[0];
            var h2 = $(".head h2");
            var price_span = $(".head p span:last-child");
            var houseMark = $(".house_mark span");
            var details_span = $(".span_last");
            var phone = $(".phone p span:last-child");
            h2.text(resultData.name);
            price_span.text(resultData.price);
            if(resultData.qualified == true){
                $(houseMark[0]).text("审核通过");
            }else{
                $(houseMark[0]).text("审核未过");
            }
            if(resultData.traded == false){
                $(houseMark[1]).text("待售");
            }else{
                $(houseMark[1]).text("售出");
            }
            $(details_span[0]).text(resultData.name);
            $(details_span[1]).text(resultData.type+"一厅");
            $(details_span[2]).text(resultData.size+" m");
            $(details_span[2]).append("<sup>2</sup>");
            $(details_span[3]).text(resultData.contact);
            $(details_span[4]).text(resultData.village);
            $(details_span[5]).text(resultData.phone);
            $(details_span[6]).text(resultData.area);
            $(details_span[7]).text(resultData.time);
            $(details_span[8]).text(resultData.address);
            phone.text(resultData.phone);
        }
    }
    //图片播放
    function img(imgData) {
        var list = $("#list");
        var prev = $("#prev")
        var next = $("#next");
        var num = 1;
        var contain_img_menu = $(".contain_img_menu");
        var width = imgData.length*100+"%";
        list.css("width",width);
        for(var i =0; i < imgData.length; i++){
            list.append("<img src='"+imgData[i].path+"'>");
        }
        for(var j = 0; j < imgData.length; j++){
            contain_img_menu.append("<img src='"+imgData[j].path+"'>")
        }
        var img_1 = $(".contain_img_menu img:first-child");
        img_1.css("border", "1px solid red");
        function animate(offset){
            if(num > imgData.length){
                list.css("left","0px");
                num = 1;
            }else if(num < 1){
                var end = -(imgData.length - 1)*650;
                list.css("left", end+"px")
                num = imgData.length;
            }else{
                var newLeft = parseInt(list.css("left")) + offset;
                list.css("left",newLeft);
            }
        }
        next.click (function () {
            num+=1;
            animate(-650);
            var contain_img = $(".contain_img_menu img");
            contain_img.css("border", "none");
            $(contain_img[num-1]).css("border", "1px solid red");
        });
        prev.click(function () {
            num-=1;
            animate(650);
            var contain_img = $(".contain_img_menu img");
            contain_img.css("border", "none");
            $(contain_img[num-1]).css("border", "1px solid red");
        });
    }
    //请求信息
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
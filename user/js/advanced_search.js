$(function () {
    var price = String(getQueryString("price"));
    var size = String(getQueryString("size"));
    var type = String(getQueryString("type"));
    var start_price = String(getQueryString("start_price"));
    var end_price = String(getQueryString("end_price"));
    var start_size = String(getQueryString("start_size"));
    var end_size = String(getQueryString("end_size"));
    var custom_price = getQueryString("custom_price");
    var custom_size = getQueryString("custom_size");
    var sort;
    var serach = getQueryString("serach");
    if(getQueryString("sort") == null){
        sort = 0;
    }else{
        sort = getQueryString("sort");
    }
    var num_page;
    if(getQueryString("num_page") == null){
        num_page = 0;
    }else{
        num_page = parseInt(getQueryString("num_page"));
    }
    var kind;
    var kind_a = $(".contain ul a");
    if(getQueryString("kind") == null){
        kind = 0;
    }else{
        kind = getQueryString("kind");
    }
    var checkbox_1 = $("#check_content_1 .check_box_content input");
    var checkbox_2 = $("#check_content_2 .check_box_content input");
    var checkbox_3 = $("#check_content_3 .check_box_content input");
    var checkbox_4 = $("#check_content_4 .check_box_content input");
    var show_bar_a = $(".show_bar a");

    //功能页面跳转
    function checkBox(checkbox, n) {
        for(var i = 0; i < checkbox.length; i++){
            checkbox[i].onclick = function () {
                var s= i;
                return function () {
                    var url;
                    if(n == 1){
                        price = s;
                        start_price = $(checkbox[s]).attr("data-startprice");
                        end_price = $(checkbox[s]).attr("data-endprice");
                        url = "advanced_search.html?"+"price="+price+"&size="+size+"&type="+type+"&kind="+kind+"&start_price="+start_price+"&end_price="+end_price+"&start_size="+start_size+"&end_size="+end_size+"&custom_price=null"+"&custom_size="+custom_size;
                        window.location = url;
                    }else if(n == 2){
                        size = s;
                        start_size = $(checkbox[s]).attr("data-startsize");
                        end_size = $(checkbox[s]).attr("data-endsize");
                        url = "advanced_search.html?"+"price="+price+"&size="+size+"&type="+type+"&kind="+kind+"&start_price="+start_price+"&end_price="+end_price+"&start_size="+start_size+"&end_size="+end_size+"&custom_price="+custom_price+"&custom_size=null";
                        window.location = url;
                    }else if(n == 3){
                        type = s;
                        var url = "advanced_search.html?"+"price="+price+"&size="+size+"&type="+type+"&kind="+kind+"&start_price="+start_price+"&end_price="+end_price+"&start_size="+start_size+"&end_size="+end_size+"&custom_price="+custom_price+"&custom_size="+custom_size;
                        window.location = url;
                    }else{
                        kind = s;
                        var url = "advanced_search.html?"+"price="+price+"&size="+size+"&type="+type+"&kind="+kind+"&start_price="+start_price+"&end_price="+end_price+"&start_size="+start_size+"&end_size="+end_size+"&custom_price="+custom_price+"&custom_size="+custom_size;
                        window.location = url;
                    }
                }
            }();
        }
        var custom_a = $(".check_custom a");
        var custom_input = $(".check_custom input");
        $(custom_a[0]).click(function () {
            start_price = $(custom_input[0]).val();
            end_price = $(custom_input[1]).val();
            var url = "advanced_search.html?"+"price=null"+"&size="+size+"&type="+type+"&kind="+kind+"&start_price="+start_price+"&end_price="+end_price+"&start_size="+start_size+"&end_size="+end_size+"&custom_price=0"+"&custom_size="+custom_size;
            window.location.href = url;
        });
        $(custom_a[1]).click(function () {
            start_size = $(custom_input[2]).val();
            end_size = $(custom_input[3]).val();
            var url = "advanced_search.html?"+"price="+price+"&size=null"+"&type="+type+"&kind="+kind+"&start_price="+start_price+"&end_price="+end_price+"&start_size="+start_size+"&end_size="+end_size+"&custom_price="+custom_price+"&custom_size=0";
            window.location.href = url;
        });
    }
    (function check(){
        //搜索限制条件
        checkBox(checkbox_1, 1);
        checkBox(checkbox_2, 2);
        checkBox(checkbox_3, 3);
        checkBox(checkbox_4, 4);
        for(var i = 0; i < kind_a.length; i++){
            if(i>0 && i<4){
                $(kind_a[i]).click(function () {
                    var n = i-1;
                    return function () {
                        var url = "advanced_search.html?"+"&kind="+n;
                        window.location.href = url;
                    }
                }());
            }
            if(i == 0){
                $(kind_a[0]).attr("href","index.html");
            }
        }
        //排序方式
        for(var i = 0; i < show_bar_a.length; i++){
            $(show_bar_a[i]).click(function () {
                var n = i;
                return function () {
                    var str = window.location.href;
                    var url = str.split("&sort")[0]+"&sort="+n;
                    window.location.href = url;
                };
            }());
        }
        var bt = $(".input button");
        var input = $(".input input");
        bt.click(function () {
            var paging = $(".paging");
            var showContent = $(".show_content ul");
            paging.html("");
            showContent.html("");
            pageLoad("http://www.xhban.com:8080/EM/user/searchhouses",{parameter: input.val()});
        });
    })();

    //执行页面加载
    (function loading() {
        dataLoad("http://www.xhban.com:8080/EM/user/lookinfo",{},loginBack);
        function loginBack(data){
            console.log(data);
            if(data.state == 0){
                var person = $(".person");
                var a = $(".person a");
                person.css("display","block");
                a.text(data.resultData[0].name);
                a.attr("href","person_information.html");
            }
        }
        var kind_a = $(".contain ul li a");
        var custom_input = $(".check_custom input");
        $(kind_a[parseInt(kind)+1]).css("color","#ffffff");
        show_bar_a.attr("class","a_noclick");
        $(show_bar_a[sort]).attr("class","a_click");
        if(price != "null"){
            checkbox_1[parseInt(price)].checked = true;
        }
        if(size != "null"){
            checkbox_2[parseInt(size)].checked = true;
        }
        if(type != "null"){
            checkbox_3[parseInt(type)].checked = true;
        }
        if(kind != null){
            checkbox_4[parseInt(kind)].checked = true;
        }
        if(custom_price == "0"){
            $(custom_input[0]).val(start_price);
            $(custom_input[1]).val(end_price);
        }
        if(custom_size == "0"){
            $(custom_input[2]).val(start_size);
            $(custom_input[3]).val(end_size);
        }
        if(serach != null){
            pageLoad("http://www.xhban.com:8080/EM/user/searchhouses",{parameter:decodeURI(serach)})
        }else if(price == "null" && size == "null" && type == "null"){
            if(sort == 0){
                pageLoad("http://www.xhban.com:8080/EM/user/listprettyhousesbyparameterandorderbydefault",{kind: $(checkbox_4[kind]).attr("data-kind")});
            }else if(sort == 1){
                pageLoad("http://www.xhban.com:8080/EM/user/listprettyhousesbyparameterandorderbysizeup",{kind: $(checkbox_4[kind]).attr("data-kind")});
            }else if(sort == 2){
                pageLoad("http://www.xhban.com:8080/EM/user/listprettyhousesbyparameterandorderbypriceup",{kind: $(checkbox_4[kind]).attr("data-kind")});
            }
            return;
        }else{
            var data = {};
            if(start_price != "null"){
                data.start_price = start_price;
                data.end_price = end_price;
            }
            if(start_size != "null"){
                data.start_size = start_size;
                data.end_size = end_size;
            }
            if(type != "null"){
                data.type = $(checkbox_3[type]).attr("data-type");
            }
            if(kind != null){
                data.kind = $(checkbox_4[kind]).attr("data-kind");
            }
            console.log(data);
            if(sort == 0){
                pageLoad("http://www.xhban.com:8080/EM/user/listprettyhousesbyparameterandorderbydefault",data);
            }else if(sort == 1){
                pageLoad("http://www.xhban.com:8080/EM/user/listprettyhousesbyparameterandorderbysizeup",data);
            }else if(sort == 2){
                pageLoad("http://www.xhban.com:8080/EM/user/listprettyhousesbyparameterandorderbypriceup",data);
            }
            return;
        }
    })();

    //页面房屋数据加载
    function pageLoad(url,data) {
        dataLoad(url,data, pageLoadBack);
    }
    function pageLoadBack(data) {
        console.log(data);
        if(data.state == 0){
            //添加分页a标签
            var numberPage = Math.ceil(data.resultData.length / 5);
            var paging = $(".paging");
            paging.append("<a class='next_previous'>上一页</a>");
            for (var i = 1; i <= numberPage; i++) {
                paging.append("<a class='paging_a'>" + i + "</a>");
            }
            paging.append("<a class='next_previous'>下一页</a>");
            var showContent = $(".show_content ul");
            for (var j = parseInt(num_page) * 5; j < (parseInt(num_page) + 1) * 5 && j < data.resultData.length; j++) {
                var house_data = data.resultData[j];
                var house_id = house_data.id;//房屋id
                var traded;//是否售出
                if (house_data.traded == true) {
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
                showContent.append
                ("<li><div class='content'>" +
                    "<a class='buy_a'>购买</a>" +
                    "<div class='content_img'><a><img src='"+house_data.image+"'></a></div>" +
                    "<div class='content_show'>" +
                    "<h2>"+house_data.name+"</h2>" +
                    "<div id='content1_div1'><span>"+house_data.type+"一厅"+"</span><span class='segmentation'></span><span>"+house_data.village+"</span><span class='segmentation'></span><span>"+house_data.area+"</span><span class='segmentation'></span><span>"+house_data.time+"</span><span>发布</span></div>" +
                    "<div id='content1_div2'><span>联系人:</span><span>"+house_data.contact+"</span><span>联系电话:</span><span>"+house_data.phone+"</span></div>" +
                    "<div id='content1_div3'><span>地址</span><span>"+house_data.address+"</span></div>" +
                    "</div>" +
                    "<div class='content_price'><span>"+house_data.price+"</span>万元</div>" +
                    "<div class='content_are'><span>"+house_data.size+"</span>平米</div>" +
                "</div></li>");
                //请求购买
                var buy = $(".content>a");
                $(buy[j%5]).click(function (event) {
                    dataLoad("http://www.xhban.com:8080/EM/user/requestdeal",{house_id: house_id},buyBack);
                    function buyBack(data) {
                        console.log(data);
                        if(data.state == 0){
                            window.alert(data.message);
                            window.location.href = window.location.href;
                        }
                    }
                    event.stopPropagation();
                });
                //跳转详细页面
                var li = $(".show_content li");
                $(li[j%5]).click(function () {
                    var id = house_id;
                    return function () {
                        window.location.href = "house_details.html?house_id="+id+"&kind="+kind;
                    }
                }());
            }
            //分页点击事件
            var a = $(".paging a");
            a.css("background-color", "#fff");
            $(a[parseInt(num_page)+1]).css("background-color", "#eaeaea");
            for (var i = 1; i < a.length - 1; i++) {
                $(a[i]).click(function () {
                    var num = i - 1;
                    return function () {
                        var str = window.location.href;
                        var url = str.split("&num_page")[0]+"&num_page="+num;
                        window.location.href = url;
                    }
                }());
            }
            $(a[0]).click(function () {
                if (num_page - 1 >= 0) {
                    var previous = parseInt(num_page) - 1;
                    var str = window.location.href;
                    var url = str.split("&num_page")[0]+"&num_page="+previous;
                    window.location.href = url;
                }
            });
            $(a[a.length - 1]).click(function () {
                if (num_page + 1 < numberPage) {
                    var next = num_page+1;
                    var str = window.location.href;
                    var url = str.split("&num_page")[0]+"&num_page="+next;
                    window.location.href = url;
                }
            });
        }

    }

    //ajax请求房屋信息
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


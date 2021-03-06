$(function () {

    var a = $(".app-menu li a");
    for (var i = 0; i < a.length; i++ ){
        if(i != 2){
            $(a[i]).mouseenter(function () {
                $(this).css("border-left","3px solid #009688");
            });
            $(a[i]).mouseleave(function () {
                $(this).css("border","none");
            });
        }
    }
    var page_num;
    var rows;
    var user_id;
    if(getQueryString("page_num") == null){
        page_num = 1;
    }else{
        page_num = parseInt(getQueryString("page_num"));
    }
    if(getQueryString("rows") == null){
        rows = 10;
    }else{
        rows = parseInt(getQueryString("rows"));
    }
    if (getQueryString("user_id") == null){
        user_id = -1;
    }else{
        user_id = getQueryString("user_id");
    }


    //请求所有用户发布信息
    (function release() {
        if(user_id !=-1){
            dataLoad("http://www.xhban.com:8080/EM/admin/listtradeinfosofuser",{user_id: user_id}, alltradeInformationBack);
        }else{
            dataLoad("http://www.xhban.com:8080/EM/admin/listusers",null, allUserInformationBack);
            function allUserInformationBack(data){
                if(data.state==0){
                    var user_id=data.resultData[0].id;
                    dataLoad("http://www.xhban.com:8080/EM/admin/listtradeinfosofuser",{user_id:user_id},alltradeInformationBack)
                }
            }
        }

    })();
    function alltradeInformationBack(data){
        if(data.state == 0){
            console.log(data);
            var resultData = data.resultData;
            $("#sampleTable_info").text("总共有 "+resultData.length+" 行");
            var ul = $("#sampleTable_paginate ul");
            var num = Math.ceil(resultData.length/rows);
            ul.append("<li class='paginate_button page-item previous'><a class='page-link'>上一页</a></li>");
            for(var i =1; i <= num; i++){
                ul.append("<li><a class='page-link'>"+i+"</a></li>");
            }
            ul.append("<li class='paginate_button page-item next'><a class='page-link'>下一页</a></li>");
            //表格数据加载
            var tbody= $("#sampleTable tbody");
            for(var i =(page_num - 1)*rows; i < page_num*rows && i < resultData.length; i++){
                var sellerid = resultData[i].sellerid;
                var buyerid = resultData[i].buyerid;
                var houseid = resultData[i].houseid;
                var housedata;
                var sellerdata;
                var buyerdata;
                dataLoad("http://www.xhban.com:8080/EM/user/lookhouseinfo",{house_id:houseid},houseBack);
                function houseBack(data){
                    if(data.state == "查询成功"){
                        housedata = data.resultData[0];
                        tbody.append(
                            "<tr>" +
                            "<td>"+housedata.name+"</td>" +
                            "<td>"+housedata.kind+"</td>" +
                            "<td>"+housedata.area+"</td>" +
                            "<td>"+housedata.village+"</td>" +
                            "<td>"+housedata.address+"</td>" +
                            "<td>"+housedata.size+"</td>" +
                            "<td>"+housedata.type+"</td>" +
                            "<td>"+housedata.traded+"</td>" +
                            "<td>"+housedata.qualified+"</td>" +
                            "<td>"+housedata.contact+"</td>" +
                            "<td>"+housedata.phone+"</td>" +
                            "<td>"+housedata.price+"</td>" +
                            "<td>"+housedata.time+"</td>" +
                            "</tr>");
                    }
                }
            }
            //页数点击事件
            var a = $("#sampleTable_paginate ul li a");
            $(a[page_num]).css("background-color","#dee2e6");
            for (var j = 1; j < a.length-1; j++){
                $(a[j]).click(function () {
                    var n = j;
                    return function () {
                        var url = "releaseRecord.html?page_num="+n+"&rows="+rows+"&user_id="+user_id;
                        window.location.href = url;
                    }
                }());
            }
            $(a[0]).click(function () {
                if(page_num-1>=1){
                    var url = "releaseRecord.html?page_num="+(page_num-1)+"&rows="+rows+"&user_id="+user_id;
                    window.location.href = url;
                }
            });
            $(a[a.length-1]).click(function () {
                if(page_num+1<=num){
                    var url = "releaseRecord.html?page_num="+(page_num+1)+"&rows="+rows+"&user_id="+user_id;
                    window.location.href = url;
                }
            });

            //选择显示多少行
            var select = $("#sampleTable_length select");
            select.val(rows);
            select.change(function () {
                var text = select.val();
                var url = "releaseRecord.html?page_num=1"+"&rows="+text;
                window.location.href = url;
            });
        }else{
            window.location.href = "index.html";
        }
    }

    //ajax请求数据
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
                console.log(data);
                window.location.href = "index.html";
            }
        });
    }
    //获取地址栏的值
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
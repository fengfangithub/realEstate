$(function () {

    var a = $(".app-menu li a");
    for (var i = 1; i < a.length; i++ ){
        $(a[i]).mouseenter(function () {
            $(this).css("border-left","3px solid #009688");
        });
        $(a[i]).mouseleave(function () {
            $(this).css("border","none");
        });
    }
    var page_num;
    var rows;
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

    //请求所有用户信息
    (function allUserInformation() {
        dataLoad("http://www.xhban.com:8080/EM/admin/listusers",null, allUserInformationBack);
    })();
    function allUserInformationBack(data){
        console.log(data);
        if(data.state == 0){
            var resultData = data.resultData;
            $("#sampleTable_info").text("总共有 "+resultData.length+" 行");
            var ul = $("#sampleTable_paginate ul");
            var num = Math.ceil(resultData.length/rows);
            //页数添加事件
            ul.append("<li class='paginate_button page-item previous'><a class='page-link'>上一页</a></li>");
            for(var i =1; i <= num; i++){
                ul.append("<li><a class='page-link'>"+i+"</a></li>");
            }
            ul.append("<li class='paginate_button page-item next'><a class='page-link'>下一页</a></li>");


            //表格数据加载
            var tbody= $("#sampleTable tbody");
            for(var i =(page_num - 1)*rows; i < page_num*rows && i < resultData.length; i++){
                var id = resultData[i].id;
                var sex;
                if(resultData[i].sex == ""){
                    sex = "未公开";
                }else{
                    sex = resultData[i].sex;
                }
                var state;
                if(resultData[i].state == false){
                    state = "禁用"
                }else{
                    state = "未禁用"
                }
                tbody.append(
                    "<tr>" +
                    "<td>"+resultData[i].name+"</td>" +
                    "<td>"+resultData[i].password+"</td>" +
                    "<td>"+sex+"</td>" +
                    "<td>"+resultData[i].phone+"</td>" +
                    "<td>"+resultData[i].address+"</td>" +
                    "<td>"+state+"</td>" +
                    "<td style='width: 30%'>" +
                    "<a style='color: red;cursor: pointer;margin-right: 20px;font-size: 0.9em'><i class='fa fa-trash-o' style='margin-right: 5px;'></i>删除</a>" +
                    "<a style='color: red;cursor: pointer;margin-right: 20px;font-size: 0.9em'><i class='fa fa-paper-plane' style='margin-right: 5px;'></i>发布记录</a>" +
                    "<a style='color: red;cursor: pointer;margin-right: 20px;font-size: 0.9em'><i class='fa fa-handshake-o' style='margin-right: 5px;'></i>交易记录</a>" +
                    "</td>" +
                    "</tr>");

                var td = $("#sampleTable tbody td:last-child");
                var fun_a = $(td[i%rows]).find("a");
                //删除用户点击事件
                $(fun_a[0]).click(function () {
                    var s = state;
                    var user_id = id;
                    return function () {
                        if(s == false){
                            dataLoad("http://www.xhban.com:8080/EM/admin/forbiduser", {user_id: user_id}, deleteBack);
                        }else{
                            window.alert("已经被禁用")
                        }
                    }
                }());
                //查询用户发布信息
                $(fun_a[1]).click(function () {
                    var user_id = id
                    return function () {
                        var url = "releaseRecord.html?user_id="+user_id;
                        window.location.href = url;
                    }
                }());
                //查询用户交易记录
                $(fun_a[2]).click(function () {
                    var user_id = id
                    return function () {
                        var url = "transactionRecord.html?user_id="+user_id;
                        window.location.href = url;
                    }
                }());
            }
            function deleteBack(data){
                window.alert(data.message);
                window.location.href = window.location.href;
            }


            //页数点击事件
            var a = $("#sampleTable_paginate ul li a");
            $(a[page_num]).css("background-color","#dee2e6");
            for (var j = 1; j < a.length-1; j++){
                $(a[j]).click(function () {
                    var n = j;
                    return function () {
                        var url = "allUser.html?page_num="+n+"&rows="+rows;
                        window.location.href = url;
                    }
                }());
            }
            $(a[0]).click(function () {
                if(page_num-1>=1){
                    var url = "allUser.html?page_num="+(page_num-1)+"&rows="+rows;
                    window.location.href = url;
                }
            });
            $(a[a.length-1]).click(function () {
                if(page_num+1<=num){
                    var url = "allUser.html?page_num="+(page_num+1)+"&rows="+rows;
                    window.location.href = url;
                }
            });
            //选择显示多少行
            var select = $("#sampleTable_length select");
            select.val(rows);
            select.change(function () {
                var text = select.val();
                var url = "allUser.html?page_num=1"+"&rows="+text;
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
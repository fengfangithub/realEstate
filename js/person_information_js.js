$(function () {

    //页面跳转点击事件
    var a = $(".left ul li a");
    var li = $(".left ul li");
    var div = $(".right>div");
    var page_id;
    var header = $(".right header");
    if(getQueryString("page_id") == null){
        page_id = 0;
    } else{
        page_id = getQueryString("page_id");
    }
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

    //页面显示方法
    function display() {
        $(li[page_id]).css("background-color", "#3cb570");
        var text = $(a[page_id]).text();
        header.text(text + "管理");
        $(div[7]).css("display", "block");
    }
    display();
    function accordingJudgment() {
        $(div[7]).css("display", "block");
        var data = dataLoad_1();
        if(data.state != 0){
            $(div[page_id]).css("display", "block");
            $(div[7]).css("display", "none");
        }
    }
    accordingJudgment();
    //页面数据加载
    function dataLoad_1() {
        var data_load = null;
        $.ajax({
            url: "user/lookinfo",
            type: "post",
            dataType: "json",
            crossDomain: true,
            success: function (data) {
                data_load = data;
                console.log(data);
            },
            error: function () {
                console.log(data)
            }
        });
        return data_load;
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
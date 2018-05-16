$(function () {
    var wrapper = $(".wrapper");
    var animationed = false;
    var index = 1;
    var bt = $(".num_bt span");
    var bt_div = $(".num_bt div");
    var h = parseInt($(window).height());
    wrapper.css("height",h+"px");
    $(window).resize(function () {
        h = parseInt($(window).height());
        wrapper.css({"top": -h*(index-1),"height": h})
    });
    $("body").mousewheel(function (event) {
        console.log(event.deltaX,event.deltaY,event.deltaFactor);
        if (event.deltaY > 0 && animationed == false && index > 1){
            index --;
            showButtom(index - 1);
            animation(h);
            return;
        }
        if(event.deltaY < 0 && animationed == false && index < 4){
            index++;
            showButtom(index - 1)
            animation(-h);
            return;
        }
    });
    for(var i = 0; i < bt.length; i++){
        $(bt[i]).click(function () {
            var n = i;
            return function () {
                var of = (index - (n+1))*h;
                showButtom(n);
                animation(of);
                index = n+1;
            }
        }());
    }
    function showButtom(n) {
        bt_div.attr("class","");
        $(bt_div[n]).attr("class", "show");
    }
    function animation(offset) {
        animationed = true;
        wrapper.animate({top: "+="+offset+"px"});
        setTimeout(function () {
            animationed = false;
        },1200);
    }
    //文件下载

    dataLoad("http://www.xhban.com:8080/EM/user/lookinfo",{},loginBack);
    function loginBack(data){
        console.log(data);
        if(data.state == 0){
            var person = $(".person");
            person.css("display","block");
            var a = $(".person a");
            person.css("display","block");
            a.text(data.resultData[0].phone);
            a.attr("href","person_information.html");
            var span=$(".person span");
            span.click(function () {
                dataLoad("http://www.xhban.com:8080/EM/user/logout",null,null);
                window.location.href=window.location.href;
            })
        }
    }



    function dataLoad(url, data, callback) {
        $.ajax({
            url: url,
            type: "get",
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
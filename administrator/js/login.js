$(function () {
    var no = $("#no");
    var ps = $("#ps");
    var bt = $("#bt");
    bt.click(function (e) {
        e.preventDefault();
        dataLoad("http://www.xhban.com:8080/EM/admin/login",{name: no.val(),password:ps.val()},loginBack);
        function loginBack(data){
            console.log(data);
            if(data.state == 0){
                window.location.href = "allUser.html";
            }else{
                window.alert(data.message);
                window.location.href = window.location.href;
            }
        }
    });
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
                console.log(data)
            }
        });
    }
});
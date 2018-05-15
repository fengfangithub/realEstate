$(function () {

    dataLoad("http://www.xhban.com:8080/EM/user/lookinfo", {}, personInformationBack);
    function personInformationBack(data){
        var span=$(".person span");
        var a=$(".person a");
        if(data.state == 0){
            span.text(data.resultData[0].phone);
            span.attr("href","person_information.html");
        }else{
            span.text("xxx");
        }
        a.click(function () {
            dataLoad("http://www.xhban.com:8080/EM/user/logout",null,null);
            window.location.href=window.location.href;
        });
    }


    var con=$("#container");
    var h = parseInt($(window).height())-59;
    con.css("height",h+"px");
    $(window).resize(function () {
        h = parseInt($(window).height())-59;
        con.css("height",h+"px");
    });

    var map=new AMap.Map("container",{
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
            dataLoad("http://www.xhban.com:8080/EM/user/list_limit_houses",{longtitude:data.position.getLng(),latitude:data.position.getLat(),radius:30},nearBack);
            function nearBack(data){
                console.log(data);
                for(var i=0;i<data.resultData.length;i++) {
                    var marker = new AMap.Marker({
                        position: [data.resultData[i].longtitude,data.resultData[i].latitude],
                        offset: new AMap.Pixel(-12,-12),
                        zIndex: 101,
                        map: map
                    });
                    AMap.event.addListener(marker,"mouseover",function () {
                        var name=data.resultData[i].name;
                        var position=[data.resultData[i].longtitude,data.resultData[i].latitude];
                        return function () {
                            AMap.plugin('AMap.Geocoder', function () {
                                var geocoder = new AMap.Geocoder({});
                                geocoder.getAddress(position, function (status, result) {
                                    if (status == 'complete') {
                                        var info=[];
                                        info.push("<div style='border-bottom: 1px solid #f0f3f5'>"+name+"</div>");
                                        info.push("<div style='padding: 10px 5px;font-size: 0.8em'>"+result.regeocode.formattedAddress+"</div>");
                                        var infoWindow = new AMap.InfoWindow({
                                            content:info.join(""),
                                            offset: new AMap.Pixel(0, -31)
                                        });
                                        infoWindow.open(map, position);
                                    }
                                })
                            });
                        };
                    }());
                    AMap.event.addListener(marker,"mouseout",function () {
                        map.clearInfoWindow();
                    });
                    AMap.event.addListener(marker,"click",function () {
                        var house_id=data.resultData[i].id;
                        return function () {
                            window.location.href="house_details.html?house_id="+house_id;
                        }
                    }())
                }
            }
        }else{
            window.alert("定位失败！！");
        }
    }



    map.plugin(["AMap.Scale"],function(){
        var scale = new AMap.Scale();
        map.addControl(scale);
    });
    // map.plugin(["AMap.ToolBar"],function(){
    //     //加载工具条
    //     var tool = new AMap.ToolBar();
    //     tool.position="RB";
    //     map.addControl(tool);
    // });

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
            success: callback
        });
    }
});
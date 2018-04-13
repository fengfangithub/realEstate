$(function () {
    var contain = $(".contain");
    var list = $("#list");
    var buttons = $("#buttons span");
    var prev = $("#prev")
    var next = $("#next");
    var h = parseInt($(document.body).width());
    var index = 1;
    var animated = false;
    var timer;

    function showButton() {
        for(var i=0;i<buttons.length;i++){
            if(buttons[i].className == "on"){
                buttons[i].className = "";
                break;
            }
        }
        buttons[index-1].className="on";
    }

    function animate(offset){
        var newLeft = parseInt(list.css("left"))/h*100 + offset;
        var time = 800;
        var interval = 20;
        var speed = offset/(time/interval);
        function go(){
            animated = true;
            if(speed < 0 && parseInt(list.css("left"))/h*100+speed > newLeft || speed > 0 && parseInt(list.css("left"))/h*100+speed < newLeft){
                var left = parseInt(list.css("left"))/h*100 + speed +"%";
                list.css("left",left);
                setTimeout(go,interval);
            }else{
                animated = false;
                list.css("left",newLeft + "%");
                if(newLeft < -300){
                    list.css("left",-100+"%");
                }
                if(newLeft > -100){
                    list.css("left",-300+"%")
                }
            }
        }
        go()
    }

    function play(){
        timer = setInterval(function () {
            next.click();
        },4000);
    }
    function stop(){
        clearInterval(timer);
    }

    next.click (function () {
        if(index == 3){
            index = 1;
        }else{
            index+=1;
        }
        showButton();
        if(animated == false){
            animate(-100);
        }
    });

    prev.click(function () {
        if(index == 1){
            index = 1;
        }else{
            index -= 1;
        }
        showButton();
        if(animated == false){
            animate(100);
        }
    });

    for(var i = 0; i < buttons.length; i++){
        buttons[i].onclick = function () {
            if(this.className =="on"){
                return;
            }
            var myIndex = parseInt(this.getAttribute("index"));
            var offset = -100 * (myIndex - index);
            index = myIndex;
            animate(offset);
            showButton();
        }
    }
    contain.mouseover(function () {
        stop();
    });
    contain.mouseout(function () {
        play();
    })

    play();
});
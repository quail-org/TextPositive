var popup = document.getElementById("popup");
var title = document.getElementById("title");
title.innerHTML = "Reading Settings...";

chrome.storage.sync.get('enable', function(res){
    console.log('enable= ' + res);
    if (res.enable){
        title.innerHTML = "Text Positive is on";
        popup.style.backgroundColor = 'green';
        //TODO: set switch style

    }else{
        title.innerHTML = "Text Positive is off";
        popup.style.backgroundColor = 'red';
    }
});

// switch communcates with storage
var toggle = document.getElementById("toggle");
/*
toggle.addEventListener("click", function(){
    //TODO:on condition ? "enable" : "disable";
    console.log('toggle click');
    chrome.storage.sync.set({
        enable: false 
    }, function(){
        console.log('popup update');
    });
});
*/

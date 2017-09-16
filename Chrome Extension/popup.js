var popup = document.getElementById("popup");
var title = document.getElementById("title");
title.innerHTML = "Reading Settings...";

var enabled = false;

chrome.storage.sync.get('enable', function(res){
    console.log('enable= ' + res.enable);
    if (res.enable){
		enabled = true;
        title.innerHTML = "Text Positive is on";
        popup.style.backgroundColor = 'green';
        //TODO: set switch style
    }else{
		enabled = false;
        title.innerHTML = "Text Positive is off";
        popup.style.backgroundColor = 'red';
    }
});

// switch communcates with storage
var toggle = document.getElementById("toggle");

toggle.onclick = function(){
    //TODO:on condition ? "enable" : "disable";
    console.log('toggle click');
	enabled = !enabled;
	chrome.storage.sync.set({
		enabled: enabled 
	}, function(){
		console.log('popup update');
	});
	return false;
};

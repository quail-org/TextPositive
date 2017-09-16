var popup = document.getElementById("popup");
var title = document.getElementById("title");
title.innerHTML = "Reading Settings...";

var enabled = false;

function updateCSS(){
    if (enabled){
        title.innerHTML = "Text Positive is on";
        popup.style.backgroundColor = 'green';
        //TODO: set switch style
    }else{
        title.innerHTML = "Text Positive is off";
        popup.style.backgroundColor = 'red';
    }
}

chrome.storage.sync.get('enabled', function(res){
    enabled = res.enabled;
    console.log('enable= ' + enabled);
    updateCSS();
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
	//return false;
};

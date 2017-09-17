var popup = document.getElementById("popup");
var stat = document.getElementById("status");
var check = document.getElementById("check");

var enabled = false;

function updateCSS(){
    if (enabled){
        stat.innerHTML = "Text Positive is on";
        check.checked = true;
        popup.className = "on";
        //TODO: set switch style
    }else{
        stat.innerHTML = "Text Positive is off";
        check.checked = false;
        popup.className = "off";
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
    updateCSS();
	chrome.storage.sync.set({
		enabled: enabled 
	}, function(){
		console.log('popup update');
	});
	return false;
};

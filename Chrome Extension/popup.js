var popup = document.getElementById("popup");
var stat = document.getElementById("status");
var check = document.getElementById("check");

var enabled = false;

function updateCSS(){
    if (enabled){
        stat.innerHTML = "Text Positive is <i id='ON'>ON</i>";
        document.getElementById("ON").style.color = "#95DAE5";
        check.checked = true;
        popup.className = "on";
    }else{
        stat.innerHTML = "Text Positive is <i id='OFF'>OFF</i>";
        document.getElementById("OFF").style.color = "#ff0000";
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

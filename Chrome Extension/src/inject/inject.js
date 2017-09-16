chrome.extension.sendMessage({}, function(response) {
    var readyStateCheckInterval = setInterval(function() {
        if (document.readyState === "complete") {
            clearInterval(readyStateCheckInterval);
            
            // ----------------------------------------------------------
            // This part of the script triggers when page is done loading
            console.log("INJECTED FOR HACKMIT");
            // ----------------------------------------------------------

            var enable = true;

            chrome.storage.sync.set({
                enable: enable
            }, function(){
                console.log('enable saved');
            });

            chrome.storage.onChanged.addListener(function(changes, namespace) {
                for (key in changes) {
                    let storageChange = changes[key];
                    if (key === "enable"){
                        console.log('Updated enable' + enable);
                        enable = storageChange.newValue;
                    }
                }
            });


            // Listen for messages from the popup
            chrome.runtime.onMessage.addListener(function (msg, sender, response) {
                console.log("recieved msg from popup");
                // First, validate the message's structure
                if ((msg.from === 'popup') && (msg.subject === 'enable')) {
                    enable = true;
                    //response(domInfo);
                }
                // disable enable  
                if ((msg.from === 'popup') && (msg.subject === 'disable')) {
                    enable = false;
                }
            });

        }
    }, 10);
});

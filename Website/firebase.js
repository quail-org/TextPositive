// Initialize Firebase
var config = {
    apiKey: "AIzaSyBm_a-TOwovgH2L-ArWAJUsJW4qF_DoHsA",
    authDomain: "textpositiv.firebaseapp.com",
    databaseURL: "https://textpositiv.firebaseio.com",
    projectId: "textpositiv",
    storageBucket: "textpositiv.appspot.com",
    messagingSenderId: "757536400980"
};
firebase.initializeApp(config);
console.log('initialized firebase');

var db = firebase.database();
var ref = db.ref("data");

var data = {
    test:true
}

ref.push(data, function(err){
    if (err){
        console.log(err.message);
    }
});


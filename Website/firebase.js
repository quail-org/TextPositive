// Initialize Firebase
var config = {
    apiKey: "AIzaSyCr_U9tmt1mzgLJ3dTgv1N1Y9EWony-EYU",
    authDomain: "textpositive.firebaseapp.com",
    databaseURL: "https://textpositive.firebaseio.com",
    projectId: "textpositive",
    storageBucket: "textpositive.appspot.com",
    messagingSenderId: "805865541319"
};
firebase.initializeApp(config);
console.log('initialized firebase');

var db = firebase.database();
var ref = db.ref("data");

var submitbtn = document.getElementById("submit");

submitbtn.onclick = function(){
    console.log('submit click');
    let neg = document.getElementById("neg");
    let pos = document.getElementById("pos");
    let data = {
        neg:neg.value,
        pos:pos.value
    }
    if (pos.value){
        neg.value = ""; //TODO: NEW RANDOM GENERATION
        pos.value = "";
        ref.push(data, function(err){
            if (err){
                console.log(err.message);
            }
        });

    }
};




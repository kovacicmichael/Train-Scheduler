
// Initialize Firebase
var config = {
    apiKey: "AIzaSyAiNJmUWd5FaT84Chs__rJ5Nx7Z-HLWNdA",
    authDomain: "trainschedule-7ac28.firebaseapp.com",
    databaseURL: "https://trainschedule-7ac28.firebaseio.com",
    projectId: "trainschedule-7ac28",
    storageBucket: "trainschedule-7ac28.appspot.com",
    messagingSenderId: "492771587094"
};
firebase.initializeApp(config);

var database = firebase.database();


var trainName = "";
var trainTime = "";
var destination = "";
var frequency = "";
var nextArrival = 0;
var minutesAway = 0;

//click funtion to gather data and input into firebase
$("#submit").on("click", function(event){
  event.preventDefault();

  trainName = $("#train-name").val().trim();
  trainTime = $("#start-time").val().trim();
  destination = $("#destination").val().trim();
  frequency = $("#frequency").val().trim();


  database.ref().push({
    trainName: trainName,
    trainTime: trainTime,
    destination: destination,
    frequency: frequency,
    dateAdded: firebase.database.ServerValue.TIMESTAMP
  });
});

//function to call the data from firebase and input into html
database.ref().on("child_added", function(childSnapshot){

  var generateRow = $("<tr>");

  generateRow.html("<td>" + childSnapshot.val().trainName + "</td>" + 
    "<td>" + childSnapshot.val().destination + "</td>" + 
    "<td>" + childSnapshot.val().frequency + "</td>" + 
    "<td>" + nextArrival + "</td>" + 
    "<td>" + minutesAway + "</td>");

  $(".train-sect").append(generateRow);

  console.log(childSnapshot.val().trainName);
  console.log(childSnapshot.val().destination);
  console.log(childSnapshot.val().frequency);

  //this clears the values in the form
  $("#train-name").val("");
  $("#start-time").val("");
  $("#destination").val("");
  $("#frequency").val("");

}, function(errorObject) {
      console.log("Errors handled: " + errorObject.code);
});

//orders the given data from firebas into sequential order by its added date
database.ref().orderByChild("dateAdded").limitToLast(1).on("child_added", function(snapshot){
  var generateRow = $("<tr>");
  generateRow.html("<td>" + snapshot.val().trainName + "</td>" + 
    "<td>" + snapshot.val().destination + "</td>" + 
    "<td>" + snapshot.val().frequency + "</td>" + 
    "<td>" + nextArrival + "</td>" + 
    "<td>" + minutesAway + "</td>");
  
  $("#add-employee").append(generateRow);
});




//for all the info submitted i want to commit that info to firsebase 

//next i need to pull that info from firebase and input it into the html

//with the submitted in i need to create a formula to input the remainder fields

//
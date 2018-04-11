
// Initialize Firebase
const config = {
    apiKey: "AIzaSyAiNJmUWd5FaT84Chs__rJ5Nx7Z-HLWNdA",
    authDomain: "trainschedule-7ac28.firebaseapp.com",
    databaseURL: "https://trainschedule-7ac28.firebaseio.com",
    projectId: "trainschedule-7ac28",
    storageBucket: "trainschedule-7ac28.appspot.com",
    messagingSenderId: "492771587094"
};
firebase.initializeApp(config);
const database = firebase.database();
//set the variables
let trainName = "";
let trainTime;
let destination = "";
let frequency;
let nextArrival = 0;
let minutesAway = 0;


//this enables the current time and train arrival time to update
$(document).ready(function(){
    datetime = $('#datetime')
    update();
    setInterval(update, 1000);

});

//click funtion to gather data and input into firebase
$("#submit").on("click", function(event){
  event.preventDefault();

  trainName = $("#train-name").val().trim();
  destination = $("#destination").val().trim();
  trainTime = moment($("#start-time").val().trim(), "HH:mm").format("HH:mm");
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

  let frequency = childSnapshot.val().frequency;
  let trainTime = childSnapshot.val().trainTime;
    //logic to determine when the next train is going to arrive
    let trainTimeConverted = moment(trainTime, "HH:mm").subtract(1,"years");
    let currentTime = moment();
    let diffTime = moment().diff(moment(trainTimeConverted), "minutes");
    let tRemainder = diffTime % frequency;
    let minutesAway = frequency - tRemainder;
    let nextArrival = moment().add(minutesAway, "minutes").format("hh:mma");
    //generates the data into the HTML
    const generateRow = $("<tr>");

    generateRow.html("<td>" + childSnapshot.val().trainName + "</td>" + 
      "<td>" + childSnapshot.val().destination + "</td>" + 
      "<td>" + childSnapshot.val().frequency + "</td>" + 
      "<td id=nextArrival>" + nextArrival + "</td>" + 
      "<td id=minutesAway>" + minutesAway + "</td>");

    $(".train-sect").append(generateRow);
  //this clears the values in the form
  $("#train-name").val("");
  $("#start-time").val("");
  $("#destination").val("");
  $("#frequency").val("");
}, function(errorObject) {
      console.log("Errors handled: " + errorObject.code);
});

//orders the given data from firebase into sequential order by its added date
// database.ref().orderByChild("dateAdded").limitToLast(1).on("child_added", function(snapshot){
//   var generateRow = $("<tr>");
//   generateRow.html("<td>" + snapshot.val().trainName + "</td>" + 
//     "<td>" + snapshot.val().destination + "</td>" + 
//     "<td>" + snapshot.val().frequency + "</td>" + 
//     "<td>" + nextArrival + "</td>" + 
//     "<td>" + minutesAway + "</td>");
  
//   $("#add-employee").append(generateRow);
// });

let datetime = null;
let date = null;

//runs the clock and updates the arrival time infor every minute
function update() {
  date = moment(new Date()).format("h:mm:ss")
  $("#currentTime").text(date)
  let refresh = moment().format("ss");
   
  if(refresh == 00){
    $(".train-sect").empty()
      database.ref().on("child_added", function(childSnapshot){

        let frequency = childSnapshot.val().frequency;
        let trainTime = childSnapshot.val().trainTime;
        
          let trainTimeConverted = moment(trainTime, "HH:mm").subtract(1,"years");
          let currentTime = moment();
          let diffTime = moment().diff(moment(trainTimeConverted), "minutes");
          let tRemainder = diffTime % frequency;
          let minutesAway = frequency - tRemainder;
          let nextArrival = moment().add(minutesAway, "minutes").format("hh:mma");
          //generates the data into the HTML
            const generateRow = $("<tr>");

            generateRow.html("<td>" + childSnapshot.val().trainName + "</td>" + 
              "<td>" + childSnapshot.val().destination + "</td>" + 
              "<td>" + childSnapshot.val().frequency + "</td>" + 
              "<td id=nextArrival>" + nextArrival + "</td>" + 
              "<td id=minutesAway>" + minutesAway + "</td>");

            $(".train-sect").append(generateRow);

        //this clears the values in the form
        $("#train-name").val("");
        $("#start-time").val("");
        $("#destination").val("");
        $("#frequency").val("");

      }, function(errorObject) {
            console.log("Errors handled: " + errorObject.code);
      });
   };
};




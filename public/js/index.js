  $(document).ready(function(){
     // Initialize Firebase
  var config = {
    apiKey: "AIzaSyCbo4t29qLtGPTCuHbwqTKhVBbJiZX4V3c",
    authDomain: "chat-app-2809f.firebaseapp.com",
    databaseURL: "https://chat-app-2809f.firebaseio.com",
    projectId: "chat-app-2809f",
    storageBucket: "chat-app-2809f.appspot.com",
    messagingSenderId: "674017311022"
  };
  firebase.initializeApp(config); 

  //This function checks if the signup forms are valid. If they are, a new user is created with Firebase Authentication
  console.log("hello");
  function create_user(email, password){
    sessionStorage.clear();
    firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
  
        $("#error-body").text(errorMessage);
        $("#myModal").modal('show');

        $("#inputName").val("");
        $("#inputEmail").text("");
        $("#inputPassword").val("");
        $("#inputConfirmPassword").val("");
      });
}

//This function checks if sign in credentials are valid, and displays an error message if they are not
function sign_in(email, password){
    window.location.replace("/messages/"+sessionStorage.getItem("uid"));
    firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
      
        $("#error-body").text(errorMessage);
        $("#myModal").modal('show');
        
        $("#inputEmail").text("");
        $("#inputPassword").val("");

      });
}


//Function verifies that city, state, name, and other str fields are more than 0 characters long
function name_verification(name){
    if (name.length > 0){
        return true;
    }
    else{
        return false;
    }
}

//This function checks if the user retyped their password correctly
function confirm_password(pass, confirm){
    if (pass == confirm){
        return true;
    }
    else{
        return false;
    }
}

//This function returns whether the form submitted is the Sign-In or Sign-Up form
function which_form(){
    return $(".submit-btn").text();
}

//This function checks the sign form for valid entries in required fields and submits it if everything is indeed valid
function send_sign_form(){
    var form = which_form();
    if (form == "Sign Up"){
        var errors = [];
        var str_field_check = name_verification($("#inputName").val().trim());
        var confirm_check = confirm_password($("#inputPassword").val(), $("#inputConfirmPassword").val());
        if (str_field_check == false){
            errors.push("Please fill in all required fields");
        }
        if (confirm_check == false){
            errors.push("Your password confirmation failed");
        };
        if (errors.length == 0){
            //Create the user if there are no errors
            create_user($("#inputEmail").val().trim(), $("#inputPassword").val());
        }
        else{
            $("#error-body").html("");
            $("#error-body").append($("<div>").text("There are error(s) with your submission:"));
            errors.forEach(function(value){
                $("#error-body").append($("<div>").text(value));
            });
            $("#myModal").modal('show');
            
            $("#inputName").val("");
            $("#inputEmail").val("");
            $("#inputPassword").val("");
            $("#inputConfirmPassword").val("");


        }
    }
    else{
        //signs the user in if the sign in form was submitted
        sign_in($("#inputEmail").val().trim(), $("#inputPassword").val().trim());
    }
}

  //This Firebase function occurs when a user signs in or signs out, extracts the user's unique id, and sets Firebase values based on given inputs
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // User is signed in.
      sessionStorage.setItem("uid", user.uid);
      //Checks that the user just signed up
      if(which_form() == "Sign Up" && $("#inputName").val().trim() != ""){
        new_user = {
          uid: user.uid,
          name: $("#inputName").val().trim()
        };
        console.log(new_user);
        $.ajax("/api/new_user", {
          type: "POST",
          data: new_user
        }).then(function(){
          window.location.replace("/messages/"+user.uid);
          console.log("hello goodbye");
          // $(location).attr("href", "/messages/"+user.uid);
        });
        
        // window.location.replace("/messages/"+user.uid);
        
      }
        // else{
        //   window.location.replace("/messages/"+user.uid);
        // }

        
      $("#inputName").val("");
      $("#inputtEmail").val("");
      $("#inputPassword").val("");
      $("#inputConfirmPassword").val("");
    }
  });

    //Sets background color of sign page sign in button and hides sign up info
    $(".sign-in-select").on("click", function(){
      console.log("hello");
      $(this).css("color", "white");
      $(this).css("background-color", "#007bff");
      $(".sign-up-select").css("color", "black");
      $(".sign-up-select").css("background-color", "white");

      $(".exclusive").hide();

      $(".submit-btn").text("Sign In");
  });

  //Sets sign up button to different color
  $(".sign-up-select").on("click", function(){
      $(this).css("color", "white");
      $(this).css("background-color", "#007bff");
      $(".sign-in-select").css("color", "black");
      $(".sign-in-select").css("background-color", "white");

      $(".exclusive").show();

      $(".submit-btn").text("Sign Up");
  });

    //Sends sign form
    $(".submit-btn").on("click", function(event){
      event.preventDefault();
      send_sign_form();
      });

      $("#signOut").on("click", function(){
        window.location.replace("/");
        firebase.auth().signOut().then(function(){}).catch(function(error) {
            // An error happened
          });
      });
  });


$(document).ready(function(){

var other_id = sessionStorage.getItem("other_id", other_id);
var other_name = sessionStorage.getItem("other_name", other_name);

$("#toName").text(other_name);

 $("#myList li").css("display", "none");
 $("#myInput").on("keyup", function() {
   var value = $(this).val().toLowerCase();
   $("#myList li").filter(function() {
     if (value != ""){
         $(this).toggle(($(this).text().toLowerCase().indexOf(value) > -1));
     }
     else {
         $("li").css("display", "none");
     }
   });
 });

 $(".list-group-item").on("click", function(){
     userSelected($(this).attr("data-other-user-id"), $(this).attr("data-other-user-name"), true);
 });

 $(".userDiv").on("click", function(){
     userSelected($(this).attr("id"), $(this).attr("data-user-other-name"), true);
 });

 $("#sendMessage").on("click", function(event){
     event.preventDefault();

     if (($("#messageText").val() != "") && (sessionStorage.getItem("other_id") != null || sessionStorage.getItem("other_id") != "")){
         $.ajax("/api/"+sessionStorage.getItem("uid")+"/"+$(this).attr("data-my-name").replace("_", " ")+"/"+sessionStorage.getItem("other_id")+"/"+sessionStorage.getItem("other_name")+"/"+$("#messageText").val()+"/new_message", {
         type: "POST"
        }).then(userSelected(sessionStorage.getItem("other_id"), sessionStorage.getItem("other_name"), false));
     }
 })

});

function userSelected(other_id, other_name, put){
    console.log("what what");
    // if (put){
        $.ajax("/api/"+sessionStorage.getItem("uid")+"/"+other_id+"/read", {
            type: "PUT"
        }).then(function(){
            // userSelected(other_id, other_name, false)});
    // }
    
    // else {
        sessionStorage.setItem("other_id", other_id);
        sessionStorage.setItem("other_name", other_name);
        
        location.reload().then(function(){
            console.log("reloaded");
            
            $("div[data-other-id='"+other_id+"']").show();
            $("#"+other_id).css("background-color", "#0095ff");
            $("#"+other_id).css("color", "white");

            $("#toName").text(other_name);
            });
    });
    // }

 }
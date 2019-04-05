$(document).ready(function(){

var other_id = sessionStorage.getItem("other_id", other_id);
var other_name = sessionStorage.getItem("other_name", other_name);

$("#refresh").on("click", function(){
    location.reload();
});

//get user you're talking to and put in header
$("#toName").text(other_name);
if (other_name != null){
    //make icon capital letters in user's name
    $("#toNameicon").text(other_name.replace(/[a-z|\s]/g, '').substring(0,2));
}

$.ajax("/api/was-notified/"+sessionStorage.getItem("uid"), {
    type: "PUT"
});

//show messages with selected user, change user dive to blue
$("div[data-other-id='"+other_id+"']").show();
$("div[data-other-id='"+other_id+"']").css("display", "inline-block");
$("#"+other_id).css("background-color", "#0095ff");
$("#"+other_id).css("color", "white");
$("#"+other_id).css("font-weight", "bold");

 $("#myList li").css("display", "none");
 //show users with inputted string in name
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
//make icons for each of other name
$(".otherUserName").each(function(i, obj){
    console.log(obj);
    console.log($(".icon")[i+1]);
    $(".icon")[i+1].textContent = obj.textContent.replace(/[a-z|\s]/g, '').substring(0,2);
})
//start chatting with user after you search for him/her
 $(".list-group-item").on("click", function(){
     userSelected($(this).attr("data-other-user-id"), $(this).attr("data-other-user-name").replace("_", " "), true);
 });

 $(".userDiv").on("click", function(){
     userSelected($(this).attr("id"), $(this).attr("data-user-other-name").replace("_", " "), true);
 });

//scroll to the bottom of your messages for most recent messages
$("#messagesDiv").scrollTop($("#messagesDiv").height());

//use return to send message
 $("#messageText").keyup(function(e) {
    if (e.keyCode == 13 && ($("#messageText").val() != "") && (sessionStorage.getItem("other_id") != null && sessionStorage.getItem("other_id") != "")) { //triggers when a user presses enter after filling out a valid text to someone
        $.ajax("/api/"+sessionStorage.getItem("uid")+"/"+$(this).attr("data-my-name").replace("_", " ")+"/"+sessionStorage.getItem("other_id")+"/"+sessionStorage.getItem("other_name")+"/"+$("#messageText").val()+"/new_message", {
            type: "POST"
           }).then(userSelected(sessionStorage.getItem("other_id"), sessionStorage.getItem("other_name"), false));
        }
    })

//click submit button to send message
 $("#sendMessage").on("click", function(event){
     event.preventDefault();

     if (($("#messageText").val() != "") && (sessionStorage.getItem("other_id") != null && sessionStorage.getItem("other_id") != "")){
         $.ajax("/api/"+sessionStorage.getItem("uid")+"/"+$(this).attr("data-my-name").replace("_", " ")+"/"+sessionStorage.getItem("other_id")+"/"+sessionStorage.getItem("other_name")+"/"+$("#messageText").val()+"/new_message", {
         type: "POST"
        }).then(userSelected(sessionStorage.getItem("other_id"), sessionStorage.getItem("other_name"), false));
     }
 })

});

//select user and get messages with user
function userSelected(other_id, other_name, put){
    $.ajax("/api/"+sessionStorage.getItem("uid")+"/"+other_id+"/read", {
        type: "PUT"
    }).then(function(){

    sessionStorage.setItem("other_id", other_id);
    sessionStorage.setItem("other_name", other_name);
    $(".message").hide();
    location.reload();
    });

 }
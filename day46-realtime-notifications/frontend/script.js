const API="http://localhost:5000";
let socket;

async function signup(){
 await fetch(API+"/signup",{
   method:"POST",
   headers:{'Content-Type':'application/json'},
   body:JSON.stringify({
     username:username.value,
     password:password.value
   })
 });
 alert("Signup done");
}

async function login(){

 const res = await fetch(API+"/login",{
   method:"POST",
   headers:{'Content-Type':'application/json'},
   body:JSON.stringify({
     username:username.value,
     password:password.value
   })
 });

 const data = await res.json();

 localStorage.setItem("token",data.token);

 window.location="dashboard.html";
}

/* SOCKET */

if(window.location.pathname.includes("dashboard")){

 socket = new WebSocket("ws://localhost:5000");

 socket.onmessage=(event)=>{
   const data=JSON.parse(event.data);

   if(data.type==="notification"){
     notifications.innerHTML+=`<p>${data.message}</p>`;
   }
 };

}

function sendNotification(){
 socket.send(JSON.stringify({
   type:"notify",
   message:msg.value
 }));
}
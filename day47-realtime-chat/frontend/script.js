const API="http://localhost:5000";
let socket;
let selectedUser=null;

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
 window.location="chat.html";
}

/* Chat */

if(window.location.pathname.includes("chat")){

 socket = new WebSocket("ws://localhost:5000");

 socket.onopen=()=>{
   socket.send(JSON.stringify({
     type:"auth",
     token:localStorage.getItem("token")
   }));
 };

 socket.onmessage=(event)=>{
   const data=JSON.parse(event.data);

   if(data.type==="public"){
     messages.innerHTML+=`<p><b>${data.user}:</b> ${data.message}</p>`;
   }

   if(data.type==="private"){
     messages.innerHTML+=`<p style="color:orange"><b>Private from ${data.from}:</b> ${data.message}</p>`;
   }

   if(data.type==="users"){
     users.innerHTML="";
     data.users.forEach(u=>{
       users.innerHTML+=`<div onclick="selectUser('${u}')">${u}</div>`;
     });
   }

   if(data.type==="typing"){
     typing.innerText=`${data.user} is typing...`;
     setTimeout(()=>typing.innerText="",1000);
   }
 };

 msg.addEventListener("input",()=>{
   socket.send(JSON.stringify({type:"typing"}));
 });

}

function sendPublic(){
 socket.send(JSON.stringify({
   type:"public",
   message:msg.value
 }));
 msg.value="";
}

function selectUser(user){
 selectedUser=user;
}

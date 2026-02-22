const API="http://localhost:5000";

async function signup(){

 const username=document.getElementById("username").value;
 const password=document.getElementById("password").value;

 await fetch(API+"/signup",{
  method:"POST",
  headers:{"Content-Type":"application/json"},
  body:JSON.stringify({username,password})
 });

 alert("Signup done");
}

async function login(){

 const username=document.getElementById("username").value;
 const password=document.getElementById("password").value;

 const res=await fetch(API+"/login",{
  method:"POST",
  headers:{"Content-Type":"application/json"},
  body:JSON.stringify({username,password})
 });

 const data=await res.json();

 console.log(data);
}

async function forgot(){

 const username=document.getElementById("username").value;

 await fetch(API+"/forgot-password",{
  method:"POST",
  headers:{"Content-Type":"application/json"},
  body:JSON.stringify({username})
 });

 alert("Check terminal for reset link");
}

async function reset(){

 const params=new URLSearchParams(window.location.search);
 const token=params.get("token");

 const newPassword=document.getElementById("newPass").value;

 await fetch(API+"/reset-password",{
  method:"POST",
  headers:{"Content-Type":"application/json"},
  body:JSON.stringify({token,newPassword})
 });

 alert("Password updated");
}
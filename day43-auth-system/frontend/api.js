export const API = {

 async login(username,password){

  const res = await fetch("http://localhost:5000/login",{
   method:"POST",
   headers:{ "Content-Type":"application/json" },
   body: JSON.stringify({ username,password })
  });

  return res.json();

 },

 async getDashboard(){

  const token = localStorage.getItem("token");

  const res = await fetch("http://localhost:5000/dashboard",{
   headers:{
    Authorization: `Bearer ${token}`
   }
  });

  return res.json();

 }

};
// Simulated backend API

export const API = {

 async fetchTasks() {

  return new Promise(resolve => {
    setTimeout(() => {

      resolve([
        {id:1, title:"Design UI", status:"todo"},
        {id:2, title:"Setup Auth", status:"progress"},
        {id:3, title:"Deploy App", status:"done"}
      ]);

    },500);
  });

 },

 async updateTask(id, status) {

  // pretend sending PATCH request

  return new Promise(resolve => {
    setTimeout(() => resolve({success:true}),300);
  });

 },

 async createTask(title) {

  return {
    id: Date.now(),
    title,
    status:"todo"
  };

 }

};
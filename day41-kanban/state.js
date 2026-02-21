export const state = {

 tasks: [],

 setTasks(data) {
  this.tasks = data;
 },

 moveTask(id, newStatus) {

  const task = this.tasks.find(t => t.id == id);
  if(task) task.status = newStatus;

 },

 addTask(task) {
  this.tasks.push(task);
 }

};
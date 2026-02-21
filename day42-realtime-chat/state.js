export const state = {

 userId: Math.random().toString(36).substr(2,5),

 messages: [],

 addMessage(msg) {
  this.messages.push(msg);
 }

};
// models/Task.js
// This tells MongoDB what a task looks like

const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  column: {
    type: String,
    enum: ['backlog', 'todo', 'inprogress', 'done'],
    default: 'todo'
  },
  tags: {
    type: [String],
    default: []
  }
}, {
  timestamps: true   // auto adds createdAt and updatedAt
});

module.exports = mongoose.model('Task', taskSchema);
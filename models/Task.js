const mongoose = require("mongoose");

const TaskSchema = mongoose.Schema({
  taskname: {
    type: String,
    required: true,
    trim: true,
  },
  taskstatus: {
    type: Boolean,
    default: false,
  },
  created: {
    type: Date,
    default: Date.now(),
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
  },
});

module.exports = mongoose.model("Task", TaskSchema);

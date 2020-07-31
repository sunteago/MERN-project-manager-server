const Project = require("../models/Project");
const Task = require("../models/Task");
const { validationResult } = require("express-validator");

exports.createTask = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { project } = req.body;
    const projectExisting = await Project.findById(project);
    if (!projectExisting) {
      return res.status(404).json({ msg: "project not found" });
    }

    if (projectExisting.creator.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Not authorized" });
    }

    const task = new Task(req.body);

    await task.save();
    res.json({ task });
  } catch (error) {
    console.log(error);
    res.status(500).send("there was an error");
  }
};

exports.getTasks = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { project } = req.query;

    const projectExisting = await Project.findById(project);
    if (!projectExisting) {
      return res.status(404).json({ msg: "project not found" });
    }

    if (projectExisting.creator.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Not authorized" });
    }

    const tasks = await Task.find({ project }).sort({ created: -1 });
    res.json({ tasks });
  } catch (error) {
    console.log(error);
    res.status(500).send("There was an error");
  }
};

exports.updateTask = async (req, res) => {
  try {
    const { project, taskname, taskstatus } = req.body;

    let task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ msg: "Task does not exist" });
    }
    const projectExisting = await Project.findById(project);

    if (projectExisting.creator.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Not authorized" });
    }
    const newTask = {};

    newTask.taskname = taskname;
    newTask.taskstatus = taskstatus;

    task = await Task.findOneAndUpdate({ _id: req.params.id }, newTask, {
      new: true,
    });
    res.json({ task });
  } catch (error) {
    console.log(error);
    res.status("Error PUT");
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const { project } = req.query;
    let task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ msg: "Task does not exist" });
    }
    const projectExisting = await Project.findById(project);

    if (projectExisting.creator.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Not authorized" });
    }

    await Task.findOneAndRemove({ _id: req.params.id });
    res.json({ msg: "Deleted task" });
  } catch (error) {
    console.log(error);
    res.status("Error PUT");
  }
};

const Project = require("../models/Project");
const Task = require("../models/Task");
const { validationResult } = require("express-validator");

//Create new task

exports.createTask = async (req, res) => {
  //check for errors
  const errors = validationResult(req); //si validationRes.. detecta errores, crea un arreglo con estos
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() }); //si errors esta vacio es que no hay errores, entonces, si errors NO esta vacio, es que hay
  }

  //extract proj y check if exists
  try {
    const { project } = req.body;
    const projectExisting = await Project.findById(project);
    if (!projectExisting) {
      return res.status(404).json({ msg: "project not found" });
    }

    //check if active project belongs to the auth user
    if (projectExisting.creator.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Not authorized" });
    }

    //create task
    const task = new Task(req.body);

    await task.save();
    res.json({ task });
  } catch (error) {
    console.log(error);
    res.status(500).send("there was an error");
  }
};

exports.getTasks = async (req, res) => {
  //check for errors

  const errors = validationResult(req); //si validationRes.. detecta errores, crea un arreglo con estos
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() }); //si errors esta vacio es que no hay errores, entonces, si errors NO esta vacio, es que hay
  }
  //extract project

  try {
    const { project } = req.query;

    const projectExisting = await Project.findById(project);
    if (!projectExisting) {
      return res.status(404).json({ msg: "project not found" });
    }

    //check if active project belongs to the auth user
    if (projectExisting.creator.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Not authorized" });
    }

    //get tasks by project
    const tasks = await Task.find({ project }).sort({ created: -1 }); //sort reordena por fecha de creacion
    res.json({ tasks });
  } catch (error) {
    console.log(error);
    res.status(500).send("There was an error");
  }
};

//Update task

exports.updateTask = async (req, res) => {
  //check for errors
  //   const errors = validationResult(req); //si validationRes.. detecta errores, crea un arreglo con estos
  //   if (!errors.isEmpty()) {
  //     return res.status(400).json({ errors: errors.array() }); //si errors esta vacio es que no hay errores, entonces, si errors NO esta vacio, es que hay
  //   }

  try {
    const { project, taskname, taskstatus } = req.body;

    //exists that task?
    let task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ msg: "Task does not exist" });
    }
    //extract project
    const projectExisting = await Project.findById(project);

    //check if active project belongs to the auth user
    if (projectExisting.creator.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Not authorized" });
    }
    //create object with new info
    const newTask = {};

    newTask.taskname = taskname;
    newTask.taskstatus = taskstatus;

    //save the task
    task = await Task.findOneAndUpdate({ _id: req.params.id }, newTask, {
      new: true
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
    //exists that task?
    let task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ msg: "Task does not exist" });
    }
    //extract project
    const projectExisting = await Project.findById(project);

    //check if active project belongs to the auth user
    if (projectExisting.creator.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Not authorized" });
    }
    //delete

    await Task.findOneAndRemove({ _id: req.params.id });
    res.json({ msg: "Deleted task" });
  } catch (error) {
    console.log(error);
    res.status("Error PUT");
  }
};

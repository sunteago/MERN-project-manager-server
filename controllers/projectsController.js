const Project = require("../models/Project");
const { validationResult } = require("express-validator");

exports.createProject = async (req, res) => {
  //check for error
  const errors = validationResult(req); //si validationRes.. detecta errores, crea un arreglo con estos
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() }); //si errors esta vacio es que no hay errores, entonces, si errors NO esta vacio, es que hay
  }
  try {
    //Create new Project
    const project = new Project(req.body);

    //save creator via JWT
    project.creator = req.user.id;

    //save project
    project.save();
    res.json(project);
  } catch (err) {
    console.log(err);
    res.status(500).send("There was an error");
  }
};

//Get all projects of active user
exports.getProjects = async (req, res) => {
  try {
    //trae todosl os projectos que cumplan eta condicion. sort los reordena
    const projects = await Project.find({ creator: req.user.id }).sort({
      created: -1
    });
    res.json({ projects });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "There was an error.." });
  }
};

//Update project
exports.updateProjects = async (req, res) => {
  //check for errors
  const errors = validationResult(req); //si validationRes.. detecta errores, crea un arreglo con estos
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() }); //si errors esta vacio es que no hay errores, entonces, si errors NO esta vacio, es que hay
  }

  //extract info of project

  const { projectname } = req.body;
  const newProject = {};
  if (projectname) {
    newProject.projectname = projectname;
  }

  try {
    //check id
    let project = await Project.findById(req.params.id);
    //check project, exists?
    if (!project) {
      return res.status(404).json({ msg: "Project not found" });
    }
    //verify the creator
    if (project.creator.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Not authorized" });
    }
    project = await Project.findOneAndUpdate(
      { _id: req.params.id },
      { $set: newProject },
      { new: true}
    );
    res.json(project);

    //update
  } catch (error) {
    console.log(error);
    res.status(500).send("Server error");
  }
};

//Deletes project by ID

exports.deleteProjects = async (req, res) => {

  try {
    //check id
    let project = await Project.findById(req.params.id);
    //check project, exists?
    if (!project) {
      return res.status(404).json({ msg: "Project not found" });
    }
    //verify the creator
    if (project.creator.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Not authorized" });
    }
    //delete project

    await Project.findOneAndRemove({ _id: req.params.id});
    res.json({msg: 'Project deleted sucessfully'});
  } catch (error) {
    console.log(error);
    res.status(500).send("Server error del");
  }
};

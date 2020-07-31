const express = require("express");
const router = express.Router();
const projectsController = require("../controllers/projectsController");
const auth = require("../middleware/auth");
const { check } = require("express-validator");

//api/projects
//creates projects
router.post("/",auth,
  [
    check("projectname", "The project name is required")
      .not()
      .isEmpty()
  ],
  projectsController.createProject);

//gets projects
router.get("/", auth, projectsController.getProjects);

//updates a project via id
router.put(
  "/:id",
  auth,
  [

  ],
  projectsController.updateProjects
);

//delete project
router.delete(
    "/:id",
    auth,
    projectsController.deleteProjects
  );

module.exports = router;

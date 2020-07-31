const express = require("express");
const router = express.Router();
const projectsController = require("../controllers/projectsController");
const auth = require("../middleware/auth");
const { check } = require("express-validator");

router.post(
  "/",
  auth,
  [check("projectname", "The project name is required").not().isEmpty()],
  projectsController.createProject
);

router.get("/", auth, projectsController.getProjects);

router.put("/:id", auth, [], projectsController.updateProjects);

router.delete("/:id", auth, projectsController.deleteProjects);

module.exports = router;

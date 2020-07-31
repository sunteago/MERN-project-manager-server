const express = require("express");
const router = express.Router();
const taskController = require("../controllers/taskController");
const auth = require("../middleware/auth");
const { check } = require("express-validator");

//create task
//api/tasks
router.post("/", auth, [
    check('taskname', 'Name is required').not().isEmpty(),
    check('project', 'Project is required').not().isEmpty()

], taskController.createTask);

//get tasks

router.get("/", auth, taskController.getTasks);

//update task
router.put("/:id", auth, taskController.updateTask);

router.delete("/:id", auth, taskController.deleteTask);


module.exports = router;

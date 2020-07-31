//routes for creating users
const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { check } = require("express-validator");
//Create user
//api/users
router.post(
  "/",
  [
    check("username", "Name is required!")
      .not()
      .isEmpty(),
    check("email", "Add a valid email").isEmail(),
    check(
      "password",
      "Password length must be at least 6 characters"
    ).isLength({ min: 6 })
  ],
  userController.createUser
);

//not().isEmpty() se fija de que no este vacio
module.exports = router;

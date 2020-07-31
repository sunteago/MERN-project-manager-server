const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const authController = require("../controllers/authController");
const auth = require("../middleware/auth");

//Log in
//api/auth
router.post(
  "/",
  authController.authUser
);

//gets the authenticated user, DEBE estar protegido por middleware
router.get("/", auth, authController.authenticatedUser);
module.exports = router;

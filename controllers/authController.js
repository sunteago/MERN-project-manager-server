const User = require("../models/User");
const bcryptjs = require("bcryptjs");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");

exports.authUser = async (req, res) => {
  //check for error
  const errors = validationResult(req); //si validationRes.. detecta errores, crea un arreglo con estos
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() }); //si errors esta vacio es que no hay errores, entonces, si errors NO esta vacio, es que hay
  }

  // extract email and passwor
  const { email, password } = req.body;

  try {
    //check if is registered user
    let user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ msg: "Could not find that email in the registered users" });
    }
    //check pass compara el password de la base de datos con el que estan ingresando
    const correctPass = await bcryptjs.compare(password, user.password);
    if (!correctPass) {
      return res.status(400).json({ msg: "Incorrect password" });
    }

    //if all is correct: create and sign JWT
    const payload = {
      user: {
        id: user.id
      }
    };

    //sign jwt
    jwt.sign(
      payload,
      process.env.SECRET,
      {
        expiresIn: 3600000
      },
      (err, token) => {
        if (err) throw err;

        //confirmation msg
        res.json({ token: token });
      }
    );
  } catch (err) {
    console.log(err);
  }
};

//gets the authenticated user
exports.authenticatedUser = async (req, res) => {
  // console.log(req);
  try {
      const user = await User.findById(req.user.id).select('-password');
      res.json({user});
      // console.log(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({msg: 'Error'})
  }
};


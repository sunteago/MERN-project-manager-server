const User = require("../models/User");
const bcryptjs = require('bcryptjs');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');


exports.createUser = async (req, res) => {
    //check for error
    const errors = validationResult(req); //si validationRes.. detecta errores, crea un arreglo con estos
    if (!errors.isEmpty() ) {
        return res.status(400).json({errors: errors.array() }) //si errors esta vacio es que no hay errores, entonces, si errors NO esta vacio, es que hay
    }
    //extract mail and pass
    const { email, password } = req.body;


  try {
      //check that registered user is unique
    let user = await User.findOne({email});
    if (user) {
        return res.status(400).json({ msg: 'The user already exists'})
    }


    //creates the new user
    user = new User(req.body);

    //hash password
    const salt = await bcryptjs.genSalt(10);
    user.password = await bcryptjs.hash(password, salt);

    //save user
    await user.save();

    //create and sign JWT
    const payload = {
        user: {
            id: user.id
        }
    };

    //sign jwt
    jwt.sign(payload, process.env.SECRET, {
        expiresIn: 3600
    }, (err, token) => {
        if (err) throw err;

        //confirmation msg
        res.json({token: token});
    });

  } catch (err) {
      console.log(err);
      res.status(400).send('There was an error');
  }
};

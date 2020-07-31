const mongoose = require("mongoose");
require("dotenv").config({ path: "variables.env" });

const connectDB = async() => {
    try {
        await mongoose.connect(process.env.DB_MONGO, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        });
        console.log('DB CONNECTED');
    } catch(err) {
        console.log(err);
        process.exit(1); //in case of error, stop app
    }
};

module.exports = connectDB;
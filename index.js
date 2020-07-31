const express = require("express");
const connectDB = require("./config/db");
const cors = require('cors');

//creating the server
const app = express();

//connects db

connectDB();

//enable cors

app.use(cors());

// app.use(function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "190.246.21.189"); // update to match the domain you will make the request from
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
//   next();
// });

// antes se usaba bodyParser, ahora usamos express.json. bodyParser tambvien se usa igual
app.use( express.json({ extended: true }));

// app port
const port = process.env.PORT || 4000;

//import routes
app.use("/api/users", require("./routes/users"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/projects", require("./routes/projects"));
app.use("/api/tasks", require("./routes/tasks"));

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running in port ${port}`);
});

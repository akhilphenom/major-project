const cors = require("cors");
const express = require("express");
const app = express();
global.__basedir = __dirname;
global.__baseUrl = "http://localhost:9909"
var corsOptions = {
  origin: "http://localhost:8081"
};
app.use(cors(corsOptions));
const initRoutes = require("./routes");
app.use(express.urlencoded({ extended: true }));
initRoutes(app);
let port = 9909;
app.listen(port, () => {
  console.log(`Running at localhost:${port}`);
});
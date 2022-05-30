const cors = require("cors");
const express = require("express");
const path = require("path");
const app = express();
const http = require('http');

global.__basedir = __dirname;
global.__baseUrl = "http://localhost:9909"
var corsOptions = {
  origin: "http://localhost:8081"
};
const port = process.env.PORT || 9909;
app.use(cors(corsOptions));
const initRoutes = require("./routes");
app.use('/',express.static(path.join(__dirname+'/../dist/major-project')));
app.get('/*',(req,res)=>{
  res.sendFile(path.join(__dirname,'/../'));
})
app.use(express.urlencoded({ extended: true }));
initRoutes(app);
const server = http.createServer(app);
server.listen(port, () => {
  console.log(`Running at localhost:${port}`);
});
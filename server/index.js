const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const bodyparser = require("body-parser");
const userRouter = require("./routes/userRoutes");
const cors = require("cors");

require("./database/connection");

const app = express();

const port = 3000;
var urlencodedparser = bodyparser.urlencoded({ extended: true });

app.use(urlencodedparser);
app.use(express.json());
app.use(cors());
app.use(userRouter);
app.listen(port, () => {
    console.log("Server running on port" + port);
});

const mongoose = require("mongoose");

mongoose.connect(
    "mongodb://127.0.0.1:27017/fewshot",
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    },
    () => {
        console.log("Connection established");
    }
);

const mongoose = require("mongoose");

// connect to database
let url =
  "mongodb+srv://harshsaid558:harshsaid12@cluster0.s0krn.mongodb.net/Cluster0?retryWrites=true&w=majority";
// url = "mongodb://localhost:27017/expProject";
mongoose
  .connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connection successfull");
  })
  .catch((err) => console.log(err));

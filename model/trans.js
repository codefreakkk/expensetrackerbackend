const mongoose = require("mongoose");

const bal = mongoose.Schema({
  title: String,
  message: String,
  amount: String,
  date: String,
  userid: String,
});

// creating document
const tranS = new mongoose.model("tranS", bal);

module.exports = tranS;

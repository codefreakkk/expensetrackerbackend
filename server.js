const express = require("express");
const app = express();
require("./model/dbcon");
const cors = require("cors");
const PORT = 8000;
const balS = require("./model/balance");
const tranS = require("./model/trans");
const jwt = require("jsonwebtoken");
const users = require("./model/users");

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("hey");
});

// add balance to your wallet
app.post("/addbalance", async (req, res) => {
  const amount = req.body.amount;
  const message = req.body.message;
  const token = req.body.token;
  const verify = jwt.verify(token, "codefreak.co.in");
  const userid = verify._id;
  try {
    balS.find({ userid: userid }, (err, data) => {
      if (!err) {
        if (data.length > 0) {
          console.log("if");
          // update the data
          const id = data[0]._id.toString();
          let amt = Number(data[0].amount);
          amt += Number(amount);
          console.log(amt.toString());
          balS.findOneAndUpdate(
            { _id: id },
            {
              $set: {
                amount: amt.toString(),
              },
            },
            (err, data) => {
              if (!err) {
                res.send(JSON.stringify({ req: "Balance Added" }));
              } else {
                res.send(JSON.stringify({ req: "Balance Not Added" }));
              }
            }
          );
        } else {
          // insert the data

          const data = new balS({
            amount: amount,
            message: message,
            userid: userid,
          });

          data.save();
          res.send(JSON.stringify({ req: "Balance Added" }));
        }
      } else {
        res.send(JSON.stringify({ req: "Balance Not Added" }));
      }
    });
  } catch (err) {
    res.send(JSON.stringify({ req: "Balance Not Added" }));
    console.log(err);
  }
});

// get total balance
app.post("/getbalance", (req, res) => {
  const token = req.body.token;
  const verify = jwt.verify(token, "codefreak.co.in");
  const userid = verify._id;
  balS.find({ userid: userid }, (err, data) => {
    let amt = 0;
    if (!err) {
      // fetch total amount
      Array.from(data).forEach((ele) => {
        amt += Number(ele.amount);
      });
      res.send({ req: amt });
    } else {
      res.send({ req: "No Balance" });
    }
  });
});

// get three records
app.post("/getthreerecords", (req, res) => {
  try {
    const token = req.body.token;
    const verify = jwt.verify(token, "codefreak.co.in");
    const userid = verify._id;

    tranS
      .find({ userid: userid }, (err, data) => {
        if (!err) {
          res.send({ req: data });
        } else {
          res.send({ req: [] });
        }
      })
      .limit(3);
  } catch (err) {
    res.send({ req: [] });
  }
  // tranS
});

// get trans
app.post("/gettrans", (req, res) => {
  try {
    const token = req.body.token;
    const verify = jwt.verify(token, "codefreak.co.in");
    const userid = verify._id;

    tranS.find({ userid: userid }, (err, data) => {
      if (!err) {
        res.send({ req: data });
      } else {
        res.send({ req: [] });
      }
    });
  } catch (err) {
    res.send({ req: [] });
  }
});

// deduct balance
app.put("/addbalance", (req, res) => {
  console.log("put");
  const title = req.body.title;
  const message = req.body.message;
  const token = req.body.token;
  const verify = jwt.verify(token, "codefreak.co.in");
  const amount = Number(req.body.amount);
  try {
    balS.find({ userid: verify._id }, (err, data) => {
      if (!err) {
        if (data.length > 0) {
          const id = data[0]._id.toString();
          const dbamt = Number(data[0].amount);
          // if user amount is greater than dbamount than balance cannot be reducted
          if (dbamt >= amount) {
            // amt can be reducted
            let amt = dbamt - amount;
            balS.findOneAndUpdate(
              { _id: id },
              {
                $set: {
                  amount: amt.toString(),
                },
              },
              (err, data) => {
                if (!err) {
                  res.send(JSON.stringify({ req: "Balance Deducted" }));
                  console.log("data updated");
                } else {
                  res.send(JSON.stringify({ req: "Balance Not Deducted" }));
                }
              }
            );

            // insert into trans db

            const data = new tranS({
              title,
              message,
              amount,
              userid: verify._id,
              date: new Date(Date.now()),
            });
            data.save();
            console.log("saved");
          } else {
            // amt cannot be reducted
            res.send(JSON.stringify({ req: "Insufficent Balance" }));
          }
        } else {
          // no amount
          res.send(JSON.stringify({ req: "Insufficent Balance" }));
        }
      }
    });
  } catch (err) {
    console.log(err);
  }
});

app.listen(PORT, () => {
  console.log("Listening");
});

// Login system here

// signup route
app.post("/signup", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  try {
    const data = new users({
      email,
      password,
    });

    data.save();
    res.send({ inserted: "true" });
  } catch (err) {
    console.log(`Some err ${err}`);
  }
});

// Route for login
app.post("/login", async (req, res) => {
  console.log("yesss");
  const email = req.body.email;
  const password = req.body.password;
  console.log(email);
  try {
    const data = await users.findOne({ email });

    if (data.password == password) {
      const token = await data.generateToken();
      res.send({ token });
    } else {
      res.send({ token: false });
    }
  } catch (err) {
    res.send({ token: false });
  }
});

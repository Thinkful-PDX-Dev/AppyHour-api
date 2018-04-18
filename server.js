"use strict";

const { DATABASE_URL, PORT } = require("./config");
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const { Bar } = require("./models");
mongoose.Promise = global.Promise;
app.use(express.json());

//get data for all bars
app.get("/bars", (req, res) => {
  Bar.find()
    .then(bars => {
      //serialize each response
      res.json(bars.map(bar => bar.serialize()));
    })
    .catch(err => {
      //error if request fails
      console.error(err);
      res.status(500).json({ error: "bad bad bad" });
    });
});

//get data for single bar by id
app.get("/bars/:id", (req, res) => {
  Bar.findById(req.params.id)
    .then(bar => {
      res.json(bar.serialize());
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: "ughhhhhhhh no no" });
    });
});

//post bar data
app.post("/bars", (req, res) => {
  //required fields for post
  let requiredFields = ["name", "address", "hours"];
  //check if each required field is present. If a field is not present, return an error message
  for (var i = 0; i < requiredFields.length; i++) {
    let field = requiredFields[i];
    if (!field) {
      return res.status(400).json({ error: "missing field in request body" });
    }
  }
  //create new data object
  Bar.create({
    name: req.body.name,
    address: req.body.address,
    hours: req.body.hours,
    supply: req.body.supply
  })
    .then(newBar=> {
      res.status(201).json(newBar.serialize());
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: "ughhhhhhhh no no" });
    });
});

//update bar data object
app.put("/bars/:id", (req, res) => {
  //if ids don't match, return error
  if (!(req.params.id === req.body.id)) {
    return res.status(400).json({ error: "nah dog, ids don't match" });
  }
  let requiredFields = ["name", "address", "hours"];
  //check if each required field is present. If a field is not present, return an error message
  for (var i = 0; i < requiredFields.length; i++) {
    let field = requiredFields[i];
    if (!field) {
      return res.status(400).json({ error: "missing field in request body" });
    }
  }

  const updatedBar = {
    name: req.body.name,
    address: req.body.address,
    hours: req.body.hours,
    supply: req.body.supply
  };

  Bar.findByIdAndUpdate(req.body.id, updatedBar, { new: true })
    .then(updatedBar => {
      res.status(201).json(updatedBar);
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: "ughhhhhhhh no no" });
    });
});

//delete bar data object
app.delete("/bars/:id", (req, res) => {
  Bar.findByIdAndRemove(req.params.id)
    .then(() => {
      res.status(204).json({ message: "success, my friend!" });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: "ughhhhhhhh no no" });
    });
});

let server;

// connect to database, then start the server
function runServer(databaseUrl, port = PORT) {
  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, err => {
      if (err) {
        return reject(err);
      }
      server = app
        .listen(port, () => {
          console.log(`Your app is listening on port ${port}`);
          resolve();
        })
        .on("error", err => {
          mongoose.disconnect();
          reject(err);
        });
    });
  });
}

function closeServer() {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      console.log("Closing server");
      server.close(err => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  });
}

if (require.main === module) {
  runServer(DATABASE_URL).catch(err => console.error(err));
}

module.exports = { runServer, app, closeServer };

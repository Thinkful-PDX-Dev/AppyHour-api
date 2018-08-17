"use strict";
require('dotenv').config();


const { DATABASE_URL, PORT, CLIENT_ORIGIN } = require("./config");
const express = require("express");
const cors = require('cors');

const app = express();

const mongoose = require("mongoose");
const Bar = require("./models");
const router = express.Router();

mongoose.Promise = global.Promise;
// CORS
app.use(
  cors({
    origin: CLIENT_ORIGIN
  })
);

app.use(express.json());

//get data for all bars
app.get("/bars", (req, res) => {
  Bar.find()
    .then(results => {
      //serialize each response
      res.json(results.map(bar => bar.serialize()));
      // res.json(results);

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
  let requiredFields = ["name", "address", "hours", "description"];
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
    description: req.body.description
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
  // if (!(req.params.id === req.body.id)) {
  //   console.log(req.body.id); // undefined so rewriting this part
    
  //   return res.status(400).json({ error: "nah dog, ids don't match" });
  // }
  // let requiredFields = ["name", "address", "hours"];
  // //check if each required field is present. If a field is not present, return an error message
  // for (var i = 0; i < requiredFields.length; i++) {
  //   let field = requiredFields[i];
  //   if (!field) {
  //     return res.status(400).json({ error: "missing field in request body" });
  //   }
  // }

  const { id } = req.params;

  let { name, address, hours, description } = req.body;

  const updateBar = {};

  if(name) updateBar.name = name;
  if(address) updateBar.address = address;
  if(hours) updateBar.hours = hours; 
  if(description) updateBar.description = description; 

  Bar.findByIdAndUpdate({_id: id}, updateBar, { new: true })
    .then(result => {
      res.status(201).json(result);
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

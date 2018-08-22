'use strict';

const express = require('express');
const app = express();

const Bar = require('../models');

const router = express.Router();


//get data for all bars
router.get('/bars', (req, res) => {
  Bar.find()
    .then(results => {
      //serialize each response
      res.json(results.map(bar => bar.serialize()));
      // res.json(results);

    })
    .catch(err => {
      //error if request fails
      console.error(err);
      res.status(500).json({ error: 'bad bad bad' });
    });
});

//get data for single bar by id
router.get('/bars/:id', (req, res) => {
  Bar.findById(req.params.id)
    .then(bar => {
      res.json(bar.serialize());
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: err.message });
    });
});

//post bar data
router.post('/bars', (req, res) => {
  //required fields for post
  let requiredFields = ['name','location','hours','description'];
  //check if each required field is present. If a field is not present, return an error message
  for (var i = 0; i < requiredFields.length; i++) {
    let field = requiredFields[i];
    if (!field) {
      return res.status(400).json({ error: 'missing field in request body' });
    }
  }
  //create new data object
  Bar.create({
    name: req.body.name,
    location: req.body.location,
    hours: req.body.hours,
    description: req.body.description
  })
    .then(newBar=> {
      res.status(201).json(newBar.serialize());
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: err.message });
    });
});

//update bar data object
router.put('/bars/:id', (req, res) => {
  const { id } = req.params;
  const { name, location, hours, description } = req.body;
  let locationToUpdate;
  const updateBar = {};

  if(name) updateBar.name = name;

  if(location){
    updateBar.location = location;
  }
  console.log(updateBar);
  
  if(hours) updateBar.hours = hours; 
  if(description) updateBar.description = description; 

  Bar.findByIdAndUpdate({_id: id}, { $set: updateBar}, { new: true })
    .then(result => {
      res.status(201).json(result);
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: err.message });
    });
});

//delete bar data object
router.delete('/bars/:id', (req, res) => {
  Bar.findByIdAndRemove(req.params.id)
    .then(() => {
      res.status(204).json({ message: 'success, my friend!' });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: err.message });
    });
});

module.exports = router;
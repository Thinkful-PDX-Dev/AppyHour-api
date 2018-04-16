"use strict";

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const barSchema = mongoose.Schema({
  name: {type: String, required: true},
  address: {type: String, required: true}
  hours: {type: String, required: true}
  description: {type: String}
})

barSchema.methods.serialize = function() {
  return {
    id: this._id,
    name: this.name,
    address: this.address,
    hours: this.hours,
    description: this.description

  }
}

const Bar = mongoose.model("Bar", barSchema);

module.exports = {Bar}

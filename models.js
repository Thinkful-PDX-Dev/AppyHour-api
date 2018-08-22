"use strict";

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

//Schema for bar data

const barSchema = mongoose.Schema({
  name: {type: String, required: true},
  location: {
    address: {type: String, required: true},
    city: {type: String, required: true},
    state: {type: String, required: true},
    zip: Number,
    patio: Boolean,
	neighborhood: String,
	province: String,
    country: String
  },
  hours: {type: String, required: true},
  description: {type: String}
})

barSchema.set('toObject', {
  transform: function (doc,ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  }
});

barSchema.methods.serialize = function() {
  return {
    id: this._id,
    name: this.name,
    location: this.location,
    hours: this.hours,
    description: this.description
  }
}

// const Bar = mongoose.model("Bar", barSchema);

// module.exports = {Bar}

module.exports = mongoose.model('Bar', barSchema)

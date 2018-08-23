"use strict";

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

//Schema for bar data

const barSchema = mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  hours: { type: String, required: true },
  description: { type: String },
  neighborhood: { type: String },
  phone: { type: String },
  rating: { type: String },
  review: { type: String },
  price: { type: String },
  link: { type: [String] },
  img: { type: String },
  patio: { type: Boolean }
});

barSchema.set("toObject", {
  transform: function(doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  }
});

barSchema.methods.serialize = function() {
  return {
    id: this._id,
    name: this.name,
    address: this.address,
    hours: this.hours,
    description: this.description,
    priceRange: this.priceRange,
    neighborhood: this.neighborhood,
    rating: this.rating,
    img: this.img,
    links: this.links,
    patio: this.patio,
    review: this.review,
    phone: this.phone
  };
};

// const Bar = mongoose.model("Bar", barSchema);

// module.exports = {Bar}

module.exports = mongoose.model("Bar", barSchema);

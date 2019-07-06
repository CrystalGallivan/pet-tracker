var mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

let _timeSchema = new Schema({
  time: { type: Number, required: true },
  period: { type: String, enum: ["AM", "PM"], required: true }
})
let _schema = new Schema({
  name: { type: String, required: true },
  type: { tyep: String },
  breed: { type: String },
  coloring: { type: String },
  weight: { type: Number },
  age: { type: Number },
  food: { type: String },
  treats: { type: String },
  feedingTime: [_timeSchema],
  groomingTime: [_timeSchema],
  bathingTime: [_timeSchema],
  wateringTime: [_timeSchema],
  exerciseTime: [_timeSchema],
  diet: { type: String },
  toys: { type: String },
  Behavior: { type: String },
  authorId: { type: ObjectId, ref: 'User', required: true }

})

export default class PetService {
  get repository() {
    return mongoose.model("Pet", _schema)
  }
}
// Create A Pet:
// Name: Simba
// Type: Cat
// Breed: Domestic Shorthair
// Coloring: Tabby
// Weight: 0.9 lbs
// Age: 5 weeks
// Food: Purina Kitten Blend
// Treats: Meow Mix Delights
// Feeding Time: 7 AM, 10 AM, 1 PM, 3 PM
// Watering Time: 7 AM, 7 PM
// Diet Restrictions: Canned Meats
// Exercise Time: 9AM, 12 PM, 2 PM, 5 PM
// Toys: Feathers
// Behavior Notes:
// Slightly Aggressive, Playful, Loves Attention

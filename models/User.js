const {Schema, model, Types} = require('mongoose')

const schema = new Schema({
  email: {
    type: String, 
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  pathToUserpic: {
    type: String,
    required: false
  },
  name: {
    type: String,
    required: false
  },
  lastName: {
    type: String,
    required: false
  },
  birthDate: {
    type: String,
    required: false
  },
  city: {
    type: String,
    required: false
  },
  university: {
    type: String,
    required: false
  },
})

module.exports = model('User', schema)

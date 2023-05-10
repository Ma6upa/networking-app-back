const {Schema, model} = require('mongoose')

const schema = new Schema({
  postText: {
    type: String,
  },
  postPathToImg: {
    type: String,
  },
  author : {
    id: String,
    name: String,
  }
})

module.exports = model('Post', schema)

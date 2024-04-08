const mongoose = require('mongoose')
const Todo = require('./models/Todo')
const { MONGO_URL } = require('../util/config')

console.log(MONGO_URL);

if (MONGO_URL) {
  mongoose.connect(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
      console.log('Connected to MongoDB database');
    }).catch(error => {
      console.error('Error connecting to MongoDB:', error);
    });
}


module.exports = {
  Todo
}

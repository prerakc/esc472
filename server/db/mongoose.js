const mongoose = require('mongoose')

const mongoURI = 'mongodb://localhost:27017/esc472'

mongoose.connect(mongoURI);

module.exports = { mongoose }

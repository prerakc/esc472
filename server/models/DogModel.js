const mongoose = require('mongoose');

const DogSchema = mongoose.Schema({
    id: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    status: {
        type: Boolean,
        required: true
    }
})

const Dog = mongoose.model('Dog', DogSchema);

module.exports = { Dog };

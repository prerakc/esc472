const mongoose = require('mongoose');

const TagSchema = mongoose.Schema({
    uuid: {
        type: String,
        required: true
    },
    id: {
        type: Number,
        required: true
    }
})

const Tag = mongoose.model('Tag', TagSchema);

module.exports = { Tag };

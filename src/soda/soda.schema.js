const mongoose = require('mongoose')

const SodaSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    fizziness:{
        type: String,
        required: true
    },
    "taste rating": {
        type: String,
        required: true
    }
})

const Soda = mongoose.model('soda', SodaSchema)

module.exports = { Soda, SodaSchema }
const mongoose = require('mongoose')

// had to create another SodaSchema WITHOUT the unique property for name or else it causes a E11000 error in the app when creating another diner
const Sodas = new mongoose.Schema({
    name: String, fizziness: Number, 'taste rating': Number
})

const DinerSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    sodas: [Sodas]
})

const Diner = mongoose.model('diner', DinerSchema)

module.exports = Diner
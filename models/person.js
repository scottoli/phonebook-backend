const mongoose = require('mongoose')

const password = process.argv[2]
const url = process.env.MONGODB_URI
mongoose.connect(url)
    .then(response => {
        console.log('Connected to MongoDB')
    })
    .catch(error => {
        console.log('Error connecting to MongoDB:', error.message)
    })

const personSchema = new mongoose.Schema({
    name: String,
    number: String
})

personSchema.set('toJSON', {
    transform: (doc, ret) => {
        ret.id = ret._id
        delete ret._id
        delete ret.__v
    }
})

module.exports = mongoose.model('Person', personSchema)

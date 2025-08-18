const mongoose = require('mongoose')

const password = process.argv[2]
const url = `mongodb+srv://oliverscottd:${password}@cluster0.1a4wpse.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3) {
  Person.find({}).then(people => {
    console.log('phonebook:')
    people.forEach(entry => console.log(entry.name, entry.number))
    mongoose.connection.close()
  })
}
else if (process.argv.length === 5) {
  const name = process.argv[3]
  const number = process.argv[4]
  const person = new Person({
    name: name,
    number: number
  })
  person.save().then(() => {
    console.log(`Added ${name} number ${number} to phonebook`)
    mongoose.connection.close()
  })
}
else {
  console.log('Incorrect command-line arguments')
}
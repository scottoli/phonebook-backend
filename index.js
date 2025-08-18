const morgan = require('morgan')
const express = require('express')
require('dotenv').config()
const Person = require('./models/person')
const app = express()

app.use(express.static('dist'))
app.use(express.json())

morgan.token('data', (req) => {
  if (req.method === 'POST') {
    return JSON.stringify(req.body)
  }
  return ' '
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))

app.get('/api/persons', (request, response, next) => {
  Person.find({}).then(data => {
    response.json(data)
  })
    .catch(error => next(error))
})

app.get('/info', (request, response, next) => {
  Person.countDocuments({}).then(count => {
    response.send(`<p>Phonebook has info for ${count} people</p> <p>${new Date()}</p>`)
  })
    .catch(error => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
  const id = request.params.id
  Person.findById(id).then(data => {
    if (data) {
      response.json(data)
    } else {
      response.status(404).end()
    }
  })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  const id = request.params.id
  Person.findByIdAndDelete(id).then(() => {
    response.status(204).end()
  })
    .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
  const body = request.body
  if (!body.name) {
    return response.status(400).json({ error: 'missing name' })
  }
  if (!body.number) {
    return response.status(400).json({ error: 'missing number' })
  }
  Person.findOne({ name: body.name })
    .then(person => {
      if (person) {
        return response.status(404).json({ error: 'name already exists in phonebook' })
      }
      person = new Person({
        name: body.name,
        number: body.number
      })
      person.save()
        .then(person => {
          response.json(person)
        })
        .catch(error => next(error))
    })
    .catch(error => next(error))

})

app.put('/api/persons/:id', (request, response, next) => {
  const id = request.params.id
  const newNumber = request.body.number
  const opts = {
    returnDocument: 'after',
    runValidators: true
  }
  Person.findByIdAndUpdate(id, { number: newNumber }, opts).then(person => {
    if (person) {
      response.json(person)
    } else {
      response.status(400).json({ error: 'person deleted' })
    }
  })
    .catch(error => next(error))
})

const errorHandler = (error, request, response, next) => {
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
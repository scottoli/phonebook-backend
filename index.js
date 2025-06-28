const cors = require('cors')
const morgan = require('morgan')
const express = require('express')
const app = express()

app.use(cors())
app.use(express.json())

morgan.token('data', (req, res) => {
    if (req.method === 'POST') {
        return JSON.stringify(req.body)
    }
    return ' '
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))

let phonebook = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/api/persons', (request, response) => {
    response.json(phonebook)
})

app.get('/info', (request, response) => {
    response.send(`<p>Phonebook has info for ${phonebook.length} people</p> <p>${new Date()}</p>`)
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const entry = phonebook.find(elem => elem.id === id)
    if (entry) {
        response.json(entry)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    phonebook = phonebook.filter(entry => entry.id !== id)
    response.status(204).end()
})

app.post('/api/persons', (request, response) => {
    const body = request.body
    if (!body.name) {
        return response.status(400).json({ error: 'missing name' })
    }
    if (!body.number) {
        return response.status(400).json({ error: 'missing number' })
    }
    if (phonebook.find(entry => entry.name === body.name)) {
        return response.status(403).json({ error: 'name already exists in phonebook' })
    }
    const entry = {
        id: String(Math.floor(Math.random() * 1000000)),
        name: body.name,
        number: body.number
    }
    phonebook = phonebook.concat(entry)
    response.json(entry)
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
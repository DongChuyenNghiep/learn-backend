const express = require('express')
const cors = require('cors')
require('dotenv').config()
const Note = require('./models/note')
const Phonebook = require('./models/phonebook')
// DO NOT SAVE YOUR PASSWORD TO GITHUB!!
const app = express()
app.use(express.json())
app.use(cors())
app.use(express.static('dist'))


app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/notes', (request, response) => {
  Note.find({}).then(notes => {
    response.json(notes)
  })
})
app.get('/api/notes/:id', (request, response, next) => {
  Note.findById(request.params.id).then(note => {
    response.json(note)
  })
    .catch(error => next(error))
})

app.post('/api/notes', (request, response, next) => {
  const body = request.body

  if (body.content === undefined) {
    return response.status(400).json({ error: 'content missing' })
  }

  const note = new Note({
    content: body.content,
    important: body.important || false,
  })

  note.save().then(savedNote => {
    response.json(savedNote)
  }).catch(error => next(error))
})
app.delete('/api/notes/:id', (request, response, next) => {
  Note.findByIdAndDelete(request.params.id)
    .then(result => {
      console.log(result)
      response.status(204).end()
    })
    .catch(error => next(error))
})
app.put('/api/notes/:id', (request, response, next) => {
  const { content, important } = request.body

  Note.findByIdAndUpdate(
    request.params.id,
    { content, important },
    { new: true, runValidators: true, context: 'query' }
  )
    .then(updatedNote => {
      response.json(updatedNote)
    })
    .catch(error => next(error))
})
app.get('/api/persons', (request, response) => {
  Phonebook.find({}).then(person => {
    response.json(person)
  })
})
app.get('/info', (request, response) => {
  Phonebook.find({}).then(person => {
    const getlength = person.length
    const gettime = new Date()
    response.send(`
        <p>Phonebook has info for ${getlength} people</p>
        <p>${gettime}</p>
        `)
  })
})
app.get('/api/persons/:id', (request, response) => {
  Phonebook.findById(request.params.id).then(people => {
    response.status(200).json(people)
  })
})
app.delete('/api/persons/:id', (request, response, next) => {
  const id = request.params.id
  Phonebook.findByIdAndDelete(id).then(people => {
    if (!people) {
      return response.status(404).json({ error: 'People not found' })
    }
    response.status(200).json({ message: 'User Deleted' })
  })
    .catch(error => {
      next(error)
    })
})
app.post('/api/persons', (req, res, next) => {
  const { name, number } = req.body

  if (!name || !number) {
    return res.status(400).json({ error: 'Missing body' })
  }
  Phonebook.findOne({
    $or: [{ name: name.toLowerCase() }, { number: number.toLowerCase() }]
  }).then(existingPerson => {
    if (existingPerson) {
      return res.status(400).json({ error: 'Name or number must be unique' })
    }

    const newPerson = new Phonebook({ name, number })

    newPerson.save().then(savedPerson => {
      res.status(201).json(savedPerson)
    }).catch(error => next(error))
  }).catch(error => {
    next(error)
  })
})

app.put('/api/persons/:id', (req, res, next) => {
  const id = req.params.id
  const { name, number } = req.body // Lấy dữ liệu mới từ request body
  Phonebook.findByIdAndUpdate(
    id,
    { name, number },
    { new: true, runValidators: true, context: 'query' }
  )
    .then(updatedPerson => {
      if (!updatedPerson) {
        return res.status(404).json({ error: 'Person not found' })
      }
      res.json(updatedPerson)
    })
    .catch(error => {
      next(error)
    })
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

// handler of requests with unknown endpoint
app.use(unknownEndpoint)
const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

// this has to be the last loaded middleware, also all the routes should be registered before this!
app.use(errorHandler)
const PORT = process.env.PORT
app.listen(PORT)
console.log(`Server running on port ${PORT}`)
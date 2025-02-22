const http = require('http')
const express = require('express')
const cors = require('cors')

const app = express()
app.use(express.json())
app.use(cors())
app.use(express.static('dist'))
let N = 20
let notes = [
    {
        id: "1",
        content: "HTML is easy",
        important: true
    },
    {
        id: "2",
        content: "Browser can execute only JavaScript",
        important: false
    },
    {
        id: "3",
        content: "GET and POST are the most important methods of HTTP protocol",
        important: true
    }
]
let persons = [
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
const generateId = () => {
    const maxId = notes.length > 0
        ? Math.max(...notes.map(n => Number(n.id)))
        : 0
    return String(maxId + 1)
}

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})

app.get('/api/notes', (request, response) => {
    response.json(notes)
})
app.get('/api/notes/:id', (request, response) => {
    const id = request.params.id
    const note = notes.find(note => note.id === id)
    if (note) {
        response.json(note)
    } else {
        response.status(404).end()
    }

})

app.post('/api/notes', (request, response) => {
    const body = request.body

    if (!body.content) {
        return response.status(400).json({
            error: 'content missing'
        })
    }

    const note = {
        content: body.content,
        important: body.important || false,
        id: generateId(),
    }

    notes = notes.concat(note)

    response.json(note)
})
app.delete('/api/notes/:id', (request, response) => {
    const id = request.params.id
    notes = notes.filter(note => note.id !== id)

    response.status(204).end()
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
})
app.get('/info', (request, response) => {
    getlength = persons.length;
    const gettime = new Date()
    response.send(`
        <p>Phonebook has info for ${getlength} people</p>
        <p>${gettime}</p>
        `)
})
app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const persontofind = persons.find(persons => persons.id === id)
    if (persontofind) {
        response.json(persontofind)
    } else {
        response.status(404).end()
    }
})
app.delete('/api/persons/:id',(request,response)=> {
    const id = request.params.id
    persontodelete = persons.filter(persons => persons.id !== id)
    response.status(204).end()
})
app.post('/api/persons',(req,res)=>{
    const body = req.body
    if (!body.name || !body.number) {
        return res.status(400).json({error:'Missing body'})
    }
    const isSame = persons.some(persons => persons.name.toLowerCase()===body.name.toLowerCase() || persons.number.toLowerCase()===body.number.toLowerCase())
    if (isSame){
        return res.status(400).json({ error: 'name must be unique' })
    }else{
        const per = {
            id : Math.floor(Math.random() * N).toString(),
            name : body.name,
            number: body.number
        }
        persons = persons.concat(per)
        res.status(201).json(per)
    }
    
    
})
const PORT = process.env.PORT || 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)
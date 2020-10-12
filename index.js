const { response } = require('express')
const express = require('express')
const morgan = require('morgan')

const app = express()
app.use(express.json())

morgan.token('body', function (req, res) { return JSON.stringify(req.body) })

//app.use(morgan(':remote-addr :remote-user :method :url HTTP/:http-version :status :res[content-length] - :response-time ms :body'))

app.use(morgan(function (tokens, req, res) {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, 'content-length'), '-',
      tokens['response-time'](req, res), 'ms',
      tokens.body(req,res)
    ].join(' ')
  }))


let persons = [
    {
        "name": "Arto Hellas",
        "number": "040-123456",
        "id": 1
    },
    {
        "name": "Ada Lovelace",
        "number": "39-44-5323523",
        "id": 2
    },
    {
        "name": "Dan Abramov",
        "number": "12-43-234345",
        "id": 3
    },
    {
        "name": "Mary Poppendieck",
        "number": "39-23-6423122",
        "id": 4
    }
]

app.get('/', (req, res) => {
    res.send('<h1>Hello World</h1>')
})

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(p => p.id === id)
    if (person) {
        res.json(person)
    } else {
        res.status(404).end()
    }

})

generateId = () => {
    return Math.floor(Math.random() * Math.floor(100000000));
}

app.post('/api/persons', (req, res) => {
    const body = req.body
    if (!body.name) {
        return res.status('400').json({
            error: 'name missing'
        })
    }
    if (!body.number) {
        return res.status('400').json({
            error: 'number missing'
        })
    }
    if (persons.find(p => p.name === body.name)) {
        return res.status('400').json({
            error: 'name must be unique'
        })

    }

    const person = {
        name: body.name,
        number: body.number,
        id: generateId()
    }

    persons = persons.concat(person)

    res.json(person)
})


app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(p => p.id !== id)

    res.status(204).end()
})

app.get('/info', (req, res) => {
    res.send(`<p>Phonebook has info fro ${persons.length} people</p> <p>${new Date().toString()}</p>`)
})

const PORT = 3001
app.listen(PORT, (req, res) => {
    console.log(`Server runing, listen port ${PORT}`)
})
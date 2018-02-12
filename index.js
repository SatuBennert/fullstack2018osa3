// tulostaa:
// console.log('hello world')
// mongodb://<dbuser>:<dbpassword>@ds133558.mlab.com:33558/persons
// mongodb://Rexona:Rexona123@ds1333558.mlab.com:33558/persons

const express = require('express')
const app = express()
const http = require('http')
const bodyParser = require('body-parser')
const morgan = require('morgan')
// front end toimimaan back-endin kanssa: cors
const cors = require('cors')
const mongoose = require('mongoose')
const Person = require('./models/person')

const url  = 'mongodb://Rexona:Rexona123@ds133558.mlab.com:33558/persons'
mongoose.connect(url)



// const Person = mongoose.model('Person', {
//   name: String,
//   phone: Number
//   })

// GET-pyyntöjen oletushakemistoksi build
app.use(express.static('build'))

app.use(cors())

app.use(bodyParser.json())

// ao. out: GET /persons/4 304 - - 3.911 ms
//app.use(morgan('tiny')); 

app.use(morgan(':method :url :params :status :res[content-length] - :response-time ms'))
//const app = http.createServer((request, response) => {
//   response.writeHead(200, { 'Content-Type': 'application/json' })
//   response.end(JSON.stringify(persons))
// })

morgan.token('params', function getParams (req, res) {
  return JSON.stringify(req.body)
})

let persons = [
  {
    "name": "Arto Hellas",
    "number": "040-123456",
    "id": 1
  },
  {
    "name": "Martti Tienari",
    "number": "040-123456",
    "id": 2
  },
  {
    "name": "Arto Järvinen",
    "number": "040-123456",
    "id": 3
  },
  {
    "name": "Lea Kutvonen",
    "number": "040-123456",
    "id": 4
  }
]


const formatPerson = (person) => {
  console.log("person number " , person.number)
  return {
    name: person.name,
    phone: person.number,
    id: person._id
  }
}

app.get('/api/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

// // ennen tietokantaa
// app.get('/api/persons', (req, res) => {
//   res.json(persons)
// })


app.get('/api/persons', (req, res) => {
  Person
    .find({}, {__v: 0})
    .then(persons => {
      res.json(persons.map(formatPerson))
    })
})


app.get('/api/persons/:id', (reg, res) => {
  Person
    .findById(req.params.id)
    .then(person => {
       if (person) {
        res.json(formatPerson(person))
      } else {
        res.status(404).end()
      }
    })

  // const id = Number(reg.params.id)
  // let person = persons.find(person => id === person.id)
  // if (person) {
  //   res.json(person) }
  // else {
  //   //res.status(404).end()
  //   res.send('<div>' + 'EI ' + ' ole ' + ' eikä ' + ' tule: ' + id + '<div>')
  // }
})




app.get('/info', (reg, res) => {
  const date = new Date()
  res.send( '<div>' + date + '</div>' + '<div>' + 'Taulukossa on ' + persons.length + ' henkilöä.' + '</div>')
})

app.delete('/api/persons/:id', (req, res) => {
  Person
  .findByIdAndRemove({_id: req.params.id}, 
   function(err, docs){
  if(err) res.json(err)
  else    res.status(204).end()
})

  // const id = Number(req.params.id)
  // persons = persons.filter(person => person.id !== id)
  // res.status(204).end()
})


const generateId = () => {
  const min = 6
  const max = 8000
  return (Math.random() * (max - min) + min).toFixed(0);

//  const maxId = persons.length > 0 ? persons.map(n => n.id).sort().reverse()[0] : 1
//  return maxId + 1
}
// lisää uuden osoitteeseen tapahtuvalla post-pyynnöllä
app.post('/api/persons', (req, res) => {
//  const maxId = persons.length > 0 ? persons.map(n => n.id).sort().reverse()[0] : 0
  const body = req.body  // body sis. olion person
// pakolliset tiedot
  if (body.name === undefined) {
    return res.status(400).json({error: 'Name missing.Pls add.'})
  }
  if (body.number === undefined) {
    return res.status(400).json({error: 'Number missing. Pls add.'})
  }
  if (persons.find((fperson) => fperson.name === body.name)) {
    return res.status(400).json({error: 'Error: ' + body.name + ' exists already. Pls change.'})
  }
  console.log("tarkistus ok")
// luodaan person-olio
  const person = {
    name: body.name,
    number: body.number,
    //date: new Date(),
    id: Number(generateId())
  }
 console.log("uusi olio on luotu")
// tallettaa fronttiin
  persons = persons.concat(person) // lisätään loppuun
  console.log(person) // tulostaa varmuuden vuoksi
// tallettaa kantaan
  Person
    .save()
    .then(savedPerson => {
      res.json(formatPerson(savedPerson))
    })

  //res.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})




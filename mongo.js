const mongoose = require('mongoose')

// korvaa url oman tietokantasi urlilla. ethän laita salasanaa Gothubiin!
// const url = 'mongodb://fullstack:sekred@ds211088.mlab.com:11088/fullstack-notes'
const url  = 'mongodb://Rexona:Rexona123@ds133558.mlab.com:33558/persons'

mongoose.connect(url)



const Person = mongoose.model('Person', {
  name: String,
  phone: Number
  })

if (!process.argv[2]){
  Person
  .find({})   
  .then(result => {
    console.log("Puhelinluettelo")
    result.forEach(person => {
      console.log(person.name, " ", person.phone)
    })
    mongoose.connection.close()
  })}

  // process.argv[2] = 1.parametri komentoriviltä
  if (process.argv[2]) {
    const person = new Person({
        name: process.argv[2],
        phone: 345678
          })
          person
            .save()
            .then(response => {
              console.log('person saved!')
              mongoose.connection.close()
            })  
  }
    
  

// const person = new Person({
//   name: 'Tupu Ankka',
//   phone: 345678
//   })

// person
//   .save()
//   .then(response => {
//     console.log('person saved!')
//     mongoose.connection.close()
//   })

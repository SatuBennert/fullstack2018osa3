const mongoose = require('mongoose')


// if ( process.env.NODE_ENV !== 'production' ) {
//   require('dotenv').config()
// }

const url  = 'mongodb://Rexona:Rexona123@ds133558.mlab.com:33558/persons'

// const url = process.env.MONGODB_URI

mongoose.connect(url)
mongoose.Promise = global.Promise

const Person = mongoose.model('Person', {
  name: String,
  phone: String
})

module.exports = Person
const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}


const url = process.env.MONGODB_URI

mongoose.set('strictQuery',false)

mongoose.connect(url)

/*const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
})

const Note = mongoose.model('Note', noteSchema)
const note = new Note({
  content: 'HTML is easy',
  important: true,
})

note.save().then(result => {
  console.log('note saved!')
  mongoose.connection.close()
}) */

/* Note.find({important:true}).then(result => {
    result.forEach(note => {
      console.log(note)
    })
    mongoose.connection.close()
  }) */


const phoneSchema = new mongoose.Schema({
  name : String,
  number : String,
})
const phoneNote = mongoose.model('phonebook',phoneSchema,'phonebook')
const addphone = new phoneNote({
  name: process.argv[3],
  number:process.argv[4]
})
addphone.save().then(result => {
  console.log(`Added ${result.name} ${result.number} to phonebook`)
})
phoneNote.find({}).then(result => {
  console.log('phonebook:')
  result.map(people => {
    console.log(`${people.name} ${people.number}`)
  })
  mongoose.connection.close()
})

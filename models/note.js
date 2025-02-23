const mongoose = require('mongoose')

mongoose.set('strictQuery', false)


const url = process.env.MONGODB_URI

mongoose.connect(url)
  .then(result => {
    console.log('Connected to MongoDB')

    // Dùng result để lấy thông tin kết nối
    console.log('Database name:', result.connection.name)
    console.log('Host:', result.connection.host)
    console.log('Port:', result.connection.port)
  })
  .catch(error => {
    console.error('Error connecting to MongoDB:', error.message)
  })

const noteSchema = new mongoose.Schema({
  content: {
    type: String,
    minLength: 5,
    required: true
  },
  important: Boolean,
})

noteSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})


module.exports = mongoose.model('Note', noteSchema)
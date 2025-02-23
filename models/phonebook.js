const { default: mongoose } = require("mongoose");

const peopleNumber = new mongoose.Schema({
    name : String,
    number : String
})

peopleNumber.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
  })

module.exports = mongoose.model("phonebook",peopleNumber,"phonebook")
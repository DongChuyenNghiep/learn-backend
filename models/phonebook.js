const { default: mongoose } = require("mongoose");

const peopleNumber = new mongoose.Schema({
    name : {
      type: String,
      minLength: 3,
      required: true
    },
    number : {
      type:String,
      match : [/^\d{2}-\d{6}$|^\d{3}-\d{8}$/,"Phone format is not valid"],
      required: true
    }
})

peopleNumber.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
  })

module.exports = mongoose.model("phonebook",peopleNumber,"phonebook")
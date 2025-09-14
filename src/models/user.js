//* here we have to require mongoose
const mongoose = require("mongoose");

//* to create  schema we have to call a method on mongoose named mongoose.Schema({}), inside that we can write a object where we can write the schema for our users, for each field we have to define the type of the value of each field/ property inside a object.
const userSchema = mongoose.Schema({
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  emailId: {
    type: String,
  },
  password: {
    type: String,
  },
  age: {
    type: Number,
  },
  gender: {
    type: String,
  },
});

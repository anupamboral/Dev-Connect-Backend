//* here we have to require mongoose
const mongoose = require("mongoose");

//* to create  schema we have to call a method on mongoose named mongoose.Schema({}), inside that we can write a object where we can write the schema for our users, for each field we have to define the type of the value of each field/ property inside a object.
const userSchema = new mongoose.Schema({
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
//* this is how we create a schema, this tells us what information we are going to store in the database related to the user.these fields will be present inside the user collection.
//? How will we use this schema?
//* to use this schema , we have to create a model, we will call mongoose.model("ModelName",Schema) , and as first argument we will pass the name of the model , then as second argument we will pass the schema we have created.And store this model as value of a constant,as this is of users so we will name the constant - "User". and it is a convention that we should start the name with capital letter , because this model is like a class, as we create many instances from a class, similarly from this model , we will create many user documents inside our user collection, so that's why will start the name off the model constant with capital letter like we do for naming classes.then we will export this model so we can use it.
const User = mongoose.model("User", userSchema);

module.exports = User;

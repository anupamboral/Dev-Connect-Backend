//* here we have to require mongoose
const mongoose = require("mongoose");
const validator = require("validator");
//* to create  schema we have to call a method on mongoose named mongoose.Schema({}), inside that we can write a object where we can write the schema for our users, for each field we have to define the type of the value of each field/ property inside a object.
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 50,
    },
    lastName: {
      type: String,
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      lowerCase: true,
      trim: true,
      validate(userEmail) {
        if (!validator.isEmail(userEmail)) {
          throw new Error("Invalid email:-" + userEmail);
        }
      },
    },
    password: {
      type: String,
      required: true,
      validate(password) {
        if (!validator.isStrongPassword(password)) {
          throw new Error(
            "password must contain  8 characters, at least 1 Lowercase, 1 Uppercase,1 Numbers, 1 Symbol"
          );
        }
      },
    },
    age: {
      type: Number,
      min: 12,
      max: 100,
    },
    gender: {
      type: String,
      lowerCase: true,
      validate(value) {
        //* if the belows arrays values does not include user's inserted value then throw an error
        if (!["male", "female", "others"].includes(value))
          throw new Error("gender data is not valid");
      },
    },
    photoUrl: {
      type: String,
      default: "https://geographyandyou.com/images/user-profile.png",
      validate(photoUrl) {
        if (!validator.isURL(photoUrl)) {
          throw new Error("Invalid url:-" + photoUrl);
        }
      },
    },
    about: {
      type: String,
      default: "This is the default about of the user",
    },
    skills: {
      type: [String],
    },
  },
  {
    timestamps: true,
  }
);
//* this is how we create a schema, this tells us what information we are going to store in the database related to the user.these fields will be present inside the user collection.
//? How will we use this schema?
//* to use this schema , we have to create a model, we will call mongoose.model("ModelName",Schema) , and as first argument we will pass the name of the model , then as second argument we will pass the schema we have created.And store this model as value of a constant,as this is of users so we will name the constant - "User". and it is a convention that we should start the name with capital letter , because this model is like a class, as we create many instances from a class, similarly from this model , we will create many user documents inside our user collection, so that's why will start the name off the model constant with capital letter like we do for naming classes.then we will export this model so we can use it.
const User = mongoose.model("User", userSchema);

module.exports = User;

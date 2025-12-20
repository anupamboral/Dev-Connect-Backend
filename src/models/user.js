//* here we have to require mongoose
const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
//* requiring bcrypt library after installing
const bcrypt = require("bcrypt");
//* to create  schema we have to call a method on mongoose named mongoose.Schema({}), inside that we can write a object where we can write the schema for our users, for each field we have to define the type of the value of each field/ property inside a object.
require("dotenv").config();//*importing env file

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
      lowercase: true,
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
    isPremiumUser: {
      type: Boolean,
      default: false,
    },
    membershipType: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);
//* this is how we create a schema, this tells us what information we are going to store in the database related to the user.these fields will be present inside the user collection.
//? How will we use this schema?
//* to use this schema , we have to create a model, we will call mongoose.model("ModelName",Schema) , and as first argument we will pass the name of the model , then as second argument we will pass the schema we have created.And store this model as value of a constant,as this is of users so we will name the constant - "User". and it is a convention that we should start the name with capital letter , because this model is like a class, as we create many instances from a class, similarly from this model , we will create many user documents inside our user collection, so that's why will start the name off the model constant with capital letter like we do for naming classes.then we will export this model so we can use it.

//* adding schema methods
//* below as we are using this keyword, it will refer to the instance(user) which is calling the method, as this user schema is like a class.
//* method to generate the JWT(token) and return it.
userSchema.methods.getJWT = function () {
  const user = this;
  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  }); //*1st param secret data,2nd param secret password , 3rd param a object where we can mention the expiry time of the token here we mentioned 7 days
  // console.log(token);
  return token;
};
userSchema.methods.validatePassword = async function (passwordInputByUser) {
  const user = this; //* this is referring to the user instance who is trying to log in

  const hashPassword = user.password;

  //* if this user input password match with the hash password fetched from the db then this method will return true, if mismatch then it will return false.
  const isValidPassword = await bcrypt.compare(
    passwordInputByUser,
    hashPassword
  ); //* it will return a promise , which will be boolean value,(true/false)

  return isValidPassword;
};

const User = mongoose.model("User", userSchema);
module.exports = User;

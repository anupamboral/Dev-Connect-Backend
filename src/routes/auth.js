//* router for auth related apis
const express = require("express");
const { validateSignUpData, validateSignInData } = require("../utils/validate");
const bcrypt = require("bcrypt");
const authRouter = express.Router();
//* importing the User model
const User = require("../models/user");
//*sign up api
authRouter.post("/signup", async (req, res) => {
  try {
    //*validation of data
    validateSignUpData(req); //* this custom helper function we built to validate the sign up data, as it throw error if any wrong data is entered so it will trigger the catch block.so writing it inside a try block is important.

    const {
      firstName,
      lastName,
      emailId,
      password,
      gender,
      photoUrl,
      about,
      skills,
      age,
    } = req.body;

    //* encrypting/hashing the password
    const hashPassword = await bcrypt.hash(password, 10); //* 1st arg is text password and 2nd arg is number of salt rounds.it returns a promise.
    // console.log(hashPassword);
    //!creating instance from User model using dynamic data coming from client side(directly we should not use req.body to create instance instead do like below)
    const user = new User({
      firstName: firstName,
      lastName: lastName,
      emailId: emailId,
      password: hashPassword,
      gender: gender,
      photoUrl: photoUrl,
      age: age,
      skills: skills,
      about: about,
    }); //* present in mongoose doc ,go to model => Model(), we have used hash password which is the encrypted password.

    //! saving the user instance inside the database using .save() method
    const userData = await user.save();

    //* sending the token (added at last)
    const token = userData.getJWT(); //* if above the user exist in the database , it saved the user data into the user constant, so the user is basically a instance of the UserSchema, so we can access the methods available on the user schema,as we shifted the logic of generating the JWT(token) to a userSchema method named getJWT(),it returns the token.

    //* sending the cookie(added at last because we were not sending the token for this sign up api)
    res.cookie("token", token, {
      expires: new Date(Date.now() + 7 * 24 * 3600000 + 3600000 * 5.5),
    });
    //! sending response to the client
    res.json({ message: "User added successfully", data: userData });
  } catch (err) {
    //! catching errors and sending error message
    res
      .status(400)
      .json({ message: "Error saving the error:- " + err.message });
  } //* status code 400 represents bad request , and we are using it here because we are sending request to the server to save the user data and if the request fails then we can use to 400 status code as it represents bad request.
});
//* sign in api
authRouter.post("/signin", async (req, res) => {
  try {
    //* validating email format
    validateSignInData(req);

    const { emailId: reqEmail, password: reqPassword } = req.body;

    //* validating email from the database
    const user = await User.findOne({ emailId: reqEmail }); //* if the user is valid then this user constant becomes the user instance of that particular user.
    //* when user does not exist in the database
    if (!user) {
      throw new Error("Invalid credentials");
    }
    // console.log(user.getJWT);
    const isValidPassword = await user.validatePassword(reqPassword);

    // console.log(isValidPassword);
    //* when password is validated and right , sending successful message to client
    if (isValidPassword) {
      //* generating JWT(token)(sending the userId as secret data inside the token)(It does not return promise so we don't need to write await.)
      const token = user.getJWT(); //* if above the user exist in the database , it saved the user data into the user constant, so the user is basically a instance of the UserSchema, so we can access the methods available on the user schema,as we shifted the logic of generating the JWT(token) to a userSchema method named getJWT(),it returns the token.

      //* sending the cookie
      res.cookie("token", token, {
        expires: new Date(Date.now() + 7 * 24 * 3600000 + 3600000 * 5.5),
      }); //* so cookie will be removed after 7 days}); //* sending the cookie to the client ,it's first argument is "name" so here we can write "token" as we are sending the token using the cookie, and as the second argument pass the value of the token, we can also mention a third value which is options, but this third value is optional

      res.json({
        message: "Logged In successfully",
        data: user,
      });
    } else {
      //* if password mismatch then throwing error
      throw new Error("Invalid credentials");
    }
  } catch (err) {
    res.status(400).json({ message: "something went wrong:- " + err.message });
  }
});
//* logout api
authRouter.post("/logout", (req, res) => {
  //* setting the token to null and immediately expiring cookies
  res.cookie("token", null, { expires: new Date(Date.now()) });

  res.json({ message: "Logged out successfully" });
});
module.exports = authRouter;

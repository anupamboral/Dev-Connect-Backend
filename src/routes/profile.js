const express = require("express");
const { userAuth } = require("../middlewares/auth");
const { validateProfileEditData } = require("../utils/validate");
const profileRouter = express.Router();
const bcrypt = require("bcrypt");
const validator = require("validator");

//* /profile api is now /profile/view. we have changed the path
profileRouter.get("/profile/view", userAuth, async (req, res) => {
  //* in userAuth after validation we saved the user in the req.user
  const user = req.user;

  res.send(user);
});
//* api to edit profile details
profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    // console.log(isValidData);
    if (!validateProfileEditData(req)) {
      throw new Error("Invalid Input Data");
    }

    const loggedInUser = req.user; //* we saved the user in userAuth middleware, while validating the token, so we can access the user from req.user.
    //!So now above logged in user a instance of the User model.
    // console.log("old" + loggedInUser);
    // console.log(req.body);
    //* forEach does not return the array it just change it for every field according to the logic, map method return noe forEach.
    Object.keys(req.body).forEach(
      (key) => (loggedInUser[key] = req.body[key]) //* updating the user object(both keys and values will be updated from the req.body in the loggedInUser)
    );
    // console.log("new" + loggedInUser);
    //! now as loggedInUser is a instance of the User model we can directly call the .save() method to update it on the db.
    await loggedInUser.save(); //*updating on db
    res.send({
      message: `${loggedInUser.firstName} , your profile is successfully updated`,
      data: loggedInUser,
    });
  } catch (err) {
    res.status(400).send("Something went wrong:-" + err.message);
  }
});
//*api to change the password(apiArgs "emailId","oldPassword","newPassword" isn json format)
profileRouter.patch("/profile/password", userAuth, async (req, res) => {
  //* if token id not valid this request handler will not be executed and  error will thrown from userAuth middleware
  try {
    //* if the user is valid we have saved the user into req,user, so it;s the user instance
    const user = req.user;
    //* user entered dat for changing the password
    console.log(req.body);
    const { emailId, oldPassword, newPassword } = req.body;

    //* checking if the emailId is correct or not
    if (emailId !== user.emailId) {
      throw new Error("Enter valid email Id");
    }
    //* checking if the password id valid or not
    const isValidPassword = await user.validatePassword(oldPassword);
    if (!isValidPassword) {
      throw new Error("Enter valid old password to change it");
    }

    //* checking if the new password is strong or not
    if (!validator.isStrongPassword(newPassword)) {
      throw new Error(
        "new password must contain  8 characters, at least 1 Lowercase, 1 Uppercase,1 Numbers, 1 Symbol"
      );
    }
    const newPasswordHash = await bcrypt.hash(newPassword, 10); //* 1st arg is text password and 2nd arg is number of salt rounds.it returns a promise.
    //* changing the password to new password hash
    user.password = newPasswordHash;

    //* saving the user into db
    user.save();
    //* sending response
    res.send("password updated successfully");
  } catch (err) {
    res.status(400).send("Something went wrong:-" + err.message);
  }
});
module.exports = profileRouter;

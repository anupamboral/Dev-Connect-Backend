const express = require("express");
const { userAuth } = require("../middlewares/auth");
const { validateProfileEditData } = require("../utils/validate");
const profileRouter = express.Router();

//* /profile api is now /profile/view. we have changed the path
profileRouter.get("/profile/view", userAuth, async (req, res) => {
  //* in userAuth after validation we saved the user in the req.user
  const user = req.user;

  res.send(user);
});
profileRouter.post("/profile/edit", userAuth, async (req, res) => {
  try {
    const isValidData = validateProfileEditData(req);
    console.log(isValidData);
    if (!isValidData) {
      throw new Error("Invalid Input Data");
    }

    const loggedInUser = req.user; //* we saved the user in userAuth middleware, while validating the token, so we can access the user from req.user.
    //!So now above logged in user a instance of the User model.

    //* forEach does not return the array it just change it for every field according to the logic, map method return noe forEach.
    Object.keys(loggedInUser).forEach((key) => {
      loggedInUser[key] = req.body[key]; //* updating the user object(both keys and values will be updated from the req.body in the loggedInUser)
    });

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
module.exports = profileRouter;

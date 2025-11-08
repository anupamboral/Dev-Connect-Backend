const express = require("express");
const { userAuth } = require("../middlewares/auth");
const profileRouter = express.Router();

profileRouter.get("/profile", userAuth, async (req, res) => {
  //* in userAuth after validation we saved the user in the req.user
  const user = req.user;

  res.send(user);
});

module.exports = profileRouter;

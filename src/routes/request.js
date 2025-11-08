const express = require("express");
const { userAuth } = require("../middlewares/auth");
const connectionRequestRouter = express.Router();
connectionRequestRouter.post(
  "/sendConnectionRequest",
  userAuth,
  async (req, res) => {
    const user = req.user;

    console.log("sending connection request");
    res.send(user.firstName + " is sending connection request");
  }
);
module.exports = connectionRequestRouter;

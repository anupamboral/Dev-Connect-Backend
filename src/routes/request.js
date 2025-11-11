const express = require("express");
const { userAuth } = require("../middlewares/auth");
const connectionRequestRouter = express.Router();
const ConnectionRequest = require("../models/connectionRequest");
connectionRequestRouter.post(
  "/request/send/:status/:userId",
  userAuth,
  async (req, res) => {
    try {
      const user = req.user;
      const fromUserId = user._id;
      const toUserId = req.params.userId;
      const status = req.params.status;

      const allowedStatuses = ["interested", "ignored"];
      if (!allowedStatuses.includes(status)) {
        //* writing return is important , while sending the response from here , if we don't write return then the code execution will move further , so always write return if you are sending response early, or you can just throw an error rather than sending response.
        return res.json({ message: "invalid status:- " + status });
      }

      //* making a connection request instance using the model
      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });

      //* saving data into db
      const data = await connectionRequest.save();

      //* sending response
      res.json({
        message: "Connection request successfully sent",
        data,
      });

      console.log("sending connection request");
      res.send(user.firstName + " is sending connection request");
    } catch (error) {
      //! catching errors and sending error message
      res.status(400).send(`Something went wrong:- ${err.message}`);
    }
  }
);
module.exports = connectionRequestRouter;

const express = require("express");
const { userAuth } = require("../middlewares/auth");
const connectionRequestRouter = express.Router();
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

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

      //* checking if the toUserId/receiver's id belongs to a existing user or not
      const receiverProfile = await User.findById(toUserId);
      //* early return if receiver id not present in our database
      if (!receiverProfile) {
        return res.json({ message: "User not found" });
      }

      //* checking if there is a existing connection request
      const existingConnectionRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId }, //* it is same as writing {fromUserId:fromUserId,toUserId:toUserId}(if sender already sent request and he is sending again)
          { fromUserId: toUserId, toUserId: fromUserId }, //* if receiver already sent to sender previously now sender is also trying to send receiver
        ],
      }); //* So before making the instance and after the allowedStatus check we will , check if the connection request already exist in our db fromUser to toUser or toUser to fromUser ( for example if msdhoni already sent request to omswami ji or om swami sent request to ms dhoni , in both cases we will restrict the user to send a new connection request).
      //* So using the findOne() method we will try to find if there is an existing request present in the db which is either sent fromUserId to toUserId(sender to receiver) or toUserId to fromUserId(receiver to sender).To do it we have to know how to write Or condition.It is mongo db thing. To write thing inside the method , as usual we will write a object, inside the object as usual we write the condition, but to write or condition we will wite $or:[], inside this array we will write two objects , one for each condition, so it will be a array of objects.

      //* if connection request exist with ignore status then we should change it to interested if he is now interested
      if (
        existingConnectionRequest &&
        existingConnectionRequest.status === "ignored" &&
        status === "interested"
      ) {
        existingConnectionRequest.status = "interested";
        //* saving the user with interested status and doing early return with sending the response
        existingConnectionRequest.save();
        return res.json({
          message: `${req.user.firstName} sent connection request to ${receiverProfile.firstName}`,
        });
      }

      //* if connection request exist (with interested status) but user user want to cancel it then update the request with ignored status
      if (
        existingConnectionRequest &&
        existingConnectionRequest.status === "interested" &&
        status === "ignored"
      ) {
        existingConnectionRequest.status = "ignored";
        //* saving the user with ignored status and doing early return with sending the response
        existingConnectionRequest.save();
        return res.json({
          message: `Request to ${receiverProfile.firstName} is canceled `,
        });
      }
      //* if connection request exist (with interested status) but user sent again request with interested status
      if (existingConnectionRequest) {
        //*early return as connection already exist
        return res.json({ message: "Connection request already exist" });
      }

      //* making a connection request instance using the model
      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });

      //* saving data into db(always use await as it returns promise)
      const data = await connectionRequest.save();

      //* sending response
      res.json({
        message:
          status === "interested"
            ? `${req.user.firstName} sent connection request to ${receiverProfile.firstName}`
            : `${req.user.firstName} is not interested in  ${receiverProfile.firstName}'s profile`,
        data,
      });
    } catch (err) {
      //! catching errors and sending error message
      res.status(400).send(`Something went wrong:- ${err.message}`);
    }
  }
);
module.exports = connectionRequestRouter;

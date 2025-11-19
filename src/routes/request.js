const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
const e = require("express");

const connectionRequestRouter = express.Router();
connectionRequestRouter.post(
  "/request/send/:status/:userId",
  userAuth,
  async (req, res) => {
    try {
      const user = req.user;
      const fromUserId = user._id;
      const toUserId = req.params.userId;
      const status = req.params.status;
      console.log(status);
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

      console.log(status);
      //* if connection request exist with ignore status then user want to change it to interested , so updating the request status to "interested"
      if (
        existingConnectionRequest &&
        existingConnectionRequest.status === "ignored" &&
        status === "interested"
      ) {
        existingConnectionRequest.status = "interested";
        //* saving the user with interested status and doing early return with sending the response
        const data = await existingConnectionRequest.save();
        return res.json({
          message: `${req.user.firstName} sent connection request to ${receiverProfile.firstName}`,
          data: data,
        });
      }

      //* if connection request exist (with interested status) but  user want to cancel it then update the request with ignored status
      if (
        (existingConnectionRequest &&
          existingConnectionRequest.status === "interested") ||
        status === "ignored"
      ) {
        existingConnectionRequest.status = "ignored";
        //* saving the user with ignored status and doing early return with sending the response
        const data = await existingConnectionRequest.save();
        return res.json({
          message: `Request to ${receiverProfile.firstName} is canceled `,
          data: data,
        });
      }

      //* if a connection request already exist and accepted/rejected
      if (
        existingConnectionRequest &&
        (existingConnectionRequest.status === "accepted" ||
          existingConnectionRequest.status === "rejected")
      ) {
        return res.json({
          message:
            existingConnectionRequest.status === "accepted"
              ? "You are already friends"
              : "Your connection request was rejected",
          data: existingConnectionRequest,
        });
      }
      //* if connection request exist (with interested status) but user sent again request with interested status or if previously ignored but again the user want to ignore sending reding response that already connection request exist or already ignored the profile.
      if (
        existingConnectionRequest &&
        (existingConnectionRequest.status === "interested" ||
          existingConnectionRequest.status === "ignored")
      ) {
        //*early return as connection already exist
        return res.json({
          message:
            existingConnectionRequest.status === "interested"
              ? "Connection request already exist"
              : "Already cancelled the request",
          data: existingConnectionRequest,
        });
      }

      //* making a connection request instance using the model
      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });
      console.log(connectionRequest);
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
      console.log(err);
      res.status(400).send(`Something went wrong:- ${err.message}`);
    }
  }
);
connectionRequestRouter.post(
  "/request/review/:status/:connectionRequestId",
  userAuth,
  async (req, res) => {
    try {
      //* so when this api will be called , first we will check,the token validation through userAuth,and then inside a try{}catch{} block we will get the loggedInUser from req.user as we already save it userAuth, and get status and connectionRequestId from the params, then we will check what status user is sending , it should be either "accepted or rejected" if it something else then throw an error, then , we will try to find a doc in our database collection , which has a same connectionRequestId , the toUserId should be same as the loggedInUser's id and status should be only "interested". if we don't find a user with these matching details we will throw an error but if we find a connection Request doc matching with these details then we will update the doc , with the status dynamically (either accepted or rejected coming from params), then save the connection request instance using .save() method and get the saved data inside a instance and then we will send the response to the user with the updated data and message.So let's go inside routes/requests.js and create the api.
      const loggedInUser = req.user;
      const { status, connectionRequestId } = req.params;

      //* checking if the user entered status value contains below values or not
      const allowedStatuses = ["accepted", "rejected"];
      //* throwing error when it is not contains any values from allowedStatuses values
      if (!allowedStatuses.includes(status)) {
        throw new Error("Incorrect status");
      }

      //* finding connection req doc where _id matches the connectionRequestId sent by user , toUserId is the loggedUser's(receiver's) id ,a nd status is only interested
      const connectionRequest = await ConnectionRequest.findOne({
        _id: connectionRequestId,
        toUserId: loggedInUser._id,
        status: "interested",
      });
      //* throwing error when connection request is not found with matching details
      if (!connectionRequest) {
        return res.status(404).send("Connection Request not found");
      }

      //* if connection request is found then update it with current status given by user,dynamically(either accepted or rejected).
      connectionRequest.status = status;
      //*  saving the data to database
      const data = await connectionRequest.save();
      //*sending response with data
      res.json({
        message: "Connection request is " + status,
        data: data,
      });
    } catch (err) {
      res.status(400).send("something went wrong:-" + err.message);
    }
  }
);
module.exports = connectionRequestRouter;

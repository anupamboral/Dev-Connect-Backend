const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequests = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", ["firstName", "lastName"]); //* returns an array of connection Requests, only finding the request where is toUserId is same as loggedInUser's id to ensure the request is sent to the the loggedInUser,and status is interested , either it will also give the requests with ignored statuses. [about populate method:- the find method would only return the user userId of the sender , but we also wanted the the sender's profile data like first name and lastName to show the user who is sending the request , so we linked two collections userCollection and connection request collection , by getting the reference of the User collection in the fromUserId field present inside connectionRequests schema, using ref:"User", now both are connected, now when we are using the populate method, we are also fetching the data from User collection related the fromUserId, so the first arg is linked field with the User collection and second arg is an array with all the fields we need from the User collection matching with same fromUserId = _id in User collection]

    if (connectionRequests.length === 0) {
      //* early return when no connection request is found
      return res.json({
        message: "No new connection requests found",
      });
    }

    res.json({
      message: "Data fetched successfully",
      data: connectionRequests,
    });

    //* when connection requests exist
  } catch (err) {
    res.status(400).send("Something went wong:-" + err.message);
  }
});

module.exports = userRouter;

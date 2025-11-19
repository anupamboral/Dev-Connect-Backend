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
    }).populate("fromUserId", [
      "firstName",
      "lastName",
      "about",
      "age",
      "skills",
      "photoUrl",
      "gender",
    ]); //* returns an array of connection Requests, only finding the request where is toUserId is same as loggedInUser's id to ensure the request is sent to the the loggedInUser,and status is interested , either it will also give the requests with ignored statuses. [about populate method:- the find method would only return the user userId of the sender , but we also wanted the the sender's profile data like first name and lastName to show the user who is sending the request , so we linked two collections userCollection and connection request collection , by getting the reference of the User collection in the fromUserId field present inside connectionRequests schema, using ref:"User", now both are connected, now when we are using the populate method, we are also fetching the data from User collection related the fromUserId, so the first arg is linked field with the User collection and second arg is an array with all the fields/or string with all fields we need from the User collection matching with same fromUserId = _id in User collection.So previously we were only getting the fromUserId as id but now after populating fromUserId will be a object which will contain  the id, firstName,lastName and other mentioned fields in the array, but it will not fetch any field which is not mentioned like pass word, createdAt, because we don't want to over fetch data which is not required.]

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

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const USER_SAFE_DATA =
      "firstName lastName about age gender skills photoUrl";

    const connections = await ConnectionRequest.find({
      $or: [
        { fromUserId: loggedInUser._id, status: "accepted" },
        { toUserId: loggedInUser._id, status: "accepted" },
      ],
    }).populate("fromUserId", USER_SAFE_DATA); //* it will only fetch the requests where fromUserId is same as loggedInUser's id  and status is accepted or the loggedInUser sent request to some user and also the status is only accepted now,to make sure request is sent to loggedInUser or received by the loggedInUSer, so the requests with other statuses are not fetched. How populate() method works mentioned in the above api, and notes.

    if (connections.length === 0) {
      //* early return when no connection request is found
      return res.json({
        message: "No connections found",
      });
    }

    //* when connection requests exist
    //* the connection data will be array of objects , which has data of every connection request related to the loggedInUser and accepted status, so it also contains the data of connectionRequest id , created at , toUserId (loggedInUser), so this is unnecessary data , we just need the data of the fromUserId , which has all the data of the connection/friend, so we can iterate the connections array and only save the data of the fromUserId.
    const data = connections.map((connection) => connection.fromUserId);

    //* sending back response
    res.json({
      message: "Data fetched successfully",
      data: data,
    });
  } catch (err) {
    res.status(400).send("Something went wong:-" + err.message);
  }
});

module.exports = userRouter;

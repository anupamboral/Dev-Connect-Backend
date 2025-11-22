const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

const USER_SAFE_DATA = "firstName lastName about age gender skills photoUrl";
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

    const connections = await ConnectionRequest.find({
      $or: [
        { fromUserId: loggedInUser._id, status: "accepted" },
        { toUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", USER_SAFE_DATA)
      .populate("toUserId", USER_SAFE_DATA); //* it will only fetch the requests where fromUserId  is same as loggedInUser's id  and status is accepted or the loggedInUser sent request to some user and also the status is only accepted now,to make sure request is sent to loggedInUser or received by the loggedInUSer, so the requests with other statuses are not fetched.So we have to populate() twice,once using fromUserId and second time using toUserId,because whatever connection requests we will get , in some connection loggedInUser will be the sender/fromUserId so in that case we would need the toUserId/receiver details, and in connection loggedInUser will be the receiver/toUserId so in that case we would need the fromUserId, so we will chain two populate methods one after another, first we will populate using fromUserId then populate using ToUserId,    so first arg will be fromUserId for first populate method then for second populate toUserId will be first arg, as it has the reference of the User collection and second arg for both populate will be USER_SAFE_DATA. How populate() method works mentioned in the above api, and notes.

    if (connections.length === 0) {
      //* early return when no connection request is found
      return res.json({
        message: "No connections found",
      });
    }

    //* when connection requests exist
    //* the connection data will be array of objects , which has data of every connection request related to the loggedInUser and accepted status, so it also contains the data of connectionRequest id , created at , toUserId (loggedInUser), so this is unnecessary data , we just need the data of the fromUserId  when loggedInUser is receiver/toUserId and toUserId when logged in user is sender/fromUserId, these have all data of the connection/friend, so we can iterate the connections array and only save the data of the fromUserId when loggedInUser's id is toUserId and toUserId when loggedInUser's id is fromUserId.
    const data = connections.map((connection) => {
      //* returning toUserId data when loggedInUser's id is fromUserId
      if (connection.fromUserId._id.equals(loggedInUser._id)) {
        return connection.toUserId;
      }
      //* returning fromUserId data when loggedInUser's id is toUserId
      return connection.fromUserId;
    });

    //* sending back response
    res.json({
      message: "Data fetched successfully",
      data: data,
    });
  } catch (err) {
    res.status(400).send("Something went wong:-" + err.message);
  }
});

userRouter.get("/user/feed", userAuth, async (req, res) => {
  try {
    //* implementation of pagination
    const page = parseInt(req.query.page) || 1; //* parseInt will convert the string into integer , and if nothing has come oe some wrong thing is coming through query then set it to 1 by default.
    let limit = parseInt(req.query.limit) || 10; //* parseInt will convert the string into integer , and if nothing has come oe some wrong thing is coming through query then set it to 10 by default.
    //* if user pass 100000 as limit then while doing the query our db will hang while doing a so much big query so we should always restrict this limit we will set it to 50 max.
    limit = limit > 50 ? 50 : limit;

    const skip = (page - 1) * limit; //* suppose someone is searching page 3 then (3-1)*10=20 so it will skip first 20 pages.
    //* in the feed of the loggedInUser we should not show any other connection with interested,ignored,accepted,rejected status, and also not show the loggedInUser to himself, we should only show the new people in the feed of anu loggedInUser. So we will find all user's where either the loggedInUser's Id is same as fromUserId or toUserId from the ConnectionRequest Model and the we will use select("field1 field2") method to only save the required fields into the connection Requests. So we can find all the friends(accepted status, who sent or received and accepted) , an also who rejected or ignored loggedInUser's profile. Then we will create a new Set() and assign it as a value of a constant named hiddenProfiles ,Remember a set always saves only unique values, no duplicate values, and then using the forEach method we will loop the all the connections we found and add then inside the set we will add all the fromUserIds and toUserIds, so it will included both the loggedInUser and also the user's who are connected(interested , ignored, accepted,rejected) , the we will write a query using the User model using .find() method. and inside this we will write the logic that except the hiddenUserFromFeed profiles and loggedInUser profile fetch all the other users profile. To write that we will use $and:[] operator to write and query, and $nin to write not in the array query and $ne to write not equal  to query, and also we will use Array.from() method to convert the  set to array., and finally save the response into a constant name visibleFeedUsers then send back response to the client.

    //* getting the loggedInUser as we already saved it inside the userAuth while validating the token
    const loggedInUser = req.user;
    //*  getting the all the connection requests with the "interested , ignored,accepted, rejected statuses, then only selecting the fromUserId and toUserId using the select() method
    const connectionRequests = await ConnectionRequest.find({
      $or: [{ toUserId: loggedInUser._id }, { fromUserId: loggedInUser._id }],
    }).select("fromUserId toUserId");

    //* creating a new Set() and assign it as a value of a constant named hiddenProfiles ,Remember a set always saves only unique values, no duplicate values
    const hiddenUsersFromFeed = new Set();

    //* using the forEach method we will loop the all the connections we found and add then inside the set we will add all the fromUserIds and toUserIds, so it will included both the loggedInUser and also the user's who are connected(interested , ignored, accepted,rejected)
    connectionRequests.forEach((connection) => {
      hiddenUsersFromFeed.add(connection.fromUserId.toString());
      hiddenUsersFromFeed.add(connection.toUserId.toString());
    });

    // * doing a query to the database using the User model using .find() method. and inside this we will write the logic that except the hiddenUserFromFeed profiles and loggedInUser profile fetch all the other users profile. To write that we will use $and:[] operator to write and query, and $nin to write not in the array query and $ne to write not equal  to query, and also we will use Array.from() method to convert the hiddenUserFromFeed set to array., and finally save the response into a constant name visibleFeedUsers then send back response to the client.
    const visibleFeedUsers = await User.find({
      $and: [
        { _id: { $nin: Array.from(hiddenUsersFromFeed) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    })
      .select(USER_SAFE_DATA)
      .skip(skip)
      .limit(limit); //* $nin means not array , so it will only return the results from db which are not included in the array, so only the ids that in our hiddenUserFromFeed . Array.from() converts the set into a array. $ne selects the documents where the value of the specified field is not equal to passed value by us basically it represents not Equal to. This includes documents that do not contain the specified field. so it will not return any users who is included in the hidden array list  because of the first condition and also it will not return the profile doc of the loggedInUser because of the second condition.and then we are only selecting the required fields using select method not all the fields from the returned dat from db like password or email as these are not required. skip method will skip the number of pages what ever passed inside it, and limit method only give the number of results we pass inside it, like we the user pass page 2 then (2-1)*10=10 , so it will skip first ten pages and if the limit is passed 10 then after skipping first 10 pages because of the skip method it will return 10 docs it will show docs from 11-20
    // console.log(visibleFeedUsers);
    //* sending back response
    res.json({
      data: visibleFeedUsers,
    });
  } catch (err) {
    console.log(err);
    res.status(400).send("something went wrong:- " + err.message);
  }
});
module.exports = userRouter;

const jwt = require("jsonwebtoken");
const User = require("../models/user");
require("dotenv").config();
//* commented as not needed.
/*const adminAuth = (req, res, next) => {
  //* admin auth checking
  console.log("admin auth is getting checked");

  const token = "xyz"; //*fake data , in real world token comes with the request.body
  const isAuthorized = token === "xyz";
  if (!isAuthorized) {
    res.status(401).send("Unauthorized request");
  } else {
    next(); //*
  }
};
const userAuth = (req, res, next) => {
  //* user auth checking
  console.log("user auth is getting checked");

  const token = "xyz"; //*fake data , in real world token comes with the request.body
  const isAuthorized = token === "xyz";
  if (!isAuthorized) {
    res.status(401).send("Unauthorized request");
  } else {
    next(); //*
  }
};*/

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      //* when the token is not valid that means we should send a proper message with status code 401 which means unauthorized credentials
      return res.status(401).json({ message: "Please login" });
      // throw new Error("Token is not valid!!");//* this error message was not proper
    }
    const decodedObj = jwt.verify(token, process.env.JWT_SECRET); //* first param received token , second param secret password.It does not return promise so we don't need to write await.
    const { _id } = decodedObj;

    const user = await User.findById(_id);

    if (!user) {
      throw new Error("User not found");
    }
    //* saving the user in the req obj
    req.user = user;
    //* if any error happen then immediately catch block will be executed and below next() will not be called so next request handler wil not be executed
    next(); //*it will move the execution to the next request handler
  } catch (err) {
    res.status(400).json({ message: "something went wrong:-" + err.message });
  }
};

module.exports = {
  userAuth,
};

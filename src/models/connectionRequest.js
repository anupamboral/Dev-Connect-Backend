const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", //*reference to the User collection
      required: true,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    status: {
      type: String,
      enum: {
        values: ["interested", "ignored", "accepted", "rejected"],
        message: `{VALUE} is incorrect`,
      },
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
//* setting compound index , on both fields , so it will increase the query speed of database
connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 }); //* 1 means ascending order, -1 means descending order.
connectionRequestSchema.pre("save", function (next) {
  //* Now one more validation check is remaining, what if the user is sending request to himself,it should not be allowed , we can perform this validation inside the API but , to write this validation , we will learn how we can add validation checks ata the schema.level using schema .pre("save") function , which works like a middleware, because every time it will called before calling .save() method on the instance. As this is like a middleware so calling next() is important , mentioning next param while making the function is also important then only we can call next(), So we will create this .pre() middleware on connectionRequestSchema and inside this we will check if the fromUserId to toUserId is same and if both are same then we will throw an error .While checking fromUserId === toUserId ,we can't do it like we do for strings using ===.Because its a mongo db object id so we have to use .equals method to compare.and always write normal function not arrow function while writing pre() as we will use this key inside it to access the instance.
  //* accessing the instance
  const connectionRequest = this;
  //* checking if sender and the receiver is same , if same then throwing an error
  if (connectionRequest.toUserId.equals(connectionRequest.fromUserId)) {
    throw new Error("Request sender and receiver can not be same.");
  } //* if error happens it will go to catch block of the request handler where it is called as throwing an error

  //* moving to request handler
  next();
}); //* this will be executed every time before calling the .save method on any instance created using connectionRequestSchema.

//* while naming the model we always use PascalCase,so the first letter start from capital letter
const ConnectionRequestModel = mongoose.model(
  "ConnectionRequest",
  connectionRequestSchema
); //*1st param name and 2nd is schema

//* exporting the model
module.exports = ConnectionRequestModel;

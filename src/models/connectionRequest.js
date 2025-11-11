const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
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

//* while naming the model we always use PascalCase,so the first letter start from capital letter
const ConnectionRequestModel = new mongoose.model(
  "ConnectionRequest",
  connectionRequestSchema
); //*1st param name and 2nd is schema

//* exporting the model
module.exports = ConnectionRequestModel;

const express = require("express");
const razorpayInstance = require("../utils/razorpay");
const paymentRouter = express.Router();
const Payment = require("../models/payment");
const { userAuth } = require("../middlewares/auth");
const { membershipAmounts } = require("../utils/constants");
require("dotenv").config();
paymentRouter.post("/payment/create", userAuth, async (req, res) => {
  try {
    const { membershipType } = req.body;
    const { firstName, lastName, emailId } = req.user;
    //*creating an order
    const order = await razorpayInstance.orders.create({
      amount: membershipAmounts[membershipType], //* amount in the smallest currency unit //* this is coming from constants.js file, depending on what membership user chosen in frontend
      currency: "INR",
      receipt: "receipt#1",
      notes: {
        firstName: firstName,
        lastName: lastName,
        emailId: emailId,
        membershipType: membershipType,
      },
    });
    //*save it in my database
    const payment = new Payment({
      userId: req.user._id,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
      status: order.status,
      notes: order.notes,
    });
    const savedPayment = await payment.save();
    //*send order details to frontend
    res.json({
      ...savedPayment.toJSON(),
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    res.status(400).json({ message: "something went wrong:-" + err.message });
  }
});

module.exports = paymentRouter;

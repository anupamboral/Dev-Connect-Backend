const express = require("express");
const razorpayInstance = require("../utils/razorpay");
const paymentRouter = express.Router();
const Payment = require("../models/payment");
const { userAuth } = require("../middlewares/auth");
const { membershipAmounts } = require("../utils/constants");
require("dotenv").config();
const {
  validateWebhookSignature,
} = require("razorpay/dist/utils/razorpay-utils"); //* for webhook verification
const User = require("../models/user");

//* creating an order
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
    //*send order details to frontend(tojson() method is used to convert mongoose document to plain js object,it is important to use this method because mongoose documents have some additional properties and methods which we don't want to send to frontend)
    res.json({
      ...savedPayment.toJSON(),
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    res.status(500).json({ message: "something went wrong:-" + err.message });
  }
});

//*webhook to listen to payment status updates from razorpay
paymentRouter.post("/payment/webhook", async (req, res) => {
  try {
    const webhookSignature = req.headers["X-Razorpay-Signature"];
    console.log("Webhook signature:", webhookSignature);

    //* below function validateWebhookSignature will return true or false
    const isWebhookValid = validateWebhookSignature(
      JSON.stringify(req.body),
      webhookSignature,
      process.env.RAZORPAY_WEBHOOK_SECRET
    ); //*first param webhook body, will sent by razorpay in req.body , second param is signature sent by razorpay in headers, third param is our secret key which we have set in env file. if someone tries to send some malicious information to our webhook endpoint then this validateWebhookSignature
    console.log(isWebhookValid);
    //* if webhook is not valid then we will return 400 status code
    if (!isWebhookValid) {
      return res.status(400).json({ message: "Invalid webhook signature" });
    }
    //!updating the payment status in our database
    const paymentDetails = req.body.payload.payment.entity; //* getting payment details from webhook payload.we can see the how req.body looks like in razorpay doc :- https://razorpay.com/docs/webhooks/payments/#payment-authorised
    const payment = await Payment.findOne({ orderId: paymentDetails.order_id }); //* finding the payment in our database using orderId.

    payment.status = paymentDetails.status; //* updating the status
    payment.paymentId = paymentDetails.id; //* updating the paymentId
    await payment.save(); //* saving the payment

    console.log("payment saved");
    //* updating the user as premium user

    const user = await User.findOne({ _id: payment.userId });
    user.isPremiumUser = true;
    user.membershipType = payment.notes.membershipType;
    await user.save();

    //* sending 200 status code to razorpay to acknowledge that we have received the webhook (important step otherwise razorpay will keep sending the webhook again and again)
    res.status(200).json({ message: "Webhook received successfully" });
  } catch (err) {
    res.status(400).json({ message: "something went wrong:-" + err.message });
  }
});

//* to verify the membership status from the frontend
paymentRouter.get("/premium/verify", userAuth, async (req, res) => {
  try {
    const user = req.user.toJSON(); //* toJson() method will give plain js object
    //* check if the user is premium user and send the response to frontend
    if (user.isPremiumUser) {
      return res.json({
        isPremiumUser: true,
        membershipType: user.membershipType,
      });
    }
  } catch (err) {
    res.status(400).json({ message: "something went wrong:-" + err.message });
  }
});

module.exports = paymentRouter;

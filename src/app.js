//* creating our server using express
const express = require("express"); //* this require("express") returns a function.
//* requiring  database.js file
const connectDb = require("./config/database");
//* now we can call this express function and it will create a express js application
const app = express(); //* this function call returns the express js application, so here we are creating the instance of the express js application.
//* basically we are creating a web server using express js .

//* importing the User model
const User = require("./models/user");

//* requiring bcrypt library after installing
const bcrypt = require("bcrypt");

//* requiring cookie parser library after installing
const cookieParser = require("cookie-parser");

//* requiring jsonwebtoken
const jwt = require("jsonwebtoken");

const { validateSignUpData, validateSignInData } = require("./utils/validate");

//! importance of express.json() middleware.
//* so to convert the json to js object , we will use a middleware given to us by express.js. and that's express.json(). this middleware can take the json from the req.body then convert that to js object then again put that inside the req.body and we can then easily access it form the request body.
//* to use it we can just put it inside app.use(express.json())) , like we cerate middlewares, as we know app.use() work for all methods when we specify any path as first arg, but if we don't even specify any path then it will work for all requests with any path . so that's why we are using it without any path so it can work for any api. like this :- app.use(express.json()))
//* we need to put this above other apis so what ever request comes with json data get converts to the js object and we can easily access the data inside the request handlers req.body.
app.use(express.json());
//!Cookie-parser library
//* this library is recommended by express.And the same develops od express library has built this package for parse cookies, so we can use this as a middleware similar to express.json(). We just have to use it inside app.use(), so what ever http method is called by the client to make api call , i it request includes a cookies, this middleware will be triggered and it's cookie will parsed. So this on middleware will work for all api's to parse cookies. We just have to mention it at the top before all apis, as the code execution happens from top to bottom.First let's install this library using:- npm i cookie-parser
app.use(cookieParser());

//* now we can create our apis to add a user into our database
//* now inside our app.js , we will create a api to create a user into our database, so we already know that if we want to create a user then post method is best for that because we want to create some new data/document inside the database.
app.post("/signup", async (req, res) => {
  try {
    //*validation of data
    validateSignUpData(req); //* this custom helper function we built to validate the sign up data, as it throw error if any wrong data is entered so it will trigger the catch block.so writing it inside a try block is important.

    const { firstName, lastName, emailId, password } = req.body;

    //* encrypting/hashing the password
    const hashPassword = await bcrypt.hash(password, 10); //* 1st arg is text password and 2nd arg is number of salt rounds.it returns a promise.
    console.log(hashPassword);
    //!creating instance from User model using dynamic data coming from client side(directly we should not use req.body to create instance instead do like below)
    const user = new User({
      firstName: firstName,
      lastName: lastName,
      emailId: emailId,
      password: hashPassword,
    }); //* present in mongoose doc ,go to model => Model(), we have used hash password which is the encrypted password.

    //! saving the user instance inside the database using .save() method
    await user.save();
    //! sending response to the client
    res.send("User added successfully");
  } catch (err) {
    //! catching errors and sending error message
    res.status(400).send(`Error saving the user:-${err.message}`);
  } //* status code 400 represents bad request , and we are using it here because we are sending request to the server to save the user data and if the request fails then we can use to 400 status code as it represents bad request.
});

//todo:-  now let's make a "/user" api , using which client can search a user using that user's emailId. By passing the user using the request body. As this api is about only getting the user so we will use the app.get method to create this user api
app.get("/user", async (req, res) => {
  //* getting the user emailId from the request
  const userEmail = req.body.emailId; //!while sending the dta from client/postman always send in json format(key and value both inside "":"").
  console.log(userEmail);
  //* we will User.find method(see mongoose doc to see find method),available on User model we created, which takes any filters to find a document, here we are using emailId as a filter.
  try {
    const users = await User.find({ emailId: userEmail }); //* it will return array of users , matching with our filter. // present in mongoose doc ,go to Model.find()
    //* if the returned array does not include any result, then we can send response user not found

    if (users.length === 0) {
      res.status(404).send("User not found");
    } else {
      //* sending back user to client when user is found
      res.send(users);
    }
  } catch (err) {
    //* this catch block will be only executed only if something get ]s wrong with above code, status 400 code used for bad request , when something is qrong with our code.
    res.status(400).send("something went wrong");
  }
});

//todo :- this time we will make a api which will find only user matching with the filter we pass, so it will not return an array of objects instead it will just return one object. so the data base can contain multiple users matching the same filter , but this return just one user, we will use User.findOne({"email":"userEmail"}) method to find one user.
//! ideally our database should not contain two users with same emailID but till now we have to set any rules like that , so in future lessons we will learn how to do that , so every user has a unique emailId.
app.get("/oneuser", async (req, res) => {
  //* getting the user email from the request body
  const userEmail = req.body.emailId;
  console.log(userEmail);
  //* finding the user from the database
  try {
    const user = await User.findOne({ emailId: userEmail }); //* present in mongoose doc ,go to model.findOne()
    if (!user) {
      res.status(404).send("user not found");
    } else {
      res.send(user);
    }
  } catch (err) {
    res.status(400).send("Something went wrong:" + err.message);
  }
});

//todo:- lets build a feed api which will give us all the users present in our database. we will again use the User.find({}) method with empty filter , so we can get all the users. when we open tinder we see many users data on the feed page , so this api is very similar , that's why we named it feed api.it will give us all the users data from the database.
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({}); //* using User.find({}) with empty filter to find all the users. //* present in mongoose doc ,go to model.findOne()

    if (users.length === 0) {
      res.status(404).send("no users found");
    } else {
      res.send(users);
    }
  } catch (err) {
    res.status(400).send("Something went wrong:" + err.message);
  }
});

//todo :- let's create a delete /user api to delete a user using id .we will get the id from client using req body.we will use Model.findByIdAndDelete(id)(present in mongoose doc).
app.delete("/user", async (req, res) => {
  //* getting the userId from the request body
  const userId = req.body.userId;
  console.log(userId);

  try {
    const user = await User.findByIdAndDelete(userId); //* findByIdAndDelete(id) is a shorthand for findOneAndDelete({ _id: id }). so if we write only the id as argument it will work fine. so findByIdAndDelete(id) or findByIdAndDelete(_id:id) both are correct and both will work.//* present in mongoose doc ,go to model.findByIdAndDelete()
    res.send("user is deleted");
  } catch (err) {
    res.status(400).send("something went wrong" + err.message);
  }
});

//todo: let's make a /user api which will update a portion of an user's data using their userId. as we are not updating the while user instead just updating just a portion so we will use app.patch() not app.put(). ans as we are trying to update the data using the id we will use Model.findByIdAndUpdate(id,{update},{options(optional)}).

app.patch("/user/:userId", async (req, res) => {
  const data = req.body;
  const userid = req.params.userId;

  try {
    //* implementing api level sanitization so the user can't their email or name.
    const ALLOWED_UPDATABLE_FIELDS = [
      "about",
      "photoUrl",
      "gender",
      "age",
      "skills",
    ];
    const isUpdateAllowed = Object.keys(data).every((k) =>
      ALLOWED_UPDATABLE_FIELDS.includes(k)
    ); //* it will return true if user the user only want update from the ALLOWED_UPDATABLE_FIELDS, if the user try to update any other field then we will through an error , which will execute the catch block.
    if (!isUpdateAllowed) {
      throw new Error("updating email or name is not allowed.");
    }
    //! the user can upload 1 million skills and that can crash our database , so with below condition we have restricted the skills to 10.
    if (data.skills && data?.skills.length > 10) {
      //* if the user sent skills data and it is more than 10 only then it will be executed, suppose the user does not sent the skills field data for updating then because od of first condition check this if block will not be executed because data.skills value will be false so this will not execute.
      throw new Error("You can upload maximum 10 skills");
    }
    const user = await User.findByIdAndUpdate(userid, data, {
      returnDocument: "after",
      runValidators: true,
    }); //* first param is the id we received from request, we can also write it as {_id:userId} or just userID as its shorthand, the second param is the the updated object , we have also received it from the request, it contains the field with updated data which the user want to update in our database.the third param is options, it is optional to mention, so in the mongoose docs Model.findByIdAndUpdate() we can see many options available in the doc, there is a option returnDocument , by default it is set to before which means it returns it will return the document(user) before update. but if we change it to after then it will return the document after update.
    console.log(user);
    res.send("user updated successfully");
  } catch (err) {
    res.status(400).send("Something went wrong" + err.message);
  }
});

//! while testing below patch method comment the above path method as both has same url and same http method.
//todo: let's make a /user api which will update a portion of an user's data using their emailId. as we are not updating the while user instead just updating just a portion so we will use app.patch() not app.put(). ans as we are trying to update the data using the emailId we will use Model.findOneAndUpdate(id,{update},{options(optional)}).
//! Model.findOneAndUpdate() and Model.findByIdAndUpdate() are very similar . but for Model.findOneAndUpdate() we can find the user using any field like email or age , name , but for Model.findByIdAndUpdate() we can only use id . behind the scenes Model.findByIdAndUpdate() uses Model.findOneAndUpdate(). So both are equivalent.See the doc mongoose , Model.findOneAndUpdate()
/*
app.patch("/user", async (req, res) => {
  const data = req.body;
  const userEmail = req.body.emailId;
  console.log(data);
  try {
    const user = await User.findOneAndUpdate({ emailId: userEmail }, data, {
      returnDocument: "after",
      runValidators: true,
    }); //* first param is the id we received from request, we can also write it as {_id:userId} or just userID as its shorthand, the second param is the the updated object , we have also received it from the request, it contains the field with updated data which the user want to update in our database.the third param is options, it is optional to mention, so in the mongoose docs Model.findByIdAndUpdate() we can see many options available in the doc, there is a option returnDocument , by default it is set to before which means it returns it will return the document(user) before update. but if we change it to after then it will return the document after update.
    console.log(user);
    res.send("user updated successfully");
  } catch (err) {
    res.status(400).send("Something went wrong" + err.message);
  }
});*/

//! Lets make a sign in api now
//* this will receive the email and password from the client as request, and then first it will verify if the email exist in our database or not using the findOen method , because the emailId is unique for all users . if the email does not match then we will throw an error.but if the user's email exist iin our database then we will verify the password, so to verify the password we will use a function named bcrypt.compare(userEnteredEmail,hashPasswordFromDatabase), so this function takes the user entered email for sign in as the first param, then as the second param it takes the hash password, so before comparing we have to fetch this hash password from the db. then we can compare the userEmail with the hash password/encrypted password . if it matches then it will return true, and we can send response user logged in successfully , if it fails then it will return false then we can throw error invalid credentials.
//! important:- when we through error while the user entered email does not match any existing email in our db , we should never through a error message like , "user does not exist in our database", also when the password mismatch with user entered password then also we should not throw error like "password is not matching" , because attackers can send fake emails with passwords, so if we through this kind of error then they can know if there entered email exist in our database or not, so we should never tell them if this email exist in our db or not also same applies for password mismatching, it can make our api more vulnerable, So in both of these cases we should throw error like :- " invalid credentials".It's the best practice.
app.post("/signin", async (req, res) => {
  try {
    //* validating email format
    validateSignInData(req);

    const { emailId: reqEmail, password: reqPassword } = req.body;

    //* validating email from the database
    const user = await User.findOne({ emailId: reqEmail });
    //* when user does not exist in the database
    if (!user) {
      throw new Error("Invalid credentials");
    }
    //* password checking
    const hashPassword = user.password; //* hash password fetched from the database
    // console.log(hashPassword);
    const isValidPassword = await bcrypt.compare(reqPassword, hashPassword); //* if this req password match with the hash password fetched from the dab then this method will return true, if mismatch then it will return false.it returns a promise so always use

    // console.log(isValidPassword);
    //* when password is validated and right , sending successful message to client
    if (isValidPassword) {
      //* generating JWT(token)(sending the userId as secret data inside the token)
      const token = jwt.sign({ _id: user._id }, "dev@666Connect"); //*1st param secret data,2nd param secret password
      console.log(token);
      //* sending the cookie
      res.cookie("token", token); //* sending the cookie to the client ,it's first argument is "name" so here we can write "token" as we are sending the token using the cookie, and as the second argument pass the value of the token, we can also mention a third value which is options, but this third value is optional
      res.send("Logged In successfully");
    } else {
      //* if password mismatch then throwing error
      throw new Error("Invalid credentials");
    }
  } catch (err) {
    res.status(400).send("Something went wrong:-" + err.message);
  }
});
app.get("/profile", async (req, res) => {
  const cookies = req.cookies;
  const { token } = cookies;
  const tokenData = jwt.verify(token, "dev@666Connect"); //* first param received token , second param secret password
  console.log(tokenData); //* it will give us a object which will contain the secret data we passes and also a property named "iat":4586769; which jwt added itself for verification.
  //* We can destructure the object and get the secret data we saved and use that to fetch the user.
  const { _id } = tokenData;

  const user = await User.findById(_id);

  res.send(user);
});
connectDb()
  .then(() => {
    console.log("successfully connected to the database cluster");
    app.listen(3000, () => {
      console.log("server is listening successfully on port 3000");
    }); //* using the listen method we listening to the incoming requests on port number 3000, the first parameter of this listen method is the port number , now there is second parameter which is a callback function, and this will be called when our server is up and running.
  })
  .catch((err) => {
    console.error("cannot connect to the database:-" + err.message);
  });

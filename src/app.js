//* creating our server using express
const express = require("express"); //* this require("express") returns a function.
//* requiring  database.js file
const connectDb = require("./config/database");
//* now we can call this express function and it will create a express js application
const app = express(); //* this function call returns the express js application, so here we are creating the instance of the express js application.
//* basically we are creating a web server using express js .

//* importing the User model
const User = require("./models/user");

//* requiring cookie parser library after installing
const cookieParser = require("cookie-parser");

//* requiring jsonwebtoken
const jwt = require("jsonwebtoken");

const { validateSignUpData, validateSignInData } = require("./utils/validate");
const { userAuth } = require("./middlewares/auth");

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

//! Lets make a sign in api now
//* this will receive the email and password from the client as request, and then first it will verify if the email exist in our database or not using the findOen method , because the emailId is unique for all users . if the email does not match then we will throw an error.but if the user's email exist iin our database then we will verify the password, so to verify the password we will use a function named bcrypt.compare(userEnteredEmail,hashPasswordFromDatabase), so this function takes the user entered email for sign in as the first param, then as the second param it takes the hash password, so before comparing we have to fetch this hash password from the db. then we can compare the userEmail with the hash password/encrypted password . if it matches then it will return true, and we can send response user logged in successfully , if it fails then it will return false then we can throw error invalid credentials.
//! important:- when we through error while the user entered email does not match any existing email in our db , we should never through a error message like , "user does not exist in our database", also when the password mismatch with user entered password then also we should not throw error like "password is not matching" , because attackers can send fake emails with passwords, so if we through this kind of error then they can know if there entered email exist in our database or not, so we should never tell them if this email exist in our db or not also same applies for password mismatching, it can make our api more vulnerable, So in both of these cases we should throw error like :- " invalid credentials".It's the best practice.
app.post("/signin", async (req, res) => {
  try {
    //* validating email format
    validateSignInData(req);

    const { emailId: reqEmail, password: reqPassword } = req.body;

    //* validating email from the database
    const user = await User.findOne({ emailId: reqEmail }); //* if the user is valid then this user constant becomes the user instance of that particular user.
    //* when user does not exist in the database
    if (!user) {
      throw new Error("Invalid credentials");
    }
    console.log(user.getJWT);
    const isValidPassword = await user.validatePassword(reqPassword);

    // console.log(isValidPassword);
    //* when password is validated and right , sending successful message to client
    if (isValidPassword) {
      //* generating JWT(token)(sending the userId as secret data inside the token)
      const token = user.getJWT(); //* if above the user exist in the database , it saved the user data into the user constant, so the user is basically a instance of the UserSchema, so we can access the methods available on the user schema,as we shifted the logic of generating the JWT(token) to a userSchema method named getJWT(),it returns the token.

      //* sending the cookie
      res.cookie("token", token, {
        expires: new Date(Date.now() + 7 * 24 * 3600000 + 3600000 * 5.5),
      }); //* so cookie will be removed after 7 days}); //* sending the cookie to the client ,it's first argument is "name" so here we can write "token" as we are sending the token using the cookie, and as the second argument pass the value of the token, we can also mention a third value which is options, but this third value is optional
      res.send("Logged In successfully");
    } else {
      //* if password mismatch then throwing error
      throw new Error("Invalid credentials");
    }
  } catch (err) {
    res.status(400).send("Something went wrong:-" + err.message);
  }
});
app.get("/profile", userAuth, async (req, res) => {
  //* in userAuth after validation we saved the user in the req.user
  const user = req.user;

  res.send(user);
});

//todo lets make a post /sendConnectionRequest api , where we will just have to use this userAuth for authentication and we can also know who is sending the request as we already have the user added inside req.user from userAuth.
app.post("/sendConnectionRequest", userAuth, async (req, res) => {
  const user = req.user;

  console.log("sending sonnection request");
  res.send(user.firstName + " is sending connection request");
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

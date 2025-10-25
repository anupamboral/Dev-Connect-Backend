//* creating our server using express
const express = require("express"); //* this require("express") returns a function.
//* requiring  database.js file
const connectDb = require("./config/database");
//* now we can call this express function and it will create a express js application
const app = express(); //* this function call returns the express js application, so here we are creating the instance of the express js application.
//* basically we are creating a web server using express js .

//* importing the User model
const User = require("./models/user");

//! importance of express.json() middleware.
//* so to convert the json to js object , we will use a middleware given to us by express.js. and that's express.json(). this middleware can take the json from the req.body then convert that to js object then again put that inside the req.body and we can then easily access it form the request body.
//* to use it we can just put it inside app.use(express.json())) , like we cerate middlewares, as we know app.use() work for all methods when we specify any path as first arg, but if we don't even specify any path then it will work for all requests with any path . so that's why we are using it without any path so it can work for any api. like this :- app.use(express.json()))
//* we need to put this above other apis so what ever request comes with json data get converts to the js object and we can easily access the data inside the request handlers req.body.
app.use(express.json());

//* now we can create our apis to add a user into our database
//* now inside our app.js , we will create a api to create a user into our database, so we already know that if we want to create a user then post method is best for that because we want to create some new data/document inside the database.
app.post("/signup", async (req, res) => {
  //! accessing the request
  console.log(req.body);
  //!creating instance from User model using dynamic data coming from client side
  const user = new User(req.body);

  try {
    //! saving the user instance inside the database using .save() method
    await user.save();
    //! sending response to the client
    res.send("User added successfully");
  } catch (err) {
    //! catching errors and sending error message
    res.send(400).send(`Error saving the user:-${err.message}`);
  } //* status code 400 represents bad request , and we are using it here because we are sending request to the server to save the user data and if the request fails then we can use to 400 status code as it represents bad request.
});

//todo:-  now let's make a "/user" api , using which client can search a user using that user's emailId. By passing the user using the request body. As this api is about only getting the user so we will use the app.get method to create this user api
app.get("/user", async (req, res) => {
  //* getting the user emailId from the request
  const userEmail = req.body.emailId; //!while sending the dta from client/postman always send in json format(key and value both inside "":"").
  console.log(userEmail);
  //* we will User.find method(see mongoose doc to see find method),available on User model we created, which takes any filters to find a document, here we are using emailId as a filter.
  try {
    const users = await User.find({ emailId: userEmail }); //* it will return array of users , matching with our filter.
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
app.get("/oneuser", async (req, res) => {
  //* getting the user email from the request body
  const userEmail = req.body.emailId;
  console.log(userEmail);
  //* finding the user from the database
  try {
    const user = await User.findOne({ emailId: userEmail });
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
    const users = await User.find({}); //* using User.find({}) with empty filter to find all the users.

    if (users.length === 0) {
      res.status(404).send("no users found");
    } else {
      res.send(users);
    }
  } catch (err) {
    res.status(400).send("Something went wrong:" + err.message);
  }
});

connectDb()
  .then(() => {
    console.log("successfully connected to the database cluster");
    app.listen(3000, () => {
      console.log("server is listening successfully on port 3000");
    }); //* using the listen method we listening to the incoming requests on port number 3000, the first parameter of this listen method is the port number , now there is second parameter which is a callback function, and this will be called when our server is up and running.
  })
  .catch((err) => {
    console.error("cannot connect to the database");
  });

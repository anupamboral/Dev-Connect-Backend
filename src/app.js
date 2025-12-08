//* creating our server using express
const express = require("express"); //* this require("express") returns a function.
//* requiring  database.js file
const connectDb = require("./config/database");
//* now we can call this express function and it will create a express js application
const app = express(); //* this function call returns the express js application, so here we are creating the instance of the express js application.
//* basically we are creating a web server using express js .
require("dotenv").config();
//* requiring cookie parser library after installing
const cookieParser = require("cookie-parser");
//* for solving cors issue in the frontend using cors library
const cors = require("cors");

//* importing the routers
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const connectionRequestRouter = require("./routes/request");
const userRouter = require("./routes/user");



//! importance of express.json() middleware.
//* so to convert the json to js object , we will use a middleware given to us by express.js. and that's express.json(). this middleware can take the json from the req.body then convert that to js object then again put that inside the req.body and we can then easily access it form the request body.
//* to use it we can just put it inside app.use(express.json())) , like we cerate middlewares, as we know app.use() work for all methods when we specify any path as first arg, but if we don't even specify any path then it will work for all requests with any path . so that's why we are using it without any path so it can work for any api. like this :- app.use(express.json()))
//* we need to put this above other apis so what ever request comes with json data get converts to the js object and we can easily access the data inside the request handlers req.body.
app.use(express.json());
//!Cookie-parser library
//* this library is recommended by express.And the same develops od express library has built this package for parse cookies, so we can use this as a middleware similar to express.json(). We just have to use it inside app.use(), so what ever http method is called by the client to make api call , i it request includes a cookies, this middleware will be triggered and it's cookie will parsed. So this on middleware will work for all api's to parse cookies. We just have to mention it at the top before all apis, as the code execution happens from top to bottom.First let's install this library using:- npm i cookie-parser
app.use(cookieParser());
//* as frontend is hosted n different localhost port so, it will throw a cors error so , we have to use this cors middleware to handle that issue , just install cors library using npm i cors and then here ue it as a middleware in app.js
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://x4r69l6j-5173.inc1.devtunnels.ms",
    ], //*(Whatever your frontend url is)
    credentials: true, // *<= Accept credentials (cookies) sent by the client
  })
);

//* using all routers we created
//* we have mentioned all router using app.use("/") because all request coming from the clients side/postman will be triggered by the app.use("/") and as we are using app.use() method, and also the with the path "/", which means all requests will trigger below router handlers, then it will check all of the routers one by one, and wherever it finds the matching url with path with url , it will start to execute the api code, and send the response, once response is sent it will not go further.
//* let's say user is making a api call to /profile api then first the express will go to authRouter as we have used app.use("/") then try to find the /profile api, and as it is not present in the authRouter it will go to the next router which is the profileRouter and there it will see the profile api present so it will execute the code of profile api and send the response then close the socket.
app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", connectionRequestRouter);
app.use("/", userRouter);

connectDb()
  .then(() => {
    console.log("successfully connected to the database cluster");
    app.listen(process.env.PORT, () => {
      console.log("server is listening successfully on port 3000");
    }); //* using the listen method we listening to the incoming requests on port number 3000, the first parameter of this listen method is the port number , now there is second parameter which is a callback function, and this will be called when our server is up and running.
  })
  .catch((err) => {
    console.error("cannot connect to the database:-" + err.message);
  });

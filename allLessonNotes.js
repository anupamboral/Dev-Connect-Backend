//! ⁢Season 2 - Episode - 03 - Creating our express server
//* first we have initialized the project using npm init.
//* Difference between package.json and package-lock.json
//*The package.json and package-lock.json files serve distinct but complementary roles in Node.js projects, primarily concerning dependency management.
//*package.json:
//*Purpose: Defines the project's metadata (e.g., name, version, description) and lists the project's direct dependencies along with acceptable version ranges (e.g., using caret ^ or tilde ~ symbols).
//*Content: Specifies high-level requirements for dependencies, allowing for minor or patch updates within a defined range.
//*Human Readability: Designed to be easily understood and modified by developers.
//*package-lock.json:
//*Purpose: Records the exact, resolved dependency tree, including the specific versions of all direct and transitive dependencies (dependencies of dependencies). It ensures reproducible builds across different environments.
//*Content: Contains precise version numbers, integrity hashes, and the exact location from which each package was installed.
//*Machine Readability: Primarily for use by npm or Yarn to guarantee consistent installations.
//*Automatic Generation: Automatically generated or updated by npm install or yarn install
//*In essence, package.json declares what dependencies your project needs and what range of versions are acceptable, while package-lock.json precisely records which exact versions of all dependencies were installed during the last successful npm install or yarn install. This ensures that anyone setting up the project gets the identical set of dependencies, preventing "it works on my machine" issues.

//* now we are going to create a server using express.js,it is open source framework of node js.
//* lets install express command - npm i express
//* now we have to require express inside a constant named express , this require("express") returns a function.
//* creating our server using express
const express = require("express"); //* this require("express") returns a function.
//* now we can call this express function and it will create a express js application
const app = express(); //* this function call returns the express js application, so here we are creating the instance of the express js application.
//* basically we are creating a web server using express js .

//* we need to handle the incoming requests and send them response.
//* So we need a request handler/route handler function , so here to handle requests we are going to use use() function.the first param is the path , if we don't mention the first param then the response will be same for all the paths, bt when we specify the path then the response will be only specific to the path mentioned
// app.use("/home", (req, res) => {
//   res.send("hello from home page"); //* on the response we can call the send method to actually send any response to the client/browser.
// });
app.use("/home/dashboard", (req, res) => {
  res.send("you are one the dashboard");
});

//* the order of the handlers matters too much , that's why we commented out /home handler above , because codes gets executed from the top to bottom , and if we would not comment the above /home handler above then even from the browser we search url/home/dashboard  still it would trigger the /home handler not the /home/dashboard . Because the when the execution happens from the top and and it sees /home, it matches the first portion of the path "/home/dashboard" that's why it would trigger the /home handler , which should not happen, that's why we should keep the specific path handlers on the top like "/home/dashboard" or "/home/profile" and always keep the generic path handlers at the bottom portion like "/" or "/home".
app.use("/home", (req, res) => {
  res.send("hello from home page"); //* on the response we can call the send method to actually send any response to the client/browser.
});
app.use("/test", (req, res) => {
  res.send("testing is good😉😉😉");
});

//* the below handler is the most generic/common handler , because anything starts from "/" can trigger this handler like if the user search url/xyz ,though xyz handler is not present but as there is / in front of of/xyz that why it will trigger this handler
app.use("/", (req, res) => {
  res.send("namaste");
});
//* now using this web server we have to listen for incoming requests on some port , so any body can connect to us using that port.
app.listen(3000, () => {
  console.log("server is listening successfully on port 3000");
}); //* using the listen method we listening to the incoming requests on port number 3000, the first parameter of this listen method is the port number , now there is second parameter which is a callback function, and this will be called when our server is up and running.

//* whenever we are making some change in our code we have to restart our server manually every time , so it is not updating the changes  automatically on the browser."nodemon" is a tool that helps develop Node.js based applications by automatically restarting the node application when file changes in the directory are detected. So we can install a package called nodemon using the command
//* npm i -g nodemon. here -g is for install it on global/system level so we can use it in any project.
//* now to use nodemon , when we will start running our application using terminal, instead of 'node src/app.js',  we have to write "nodemon src/app.js".
//* let's save these scripts in our package.json file , for start script we will keep node src/app.js and for dev script we will keep nodemon src/app.js, then after doing this we just need to write the script like npm run dev to to run using nodemon and npm run start to run using node.

//!Season 2 - Episode - 04 - Routing and request handlers
//*   why we should keep the specific path handlers on the top like "/home/dashboard" or "/home/profile" and always keep the generic path handlers at the bottom portion like "/" or "/home". Explanation is present on above code examples.

//* our application is running on port 3000.If we we open our browser and run localhost:3000/home , by default it will make a get call to our server from thr browser. and when we search any url from the browser it makes a get call.We can open the inspect tool in the browser and check that in the network tab.
//* get, put ,post,patch these are http methods we have already learn it
//* But how can we a make a post or put or patch call?because by default browser always makes a get call.
//* though we can use the browser console to to make a fetch() call , but that's the worst way to test apis.
//* So to test our apis, we will use a software called Postman so let's install its fee version.
//* now after installing their software, we have to create a workspace, so for every project we can create a workspace, it is separate for our project dev connect.
//* now inside it we have to create a collection , collection is just like a folder , like inside a folder we keep multiple file , similarly we can keep multiple apis inside a collection, We can also create multiple collections , like we have user apis so we can make a use collection , for admin related apis we can make admin collection.it is like creating a folder
//* inside  , above the collection click the plus button and and choose http, because we want to make http call. then in the right side choose get method and enter our url localhost:3000/home and click on send and we will see like browser it made a api call to our server and the response "hello from the home page" is printed.
//* So we made our first api call from postman.
//* we can make get /post/put /patch call as needed.
//? right now even we make a post call to localhost:3000/hom , surpassingly it will give us the same response "hello from the home page" but why?

//*Because we have used the app.use() method , this use() method will be triggered by all the http methods, that;s why even we made a post call this was triggered and sent the same response.

/*
 *this use() method will be triggered by all the http methods
 *app.use("/test", (req, res) => {
 * res.send("testing is good😉😉😉");
 *});*/

//* but we want to do different things for methods like if we make GET /profile we should get the profile data, if we make post call - POST /profile, we should save the user's data to the database , and for DELETE /profile ,its should delete the profile from the database.

//* So instead of app.use() we have to use different methods to handle different http methods differently.

//! this use() method will respond to all http methods
//! So we should never keep it on the top  because it will be triggered by any http method , so even if we use it we should it below of all other other methods.and wvn the first portion of the any path matches with this path this will be triggered so keep it below if you are mentioning a path which can trigger it. but it does not happen with other http methods like http.get(), http.post() ,patch, put, delete. it only happens for use().
// app.use("/user", (req, res) => {
//   res.send("testing is good😉😉😉");
// });
//* Different route handler methods(get/post/patch/delete)
//* this get method will be only triggered by GET call
app.get("/user", (req, res) => {
  res.send("firstName:`anupam`,lastName:`boral`");
});

//*this post method will only respond to POST call
app.post("/user", (req, res) => {
  res.send("your data is saved inside the database");
});

//*this put method will only respond to PUT call
app.put("/user", (req, res) => {
  res.send("your full profile is updated");
});

//*this patch method will only respond to patch call
app.patch("/user", (req, res) => {
  res.send("you first name is updated");
});

//*this delete method will only respond to delete call
app.delete("/user", (req, res) => {
  res.send("your profile is deleted");
});

//* this use method will respond to all http methods(so always keep it below of other methods)
app.use("/test", (req, res) => {
  res.send("testing is good😉😉😉");
});

//* using dynamic routes and  accessing dynamic route params from the code
//* So when here we mention the path , we use user/:userId , here using colon /: means it is a dynamic route , so in the in the place of /:userId the user can pass any parameter from the browser like user/7777 so here 7777 is the userID parameter passed by the user.and we can mention multiple dynamic routes like /user/:userId/:name/:pass.
app.get("/user/:userId/:name/:pass", (req, res) => {
  //* whatever parameter the user pass from the browser/postman we can access that here using req.params, like the user is making req to the url localhost:3000/user/7777/anupam/testing. So the params wil be like below:

  console.log(req.params); //*{userId: '7777',name: 'anupam',pass: 'testing'}
  res.send("firstName:`anupam`,lastName:`boral`");
});

//*In express 5, the characters ?, +, *, [], and () are handled differently than in version 4, please review the migration guide for more information.basically in the advanced you can't use it inside the route  handlers path.in the browser while doing the query we can use them but inside the handler function path we can't use them.
//* accessing query params
app.get("/user", (req, res) => {
  //* if the user do a query from the browser like /user?userid=101&pass=testing , the part after the ? is the query parameters and if we want we can access the quey params here using req.query.
  console.log(req.query); //*{ userid: '101', pass: 'testing' }
  res.send("firstName:`anupam`,lastName:`boral`");
});

//! Season 2 - Episode - 05 - Middleware and error handlers
//* Inside the route handler function, we were sending the response using res.send(), but if we don't send any response, then it the browser/postman will just wait and after some time trying the timeout happens and it will show timeout ,got no response, owe should always send some response from route handlers.
//? we can write multiple request handlers for the same path. To do that we can use a third parameter of the get method, which is another route handler function , if we don't send any response from the first handler, will it go to the second handler automatically?
//* No , the request will still hangout ,and not go to the the second handler
//* to send the request to the second handler , in the first handler function we have tpo mention another parameter , named "next", and call it inside the first handler, only then it will go to the second handler, this next is a function given by express.then only response 2 will be sent to postman/browser.

//? but what if we send the response from the first handler and below that also call the next() function, will it send 2 responses, will it go to the second handler?
//* first it will send the first response then because we we called the next()  function it will go to the second handler , and print the console.log but then when sending the second response it will throw an error, as javascript waits for none , so it started to execute the second handler because next() was called , but but when postman send request to our server a socket connection was made , and as soon as we sent the first response the socket connection was closed , that's why when our server will try to send the second response it will through an error that , the response has already sent. the error will be shown in the terminal - (Cannot set headers after they are sent to the client).

//? but what if in  the first handler first we call the next() and below that we we send the first response , then which handler's response will be returned because we  are retuning the response from the second handler also?
//* So to understand it we have to know how js code gets executed inside v8 engine's call stack, when js engine starts to execute the first handler it will first print the console log in our terminal, then in the next line it sees a next(), So a new function execution context will be created for second handler, and pushed on top of the first handler's function execution context , now second handler's code will start to execute line by line, so first console.log route handler2 will be printed then in the next line it will send the response - response 2 . then as the second handler's code is fully executed it will move out of the call stack and call stack comes back to the first handler's function execution context where it left( on next() function call) and starts the execution from the next line and it sees in the next line we are trying to send the first response,  but as the response is already sent while executing the second handler , so it will throw an error "Cannot set headers after they are sent to the client".
/*
app.get(
  "/user",
  (req, res, next) => {
    console.log("route handler 1");
    //  res.send("response 1");
    next();
    res.send("response 1");
  },
  (req, res) => {
    console.log("route handler 2");
    res.send("response 2");
  }
);
*/
//* we can use as many route handlers as we want for a single path
//* next method is available for all of the http methods like - use(), get(), put(), post(), patch(), etc.
//* some more edge cases explained through below example
//? what if we have three route handlers , and from first and second route handler we have not sent any response and called next() in both , in the last handlers again we have not sent any response and again called next()?
//* in the postman , we will get an error "Cannot GET /profile", because in the last handler , when we are calling next() , express is expecting another route handlers after it , but we have not written any handler after the third handler, that's why , as it can not find the next route handler function after next() inside the third handler , it is returning us "Cannot GET /profile" error.
//* So express say , make as many route handlers you want to , but at the end the response should be sent, so if we create another route handler and return response from their it will word fine.
//* if in the third handler , we would not call the next() and also not returned the response then , the request will hang in the third handler , and no response would be sent, and after some time connection timeout would be shown in the postman/browser.
/*
app.use(
  "/profile",
  (req, res, next) => {
    console.log("route handler 1");
    next();
  },
  (req, res, next) => {
    console.log("route handler 2");
    next();
  },
  (req, res, next) => {
    console.log("route handler 3");
    next();
  }
);
*/
//* another way of writing multiple route handlers
//* we know in every http method , the first param is the path, then after that we can mention as many route handlers as we want , but another way is we can put all route handler functions inside one array and just mention that one array like below.
/*
app.get("/address", [
  (req, res, next) => {
    console.log("route handler 1");
    next();
  },
  (req, res, next) => {
    console.log("route handler 2");
    next();
  },
  (req, res, next) => {
    console.log("route handler 3");
    next();
  },
  (req, res, next) => {
    console.log("route handler 3");
    res.send("ye duniye hi abhi ka address hai😋😉😉");
  },
]);
*/
//*even we can mix both , so in a single http method , we can use separate function and also a array of route handler functions, like below
/*
app.get(
  "/address",
  [
    (req, res, next) => {
      console.log("route handler 1");
      next();
    },
    (req, res, next) => {
      console.log("route handler 2");
      next();
    },
  ],
  (req, res, next) => {
    console.log("route handler 3");
    next();
  },
  (req, res, next) => {
    console.log("route handler 3");
    res.send("ye duniye hi abhi ka address hai😋😉😉");
  }
);
*/
//* we can even create independent route handlers for the same path iit will work exactly same but remember order matters because js engine will run the code line by line one after another.
/*
app.get("/address", (req, res, next) => {
  console.log("route handler 1");
  next();
});
app.get("/address", (req, res, next) => {
  console.log("route handler 2");
  res.send("ye duniye hi abhi ka address hai😋😉😉");
});
*/
//? but why do we need so many request handlers for a /path?
//* the reason is middleware
//*! Middleware
//* actually till this time, we were calling all the handler functions as request/route handler , but when we write multiple handler functions, and in the last handler we send the response , that specific handler which is sending the response is actually called the request handler or the route handler and the other handlers before it ,are called middleware.let's understand using an example. in the below example we have 4 handler for same /address path, so when a request comes and it matches the path it will go through 1st then 2nd then 3rd handler ane after another line by line and finally in the 4th handler it is sending the response, so the 4th handler is actually the route/request handler and the 1st,2nd, 3rd handlers are called middleware, so we a request comes to an express application it will check the matching path , then go through all middlewares and finally from the route handlers it sends the response. So these words middleware , route handler ,request handler are the lingo used in the industry , actually all these are just functions but developers use these words to explain concepts.
/*
app.get("/address", [
  (req, res, next) => {
    console.log("middleware 1");
    next();
  },
  (req, res, next) => {
    console.log("middleware 2");
    next();
  },
  (req, res, next) => {
    console.log("middleware 3");
    next();
  },
  (req, res, next) => {
    console.log("actual request/route  handler");
    res.send("Response :- ye duniye hi abhi ka address hai😋😉😉");
  },
]);
*/
//*Tasks performed by middleware:
//*Execute any code.
//*Make changes to the request (req) and response (res) objects.
//*Call the next() middleware function to pass control to the next function in the stack. If next() is not called, the request will be left hanging unless the current middleware ends the response cycle.

//? lets see some use cases of having middleware:-
//* suppose we have we have two route handlers/apis for two paths very similar, like /admin/getUserData and /admin/deleteUserData.
//* as this is related to admin we have to verify/authenticate if the user is admin or not by verifying the token sent by the client's browser.
//* So we can write authentication check logic for both paths , but is it a good way to write the code for same thing twice? No , and that's where middleware come into picture, so instead of writing both like this
/*
app.get("/admin/getUserData", (req, res, next) => {
  //* admin auth checking
  console.log("admin auth is getting checked");

  const token = xyz; //*fake data , in real world token comes with the request.body
  const isAuthorized = token === "xyz";
  if (!isAuthorized) {
    res.status(401).send("Unauthorized request");
  } else {
    res.send("User data");
  }
});
app.get("/admin/deleteUserData", (req, res, next) => {
  //* admin auth checking
  console.log("admin auth is getting checked");

  const token = xyz; //*fake data , in real world token comes with the request.body
  const isAuthorized = token === "xyz";
  if (!isAuthorized) {
    res.status(401).send("Unauthorized request");
  } else {
    res.send("User is deleted");
  }
});
*/
//* see above we have written the same auth code twice for two handlers .
//*but if we use middleware then we don't need to do it ,see how below(we can use get() also  but normally to handle all kind of http methods we use use() but using get() i8s also fine)
//* as /admin is generic so it will be triggered for both /admin/getUserData and /admin/deleteUserData as the first portion is same, and here in this middleware we are only checking the auth and ut will check auth for both cases ,so we don;t need to write the same auth code twice, and if the auth is verifies then only the next() function will be called and it will move to actual route handler, unless it will send the response "Unauthorized request" with the status 401.
/*
app.use("/admin", (req, res, next) => {
  //* admin auth checking
  console.log("admin auth is getting checked");

  const token = xyz; //*fake data , in real world token comes with the request.body
  const isAuthorized = token === "xyz";
  if (!isAuthorized) {
    res.status(401).send("Unauthorized request");
  } else {
    next(); //*this will be only called if the auth is verified
  }
});
app.get("/admin/getUserData", (req, res, next) => {
  //* this route handlers will be only called when the auth is correct because of above middleware we written for auth.
  res.send("User data");
});
app.get("/admin/deleteUserData", (req, res, next) => {
  //* this route handlers will be only called when the auth is correct because of above middleware we written for auth.
  res.send("user is deleted");
});
*/
//* this is the simplest answer why we need middleware.
//? we can even use app.all() instead of app.use() both has subtle difference, we can learn that just search on google app.use() vs app.all().
//? and also learn about the https status codes.like 404, 200

//* and in the industry , they simplify it more , so they keep the middleware function inside another folder and require the middleware from their. like below -
const { adminAuth } = require("./middlewares/auth.js");
app.use("/admin", adminAuth);
app.get("/admin/getUserData", (req, res, next) => {
  //* this route handlers will be only called when the auth is correct because of above middleware we written for auth.
  res.send("User data");
});
app.get("/admin/deleteUserData", (req, res, next) => {
  //* this route handlers will be only called when the auth is correct because of above middleware we written for auth.
  res.send("user is deleted");
});
//* For admin we have two apis -getUserData,deleteUserData, so we did it like above, now suppose we also have to authenticate the user , and for the user we just have one api - user. So inside ./middlewares/auth.js , we can can create a middleware for user and require it here and use it like below:-

//* now using this web server we have to listen for incoming requests on some port , so any body can connect to us using that port.
const { userAuth } = require("./middlewares/auth.js");
app.get("/user", userAuth, (req, res, next) => {
  res.send("userData");
}); //* see how middleware can simplify our work and help to write clean code.as we can write multiple request handler inside  http methods, it makes our code more clean and easy to understand.
//* this also helpful when we have some api which does not need authentication,like if we have a sign up api, so if the user is signing up first time then we would not need any authentication, for that api, so we can easily right that without using the middleware and as the in the above user api , we need auth so we mentioned it internally,, so above middleware would not interact with this new signup api.
app.post("/user/signup", (req, res, next) => {
  res.send("user is registered successfully");
});

//! handling errors
//* inside a route handler whenever we are making a database call we should always write that inside a try{}catch{} block.
//* but if there is still some unhandled error then we can catch them using another feature given to us by express, we have already seen if we write app.use("/") , then it will trigger for all the routes, so we can also use to handle errors, and express js has designed the this app.use() so much dynamically, that if we mention only two parameters it will treat first as request and second as response like this: -
//* app.use("/",(req,res)=>{})
//* if we mention only three parameters it will treat first as request and second as response and third as next like this: -
//* app.use("/",(req,res,next)=>{})
//*if we mention four parameters it will treat first as error and second as request , third as response and fourth as next like this: -
//* app.use("/",(err,req,res,next)=>{})
//* but here the order matters here, so if you are mentioning four parameters and always you have mention the err first ,unless suppose if you mention next as first and error as last then next will behave like error and error will behave like next , so be mindful.
//* so we use this app.use("/",(err,req,res,next)={}) to handle error gracefully, because if we don't do it then if any error happens in any of the routes than it can throw weird errors which can be understandable by us developes but not the client, like cart is defined , or it can expose the api urls etc.to test this we can create an api and throw a error using (throw new Error("error happened"))), so we will catch the error and we  will handle it like this
app.get("/userData", (req, res) => {
  throw new Error("error happened");
  res.send("user"); //* as we are throwing error above so this will not be executed and it will jum to next route handler , and below error handler will be triggered
});
app.use("/", (err, req, res, next) => {
  //* we can also log our error here so we can be notified
  if (err) res.status(500).send("Something went wrong");
}); //*and always heep this error handler below all apis/route handlers and use try catch blocks to catch errors, because route handlers are read line by line from top to bottom, so order always matters

//* to run above code don't forget to call app.listen(3000) to listen to the requ7est
//! Season 2 - Episode - 06 - Database,Schema & Models - Mongoose
//* remember in one of the previous videos we created a cluster inside mongodb atlas. and from the mongodb compass app we connected to the cluster using the connection string , then created a collection and then created documents inside that collection from our code.
//* now we have to connect this express application to our cluster
//* now first of all we to create a config folder , so we will create a config folder inside our src folder, so whatever configuration we need to do inside our application we will do inside it.Inside it we will create a file named to database.js to write the logic of connecting to our database.To connect to our database we will be using a important npm library named "Mongoose".
//* Because This is a standard of building the node JS applications right whenever you are connecting your node js application to your Mongo database mongoose is a very elegant very amazing library to create schemas to create models and to talk to your Mongodb database right so we are going to use this library it is very very amazing and it gives you some boilerplate also code also right you can copy this code you can also go and read the documentation the documentation of Mongoose is really very very nice right there are some websites there are some libraries and packages where the documentation is not really good but mongoose has a very good documentation .

//* now first of all let's install the mongoose library using the command - npm i mongoose

//* now let's require mongoose
const mongoose = require("mongoose");

//* then to connect to ur cluster we will use mongoose.connect("connection string") and pass the connection string and as it returns a promise and tells us if the connection is successfully established or not, so will keep it inside a async function and use await to handle the promise.

const connectDb = async () => {
  //* it is connecting to the namaste node cluster, if we want to connect to database then at last after the / we have to mention the database name.
  await mongoose.connect(
    "mongodb+srv://anupamboral:KYExuJH0QyiEI6kg@namastenode.cw4mdf8.mongodb.net/"
  ); //* from mongo compass or our cluster we can copy the connection string
};

//* now we can call the connectDB() and it will return us a promise so we can handler the it using .then() for successful connection and .catch() for some error
/*
connectDb()
  .then(() => {
    console.log("successfully connected to the database cluster");
  })
  .catch((err) => {
    console.error("cannot connect to the database");
  });
 */
//! now all this code we have written inside database.js , but the entry point for our app is app.js , so to run this file we have to require this database.js inside app.js .And if we run our code using terminal and see it is working fine and connection is established then it's good . but now we will comment out this connectDb() call  from here this database.js. Because we are listening to requests inside app.js. So when someone requesting to our application , at that database connection should be already established then only our backend application can retrieve any data from the database and respond to the client. So we should only listen to the requests once the database connection is successfully established. So to do that we will export this connectDb() function and import it inside app.js. then in the below portion we will call this function . and we know it will return promise. So we can handle that using then() and catch(). .then() will be only executed when the connection is already established. so we will call app.listen inside the .then method, so we can ensure we are listening to the request once the db is successfully connected.and this is the right way - first connecting to db successfully then listen to the requests.

//* lke this
/*
connectDb()
  .then(() => {
    console.log("successfully connected to the database cluster");
    app.listen(3000, () => {
      console.log("server is listening successfully on port 3000");
    }); //* using the listen method we listening to the incoming requests on port number 3000, the first parameter of this listen method is the port number , now there is second parameter which is a callback function, and this will be called when our server is up and running.
  })
  .catch((err) => {
    console.error("cannot connect to the database");
  });*/

//* now we will define our user Schema, we have already discussed that we will have different collection , and one collection will for users.It will store data/documents related to users.
//* So we have to define a user schema for the use collection.
//? what is schema?
//* inside schema , we define that what fields every document will contain inside a collection. And what will be the typeof values for every field , it is like defining whats properties every object will have and what will be the typr of every property inside the object. So inside user collection we will have the data for the user , so we will have multiple user documents, and we are defining what will be the fields/properties for each user document ,and what will be the typeof values for each field like string or number etc. we can learn about schema inside the mongoose documentation.
//* first of all to create a user Schema , we will create a models folder inside src folder, inside this folder we will create a file names user.js. inside this file we will definer the schema for the user collection.
//* it is like we are creating a model for the user collection, so we have named folder model.
//* inside the user.js folder we will define the schema for users.
//* here we have to require mongoose
const mongoose = require("mongoose");

//* to create  schema we have to call a method on mongoose named mongoose.Schema({}), inside that we can write a object where we can write the schema for our users, for each field we have to define the type f the value of each field/ property inside a object.
const userSchema = mongoose.Schema({
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  emailId: {
    type: String,
  },
  password: {
    type: String,
  },
  age: {
    type: Number,
  },
  gender: {
    type: String,
  },
});
//* this is how we create a schema, this tells us what information we are going to store in the database related to the user.these fields will be present inside the user collection.
//? How will we use this schema?
//* to use this schema , we have to create a model, we will call mongoose.model("ModelName",Schema) , and as first argument we will pass the name of the model , then as second argument we will pass the schema we have created.And store this model as value of a constant,as this is of users so we will name the constant - "User". and it is a convention that we should start the name with capital letter , because this model is like a class, as we create many instances from a class, similarly from this model , we will create many user documents inside our user collection, so that's why will start the name off the model constant with capital letter like we do for naming classes.then we will export this model so we can use it.
const User = mongoose.model("User", userSchema);

//* module.exports = User;

//* now we can create our apis to add a user into our database
//* now inside our app.js , we will create a api to create a user into our database, so we already know that if we want to create a user then post method is best for that because we want to create some new data/document inside the database.

//* now inside app.js we have to import this model because here in app.js we will use it while creating users.
//* importing the User model
const User = require("./models/user");

//* now we can create our apis to add a user into our database
//* now inside our app.js , we will create a api to create a user into our database, so we already know that if we want to create a user then post method is best for that because we want to create some new data/document inside the database.
app.post("/signup", async (req, res) => {
  //* a sample user data
  const userObj = {
    firstName: "Virat",
    lastName: "Kohli",
    emailId: "virat@kohli.com",
    password: "virat@123",
  };

  //!creating instance from User model
  //* now we want to add this data to our user collection inside the database, so to do that we have to create a instance of the User model, first of all we have to import the User model.now using the User modal we can create a new user , like below(similar to creating a instance from a class)
  const user = new User(userObj); //* now we have created a new user using the above data abd the User model.In technical language we rae creating a new instance of the User model

  //* whenever ever saving some data to the database or reading some data from the database we should always wrap that operation inside try{}catch{} and always handle errors inside the catch block otherwise your api will show always successful response but you data might not be save due to some issues so always use try{}catch{} to handle issues.

  try {
    //! saving the user instance inside the database using .save() method
    await user.save(); //* as user is a instance of a User model and when we call .save() on the user instance it will be saved to the database. and this method call returns a promise so we have to use async await to handle it.
    //* this will save the user but to ensure we have successfully saved to user to the database we should always send some response to the client.
    res.send("User added successfully");
  } catch (err) {
    res.send(400).send(`Error saving the user:-${err.message}`);
  } //* status code 400 represents bad request , and we are using it here because we are sending request to the server to save the user data and if the request fails then we can use to 400 status code as it represents bad request.
});

//* this will successfully add the user

//! important notes for automatically adding database name , collection name , _id field and __v field.
//* So inside the mongodb cluster we did not created separate devConnect database , instead we just mentioned  devConnect at the last portion of the connection string  inside database.js. and now whenever we will connect to the database using our code like posting some data , it will automatically make a database named devConnect inside the cluster. and we did not even created any collection named user as we did not event created the database, but as we have created a User model and using the User model's instance we created user named instance and using .save() method when pushed it , mongodb automatically created users named collection and pushed our user document inside that users collection.
//* the sample data we pushed , mongodb created a document using that data and also added a unique oject Id automatically and also added __v itt means version. So we should never change _id by ourself and let mongo db handle it, and also whenever we update some field from a document mongodb update the the version __v , so we should change __v 's value by ourself.and we can manually upload the id with the data but there is no need to do it as mongodb handles it by itself.

//! Season 2 - Episode - 07 - Diving into apis
//* till now we are using sample data to save the user to the database, so we were manually creating the user object here inside our api, then using postman we were making post call to our signup api, and saving that manually typed data to the database.
//* But ideally , the user should fill up the the data on the client side on a sign up form then make the post api call to our sign up api,and express server should receive the request with  data entered by the user dynamically. because then we don't need to write the data manually by ourself. Different users can dynamically enter different kind of data and make a post call to our api to save them as user.

//* Nowadays developers use json(javascript object notation) format, to send data from the client side to server side, previously xml format was widely used, but now developers prefer to use json to interchange data.
//* below we can understand difference between js object and json.

//!Difference between js object and json(javascript object notation)
/*
* JSON (JavaScript Object Notation) and JavaScript objects are related but * distinct concepts. 
* JavaScript Object: 
* 
* • A JavaScript object is a fundamental data structure within the JavaScript * programming language. 
* • It is used to store collections of data and more complex entities. 
* • JavaScript objects can contain various data types, including strings, numbers, * booleans, arrays, other objects, functions, and special types like undefined or * Date objects. 
* • Keys in JavaScript objects can sometimes be unquoted (if they are valid * identifiers) and string values can use either single or double quotes. 
* • JavaScript objects are directly usable in JavaScript code and can have methods * (functions associated with the object). 
* 
* JSON: 
* 
* • JSON is a text-based data interchange format, inspired by JavaScript object * literal syntax. 
* • It is a language-independent format used for storing and exchanging data * between systems, particularly over the web. 
* • JSON is a string representation of data, not an actual object in a programming * language until it is parsed. 
* • JSON has a stricter syntax than JavaScript objects: 
*	• All keys and string values must be enclosed in double quotes. [1]  
*	• It only supports a limited set of data types: strings, numbers, booleans, *null, objects, and arrays. Functions, undefined, and special JavaScript objects *like Date are not allowed in standard JSON. 
*	• Comments are not allowed within JSON. 
*
*Key Differences Summarized: 
*
*| Topic:-------- JavaScript Object v/s JSON  
*| --- | --- | --- |
*| Purpose :- In-program data structure | Data interchange format  

*| Data Types :- Supports all JavaScript types (including functions, undefined) | *Limited to strings, numbers, booleans, null, objects, arrays  

*| Syntax :- Keys can be unquoted, single/double quotes for strings | All keys and *string values must be in double quotes  

*| Functionality :- Can contain methods (functions) | Cannot contain functions  

*| Nature :- An actual object in memory | A string representation of data  

*| Language Dependency :- Specific to JavaScript | Language-independent  

*/

//? How will we send data from client (browser/postman) side to server side?
//* from postman when we make a request/api call to a api, we also send a a request body and headers, using the request body we can send the data entered by the user . and we will send the data in json format.
//* to send some data using request body using postman, inside postman we have find "Body" written below the the pai url in postman, then select the Body option then we will se many options to send data like- form-data, raw, binary , graphQL,etc. But we want to send the data using json format.
//*so among these options we can choose raw . after choosing raw again there are many options inside raw like - text, javascript, json,html,xml. As we want to send the data using json , we will select json option among them.and now in the below portion we can write json which we want to sent with the request. if we directly  paste our sample js object in place of json it will not work, becuase the json format is different, in json format even the keys should be inside  "" . and after the last field we can't write .
//* so this is js object
/*
 *{
 *    firstName: "Rohit",
 *    lastName: "Sharma",
 *    emailId: "rohit@sharma.com",
 *    password: "sharmajikabeta",
 *  };
 */
//* this is json
/*
 *{
 *    "firstName": "Rohit",
 *    "lastName": "Sharma",
 *    "emailId": "rohit@sharma.com",
 *    "password": "sharmajikabeta"--//* here we can't write like objects only after this last field.
 *  };
 */

//! dynamically receiving the data from the user and saving that to database
//* so inside postman , in he body , we chosen raw then json, then we wrote the data using the json format.like above. now it's the time to send the request to our express server.
//* but how will we see see this request body in our code/express server?
//* so while creating the signup api, we mention a parameter in the request handler , that is req(request), so inside the request handler if we print this like console.log(req), we will see a large object. this is the request send by by postman and express has converted it to a object and  showing us in the console as we are printing it.
//* but we can't access the json from this req (request) object directly , even if we print console.log(req.body), it will give us undefined ,because it express js can't read json, that's why it is giving us undefined.
//* So we need a way to get the json from the request body then convert it to normal javascript object then again put it inside the req.body , so we can easily access it.

//! importance of express.json() middleware. (also available in express documentation)
//* so to convert the json to js object , we will use a middleware given to us by express.js. and that's express.json(). this middleware can take the json from the req.body then convert that to js object then again put that inside the req.body and we can then easily access it form the request body.
//* to use it we can just put it inside app.use(express.json())) , like we cerate middlewares, as we know app.use() work for all methods when we specify any path as first arg, but if we don't even specify any path then it will work for all requests with any path . so that's why we are using it without any path so it can work for any api. like this :- app.use(express.json()))
//* we need to put this above other apis so what ever request comes with json data get converts to the js object and we can easily access the data inside the request handlers req.body.
//* as soon as we added the middleware above the signup api , now we can easily access the the received data from the client inside our terminal just by printing it.
//* because of this we can now dynamically receive the data from the client side and use that data to create a instance of User model and save the new user to database.

//* Code
/*
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
  const user = new User(req.body); //* present in mongoose doc ,go to model => Model()

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
app.patch("/user", async (req, res) => {
  const data = req.body;
  const userid = req.body.userId;

  try {
    const user = await User.findByIdAndUpdate(userid, data, {
      returnDocument: "after",
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
app.patch("/user", async (req, res) => {
  const data = req.body;
  const userEmail = req.body.emailId;
  console.log(data);
  try {
    const user = await User.findOneAndUpdate({ emailId: userEmail }, data, {
      returnDocument: "after",
    }); //* first param is the id we received from request, we can also write it as {_id:userId} or just userID as its shorthand, the second param is the the updated object , we have also received it from the request, it contains the field with updated data which the user want to update in our database.the third param is options, it is optional to mention, so in the mongoose docs Model.findByIdAndUpdate() we can see many options available in the doc, there is a option returnDocument , by default it is set to before which means it returns it will return the document(user) before update. but if we change it to after then it will return the document after update.
    console.log(user);
    res.send("user updated successfully");
  } catch (err) {
    res.status(400).send("Something went wrong" + err.message);
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
  });*/

//! Season 2 - Episode - 08 - Data Sanitization & Schema validation

//* Sanitization at data base level
//* in this lesson we will learn about data sanitization,so right now anyone can upload trash data to our database using our apis, like wrong fake names, or gender that don't even exist or wrong email or capitalized email, wrong age ,etc. So before uploading the data to the database we should perform some validations on the data before saving into database, this process of sanitizing the data is called data sanitization.

//* so we will perform strict checks before saving the data into database, if checks are not passed we will not insert data into our database.
//* So first of all we will add validation checks inside the schema we have created, so our user schema.

//* To find , how we can add validations to our schema, let's open mongoose documentation, and go to schemaTypes and scroll to all schema Types
//* so we can see under this heading that which flags , basically schema types we can add to a field.
//! required flag
//* like some fields should be mandatory , to sign up a user , like firstNAme, email , password.
//* So inside these fields we can add a required flag, its values will be a boolean or a function which returns a boolean. So if we add this flag to a field then it becomes mandatory to add this field data while signing up the user , basically when the user is first time registering him/her using our post /signup api.
//* So let's so to oue User Schema present inside models folder user.js file, and for firstName , email, password add this required flag.
//* like this
/*
 * firstName: {
 *  type: String,
 *  required: true,
 * },
 */
//* after adding this required flag and setting value to true, the user has to provide a firstName while signing up , otherwise mongoose will not allow insertion of document into the collection in database.
//* we have added this flag for email, firstName and password.
//* So if we try to insert a user without emailId then it will through am error :- User validation failed: emailId: Path `emailId` is required.

//! unique flag
//* another check is two users should not have same email id. So every users need to have a unique email id. and to add this validation we can add another flag named "unique". And its value can be a boolean value.see the same schema Types page in the mongoose doc, and go to indexes. present below all schema types. If we add this unique flag to a field and set its value to true . then two users can't insert same email ids. so let's add this flag to email field in our schema.
//* see doc here :-https://mongoosejs.com/docs/schematypes.html#indexes
//* like this:-
/*
 *  emailId: {
 *    type: String,
 *    required: true,
 *    unique: true,
 *  }
 */

//* if we try to insert a user using a already inserted email id then it will through an error,like :- E11000 duplicate key error collection: devConnect.users index: emailId_1 dup key: { emailId: "kirta@loh.com" }

//*
//!default flag
//* first we will add some more fields to save more data about the user like photoUrl,about, skills.and a user can have multiple skills , so the type of the skills field will be array of strings, the we can write skills like:-
/*
 * skills: {
 *   type:[String]
 * }
 */
//* to provide a default value of any field we can use a default flag, its value can be Any type or function,it sets a default value for the path/field. If the value is a function, the return value of the function is used as the default.see doc here:- https://mongoosejs.com/docs/schematypes.html#all-schema-types.
//* we can use this flag like this:-
/*
 *  about: {
 *    type: String,
 *    default: "This is the default about of the user",
 *  },
 */
//* now if we add a user with adding any about field then this about default will be automatically added.

//* now if we add a user without any about still it will add the about field by default.like this
/*
{
*  "_id": {
*    "$oid": "68fdbe05b84fc0a869a6fc0e"
*  },
*  "firstName": "alia",
*  "lastName": "bhat",
*  "emailId": "alia@bhat.com",
*  "password": "alia@123",
*  "about": "This is the default about of the user",
*  "skills": [],
*  "__v": 0
}*/
//* and also we can see that it added the skills, but we did not add any skills, but mongoose added this field, because it is a default behavior , so when ever we set a fields type to array, then by default when we create a document it creates that field by default with empty array, so it is not created by mistake.That's why it skills field was added with empty array,to keep empty space for its values.
//* let's add also a default image for the photoUrl

//!lowercase flag
//* suppose the user enters the email like this - YAShdas@gmail.com but we want all our email ids in lowercase format so to do that we can mention a lowerCase flag. its value can be a boolean value . see the doc here-https://mongoosejs.com/docs/schematypes.html#string-validators.
//* we can use this in the schema of email field like this and whatever email user upload will be converted to lowercase.
/*
 * emailId: {
    type: String,
    required: true,
    unique: true,
 *   lowerCase:true
  },
  */

//! trim flag
//* suppose as user uploads a email with spaces like "     alia@bhat.com   " then if this email already exist still mongoose will treat as different email as this so much spaces, and if this email did not existed and the user is uploading it first time then it wi;ll be saved with this much spaces. So to avoid this problem we can add trim flag in our email field schema, so even the user uploads any email with spaces it will trim the spaces automatically.its value can be boolean. we can see the doc - https://mongoosejs.com/docs/schematypes.html#string-validators
//* we use it like this :-
/*
  *emailId: {
    type: String,
    required: true,
    unique: true,
    lowerCase: true,
   * trim:true,
  },
  */

//! minLength and maxLength flag
//* we can add these flags for strings to add a minimum and maximum length.these flags can have a number as value.
//*like this:-
/* 
  firstName: {
    type: String,
    required: true,
  *  minLength: 3,
  * maxLength:50
  },
  */
//! min and max flag
//* we can add these flags for Numbers to add a minimum and maximum value.these flags can have a number as value.we can use it like this:-
/*
  age: {
    type: Number,
   * min: 12,
   * max: 100
  },
  */

//! adding a custom validation function
//* suppose we want that the user's gender should be only male, female,others.so we can make a custom validator function for that.
//* see doc here - https://mongoosejs.com/docs/schematypes.html#all-schema-types
/*
  gender: {
    type: String,
*    lowerCase:true,//* this flag is important because if the user uses uppercase then our validation will mot work so using this flag is important
*    validate(value) {
        //* if the belows arrays values does not include user's inserted value then throw an error
 *     if (!["male", "female", "others"].includes(value))
 *       throw new Error("gender data is not valid")
    }
  },
  */
//! runValidators option
//* but even we add this validation, this validation check will be only performed when the user is first time creating his profile, basically first time uploading his data, but if the profile is already existing and he tries to update it then this validation will not work, because by default validation checks are turns off while we update through put or patch methods.
//* if we want to perform validation checks while updating then we have to manually turn on them
//* so to turn validation for updates, we need to got to app.js , and go to app.patch functions or put functions , inside the api we have used either findByIdAndUpdate() or findOneAndUpdate() methods on the model, in this methods as third parameters we can pass different kind of options , so to run validation while updating here in the options we have to mention one option "runValidators".it can have a boolean value. So if we set its value to true the the validations will be alo performed whenever we update.See here in docs :- https://mongoosejs.com/docs/api/model.html#Model.findOneAndUpdate()

//* we can use it like this
/*
 const user = await User.findOneAndUpdate({ emailId: userEmail }, data, {
      returnDocument: "after",
    * runValidators: true,
    });
    */

//! TimeStamps
//* if we want to add time stamps automatically added for every document, to know when the document was created and when the document was last updated then we can add a timeStamps property with true value  inside a object in to the new Schema function as second parameter, and it will automatically add time stamps.See doc here:- https://mongoosejs.com/docs/timestamps.html#timestamps
//* we can use it like this:-
// *const userSchema = new Schema({ name: String }, { timestamps: true });//* in the first param inside object we define field types , and as second param inside a object we  can defined this timeStamp:true to automatically add time stamps.
//* we could also add a new field to manually save the data like:-
/*
createdAt:{
type:Date
}*/
//* but there is no need to do it manually as we can use timeStamps which will automatically handle it.
//* Turning on this timestamps can help us so much, when we will need to filter some user who registered with in a particular time frame , then this timestamps will help us.

//* till now we were doing data sanitization at database level.Now we will learn how we can do data sanitization at api level.

//* So once the user registered their email, in future if they update their email or name, we can't identify the user, so ideally we don;'t want our user to change their email, name, or id other thing they can change like about or skills. so lets implement this api level sanitization , so once the user register they can't change their email or name.
//* we use the patch api which uses the id of the user to identify and update the user, but till now we were receiving the id through the request body, but we also want that the user can't even change the id , so inside the api we will receive the id from the url , so we will make the url dynamic to get the id through it. like this "/user/:userId" and then receive the userId using req.params , like this:-
//*  const userid = req.params.userId;

//* inside the try block of the patch user api we have implemented this like below:-

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

//* Email validation (using validator package from npm)
//* writing a logic to check if the email is correct or not is a hectic thing, we have check if it includes a @ or not, even the extension .com, or any other extension is present or not. So to validate this email and also some other things we can use a library from npm " validate", search it google and find it.
//* this validate library can help us to validate many things like email, url, mongoId, so many things. and this is a very popular library.
//* so to install we have to run the command - npm i validator
//* after installing it, using the methods it provides, we can either implement the email validation at the api level or at database level using the schema.For now, we will implement the validation at the database level using schema.
//* So let's got the schema present in user.js inside models folder. now, in the email field , first we will write a custom validate function, provided by mongoose, we already learnt that when we had written a custom validate function for gender field, so this time we will write the validate function for email field and as parameter we will mention the email, now inside this validate function we will write the logic of email validation, so first of all we have to require the "validator" we installed few minutes ago from npm at the top portion of user.js.
//* now inside the validate function we can use the methods available of validator. To verify email we can use validator.isEmail() function. like this:-
/*
 *validate(userEmail) {
 *        if (!validator.isEmail(userEmail)) {
 *          throw new Error("Invalid email:-" + userEmail);
 *        }
 *      },
 */

//* and we can also validate the photoUrl of the user using validate validator.isURL() method like this :-
/*
 *validate(photoUrl) {
 *        if (!validator.isURL(photoUrl)) {
 *          throw new Error("Invalid url:-" + photoUrl);
 *        }
 *      },
 */
//* we can even check if the entered password is strong or not using .isStrongPassword(str [, options]) method. so the user has to enter { minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1} , only then it will allow the user to insert the password.let's implement it.Like this:-
/*
 * validate(password) {
 *         if (!validator.isStrongPassword(password)) {
 *           throw new Error(
 *             "password must contain  8 characters, at least 1 Lowercase, 1 * Uppercase,1 Numbers, 1 Symbol"
 *           );
 *         }
 *       },
 */

//! Season 2 - Episode - 09 - Encrypting passwords

//* Till now we were directly saving the user's inserted passwords to the database , but that's not a good way, we should always encrypt our passwords before uploading to the database, and upload it in hash format.

//* so to do it we should start it from the api using which the user register them , so the post /sighup api. in the previous lesson we learnt that we should never trust req.body, because attackers can send any malicious data using our api.So let's go inside the post /signup api then. then first we will validate the data coming through the request. but we will no do it directly inside the signup api, instead we will a separate file validate.js inside this we will write a validateSignUpData function which will take the request and validate it. we will create the validate.js file inside a utils folder . So let's create a utils folder inside the src folder.then create a validate.js folder inside utils folder. then inside it we have to create a validateSignUpDate function like this:-
/*
* const validateSignUpDate = (req) => {
*   const { firstName, lastName, emailId, password } = req.body;
* 
*   if (!firstName || !lastName) {
*     throw new Error("Enter valid first name and last name");
*   } else if (!validator.isEmail(emailId)) {
*     throw new Error("Enter valid email address");
*   } else if (!validator.isStrongPassword(password)) {
*     throw new Error(
*       "password must contain  8 characters, at least 1 Lowercase, 1 Uppercase,1 * Numbers, 1 Symbol"
*     );
  }
};
*/
//* and then export it.

//* then require it inside the app.js and use it inside the post /signup api's try block block and pass the req as argument.

//* so now we will learn how to encrypt our passwords.
//! Bcrypt library(for encrypting passwords)
//*this library gives us functions to encrypt/hash passwords and also for validating. we can go to its documentation , search npm bcrypt.
//* now we will install this library using the command - npm i bcrypt.

//* now we will use a function named bcrypt.hash(password,saltRounds), so the first is the text password we want to encrypt/hsh and the second argument is the number of sal rounds, so here salt is basically a random string like "bfi434@^$$%@hehgfojcod" and hash function takes the text password and with this salt it performs numbers of saltRounds we mention as second argument. so as many round it will perform the hash/encrypted password will become more strong and hard to decrypt.A good number of salt rounds is 10, if we use let's say 100 then it will take a lot of time and if we use 1 salt round, then password will nopt be that  once we encrypt it we can't decrypt it .this function returns a promise so always use await. now we will save this hash inside database not the text password which user entered on the client side.
//* and we were directly creating a instance using the req.body, but it's a bad way of creating a instance using directly the req.body.we should always destructure the data first from the req.body then pass it.So now our our sign up api is ready.

//! Lets make a sign in api now
//* this will receive the email and password from the client as request, and then first it will verify if the email exist in our database or not using the findOen method , because the emailId is unique for all users . if the email does not match then we will throw an error.but if the user's email exist iin our database then we will verify the password, so to verify the password we will use a function named bcrypt.compare(userEnteredEmail,hashPasswordFromDatabase), so this function takes the user entered email for sign in as the first param, then as the second param it takes the hash password, so before comparing we have to fetch this hash password from the db. then we can compare the userEmail with the hash password/encrypted password . if it matches then it will return true, and we can send response user logged in successfully , if it fails then it will return false then we can throw error invalid credentials.
//! important:- when we through error while the user entered email does not match any existing email in our db , we should never through a error message like , "user does not exist in our database", also when the password mismatch with user entered password then also we should not throw error like "password is not matching" , because attackers can send fake emails with passwords, so if we through this kind of error then they can know if there entered email exist in our database or not, so we should never tell them if this email exist in our db or not also same applies for password mismatching, it can make our api more vulnerable, So in both of these cases we should throw error like :- " invalid credentials".It's the best practice
//* when ever we are creating a sign in api , we should always use post method, even we are not post some data but still we should use sign up method because(just remember last one CSRF protection):-
//*Security: Login credentials (username and password) are sensitive information. When using a GET request, these credentials would be visible in the URL's query parameters, which can be logged in server logs, browser history, and potentially exposed through "Referer" headers. POST requests transmit data in the request body, making it less susceptible to these exposures.
//*Semantics: POST requests are designed for sending data to the server to create or update a resource, which aligns with the action of submitting login credentials to initiate a session or authenticate a user. GET requests are intended for retrieving data and should ideally be idempotent (making the same request multiple times has no additional effect beyond the first one), which is not the case for a login action.
//*Data Size: While not typically a major concern for login credentials, POST requests can handle larger amounts of data in the request body compared to the limitations of URL length in GET requests.
//! Most important :- CSRF Protection: Using POST for login, especially when combined with CSRF tokens, provides a layer of protection against Cross-Site Request Forgery attacks, which are more easily exploitable with GET requests that can be triggered by malicious websites.

//! Season 2 - Episode - 09 - Authentication ,JWT, & Cookies
//* we know that when the client makes call to the server , a TCP/IP connection is made , and after sending the response every time the connection is closed.

//* Authentication
//* when the user first logs in , before logging in the client does not have the JWT(json web token) , but when the user logs in with correct email and password then the server generates a unique JWT(token), and puts it inside a cookie and sends the cookies containing the JWT to the client(browser), Browser stores this cookie.
//* Now in future , whenever the browser will call any API to  connect with server, the browser always has to send the cookie with JWT(token) and the server will always validate this JWT(token) first then only it will send response to the user/client.
//*Sometimes when the server sends the JWT(token) , it sends with expiry date of that token, after the expiry date of that token, if the client makes a api call then server fails to validate the token so it redirects the user to the log in page , o the user can log in and get a new JWT(token). some sites does not set an expiry of the JWT(token) so for those sites the same token can work forever.
//* see image : -

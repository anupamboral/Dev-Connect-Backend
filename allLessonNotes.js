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
//*Sometimes when the server sends the JWT(token) , it sends with expiry date of that token, after the expiry date of that token, if the client makes a api call then server fails to validate the token so it redirects the user to the log in page , the user can log in and get a new JWT(token). some sites does not set an expiry of the JWT(token) so for those sites the same token can work forever.
//* see image : - src\images\Authentication with JWT.avif

//! how to use cookies (sending and getting back cookies)
//* as we read above , when the user log in , and our server verify , either the email and password is correct not, after validating when it is correct then our server generate a JWT(token) and put it inside a cookie and send it back to the client(browser/postman), then the client stores this token and then whenever it will make any api call to our server (example- to get his profile client calls /profile api) the client also sends the token with the request as a temporary password, and server first verify the token coming with the request and then sends the data and if token does not match then it will redirect the user to the log in page so he logs in gain to get new token.
//* so first inside the login api when the user is validated/verified, then we have to send the JWT (token ) inside a cookie. So we will learn to generate the token a bit later but first of all we will send the cookie to the client using some fake hand written token , so inside the login api when the user is verified , before sending the successful response , we will call a method res.cookie("name", "value"), to send the cookie to the client when the user is verified, it's first argument is "name" so here we can write "token" as we are sending the token using the cookie, and as the second argument pass the value of the token, we can also mention a third value which is options, but this third value is optional, we can read more about this res.cookie() method in the express doc, open the doc and search in search bar "res.cookie" and there we can read more about all of the options we can use. so let's use this method before sending the response inside the log in api.
//* like this:-
/*
*if (isValidPassword) {
      //* generating JWT(token)
//* we have not generate yet so we will use manually types value for the token
      //* sending the cookie
  !    res.cookie("token", "h3g4535%^%*&de34r4jj4998");//* sending the cookie to the client ,it's first argument is "name" so here we can write "token" as we are sending the token using the cookie, and as the second argument pass the value of the token, we can also mention a third value which is options, but this third value is optional
   *   res.send("Logged In successfully");
    }
    */
//* now in the postman whenever we will call the sign in api with correct email password then call the post /signin api , then in the console we will see the signed in successfully message but also something amazing will happen , so in postman below send button, there is cookies button if we click on it then we will see the token we sent through the response using res.cookie() method.

//* we have learnt how to send the cookie to the client.

//* now after user logs in , he will try to call our api , let's say to get his profile he call the get /profile api. So we don not have get /profile right now , so let's first create the get /profile. Because when the user/client/browser/postman call this get /profile api, it will also send back the received token automatically , like a temporary password,as it stored the token after successful log in , now it will send the token automatically when ever it will make any api call to the server, so the server can verify the request.
//* so let's create the get /profile api.
//* after creating the api first to access the cookie, we can access all cookies using req.cookies property. so we can store the cookie inside a constant inside the get /profile api.like this :- const cookies = req.cookies; and below it we will print it, then below it we will send some response , unless postman will go into infinite loop if we don't send back any response , so for naw we can send some fake message like reading cookies.
//* now we call the get /profile api from postman then as we were printing the cookies, so let's go to the terminal of vs code and see if the cookies we received is printed on the terminal or not, surprisingly we will see it has printed undefined. and that's is because express can't parse cookies by itself. Similar to json, remember while building the post /signup api when we sent the json data inside the body, first it could not parse json, because express can't read json directly, that's why it was showing undefined, so we used a middleware express.json() to parse the json. Similarly express can't read cookies directly, so again we have to use a middleware, it is not included inside express so we have to install a library called cookie- parser.
//!Cookie-parser library
//* this library is recommended by express.And the same develops od express library has built this package for parse cookies, so we can use this as a middleware similar to express.json(). We just have to use it inside app.use(), so what ever http method is called by the client to make api call , i it request includes a cookies, this middleware will be triggered and it's cookie will parsed. So this on middleware will work for all api's to parse cookies. We just have to mention it at the top before all apis, as the code execution happens from top to bottom.First let's install this library using:- npm i cookie-parser
//* then we have to require it like :-const cookieParser = require("cookie-parser");
//* then below express.json middleware , and at the top of all apis we will call this middleware.like:-
app.use(cookieParser());

//* now if we send req from client/postman using the get /profile api, we see the cookies is printed in the console, so the token postman sent with the request is now successfully printed in the console inside a object , se we can destructure it to get the token.

//! JWT(tokens) (json web tokens)(check their website:- https://www.jwt.io/introduction)
//*What is JSON Web Token?(just remembering the red lines is enough below)
//*JSON Web Token (JWT) is an open standard (RFC 7519) that defines a compact and self-contained way for securely transmitting information between parties as a JSON object. This information can be verified and trusted because it is digitally signed. JWTs can be signed using a secret (with the HMAC algorithm) or a public/private key pair using RSA or ECDSA.

//*Although JWTs can be encrypted to also provide secrecy between parties, we will focus on signed tokens. Signed tokens can verify the integrity of the claims contained within it, while encrypted tokens hide those claims from other parties. When tokens are signed using public/private key pairs, the signature also certifies that only the party holding the private key is the one that signed it.

//*When should you use JSON Web Tokens?
//*Here are some scenarios where JSON Web Tokens are useful:

//*Authorization: This is the most common scenario for using JWT. Once the user is logged in, each subsequent request will include the JWT, allowing the user to access routes, services, and resources that are permitted with that token. Single Sign On is a feature that widely uses JWT nowadays because of its small overhead and its ability to be easily used across different domains.
//*Information Exchange: JSON Web Tokens are a good way of securely transmitting information between parties. Because JWTs can be signed—for example, using public/private key pairs—you can be sure the senders are who they say they are. Additionally, as the signature is calculated using the header and the payload, you can also verify that the content hasn't been tampered with.
//*What is the JSON Web Token structure?
//*In its compact form, JSON Web Tokens consist of three parts separated by dots (.), which are:

//*Header
//*Payload
//*Signature

//! so the json web token generates a very unique token, using which we can validate user sessions, and we can also send some secret data inside this token.this token has three parts
//!1.header:The header typically consists of two parts: the type of the token, which is JWT, and the signing algorithm being used, such as HMAC SHA256 or RSA.example:-{ "alg": "HS256", "typ": "JWT"}
//!2.Payload:- The second part of the token is the payload, which contains the claims. Claims are statements about an entity (typically, the user) and additional data. There are three types of claims: registered, public, and private claims.This payload can contain some secret data inside it, so using it we can send some secret data using the token.for example the id or   {"sub": "1234567890","name": "John Doe", "admin": true}
//! 3.Signature:-The signature is used to verify the message wasn't changed along the way, and, in the case of tokens signed with a private key, it can also verify that the sender of the JWT is who it says it is.To create the signature part you have to take the encoded header, the encoded payload, a secret, the algorithm specified in the header, and sign that.
//*Putting all together
//*The output is three Base64-URL strings separated by dots that can be easily passed in HTML and HTTP environments, while being more compact when compared to XML-based standards such as SAML.
//! so the jwt token will be separated with three dots , it looks like-eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2OTA0ODJlYmViODBmN2FkMTA2ODc3MTAiLCJpYXQiOjE3NjIwNzUzODF9.XtsLK9RcmwXBEPvf17lPHaN5IICB7xz9RPzze5cofKU

//* using it is very easy , but first we have to install this this from npm , we can also search npm jsonwebtoken . So let's install this library using the command - npm i jsonwebtoken
//* then inside app.js we have require it :- const jwt=require("jsonwebtoken")
//* we can also read the npm documentation , but like we used bcrypt library , it had hash function to hash and and compare function to validate, similarly it has two important functions , first jwt.sign({data:"any secret data"}, "secret password key"). its first parameter is a object where we can store any secret data we want.using it we will send the user id.And the second param is the secret key or password, we can set , this secret will be only known by me,no user or attackers know this key, so they can't know what we saved inside the token, this secret key is very important, this jwt.sign() function is required for generating the token.
//* second function is for verifying the token , so when the user will send us request with the token , then we have to verify the token, so to verify the token we will use the function jwt.verify(token, secretPassword), , first param is the received token and second is the secret password we used while generating the token.with this we can't verify, so this is like a password, which only we know. this method does not return a boolean value instead it return the secret data we hidden. So inside it if we have hidden the user id then we can use it fetch the user from the database
//* So let's go inside our signin api and and generate the token and send it inside the cookies. every time user logs in it generate a different token but it contains the data we sent inside .like this:-
//*const token = jwt.sign({ _id: user._id }, "dev@666Connect"); //*1st param secret data,2nd param secret password
//* sending the cookie
//*res.cookie("token", token);

//* now let's go inside the get /profile api,and verify the token using jwt.verify(), and fetch the user profile using the id we hidden inside the token.like this:-
//*const cookies = req.cookies;
//*  const { token } = cookies;
//!  const tokenData = jwt.verify(token, "dev@666Connect"); //* first param //*received token , second param secret password
//*  console.log(tokenData); //* it will give us a object which will contain the //*secret data we passes and also a property named "iat":4586769; which jwt added //*itself for verification.
//*  //* We can destructure the object and get the secret data we saved and use //*that to fetch the user.
//*  const { _id } = tokenData;
//*
//*  const user = await User.findById(_id);
//*
//*  res.send(user);

//! so now who ever sign in they can only call our api because they our api will always verify the token , and whoever sign in only his data will be sent to him when we call our api, because when he signed in , our server sent only his userid with token, and using his user id only his data can be fetched not others.
//* so till now our sign in api and profile api looks like below(for reference):-
/*
*app.post("/signin", async (req, res) => {
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
});*/
/*
*app.get("/profile", async (req, res) => {
  const cookies = req.cookies;
  const { token } = cookies;
  const tokenData = jwt.verify(token, "dev@666Connect"); //* first param received token , second param secret password
  console.log(tokenData); //* it will give us a object which will contain the secret data we passes and also a property named "iat":4586769; which jwt added itself for verification.
  //* We can destructure the object and get the secret data we saved and use that to fetch the user.
  const { _id } = tokenData;

  const user = await User.findById(_id);

  res.send(user);
});*/

//* So now our profile api ids secure , as the no one can access it with the toke but our other apis are not secure, because they don't have token verification implemented, that's let's not only keep the token verification logic inside the /profile api only, instead let's build a middleware inside auth.js to perform this token validation.
//* so we have created the middleware named userAuth, like below:-
const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      throw new Error("Token is not valid!!");
    }
    const decodedObj = jwt.verify(token, "dev@666Connect"); //* first param received token , second param secret password
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
    res.status(400).send("something went wrong:-" + err.message);
  }
};

//* first it will check the token is valid or not then it checks if the user exist in our database or not, if token is not valid or user is not present then it will through an error and catch bock will be executed and error response will be sent, but if token and user both is valid then only next() function will be called, so we know if the next() is called then execution will move to next request handler, so our middleware is ready and now we just have to go to our profile api after exporting it, and before the actual request handler which sends the profile data, we have to mention this, and then when ever someone makes call to our profile api then this userAuth will called first , and if it does not through any error then only it will move to the actual request handler.
//* lets mention this userAuth middleware before the actual request handler like this:-app.get("/profile", userAuth, async (req, res) => {}
//* another thing is we are already finding the user using the User.findById() method here in the userAuth middleware , then again we are finding the in the request handler as we are already doing it here in the userAuth middleware,so we can just save the user inside the req object here in userAuth like
//* req.user=user; (inside userAuth)
//* and then access the req.user in the request handler as the user is already saved inside the req.obj.
//* So inside the actual request handler function , we don't need to verify the token , no need to fetch the user , as we did all this her in userAuth , so we can remove that code from the request handler. and just get the user from the req.user.like this :-
//*   const user = req.user;(in profile api's actual request handler)

//* now we will delete the random apis we were using for test :- the get/user, get/feed,delete/user,patch/user/:userId .

//todo lets make a post /sendConnectionRequest api , where we will just have to use this userAuth for authentication and we can also know who is sending the request as we already have the user added inside req.user from userAuth.
app.post("/sendConnectionRequest", userAuth, async (req, res) => {
  const user = req.user;

  console.log("sending sonnection request");
  res.send(user.firstName + " is sending connection request");
});

//!expiring JWT token
//* we can even set a expiry time for JWT token, so when were creating the token we could pass a third argument, which is a object inside that object we can mention a property name {expiresIn:"1h"} and set that value as we want , so for now we will set it to 7d which means 7 days.like this-
/*
* const token = jwt.sign({ _id: user._id }, "dev@666Connect", {
  !      expiresIn: "7d",
*      }); //*1st param secret data,2nd param secret password , 3rd param a object where we can mention the expiry time of the token here we mentioned 7 days
*/
//* we can give it any expiry time like 1d or 1m (1 month) , or if we give 0d then it will be expired as soon as we create it, so if you use that token then it will through an error that, token is expired, So generally normal websites keep it it 7 days, but banking websites do not di, they use session cookie(so cookie will be valid only for that session,after exiting browser cookie will be expired) so as soon as user leaves the webpage, they have to log in again, so where we need more security there we can expire the token with in a day , but where it is not important there we can keep 7 days, but we should not keep a token for forever, because if someone logs in from cyber cafe or friends computer,then they will have the token for rest of their life using which they can access his data forever, so after some time we should remove the JWT.

//! expiring cookies(search in express doc search bar - res.cookies)
//* we can even expire the cookie , very similar to JWT. So when we are sending the cookie using res.cookie, we can mention a third param which is object and we can mention parm inside it like:- {expires: new Date(Date.now() + 8 * 3600000) // so cookie will be removed after 8 hours}
//* we have use the date format for mention the time, like above.
//* as the doc say:- Expiry date of the cookie in GMT(greenwich mean time).Indian Standard Time is plus 5.30 hours from the GMT.So to whatever hour we want to add we have to plus 5hours30mins with that time to make working for india. If this parm not specified or set to 0, creates a session cookie.
//* so to write 7 days we have to write like   expires: new Date(Date.now() + 1 * 24 * 3600000 + 3600000 * 5.5), to add 5hours 30mins to match the indian time.
//* se we have set it 7days in our cookies.

//! Mongoose schema Methods(!! always declare the methods before the Model creation)
//* We created the User schema, and we already discussed that it is like a User Class , and we are creating user instances using the User model/class. So like we create methods inside class,then we can access those methods inside the instances of that class,and remember if we use "this" keyword , inside the class or any method we created inside the class, then when we use that method from a instance of that class then this keyword will refer to the instance on which the method is called. Similarly as we created a User Schema which is like a class, we can also create methods inside that User Schema, and when we will call these methods from any instance then the methods will be available, inside the instance and also "This" keyword we used inside the method will refer to the instance. So if the user is Anupam(instance) then this keyword will refer to Anupam(instance).
//* So the token generation we are doing inside the signin method is very close to the user. So we can create a method in the userSchema , which will do this work and just return the token , and inside the method to get the user we will use "this keyword" and as this method will be called on a instance so it will refer to the that instance only. So whoever is signing in it will generate the token only for that user not for others. So let's add this user schema method on the userSchema. So let's go inside user.js where our schema is present.
//* remember while writing the method always use normal function not arrow function and as arrow function does not have this keyword. So if we would use arrow function then it will not refer to the user instance,and it will through error, so always use normal function whenever you are using this keyword inside a method of a class.then only it will refer to the instance.like below:-
/*
*userSchema.methods.getJWT = function () {
* const user = this;
* const token = jwt.sign({ _id: user._id }, "dev@666Connect", {
*   expiresIn: "7d",
* }); //*1st param secret data,2nd param secret password , 3rd *aram a object where we can mention the expiry time of the token *ere we mentioned 7 days
* // console.log(token);
* return token;
};
*/
//* then we can use this method inside the signin api to get the token once the user in validated, because after the user is validated using the emailId from the database, then the user constant becomes the instance (of that specific user who is signing in).

//* Lets also make a schema method fro validating the password, and as bcrypt.compare() return a promise so we have use async await, while creating the method,we will name this method validatePassword, and when we will use this function inside the signin api then we have to use await, as this is a async function/method.like this:-
/*
*userSchema.methods.validatePassword = async function (passwordInputByUser) {
*  const user = this; //* this is referring to the user instance who is trying to *log in
*
*  const hashPassword = user.password;
*
*  //* if this user input password match with the hash password fetched from the *db then this method will return true, if mismatch then it will return false.
*  const isValidPassword = await bcrypt.compare(
*    passwordInputByUser,
*    hashPassword
*  ); //* it will return a promise , which will be boolean value,(true/false)
*
*  return isValidPassword;
};*/
//*now we can use this inside the signin api.

//! Season 2 - Episode - 11 - Diving into Apis and express router

//* As we decided previously that we have to make many apis , in this lesson we will create different apis.
//* So our decided apis are :-
//* Post /signup
//* Post /signin
//* Post /logout

//* Get /profile/view
//* Patch /profile/edit
//* Patch /profile/password

//* Post /request/send/interested/:userId
//* Post /request/send/ignored/:userId

//* Post /request/review/accepted/:connectionRequestId
//* Post /request/review/rejected/:connectionRequestId

//* Get /user/connections
//* Get /user/requests/received
//* Get /user/feed - gets you profiles of the other users on platform
//* Till now we were building all our apis in just one file, in app.js, but it is a bad practice to keep all api's in just one file, instead we will use express.Router() to group apis.
//* we can go to express doc search express.Router and we can learn about it more.
//!express.Router([options])
//* So right now we have 13 apis listed above, so we will group them into small small categories, and create route for each category, and those router will handle those routes,

//* So for api related to authentication we can create a AuthRouter and put auth related apis into that router:-
//! AuthRouter
//* Post /signup
//* Post /signin
//* Post /logout

//* similarly for profile related apis we can create profileRouter
//! profileRouter
//* Get /profile/view
//* Patch /profile/edit
//* Patch /profile/password

//* similarly for connectionRequest related apis we can create connectionRequestRouter
//! connectionRequestRouter
//* Post /request/send/interested/:userId
//* Post /request/send/ignored/:userId
//* Post /request/review/accepted/:connectionRequestId
//* Post /request/review/rejected/:connectionRequestId

//* similarly for user related apis we can create userRouter
//!userRouter
//* Get /user/connections
//* Get /user/requests/received
//* Get /user/feed - gets you profiles of the other users on platform

//* using this separate routers we are grouping apis into different categories, and this this the bes practice in the industry, because when will we create a big project , even that project has 100 apis , if we use these good practices, then still our code will will be clean and modular.if we would keep all apis one one place still the code will work fine, but that will be very hard to understand for others . We should always follow these good practices while building a project, to make code more clean and modular.
//* so whenever you are building a big project, before coding list down all you apis , categorize them , then start writing code , your code will be much more cleaner and you don't have to refactor your code again and again.
//* one more important thing is naming your apis , if you name api's in a good way then just by seeing you can understand what the api is doing like here:- //* Post /request/send/ignored/:userId

//* so let's use express.Router() to destructure our application and we will son understand it's importance.
//* So first we will create our authRouter where we will be keep our auth related apis.
//* So inside the src folder first we will create a routes folder.inside it we will create a auth.js file. Then inside the file we will require express, then we will create authRouter like below from express.Router().

const express = require("express");

const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
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

module.exports = authRouter;

//* first we required express.Then using express.Router() we have created our authRouter, now , like previously we were using app.post() to make the api but now instead of app.post() we have to write authRouter.post() to write the api. So we just cute the signup api we built and paste here and instead of app we have written authRouter.post().And finally we have exported authRouter.
//* app.post() and authRouter.post() and literally works same , so for the end user their work is same, maybe, behind the scenes the  developers have implemented them differently, but for the end user both work same. But using this router will help us to make our code clean and modular, and destructure our code.
//* lets also move the /signin api to authRouter from app.js.
//* now let's also create the profile router inside routes folder , where we can put our profile api , so we have to create profile.js.
//* and let's also create requests.js file inside routes folder where we will create the connectionRequestsRouter ,and their we can put our connectionRequest api.

//* and don't forget to recheck the import links as we have put , all apis one level deeper inside a routes folder.

//!using routers in apps.js
//! now our apis will not work because the entrypoint of our server is app.js, so somehow we have to get all routers in our app.js. so let's got to app.js and import all the routers in app.js.
//! as we will import all routers here in app.js so we don't need to move the cookie-parser or express.json() middleware to any other file.
//* now after importing we will use this routers using app.use() , but always we have to use the routers after the cookie parser and express.json() middleware , if we mention the routers before these middlewares then json will not be converted and cookie will not be parsed so always call the routers after these middlewares because express executes the code from top to bottom, we can import the routers before the middlewares but to use / call the routers , we should always do that after theses app.use(express.json()) and app.use(cookie-parser()) middlewares.
//* so we can the routers like below using app.use("/",routerName)
//* using all routers we created
//* we have mentioned all router using app.use("/") because all request coming from the clients side/postman will be triggered by the app.use("/") and as we are using app.use() method, and also the with the path "/", which means all requests will trigger below router handlers, then it will check all of the routers one by one, and wherever it finds the matching url with path with url , it will start to execute the api code, and send the response, once response is sent it will not go further.
//* let's say user is making a api call to /profile api then first the express will go to authRouter as we have used app.use("/") then try to find the /profile api, and as it is not present in the authRouter it will go to the next router which is the profileRouter and there it will see the profile api present so it will execute the code of profile api and send the response then close the socket.
app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", connectionRequestRouter);
//* in the previous lesson we discussed that the work of express, is to when a request has come , it will check all request handlers , middlewares , every thing , and send the response from where it finds first.

//!building log/sign out api
//* So to build this api , we don't need  to perform validations, as this api will just sign out the user, so if the user is logged in or logged out, it does not matter as after calling this api, the user will still not be able to call any important api, as this api will just set the token to null and expire the cookie immediately.In big application, they might perform some clean up activities before expiring the cookie, but in our small application there is no need to do such clean up , so we are just doing the log out process in the standard way which is to setting the token to null and expiring the cookie immediately.So let's build our log out api inside authRouter present in routes/auth.js.like below
/*
*authRouter.post("/logout", (req, res) => {
*  //* setting the token to null and immediately expiring cookies
*  res.cookie("token", null, { expires: new Date(Date.now()) });
*
*  res.send("Logged out successfully");
});
*/
//* it is working totally fine , whenever we log in then our token is valid and we can access the profile api and get the profile data , and then if we call this log out api then token is set to null and cookie expires immediately so then if we call profile api it does not work.

//! PATCH /profile/edit API
//* so now we will create a PATCH /profile/edit API , it will edit the user data , only not the password. but first of all we need a validation check to check if the user is sending only allowed fields for updating, of if the user sending any extra field like password then we will throw an error, so we will create this validateProfileEditData() inside utils/validate.js file .like below:-
/*
 *const validateProfileEditData = (userSentData) => {
 *  const allowedFields = [
 *    "firstName",
 *    "lastName",
 *    "emailId",
 *    "age",
 *    "about",
 *    "skills",
 *    "photoUrl",
 *    "gender",
 *  ];
 *  // console.log(allowedFields);
 *  // console.log(Object.keys(userSentData.body));
 *
 *  const isEditAllowed = Object.keys(userSentData.body).every((field) =>
 *    allowedFields.includes(field)
 *  ); //* it will return a boolean value
 *  return isEditAllowed; //* boolean value
 *};
 */

//! then we will write the profile edit api inside the profileRouter present in routes/profile.js.like below:-
//* as we will sending the data not only the message, so we will send it in json format, like industry level standards, so we will not use res.send() instead res.json({}) to send data in json format
/*
 *profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
 *  try {
 *    // console.log(isValidData);
 *    if (!validateProfileEditData(req)) {
 *      throw new Error("Invalid Input Data");
 *    }
 *
 *    const loggedInUser = req.user; //* we saved the user in userAuth middleware, *while validating the token, so we can access the user from req.user.
 *    //!So now above logged in user a instance of the User model.
 *    //* forEach does not return the array it just change it for every field *according to the logic, map method return noe forEach.
 *    Object.keys(req.body).forEach(
 *      (key) => (loggedInUser[key] = req.body[key]) //* updating the user *object(both keys and values will be updated from the req.body in the *loggedInUser)
 *    );
 *    //! now as loggedInUser is a instance of the User model we can directly call *the .save() method to update it on the db.
 *    await loggedInUser.save(); //*updating on db
 *     //* as we are sending the data not only the message, so we will send it in json format, like industry level standards, so we will not use res.send() instead res.json({}) to send data in json format
 *    res.json({
 *      message: `${loggedInUser.firstName} , your profile is successfully *updated`,
 *      data: loggedInUser,
 *    });
 *  } catch (err) {
 *    res.status(400).send("Something went wrong:-" + err.message);
 *  }
 *});*/

//todo lets build password changing api , where we will first validate the emailId,password, then check if the new password is strong or not, then generate new hash for new password then update the password.Inside the profileRouter present inside routes/profile.js. APi name is PATCH /profile/password. like below:-
/*
 *profileRouter.patch("/profile/password", userAuth, async (req, res) => {
 *  //* if token id not valid this request handler will not be executed and  * *error *will thrown from userAuth middleware
 *  try {
 *    //* if the user is valid we have saved the user into req,user, so it;s the *user instance
 *    const user = req.user;
 *    //* user entered dat for changing the password
 *    console.log(req.body);
 *    const { emailId, oldPassword, newPassword } = req.body;
 *
 *    //* checking if the emailId is correct or not
 *    if (emailId !== user.emailId) {
 *      throw new Error("Enter valid email Id");
 *    }
 *    //* checking if the password id valid or not
 *    const isValidPassword = await user.validatePassword(oldPassword);
 *    if (!isValidPassword) {
 *      throw new Error("Enter valid old password to change it");
 *    }
 *
 *    //* checking if the new password is strong or not
 *    if (!validator.isStrongPassword(newPassword)) {
 *      throw new Error(
 *        "new password must contain  8 characters, at least 1 Lowercase, 1 *Uppercase,1 Numbers, 1 Symbol"
 *      );
 *    }
 *    const newPasswordHash = await bcrypt.hash(newPassword, 10); //* 1st arg is *text password and 2nd arg is number of salt rounds.it returns a promise.
 *    //* changing the password to new password hash
 *    user.password = newPasswordHash;
 *
 *    //* saving the user into db
 *    user.save();
 *    //* sending response
 *    res.send("password updated successfully");
 *  } catch (err) {
 *    res.status(400).send("Something went wrong:-" + err.message);
 *  }
 *});
 */

//! Season 2 - Episode - 12 - Logical DB Query Compound indexes
//* so now we will start to create connectionRequest related APIs, ,so we might think that we will add another field inside the UserSchema, to save the details of connection requests between users , but it is a bad idea, because, connection request can have different statuses like interested ,ignored,accepted, rejected.
// *Another thing is there is a reason why we add collections(inside the database),is it defines something, so our UserSchema is defining the identity of a user, but whenever there are two person and they are making connection, that connection should have its own schema, because that is the relation between two entities. So let's create a schema for connection requests inside the models folder.So first inside the models folder wew ill create a file connectionRequest.js , and inside it first we will import mongoose(as it is required to create the schema) , then we will start to create the schema for connection Requests.
//* now inside the schema , the there can be three fields , fromUserID(sender) , toUserId(receiver), and the status. we can also use the field names like senderId/receiverID but we will stick with decided names fromUserId,toUserId.
//* for fromUserID and toUserId , we might think that type will be string , but as this will the userId, which is automatically created by mongoose, So here the type will be mongoose.Schema.Types.ObjectId
//* so the status can have four values (interested ,ignored,accepted, rejected). So we can create a enum for it,Enum basically restrict the values of a field , so we can mention enum property and as value we can mention a array below:-
/*
 *  status: {
 *   type: String,
 *   enum: ["interested", "ignored", "accepted", "rejected"],
 * },
 *  OR
 *  enum: {
 *     values: ["interested", "ignored", "accepted", "rejected"],
 *     message: `{VALUE} is incorrect`,
 *   },
 */
//* it means the status field can have those four values, and no other value.and in the message we can mention a error message which will be shown if the user try to add any value which is not present in the array we mentioned.  we can read more about enum here in the doc.("https://mongoosejs.com/docs/schematypes.html#string-validators")
//* in fb we could see when was the request sent, so we can also do that, we just need to add timeStamps , so let's add it.
//* so we have to add some more validations, like the fromUserId ,toUserId,status all are required fields ,so we have to add required flag to all of the fields
//* then we will create the connectionRequestModel and export it.

//* now let's build our connection request related APIs.
//* so in routes/request.js we already have a api   /sendConnectionRequest , so let's modify it to build the api , so first we will change the path to /request/send/interested/:toUserId. so in the last instead of userId , we have used :toUserId because fromUserId we will already get from the req, as userAuth will save the user into the req while doing token validation.
//* now when the user sees someones profile he can be either be interested and send the connection request or ignore the profile , so while calling the api, we can make it more dynamic. So we don't need to make two apis like:-
//*Post /request/send/interested/:userId
//*Post /request/send/ignored/:userId
//* because in the two api's the only difference is interested and ignored, so we can make the url dynamic , then we don't need to make two APIs, we can just make one API by making the url dynamic.like below:-
//* Post /request/send/:status/:userId
//* so instead of writing interested or ignored , we made the api dynamic using ":status"
//* inside the api we will get user from the req.user as we saved the user into the the req in userAuth while doing validation of token, then we will get the toUserId from the params and also the status from the params.
//* then we will require the ConnectionRequest model and then create a instance using the data, and then we will save the data to the database using .save() method on the instance, and we can also save the data which is uploaded to the db by saving it inside a constant, now we will send the response back to the client but not using res.send(), instead we will use res.json() , because in the industry , they don't send the response with the data in the test format, instead they send the data using json format, so we will also send the response in the json format using the res.json() method like below.
/*
connectionRequestRouter.post(
  "/request/send/:status/:userId",
  userAuth,
  async (req, res) => {
    try {
      const user = req.user;
      const fromUserId = user._id;
      const toUserId = req.params.userId;
      const status = req.params.status;

      //* making a connection request instance using the model
      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });

      //* saving data into db
      const data = await connectionRequest.save();

      //* sending response
      res.json({
        message: "Connection request successfully sent",
        data,
      });

      console.log("sending connection request");
      res.send(user.firstName + " is sending connection request");
    } catch (error) {
      //! catching errors and sending error message
      res.status(400).send(`Something went wrong:- ${err.message}`);
    }
  }
);
*/
//* so let's test this api using postman.
//* so we will login using ms dhoni and sent the connection request to om swami ji. so in postman , in the place of status we will write interested and in the place of toUserId we will write the userId of om swami ji.we can get the user id from the mongo compass.

//* so the connection request is ent successfully and we got the data in postman as response, and if we open our cluster in mongo db and refresh the collections then we will see a new connectionRequests collection is added and our data is also added.

//* but the api we built is not secure right now, so just written intern level code, for this api, so let's write expert level code and make it more secure,so right now ,we are getting the status from the url params, so a hacker can just accepted in the place of status , and that will save the connection request status as accepted in the database. but should not happen, for this api the status should be either interested or ignored , so let's add this validation so, the status can be only interested or ignored.No one can just make changes in the url and misuse our api,because we should never trust the userData remember, some hacker can send malicious data if we don't secure the api.
//! so before creating the instance let's create the validation check. in this validation check we are doing early return,  writing return keyword is important , while sending the response from here , if we don't write return then the code execution will move further which should not happen , so always write return if you are sending response early, or you can just throw an error rather than sending response.
/*
 *const allowedStatuses = ["interested", "ignored"];
 *if (!allowedStatuses.includes(status)) {
 *  return res.json({ message: "invalid status:- " + status });
 *}
 */

//! Duplicate request issue
//* So there is one more problem in our api, right now if MsDhoni sends connection request to Om Swami Ji it will be in interested state, then if again MsDhoni tries to send second request then he can do it, so in the database there will be two duplicate requests ms dhoni sended to Om swami ji.And another problem is when ms dhoni already sent request to omswami ji now om swamiji should not be able to send connection request to to ms dhoni.But we can do this, so we should restrict the user to send the request when he has already sent a request once or, the other person sent him a connection request.
//* So before making the instance and after the allowedStatus check we will , check if the connection request already exist in our db fromUser to toUser or toUser to fromUser ( for example if msdhoni already sent request to omswami ji or om swami sent request to ms dhoni , in both cases we will restrict the user to send a new connection request).
//! using $or while doing query from mongo database.
//* So using the findOne() method we will try to find if there is an existing request present in the db which is either sent fromUserId to toUserId(sender to receiver) or toUserId to fromUserId(receiver to sender).To do it we have to know how to write Or condition.It is mongo db thing. To write thing inside the method , as usual we will write a object, inside the object as usual we write the condition, but to write or condition we will wite $or:[], inside this array we will write two objects , one for each condition, so it will be a array of objects. And then if the we find the connection request matching to the condition then we will do early return and send response to the user that "Connection request already exist".Like this :-
//* checking if there is a existing connection request
const existingConnectionRequest = await ConnectionRequest.findOne({
  $or: [
    { fromUserId, toUserId }, //* it is same as writing {fromUserId:fromUserId,toUserId:toUserId}(if sender already sent request and he is sending again)
    { fromUserId: toUserId, toUserId: fromUserId }, //* if receiver already sent to sender previously now sender is also trying to send receiver
  ],
});
//* if connection request exist with ignore status then user want to change it to interested , so updating the request status to "interested"
if (
  existingConnectionRequest &&
  existingConnectionRequest.status === "ignored" &&
  status === "interested"
) {
  existingConnectionRequest.status = "interested";
  //* saving the user with interested status and doing early return with sending the response
  const data = await existingConnectionRequest.save();
  return res.json({
    message: `${req.user.firstName} sent connection request to ${receiverProfile.firstName}`,
    data: data,
  });
}

//* if connection request exist (with interested status) but  user want to cancel it then update the request with ignored status
if (
  (existingConnectionRequest &&
    existingConnectionRequest.status === "interested") ||
  status === "ignored"
) {
  existingConnectionRequest.status = "ignored";
  //* saving the user with ignored status and doing early return with sending the response
  const data = await existingConnectionRequest.save();
  return res.json({
    message: `Request to ${receiverProfile.firstName} is canceled `,
    data: data,
  });
}

//* if a connection request already exist and accepted/rejected
if (
  existingConnectionRequest &&
  (existingConnectionRequest.status === "accepted" ||
    existingConnectionRequest.status === "rejected")
) {
  return res.json({
    message:
      existingConnectionRequest.status === "accepted"
        ? "You are already friends"
        : "Your connection request was rejected",
    data: existingConnectionRequest,
  });
}
//* if connection request exist (with interested status) but user sent again request with interested status or if previously ignored but again the user want to ignore sending reding response that already connection request exist or already ignored the profile.
if (
  existingConnectionRequest &&
  (existingConnectionRequest.status === "interested" ||
    existingConnectionRequest.status === "ignored")
) {
  //*early return as connection already exist
  return res.json({
    message:
      existingConnectionRequest.status === "interested"
        ? "Connection request already exist"
        : "Already cancelled the request",
    data: existingConnectionRequest,
  });
}

//* now one more validation we can perform, we were getting the toUserId from the params , but a hacker can change the toUserId , to some random userId , which he might copied from tinder , he just need a fake mongo id , and if he change the url params and enter a fake user id then , in our document a connection request document will be created in our database with a fake to0UserId , which user does not even exist in our database.So before checking if the connectionRequest already exist or not we will first check if the toUserId is a actual User who is present in our User collection or not, if the user id is not present in our User collection then we will do early return and send message :- "user not found". like below:-
/*
 *      const receiverProfile = await User.findById(toUserId);
 *      //* early return if receiver id not present in our database
 *      if (!receiverProfile) {
 *        return res.json({ message: "User not found" });
 *      }
 */

//* Now one more validation check is remaining, what if the user is sending request to himself,it should not be allowed , we can perform this validation inside the API but , to write this validation , we will learn how we can add validation checks ata the schema.level using schema .pre("save") function , which works like a middleware, because every time it will called before calling .save() method on the instance. As this is like a middleware so calling next() is important , mentioning next param while making the function is also important then only we can call next(), So we will create this .pre() middleware on connectionRequestSchema and inside this we will check if the fromUserId to toUserId is same and if both are same then we will throw an error .While checking fromUserId === toUserId ,we can't do it like we do for strings using ===.Because its a mongo db object id so we have to use .equals method to compare.and always write normal function not arrow function while writing pre() as we will use this key inside it to access the instance. Like below:-
connectionRequestSchema.pre("save", function (next) {
  const connectionRequest = this;
  //* checking if sender and the receiver is same , if same then throwing an error
  if (connectionRequest.toUserId.equals(connectionRequest.fromUserId)) {
    throw new Error("Request sender and receiver can not be same.");
  } //* if error happens it will go to catch block of the request handler where it is called as throwing an error
  //* moving to request handler
  next();
}); //* this will be executed every time before calling the .save method on any instance created using connectionRequestSchema.

//* we can read more about schema.pre() here in the doc :-https://mongoosejs.com/docs/middleware.html#pre

//!Dynamic Message sending(as our status is dynamic and can have both values interested and ignored)
//*  as our status is dynamic and can have both values interested and ignored , so we have to send the response to user also dynamically , if we don't do that then even the user ignored someone's profile then also "connection request sent message will be sent" .This should not happen , so depending on eth status we have send the response dynamically using ternary operator, req.user(got from userAuth) amd receiverProfile( got using id for validation to know if the receiver exist or not).like this:-
/*
 * res.send({
 *   message:
 *     status === "interested"
 *       ? `${req.user.firstName} sent connection request to * ${receiverProfile.firstName}`
 *       : `${req.user.firstName} is not interested in  * ${receiverProfile.firstName}'s profile`,
 * });
 */

//! Indexes
//* indexes are very important, because when our database grows and there are millions of users, and we try to find some document by doing a query using find() or findOne() or any related methods, then database will check every doc one by one to filter based on our passed filters , suppose , we are searching a name Ramesh , and there are so many users with this name, so database may take 5 minutes to find all the users with this ramesh name, but if we indexed the firstName field then it will take so mush less time to find the users, so indexes are important.
//* suppose we want to query in database using emailId, so do we need to index on the emailId field on the schema, but as we added the unique flag on the emailId field, so it already added the index on the emailId field
//! So unique flag automatically always add indexes to a field if we mention the unique : true . but for other fields , suppose we need to query using the firstName , then we can't add the unique :true, on firstName field because then two users with same firstName will not be able to account on our platform, so if we really need index om some field then , we can just add the flag index:true, flag, and it will add index to that field.
//* single index :- if we want to add index on single field then we can just add the index: true , flag on the that specific field, on the schema of that field.It is applicable when we want to do query using just one field, like searching doc using just email.
//* compound indexes :- when do query simultaneously using two fields, like when we are trying to find existingConnectionRequest inside the /request/send/:status/:userId api , we are doing the query simultaneously using two fields - fromUserId and toUserId. so in this case adding index to just one field will not work, so we have to add index to both of the fields then it will be easy for mongodb to find any connectionRequest document.So adding indexes to both fields are called compound indexes. So to set indexes for both fields so basically setting compound indexes we have to go to the connectionRequest Schema , unhide models/connectionRequest.js , so below the schema we will just write it like we write schema methods , but always do oit before the model creation, so we will create it like:-
connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 }); //* 1 means ascending order, -1 means descending order.
//* ascending and descending means in which order mongo db stores the data, and there can be more values, but mostly we use 1 or -1.we can read more in the doc.here:-https://mongoosejs.com/docs/api/schema.html#Schema.prototype.index()
//* but we should not create indexes for all the fields , because if create for all fields then database has to store that data which becomes tough for databse , so only create indexes for thoese fields , using which you do query, and if some field has unique flag then automatically index will be added remember that like we have added for emailId field in user schema.
//! So we should know why do we indexes? Advantages and disadvantages of using indexes,interviewer can ask it.

//* we have learnt about how to do a query using or condition , using "$or:[]", but what if we have query using and condition, not condition ,nor condition, so in that cases we have to do different types of query , we can read about these here in the mongodb doc:-https://www.mongodb.com/docs/manual/reference/mql/query-predicates/logical/
//* there are more types of query we can write we can learn them from here :- "https://www.mongodb.com/docs/manual/reference/mql/query-predicates/"
//! and whatever you are building always think about corner cases, either attackers can use you api's to send malicious data.

//! Season 2 - Episode - 13 - Ref,Populate & Thought process of writing apis
//* in the previous lesson we built the connection request sending api which is dynamic and work for both "interested and ignored status", now we will built the connection request reviewing api, so using this api the receiver will accept or reject the connection request , that's why we are calling it request reviewing api, and to accept or reject the request , we don't need to make two different apis , instead , like before we will also make this request review api dynamic, so it can work for both statuses. So in the client side/browser the receiver will see the request and , then he will can this review api to either accept or reject the request, so while calling the api he will send us the status(receiver's response accepted or rejected), and the _id of same connection request receiver received with interested status , so our api path will look like :- request/review/:status/:connectionRequestId
//* so when this api will be called , first we will check,the token validation through userAuth,and then inside a try{}catch{} block we will get the loggedInUser from req.user as we already save it userAuth, and get status and connectionRequestId from the params, then we will check what status user is sending , it should be either "accepted or rejected" if it something else then throw an error, then , we will try to find a doc in our database collection , which has a same connectionRequestId , the toUserId should be same as the loggedInUser's id and status should be only "interested". if we don't find a user with these matching details we will throw an error but if we find a connection Request doc matching with these details then we will update the doc , with the status dynamically (either accepted or rejected coming from params), then save the connection request instance using .save() method and get the saved data inside a instance and then we will send the response to the user with the updated data and message.So let's go inside routes/requests.js and create the api.Like below:-
/*
connectionRequestRouter.post(
  "/request/review/:status/:connectionRequestId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const { status, connectionRequestId } = req.params;

      //* checking if the user entered status value contains below values or not
      const allowedStatuses = ["accepted", "rejected"];
      //* throwing error when it is not contains any values from allowedStatuses values
      if (!allowedStatuses.includes(status)) {
        throw new Error("Incorrect status");
      }

      //* finding connection req doc where _id matches the connectionRequestId sent by user , toUserId is the loggedUser's(receiver's) id ,a nd status is only interested
      const connectionRequest = await ConnectionRequest.findOne({
        _id: connectionRequestId,
        toUserId: loggedInUser._id,
        status: "interested",
      });
      //* throwing error when connection request is not found with matching details
      if (!connectionRequest) {
        return res.status(404).send("Connection Request not found");
      }

      //* if connection request is found then update it with current status given by user,dynamically(either accepted or rejected).
      connectionRequest.status = status;
      //*  saving the data to database
      const data = await connectionRequest.save();
      //*sending response with data
      res.json({
        message: "Connection request is " + status,
        data: data,
      });
    } catch (err) {
      res.status(400).send("something went wrong:-" + err.message);
    }
  }
);
*/

//! Deciding between POST V/S GET api
//* So while developing apis Will we know that when to create a post api and when to create a get api And what should be the thought process While building those apis So previously when we were creating the login api We were thinking that We're Getting the Login data from the user And then we're not saving anything new in tour database Instead we're Compar Already saved things with the user inputted data and then if it matches then we Giving response that you're logged in successfully So why should Make it a post api Because from the database we're just getting the data and not posting Anything new So we have other reasons For the security purposes to make it a post api, But the main reason Of creating A post API is not Posting a new data into the database Actually we create a Post api When the user is In putting some data Or basically posting some data While he is sending the request from the browser Or Postman or client side, So it is not about posting something new to the database it is About When the user is making the api call if he is Passing any input through the request body Or through the url params , Show whenever In a api The user w In Input some data or pass some data through the params of the url every time that API should be a post api, If we look from the view of the login api also The user Sending his Credentials Through the request body So basically he is passing some data Through the api That's why it is a post api not a gate api because while calling the api he is passing some data It could be either using the request body Or the parameters of the url But whenever the user is passing some data Through the parameters of the url or the request body every time it should be a post api And in the other hand Whenever the user Is not passing anything So he is not even passing some data through the parameters of the URL and not also passing through The request body In that case it should be a get api Like the profile view api We're not passing any data to get the profile data or not passing any data through the parameters Or the request body we are just calling the api and getting the data so in those cases The api should A get api.

//! Thinking behind security of post api and get api
//* So whenever we're building an api We should always think Api is King King's palace and we are the security guard of Kings palace So like a security gu Do Do not let Stranger enter into the palace without Authorization And also Also the security guard checks the person When he comes out of King's palace, If he is taking something out of the palace without permission or not, Similarly When we're building an api We should Act like a security guard Of that api So when we Creating a post api We should always think like a security guard because if we don't secure our api A attacker Send any malicious data Through our api And if that data is saved Our database That means Our whole data Is not clean Now so we should never let the attacker misuse our apis So when we are building a post api Whatever data we are Getting through the request We should always validate and sanitize that data We should always cheque What data the user is entering What should be the format of that data How long is that data What type of data the user is entering And we should validate every Field of that data Whatever the user is sending through the request body And also we have to validate Whatever data we are getting through the parameters of the url so the attacker can Change the url Parameters To send malicious data Like he Change the status of the request or he might change the idea of the request or anything he To with the apis so we should always 100% Secure our apis that it cheques Every data it gets from the url and the request body And after doing all of the validations and all of the sanitization then only we should write dot save method which actually saves the data into the database That's Always we should write all of Api code inside a try catch block and after doing all of the validations and all of the sanitization and all of the cheques if the d is is Clean or After doing all of these We should then only save the data to the database and then only we should send the response Data to the Before doing the validations we should never save the data to the database We have heard about the data breaches happens Which breach the data of millions of u and and that actually happens because Developers Leave Please wear the attackers can attack and Do theft of the user's personal data So we should Always secure our data And our apis to the maximum level that no attacker can misuse our ap That That was the thinking behind building a post api Now we See that how we should When we are Building a get api, So when we are building a get api First of all The most important thing is Validating the user So we should always validate the user With the token And if the token is not correct then Always rewrite the user to the Login page Because if the credentials are not right so if the user Don't have a validated token Then he should be never Able to fetch any data from our Api So we should always Validate the user first that The locked in user Has right credentials And a valid token Once the token is validated Then we have to always ensure that we are only sending him The allowed data not more than that We should never send Unnecessary data to the user Some developers allow their get api to send all of the data that's why all of these data breach happens so we should always Send the data mindfully The response should always contain The necessary data only The allowed data only, and the user is 100% authorized.

//! user/requests/received api (making relation between two collections)
//* lets create the userRouter to build the rest apis. So inside the routes folder we will create a user.js , and inside that we will create userRouter.
//* now first here inside the userRouter we will create the get/ user/requests/received api, which will give the data to of all received connection requests. Basically all the the connection requests where toUserId is same as  loggedInUser's id and the status is interested,Because if we don't mention status as interested then it will also return the ignored requests.
//* So lets make this api.
//* first we will validate the token using userAuth middleware, then in the request handler we will get the loggedInUser from req.user, as we saved the user inside req.user in userAuth, then from the ConnectionRequest model we will find all requests where where toUserId is same as  loggedInUser's id and the status is interested,Because if we don't mention status as interested then it will also return the ignored requests.
//* if there is no returned connectionRequest in the doc then we will do early return with the message "No new connection requests exist". But if any connection Request exist , then if we just send the data of the connection Request data(docs/objects) then it will only contain fromUserId,toUserId,Status, but in the Ui we also show the profile Data of the request sender we can's display the fromUserId only , we have to show the sender's profile data, So there is two ways to handle it, one is we iterate , the array , and using the fromUserId of all docs, we fetch all the request sender one by one from the User model but that's a bad way of handling it, another way is building relation between two collections, basically to make a connection between two collections(User collection and ConnectionRequest collection), we have to go the collectionRequest Schema present inside models/connectionRequest.js and in the schema , inside the fromUserId field's object , we will mention a property named ref :"User", basically we are writing  that this fromUserId  is a reference from User collection's doc id , we are creating a link between two collection, so whenever mongoDb will create a new connection Request doc it will maintain a link with User collection doc where the _id is same as fromUserId and toUserId.

// *Basically we are creating a reference to the User collection. Now our two collections are linked.like below:-
/*
 * fromUserId: {
 *    type: mongoose.Schema.Types.ObjectId,
 *    ref: "User", //*reference to the User model
 *    required: true,
 *  }
 */
//* now we have to come back to userRouter,where we were writing user/requests/received api , so inside the api , when we are making call to ConnectionRequest model, using .find() method , we just have to populate the reference we created with User collection, how we can populate the reference?
//* after the  find method we have to chain another method .populate("ReferencedFieldName",[requiredField1,requiredField2,etcFields]) , we are populating because we also need the data from the User Collection, So this populate() method , takes two arguments , first is the FieldName which id linked with other collection(User) and second argument is a array , inside the array we can mention what fields we need  from the user collection, like if we need the ["firstName" and "lastName"], ,So let's use this populate method ,like below;-
const connectionRequests = await ConnectionRequest.find({
  toUserId: loggedInUser._id,
  status: "interested",
}).populate("fromUserId", ["firstName", "lastName"]);

//* and now we can send this data to the user's as it will also contain the firstName and lastName of the user.
//* and don't forget to import and use userRouter inside app.js .
//* so now our show connection request api(/user/requests/received) api is looking like below:-

userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequests = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", ["firstName", "lastName"]); //* returns an array of connection Requests, only finding the request where is toUserId is same as loggedInUser's id to ensure the request is sent to the the loggedInUser,and status is interested , either it will also give the requests with ignored statuses. [about populate method:- the find method would only return the user userId of the sender , but we also wanted the the sender's profile data like first name and lastName to show the user who is sending the request , so we linked two collections userCollection and connection request collection , by getting the reference of the User collection in the fromUserId field present inside connectionRequests schema, using ref:"User", now both are connected, now when we are using the populate method, we are also fetching the data from User collection related the fromUserId, so the first arg is linked field with the User collection and second arg is an array with all the fields we need from the User collection matching with same fromUserId = _id in User collection.So previously we were only getting the fromUserId as id but after populating now fromUserId will be a object which will contain  the id, firstName,lastName  and other mentioned fields in the array, but it will not fetch any field which is not mentioned like pass word, createdAt, because we don't want to over fetch data which is not required.]

    if (connectionRequests.length === 0) {
      //* early return when no connection request is found
      return res.json({
        message: "No new connection requests found",
      });
    }

    res.json({
      message: "Data fetched successfully",
      data: connectionRequests,
    });

    //* when connection requests exist
  } catch (err) {
    res.status(400).send("Something went wong:-" + err.message);
  }
});

//! Be aware over-fetching data when we are populating data using .populate method
//* when we call the populate() , while finding docs , as first arg we write the the field using which we have referenced the other collection, and as second arg , we can pass which fields we need from the other collection's doc , like firstName,lastName. We can write it inside an array like- ["firstName","lastName"] , or inside a string separated with spaces like "firstName lastName  about" .but if we don't mention the second param while calling populate then it will give the whole document data from the other collection, like password , email, createdAt, everything , and we don't need to send these details, and that's why while making get api we should always keep in mind that we never over-fetch data , so we should always explicitly mention what data what fields data we need and we should never over fetch data, if we over fetch then it can be give attackers opportunity to steal data, so always we should manually mention the the allowed fields while populating data.

//! /user/connections api
//* let's also make this connections api .
//! while building the previous api , we only linked the User collection with the fromUserId ,but now we also have to connect the toUserId with userCollection,by mentioning ref:toUserId inside the connectionRequest collection like below:-
/*
 *   toUserId: {
 *      type: mongoose.Schema.Types.ObjectId,
 *      required: true,
 *      ref: "User", //*reference to the User model
 *    },
 */
//! we are connecting both fromUserId and toUserId ,because when we will fetch data of the connection , because both cases can happen , like someone sent the request the to loggedInUser and he accepted , so in this case loggedInUser's id will be toUserID , in this case we need to data of the sender/fromUserId , but in other case , the loggedInUser can send request to some other user and the user accepted to request so in this case , loggedInUser's id will be fromUserId and receiver's id will be toUserId. So sometimes we need the data of fromUserId when loggedInUser was receiver and sometimes we need the data of toUserId , when the loggedInUser sent the request to some other user.
// * inside userRouter present inside routes/user.js.first we will use the userAuth middleware to verify the token then inside the route handler we will get the loggedInUser from req.user as we saved the user while validating inside the userAuth, now we will create a constant named USER_SAFE_DATA, and here we will write the all of the fields name which we want to get while populating, we will write it inside a string  separated with spaces .
//* now using the ConnectionRequest model ,we call .find method and query the the docs/connectionRequests where where either the sender is loggedInUser and the status is accepted or the receiver is loggedInUser and status is accepted, so to write this query we will write or:[] and write the query like below:-
/*
 * $or: [
 *        { fromUserId: loggedInUser._id, status: "accepted" },
 *        { toUserId: loggedInUser._id, status: "accepted" },
 *      ],
 */
//! and then use populate() to get more info about the connections from the User collection,So we have to populate() twice,once using fromUserId and second time using toUserId,because whatever connection requests we will get , in some connection loggedInUser will be the sender/fromUserId so in that case we would need the toUserId/receiver details, and in connection loggedInUser will be the receiver/toUserId so in that case we would need the fromUserId, so we will chain two populate methods one after another, first we will populate using fromUserId then populate using ToUserId,    so first arg will be fromUserId for first populate method then for second populate toUserId will be first arg, as it has the reference of the User collection and second arg for both populate will be USER_SAFE_DATA, like this:-
const USER_SAFE_DATA = "firstName lastName about age gender skills photoUrl";

const connections = await ConnectionRequest.find({
  $or: [
    { fromUserId: loggedInUser._id, status: "accepted" },
    { toUserId: loggedInUser._id, status: "accepted" },
  ],
})
  .populate("fromUserId", USER_SAFE_DATA)
  .populate("toUserId", USER_SAFE_DATA);

//* this will return every connection data as inside an array of object, every object will have also the data of fromUserId and toUserId.In some objects fromUserId will be the loggedInUser , In some objects toUserId will be loggedInUser. So we will filter this array.

//* now if no connection exist we will do a early return

//* when connection requests exist
//* the connection data will be array of objects , which has data of every connection request related to the loggedInUser and accepted status, so it also contains the data of connectionRequest id , created at , toUserId (loggedInUser), so this is unnecessary data , we just need the data of the fromUserId  when loggedInUser is receiver/toUserId and toUserId when logged in user is sender/fromUserId, these have all data of the connection/friend, so we can iterate the connections array and only save the data of the fromUserId when loggedInUser's id is toUserId and toUserId when loggedInUser's id is fromUserId.
const data = connections.map((connection) => {
  //* returning toUserId data when loggedInUser's id is fromUserId
  if (connection.fromUserId._id.equals(loggedInUser._id)) {
    return connection.toUserId;
  }
  //* returning fromUserId data when loggedInUser's id is toUserId
  return connection.fromUserId;
});
//* either we can user equals() method like above to compare mongoDb ids or we can convert mongoDb ids to string using tostring() method then compare using === .
const data2 = connections.map((connection) => {
  //* returning toUserId data when loggedInUser's id is fromUserId
  if (connection.fromUserId._id.toString() === loggedInUser._id.toString()) {
    return connection.toUserId;
  }
  //* returning fromUserId data when loggedInUser's id is toUserId
  return connection.fromUserId;
});

//* then send the response back to the user like below:-
/*
* userRouter.get("/user/connections", userAuth, async (req, res) => {
*   try {
*     const loggedInUser = req.user;
* 
*     const USER_SAFE_DATA =
*       "firstName lastName about age gender skills photoUrl";
* 
*     const connections = await ConnectionRequest.find({
*       $or: [
*         { fromUserId: loggedInUser._id, status: "accepted" },
*         { toUserId: loggedInUser._id, status: "accepted" },
*       ],
*     })
*       .populate("fromUserId", USER_SAFE_DATA)
*       .populate("toUserId", USER_SAFE_DATA); //* it will only fetch the requests * where fromUserId  is same as loggedInUser's id  and status is accepted or the * loggedInUser sent request to some user and also the status is only accepted * now,to make sure request is sent to loggedInUser or received by the * loggedInUSer, so the requests with other statuses are not fetched.So we have to * populate() twice,once using fromUserId and second time using toUserId,because * whatever connection requests we will get , in some connection loggedInUser will * be the sender/fromUserId so in that case we would need the toUserId/receiver * details, and in connection loggedInUser will be the receiver/toUserId so in that * case we would need the fromUserId, so we will chain two populate methods one * after another, first we will populate using fromUserId then populate using * ToUserId,    so first arg will be fromUserId for first populate method then for * second populate toUserId will be first arg, as it has the reference of the User * collection and second arg for both populate will be USER_SAFE_DATA. How * populate() method works mentioned in the above api, and notes.
* 
*     if (connections.length === 0) {
*       //* early return when no connection request is found
*       return res.json({
*         message: "No connections found",
*       });
*     }
* 
*     //* when connection requests exist
*     //* the connection data will be array of objects , which has data of every * connection request related to the loggedInUser and accepted status, so it also * contains the data of connectionRequest id , created at , toUserId * (loggedInUser), so this is unnecessary data , we just need the data of the * fromUserId  when loggedInUser is receiver/toUserId and toUserId when logged in * user is sender/fromUserId, these have all data of the connection/friend, so we * can iterate the connections array and only save the data of the fromUserId when * loggedInUser's id is toUserId and toUserId when loggedInUser's id is fromUserId.
*     const data = connections.map((connection) => {
*       //* returning toUserId data when loggedInUser's id is fromUserId
*       if (connection.fromUserId._id.equals(loggedInUser._id)) {
*         return connection.toUserId;
*       }
*       //* returning fromUserId data when loggedInUser's id is toUserId
*       return connection.fromUserId;
*     });
* 
*     //* sending back response
*     res.json({
*       message: "Data fetched successfully",
*       data: data,
*     });
*   } catch (err) {
*     res.status(400).send("Something went wong:-" + err.message);
*   }
* });

*/
//! Season 2 - Episode - 14 - Building feed api and pagination
//! /user/feed api
//* in the feed of the loggedInUser we should not show any other connection with interested,ignored,accepted,rejected status, and also not show the loggedInUser to himself, we should only show the new people in the feed of anu loggedInUser. So we will find all user's where either the loggedInUser's Id is same as fromUserId or toUserId from the ConnectionRequest Model and the we will use select("field1 field2") method to only save the required fields into the connection Requests. So we can find all the friends(accepted status, who sent or received and accepted) , an also who rejected or ignored loggedInUser's profile.Like below:-

const connectionRequest = await ConnectionRequest.find({
  $or: [{ toUserId: loggedInUser._id }, { fromUserId: loggedInUser._id }],
}).select("fromUserId toUserId"); //!select() method if we have a object or arrays of objects and we don't need of the fields inside the object, then we use this select method which takes only one arg which is a string where we have to write on;y required field names separated with spaces, and it will return the object or objects with required fields mention in the args of the select method.

//*  Then we will create a new Set() and assign it as a value of a constant named hiddenProfiles ,Remember a set always saves only unique values, no duplicate values,like below,
const hiddenUsersFromFeed = new Set();

//*  and then using the forEach method we will loop the all the connections we found and add then inside the set we will add all the fromUserIds and toUserIds, so it will included both the loggedInUser and also the user's who are connected(interested , ignored, accepted,rejected) ,like below:-
connectionRequests.forEach((connection) => {
  hiddenUsersFromFeed.add(connection.fromUserId.toString());
  hiddenUsersFromFeed.add(connection.toUserId.toString());
});
// * then we will write a query using the User model using .find() method. and inside this we will write the logic that except the hiddenUserFromFeed profiles and loggedInUser profile fetch all the other users profile. To write that we will use $and:[] operator to write and query, and $nin to write not in the array query and $ne to write not equal  to query, and also we will use Array.from() method to convert the hiddenUserFromFeed set to array., and finally save the response into a constant name visibleFeedUsers then send back response to the client.Like below:-
const visibleFeedUsers = await User.find({
  $and: [
    { _id: { $nin: Array.from(hiddenUsersFromFeed) } },
    { _id: { $ne: loggedInUser._id } },
  ],
}).select(USER_SAFE_DATA);
//* $and operator ensures that , whatever condition written inside the array all of them gets fulfilled
//* $nin means "not in the array" , so it will only return the results from db which are not included in the array(Array.from(hiddenUsersFromFeed)).
//*$nin selects the documents where:
//*the specified field value is not in the specified array or
//*the specified field does not exist.
//* syntax :- { fieldName: { $nin: [ <value1>, <value2> ... <valueN> ] } }
//* so which ever doc include a field with any value present inside the array , it will not fetch that doc.that's why it represents "not in the array".
// *Array.from() converts the set(hiddenUserFromFeed) into a array. in $nin we have to mention a array not a set so that's why we used this method.
// * $ne selects the documents where the value of the specified field is not equal to passed value by us basically it represents "not Equal to". This includes documents that do not contain the specified field. so it will not return any doc which includes the field(here _id) with mentioned value(here loggedInUser._id).
//*syntax:- { field: { $ne: value } }
//*   Because of the first condition  { _id: { $nin: Array.from(hiddenUsersFromFeed) } }, it will not return any user included in the hidden list and also it will not return the profile doc of the loggedInUser because of the second condition   { _id: { $ne: loggedInUser._id } }.and then we are only selecting the required fields using select method so not all the fields will be there in the returned data from db like password or email as these are not required.
//* So finally the api will look like below:-
userRouter.get("/user/feed", userAuth, async (req, res) => {
  try {
    //* getting the loggedInUser as we already saved it inside the userAuth while validating the token
    const loggedInUser = req.user;
    //*  getting the all the connection requests with the "interested , ignored,accepted, rejected statuses, then only selecting the fromUserId and toUserId using the select() method
    const connectionRequests = await ConnectionRequest.find({
      $or: [{ toUserId: loggedInUser._id }, { fromUserId: loggedInUser._id }],
    }).select("fromUserId toUserId");

    //* creating a new Set() and assign it as a value of a constant named hiddenProfiles ,Remember a set always saves only unique values, no duplicate values
    const hiddenUsersFromFeed = new Set();

    //* using the forEach method we will loop the all the connections we found and add then inside the set we will add all the fromUserIds and toUserIds, so it will included both the loggedInUser and also the user's who are connected(interested , ignored, accepted,rejected)
    connectionRequests.forEach((connection) => {
      hiddenUsersFromFeed.add(connection.fromUserId.toString());
      hiddenUsersFromFeed.add(connection.toUserId.toString());
    });

    // * doing a query to the database using the User model using .find() method. and inside this we will write the logic that except the hiddenUserFromFeed profiles and loggedInUser profile fetch all the other users profile. To write that we will use $and:[] operator to write and query, and $nin to write not in the array query and $ne to write not equal  to query, and also we will use Array.from() method to convert the hiddenUserFromFeed set to array., and finally save the response into a constant name visibleFeedUsers then send back response to the client.
    const visibleFeedUsers = await User.find({
      $and: [
        { _id: { $nin: Array.from(hiddenUsersFromFeed) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    }).select(USER_SAFE_DATA); //* $nin means not array , so it will only return the results from db which are not included in the array, so only the ids that in our hiddenUserFromFeed . Array.from() converts the set into a array. $ne selects the documents where the value of the specified field is not equal to passed value by us basically it represents not Equal to. This includes documents that do not contain the specified field. so it will not return any users who is included in the hidden array list  because of the first condition and also it will not return the profile doc of the loggedInUser because of the second condition.and then we are only selecting the required fields using select method not all the fields from the returned dat from db like password or email as these are not required.
    // console.log(visibleFeedUsers);
    //* sending back response
    res.json({
      data: visibleFeedUsers,
    });
  } catch (err) {
    console.log(err);
    res.status(400).send("something went wrong:- " + err.message);
  }
});

//! Pagination
//* suppose We have millions of users And a new user signs in So in the feed Will he see all of the users At once No that should not happen at once in the feed There should Only 10 users And when He will go to the next page You will see Next 10 new users So from 11 to 20, Then again when he goes to the third page he should see the users from 21 to 30 So basically we are trying to implement The pagination feature So to implement the pagination feature We can use the query params, like:- /feed?page=1&limit=10 , in the url, so to Implement this feature we need to know two important functions Of Mongodb First is skip() and second one is limit(), so skip() Function represents how many documents It has to skip, so if we pass 10 as arg in skip(10) then , it will skip first 10 docs if we pass 20 the it will skip first 20 docs , and give docs from 21 , and limit() function the number of how many docs it should give, so if we pass 10 in limit(10) then it will give total 10 docs, so if we pass skip(10)&limit(10) that means it will give first 10 docs then give us 10 docs so 11 to 20 num doc.like below:-
//* /feed?page=1&limit=10 => 1 - 10 => skip(0)&limit(10)
//* /feed?page=2&limit=10 => 11 - 20 => skip(10)&limit(10)
//* /feed?page=1&limit=10 => 21 - 30 => skip(20)&limit(10)
//* so humans will understand left side query params , so they can search for page 2,  but mongodb will not understand that , mongo will understand skip(10)&limit(10), so that's why learning this skip() and limit() is understand.
//*so inside the feed api at top portion we will we will doi it like below:-
//* implementation of pagination
//* query params are optional so we don't need to change anything in the api url.
const page = parseInt(req.query.page) || 1; //* parseInt will convert the string into integer , and if nothing has come oe some wrong thing is coming through query then set it to 1 by default.
let limit = parseInt(req.query.limit) || 10; //* parseInt will convert the string into integer , and if nothing has come oe some wrong thing is coming through query then set it to 10 by default.
//* if user pass 100000 as limit then while doing the query our db will haag while doing a so much big query so we should always restrict this limit we will set it to 50 max.
limit = limit > 50 ? 50 : limit;

const skip = (page - 1) * limit; //* suppose someone is searching page 3 then (3-1)*10=20 so it will skip first 20 pages.

//* then go where we are finding the users from the user collection. and at last we will chain this methods skip and limit method  like below:-
const visibleFeedUserss = await User.find({
  $and: [
    { _id: { $nin: Array.from(hiddenUsersFromFeed) } },
    { _id: { $ne: loggedInUser._id } },
  ],
})
  .select(USER_SAFE_DATA)
  .skip(skip)
  .limit(limit); //*skip method will skip the number of pages what ever passed inside it, and limit method only give the number of results we pass inside it, like we the user pass page 2 then (2-1)*10=10 , so it will skip first ten pages and if the limit is passed 10 then after skipping first 10 pages because of the skip method it will return 10 docs it will show docs from 11-20.

//* for all api's use .json() because for all api 's response standard should be same so as we are using json format so , always keep same format.also for catch blocks.

//!cors issue
//* as frontend is hosted n different localhost port so, it will throw a cors error so , we have to use this cors middleware to handle that issue , just install cors library using npm i cors and then here ue it as a middleware in app.js, and also mention our frontend url to whitelist it and set credentials to true , to Accept credentials (cookies) sent by the client
app.use(
  cors({
    origin: "http://localhost:5173", //*(Whatever your frontend url is)
    credentials: true, // *<= Accept credentials (cookies) sent by the client
  })
);

//! change in userAuth middleware
//* in the userAuth middleware present in middleware/auth.js sending the proper message with proper status code
if (!token) {
  //* when the token is not valid that means we should send a proper message with status code 401 which means unauthorized credentials
  return res.status(401).json({ message: "Please login" });
  // throw new Error("Token is not valid!!");//* this error message was not proper
}

//! some changes in signup and sign in api
//* sending the cookie(added at last because we were not sending the token for this sign up api) and in sign in api
res.cookie("token", token, {
  expires: new Date(Date.now() + 7 * 24 * 3600000 + 3600000 * 5.5),
});

/* 
! below this is not required
we could also added samesite and secure properties, to  setting the cookie 
      sameSite: "none", //* Required for cross-site requests(added at last)
        secure: true, //* Required when sameSite is 'none'(added at last)*/

//! adding env files to secure keys
//*installing dotenv module :- npm install dotenv
//* creating a .env file in main directory and writing keys in this this file
//* then using it is where needed:-
//* so at the top write require("dotenv").config()
//* then use it like process.env.KEY_NAME
//* add .env into .gitignore file
//* we did it for ,jwt key , db key , port number

//* for vercel hosting we added vercel.json, and a "require('dotenv').config({ quiet: true });" in app.js
//* vercel hosting example youtube video link- https://www.youtube.com/watch?v=KuMbhQ4CLQ8

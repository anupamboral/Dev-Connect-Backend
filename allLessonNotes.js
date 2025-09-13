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

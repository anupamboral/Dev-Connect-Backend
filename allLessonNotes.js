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
//* So we need a request handler function , so here to handle requests we are going to use use() function.the first param is the path , if we don't mention the first param then the response will be same for all the paths, bt when we specify the path then the response will be only specific to the path mentioned
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
//! So we should never keep it on the top  because it will be triggered by any http method , so even if we use it we should it below of all other other methods.
// app.use("/user", (req, res) => {
//   res.send("testing is good😉😉😉");
// });

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

//* accessing params and using dynamic routes
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

//* creating our server using express
const express = require("express"); //* this require("express") returns a function.
//* now we can call this express function and it will create a express js application
const app = express(); //* this function call returns the express js application, so here we are creating the instance of the express js application.
//* basically we are creating a web server using express js .

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

//* now using this web server we have to listen for incoming requests on some port , so any body can connect to us using that port.
app.listen(3000, () => {
  console.log("server is listening successfully on port 3000");
}); //* using the listen method we listening to the incoming requests on port number 3000, the first parameter of this listen method is the port number , now there is second parameter which is a callback function, and this will be called when our server is up and running.

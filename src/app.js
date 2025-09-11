//* creating our server using express
const express = require("express"); //* this require("express") returns a function.
//* now we can call this express function and it will create a express js application
const app = express(); //* this function call returns the express js application, so here we are creating the instance of the express js application.
//* basically we are creating a web server using express js .

//? we can write multiple request handlers for the same path. To do that we can use a third parameter of the get method, which is another route handler function , if we don't send any response from the first handler, will it go to the second handler automatically?
//* No , the request will still hangout ,and not go to the the second handler
//* to send the request to the second handler , in the first handler function we have tpo mention another parameter , named "next", and call it inside the first handler, only then it will go to the second handler, this next is a function given by express.then only response 2 will be sent to postman/browser.

//? but what if we send the response from the first handler and also call the next() function, will it send 2 responses, will it go to the second handler/
//* first it will send the first response then because we we called the next()  function it will go to the second handler , and print the console.log but then when sending the second response it will throw an error, as javascript waits for none , so it started to execute the second handler because next() was called , but but when postman send request to our server a socket connection was made , and as soon as we sent the first response the socket connection was closed , that's why when our server will try to send the second response it will through an error that , the response has already sent. the error will be shown in the terminal - (Cannot set headers after they are sent to the client).
app.get(
  "/user",
  (req, res, next) => {
    console.log("route handler 1");
    res.send("response 1");
    next();
  },
  (req, res) => {
    console.log("route handler 2");
    res.send("response 2");
  }
);

//* now using this web server we have to listen for incoming requests on some port , so any body can connect to us using that port.
app.listen(3000, () => {
  console.log("server is listening successfully on port 3000");
}); //* using the listen method we listening to the incoming requests on port number 3000, the first parameter of this listen method is the port number , now there is second parameter which is a callback function, and this will be called when our server is up and running.

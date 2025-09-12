//* creating our server using express
const express = require("express"); //* this require("express") returns a function.
//* now we can call this express function and it will create a express js application
const app = express(); //* this function call returns the express js application, so here we are creating the instance of the express js application.
//* basically we are creating a web server using express js .

//? we can write multiple request handlers for the same path. To do that we can use a third parameter of the get method, which is another route handler function , if we don't send any response from the first handler, will it go to the second handler automatically?
//* No , the request will still hangout ,and not go to the the second handler
//* to send the request to the second handler , in the first handler function we have tpo mention another parameter , named "next", and call it inside the first handler, only then it will go to the second handler, this next is a function given by express.then only response 2 will be sent to postman/browser.

//? but what if we send the response from the first handler and below that also call the next() function, will it send 2 responses, will it go to the second handler?
//* first it will send the first response then because we we called the next()  function it will go to the second handler , and print the console.log but then when sending the second response it will throw an error, as javascript waits for none , so it started to execute the second handler because next() was called , but but when postman send request to our server a socket connection was made , and as soon as we sent the first response the socket connection was closed , that's why when our server will try to send the second response it will through an error that , the response has already sent. the error will be shown in the terminal - (Cannot set headers after they are sent to the client).

//? but what if in  the first handler first we call the next() and below that we we send the first response , then which handler's response will be returned because we  are retuning the response from the second handler also?
//* So to understand it we have to know how js code gets executed inside v8 engine's call stack, when js engine starts to execute the first handler it will first print the console log in our terminal, then in the next line it sees a next(), So a new function execution context will be created for second handler, and pushed on top of the first handler's function execution context , now second handler's code will start to execute line by line, so first console.log route handler2 will be printed then in the next line it will send the response - response 2 . then as the second handler's code is fully executed it will move out of the call stack and call stack comes back to the first handler's function execution context where it left( on next() function call) and starts the execution from the next line and it sees in the next line we are trying to send the first response,  but as the response is already sent while executing the second handler , so it will throw an error "Cannot set headers after they are sent to the client".
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

//* we can use as many route handlers as we want for a single path
//* next method is available for all of the http methods like - use(), get(), put(), post(), patch(), etc.
//* some more edge cases explained through below example
//? what if we have three route handlers , and from first and second route handler we have not sent any response and called next() in both , in the last handlers again we have not sent any response and again called next()?
//* in the postman , we will get an error "Cannot GET /profile", because in the last handler , when we are calling next() , express is expecting another route handlers after it , but we have not written any handler after the third handler, that's why , as it can not find the next route handler function after next() inside the third handler , it is returning us "Cannot GET /profile" error.
//* So express say , make as many route handlers you want to , but at the end the response should be sent, so if we create another route handler and return response from their it will word fine.
//* if in the third handler , we would not call the next() and also not returned the response then , the request will hang in the third handler , and no response would be sent, and after some time connection timeout would be shown in the postman/browser.
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

//* another way of writing multiple route handlers
//* we know in every http method , the first param is the path, then after that we can mention as many route handlers as we want , but another way is we can put all route handler functions inside one array and just mention that one array like below.
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

//* now using this web server we have to listen for incoming requests on some port , so any body can connect to us using that port.
app.listen(3000, () => {
  console.log("server is listening successfully on port 3000");
}); //* using the listen method we listening to the incoming requests on port number 3000, the first parameter of this listen method is the port number , now there is second parameter which is a callback function, and this will be called when our server is up and running.

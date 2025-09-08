//* creating our server using express
const express = require("express"); //* this require("express") returns a function.
//* now we can call this express function and it will create a express js application
const app = express(); //* this function call returns the express js application, so here we are creating the instance of the express js application.
//* basically we are creating a web server using express js .

//* we need to handle the incoming requests and send them response.
//* So we need a request handler function , so here to handle requests we are going to use use() function.the first param is the path , if we don't mention the first param then the response will be same for all the paths, bt when we specify the path then the response will be only specific to the path mentioned
app.use("/home", (req, res) => {
  res.send("hello from home page"); //* on the response we can call the send method to actually send any response to the client/browser.
});
app.use("/test", (req, res) => {
  res.send("testing is good😉😉😉");
});
//* now using this web server we have to listen for incoming requests on some port , so any body can connect to us using that port.
app.listen(3000, () => {
  console.log("server is listening successfully on port 3000");
}); //* using the listen method we listening to the incoming requests on port number 3000, the first parameter of this listen method is the port number , now there is second parameter which is a callback function, and this will be called when our server is up and running.

//* whenever we are making some change in our code we have to restart our server manually every time , so it is not updating the changes  automatically on the browser."nodemon" is a tool that helps develop Node.js based applications by automatically restarting the node application when file changes in the directory are detected. So we can install a package called nodemon using the command
//* npm i -g nodemon. here -g is for install it on global/system level so we can use it in any project.
//* now to use nodemon , when we will start running our application using terminal, instead of 'node src/app.js',  we have to write "nodemon src/app.js".
//* let's save these scripts in our package.json file , for start script we will keep node src/app.js and for dev script we will keep nodemon src/app.js, then after doing this we just need to write the script like npm run dev to to run using nodemon and npm run start to run using node.

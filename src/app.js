//* creating our server using express
const express = require("express"); //* this require("express") returns a function.
//* requiring  database.js file
const connectDb = require("./config/database");
//* now we can call this express function and it will create a express js application
const app = express(); //* this function call returns the express js application, so here we are creating the instance of the express js application.
//* basically we are creating a web server using express js .

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

  //! saving the user instance inside the database using .save() method
  await user.save(); //* as user is a instance of a User model and when we call .save() on the user instance it will be saved to the database. and this method call returns a promise so we have to use async await to handle it.
  //* this will save the user but to ensure we have successfully saved to user to the database we should always send some response to the client.
  res.send("User added successfully");
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

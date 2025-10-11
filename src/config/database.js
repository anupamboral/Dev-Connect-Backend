//* remember in one of the previous videos we created a cluster inside mongodb atlas. and from the mongodb compass app we connected to the cluster using the connection string , then created a collection and then created documents inside that collection from our code.
//* now we have to connect this express application to our cluster
//* now first of all we to create a config folder , so we will create a config folder inside our src folder, so whatever configuration we need to do inside our application we will do inside it.Inside it we will create a file named to database.js to write the logic of connecting to our database.To connect to our database we will be using a important npm library named "Mongoose".
//* Because This is a standard of building the node JS1 applications right whenever you are connecting your node js application to your Mongo database mongoose is a very elegant very amazing library to create schemas to create models and to talk to your Mongodb database right so we are going to use this library it is very very amazing and it gives you some boilerplate also code also right you can copy this code you can also go and read the documentation the documentation of Mongoose is really very very nice right there are some websites there are some libraries and packages where the documentation is not really good but mongoose has a very good documentation .

//* now first of all let's install the mongoose library using the command - npm i mongoose

//*-------

//* now let's require mongoose
const mongoose = require("mongoose");

//* then to connect to ur cluster we will use mongoose.connect("connection string") and pass the connection string and as it returns a promise and tells us if the connection is successfully established or not, so will keep it inside a async function and use await to handle the promise.

const connectDb = async () => {
  //* it is connecting to the namaste node cluster, if we want to connect to database then at last after the / we have to mention the database name - devConnect.
  await mongoose.connect(
    "mongodb+srv://anupamboral:KYExuJH0QyiEI6kg@namastenode.cw4mdf8.mongodb.net/devConnect"
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
module.exports = connectDb;

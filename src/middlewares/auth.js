const adminAuth = (req, res, next) => {
  //* admin auth checking
  console.log("admin auth is getting checked");

  const token = "xyz"; //*fake data , in real world token comes with the request.body
  const isAuthorized = token === "xyz";
  if (!isAuthorized) {
    res.status(401).send("Unauthorized request");
  } else {
    next(); //*
  }
};
const userAuth = (req, res, next) => {
  //* user auth checking
  console.log("user auth is getting checked");

  const token = "xyz"; //*fake data , in real world token comes with the request.body
  const isAuthorized = token === "xyz";
  if (!isAuthorized) {
    res.status(401).send("Unauthorized request");
  } else {
    next(); //*
  }
};
module.exports = {
  adminAuth,
  userAuth,
};

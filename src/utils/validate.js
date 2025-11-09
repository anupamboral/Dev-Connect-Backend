const { model } = require("mongoose");
const validator = require("validator");

const validateSignUpData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;

  if (!firstName || !lastName) {
    throw new Error("Enter valid first name and last name");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Enter valid email address");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error(
      "password must contain  8 characters, at least 1 Lowercase, 1 Uppercase,1 Numbers, 1 Symbol"
    );
  }
};

const validateSignInData = (req) => {
  const { emailId } = req.body;

  if (!validator.isEmail(emailId)) {
    throw new Error("Enter valid email address");
  }
};
const validateProfileEditData = (userSentData) => {
  const allowedFields = [
    "firstName",
    "lastName",
    "emailId",
    "age",
    "about",
    "skills",
    "photoUrl",
    "gender",
  ];
  console.log(allowedFields);
  console.log(Object.keys(userSentData.body));

  const isAllowed = Object.keys(userSentData.body).every((field) => {
    allowedFields.includes(field);
  }); //* it will return a boolean value
  return !isAllowed; //* boolean value
};
module.exports = {
  validateSignUpData,
  validateSignInData,
  validateProfileEditData,
};

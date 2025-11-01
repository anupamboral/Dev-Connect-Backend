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

module.exports = { validateSignUpData, validateSignInData };

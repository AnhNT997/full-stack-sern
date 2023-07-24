import bcrypt from "bcryptjs";
import db from "../models/index";
const salt = bcrypt.genSaltSync(10);

let createNewUser = async (data) => {
  let password = await HashUserPassword(data.password);
  return new Promise(async (resolve, reject) => {
    try {
      await db.User.create({
        email: data.email,
        password: password,
        firstName: data.firstName,
        lastName: data.lastName,
        address: data.address,
        phoneNumber: data.phoneNumber,
        gender: data.gender == 0 ? true : false,
        roleId: data.roleId,
      });
      resolve("create new user successfully");
    } catch (error) {
      reject(error);
    }
  });
};

let HashUserPassword = (password) => {
  return new Promise(async (resolve, reject) => {
    try {
      var passwordHashed = await bcrypt.hashSync(password, salt);
      resolve(passwordHashed);
    } catch (error) {
      reject(error);
    }
  });
};
let findUserByPK = async (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await db.User.findByPk(userId);
      resolve(user);
    } catch (error) {
      reject(error);
    }
  });
};
let verifyLogin = (userEmail, password) => {
  return new Promise(async (resolve, reject) => {
    try {
      let apiResponse = {};
      let checkEmail = await verifyEmail(userEmail);
      if (checkEmail) {
        let user = await db.User.findOne({
          where: { email: userEmail },
          raw: true,
        });
        if (user) {
          console.log(user);
          let checkPassword = await verifyPassword(password, user.password);
          if (checkPassword) {
            apiResponse.errorCode = 0;
            apiResponse.message = "Login success";
            delete user.password;
            apiResponse.user = user;
          } else {
            apiResponse.errorCode = 2;
            apiResponse.message = "Password incorrect";
          }
        } else {
          apiResponse.errorCode = 1;
          apiResponse.message = "Email not exist, please check again!";
        }
      } else {
        apiResponse.errorCode = 1;
        apiResponse.message = "Email not exist, please check again!";
      }
      resolve(apiResponse);
    } catch (error) {
      reject(error);
    }
  });
};
let verifyEmail = (userEmail) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await db.User.findOne({
        where: { email: userEmail },
        raw: true,
      });
      if (user) {
        resolve(true);
      }
      resolve(false);
    } catch (error) {
      reject(error);
    }
  });
};
let verifyPassword = (password, savePassword) => {
  return new Promise(async (resolve, reject) => {
    try {
      let checkPassword = await bcrypt.compare(password, savePassword);
      resolve(checkPassword);
    } catch (error) {
      reject(error);
    }
  });
};
module.exports = {
  createNewUser,
  findUserByPK,
  verifyLogin,
  verifyEmail,
  verifyPassword,
};

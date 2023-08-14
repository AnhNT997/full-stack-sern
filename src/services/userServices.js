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
          //   raw: true,
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

let getAllUser = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = "";
      if (userId == "all") {
        console.log("get all");
        user = await db.User.findAll({
          attributes: {
            exclude: ["password"],
          },
        });
        // console.log(user);
      } else {
        console.log("get 1");
        user = await db.User.findOne({
          where: { id: userId },
          attributes: {
            exclude: ["password"],
          },
        });
      }
      resolve(user);
    } catch (error) {
      reject(error);
    }
  });
};
let apiCreateNewUser = async (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let password = await HashUserPassword(data.password);
      let apiResponse = {};
      let checkEmail = await verifyEmail(data.email);
      //   console.log(data.email, "----", checkEmail);
      if (checkEmail === true) {
        apiResponse = {
          errorCode: 1,
          message: "Email đã được sử dụng! Vui lòng nhập email khác!",
        };
      } else {
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
        apiResponse = {
          errorCode: 0,
          message: "Tạo user thành công",
        };
      }
      resolve(apiResponse);
    } catch (error) {
      reject(error);
    }
  });
};
let apiDeleteUser = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let apiResponse = {};
      let user = await db.User.findOne({
        where: { id: userId },
        raw: false,
      });
      //   console.log(user);
      if (user) {
        await user.destroy();
        apiResponse = {
          errorCode: 0,
          message: "Xóa thành công",
        };
      } else {
        apiResponse = {
          errorCode: 1,
          message: "User không tồn tại",
        };
      }
      resolve(apiResponse);
    } catch (error) {
      reject(error);
    }
  });
};
let apiUpdateUser = async (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let apiResponse = {};
      let user = await db.User.findOne({
        where: { id: data.id },
        raw: false,
      });
      //   console.log(user);
      if (user) {
        // user.email= data.email;
        // user.password= password;
        user.firstName = data.firstName ? data.firstName : user.firstName;
        user.lastName = data.lastName ? data.lastName : user.lastName;
        user.address = data.address ? data.address : user.address;
        user.phoneNumber = data.phoneNumber
          ? data.phoneNumber
          : user.phoneNumber;
        // user.gender= data.gender == 0 ? true : false;
        // user.roleId= data.roleId;
        await user.save();
        apiResponse = {
          errorCode: 0,
          message: "Cập nhật thành công",
        };
      } else {
        apiResponse = {
          errorCode: 1,
          message: "User không tồn tại",
        };
      }
      resolve(apiResponse);
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
  getAllUser,
  apiCreateNewUser,
  apiDeleteUser,
  apiUpdateUser,
};

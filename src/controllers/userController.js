import UserServices from "../services/userServices";
import db from "../models/index";
import user from "../models/user";
let listUsers = async (req, res) => {
  let data;
  try {
    data = await db.User.findAll();
    // console.log(data);
    return res.render("user/listUser.ejs", {
      listUser: data,
    });
  } catch (error) {
    console.error("Exception getHomePage function from HomeController:", error);
  }
};

let createUser = (req, res) => {
  return res.render("user/createUser.ejs");
};
let createNewUser = async (req, res) => {
  let message = await UserServices.createNewUser(req.body);
  console.log(message);
  return res.redirect("/user/create");
};
let editUser = async (req, res) => {
  let user = await UserServices.findUserByPK(req.params.userId);
  res.render("user/editUser.ejs", { userData: user });
};
let userLogin = async (req, res) => {
  let apiResponse = {};
  let userEmail = req.body.email;
  let password = req.body.password;
  if (!userEmail || !password) {
    apiResponse.errorCode = 5;
    apiResponse.message = "Missed require input";
  } else {
    apiResponse = await UserServices.verifyLogin(userEmail, password);
  }
  console.log(apiResponse);
  return res.status(200).send(apiResponse);
};
let apiGetAllUser = async (req, res) => {
  let userId = req.query.userId ? req.query.userId : "";
  userId = userId.toLowerCase();
  console.log(req.query);
  let apiResponse = {};
  if ((isNaN(userId) && userId !== "all") || !userId) {
    apiResponse = {
      errorCode: 1,
      message: "User ID không hợp lệ, vui lòng kiểm tra lại",
    };
  } else {
    let user = await UserServices.getAllUser(userId);
    if (!user) {
      apiResponse = {
        errorCode: 2,
        message: "User ID không tồn tại, vui lòng kiểm tra lại!",
      };
    } else {
      apiResponse = {
        errorCode: 0,
        message: "User ID hợp lệ!",
        users: user,
      };
    }
  }
  return res.status(200).send(apiResponse);
};
let apiCreateNewUser = async (req, res) => {
  let apiResponse = {};
  let data = req.body.data;
  if (!data) {
    apiResponse = {
      errorCode: 2,
      message: "Data is empty!",
    };
  } else {
    apiResponse = await UserServices.apiCreateNewUser(data);
  }
  return res.status(200).send(apiResponse);
};
let apiDeleteUser = async (req, res) => {
  let apiResponse = {};
  let userId = req.body.userId ? req.body.userId : "";
  if (!userId || isNaN(userId)) {
    apiResponse = {
      errorCode: 2,
      message: "Missing required parameter",
    };
  } else {
    apiResponse = await UserServices.apiDeleteUser(userId);
  }
  return res.status(200).send(apiResponse);
};
let apiUpdateUser = async (req, res) => {
  console.log("try update", req.body.data);
  let apiResponse = {};
  apiResponse = await UserServices.apiUpdateUser(req.body.data);
  return res.status(200).send(apiResponse);
};
module.exports = {
  listUsers,
  createUser,
  createNewUser,
  editUser,
  userLogin,
  apiGetAllUser,
  apiCreateNewUser,
  apiDeleteUser,
  apiUpdateUser,
};

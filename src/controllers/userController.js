import UserServices from "../services/userServices";
import db from "../models/index";
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
module.exports = {
  listUsers,
  createUser,
  createNewUser,
  editUser,
  userLogin,
};

import express from "express";
import homeController from "../controllers/homeController";
import userController from "../controllers/userController";
let router = express.Router();

let initWebRoutes = (app) => {
  router.get("/", homeController.getHomePage);
  router.get("/about", homeController.getAboutPage);

  // User controller routes
  router.get("/user/list", userController.listUsers);
  //   router.get("/user/detail", userController.detailUser);
  router.get("/user/create", userController.createUser);
  router.post("/user/create", userController.createNewUser);
  router.get("/user/edit/:userId", userController.editUser);
  //   router.get("/user/update/:userId", userController.updateUser);
  //   router.get("/user/delete/:userId", userController.deleteUser);

  //   api
  router.post("/api/v1/user-login", userController.userLogin);

  return app.use("/", router);
};

module.exports = initWebRoutes;

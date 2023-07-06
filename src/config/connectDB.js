const { Sequelize } = require("sequelize");
const sequelize = new Sequelize("nodejsbasic", "root", "", {
  host: "localhost",
  dialect: "mysql",
  logging: false,
});
let connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("connected");
  } catch (error) {
    console.error("error: ", error);
  }
};
module.exports = connectDB;

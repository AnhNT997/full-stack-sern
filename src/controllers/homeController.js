import db from "../models/index";
let getHomePage = async (req, res) => {
  let data;
  try {
    data = await db.User.findAll();
    console.log(data);
  } catch (error) {
    console.error("Exception getHomePage function from HomeController:", error);
  }
  return res.render("homepage.ejs", {
    datUser: data,
  });
};

let getAboutPage = (req, res) => {
  return res.render("test/about.ejs");
};

// object: {
//     key: '',
//     value: ''
// }
module.exports = {
  getHomePage: getHomePage,
  getAboutPage: getAboutPage,
};

const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: {
    register: "./src/register/index.js",
    login: "./src/login/index.js",
    profile: "./src/profile/index.js",
    matches: "./src/matches/index.js",
    userDetails: "./src/userDetails/index.js",
    index: "./src/utils/general.js",
    about: "./src/utils/general.js",
    contact: "./src/utils/general.js",
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/register.html",
      inject: true,
      chunks: ["register"],
      filename: "register.html",
    }),
    new HtmlWebpackPlugin({
      template: "./src/login.html",
      inject: true,
      chunks: ["login"],
      filename: "login.html",
    }),
    new HtmlWebpackPlugin({
      template: "./src/profile.html",
      inject: true,
      chunks: ["profile"],
      filename: "profile.html",
    }),
    new HtmlWebpackPlugin({
      template: "./src/matches.html",
      inject: true,
      chunks: ["matches"],
      filename: "matches.html",
    }),
    new HtmlWebpackPlugin({
      template: "./src/userDetails.html",
      inject: true,
      chunks: ["userDetails"],
      filename: "userDetails.html",
    }),
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      inject: true,
      chunks: ["index"],
      filename: "index.html",
    }),
    new HtmlWebpackPlugin({
      template: "./src/about.html",
      inject: true,
      chunks: ["about"],
      filename: "about.html",
    }),
    new HtmlWebpackPlugin({
      template: "./src/contact.html",
      inject: true,
      chunks: ["contact"],
      filename: "contact.html",
    }),
  ],
};

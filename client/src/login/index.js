import axios from "axios";
import "bootstrap";
import "../scss/main.scss";
const path = require("path");
import "./../utils/loginCheck";
import { url } from "./../utils/general";
// Dom caching
const email = document.querySelector('input[name="email"]');
const password = document.querySelector('input[name="password"]');
const signIn = document.querySelector("#sign--in");
const alert = document.getElementById("alert");

signIn.addEventListener("click", async (e) => {
  e.preventDefault();

  const data = getUserData();
  const isPosted = await postToServer(data);
  if (isPosted) {
    window.location = "profile.html";
  }
});

function getUserData() {
  // Just for testing purposes
  /*
    return {
        email: "hbrehman111@gmail.com",
        password: "hbrehman007",
    }
*/

  // Actual logic
  return {
    email: email.value,
    password: password.value,
  };
}

async function postToServer(userData) {
  try {
    // send a post request to api
    let response = await axios.post(`${url}v1/api/users/login`, userData);
    console.log(response.data);
    if (response.data.token) {
      // localStorage.setItem("x-auth-token", response.headers["x-auth-token"]);
      localStorage.setItem("x-auth-token", response.data.token);
      // console.log("x-auth-token", response.headers);
      return true;
    } else {
      showError("There was an error while logging in please try again later");
    }
  } catch (ex) {
    // log the exception on console
    console.log(ex, "exception thrown");
    // if there is any error in input send it to UI
    if (ex.response) showError(ex.response.data.message);
    return false;
  }
}

const showError = (message) => {
  alert.className = "alert alert-danger text-center";
  alert.innerHTML = message;
  const alertInterval = setInterval(() => {
    alert.className = "";
    alert.innerHTML = "";
    clearInterval(alertInterval);
  }, 10000);
};

//   console.log(response.data);
//   console.log(response.status);
//   console.log(response.statusText);
//   console.log(response.headers);
//   console.log(response.config);
//

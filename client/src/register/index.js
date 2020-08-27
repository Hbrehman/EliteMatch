import axios from "axios";

import "bootstrap";
import "../scss/main.scss";
import "./../utils/loginCheck";
import { url } from "./../utils/general";

// Dom caching
const name = document.querySelector('input[name="name"]');
const phone = document.querySelector('input[name="phone"]');
const email = document.querySelector('input[name="email"]');
const password = document.querySelector('input[name="password"]');
const gender = document.querySelector('input[name="gender"]');
const country = document.querySelector('input[name="country"]');
const dob = document.querySelector('input[name="dob"]');
const religion = document.querySelector('select[name="religion"]');
const signUp = document.querySelector("#sign--up");
const alert = document.getElementById("alert");

signUp.addEventListener("click", async (e) => {
  e.preventDefault();

  const data = getUserData();

  const response = await postToServer(data);
  console.log(response);
  if (response.status === 201) {
    window.location = "profile.html";
  }
});

function getUserData() {
  // Just for testing purposes
  /*
  return {
    name: "hbrehman",
    phone: "923000687231",
    email: "hbrehman98@gmail.com",
    password: "hbrehman007",
    gender: "male",
    country: "Pakistan",
    religion: "Islam",
    dob: 29 - 10 - 1998,
  };
*/
  // Actual logic

  return {
    name: name.value,
    phone: phone.value,
    email: email.value,
    password: password.value,
    gender: gender.value,
    country: country.value,
    religion: religion.value,
    dob: dob.value,
  };
}

async function postToServer(userData) {
  try {
    // send a post request to api
    let response = await axios.post(`${url}v1/api/users/signup`, userData);
    // console.log(response.headers["x-auth-token"]);

    localStorage.setItem("x-auth-token", response.data.token);
    return response;
  } catch (ex) {
    // log the exception on console
    console.log(ex.response);
    // if there is any error in input send it to UI
    if (ex.response) showError(ex.response.data.message);
    return false;
  }
}

const showError = (message) => {
  if (/dob/.test(message)) {
    message = "Please Enter a valid Date of Birth...";
  }
  alert.className = "alert alert-danger text-center";
  alert.innerHTML = message;
  const alertInterval = setInterval(() => {
    alert.className = "";
    alert.innerHTML = "";
    console.log("hello wrold");
    clearInterval(alertInterval);
  }, 10000);
};

//   console.log(response.data);
//   console.log(response.status);
//   console.log(response.statusText);
//   console.log(response.headers);
//   console.log(response.config);
//

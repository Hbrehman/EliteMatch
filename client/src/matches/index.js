import axios from "axios";
import jwtDecode from "jwt-decode";

import "bootstrap";
import "../scss/main.scss";

import "./../utils/loginCheck";
import { url } from "./../utils/general";
import { staticUrl } from "./../utils/general";

const matchesParent = document.getElementById("matches-parent");
const userInfoBtn = document.getElementById("learn-more-btn");
const expressInterestBtn = document.getElementById("express-interest");

getAllUsers();
async function getAllUsers() {
  let response = await axios.get(`${url}v1/api/users/getMatches`);

  // console.log(response.data.data);
  listMatchesOnUI(response.data.data);
}

matchesParent.addEventListener("click", (e) => {
  if (e.target.id === "express-interest") {
    const userId = e.target.dataset.userid;
    const token = localStorage.getItem("x-auth-token");
    if (token) {
      const { id } = jwtDecode(token);
      updateOneDataEl({ interestedPpl: id }, userId);
      $("#interest-modal").modal("show");
    } else {
      //
    }
  }
});

async function updateOneDataEl(data, userId) {
  try {
    let response = await axios.patch(
      `${url}v1/api/users/basic/${userId}`,
      data
    );
    console.log(response);
    return response;
  } catch (ex) {
    console.log(ex.response.data.message, resource);
    console.log(ex);
  }
}

async function listMatchesOnUI(matches) {
  console.log(matches);
  console.log("45");
  const token = localStorage.getItem("x-auth-token");
  if (token) {
    const { id } = jwtDecode(token);
    try {
      let response = await axios.get(`${url}v1/api/users/basic/${id}`);
      console.log(response.data.data);
      matches = matches.filter((c) => {
        if (response.data.data.gender != c.gender) return c;
      });
    } catch (ex) {
      console.log(ex);
    }
  }

  let markup = "";
  matches.forEach((current) => {
    markup += `<div>
    <div class="row my-3">
      <div class="col-sm-4 d-flex justify-content-center">
        <div id="match__img">
          <img src="${staticUrl}img/user/${current.photo}" alt="" />
        </div>
      </div>
      <div class="col-sm-8 mt-4">
        <div id="match__data" class="">
          <h3>Name</h3>
          <span>: ${current.name}</span>
        </div>
        <div id="match__data" class="">
          <h3>Eamil</h3>
          <span>: ${current.email}</span>
        </div>
        <div id="match__data" class="">
          <h3>Phone</h3>
          <span>: ${current.phone}</span>
        </div>
        <div id="match__data" class="">
          <h3>Gender</h3>
          <span>: ${current.gender}</span>
        </div>
        <div id="match__data" class="">
          <h3>Date of Birth</h3>
          <span>: ${current.dob}</span>
        </div>
        <div id="match__data" class="">
          <h3>Religion</h3>
          <span>: ${current.religion}</span>
        </div>
        <div id="match__data" class="">
          <h3>Country</h3>
          <span>: ${current.country}</span>
        </div>
        <div id="buttons" class="my-3">
          <button id="express-interest" class="btn btn-primary btn-lg ml-5" data-userid="${current._id}">
            Express interest
          </button>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col" id="about-match">
        <h3>
          About Myself:
        </h3>
        <p>
          <span>Hi!i am ${current.name}</span> ${current.usersEbl.about}
        </p>
      </div>
    </div>
  </div>`;
  });
  {
    // <button id="learn-more-btn" class="btn btn-primary btn-lg" data-userInfo="${JSON.stringify(
    //   current
    // )}">Learn More</button>
    /* <button class="btn btn-primary btn-lg">Send Email</button> */
  }
  matchesParent.insertAdjacentHTML("beforeend", markup);
}

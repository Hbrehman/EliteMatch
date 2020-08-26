import jwt_decode from "jwt-decode";
const navbarBtns = document.querySelector(".navbar-btns");
const token = localStorage.getItem("x-auth-token");
let markup = "";
if (token) {
  const userId = jwt_decode(token).id;
  if (userId) {
    markup = `<a
    class="btn1 btn btn-outline-light py-2 px-3"
    id="logoutBtn"
    href="login.html"
    >Log Out</a
  >
  <a
    class="btn1 btn btn-outline-light py-2 px-3 ml-2"
    href="profile.html"
    >My Profile</a
  >`;
  }
} else {
  markup = `<a class="btn1 btn btn-outline-light py-2 px-3" href="login.html"
    >Log In</a
  >
  <a
    class="btn1 btn btn-outline-light py-2 px-3 ml-2"
    href="register.html"
    >Register</a
  >`;
}
navbarBtns.insertAdjacentHTML("beforeend", markup);
// Clear storage to logout user
const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    localStorage.clear();
  });
}

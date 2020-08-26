import "bootstrap";
import "../scss/main.scss";

export const elements = {
  InfoSubmit: document.querySelector("#ebl_submit_btn"),
  FamilySubmit: document.querySelector("#family_submit_btn"),
  InterestSubmit: document.querySelector("#interest_submit_btn"),
  formsParent: document.querySelector("#forms-row"),
  registerSec: document.querySelector("#register"),
  userAvatar: document.querySelector("#user-avatar"),
  profilePic: document.querySelector("#user-pic"),
  logoutBtn: document.querySelector("#logoutBtn")
};

// export const renderFormsHeading = () => {
//   let choice = "";
//   const childCount = elements.formsParent.childElementCount;
//   if (childCount > 1) {
//     choice = "forms";
//   } else if (childCount === 1) {
//     choice = "form";
//   } else {
//     return;
//   }
//   const markup = `<div id="about-us" class="row text-center forms-heading">
//   <div class="col">
//   <h3 class="pb-3">
//     Please fill out the ${choice} below and let people know more about you
//   </h3></div>
// </div>`;
//   // elements.formsParent.appendChild(markup);
//   elements.registerSec.insertAdjacentHTML("afterbegin", markup);
// };

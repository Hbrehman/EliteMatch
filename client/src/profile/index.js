let flag = 3;

import jwt_decode from "jwt-decode";

import { elements } from "./base";
import "./../utils/loginCheck";

import {
  getFormInput,
  inputValidator,
  showError,
  renderBasicInfo,
  renderEBLform,
  renderInterestform,
  renderFamilyform,
  renderInfo,
  removeHeading,
  prepareUI,
  formatKey,
} from "./view/profile_view";

import {
  getBasicInfo,
  postData,
  getData,
  uploadProfPic,
  updateOneDataEl,
} from "./model/Profile_model";

var token = localStorage.getItem("x-auth-token");
if (token) {
  const userId = jwt_decode(token).id;

  // Users basic info including name, email etc....
  getAndRenderBasicInfo();
  async function getAndRenderBasicInfo() {
    // Get basic information from database
    const info = await getBasicInfo("basic", userId);
    // Render Basic information
    renderBasicInfo(info.data);
  }

  // Get and uplaod Upload profile pic
  elements.userAvatar.addEventListener("change", async () => {
    const input = document.querySelector("#user-avatar").files[0];
    const form = new FormData();
    form.append("photo", input);
    const response = await uploadProfPic("profilePic", form, userId);
    if (response.status === 200) {
      setTimeout(() => {
        elements.profilePic.setAttribute(
          "src",
          `http://localhost:8000/img/user/${response.data.data.photo}`
        );
      }, 0);
    }
  });

  // Users Education, Basics and Lifestyle information etc....
  queryDbAndRender("ebl");
  queryDbAndRender("interest");
  queryDbAndRender("family");

  async function queryDbAndRender(infoType) {
    const result = await getData(infoType, userId);
    // console.log(result);
    // if status fails show forms on UI to get information...
    if (result.data.status === "fail") {
      if (infoType === "ebl") renderEBLform();
      if (infoType === "interest") renderInterestform();
      if (infoType === "family") renderFamilyform();
    } else if (result.data.status === "success") {
      // if data is present in  database then show data on UI
      renderInfo(result, infoType);
      --flag;
      if (flag === 0) {
        removeHeading();
      }
    }
  }

  // education basics and lifestyle Details
  elements.formsParent.addEventListener("click", async (e) => {
    e.preventDefault();
    const btn = e.target.closest("#ebl_submit_btn");
    if (btn) {
      getAndPostData("ebl", userId);
    }
  });

  // Users interest Details
  elements.formsParent.addEventListener("click", async (e) => {
    e.preventDefault();
    const btn = e.target.closest("#interest_submit_btn");
    if (btn) {
      getAndPostData("interest", userId);
    }
  });

  // Family Details
  elements.formsParent.addEventListener("click", async (e) => {
    e.preventDefault();
    const btn = e.target.closest("#family_submit_btn");
    if (btn) {
      getAndPostData("family", userId);
    }
  });

  // Get users input and post it to server...
  async function getAndPostData(type, userID) {
    const result = getFormInput(`${type}_info`);

    // validate input
    let message = inputValidator(result); //return name of invalid field or will return true
    if (message === true) {
      console.log(message, "this true");
      // If valid Post data to server...
      const response = await postData(result, type, userID);
      if (response) {
        prepareUI(type);
        queryDbAndRender(type);
      }
    } else {
      message = `${formatKey(message)} is not Allowed be Empaty.`;
      showError(message, type);
    }
  }

  function spanToInputNdEditToSave(editBtn) {
    // conversion from Span to Input
    const span = editBtn.parentElement.children[1];
    const spanData = span.textContent;
    const heading = editBtn.parentElement.children[0];
    const input = document.createElement("input");
    input.autofocus = true;
    input.setAttribute("type", "text");
    input.setAttribute("id", "edit__input");
    input.value = spanData;
    editBtn.parentElement.replaceChild(input, span);
    input.focus();
    // Conversion of edit btn into save btn
    const saveBtn = document.createElement("button");
    saveBtn.textContent = "Save";
    saveBtn.setAttribute("id", "save__btn");
    saveBtn.className = "ml-auto";
    editBtn.parentElement.replaceChild(saveBtn, editBtn);
    return {
      heading,
      input,
      saveBtn,
      span,
    };
  }

  function backToSpanAndEdit(span, val, input, saveBtn) {
    span.textContent = val;
    input.parentElement.replaceChild(span, input);
    saveBtn.style.display = "none";
    const editBtn =
      '<button id="edit__btn" class="ml-auto text-center">Edit</button>';
    span.parentElement.insertAdjacentHTML("beforeend", editBtn);
  }

  function createDataEl(input, heading, preKey) {
    let val = input.value;
    let key = heading.getAttribute("id");
    // if preKey (usersEbl, interestInfo, familyInfo) exit then prefix key with them
    if (preKey) key = `${preKey}.${key}`;

    let data = {
      [key]: val,
    };
    if (data[key] < 1) {
      alert(
        `${heading.textContent.slice(
          0,
          heading.textContent.length - 2
        )} Should not be Empty...`
      );
      data = null;
      val = null;

      return { data, val };
    }
    return { data, val };
  }

  document.querySelector("#basic-info").addEventListener("click", (e) => {
    let editBtn = e.target.closest("#edit__btn");

    if (editBtn) {
      const { input, saveBtn, heading, span } = spanToInputNdEditToSave(
        editBtn
      );
      saveBtn.addEventListener("click", async () => {
        const { data, val } = createDataEl(input, heading);

        if (!data) return input.focus();
        const res = await updateOneDataEl(data, "basic", userId);
        if (!res) return input.focus();
        backToSpanAndEdit(span, val, input, saveBtn);
      });
    }
  });

  // code to update users extended information
  document.querySelector("#user-data").addEventListener("click", (e) => {
    const editBtn = e.target.closest("#edit__btn");
    const ebl = e.target.closest("#ebl");
    const interest = e.target.closest("#interest");
    const family = e.target.closest("#family");

    if (editBtn) {
      const { input, saveBtn, heading, span } = spanToInputNdEditToSave(
        editBtn
      );
      saveBtn.addEventListener("click", async () => {
        if (ebl) {
          var { data, val } = createDataEl(input, heading, "usersEbl");
          if (!data) return input.focus();
          const res = await updateOneDataEl(data, "ebl", userId);
          if (!res) return input.focus();
        } else if (interest) {
          var { data, val } = createDataEl(input, heading, "userInterest");

          if (!data) return input.focus();
          const res = await updateOneDataEl(data, "interest", userId);
          if (!res) return input.focus();
        } else if (family) {
          var { data, val } = createDataEl(input, heading, "familyInfo");

          if (!data) return input.focus();
          const res = await updateOneDataEl(data, "family", userId);
          if (!res) return input.focus();
        }

        backToSpanAndEdit(span, val, input, saveBtn);
      });
    }
  });
} else {
  console.log("There is no token");
}

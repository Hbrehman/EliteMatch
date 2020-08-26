import { elements } from "./../base";
import $ from "jquery";
import axios from "axios";

const generateBasicInfo = (data) => {
  let markup = "";
  console.log(data);
  for (let key in data) {
    if (key === "photo") {
      elements.profilePic.setAttribute(
        "src",
        `http://localhost:8000/img/user/${data[key]}`
      );
      continue;
    } else if (key === "dob") {
      const date = data[key];
      data[key] = date.split("T")[0];
    }
    markup += `
    <div id="match__data" class="d-flex">
      <h3 id="${key}">${formatKey(key)} :</h3>
      <span class="user_phone">${data[key]}</span>
      <button id="edit__btn" class="ml-auto text-center">Edit</button>
    </div>`;
  }
  return markup;
};

async function populateModal(interestId) {
  const msgForInterest = document.getElementById("msg-for-interest");
  const dismissBtn = document.getElementById("dismiss-btn");
  const viewProfileBtn = document.getElementById("view-prof-btn");
  try {
    let response = await axios.get(
      `http://localhost:8000/v1/api/users/basic/${interestId}`
    );
    console.log(response);
    // interstName.textContent = response.data.data.name;
    const markup = `<b>${response.data.data.name}</b> has shown interest in you,
    feel free to contact at <b>${response.data.data.phone}</b>`;
    msgForInterest.insertAdjacentHTML("beforeend", markup);
  } catch (ex) {
    console.log(ex);
  }

  dismissBtn.addEventListener("click", async () => {
    try {
      console.log(interestId);
      let response = await axios.patch(
        `http://localhost:8000/v1/api/users/basic/${interestId}`,
        { interestedPpl: "" }
      );
      console.log(response);
      $("#interest-modal").modal("hide");
      // return response;
    } catch (ex) {
      console.log(ex);
    }
  });
}

export const renderBasicInfo = (data) => {
  if (data.data.interestedPpl) {
    console.log("this user is interested in you");
    $("#interest-modal").modal("show");
    populateModal(data.data.interestedPpl);
    delete data.data.interestedPpl;
  }
  const markup = `<div id="about-us">
    <h3 id="user_name">${data.data.name}</h3>
  </div>
  ${generateBasicInfo(data.data)}
`;
  document.querySelector("#basic-info").insertAdjacentHTML("beforeend", markup);
};

// Generate user about section

const generateAbout = (data) => {
  const markup = `
  <div class="col" style="border-bottom: 1px dotted #4a4a4a;" >
    <h3>About Myself: </h3>
    <p><span>Hi! I am ${data.name},</span> ${data.data.about}</p>
  </div>`;
  document
    .querySelector("#about-match")
    .insertAdjacentHTML("beforeend", markup);
};

function formatDate(data) {
  data.date = date.split("T")[0];
  console.log(data);
}

// Generate List
const generateList = (data) => {
  let markup = "";
  for (let c in data) {
    if (c !== "_id" && c !== "about") {
      markup += `
      <div id="match__data" class="d-flex">
        <h3 id="${c}">${formatKey(c)}: </h3>
        <span class="user_name_1">${data[c]}</span>
        <button id="edit__btn" class="ml-auto text-center">Edit</button>
      </div>`;
    }
  }
  return markup;
};

// Render user information on UI
export const renderInfo = (data, type) => {
  let markup;
  if (type === "ebl") {
    generateAbout(data.data);
    markup = `<div class="col-md-6" id=${type}>
    <h3 id="form-text">${data.data.message}</h3>
    ${generateList(data.data.data)}
    </div>`;
  } else {
    markup = `<div class="col-md-6" id=${type}>
    <h3 id="form-text">${data.data.message}</h3>
    ${generateList(data.data.data)}
    </div>`;
  }

  document.querySelector("#user-data").insertAdjacentHTML("beforeend", markup);
};

// Remove Heading

export const removeHeading = () => {
  elements.formsParent.innerHTML = "";
};

// validate input
export const inputValidator = (data) => {
  for (let c in data) {
    if (data.hasOwnProperty(c)) {
      // console.log(data[c].length);
      if (data[c].length < 1) {
        return c;
      }
    }
  }
  return true;
};

// show error message
export const showError = (message, form_type) => {
  // console.log(message, form_type);
  const alert = document.querySelector(`#alert-${form_type}`);
  alert.className = "alert alert-danger text-center";
  alert.innerHTML = message;
  alert.scrollIntoView({ behavior: "smooth", inline: "nearest" });
  setTimeout(() => {
    alert.className = "";
    alert.innerHTML = "";
  }, 10000);
};
// get form input
export const getFormInput = (formId) => {
  var result = {};
  $.each($(`#${formId}`).serializeArray(), function () {
    result[this.name] = this.value;
  });
  return result;

  /*// Just for testing purposes

  if (formId === "ebl_info") {
    return {
      education: "B.Sc",
      profession: "Programmer",
      motherTongue: "Urdu",
      complexion: "Fair",
      weight: "67",
      diet: "Non-veg",
      height: "5-8",
      about:
        "I run my own race I don't have desire to play game of being better than anyone...",
    };
  } else if (formId === "interest_info") {
    return {
      age: "21",
      maritalStatus: "Single",
      complexion: "Fair",
      height: "5-8",
      caste: "Maliq",
      religion: "Islam",
      diet: "Non-veg",
    };
  } else if (formId === "family_info") {
    return {
      caste: "Maliq",
      fatherName: "Muhammad Zulfiqar Ali",
      fathersEdu: "B.A",
      mothersName: "Emma Watson",
      mothersOcu: "Teacher",
      noBros: "1",
      noSis: "1",
    };
  }*/
};

export const prepareUI = (type) => {
  let form = document.querySelector(`#${type}-form`);
  form = elements.formsParent.removeChild(form);
};

export const formatKey = (key) => {
  if (key === "dob") {
    return "Date Of Birth";
  } else if (key === "motherTongue") {
    return "Mother Tongue";
  } else if (key === "maritalStatus") {
    return "Mrital Status";
  } else if (key === "fatherName") {
    return "Father Name";
  } else if (key === "fathersEdu") {
    return "Father Education";
  } else if (key === "mothersName") {
    return "Mother Name";
  } else if (key === "mothersOcu") {
    return "Mother Occupation";
  } else if (key === "noBros") {
    return "No. of brothers";
  } else if (key === "noSis") {
    return "No. of sisters";
  } else {
    return `${key.charAt(0).toUpperCase() + key.slice(1)}`;
  }
};

// render Family information form to UI
export const renderFamilyform = () => {
  const markup = `<div class="col-md-4  my-2 form-style" id="family-form">
  <form  id="family_info" style="height: 100%;"  autocomplete="off"> 
  <div id="info-form" style="display: flex; flex-direction: column;">
   <h3 class="text-center" id="form-text">Family Details </h3>

    <div id="alert-family"></div>
     
    <div id="input-parent">
      <span >Caste:</span>  
      <input type="text"  name="caste" required class="input-itself" placeholder="Caste" >
  </div>
      <div id="input-parent">
        <span >Fathers Name:</span>  
        <input type="text" name="fatherName" class="input-itself" minlength="3" maxlength="255" placeholder="Fathers Name" >
      </div>

      <div id="input-parent">
        <span >Fathers Education:</span>  
        <input type="text" name="fathersEdu" minlength="3" maxlength="20"  class="input-itself"  placeholder="Fathers Education" >
      </div>

      <div id="input-parent">
          <span >Mothers Name:</span>  
          <input type="text" name="mothersName" class="input-itself" placeholder="Mothers Name" >
      </div>

      <div id="input-parent">
          <span >Mothers Occupation:</span>  
          <input type="text"  name="mothersOcu" class="input-itself" placeholder="Mothers Occupation" >
      </div>

      <div id="input-parent">
          <span> No. of Brothers:</span>  
          <input type="text" minlength="3" name="noBros" class="input-itself" placeholder="No. Of Brothers" >
      </div>

      <div id="input-parent">
          <span> No. of Sisters:</span>  
          <input type="text" name="noSis" class="input-itself" placeholder="No of Sisters" >
      </div>

      <button id="family_submit_btn" type="submit" class="btn btn-block btn-primary mt-auto">
        Submit
      </button>
      <b class="text-danger m-0" style="font-size: 12px">All Fields in this table are mendatory </b>

  </div>
</form>
</div>`;

  document.querySelector("#forms-row").insertAdjacentHTML("beforeend", markup);
};

// Render Interest Form to UI
export const renderInterestform = () => {
  const markup = `<div class="col-md  my-2 form-style" style="max-width: 380px"; id="interest-form">
  <form id="interest_info" style="height: 100%;" autocomplete="off"> 
  <div id="info-form" style="display: flex; flex-direction: column;">
   <h3 class="text-center" id="form-text">What I am Looking For </h3>

    <div id="alert-interest"></div>
     
      <div id="input-parent">
        <span >Age:</span>  
        <input type="text" name="age" class="input-itself"  placeholder="Age" >
      </div>

      <div id="input-parent">
        <span >Marital Status:</span>  
        <input type="text" name="maritalStatus" minlength="3" maxlength="20"  class="input-itself"  placeholder="Marital Status" >
      </div>

      <div id="input-parent">
          <span >Complexion:</span>  
          <input type="text" name="complexion" class="input-itself" placeholder="Complexion" >
      </div>

      <div id="input-parent">
          <span >Height:</span>  
          <input type="text"  name="height" class="input-itself" placeholder="Height" >
      </div>

      <div id="input-parent">
          <span> Caste:</span>  
          <input type="text" minlength="3" name="caste" class="input-itself" placeholder="Caste" >
      </div>

      <div id="input-parent">
          <span> Religion:</span>  
          <input type="text" name="religion" class="input-itself" placeholder="Religion" >
      </div>

      <div id="input-parent">
          <span> Diet:</span>  
          <input type="text" minlength="3" name="diet" class="input-itself" placeholder="Dite" >
      </div>

      <button id="interest_submit_btn" type="submit" class="btn btn-block btn-primary" style="margin-top: auto !important;">
        Submit
      </button>
      <b class="text-danger" style="font-size: 12px">All Fields in this table are mendatory </b>
  </div>
</form>
</div>
`;

  document.querySelector("#forms-row").insertAdjacentHTML("beforeend", markup);
};

// render Education, Basics and lifestyle form to UI
export const renderEBLform = () => {
  const markup = `<div class="col-md-4 my-2 form-style" id="ebl-form">
  <form id="ebl_info" style="height: 100%;" autocomplete="off"> 
    <div id="info_form" style="display: flex; flex-direction: column;">
     <h3 class="text-center" id="form-text">Education, Basics & Lifestyle </h3>

      <div id="alert-ebl"></div>
       
        <div id="input-parent">
          <span >Education:</span>  
          <input type="text" name="education" required class="input-itself" minlength="3" maxlength="255" placeholder="Education" >
        </div>

        <div id="input-parent">
          <span >Profession:</span>  
          <input type="text" name="profession" required minlength="3" maxlength="20"  class="input-itself"  placeholder="Profession" >
        </div>

        <div id="input-parent">
            <span >Mother Tongue:</span>  
            <input type="text" name="motherTongue" required class="input-itself" placeholder="Mother Tongue" >
        </div>


        <div id="input-parent">
            <span> Complexion:</span>  
            <input type="text" minlength="3" name="complexion" class="input-itself" required placeholder="Complexion" >
        </div>

        <div id="input-parent">
            <span> Weight:</span>  
            <input type="text" name="weight" required class="input-itself" placeholder="Weight" >
        </div>

        <div id="input-parent">
            <span> Diet:</span>  
            <input type="text" required minlength="3" name="diet" class="input-itself" placeholder="Diet" >
        </div>

        <div id="input-parent">
            <span> Height:</span>  
            <input type="text" required minlength="3" name="height" class="input-itself" placeholder="Height" >
        </div>

        <div id="input-parent" class="pb-4">
            <span> About Yourself:</span>  
            <textarea type="text" minlength="10" maxlength="500" required name="about" rows="1" class="input-itself mb-0" placeholder="Describe Yourself (200-500 words)" ></textarea>
        </div>

        <button id="ebl_submit_btn" type="submit" class="btn btn-block btn-primary mt-auto">
          Submit
        </button>
        <b class="text-danger m-0" style="font-size: 12px">All Fields in this table are mendatory </b>

    </div>
  </form>
</div>`;

  document.querySelector("#forms-row").insertAdjacentHTML("beforeend", markup);
};

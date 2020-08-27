import axios from "axios";
import { showError } from "./../view/profile_view";
import { url } from "./../../utils/general";
import { staticUrl } from "./../../utils/general";

export const uploadProfPic = async (resource, data, userId) => {
  try {
    let response = await axios.patch(
      `${url}v1/api/users/${resource}/${userId}`,
      data
    );
    return response;
  } catch (ex) {
    console.log(ex);
  }
};

export const getImage = async () => {
  try {
    let response = await axios.get(
      `${staticUrl}img/user/userName-1582717102157.jpeg`
    );
    return response;
  } catch (ex) {
    console.log(ex);
  }
};

export const getBasicInfo = async (resource, userId) => {
  try {
    let response = await axios.get(`${url}v1/api/users/${resource}/${userId}`);
    return response;
  } catch (ex) {
    console.log(ex);
  }
};

export async function postData(data, resource, userId) {
  try {
    // send a put request to api
    let response = await axios.put(
      `${url}v1/api/users/${resource}/${userId}`,
      data
    );
    return response;
  } catch (ex) {
    // log the exception on console
    console.log(ex.response);

    // if there is any error in input send it to UI
    if (ex.response) {
      alert(ex.response.data.message);
      console.log(ex.response.data.message, resource);
      showError(ex.response.data.message, resource);
    }
  }
}

export async function getData(resource, userId) {
  try {
    let response = await axios.get(`${url}v1/api/users/${resource}/${userId}`);
    return response;
  } catch (ex) {
    console.log(ex.response.data);
  }
}

export async function updateOneDataEl(data, resource, userId) {
  try {
    let response = await axios.patch(
      `${url}v1/api/users/${resource}/${userId}`,
      data
    );
    return response;
  } catch (ex) {
    console.log(ex.response.data.message, resource);
    console.log(ex);
  }
}

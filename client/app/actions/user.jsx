import { USER, PREVPATH } from "./types";

export const storeUserData = (user) => {
  return {
    type: USER,
    user: user,
  };
};

export const getAlUsers = () => (dispatch, getState, Api) => {
  return Api.get("handelUser").then((response) => {
    if (response.responseData.status === 200) {
      dispatch(storeUserData(response.responseData.response_data));
    }
    return response;
  });
};
export const addUser = (payload) => (dispatch, getState, Api) => {
  return Api.post("handelUser", payload).then((response) => {
    return response;
  });
};

export const deleteUser = (id) => (dispatch, getState, Api) => {
  return Api.delete("handelUser/" + id).then((response) => {
    return response;
  });
};
export const getUserDetails = (id) => (dispatch, getState, Api) => {
  return Api.get("handelUser/" + id).then((response) => {
    return response;
  });
};

export const editUser = (payload, id) => (dispatch, getState, Api) => {
  return Api.put("handelUser/" + id, payload).then((response) => {
    return response;
  });
};

export const uploadImage = (payload) => (dispatch, getState, Api) => {
  return Api.post("handelUploadImage", payload, "header").then((response) => {
    return response;
  });
};

export const storePrevLocation = () => {
  let path = window.location.pathname;
  return {
    type: PREVPATH,
    path: path,
  };
};

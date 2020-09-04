import { LOGIN_SUCCESS, PREVPATH, LOGOUT } from "./types";
import history from "../history";
import _ from "lodash";
export const loginSuccess = (user) => {
  let user_data = {};
  if (user.auth_Token) {
    user_data = {
      auth_Token: user.auth_Token,
      typr: user.type,
    };
    localStorage.setItem("auth_Token", user.auth_Token);
    localStorage.setItem("type", user.type);
  } else {
    user_data = {
      auth_Token: localStorage.getItem("auth_Token"),
      typr: localStorage.getItem("typr"),
    };
  }
  if (_.has(user, "name")) {
    delete user.auth_Token;
    user_data.data = user;
    localStorage.setItem("user", JSON.stringify(user));
  } else {
    if (localStorage.getItem("user")) {
      let userData = JSON.parse(localStorage.getItem("user"));
      user_data.data = userData;
    }
  }
  return {
    type: LOGIN_SUCCESS,
    user: user_data,
  };
};

export const signupUser = (payload) => (dispatch, getState, Api) => {
  return Api.post("handelUser", payload).then((res) => {
    return res;
  });
};
export const signupUserBySocial = (payload) => (dispatch, getState, Api) => {
  return Api.post("handelUser/signupGoogleFacebbok", payload).then((res) => {
    if (res.responseData.status === 201) {
      let passData = res.responseData.response_data;
      passData.auth_Token = res.responseData.auth_Token;
      passData.type = "user";
      dispatch(loginSuccess(passData));
    }
    return res;
  });
};

export const signupAdmin = (payload) => (dispatch, getState, Api) => {
  return Api.post("handelAdmin", payload).then((res) => {
    return res;
  });
};

export const userLogin = (payload) => (dispatch, getState, Api) => {
  return Api.post("handelUser/userLogin", payload).then((res) => {
    if (res.responseData.status === 200) {
      let passData = res.responseData.response_data;
      passData.auth_Token = res.responseData.auth_Token;
      passData.type = "user";
      dispatch(loginSuccess(passData));
    }
    return res;
  });
};
export const loginApi = (payload) => (dispatch, getState, Api) => {
  return Api.post("handelAdmin/Signin", payload).then((res) => {
    if (res.responseData.status === 200) {
      let passData = res.responseData.response_data;
      passData.type = "admin";
      dispatch(loginSuccess(passData));
    }
    return res;
  });
};
export const adminForgotPassword = (payload) => (dispatch, getState, Api) => {
  return Api.post("handelForgotPassword", payload).then((res) => {
    return res;
  });
};
export const adminChangePassword = (payload) => (dispatch, getState, Api) => {
  return Api.post("handelAdmin/changePassword", payload).then((res) => {
    return res;
  });
};

export const LogoutApi = () => (dispatch, getState, Api) => {
  dispatch(logoutSuccess());
  return {
    type: LOGOUT,
  };
};
export const AdminLogoutApi = () => (dispatch, getState, Api) => {
  dispatch(adminlogoutSuccess());
  return {
    type: LOGOUT,
  };
};

export const logoutSuccess = () => {
  // global.check_Auth(history);
  localStorage.clear();
  history.push("/login");
  return {
    type: LOGOUT,
  };
};
export const adminlogoutSuccess = () => {
  // global.check_Auth(history);
  localStorage.clear();
  history.push("/login/admin");
  return {
    type: LOGOUT,
  };
};

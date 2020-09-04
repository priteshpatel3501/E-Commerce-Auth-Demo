import global from "../global";
import store from "../configStore";
import { logoutSuccess } from "../actions";

const globalUrl = global.config.apiUrl;

export default {
  post: (url, data, headerData) => {
    let header = {
      method: "POST",
      body: headerData ? data : JSON.stringify(data),
      headers: {
        authorization: global.getToken(),
      },
    };
    let apiUrl = globalUrl + url;

    return fetch(apiUrl, header)
      .then((response) => {
        return response
          .json()
          .then((json) => {
            if (json.status === 401) {
              store.dispatch(logoutSuccess());
            }
            return Promise.resolve({
              responseData: json,
              response: response,
            });
          })
          .catch((err) => {
            return Promise.resolve({
              response: response,
            });
          });
      })
      .catch((err) => {
        console.log("api post error:", err);
        throw err;
      });
  },

  put: (url, data, basicAuth) => {
    let header = {
      method: "PUT",
      body: JSON.stringify(data),
      headers: {
        authorization: global.getToken(),
      },
    };
    return fetch(globalUrl + url, header)
      .then((response) => {
        return response
          .json()
          .then((json) => {
            if (json.status === 401) {
              store.dispatch(logoutSuccess());
            }
            return Promise.resolve({
              responseData: json,
              response: response,
            });
          })
          .catch((err) => {
            return Promise.resolve({
              response: response,
            });
          });
      })
      .catch((err) => {
        console.log("api post error:", err);
        throw err;
      });
  },

  get: (url, version) => {
    let apiUrl = globalUrl + url;
    return fetch(apiUrl, {
      method: "GET",
      headers: {
        authorization: global.getToken(),
      },
    })
      .then((response) => {
        return response
          .json()
          .then((json) => {
            if (json.status === 401) {
              store.dispatch(logoutSuccess());
            }
            return Promise.resolve({
              responseData: json,
              response: response,
            });
          })
          .catch((err) => {
            return Promise.resolve({
              response: response,
            });
          });
      })
      .catch((err) => {
        console.log("api post error:", err);
        throw err;
      });
  },

  delete: (url) => {
    return fetch(globalUrl + url, {
      method: "DELETE",
      headers: {
        authorization: global.getToken(),
      },
    })
      .then((response) => {
        return response.json().then((json) => {
          if (json.status === 401) {
            store.dispatch(logoutSuccess());
          }
          return Promise.resolve({
            responseData: json,
            response: response,
          });
        });
      })
      .catch((err) => {
        console.log("api post error:", err);
        throw err;
      });
  },
};

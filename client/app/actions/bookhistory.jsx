export const getAllBookHistory = () => (dispatch, getState, Api) => {
  return Api.get("handelBookHistory").then((response) => {
    return response;
  });
};

export const getBookHistory = (payload) => (dispatch, getState, Api) => {
  return Api.post("handelBookHistory/page", payload).then((response) => {
    return response;
  });
};

export const createBookHistory = (payload) => (dispatch, getState, Api) => {
  return Api.post("handelBookHistory", payload).then((response) => {
    return response;
  });
};

export const editBookHistory = (payload, id) => (dispatch, getState, Api) => {
  return Api.put("handelBookHistory/" + id, payload).then((response) => {
    return response;
  });
};

export const deleteBookHistory = (id) => (dispatch, getState, Api) => {
  return Api.delete("handelBookHistory/" + id).then((response) => {
    return response;
  });
};

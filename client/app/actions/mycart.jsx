export const getCartDetails = (id) => (dispatch, getState, Api) => {
  return Api.get("handelMyCart/" + id).then((response) => {
    return response;
  });
};

export const createCart = (payload) => (dispatch, getState, Api) => {
  return Api.post("handelMyCart", payload).then((response) => {
    return response;
  });
};

export const editCart = (payload, id) => (dispatch, getState, Api) => {
  return Api.put("handelMyCart/" + id, payload).then((response) => {
    return response;
  });
};

export const deleteCart = (id) => (dispatch, getState, Api) => {
  return Api.delete("handelMyCart/" + id).then((response) => {
    return response;
  });
};
export const destroyCart = (id) => (dispatch, getState, Api) => {
  return Api.delete("handelMyCart/destroy/" + id).then((response) => {
    return response;
  });
};

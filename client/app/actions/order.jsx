export const getOrder = (id) => (dispatch, getState, Api) => {
  return Api.get("handelOrder/" + id).then((response) => {
    return response;
  });
};
export const getAllOrder = () => (dispatch, getState, Api) => {
  return Api.get("handelOrder").then((response) => {
    return response;
  });
};
export const getAllOrderData = (payload) => (dispatch, getState, Api) => {
  return Api.post("handelOrder", payload).then((response) => {
    return response;
  });
};
export const editOrder = (payload, id) => (dispatch, getState, Api) => {
  return Api.put("handelOrder/" + id, payload).then((response) => {
    return response;
  });
};

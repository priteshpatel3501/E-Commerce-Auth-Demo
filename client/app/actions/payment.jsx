export const paypalPayment = (payload) => (dispatch, getState, Api) => {
  return Api.post("paypal/pay", payload).then((response) => {
    return response;
  });
};
export const successPayment = (payload) => (dispatch, getState, Api) => {
  return Api.post("paypal/success", payload).then((response) => {
    return response;
  });
};

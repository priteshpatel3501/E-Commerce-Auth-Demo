// import { BOOK } from "./types";

// export const storeBookData = (Book) => {
//   return {
//     type: BOOK,
//     Book: Book,
//   };
// };

export const getAllProduct = () => (dispatch, getState, Api) => {
  return Api.get("handelProduct").then((response) => {
    // if (response.responseData.status === 200) {
    //   dispatch(storeBookData(response.responseData.response_data));
    // }
    return response;
  });
};

export const addProduct = (payload) => (dispatch, getState, Api) => {
  return Api.post("handelProduct", payload).then((response) => {
    return response;
  });
};

export const deleteProduct = (id) => (dispatch, getState, Api) => {
  return Api.delete("handelProduct/" + id).then((response) => {
    return response;
  });
};
export const getMyProductDetails = (id) => (dispatch, getState, Api) => {
  return Api.get("handelProduct/" + id).then((response) => {
    return response;
  });
};

export const editProduct = (payload, id) => (dispatch, getState, Api) => {
  return Api.put("handelProduct/" + id, payload).then((response) => {
    return response;
  });
};

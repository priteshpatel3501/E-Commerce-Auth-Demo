import { BOOK } from "./types";

export const storeBookData = (Book) => {
  return {
    type: BOOK,
    Book: Book,
  };
};

export const getAllBooks = () => (dispatch, getState, Api) => {
  return Api.get("handelBook").then((response) => {
    if (response.responseData.status === 200) {
      dispatch(storeBookData(response.responseData.response_data));
    }
    return response;
  });
};

export const addBook = (payload) => (dispatch, getState, Api) => {
  return Api.post("handelBook", payload).then((response) => {
    return response;
  });
};

export const deleteBook = (id) => (dispatch, getState, Api) => {
  return Api.delete("handelBook/" + id).then((response) => {
    return response;
  });
};
export const getMyBookDetails = (id) => (dispatch, getState, Api) => {
  return Api.get("handelBook/" + id).then((response) => {
    return response;
  });
};

export const editBook = (payload, id) => (dispatch, getState, Api) => {
  return Api.put("handelBook/" + id, payload).then((response) => {
    return response;
  });
};

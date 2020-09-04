import React from "react";
import ReactDOM from "react-dom";
import AdminRoutes from "./Admin";
import UserRoutes from "./User";
import * as serviceWorker from "./serviceWorker";
import store from "./configStore";
let userType = "";
if (localStorage.getItem("type")) {
  userType = localStorage.getItem("type");
} else {
  let urlArray = window.location.href.split("/");
  if (urlArray.includes("admin")) {
    userType = "admin";
  } else {
    userType = "user";
  }
}
function render() {
  ReactDOM.render(
    userType === "user" ? (
      <UserRoutes store={store} />
    ) : (
      <AdminRoutes store={store} />
    ),
    document.getElementById("root")
  );
}
store.subscribe(render);
render();
serviceWorker.unregister();

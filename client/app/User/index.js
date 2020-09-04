import React, { Component } from "react";
import Routes from "./Routes";
import { loginSuccess } from "../actions";
import store from "../configStore";
let auth_token = localStorage.getItem("auth_Token");
auth_token && store.dispatch(loginSuccess({ authToken: auth_token }));

export default class index extends Component {
  render() {
    return <Routes store={this.props.store} />;
  }
}

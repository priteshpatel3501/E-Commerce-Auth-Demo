import React, { Component } from "react";
import { LogoutApi } from "../../actions";
import global from "../../global";
import { connect } from "react-redux";

class Logout extends Component {
  componentWillMount = () => {
    global.check_Auth(this.props.history);
    this.props.LogoutApi();
  };
  render() {
    return <div></div>;
  }
}

export default connect(
  null,
  { LogoutApi }
)(Logout);

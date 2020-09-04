import React, { Component } from "react";
import Header from "./wrapperComponents/header";
import Sidebar from "./wrapperComponents/sidebar";
import Content from "./wrapperComponents/content";
import _ from "lodash";
import * as $ from "jquery";
// import global from "../global";

export default class home extends Component {
  componentDidMount() {
    // console.log(this.props);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.props.location.pathname !== nextProps.location.pathname) {
      let pathName = _.split(nextProps.location.pathname, "/");
      // console.log(pathName[1]);

      this.setMenuItemActive(pathName);
    }
  }
  setMenuItemActive = (pathName) => {
    $("#side-menu li a").removeClass("active");
    $("#side-menu li ").removeClass("active");
    $("#side-menu")
      .find("ul.nav.nav-second-level")
      .removeClass("in")
      .attr("aria-expanded", false);
    $("#side-menu")
      .find('a[href^="/' + pathName[1] + '"]')
      .addClass("active");
    $("#side-menu")
      .find('a[href^="/' + pathName[1] + '"]')
      .parent("li")
      .parent("ul")
      .siblings("a")
      .addClass("active");
    $("#side-menu")
      .find('a[href^="/' + pathName[1] + '"]')
      .parent("li")
      .parent("ul.nav.nav-second-level")
      .addClass("in")
      .attr("aria-expanded", true);
  };

  render() {
    return (
      <div id="Homepage">
        <div id="wrapper">
          <Header history={this.props.history} />
          <Sidebar history={this.props.history} />
          <Content />
        </div>
      </div>
    );
  }
}

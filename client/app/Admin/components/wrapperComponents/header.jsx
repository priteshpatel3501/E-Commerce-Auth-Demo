import React, { Component } from "react";

export default class Header extends Component {
  render() {
    return (
      <nav className="navbar navbar-default navbar-static-top m-b-0">
        <div className="navbar-header">
          <a
            className="navbar-toggle hidden-sm hidden-md hidden-lg "
            href="/"
            data-toggle="collapse"
            data-target=".navbar-collapse"
          >
            <i className="ti-menu" />
          </a>
          {/* <div className="top-left-part">
            <a className="logo" href="index.html">
              <span className="hidden-xs">
                <img
                  src="images/eliteadmin-text.png"
                  alt="home"
                  className="dark-logo"
                />
              </span>
            </a>
          </div> */}
          <ul className="nav navbar-top-links navbar-left hidden-xs">
            <li>
              <a
                href="# "
                className="open-close hidden-xs waves-effect waves-light"
              >
                {/* <i className="icon-arrow-left-circle ti-menu" /> */}
              </a>
            </li>
            {/* <li>
              <form role="search" className="app-search hidden-xs">
                <input
                  type="text"
                  placeholder="Search..."
                  className="form-control"
                />
                <a href="# ">
                  <i className="fa fa-search" />
                </a>
              </form>
            </li> */}
          </ul>
        </div>
      </nav>
    );
  }
}

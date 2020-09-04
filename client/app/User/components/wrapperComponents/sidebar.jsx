import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import { connect } from "react-redux";
import { LogoutApi } from "../../../actions";
import noUserImage from "../../assets/noUserImage.png";
import global from "../../../global";

class Sidebar extends Component {
  render() {
    let data = localStorage.getItem("user");
    let profileData = {};
    if (data) {
      profileData = JSON.parse(data);
    }
    let name = "Admin";
    let profileImage = "";
    if (data) {
      name = profileData.name ? profileData.name : "Admin";
      profileImage =
        profileData.login_type === 0
          ? global.config.imageUrl + "UserProfile/" + profileData.profile
          : profileData.profile;
    }

    return (
      <div className="navbar-default sidebar" role="navigation">
        <div className="sidebar-nav navbar-collapse slimscrollsidebar">
          <div className="user-profile">
            <div className="dropdown user-pro-body">
              <div>
                <img
                  src={profileImage}
                  alt="user-img"
                  className="img-circle"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = noUserImage;
                  }}
                />
              </div>
              <a
                href="# "
                className=" u-dropdown"
                data-toggle="dropdown"
                role="button"
                aria-haspopup="true"
                aria-expanded="false"
                onClick={() => this.props.LogoutApi()}
              >
                {name}
                <i className="fa fa-power-off ml-2" />
                <span className="caret" />
              </a>

              {/* <ul className="dropdown-menu animated flipInY">
                <li>
                  <NavLink
                    exact
                    activeClassName="waves-effect active"
                    to="/profile"
                  >
                    <i className="ti-user" /> Edit Profile
                  </NavLink>
                </li>

                <li role="separator" className="divider" />
                <li>
                  <NavLink
                    exact
                    activeClassName="waves-effect active"
                    to="/login"
                    onClick={() => this.props.LogoutApi()}
                  >
                    <i className="fa fa-power-off" /> Logout
                  </NavLink>
                </li>
              </ul> */}
            </div>
          </div>

          <ul className="nav" id="side-menu">
            <li className="sidebar-search hidden-sm hidden-md hidden-lg">
              <div className="input-group custom-search-form">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search..."
                />
                <span className="input-group-btn">
                  <button className="btn btn-default" type="button">
                    <i className="fa fa-search" />
                  </button>
                </span>
              </div>
            </li>
            <li className="nav-small-cap m-t-10">--- Main Menu</li>

            <li>
              <NavLink exact activeClassName="waves-effect active" to="/home">
                <i className="icon-grid fa-fw" data-icon="v" />
                <span className="hide-menu"> Home </span>
              </NavLink>
            </li>
            <li>
              <NavLink
                exact
                activeClassName="waves-effect active"
                to="/my-cart"
              >
                <i className="icon-handbag fa-fw" data-icon="v" />
                <span className="hide-menu"> My Cart </span>
              </NavLink>
            </li>
            <li>
              <NavLink
                exact
                activeClassName="waves-effect active"
                to="/my-order"
              >
                <i className="icon-drawar fa-fw" data-icon="v" />
                <span className="hide-menu"> My Order </span>
              </NavLink>
            </li>

            {/* <li>
              <NavLink
                exact
                activeClassName="waves-effect active"
                to="/products"
              >
                <i className="icon-drawar fa-fw" data-icon="v" />
                <span className="hide-menu"> Products </span>
              </NavLink>
            </li> */}

            {/* <li>
              <NavLink exact activeClassName="waves-effect active" to="/user">
                <i className="icon-people fa-fw" data-icon="v" />
                <span className="hide-menu"> User </span>
              </NavLink>
            </li>
            <li>
              <NavLink
                exact
                activeClassName="waves-effect active"
                to="/product"
              >
                <i className="icon-handbag fa-fw" data-icon="v" />
                <span className="hide-menu"> Product </span>
              </NavLink>
            </li>

            <li>
              <NavLink
                exact
                activeClassName="waves-effect active"
                to="/product"
              >
                <i className="icon-handbag fa-fw" data-icon="v" />
                <span className="hide-menu"> Product </span>
              </NavLink>
            </li>
            <li>
              <NavLink
                exact
                activeClassName="waves-effect active"
                to="/product"
              >
                <i className="icon-handbag fa-fw" data-icon="v" />
                <span className="hide-menu"> Product </span>
              </NavLink>
            </li>
            <li>
              <NavLink
                exact
                activeClassName="waves-effect active"
                to="/product"
              >
                <i className="icon-handbag fa-fw" data-icon="v" />
                <span className="hide-menu"> Product </span>
              </NavLink>
            </li>
            <li>
              <NavLink
                exact
                activeClassName="waves-effect active"
                to="/product"
              >
                <i className="icon-handbag fa-fw" data-icon="v" />
                <span className="hide-menu"> Product </span>
              </NavLink>
            </li>
            <li>
              <NavLink
                exact
                activeClassName="waves-effect active"
                to="/product"
              >
                <i className="icon-handbag fa-fw" data-icon="v" />
                <span className="hide-menu"> Product </span>
              </NavLink>
            </li>
            <li>
              <NavLink
                exact
                activeClassName="waves-effect active"
                to="/product"
              >
                <i className="icon-handbag fa-fw" data-icon="v" />
                <span className="hide-menu"> Product </span>
              </NavLink>
            </li>
            <li>
              <NavLink
                exact
                activeClassName="waves-effect active"
                to="/product"
              >
                <i className="icon-handbag fa-fw" data-icon="v" />
                <span className="hide-menu"> Product </span>
              </NavLink>
            </li>
            <li>
              <NavLink
                exact
                activeClassName="waves-effect active"
                to="/product"
              >
                <i className="icon-handbag fa-fw" data-icon="v" />
                <span className="hide-menu"> Product </span>
              </NavLink>
            </li>
            <li>
              <NavLink
                exact
                activeClassName="waves-effect active"
                to="/product"
              >
                <i className="icon-handbag fa-fw" data-icon="v" />
                <span className="hide-menu"> Product </span>
              </NavLink>
            </li>
            <li>
              <NavLink
                exact
                activeClassName="waves-effect active"
                to="/product"
              >
                <i className="icon-handbag fa-fw" data-icon="v" />
                <span className="hide-menu"> Product </span>
              </NavLink>
            </li> */}
          </ul>
        </div>
      </div>
    );
  }
}

export default connect(null, { LogoutApi })(Sidebar);

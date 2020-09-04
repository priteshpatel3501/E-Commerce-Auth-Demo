import React, { Component } from "react";
import PageHeader from "../../Reusable/PageHeader";
import Datatable from "../../Reusable/Datatable";
import ReactTooltip from "react-tooltip";
import { withRouter, NavLink } from "react-router-dom";
import { connect } from "react-redux";
import momentTZ from "moment-timezone";
import { getAlUsers, deleteUser, storePrevLocation } from "../../../../actions";
import global from "../../../../global";
class users extends Component {
  state = {
    data: [],
  };
  componentDidMount() {
    this.fetchUserList();
    this.props.storePrevLocation();
  }
  fetchUserList = () => {
    this.props
      .getAlUsers()
      .then((res) => {
        this.setState({
          data: res.responseData.response_data,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };
  handelDeleteUser = (id) => {
    this.props
      .deleteUser(id)
      .then((res) => {
        if (res.responseData.status === 200) {
          this.fetchUserList();
        } else {
          console.log(res);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  render() {
    let { data } = this.state;
    let currentTimezone = momentTZ.tz.guess();
    let THead = (
      <tr style={{ fontSize: 14 }}>
        <th>Action</th>
        <th>Profile</th>
        <th>Name</th>
        <th>Email</th>
        <th>Phone Number</th>
        <th>Gender</th>
        <th>Address</th>
        <th>Created At</th>
      </tr>
    );
    let TBody = (
      <tbody style={{ fontSize: 12 }}>
        {data.length > 0 ? (
          data.map((value, index) => {
            // console.log(value);

            return (
              <tr key={index}>
                <td className="text-nowrap">
                  <div>
                    <button
                      type="button"
                      className="btn btn-danger btn-circle"
                      data-tip="Delete"
                      onClick={() => {
                        this.handelDeleteUser(value._id);
                      }}
                    >
                      <i className="ti-trash" />
                    </button>
                    <button
                      type="button"
                      className="btn btn-info btn-circle m-l-5"
                      data-tip="Edit"
                      onClick={() => {
                        this.props.history.push("/user-form/" + value._id);
                      }}
                    >
                      <i className="ti-pencil-alt" />
                    </button>
                  </div>
                </td>

                <td>
                  <img
                    alt="userImage"
                    src={
                      value.login_type === 0
                        ? global.config.imageUrl +
                          "UserProfile/" +
                          value.profile
                        : value.profile
                    }
                    width={50}
                  />
                </td>
                <td>{value.name}</td>
                <td>{value.email}</td>
                <td>{value.phone}</td>
                <td>{value.gender}</td>
                <td>{value.address}</td>
                <td>
                  {momentTZ
                    .tz(value.createdAt, currentTimezone)
                    .format("MMMM Do YYYY, hh:mm A")}
                </td>
              </tr>
            );
          })
        ) : (
          <tr>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td>Data not found.</td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
        )}
      </tbody>
    );

    return (
      <div className="container-fluid">
        <PageHeader name="Users" />
        <ReactTooltip />
        <div className="row">
          <div className="col-md-12">
            <div className="white-box">
              <div className="float-right">
                <NavLink
                  exact
                  activeClassName="waves-effect active"
                  to="/user-form"
                >
                  <button
                    type="button"
                    className="btn btn-success pl-5 pr-5 pt-4 pb-4 m-b-20"
                  >
                    Add new user
                  </button>
                </NavLink>
              </div>
              <div className="table-responsive">
                <Datatable thead={THead} tbody={TBody} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default withRouter(
  connect(null, {
    getAlUsers,
    deleteUser,
    storePrevLocation,
  })(users)
);

import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import PageHeader from "../../../Reusable/PageHeader";
import Dropzone from "../../../Reusable/Dropzone";
import {
  addUser,
  uploadImage,
  getUserDetails,
  editUser,
} from "../../../../../actions";
import { connect } from "react-redux";
import "./UserForm.scss";
import global from "../../../../../global";
import noImage from "../../../../assets/noimage.png";

class UserForm extends Component {
  state = {
    name: "",
    email: "",
    phone: "",
    address: "",
    gender: "",
    hobbies: [],
    profile: "",
    profile_data: {},
    is_edit: false,
    oldData: {},
    is_change: false,
  };
  componentDidMount() {
    if (this.props.match.params.id) {
      this.fetchUserData();
    }
  }
  fetchUserData = () => {
    this.props
      .getUserDetails(this.props.match.params.id)
      .then((res) => {
        if (res.responseData.status === 200) {
          let fetchedData = res.responseData.response_data[0];
          this.setState({
            name: fetchedData.name,
            email: fetchedData.email,
            phone: fetchedData.phone,
            address: fetchedData.address,
            gender: fetchedData.gender,
            hobbies: fetchedData.hobbies.split(","),
            profile: fetchedData.profile,
            profile_data: {},
            is_edit: true,
            oldData: fetchedData,
            is_change: false,
          });
        } else {
          console.log(res);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  inputHandleChange = (e) => {
    let element = e.target.name;
    let inputVal = e.target.value;
    if (inputVal === "" && element === "name") {
      console.log(element);
    }

    this.setState({
      [element]: inputVal,
      is_change: true,
    });
  };
  handelChangeCheckBox = (value) => {
    let { hobbies } = this.state;
    let check = hobbies.includes(value);
    if (check) {
      let hIndex = hobbies.indexOf(value);
      hobbies.splice(hIndex, 1);
    } else {
      hobbies.push(value);
    }
    this.setState({
      hobbies,
      is_change: true,
    });
  };
  handelResetForm = () => {
    let { is_edit } = this.state;
    if (is_edit) {
      let fetchedData = this.state.oldData;
      this.setState({
        name: fetchedData.name,
        email: fetchedData.email,
        phone: fetchedData.phone,
        address: fetchedData.address,
        gender: fetchedData.gender,
        hobbies: fetchedData.hobbies.split(","),
        profile: fetchedData.profile,
        profile_data: {},
        is_change: false,
      });
    } else {
      this.setState({
        name: "",
        email: "",
        phone: "",
        address: "",
        gender: "",
        hobbies: [],
        profile: "",
        profile_data: {},
      });
    }
  };
  handelSubmitForm = (e) => {
    e.preventDefault();
    let { is_edit, profile_data } = this.state;
    if (is_edit) {
      if (Object.keys(profile_data).length > 0) {
        this.handelUploadImage();
      } else {
        this.handelUpdateUser();
      }
    } else {
      this.handelUploadImage();
    }
  };
  handelUploadImage = () => {
    let { profile_data, is_edit } = this.state;
    var formData = new FormData();
    formData.append("type", "user");
    delete profile_data.dataURL;
    delete profile_data.previewElement;
    delete profile_data.previewTemplate;
    delete profile_data.upload;
    delete profile_data.xhr;
    formData.append("display", profile_data);

    this.props
      .uploadImage(formData)
      .then((res) => {
        if (res.responseData.status === 200) {
          this.setState(
            {
              profile: res.responseData.url,
            },
            () => {
              if (is_edit) {
                this.handelUpdateUser();
              } else {
                this.handelInsertUser();
              }
            }
          );
        } else {
          console.log(res);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  handelInsertUser = () => {
    let { name, email, phone, address, gender, hobbies, profile } = this.state;
    let payload = {
      name: name,
      email: email,
      phone: phone,
      address: address,
      gender: gender,
      hobbies: hobbies.join(","),
      profile: profile,
    };
    this.props
      .addUser(payload)
      .then((res) => {
        if (res.responseData.status === 200) {
          this.props.history.push("/users");
        } else {
          console.log(res);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  handelUpdateUser = () => {
    let { name, email, phone, address, gender, hobbies, profile } = this.state;
    let payload = {
      name: name,
      email: email,
      phone: phone,
      address: address,
      gender: gender,
      hobbies: hobbies.join(","),
      profile: profile,
    };
    this.props
      .editUser(payload, this.props.match.params.id)
      .then((res) => {
        if (res.responseData.status === 200) {
          this.props.history.push("/users");
        } else {
          console.log(res);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  handelAddImage = (file) => {
    this.setState({
      profile_data: file,
      is_change: true,
    });
  };
  handelRemoveImage = (file) => {
    this.setState({
      profile_data: {},
    });
  };

  render() {
    let {
      name,
      email,
      phone,
      address,
      gender,
      hobbies,
      profile,
      profile_data,
      is_edit,
      is_change,
    } = this.state;
    let is_disabled = true;
    if (is_edit) {
      is_disabled =
        name !== "" &&
        email !== "" &&
        phone !== "" &&
        address !== "" &&
        gender !== "" &&
        hobbies.length > 0 &&
        is_change
          ? false
          : true;
      is_disabled =
        Object.keys(profile_data).length > 0 && profile === ""
          ? true
          : is_disabled;
    } else {
      is_disabled =
        name !== "" &&
        email !== "" &&
        phone !== "" &&
        address !== "" &&
        gender !== "" &&
        hobbies.length > 0 &&
        Object.keys(profile_data).length > 0
          ? false
          : true;
    }
    return (
      <div className="container-fluid">
        <PageHeader
          name={this.props.match.params.id ? "Edit user data" : "Add user data"}
        />
        <div className="row">
          <div className="col-md-12">
            <div className="white-box">
              <div className="row">
                <div className="col-md-12">
                  <div className="panel panel-info">
                    <div
                      className="panel-wrapper collapse in"
                      aria-expanded="true"
                    >
                      <div className="panel-body">
                        <form action="#">
                          <div className="form-body">
                            <div className="row">
                              <div className="col-md-6">
                                <div className="form-group">
                                  <label className="control-label">Name</label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter Name"
                                    name="name"
                                    value={name}
                                    onChange={(e) => this.inputHandleChange(e)}
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="row">
                              <div className="col-md-6">
                                <label className="control-label">Gender</label>
                                <div className="d-flex form-group">
                                  <div className="form-check">
                                    <label className="custom-control custom-radio">
                                      <input
                                        id="radio1"
                                        name="radio"
                                        type="radio"
                                        className="custom-control-input"
                                        checked={
                                          gender === "Male" ? true : false
                                        }
                                        onChange={() => {}}
                                        onClick={() => {
                                          this.setState({
                                            gender: "Male",
                                            is_change: true,
                                          });
                                        }}
                                      />
                                      <span className="custom-control-indicator"></span>
                                      <span className="custom-control-description">
                                        Male
                                      </span>
                                    </label>
                                  </div>
                                  <div className="form-check">
                                    <label className="custom-control custom-radio">
                                      <input
                                        id="radio2"
                                        name="radio"
                                        type="radio"
                                        className="custom-control-input"
                                        onChange={() => {}}
                                        checked={
                                          gender === "Female" ? true : false
                                        }
                                        onClick={() => {
                                          this.setState({
                                            gender: "Female",
                                            is_change: true,
                                          });
                                        }}
                                      />
                                      <span className="custom-control-indicator"></span>
                                      <span className="custom-control-description">
                                        Female
                                      </span>
                                    </label>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="row">
                              <div className="col-md-6">
                                <div className="form-group">
                                  <label className="control-label">Email</label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter email"
                                    name="email"
                                    value={email}
                                    onChange={(e) => this.inputHandleChange(e)}
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="row">
                              <div className="col-md-6">
                                <div className="form-group">
                                  <label className="control-label">
                                    Contact number
                                  </label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter contact number"
                                    name="phone"
                                    value={phone}
                                    onChange={(e) => this.inputHandleChange(e)}
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="row">
                              <div className="col-md-6">
                                <div className="form-group">
                                  <label className="control-label">
                                    Address
                                  </label>

                                  <textarea
                                    className="form-control"
                                    name="address"
                                    rows="3"
                                    onChange={(e) => this.inputHandleChange(e)}
                                    value={address}
                                  ></textarea>
                                </div>
                              </div>
                            </div>

                            <div className="row">
                              <div className="col-md-6">
                                <label className="control-label">Hobbies</label>
                                <div className="form-group d-flex">
                                  <div className="form-check">
                                    <label className="custom-control custom-checkbox">
                                      <input
                                        type="checkbox"
                                        className="custom-control-input"
                                        checked={hobbies.includes("Reading")}
                                        onClick={() => {
                                          this.handelChangeCheckBox("Reading");
                                        }}
                                        onChange={() => {}}
                                      />
                                      <span className="custom-control-indicator"></span>
                                      <span className="custom-control-description">
                                        Reading
                                      </span>
                                    </label>
                                  </div>
                                  <div className="form-check">
                                    <label className="custom-control custom-checkbox">
                                      <input
                                        type="checkbox"
                                        className="custom-control-input"
                                        checked={hobbies.includes("Travelling")}
                                        onClick={() => {
                                          this.handelChangeCheckBox(
                                            "Travelling"
                                          );
                                        }}
                                        onChange={() => {}}
                                      />
                                      <span className="custom-control-indicator"></span>
                                      <span className="custom-control-description">
                                        Travelling
                                      </span>
                                    </label>
                                  </div>
                                  <div className="form-check">
                                    <label className="custom-control custom-checkbox">
                                      <input
                                        type="checkbox"
                                        className="custom-control-input"
                                        checked={hobbies.includes("Music")}
                                        onClick={() => {
                                          this.handelChangeCheckBox("Music");
                                        }}
                                        onChange={() => {}}
                                      />
                                      <span className="custom-control-indicator"></span>
                                      <span className="custom-control-description">
                                        Music
                                      </span>
                                    </label>
                                  </div>
                                  <div className="form-check">
                                    <label className="custom-control custom-checkbox">
                                      <input
                                        type="checkbox"
                                        className="custom-control-input"
                                        checked={hobbies.includes(
                                          "Photography"
                                        )}
                                        onChange={() => {}}
                                        onClick={() => {
                                          this.handelChangeCheckBox(
                                            "Photography"
                                          );
                                        }}
                                      />
                                      <span className="custom-control-indicator"></span>
                                      <span className="custom-control-description">
                                        Photography
                                      </span>
                                    </label>
                                  </div>
                                  <div className="form-check">
                                    <label className="custom-control custom-checkbox">
                                      <input
                                        type="checkbox"
                                        className="custom-control-input"
                                        checked={hobbies.includes("Cooking")}
                                        onClick={() => {
                                          this.handelChangeCheckBox("Cooking");
                                        }}
                                        onChange={() => {}}
                                      />
                                      <span className="custom-control-indicator"></span>
                                      <span className="custom-control-description">
                                        Cooking
                                      </span>
                                    </label>
                                  </div>
                                  <div className="form-check">
                                    <label className="custom-control custom-checkbox">
                                      <input
                                        type="checkbox"
                                        className="custom-control-input"
                                        checked={hobbies.includes("Dance")}
                                        onClick={() => {
                                          this.handelChangeCheckBox("Dance");
                                        }}
                                        onChange={() => {}}
                                      />
                                      <span className="custom-control-indicator"></span>
                                      <span className="custom-control-description">
                                        Dance
                                      </span>
                                    </label>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="row">
                              <div className="col-md-2">
                                <label className="control-label">Profile</label>
                                <Dropzone
                                  handelAddImage={this.handelAddImage}
                                  handelRemoveImage={this.handelRemoveImage}
                                />
                              </div>
                              {this.props.match.params.id && (
                                <div className="col-md-2">
                                  <label className="control-label">
                                    Old Image
                                  </label>
                                  <div className="image-container">
                                    <img
                                      alt="userImage"
                                      className="user-img-class"
                                      src={
                                        global.config.imageUrl +
                                        "UserProfile/" +
                                        profile
                                      }
                                      height={120}
                                      width={120}
                                      onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = noImage;
                                      }}
                                    />
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="form-actions m-t-10 row col-md-6">
                            <button
                              type="button"
                              onClick={this.handelSubmitForm}
                              className="btn btn-success pl-5 pr-5 pt-4 pb-4"
                              disabled={is_disabled}
                            >
                              Save
                            </button>
                            <button
                              type="button"
                              className="btn btn-default ml-3 pl-5 pr-5 pt-4 pb-4"
                              onClick={this.handelResetForm}
                            >
                              Cancel
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
function mapStateToProp(state) {
  return {
    store: state.auth,
  };
}
export default withRouter(
  connect(mapStateToProp, { addUser, uploadImage, getUserDetails, editUser })(
    UserForm
  )
);

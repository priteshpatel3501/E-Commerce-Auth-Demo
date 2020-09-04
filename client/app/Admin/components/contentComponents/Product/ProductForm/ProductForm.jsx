import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import PageHeader from "../../../Reusable/PageHeader";
import Dropzone from "../../../Reusable/Dropzone";
import {
  addProduct,
  uploadImage,
  getMyProductDetails,
  editProduct,
} from "../../../../../actions";
import { connect } from "react-redux";
import "./ProductForm.scss";
import global from "../../../../../global";
import moment from "moment";
import momentTZ from "moment-timezone";

class ProductForm extends Component {
  state = {
    title: "",
    price: "",
    description: "",
    publish_date: "",
    profile: "",
    profile_data: {},
    is_edit: false,
    oldData: {},
    is_change: false,
  };
  componentDidMount() {
    if (this.props.match.params.id) {
      this.fetchBookData();
    }
  }
  fetchBookData = () => {
    this.props
      .getMyProductDetails(this.props.match.params.id)
      .then((res) => {
        if (res.responseData.status === 200) {
          let fetchedData = res.responseData.response_data[0];
          let currentTimezone = momentTZ.tz.guess();
          let formatedDate = momentTZ
            .tz(fetchedData.publish_date, currentTimezone)
            .format("YYYY-MM-DD");
          this.setState({
            title: fetchedData.title,
            price: fetchedData.price,
            description: fetchedData.description,
            publish_date: formatedDate,
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

    this.setState({
      [element]: inputVal,
      is_change: true,
    });
  };

  handelResetForm = () => {
    let { is_edit } = this.state;
    if (is_edit) {
      let fetchedData = this.state.oldData;
      let currentTimezone = momentTZ.tz.guess();
      let formatedDate = momentTZ
        .tz(fetchedData.publish_date, currentTimezone)
        .format("YYYY-MM-DD");

      this.setState({
        title: fetchedData.title,
        price: fetchedData.price,
        description: fetchedData.description,
        publish_date: formatedDate,
        profile: fetchedData.profile,
        profile_data: {},
        is_change: false,
      });
    } else {
      this.setState({
        title: "",
        price: "",
        description: "",
        publish_date: "",
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
        this.handelUpdateProduct();
      }
    } else {
      this.handelUploadImage();
    }
  };

  handelUploadImage = () => {
    let { profile_data, is_edit } = this.state;
    var formData = new FormData();
    formData.append("type", "book");
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
                this.handelUpdateProduct();
              } else {
                this.handelInsertProduct();
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
  handelInsertProduct = () => {
    let { title, price, description, publish_date, profile } = this.state;
    let formatedDate = moment(publish_date).utc().format();
    let payload = {
      title: title,
      price: price,
      description: description,
      publish_date: formatedDate,
      profile: profile,
    };

    this.props
      .addProduct(payload)
      .then((res) => {
        if (res.responseData.status === 200) {
          this.props.history.push("/products");
        } else {
          console.log(res);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  handelUpdateProduct = () => {
    let { title, price, description, publish_date, profile } = this.state;
    let formatedDate = moment(publish_date).utc().format();
    let payload = {
      title: title,
      price: price,
      description: description,
      publish_date: formatedDate,
      profile: profile,
    };
    this.props
      .editProduct(payload, this.props.match.params.id)
      .then((res) => {
        if (res.responseData.status === 200) {
          this.props.history.push("/products");
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
  handelDateChange = (e) => {
    let value = e.target.value;
    this.setState({
      publish_date: value,
      is_change: true,
    });
  };
  render() {
    let {
      title,
      price,
      description,
      publish_date,
      profile,
      profile_data,
      is_edit,
      is_change,
    } = this.state;
    let is_disabled = true;
    if (is_edit) {
      is_disabled =
        title !== "" &&
        price !== "" &&
        description !== "" &&
        publish_date !== "" &&
        is_change
          ? false
          : true;
      is_disabled =
        Object.keys(profile_data).length > 0 && profile === ""
          ? true
          : is_disabled;
    } else {
      is_disabled =
        title !== "" &&
        price !== "" &&
        description !== "" &&
        publish_date !== "" &&
        Object.keys(profile_data).length > 0
          ? false
          : true;
    }
    return (
      <div className="container-fluid">
        <PageHeader
          name={this.props.match.params.id ? "Edit book data" : "Add book data"}
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
                                  <label className="control-label">Title</label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter title"
                                    name="title"
                                    value={title}
                                    onChange={(e) => this.inputHandleChange(e)}
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="row">
                              <div className="col-md-6">
                                <div className="form-group">
                                  <label className="control-label">Price</label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter Price"
                                    name="price"
                                    value={price}
                                    onChange={(e) => this.inputHandleChange(e)}
                                  />
                                </div>
                              </div>
                            </div>

                            <div className="row">
                              <div className="col-md-6">
                                <div className="form-group">
                                  <label className="control-label">
                                    Description
                                  </label>

                                  <textarea
                                    className="form-control"
                                    name="description"
                                    rows="3"
                                    onChange={(e) => this.inputHandleChange(e)}
                                    value={description}
                                  ></textarea>
                                </div>
                              </div>
                            </div>
                            <div className="row">
                              <div className="col-md-6">
                                <div className="form-group">
                                  <label className="control-label">
                                    Published Date
                                  </label>

                                  <input
                                    className="form-control"
                                    type="date"
                                    value={publish_date}
                                    id="example-date-input"
                                    name={"publish_date"}
                                    onChange={this.handelDateChange}
                                    placeholder="YYYY/MM/DD"
                                  />
                                </div>
                              </div>
                            </div>

                            <div className="row">
                              <div className="col-md-2">
                                <label className="control-label">
                                  Book Cover Image
                                </label>
                                <Dropzone
                                  handelAddImage={this.handelAddImage}
                                  handelRemoveImage={this.handelRemoveImage}
                                />
                              </div>
                              {this.props.match.params.id && (
                                <div className="col-md-2">
                                  <label className="control-label">
                                    Old Cover Image
                                  </label>
                                  <div className="image-container">
                                    <img
                                      alt="bookImage"
                                      className="user-img-class"
                                      src={
                                        global.config.imageUrl +
                                        "BookProfile/" +
                                        profile
                                      }
                                      height={150}
                                      width={120}
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
  connect(mapStateToProp, {
    addProduct,
    uploadImage,
    getMyProductDetails,
    editProduct,
  })(ProductForm)
);

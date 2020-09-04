import React, { Component } from "react";
import PageHeader from "../../Reusable/PageHeader";
import ReactTooltip from "react-tooltip";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import {
  getCartDetails,
  storePrevLocation,
  editCart,
  deleteCart,
  destroyCart,
} from "../../../../actions";
import global from "../../../../global";
import "./MyCart.scss";
class MyCart extends Component {
  state = {
    data: [],
    userData: {},
  };
  componentDidMount() {
    this.fetchCarttList();
    this.props.storePrevLocation();
  }
  fetchCarttList = () => {
    let data = localStorage.getItem("user");
    let profileData = {};
    if (data) {
      profileData = JSON.parse(data);
    }

    this.props
      .getCartDetails(profileData._id)
      .then((res) => {
        if (res.responseData.status === 200) {
          this.setState({
            data: res.responseData.response_data,
            userData: profileData,
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  handleRemoveCart = (id) => {
    this.props
      .deleteCart(id)
      .then((res) => {
        if (res.responseData.status === 200) {
          this.fetchCarttList();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  handleDestroyCart = (id) => {
    let { userData } = this.state;
    this.props
      .destroyCart(userData._id)
      .then((res) => {
        if (res.responseData.status === 200) {
          this.fetchCarttList();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  handleUpdateCart = (type, data) => {
    if (type === "add") {
      let newQuantity = data.quantity + 1;
      data.quantity = newQuantity;
    } else {
      let newQuantity = data.quantity - 1;
      data.quantity = newQuantity;
    }
    if (data.quantity === 0) {
      this.handleRemoveCart(data._id);
    } else {
      let api_payload = {
        user_id: data.user_id,
        product_id: data.product_id,
        quantity: data.quantity,
      };
      this.props
        .editCart(api_payload, data._id)
        .then((res) => {
          if (res.responseData.status === 200) {
            this.fetchCarttList();
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
  handleMoveToInvoice = () => {
    this.props.history.push("/invoice");
  };
  render() {
    let { data } = this.state;
    let newData = [];
    let grandTotal = 0;
    data.length > 0 &&
      data.map((value, index) => {
        let total = parseFloat(value.product_price) * value.quantity;
        grandTotal = grandTotal + total;
        value.total = total;
        newData.push(value);
      });
    return (
      <div className="container-fluid">
        <PageHeader name="My Cart" />
        <ReactTooltip />
        <div className="row">
          <div className="col-md-12">
            <div className="white-box">
              <div className="row">
                <div className="col-md-12">
                  <div className="white-box">
                    <div className="col-md-12 d-flex">
                      <div className="col-md-6">
                        <h3>
                          <b>Cart Details</b>
                        </h3>
                      </div>
                      {newData.length > 1 && (
                        <div className="col-md-6 text-right">
                          <button
                            className="btn btn-danger"
                            onClick={this.handleDestroyCart}
                          >
                            Destroy Cart
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="row">
                      <div className="col-md-12">
                        <div className="table-responsive m-t-40">
                          <table className="table table-hover">
                            <thead>
                              <tr>
                                <th className="text-center">#</th>
                                <th className="text-center">Name</th>
                                <th className="text-center">Product</th>
                                <th className="text-center">Price</th>
                                <th className="text-center">Quantity</th>
                                <th className="text-center">Total</th>
                                <th className="text-right">Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {newData.length > 0 ? (
                                newData.map((value, index) => {
                                  return (
                                    <tr key={index}>
                                      <td className="text-center">
                                        {index + 1}
                                      </td>
                                      <td className="text-center">
                                        {value.product_title}
                                      </td>
                                      <td className="text-center">
                                        <img
                                          src={
                                            global.config.imageUrl +
                                            "BookProfile/" +
                                            value.product_profile
                                          }
                                          alt="no book img"
                                          width={50}
                                          height={50}
                                        />
                                      </td>
                                      <td className="text-center">
                                        <div className="d-flex justify-content-center">
                                          <div
                                            className="m-r-10 plus-icon"
                                            onClick={() => {
                                              this.handleUpdateCart(
                                                "remove",
                                                value
                                              );
                                            }}
                                          >
                                            -
                                          </div>
                                          <div>{value.quantity}</div>
                                          <div
                                            className="m-l-10 plus-icon"
                                            onClick={() => {
                                              this.handleUpdateCart(
                                                "add",
                                                value
                                              );
                                            }}
                                          >
                                            +
                                          </div>
                                        </div>
                                      </td>
                                      <td className="text-center">
                                        {value.product_price}
                                      </td>
                                      <td className="text-center">
                                        ₹{value.total}
                                      </td>
                                      <td className="text-right">
                                        <div
                                          className="btn btn-danger b-r-20"
                                          onClick={() => {
                                            this.handleRemoveCart(value._id);
                                          }}
                                        >
                                          <i className="fa fa-trash" />
                                        </div>
                                      </td>
                                    </tr>
                                  );
                                })
                              ) : (
                                <tr>
                                  <td colSpan="7" className="text-center">
                                    Cart is empty.
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                      <div className="col-md-12">
                        <div className="pull-right m-t-30 text-right">
                          <h3>
                            <b>Total :</b> ₹{grandTotal}
                          </h3>
                        </div>
                        <div className="clearfix" />
                        <hr />
                        <div className="text-right">
                          <button
                            className="btn btn-success"
                            type="submit"
                            onClick={(e) => {
                              data.length > 0
                                ? this.handleMoveToInvoice()
                                : e.preventDefault();
                            }}
                          >
                            Checkout
                          </button>
                        </div>
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
export default withRouter(
  connect(null, {
    getCartDetails,
    storePrevLocation,
    editCart,
    deleteCart,
    destroyCart,
  })(MyCart)
);

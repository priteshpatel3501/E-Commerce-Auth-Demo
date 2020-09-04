import React, { Component } from "react";
import PageHeader from "../../Reusable/PageHeader";
import ReactTooltip from "react-tooltip";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import {
  storePrevLocation,
  getCartDetails,
  paypalPayment,
} from "../../../../actions";
import global from "../../../../global";
class Invoice extends Component {
  state = {
    data: [],
    userData: {},
    address: "",
    phone: "",
    name: "",
    email: "",
    grandTotal: 0,
    newData: [],
  };
  componentDidMount() {
    this.fetchCartList();
    this.props.storePrevLocation();
  }
  onInputChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };
  fetchCartList = () => {
    let data = localStorage.getItem("user");
    let profileData = {};
    if (data) {
      profileData = JSON.parse(data);
    }

    this.props
      .getCartDetails(profileData._id)
      .then((res) => {
        if (res.responseData.status === 200) {
          if (res.responseData.response_data.length > 0) {
            let newData = [];
            let orderData = [];
            let grandTotal = 0;
            const data = res.responseData.response_data;
            data.map((value, index) => {
              let total = parseFloat(value.product_price) * value.quantity;
              grandTotal = grandTotal + total;
              value.total = total;
              let newOrderObject = {
                name: value.product_title,
                sku: value.product_title,
                price: value.product_price,
                currency: "INR",
                quantity: value.quantity,
              };
              orderData.push(newOrderObject);
              newData.push(value);
            });
            localStorage.setItem("order", JSON.stringify(orderData));
            localStorage.setItem("total", grandTotal);

            this.setState({
              data: data,
              userData: profileData,
              address: profileData.address,
              phone: profileData.phone,
              name: profileData.name,
              email: profileData.email,
              grandTotal: grandTotal,
              newData: newData,
            });
          } else {
            this.props.history.push("/my-cart");
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  handelPyament = () => {
    let { userData } = this.state;
    this.props
      .paypalPayment({
        user_id: userData._id,
        order_data: localStorage.getItem("order"),
        total: localStorage.getItem("total"),
      })
      .then((res) => {
        if (res.responseData.status === 200) {
          window.location.replace(res.responseData.url);
        } else {
          console.log(res);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  render() {
    let { address, phone, name, email, grandTotal, newData } = this.state;

    return (
      <div className="container-fluid">
        <PageHeader name="Invoice" />
        <ReactTooltip />
        <div className="row">
          <div className="col-md-12">
            <div className="white-box">
              <div className="row">
                <div className="col-md-12">
                  <div className="white-box">
                    <h3>
                      <b>INVOICE</b>
                      <span className="pull-right">
                        <i className="fa fa-calendar" /> 28 Aug 2020
                      </span>
                    </h3>
                    <hr />
                    <div className="row">
                      <div className="col-md-12">
                        <div className="pull-left">
                          <address>
                            <h3>
                              &nbsp;<b className="text-danger">Elite Admin</b>
                            </h3>
                            <p className="text-muted m-l-5">
                              E 104, Dharti-2,
                              <br /> Nr' Viswakarma Temple,
                              <br /> Talaja Road,
                              <br /> Bhavnagar - 364002
                            </p>
                          </address>
                        </div>
                        <div className="pull-right text-right">
                          <address>
                            <h3>To,</h3>
                            <h4 className="font-bold">{name}</h4>
                            {email}
                            <div className="m-b-10"></div>
                            <p className="m-l-30">
                              <textarea
                                rows={5}
                                defaultValue={address}
                                onChange={this.onInputChange}
                                name="address"
                              />
                              <br />

                              <br />
                              <input
                                placeholder="Phone"
                                value={phone}
                                onChange={this.onInputChange}
                                name="phone"
                              />
                            </p>
                            <p className="m-t-30"></p>
                          </address>
                        </div>
                      </div>
                      <div className="col-md-12">
                        <div className="table-responsive m-t-40">
                          <table className="table table-hover">
                            <thead>
                              <tr>
                                <th className="text-center">#</th>
                                <th className="text-center">Name</th>
                                <th className="text-center">Product</th>
                                <th className="text-center">Quantity</th>
                                <th className="text-center">Price</th>
                                <th className="text-center">Total</th>
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
                                          <div>{value.quantity}</div>
                                        </div>
                                      </td>
                                      <td className="text-center">
                                        {value.product_price}
                                      </td>
                                      <td className="text-center">
                                        ₹{value.total}
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
                        *Address and phone number is required.
                        <div className="text-right">
                          <button
                            className={
                              "btn " +
                              (address && phone ? "btn-success" : "btn-danger")
                            }
                            type="submit"
                            onClick={(e) => {
                              address && phone
                                ? this.handelPyament()
                                : e.preventDefault();
                            }}
                          >
                            Proceed to payment
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
    storePrevLocation,
    getCartDetails,
    paypalPayment,
  })(Invoice)
);

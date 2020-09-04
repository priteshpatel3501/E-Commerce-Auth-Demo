import React, { Component } from "react";
import PageHeader from "../../Reusable/PageHeader";
import shop_icon from "../../../assets/shop_icon2.png";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { successPayment } from "../../../../actions";
import moment from "moment";
import momentTZ from "moment-timezone";
import "./Success.scss";

class Success extends Component {
  componentDidMount() {
    let data = localStorage.getItem("user");
    let profileData = {};
    if (data) {
      profileData = JSON.parse(data);
    }
    var payerId = this.getUrlVars()["PayerID"];
    var paymentId = this.getUrlVars()["paymentId"];
    var user_id = profileData._id;
    if (localStorage.getItem("order")) {
      this.handleCreateOrder(payerId, paymentId, user_id);
    }
  }
  getUrlVars = () => {
    var vars = [],
      hash;
    var hashes = window.location.href
      .slice(window.location.href.indexOf("?") + 1)
      .split("&");
    for (var i = 0; i < hashes.length; i++) {
      hash = hashes[i].split("=");
      vars.push(hash[0]);
      vars[hash[0]] = hash[1];
    }
    return vars;
  };
  handleCreateOrder = (payerId, paymentId, user_id) => {
    let currentTimezone = momentTZ.tz.guess();
    let formatedDate = momentTZ
      .tz(new Date(), currentTimezone)
      .format("YYYY-MM-DD");
    let api_payload = {
      payerId: payerId,
      paymentId: paymentId,
      user_id: user_id,
      order_data: localStorage.getItem("order"),
      total: localStorage.getItem("total"),
      order_date: formatedDate,
    };

    this.props
      .successPayment(api_payload)
      .then((res) => {
        if (res.responseData.status === 200) {
          localStorage.removeItem("order");
          localStorage.removeItem("total");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  render() {
    return (
      <div className="container-fluid">
        <PageHeader name="Payment" />
        <div className="row">
          <div className="col-md-12">
            <div className="white-box height-700">
              <div className="row">
                <div className="success-page">
                  <img src={shop_icon} className="center" alt="success" />
                  <h2>Payment Successful !</h2>
                  <p>
                    We are delighted to inform you that we received your
                    payments
                  </p>
                  <div className="row">
                    <a href="#" className="btn-view-orders">
                      View Orders
                    </a>
                  </div>
                  <a href="#">Continue Shopping</a>
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
    successPayment,
  })(Success)
);

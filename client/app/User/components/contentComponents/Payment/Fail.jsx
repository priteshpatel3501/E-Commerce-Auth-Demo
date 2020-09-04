import React, { Component } from "react";
import PageHeader from "../../Reusable/PageHeader";
import shop_icon from "../../../assets/shop_icon2.png";
import "./Fail.scss";

export default class Fail extends Component {
  render() {
    return (
      <div className="container-fluid">
        <PageHeader name="Payment" />
        <div className="row">
          <div className="col-md-12">
            <div className="white-box height-700">
              <div className="row">
                <div className="success-page">
                  <img src={shop_icon} className="center" alt="fail" />
                  <h2>Payment Failed !</h2>
                  <p>
                    We are delighted to inform you that we cannot received your
                    payments. please try again.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

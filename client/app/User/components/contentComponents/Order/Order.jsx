import React, { Component } from "react";
import PageHeader from "../../Reusable/PageHeader";
import ReactTooltip from "react-tooltip";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { getOrder, storePrevLocation } from "../../../../actions";
import global from "../../../../global";
import "./Order.scss";
class Order extends Component {
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
      .getOrder(profileData._id)
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

  render() {
    let { data } = this.state;

    return (
      <div className="container-fluid">
        <PageHeader name="My Order" />
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
                          <b>Order Details</b>
                        </h3>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-md-12">
                        <div className="table-responsive m-t-40">
                          <table className="table table-hover">
                            <thead>
                              <tr>
                                <th className="text-center">#</th>
                                <th className="text-center">Order ID</th>
                                <th className="text-center">Total</th>
                                <th className="text-center">Order Date</th>
                                <th className="text-center">Status</th>
                                <th className="text-center">Payment ID</th>
                              </tr>
                            </thead>
                            <tbody>
                              {data.length > 0 ? (
                                data.map((value, index) => {
                                  return (
                                    <tr key={index}>
                                      <td className="text-center">
                                        {index + 1}
                                      </td>
                                      <td className="text-center">
                                        {value._id}
                                      </td>
                                      <td className="text-center">
                                        ₹{value.total}
                                      </td>
                                      <td className="text-center">
                                        {value.order_date}
                                      </td>
                                      <td className="text-center">
                                        {value.status === 0 && (
                                          <div className="label label-warning">
                                            Pending
                                          </div>
                                        )}
                                        {value.status === 1 && (
                                          <div className="label label-success">
                                            Approved
                                          </div>
                                        )}
                                        {value.status === 2 && (
                                          <div className="label label-danger">
                                            Canceled
                                          </div>
                                        )}
                                      </td>
                                      <td className="text-center">
                                        {value.payment_id}
                                      </td>
                                    </tr>
                                  );
                                })
                              ) : (
                                <tr>
                                  <td colSpan="7" className="text-center">
                                    No Order Found.
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
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
    getOrder,
    storePrevLocation,
  })(Order)
);

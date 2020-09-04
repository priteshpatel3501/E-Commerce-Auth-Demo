import React, { Component } from "react";
import PageHeader from "../../Reusable/PageHeader";
import Datatable from "../../Reusable/OldDatatable";
import ReactTooltip from "react-tooltip";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import moment from "moment";
import momentTZ from "moment-timezone";
import global from "../../../../global";
import {
  getAllOrderData,
  storePrevLocation,
  editOrder,
} from "../../../../actions";

import noImage from "../../../assets/noimage.png";

class BookHistory extends Component {
  state = {
    data: [],
    isDataLoading: true,
    totalRow: 0,
    limit: 10,
    skip: 0,
    searchText: "",
    user_name: -1,
    status: -1,
    type: "user_name",
    order: -1,
  };
  componentDidMount() {
    this.fetchOrderHistoryList();
    this.props.storePrevLocation();
  }
  fetchOrderHistoryList = () => {
    let payload = {
      skip: this.state.skip,
      limit: this.state.limit,
      searchText: this.state.searchText,
      type: this.state.type,
      order: this.state.order,
    };
    this.props
      .getAllOrderData(payload)
      .then((res) => {
        if (
          res.responseData.status === 200 &&
          res.responseData.response_data.length > 0
        ) {
          this.setState({
            data: res.responseData.response_data,
            isDataLoading: false,
            totalRow: res.responseData.count,
          });
        } else {
          this.setState({
            data: [],
            isDataLoading: false,
            totalRow: 0,
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  handelOrderHistory = (data, status) => {
    data.status = status;
    this.props
      .editOrder(data, data._id)
      .then((res) => {
        if (res.responseData.status === 200) {
          this.fetchOrderHistoryList();
        } else {
          console.log(res);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  changeLimitSkip = (limit, skip) => {
    this.setState(
      {
        limit: limit,
        skip: skip,
      },
      () => {
        this.fetchOrderHistoryList();
      }
    );
  };
  handleSearch = (text) => {
    this.setState(
      {
        searchText: text,
        limit: 10,
        skip: 0,
      },
      () => {
        this.fetchOrderHistoryList();
      }
    );
  };
  changeOrder = (name, type) => {
    this.setState(
      {
        type: name,
        [name]: type,
        order: type,
      },
      () => {
        this.fetchOrderHistoryList();
      }
    );
  };
  render() {
    let {
      data,
      isDataLoading,
      totalRow,
      limit,
      skip,
      searchText,
      status,
      user_name,
      type,
      order,
    } = this.state;
    let currentTimezone = momentTZ.tz.guess();
    let bHistory = [];
    if (data) {
      data.map((book) => {
        let orderDate = "-";

        if (book.order_date) {
          orderDate = momentTZ
            .tz(book.order_date, currentTimezone)
            .format("MMM Do YYYY");
        }

        var orderHistoryObject = {
          action: book,
          id: book._id,
          user: book.user_profile
            ? book.login_type === 0
              ? global.config.imageUrl + "UserProfile/" + book.user_profile
              : book.user_profile
            : "",
          name: book.user_name ? book.user_name : "-",
          total: book.total ? book.total : "-",
          order_date: orderDate,
          status: book.status,
          payment_id: book.payment_id,
        };
        bHistory.push(orderHistoryObject);
        return book;
      });
    }
    const oHistoryColumns = [
      {
        name: "action",
        label: "Actions",
        options: {
          filter: false,
          sort: false,
          customBodyRender: (value, tableMeta, updateValue) => {
            return (
              <span className="d-flex">
                <ReactTooltip
                  className="react-popover"
                  id={"approved" + tableMeta.rowIndex}
                  place="right"
                  effect="solid"
                  wrapper="span"
                />
                <ReactTooltip
                  className="react-popover"
                  id={"cancel" + tableMeta.rowIndex}
                  place="right"
                  effect="solid"
                  wrapper="span"
                />
                <ReactTooltip
                  className="react-popover"
                  id={"pending" + tableMeta.rowIndex}
                  place="right"
                  effect="solid"
                  wrapper="span"
                />
                {value.status === 0 && (
                  <button
                    type="button"
                    className="btn btn-success btn-circle m-r-5"
                    onClick={() => {
                      this.handelOrderHistory(value, 1);
                    }}
                    data-for={"approved" + tableMeta.rowIndex}
                    data-tip="Approved"
                  >
                    <i className="ti-check-box" />
                  </button>
                )}
                {(value.status === 0 || value.status === 1) && (
                  <button
                    type="button"
                    className="btn btn-danger btn-circle"
                    onClick={() => {
                      this.handelOrderHistory(value, 2);
                    }}
                    data-for={"cancel" + tableMeta.rowIndex}
                    data-tip="Cancel"
                  >
                    <i className="ti-na" />
                  </button>
                )}

                {value.status === 2 && (
                  <button
                    type="button"
                    className="btn btn-warning btn-circle"
                    onClick={() => {
                      this.handelOrderHistory(value, 0);
                    }}
                    data-for={"pending" + tableMeta.rowIndex}
                    data-tip="Pending"
                  >
                    <i className="ti-na" />
                  </button>
                )}
              </span>
            );
          },
        },
      },
      {
        name: "id",
        label: "Order Id",
        options: {
          customBodyRender: (value, tableMeta, updateValue) => {
            return <span>{value}</span>;
          },
        },
      },
      {
        name: "user",
        label: "Profile",
        options: {
          customBodyRender: (value, tableMeta, updateValue) => {
            return (
              <span>
                <img
                  src={value}
                  alt="no book img"
                  className="img-responsive img-circle round-img"
                  data-for={"userImg" + tableMeta.rowIndex}
                  data-tip
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = noImage;
                  }}
                  width={50}
                />
                <ReactTooltip
                  className="react-popover"
                  id={"userImg" + tableMeta.rowIndex}
                  getContent={() => {
                    return (
                      <img
                        src={value}
                        alt="no logo"
                        height="120"
                        width="120"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = noImage;
                        }}
                      />
                    );
                  }}
                  place="right"
                  effect="solid"
                  wrapper="span"
                />
              </span>
            );
          },
        },
      },
      {
        name: "name",
        label: (
          <div className="d-flex">
            <div
              onClick={() => {
                this.changeOrder("user_name", user_name === -1 ? 1 : -1);
              }}
              style={{ cursor: "pointer" }}
            >
              Name
            </div>
            {type === "user_name" && (
              <div className="m-l-5">
                {order === 1 ? (
                  <i className="ti-arrow-up" />
                ) : (
                  <i className="ti-arrow-down" />
                )}
              </div>
            )}
          </div>
        ),
        options: {
          customBodyRender: (value, tableMeta, updateValue) => {
            return <span>{value}</span>;
          },
        },
      },
      {
        name: "total",
        label: "Total",
        options: {
          customBodyRender: (value, tableMeta, updateValue) => {
            return <span>₹{value}</span>;
          },
        },
      },
      {
        name: "order_date",
        label: "Order Date",
        options: {
          customBodyRender: (value, tableMeta, updateValue) => {
            return <span>{value}</span>;
          },
        },
      },
      {
        name: "status",
        label: (
          <div className="d-flex">
            <div
              onClick={() => {
                this.changeOrder("status", status === -1 ? 1 : -1);
              }}
              style={{ cursor: "pointer" }}
            >
              Status
            </div>
            {type === "status" && (
              <div className="m-l-5">
                {order === 1 ? (
                  <i className="ti-arrow-up" />
                ) : (
                  <i className="ti-arrow-down" />
                )}
              </div>
            )}
          </div>
        ),
        options: {
          customBodyRender: (value, tableMeta, updateValue) => {
            return (
              <span>
                {value === 0 && (
                  <div className="label label-warning">Pending</div>
                )}
                {value === 1 && (
                  <div className="label label-success">Approved</div>
                )}
                {value === 2 && (
                  <div className="label label-danger">Canceled</div>
                )}
              </span>
            );
          },
        },
      },
      {
        name: "payment_id",
        label: "Payment Id",
        options: {
          customBodyRender: (value, tableMeta, updateValue) => {
            return <span>{value}</span>;
          },
        },
      },
    ];

    return (
      <div className="container-fluid">
        <PageHeader name="Order History" />

        <ReactTooltip />
        <div className="row">
          <div className="col-md-12">
            <div className="white-box">
              <Datatable
                data={bHistory}
                columns={oHistoryColumns}
                isDataLoading={isDataLoading}
                serverSide={true}
                totalRow={totalRow}
                changeLimitSkip={this.changeLimitSkip}
                limit={limit}
                skip={skip}
                searchIcon={true}
                handleSearch={this.handleSearch}
                searchText={searchText}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(
  connect(null, {
    getAllOrderData,
    storePrevLocation,
    editOrder,
  })(BookHistory)
);

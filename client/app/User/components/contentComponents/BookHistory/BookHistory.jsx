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
  getBookHistory,
  getAllBooks,
  getAlUsers,
  createBookHistory,
  editBookHistory,
  deleteBookHistory,
  storePrevLocation,
} from "../../../../actions";

import noImage from "../../../assets/noimage.png";

class BookHistory extends Component {
  state = {
    data: [],
    bookList: [],
    userList: [],
    book: "",
    user: "",
    isDataLoading: true,
    totalRow: 0,
    limit: 10,
    skip: 0,
    searchText: "",
  };
  componentDidMount() {
    this.fetchBookList();
    this.fetchUserList();
    this.fetchBookHistoryList();
    this.props.storePrevLocation();
  }
  fetchBookHistoryList = () => {
    let payload = {
      skip: this.state.skip,
      limit: this.state.limit,
      searchText: this.state.searchText,
    };
    this.props
      .getBookHistory(payload)
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
  fetchBookList = () => {
    this.props
      .getAllBooks()
      .then((res) => {
        this.setState({
          bookList: res.responseData.response_data,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };
  fetchUserList = () => {
    this.props
      .getAlUsers()
      .then((res) => {
        this.setState({
          userList: res.responseData.response_data,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };
  handleChangeDropdown = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    this.setState({
      [name]: value,
    });
  };
  handelSubmitForm = (e) => {
    e.preventDefault();
    let { book, user } = this.state;
    let formatedDate = moment().utc().format();

    let payload = {
      user_id: user,
      book_id: book,
      issue_date: formatedDate,
      return_date: "",
    };

    this.props
      .createBookHistory(payload)
      .then((res) => {
        if (res.responseData.status === 200) {
          this.setState(
            {
              book: "",
              user: "",
            },
            () => {
              this.fetchBookHistoryList();
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
  handelResetForm = (e) => {
    e.preventDefault();
    this.setState({
      book: "",
      user: "",
    });
  };
  handelReturnBook = (data) => {
    let formatedDate = moment().utc().format();
    let payload = {
      user_id: data.user_id ? data.user_id : "",
      book_id: data.book_id ? data.book_id : "",
      issue_date: data.issue_date,
      return_date: formatedDate,
    };
    this.props
      .editBookHistory(payload, data._id)
      .then((res) => {
        if (res.responseData.status === 200) {
          this.fetchBookHistoryList();
        } else {
          console.log(res);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  handelDeleteBookHistory = (id) => {
    this.props
      .deleteBookHistory(id)
      .then((res) => {
        if (res.responseData.status === 200) {
          this.fetchBookHistoryList();
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
        this.fetchBookHistoryList();
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
        this.fetchBookHistoryList();
      }
    );
  };
  render() {
    let {
      data,
      bookList,
      userList,
      book,
      user,
      isDataLoading,
      totalRow,
      limit,
      skip,
      searchText,
    } = this.state;
    let currentTimezone = momentTZ.tz.guess();

    let is_disabled = user && book ? false : true;

    let bHistory = [];
    if (data) {
      data.map((book) => {
        let issueDate = "-";
        let returnDate = "-";

        if (book.issue_date) {
          issueDate = momentTZ
            .tz(book.issue_date, currentTimezone)
            .format("MMMM Do YYYY, hh:mm A");
        }
        if (book.return_date) {
          returnDate = momentTZ
            .tz(book.return_date, currentTimezone)
            .format("MMMM Do YYYY, hh:mm A");
        }
        var bookHistoryObject = {
          action: book,
          book: book.book_profile ? book.book_profile : "",
          title: book.book_title ? book.book_title : "-",
          user: book.user_profile ? book.user_profile : "",
          name: book.user_name ? book.user_name : "-",
          issue_at: issueDate,
          return_date: returnDate,
        };
        bHistory.push(bookHistoryObject);
        return book;
      });
    }
    const bHistoryColumns = [
      {
        name: "action",
        label: "Actions",
        options: {
          filter: false,
          sort: false,
          customBodyRender: (value, tableMeta, updateValue) => {
            let is_delete = false;
            let is_return = false;

            if (value.return_date !== "" || !value.user_id || !value.book_id) {
              is_delete = true;
            }
            if (value.return_date === "" && value.user_id && value.book_id) {
              is_return = true;
            }

            return (
              <span className="d-flex">
                <ReactTooltip
                  className="react-popover"
                  id={"delete" + tableMeta.rowIndex}
                  place="right"
                  effect="solid"
                  wrapper="span"
                />

                {is_delete && (
                  <button
                    type="button"
                    className="btn btn-danger btn-circle"
                    onClick={() => {
                      this.handelDeleteBookHistory(value._id);
                    }}
                    data-for={"delete" + tableMeta.rowIndex}
                    data-tip="Delete"
                  >
                    <i className="ti-trash" />
                  </button>
                )}

                <ReactTooltip
                  className="react-popover"
                  id={"return" + tableMeta.rowIndex}
                  place="right"
                  effect="solid"
                  wrapper="span"
                />

                {is_return && (
                  <button
                    type="button"
                    className="btn btn-info btn-circle"
                    onClick={() => {
                      this.handelReturnBook(value);
                    }}
                    data-for={"return" + tableMeta.rowIndex}
                    data-tip="Return"
                  >
                    <i className="ti-back-left" />
                  </button>
                )}
              </span>
            );
          },
        },
      },
      {
        name: "book",
        label: "Book",
        options: {
          customBodyRender: (value, tableMeta, updateValue) => {
            return (
              <span>
                <img
                  src={global.config.imageUrl + "BookProfile/" + value}
                  alt="no book img"
                  className=""
                  data-for={"bookImg" + tableMeta.rowIndex}
                  data-tip
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = noImage;
                  }}
                  width={35}
                  height={50}
                />
                <ReactTooltip
                  className="react-popover"
                  id={"bookImg" + tableMeta.rowIndex}
                  getContent={() => {
                    return (
                      <img
                        src={global.config.imageUrl + "BookProfile/" + value}
                        alt="no logo"
                        height="150"
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
        name: "title",
        label: "Title",
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
                  src={global.config.imageUrl + "UserProfile/" + value}
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
                        src={global.config.imageUrl + "UserProfile/" + value}
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
        label: "Name",
        options: {
          customBodyRender: (value, tableMeta, updateValue) => {
            return <span>{value}</span>;
          },
        },
      },
      {
        name: "issue_at",
        label: "Issue At",
      },
      {
        name: "return_date",
        label: "Return At",
      },
    ];

    return (
      <div className="container-fluid">
        <PageHeader name="Book History" />

        <ReactTooltip />
        <div className="row">
          <div className="col-md-12">
            <div className="white-box">
              {/* <div className="row">
                <div className="col-md-3">
                  <div className="form-group">
                    <label className="control-label">Book</label>
                    <select
                      className="form-control"
                      onChange={this.handleChangeDropdown}
                      name="book"
                      value={book}
                    >
                      <option value="">Select Book</option>
                      {bookList.length > 0 &&
                        bookList.map((value, index) => {
                          return (
                            <option
                              key={index}
                              value={value._id}
                            >{`${value.title} (${value.author})`}</option>
                          );
                        })}
                    </select>
                  </div>
                </div>

                <div className="col-md-3">
                  <div className="form-group">
                    <label className="control-label">User</label>
                    <select
                      className="form-control"
                      onChange={this.handleChangeDropdown}
                      name="user"
                      value={user}
                    >
                      <option value="">Select user</option>
                      {userList.length > 0 &&
                        userList.map((value, index) => {
                          return (
                            <option
                              key={index}
                              value={value._id}
                            >{`${value.name}`}</option>
                          );
                        })}
                    </select>
                  </div>
                </div>
                <div className="col-md-3 d-flex flex-column justify-content-center">
                  <div className="form-actions">
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
                </div>
              </div> */}
              <Datatable
                data={bHistory}
                columns={bHistoryColumns}
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
    getBookHistory,
    getAllBooks,
    getAlUsers,
    createBookHistory,
    editBookHistory,
    deleteBookHistory,
    storePrevLocation,
  })(BookHistory)
);

import React, { Component } from "react";
import MUIDataTable from "mui-datatables";
import "./DataTable.scss";
import Loader from "../LoaderSpinner";
import Toolbar from "../CustomToolbar";
import _ from "lodash";
class Datatable extends Component {
  state = {
    limit: 100,
    skip: 0,
    data: [],
    totalRow: 0,
    currentPage: 1,
    totalPages: 0,
    rowsPerPage: 100,
    askForConfirmation: false,
    hideRowsPerPageOption: false,
  };

  UNSAFE_componentWillMount = () => {
    let { limit, skip, hideRowsPerPageOption } = this.props;
    this.setState({
      // rowsPerPage: limit,
      limit: limit,
      skip: skip,
      hideRowsPerPageOption: hideRowsPerPageOption ? true : false,
    });
  };

  UNSAFE_componentWillReceiveProps = (nextProps) => {
    if (this.props !== nextProps) {
      if (!_.isEqual(this.props.data, nextProps.data)) {
        // this.setState({ data: [] }, () => {
        this.setState({ data: nextProps.data });
        // })
      }

      this.setState(
        {
          limit: nextProps.limit,
          skip: nextProps.skip,
          rowsPerPage: nextProps.limit,
          totalRow: nextProps.totalRow,
          ...(nextProps.skip === 0 && { currentPage: 1 }),
        },
        () => {
          this.countTotalPages();
        }
      );
    }
  };

  shouldComponentUpdate = (nextProps, nextState) => {
    if (
      !_.isEqual(this.state, nextState) ||
      !_.isEqual(this.props, nextProps)
    ) {
      return true;
    } else {
      return false;
    }
  };

  countTotalPages = () => {
    let pages = Math.ceil(this.state.totalRow / this.state.limit);
    this.setState({
      totalPages: pages === 0 ? 1 : pages,
    });
  };

  goToNextPrev = (action) => {
    let newSkip, currentPage;
    if (action === "Next") {
      newSkip = Number(this.state.skip) + Number(this.state.limit);
      currentPage = this.state.currentPage + 1;
    } else {
      newSkip = Number(this.state.skip) - Number(this.state.limit);
      currentPage = this.state.currentPage - 1;
    }
    this.setState(
      {
        currentPage: currentPage,
      },
      () => {
        this.props.changeLimitSkip(this.state.limit, newSkip);
      }
    );
  };

  changeRowsPerPage = (e) => {
    this.props.changeLimitSkip(Number(e.target.value), 0);
  };

  customFooter = (count, page, rowsPerPage, changeRowsPerPage, changePage) => {
    let {
      currentPage,
      totalPages,
      totalRow,
      hideRowsPerPageOption,
    } = this.state;

    return (
      <tfoot>
        <tr>
          <td colSpan="5">
            <div className="pull-right m-r-30 p-10 d-flex align-items-center flex-wrap">
              {!hideRowsPerPageOption ? (
                <div className="p-10">
                  Rows per page :&nbsp;
                  <select
                    name="rowsPerPage"
                    className="form-control custom-select my-select"
                    value={this.state.rowsPerPage}
                    onChange={this.changeRowsPerPage}
                  >
                    <option value="10">10</option>
                    <option value="15">15</option>
                    <option value="20">20</option>
                    <option value="100">100</option>
                  </select>
                </div>
              ) : (
                ""
              )}
              <div className="p-10">Total Records: {totalRow}</div>
              <div className="p-10 text-nowrap">
                <span className="m-t-5 mr-2">
                  Current Page :{" "}
                  <span className="font-bold"> {currentPage}</span> /{" "}
                  {this.state.totalPages}
                </span>
                <button
                  className="btn-circle btn-default m-r-5 font-bold"
                  onClick={() => this.goToNextPrev("Prev")}
                  disabled={currentPage === 1 ? true : false}
                >
                  <i className="fa fa-angle-left"></i>
                </button>
                <button
                  className=" btn-circle btn-default font-bold"
                  onClick={() => this.goToNextPrev("Next")}
                  disabled={currentPage === totalPages ? true : false}
                >
                  <i className="fa fa-angle-right"></i>
                </button>
              </div>
            </div>
          </td>
        </tr>
      </tfoot>
    );
  };

  customToolbar = () => {
    return (
      <Toolbar
        searchText={this.props.searchText}
        handleSearch={this.props.handleSearch}
        data={this.state.data}
        searchIcon={this.props.searchIcon}
      />
    );
  };
  // onTableChange = (action, state) => {
  //     if (action === "search") {
  //         this.props.handleSearch(state.searchText)
  //     }
  // }

  render() {
    let { columns, serverSide, isDataLoading } = this.props;
    let { rowsPerPage, data } = this.state;
    let options = {
      responsive: "scrollMaxHeight",
      selectableRows: "none",
      filter: false,
      sort: false,
      print: false,
      download: false,
      viewColumns: false,
      rowsPerPage: rowsPerPage,
      fixedHeader: {
        xAxis: true,
        yAxis: true,
      },
      textLabels: {
        body: {
          noMatch: isDataLoading ? (
            <div className="data-loader">
              <Loader
                width={25}
                height={25}
                borderWidth={2}
                color="#bbb4b4"
                // color="#000000"
              />
            </div>
          ) : (
            "Sorry, there is no matching data to display"
          ),
        },
      },
    };

    options = serverSide
      ? {
          ...options,
          search: false,
          // onTableChange: this.onTableChange,
          ...(this.props.searchIcon && { customToolbar: this.customToolbar }),
          customFooter: () => this.customFooter(),
        }
      : { ...options };

    return (
      <div className="dataTable">
        <MUIDataTable data={data} columns={columns} options={options} />
      </div>
    );
  }
}
export default Datatable;

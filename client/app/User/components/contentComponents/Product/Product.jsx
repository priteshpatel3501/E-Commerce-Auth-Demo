import React, { Component } from "react";
import PageHeader from "../../Reusable/PageHeader";
import ProductCards from "../../Reusable/ProductCards";
import ReactTooltip from "react-tooltip";
import { withRouter, NavLink } from "react-router-dom";
import { connect } from "react-redux";
import {
  getAllProduct,
  deleteProduct,
  storePrevLocation,
} from "../../../../actions";
class Product extends Component {
  state = {
    data: [],
  };
  componentDidMount() {
    this.fetchProductList();
    this.props.storePrevLocation();
  }
  fetchProductList = () => {
    this.props
      .getAllProduct()
      .then((res) => {
        this.setState({
          data: res.responseData.response_data,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };
  handelDeleteProduct = (id) => {
    this.props
      .deleteProduct(id)
      .then((res) => {
        if (res.responseData.status === 200) {
          this.fetchProductList();
        } else {
          console.log(res);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  handelMoveEditForm = (id) => {
    this.props.history.push("/product-form/" + id);
  };
  render() {
    let { data } = this.state;

    return (
      <div className="container-fluid">
        <PageHeader name="Products" />
        <ReactTooltip />
        <div className="row">
          <div className="col-md-12">
            <div className="white-box">
              <div className="col-md-12">
                <div className="float-right">
                  <NavLink
                    exact
                    activeClassName="waves-effect active"
                    to="/product-form"
                  >
                    <button
                      type="button"
                      className="btn btn-success pl-5 pr-5 pt-4 pb-4 m-b-20"
                    >
                      Add new product
                    </button>
                  </NavLink>
                </div>
              </div>
              <div className="row">
                {data.length > 0 ? (
                  data.map((value, index) => {
                    return (
                      <div key={index}>
                        <ProductCards
                          data={value}
                          is_admin={true}
                          handelMoveEditForm={this.handelMoveEditForm}
                          handelDeleteForm={this.handelDeleteProduct}
                        />
                      </div>
                    );
                  })
                ) : (
                  <div>No Product Display</div>
                )}
              </div>

              {/* <div className="table-responsive">
                <Datatable thead={THead} tbody={TBody} />
              </div> */}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default withRouter(
  connect(null, {
    getAllProduct,
    deleteProduct,
    storePrevLocation,
  })(Product)
);

import React, { Component } from "react";
import PageHeader from "../../Reusable/PageHeader";
import ReactTooltip from "react-tooltip";
import "./Home.scss";
import ProductCards from "../../Reusable/ProductCards";
import { withRouter, NavLink } from "react-router-dom";
import { connect } from "react-redux";
import {
  getAllProduct,
  storePrevLocation,
  createCart,
} from "../../../../actions";
class Home extends Component {
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
        if (res.responseData.status === 200) {
          this.setState({
            data: res.responseData.response_data,
          });
        } else {
          console.log("Error");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  handleCreateProduct = (data) => {
    let sroreData = localStorage.getItem("user");

    let profileData = {};
    if (sroreData) {
      profileData = JSON.parse(sroreData);
    }
    let api_pyload = {
      user_id: profileData._id,
      product_id: data._id,
      quantity: 1,
    };
    this.props
      .createCart(api_pyload)
      .then((res) => {
        if (res.responseData.status === 200) {
          this.props.history.push("/my-cart");
        } else {
          console.log("Error");
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
        <PageHeader name="Home" />
        <ReactTooltip />
        <div className="row">
          <div className="col-md-12">
            <div className="white-box">
              <div className="row">
                {data.length > 0 ? (
                  data.map((value, index) => {
                    return (
                      <div key={index}>
                        <ProductCards
                          data={value}
                          handleCreate={this.handleCreateProduct}
                        />
                      </div>
                    );
                  })
                ) : (
                  <div>No Product Display</div>
                )}
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
    getAllProduct,
    storePrevLocation,
    createCart,
  })(Home)
);

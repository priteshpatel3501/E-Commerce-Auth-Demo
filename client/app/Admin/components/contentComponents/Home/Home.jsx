import React, { Component } from "react";
import PageHeader from "../../Reusable/PageHeader";
import ReactTooltip from "react-tooltip";
import "./Home.scss";
import ProductCards from "../../Reusable/ProductCards";
import { withRouter, NavLink } from "react-router-dom";
import { connect } from "react-redux";
import { getAllProduct, storePrevLocation } from "../../../../actions";
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
        this.setState({
          data: res.responseData.response_data,
        });
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
                        <ProductCards data={value} is_admin={false} />
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
  })(Home)
);

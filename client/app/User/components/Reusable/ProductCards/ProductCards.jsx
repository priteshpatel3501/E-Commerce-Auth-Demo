import React, { Component } from "react";
import "./ProductCards.scss";
export default class ProductCards extends Component {
  handelCartRaw = (id) => {
    this.props.handleCreate(id);
  };

  render() {
    let { data } = this.props;
    let { description, price, title, profile, _id } = data;
    return (
      <div className="card">
        <div className="m-t-20">
          <img
            src={`http://localhost:8000/server/Images/BookProfile/${profile}`}
            alt="Denim Jeans"
            style={{ width: "auto", height: "110px" }}
          />
        </div>

        <h3>{title}</h3>
        <p className="price">₹{price}</p>
        <p className="description">{description}</p>
        <p className="mlr">
          <button
            onClick={() => {
              this.handelCartRaw(data);
            }}
          >
            Add to Carts
          </button>
        </p>
      </div>
    );
  }
}

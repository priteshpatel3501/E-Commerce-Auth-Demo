import React, { Component } from "react";
import "./ProductCards.scss";
export default class ProductCards extends Component {
  handelEditRaw = (id) => {
    this.props.handelMoveEditForm(id);
  };
  handelDeleteRaw = (id) => {
    this.props.handelDeleteForm(id);
  };
  render() {
    let { is_admin, data } = this.props;
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
          {is_admin ? (
            <div className="d-flex">
              <button
                className="m-r-10 m-l-10 btn1-color"
                onClick={() => {
                  this.handelEditRaw(_id);
                }}
              >
                Edit
              </button>
              <button
                className="m-l-10 m-r-10 btn2-color"
                onClick={() => {
                  this.handelDeleteRaw(_id);
                }}
              >
                Delete
              </button>
            </div>
          ) : (
            <button>Add to Carts</button>
          )}
        </p>
      </div>
    );
  }
}

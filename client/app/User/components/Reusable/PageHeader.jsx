import React, { Component } from "react";

export default class PageHeader extends Component {
  render() {
    let title = this.props.name;
    return (
      <div className="row bg-title">
        <div className="col-lg-3 col-md-4 col-sm-4 col-xs-12">
          <h4 className="page-title">{title}</h4>
        </div>
        <div className="col-lg-9 col-sm-8 col-md-8 col-xs-12">
          <ol className="breadcrumb">
            <li>
              <a href="# ">Dashboard</a>
            </li>
            <li className="active">{title}</li>
          </ol>
        </div>
      </div>
    );
  }
}

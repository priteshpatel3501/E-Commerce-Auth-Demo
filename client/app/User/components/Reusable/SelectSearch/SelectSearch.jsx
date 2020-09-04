import React, { Component } from "react";
import "./SelectSearch.scss";
import ReactSelectSearch from "react-select-search";
import "react-select-search/style.css";
class SelectSearch extends Component {
  render() {
    let {
      options,
      handleChange,
      name,
      value,
      placeholder,
      classList
    } = this.props;

    return (
      <ReactSelectSearch
        className={classList}
        options={options}
        value={value}
        name={name}
        placeholder={placeholder}
        onChange={handleChange}
        {...this.props}
      />
    );
  }
}
export default SelectSearch;

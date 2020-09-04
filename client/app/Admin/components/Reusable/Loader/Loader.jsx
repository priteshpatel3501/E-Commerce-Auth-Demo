import React, { Component } from "react";
import "./Loader.scss";
import Loaderr from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
class Loader extends Component {
  render() {
    return (
      <div
        id="loader"
        style={{
          position: "fixed",
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          background: "#fff",
          zIndex: 9999
        }}
      >
        <div className="cssload-speeding-wheel loader text-center">
          <Loaderr
            type="Oval"
            color="#233750"
            height={70}
            width={70}
            // timeout={3000} //3 secs
          />
        </div>
      </div>
      // <div className="preloader">
      //     <div className="cssload-speeding-wheel loader"></div>
      // </div>
    );
  }
}
export default Loader;

import React, { Component } from "react";
import "./LoaderSpinner.scss";
// import Loaderr from "react-loader-spinner";
// import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
class LoaderSpinner extends Component {

    render() {
        let { width, height, color, borderWidth, animationDuration } = this.props;
        return (
            // <div class="loader">Loading...</div>
            // <div
            //   id="loader"
            //   style={{
            //     position: "fixed",
            //     top: 0,
            //     bottom: 0,
            //     left: 0,
            //     right: 0,
            //     background: "#fff",
            //     zIndex: 9999
            //   }}
            // >
            //   <div className="cssload-speeding-wheel loader text-center">
            //     <Loaderr
            //       type="Oval"
            //       color="#233750"
            //       height={30}
            //       width={30}
            //     // timeout={3000} //3 secs
            //     />
            //   </div>
            // </div>

            <span className="spinner" style={{
                width: width,
                height: height,
                borderTopColor: color,
                borderWidth: borderWidth,
                animationDuration: animationDuration
            }}></span>
        );
    }
}
export default LoaderSpinner;
  // <div className="preloader">
  //     <div className="cssload-speeding-wheel loader"></div>
  // </div>

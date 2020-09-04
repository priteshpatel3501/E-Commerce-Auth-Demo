import React, { Component } from "react";
import DropzoneComponent from "react-dropzone-component";
import "../../../../../../node_modules/dropzone/dist/min/dropzone.min.css";
import "./dropzone.scss";

var componentConfig = {
  iconFiletypes: [".jpg", ".png", ".gif"],
  showFiletypeIcon: true,
  postUrl: "no-url",
};
var djsConfig = { autoProcessQueue: true, addRemoveLinks: true, maxFiles: 1 };

export default class dropzone extends Component {
  // handelAddImage
  render() {
    var eventHandlers = {
      addedfile: (file) => this.props.handelAddImage(file),
      removedfile: () => this.props.handelRemoveImage(),
    };

    return (
      <div>
        <DropzoneComponent
          config={componentConfig}
          eventHandlers={eventHandlers}
          djsConfig={djsConfig}
        />
      </div>
    );
  }
}

import React from "react";
import IconButton from "@material-ui/core/IconButton";
import TextBox from "@material-ui/core/TextField";
import Tooltip from "@material-ui/core/Tooltip";
import ClearIcon from "@material-ui/icons/Clear";
import SearchIcon from "@material-ui/icons/Search";
import DownloadIcon from "@material-ui/icons/CloudDownload";
import { withStyles } from "@material-ui/core/styles";
import _ from "lodash";
import * as $ from "jquery";

const defaultToolbarStyles = {
  searchText: {},
  icon: {},
};

class Toolbar extends React.Component {
  constructor(props) {
    super(props);
    this.delayedCallback = _.debounce(this.props.handleSearch, 1000);
  }
  state = {
    openSearchBox: false,
    searchText: "",
    multiDataSet: [],
    data: [],
    searchIcon: true,
  };

  UNSAFE_componentWillReceiveProps = (nextProps) => {
    if (this.props !== nextProps) {
      // if (nextProps.searchIcon === false) {
      //   this.setState({ searchIcon: false });
      // }
      this.setState(
        {
          data: nextProps.data,
          searchText: nextProps.searchText,
          searchIcon: nextProps.searchIcon,
          ...(nextProps.searchText && { openSearchBox: true }),
        },
        () => {
          // document.getElementById("search-input").value = nextProps.searchText;
          $("#search-input").val(this.state.searchText);
        }
      );
    }
  };
  handleClick = () => {
    this.setState({
      openSearchBox: true,
    });
  };
  handleCloseClick = () => {
    this.setState(
      {
        openSearchBox: false,
      },
      function () {
        this.props.handleSearch("");
      }
    );
  };
  handleOnChange = (e) => {
    // this.setState({
    //     searchText: e.target.value
    // }, () => {
    // this.props.handleSearch(e.target.value)
    // e.persist();
    this.delayedCallback(_.trim(e.target.value));
    // })
  };

  exportData = () => {
    this.props.exportToExcel().then((data) => {
      if (data) {
        this.setState(
          {
            multiDataSet: data,
          },
          () => {
            setTimeout(() => {
              this.setState({
                multiDataSet: [],
              });
            }, 1000);
          }
        );
      }
    });
  };

  render() {
    const { classes } = this.props;
    return (
      <React.Fragment>
        {this.state.searchIcon ? (
          this.state.openSearchBox ? (
            <React.Fragment>
              <TextBox
                id="search-input"
                onChange={this.handleOnChange}
                className={classes.searchText}
                placeholder="Enter search value"
                autoFocus
              />

              <Tooltip title={"Close"}>
                <IconButton
                  className={classes.icon}
                  onClick={this.handleCloseClick}
                >
                  <ClearIcon />
                </IconButton>
              </Tooltip>
            </React.Fragment>
          ) : (
            <Tooltip title={"Search"}>
              <IconButton className={classes.icon} onClick={this.handleClick}>
                <SearchIcon />
              </IconButton>
            </Tooltip>
          )
        ) : (
          ""
        )}

        {/* Excel Export button */}
        {this.props.export ? (
          this.state.multiDataSet.length === 0 ? (
            this.state.data.length !== 0 ? (
              <Tooltip title={"Export to excel"}>
                <IconButton className={classes.icon} onClick={this.exportData}>
                  <DownloadIcon />
                </IconButton>
              </Tooltip>
            ) : (
              <Tooltip title={"No data to Export"}>
                <IconButton className={classes.icon + " cursor-not-allowed"}>
                  <DownloadIcon />
                </IconButton>
              </Tooltip>
            )
          ) : (
            <span>
              <Tooltip title={"Export to excel"}>
                <IconButton className={classes.icon}>
                  <DownloadIcon />
                </IconButton>
              </Tooltip>
            </span>
          )
        ) : (
          ""
        )}
      </React.Fragment>
    );
  }
}

export default withStyles(defaultToolbarStyles, {
  name: "MUIDataTableToolbar",
})(Toolbar);

// data: [{
//     columns: [
//         { title: "Headings", width: { wpx: 80 } },//pixels width
//         { title: "Text Style", width: { wch: 40 } },//char width
//         { title: "Colors", width: { wpx: 90 } },
//     ],
//     data: [
//         [
//             { value: "H1", style: { font: { sz: "24", bold: true } } },
//             { value: "Bold", style: { font: { bold: true } } },
//             { value: "Red", style: { fill: { patternType: "solid", fgColor: { rgb: "FFFF0000" } } } },
//         ],
//         [
//             { value: "H2", style: { font: { sz: "18", bold: true } } },
//             { value: "underline", style: { font: { underline: true } } },
//             { value: "Blue", style: { fill: { patternType: "solid", fgColor: { rgb: "FF0000FF" } } } },
//         ],
//         [
//             { value: "H3", style: { font: { sz: "14", bold: true } } },
//             { value: "italic", style: { font: { italic: true } } },
//             { value: "Green", style: { fill: { patternType: "solid", fgColor: { rgb: "FF00FF00" } } } },
//         ],
//         [
//             { value: "H4", style: { font: { sz: "12", bold: true } } },
//             { value: "strike", style: { font: { strike: true } } },
//             { value: "Orange", style: { fill: { patternType: "solid", fgColor: { rgb: "FFF86B00" } } } },
//         ],
//         [
//             { value: "H5", style: { font: { sz: "10.5", bold: true } } },
//             { value: "outline", style: { font: { outline: true } } },
//             { value: "Yellow", style: { fill: { patternType: "solid", fgColor: { rgb: "FFFFFF00" } } } },
//         ],
//         [
//             { value: "H6", style: { font: { sz: "7.5", bold: true } } },
//             { value: "shadow", style: { font: { shadow: true } } },
//             { value: "Light Blue", style: { fill: { patternType: "solid", fgColor: { rgb: "FFCCEEFF" } } } }
//         ]
//     ]
// }]

import React, { Component } from "react";
import $ from "jquery";
import DataTable from "datatables.net";
import "datatables.net-buttons";
import "datatables.net";
// import pdfMake from "pdfmake/build/pdfmake";
// import pdfFonts from "pdfmake/build/vfs_fonts";
import "datatables.net-buttons/js/buttons.html5";
import "datatables.net-buttons/js/buttons.print";
// import * as JSZip from "jszip";
// pdfMake.vfs = pdfFonts.pdfMake.vfs;
// window.JSZip = JSZip;
$.DataTable = DataTable;

export default class Datatable extends Component {
  componentDidMount() {
    $("#example234").DataTable({
      dom: "Bfrtip",
      buttons: [
        // {
        //   extend: "csv",
        //   title: "React CSV",
        // },
        // {
        //   extend: "excel",
        //   title: "React Excel",
        // },
        // {
        //   extend: "pdf",
        //   title: "React Pdf",
        // },
        // {
        //   extend: "print"
        // }
      ],
    });
  }
  render() {
    return (
      <table id="example23" className="table table-striped" ref="main">
        <thead>{this.props.thead}</thead>

        {this.props.tbody}
      </table>
    );
  }
}

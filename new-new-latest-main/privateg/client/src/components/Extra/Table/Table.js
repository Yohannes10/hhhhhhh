import React, { Component } from 'react';
import './Table.css';
import $ from 'jquery'; // Import jQuery here
$.DataTable = require('datatables.net-bs4');


class Table extends Component {
  constructor(props) {
    super(props);

    // Define your table data here, as an array of objects
    this.state = {
      tableData: [
        {
          tagID: '',
          tagName: 'Poor',
          tagType: 'Below Expectations',
          myFeed: 'Meeting Expectations',
          myFavorites: 'Above Expectations',
          action: 'Outstanding and Exceptional',
        },
      
      ],
    };
  }

  componentDidMount() {
    // Initialize the DataTable when the component mounts
    this.initializeDataTable();
  }
   
  initializeDataTable() {
    // DataTable configuration
    const tableConfig = {
      dom: 'rt<"bottom"flp><"clear">',
      data: this.state.tableData,
      columns: [
        { title: '', data: 'tagID' },
        { title: '★ ', data: 'tagName' },
        { title: '★ ★', data: 'tagType' },
        { title: '★ ★ ★', data: 'myFeed' },
        { title: '★ ★ ★ ★', data: 'myFavorites' },
        { title: '★ ★ ★ ★ ★', data: 'action' },
      ],
      searching: false, // Disable search
  paging: false,     // Disable pagination
  info: false,       // Disable "Showing X of Y entries" info
    };

    // Initialize the DataTable on the table element
    $(this.tableRef).DataTable(tableConfig);
  }

  render() {
    return (
      <div> 
        <table
          className="table table-striped table-bordered table-hover table-sm"
          width="100%"
          ref={(el) => (this.tableRef = el)}
        ></table>
      </div>
    );
  }
}

export default Table;

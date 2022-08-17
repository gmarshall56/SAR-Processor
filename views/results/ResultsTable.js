import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from "next/router";
import {
    Button,
    Row,
    Col,
    Modal,
    Image
} from 'react-bootstrap';
import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory from 'react-bootstrap-table2-filter';
import { textFilter } from 'react-bootstrap-table2-filter';

import "bootstrap/dist/css/bootstrap.min.css";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css"

import styles from '../../styles/Home.module.css'



const ResultsTable = (props) => {
    const router = useRouter();

  let { inputTableData } = props;

  const [hideHourglass, setHideHourglass] = useState(true);


  const handleClickHourglass = async (event) => {
    event.preventDefault();
    setHideHourglass(!hideHourglass);
};

  const viewTableClick = () => {

    console.log('CLicked the vew SAR DLA CRM table!"');
    router.push('/SarTablePage');

  }

  const columns = [
    {
        dataField: 'validationMessage',
        text: 'Validations Message',
        sort: true,
        filter: textFilter(),
        editable: false,
    },
    {
        dataField: 'serviceOrderId',
        text: 'ServiceOrderId',
        sort: true,
        filter: textFilter(),
        editable: false,
    },
    {
        dataField: 'description',
        text: 'Description',
        sort: true,
        filter: textFilter(),
        editable: false,
    },
    {
        dataField: 'priority',
        text: 'Priority',
        sort: true,
        filter: textFilter(),
        editable: false,
    },
    {
        dataField: 'employeeResponsible',
        text: 'Employee Responsible',
        sort: true,
        filter: textFilter(),
        editable: false,

    },
    {
        dataField: 'strCreationDate',
        text: 'Creation Date',
        sort: true,
        headerFormatter: searchFormatter,
        filter: textFilter(),
        editable: false,
        // sortFunc: (a, b, order, dataField, rowA, rowB) => {
        //     if (order === 'asc')
        //     {
        //         return Date.parse(a) - Date.parse(b)
        //     }
        //     else if (order === 'desc') {
        //         return  Date.parse(b) - Date.parse(a)
        //     }
        // }
    },
    {
        dataField: 'contact',
        text: 'Contact',
        sort: true,
        headerFormatter: searchFormatter,
        filter: textFilter(),
        editable: false,
    },
];

  function searchFormatter(column, colIndex, { sortElement, filterElement }) {
    if (hideHourglass) {
        return (
            <>
                <div >

                    {column.text}&nbsp;<Image src="/sort-alpha-down.svg" style={{ cursor: 'pointer' }} />


                    <div style={{ float: 'right', display: 'inline-block', cursor: 'pointer' }}>
                        <Image
                            src="/search.svg" height="16px" width="16px" onClick={handleClickHourglass} />
                    </div>
                </div>


            </>
        );
    } else {
        return (
            <>
                <div>
                    {column.text}&nbsp;<Image src="/ui-maps/sort-alpha-down.svg" style={{ cursor: 'pointer' }} />
                    <div style={{ float: 'right', display: 'inline-block', cursor: 'pointer' }}>
                        <Image src="/ui-maps/search.svg" height="16px" width="16px" onClick={handleClickHourglass} />
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    {filterElement}
                </div>

            </>
        );
    }
  }

  
  return (
            <div style={{padding: "20px"}}>
              <h1 className={styles.messages}>Results of SAR Loading</h1>
              <div>
              <Button onClick={() => viewTableClick()} bsStyle="primary">View Contents of SAR DLA CRM Table</Button>
              <br/>
              <br/>
              </div>
                  <BootstrapTable bootstrap4
                    keyField="serviceOrderId"
                    data={inputTableData}
                    columns={columns}
                    striped
                    hover
                    noDataIndication="0 Records Found"
                    filter={filterFactory()}
                  />
              </div>
  )

}

export default ResultsTable;
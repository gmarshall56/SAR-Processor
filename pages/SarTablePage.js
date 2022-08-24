import React, { useEffect, useState } from 'react';
import { ActivityIndicator } from "react-native-web";
import { useRouter } from "next/router";
import {
  Button,
  Row,
  Col,
  Modal,
  Image
} from 'react-bootstrap';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory, { PaginationProvider } from 'react-bootstrap-table2-paginator';
import filterFactory from 'react-bootstrap-table2-filter';
import { textFilter } from 'react-bootstrap-table2-filter';
import Spinner from '../components/UI/Spinner/Spinner';

import axios from "axios";

import "bootstrap/dist/css/bootstrap.min.css";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css"

import styles from '../styles/Home.module.css'


function SarTablePage() {
  const router = useRouter();

  const [sarTableData, setSarTableData] = useState([]);
  const [hideHourglass, setHideHourglass] = useState(true);
  const [loading, setLoading] = useState(false);


  const handleClickHourglass = async (event) => {
    event.preventDefault();
    setHideHourglass(!hideHourglass);
  };

  const handleClick = (e) => {
    e.preventDefault()
    router.push(href)
  }

    const columns = [
    {
        dataField: 'service_order_id',
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
        dataField: 'employee_responsible',
        text: 'Employee Responsible',
        sort: true,
        filter: textFilter(),
        editable: false,

    },
    {
        dataField: 'created_on',
        text: 'Creation Date',
        sort: true,
        headerFormatter: searchFormatter,
        // filter: textFilter(),
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


    const options = {
        hideSizePerPage: false,
        sizePerPageList: [{
            text: '10', value: 10
        }, {
            text: '25', value: 25
        }, {
            text: '50', value: 50
        }, {
            text: 'All', value: sarTableData.length
        }],
        showTotal: true,
        totalSize: sarTableData.length,
    };


  function searchFormatter(column, colIndex, { sortElement, filterElement }) {
    if (hideHourglass) {
        return (
            <>
                <div >

                    {column.text}&nbsp;<Image src="/sort-alpha-down.svg"  alt='down arrow' style={{ cursor: 'pointer' }} />


                    <div style={{ float: 'right', display: 'inline-block', cursor: 'pointer' }}>
                        <Image
                            src="/search.svg" height="16px" width="16px"   alt='search'  onClick={handleClickHourglass} />
                    </div>
                </div>


            </>
        );
    } else {
        return (
            <>
                <div>
                    {column.text}&nbsp;<Image src="/ui-maps/sort-alpha-down.svg"   alt='search'  style={{ cursor: 'pointer' }} />
                    <div style={{ float: 'right', display: 'inline-block', cursor: 'pointer' }}>
                        <Image src="/ui-maps/search.svg" height="16px" width="16px"   alt='search' onClick={handleClickHourglass} />
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    {filterElement}
                </div>

            </>
        );
    }
  }

  const checkdata = (response) => {
    console.log('/api/getSars success...', response);
    setSarTableData(response.data.rows);
    setLoading(false);

}


  useEffect(() => {


    console.log('fetching SAR data on initial load');

    setLoading(true);

    axios.get('/api/getSars/')
        .then(response =>  checkdata(response))
        .catch(err => console.error(err));

    }, []);




  return <div style={{padding: 50}}>
        <h1 className={styles.messages}>SarTable Data</h1>
        <Button onClick={() => router.back()}>Return</Button>
        <br/>
        <br/>
        {/* {loading > 0 &&
            <div>
                <ActivityIndicator size="large"/>
            </div>
        } */}
        {loading > 0 &&
            <Spinner />
        }
        <PaginationProvider pagination={paginationFactory(options)} >
            {
                ({
                    paginationTableProps
                }) => (
                    <div>

                        <BootstrapTable bootstrap4
                            keyField="service_order_id"
                            data={sarTableData}
                            columns={columns}
                            striped
                            hover
                            noDataIndication="0 Records Found"
                            filter={filterFactory()}
                            {...paginationTableProps}
                        />


                    </div>
                )
            }
        </PaginationProvider>

    
  </div>


}

export default SarTablePage;
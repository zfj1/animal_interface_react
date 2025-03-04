import './sqltable.css';

import DataTable from 'react-data-table-component';
import {useEffect, useState, useRef} from 'react';
import { ButtonGroup, Button, Container, Spinner, Form}  from 'react-bootstrap';
import { IconContext } from 'react-icons';
import { useNavigate, useLocation } from 'react-router-dom';

const Expand = (props) => {
    console.log('expanded', props);
    const ref = useRef(null);

    useEffect(() => {
        ref.current.scrollIntoView({block:'center'});
    });
    return (
        <Container className = 'expanded' ref={ref}>
        <DataTable
        columns = {props.columns}
        data =  {props.data.expand}
        onRowClicked = {props.onSelect}
        />
        <Container className='bg-container'>
        <ButtonGroup><IconContext.Provider value={{'color':'white'}}>{props.children}</IconContext.Provider></ButtonGroup>
        </Container>
        </Container>
    );
};

export function ActionButton(props) {
    return <Button key={props.name}>{props.icon}</Button>;
}

export default function SQLTable({columnOverrides = {}, hiddenColumns = [], ...props}) {
    const navigate = useNavigate();
    const location = useLocation();

    const [data, setData] = useState([]);
    const [columns, setColumns] = useState([]);
    const [expandCols, setExpandCols] = useState([]);
    const [filters, setFilters] = useState({});
    const tableContainerRef = useRef(null);
    const filterContainerRef = useRef(null);
    
    useEffect(() => {
        fetch(props.route)
        .then(resp => resp.json())
        .then(resp => {
            // resp contains 'fields', a list of column names, and 'data', a list of rows
            const newColumns = resp.fields
            .filter(col => !hiddenColumns.includes(col.name))
            .map((col) => {
                if (col === 'expand') { // for data only visible when a row is selected
                    let keys = Object.keys(resp.data[0].expand[0]).filter(c => c !== 'extras')
                    .map((c) => ({ name: c, selector: (e) => e[c], sortable: true }));
                    setExpandCols(keys);
                    return null;
                } else {
                    return {
                        name: col,
                        selector: (e) => e[col],
                        sortable: true,
                        grow: 1,
                        right: true,
                        ...(columnOverrides[col] || {}), // overrides the above defaults with settings from the parent element
                    };
                }
            }).filter(Boolean); // removes null columns (for expand)
            setColumns(newColumns);
            setData(resp.data);
        });
    }, [props.route]);

    useEffect(() => {
        const syncScroll = () => {
            if (tableContainerRef.current && filterContainerRef.current) {
                filterContainerRef.current.scrollLeft = tableContainerRef.current.scrollLeft;
            }
        };
        if (tableContainerRef.current) {
            tableContainerRef.current.addEventListener('scroll', syncScroll);
        }
        return () => {
            if (tableContainerRef.current) {
                tableContainerRef.current.removeEventListener('scroll', syncScroll);
            }
        };
    }, []);

    //if props.preExpand !== undefined, and we've gone through all the rows and none expand, we want to pop the route
    const [pre, setPre] = useState(false);
    const [checked, setChecked] = useState(false);
    useEffect(() => {
        if ((props.preExpand !== undefined) & !pre & checked) {
            console.log(location);
            let path = (location.state === null || location.state.from === undefined) ? './' : location.state.from;
            navigate(path, {replace: true, state: {from: location.pathname, failed: true}});
        }
    },[props.preExpand, pre, checked]);
    
    const [expanded, setExpanded] = useState(undefined); //only allow 1 row to be expanded at a time

    const filteredData = data.filter(row => {
        return Object.keys(filters).every(col =>
            !filters[col] || String(row[col]).toLowerCase() === String(filters[col]).toLowerCase()
        );
        // goes through each row; checks the columns that are being filtered;
        // if there is no filter, the row is kept
        // if there is a filter, keeps the data only if it matches the filter
        // TODO: perhaps we should use string includes? rather than strictly equals
    });

    return (
        <Container style={{ overflowX: 'auto' }}>
        <div style={{ overflowX: 'auto' }} ref={filterContainerRef}>
        <div style={{ display: 'flex', minWidth: '100%' }}>
        {columns.map((col, index) => (
            <div key={index} style={{ flex: 1, minWidth: '150px', marginRight: '5px' }}>
            {col.name.toLowerCase().includes("id") ? (
                <Form.Control
                type="text"
                placeholder={`Enter ${col.name}`}
                value={filters[col.name] || ""}
                onChange={(e) => setFilters({ ...filters, [col.name]: e.target.value })}
                style={{ width: '100%', fontSize: '12px' }}
                />
            ) : (
                <Form.Select
                onChange={(e) => setFilters({ ...filters, [col.name]: e.target.value })}
                defaultValue=""
                style={{ width: '100%', fontSize: '12px' }}>
                <option value="">All {col.name}</option>
                {[...new Set(data.map(row => row[col.name]))].map((value, idx) => (
                    <option key={idx} value={value}>{value}</option>
                ))}
                </Form.Select>
            )}
            </div>
        ))}
        </div>
        </div>
        <div ref={tableContainerRef} style={{ overflowX: 'auto' }}>
        <DataTable
        columns={columns}
        fixedHeader
        fixedHeaderScrollHeight='calc(100vh - 4rem)'
        data={filteredData}
        progressPending = {data.length === 0}
        progressComponent = {
            <Container className='holder'>
            <Container className='loading'>
            <Spinner animation='border'/>
            <br/>Connecting to server...
            </Container>
            </Container>
        }
        expandableRows
        expandOnRowClicked
        expandableRowsHideExpander
        expandableRowsComponent={
            props.expandComponent === undefined
            ? ({data}) => <Expand columns={expandCols} data={data} onSelect={props.onExpandSelected}>{props.children}</Expand>
            : props.expandComponent
        }
        expandableRowExpanded = {(row) =>{
            if (expanded === undefined) {
                if (props.preExpand !== NaN && props.preExpand !== undefined) {
                    setChecked(true);
                    if (row[props.primaryKey] === props.preExpand) {
                        setPre(true);
                        setExpanded(props.preExpand);
                    }
                }
                return false;
            } else {
                if (row[props.primaryKey] === expanded) return true;
            }
        }}
        onRowExpandToggled={(expanded, row) => {
            setExpanded(row[props.primaryKey]);
        }}
        defaultSortFieldId={1}
        defaultSortAsc={true}
        />
        </div>
        </Container>
    );
}
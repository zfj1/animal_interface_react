import './sqltable.css';

import DataTable from 'react-data-table-component';
import {useEffect, useState, useRef} from 'react';
import { ButtonGroup, Button, Container, Spinner, Badge}  from 'react-bootstrap';
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
    useEffect(() => {
        fetch(props.route)
            .then(resp => resp.json())
            .then(resp => {
                setColumns(resp.fields.reduce((cols, col) => {
                    if(col==='expand') {
                        // setExpandCols(Object.keys(resp.data[0].expand[0]).map((col) => {
                        //     return {name: col, selector: (e) => e[col]};
                        // }));
                        let keys = [];
                        Object.keys(resp.data[0].expand[0]).reduce((_,col) => {
                            if (col === 'extras') {
                                return;
                            } else {
                                keys.push({name: col, selector: (e) => e[col]});
                            }
                        });
                        setExpandCols(keys);
                    } else {
                        cols.push({name: col, selector: (e)=>e[col]});
                    }
                    return cols;
                }, []));
                setData(resp.data);
            });
    }, [props.route]);

    //if props.preExpand !== undefined, and we've checked gone through all the rows and none expand, we want to pop the route
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

    const columnsFinal = columns
        .filter(col => !hiddenColumns.includes(col.name)) // Omit hidden columns
        .map((col) => ({
            ...col,
            ...(columnOverrides[col.name] || {}),
    }));

    return (
            <DataTable
                columns={columnsFinal}
                fixedHeader
                fixedHeaderScrollHeight='calc(100vh - 4rem)'
                data={data}
                
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
                    // console.log(props.preExpand);
                    if (expanded === undefined) {
                        if (props.preExpand !== NaN && props.preExpand !== undefined) {
                            setChecked(true); //TODO: this is a problem?
                            if (row[props.primaryKey] === props.preExpand) {
                                //we've validated the requested row
                                setPre(true);
                                setExpanded(props.preExpand);
                                //scroll to this component, somehow?
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

            />
    );
}
import './sqltable.css';

import DataTable from 'react-data-table-component';
import {useEffect, useState} from 'react';
import { ButtonGroup, Button, Container, Spinner}  from 'react-bootstrap';
import { IconContext } from 'react-icons';
import { useNavigate, useLocation } from 'react-router-dom';

const Expand = (props) => {
    console.log('expanded', props);
    return (
        <Container className = 'expanded'>
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

export default function SQLTable(props) {
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

    return (
            <DataTable
                columns={columns}
                data={data}
                expandableRows
                progressPending = {data.length === 0}
                progressComponent = {<Container className='loading'><Spinner animation='border'/><br/>Connecting to server...</Container>}
                expandableRowsComponent={({data}) => <Expand columns={expandCols} data={data} onSelect={props.onExpandSelected}>{props.children}</Expand>}
                expandableRowExpanded = {(row) =>{
                    if (props.preExpand !== undefined) {
                        setChecked(true); //TODO: this is a problem?
                        if (props.preExpand(row)) {
                            setPre(true);
                            return true;
                        } else {
                            return false;
                        }
                    }
                }}
            />
    );
}
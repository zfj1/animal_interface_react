import SQLTable from "./sqltable";

import { useParams } from 'react-router-dom';

export default function Animals() {
    
    const params = useParams();

    const animal_id = parseInt(params.animal_id);
    return <SQLTable
    route={`${process.env.REACT_APP_SERVER_ADDRESS}/animals`}
    preExpand={params.animal_id===undefined ? undefined : (row) => {
        return row.animal_id === animal_id;
    }}
        
    />
};
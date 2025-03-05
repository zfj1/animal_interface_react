import SQLTable, {ActionButton} from './sqltable';
import {BiMinusCircle, BiPlusCircle } from 'react-icons/bi';
import { GiExitDoor } from 'react-icons/gi';
import { useParams } from 'react-router-dom';
import { useLocation, useNavigate } from 'react-router-dom';

export default function Cages(props) {
    const params = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <SQLTable
            route={`${process.env.REACT_APP_SERVER_ADDRESS}/data/cages`}
            primaryKey = 'cage_number'
            preExpand= {params.cage_number}
            onExpandSelected={(row) => navigate(`/animals/${row.animal_id}`,{state: {from: location.pathname}})}
        >
            <ActionButton name='Add animal' action = {() => null} icon={<BiPlusCircle/>}/>
            <ActionButton name='Change room' action = {() => null} icon={<GiExitDoor/>}/>
            <ActionButton name='Remove animal' action = {() => null} icon={<BiMinusCircle/>}/>
        </SQLTable>
        );
};
//navigate(`/cages/${res.text}`, {state: {from: location.pathname}});
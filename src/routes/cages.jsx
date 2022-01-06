import SQLTable, {ActionButton} from './sqltable';
import {BiMinusCircle, BiPlusCircle } from 'react-icons/bi';
import { GiExitDoor } from 'react-icons/gi';
import { useParams } from 'react-router-dom';

export default function Cages(props) {
    const params = useParams();
    return (
        <SQLTable
            route='https://192.168.0.5:3001/cages'
            
            preExpand={params.cage_number===undefined ? undefined : (row) => row.cage_number === params.cage_number}
        // actions = {[
        //     {'name':'Add animal', 'action': ()=>null, 'icon': <GrAddCircle/>},
        //     {'name':'Remove animal', 'action': ()=>null, 'icon': <GrSubtractCircle/>},
        //     {'name':'Change room', 'action': ()=>null, 'icon': <GiExitDoor/>},
        // ]}
        // onExpand={(row) => {console.log(row);return `https://192.168.0.5:3001/cage/${row.cage_number}`;}}
        >
            <ActionButton name='Add animal' action = {() => null} icon={<BiPlusCircle/>}/>
            <ActionButton name='Change room' action = {() => null} icon={<GiExitDoor/>}/>
            <ActionButton name='Remove animal' action = {() => null} icon={<BiMinusCircle/>}/>
        </SQLTable>
        );
};
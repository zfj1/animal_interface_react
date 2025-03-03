import SQLTable from "./sqltable";
import { useParams } from 'react-router-dom';
import { Card,Image,Col,Badge,OverlayTrigger,Tooltip,ListGroup,Container,ButtonGroup,Button} from 'react-bootstrap';
import { IconContext } from 'react-icons';
import { GiCage } from 'react-icons/gi';
import { AiOutlineExperiment, AiOutlineTag} from 'react-icons/ai';
import { BsClipboardPlus , BsPerson } from 'react-icons/bs';
import { BiBone } from 'react-icons/bi';
import './breeders.css';
import './sqltable.css';
import { useEffect, useRef, useState } from "react";

export default function Breeders() {
    const params = useParams();

    const source_id = parseInt(params.source_id);
    return <SQLTable
        route={`${process.env.REACT_APP_SERVER_ADDRESS}/breeders`}
        primaryKey = 'source_id'
    >
    </SQLTable>
};
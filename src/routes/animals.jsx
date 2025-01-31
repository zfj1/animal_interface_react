import SQLTable from "./sqltable";
import { useParams } from 'react-router-dom';
import { Card,Image,Col,Badge,OverlayTrigger,Tooltip,ListGroup,Container,ButtonGroup,Button} from 'react-bootstrap';
import { IconContext } from 'react-icons';
import { GiCage } from 'react-icons/gi';
import { AiOutlineExperiment, AiOutlineTag} from 'react-icons/ai';
import { BsClipboardPlus , BsPerson } from 'react-icons/bs';
import { BiBone } from 'react-icons/bi';
import './animals.css';
import './sqltable.css';
import { useEffect, useRef, useState } from "react";

const makeFeatureRow = (item) => {
    return (

            <div key={item[0]} className='feature-wrapper'>
                <div className='feature'>{item[0]}:</div>
                <div className='feature-value'>
                    <OverlayTrigger overlay={
                        <Tooltip><img style={{minHeight:20, minWidth:20, backgroundColor:'red'}}/> Zach (09/14/21): for such and such reason</Tooltip>
                    }>
                        <Badge
                            className='feature-badge'
                            bg = {(item[1] === 'None' || item[1] === 'Unknown') ? 'secondary' : 'primary'}
                        >
                            {item[1]}
                        </Badge>             
                    </OverlayTrigger>     
                    </div>
            </div>                  
    )
};

function diff_weeks(dt2, dt1){
  // Calculate the difference in milliseconds between dt2 and dt1
  var diff =(dt2.getTime() - dt1.getTime()) / 1000;
  // Convert the difference from milliseconds to weeks by dividing it by the number of milliseconds in a week
  diff /= (60 * 60 * 24 * 7);
  // Return the absolute value of the rounded difference as the result
  return Math.abs(Math.round(diff));
};

const Animal = (props) => {
    // console.log(props.data);
    const ref = useRef(null);
    const [scrolled, setScrolled] = useState(false);
    useEffect(() => {
        if (!scrolled) { //only scroll once at the beginning... doesn't work
            console.log('scrolling into view...', scrolled, props);
            setTimeout(() => ref.current.scrollIntoView({block: 'center', behavior: 'smooth'}), 100);
            setScrolled(true);
        }
    }, []);

    const today = new Date();
    var birth_date = new Date(props.data.dob)
    let source_name = '';

    if (props.data.source_id < 90){//Vendor
        source_name = 'Vendor: ' + props.data.source_id;
    }        
    else if (props.data.source_id < 1000){
        source_name = 'Collaborator: ' + props.data.source_id;
    } //Collaborator
    else {
        source_name = 'Breeder: ' + props.data.source_id;
    } //Breeder
    

    let features1 = [['Tag','None'],['Punch','None'],['Source', source_name],['Mother',props.data.female_id],['Father',props.data.male_id]];
    let features2 = [['Age (wks)', diff_weeks(today,birth_date )],['Cage','None'],['Protocol','None'],['Project','None'],['Session','None']];

    //sort events by date (because can't in mysql with json...)
    props.data.expand.sort(event_sorter);
    let list_group = props.data.expand.map((event,i) => {
        let formal_name = undefined;
        switch (event['event_type']) {
            case 'tag':
                formal_name = 'Tagged';
                if (features1[0][1] === 'None' && features1[1][1] === 'None' && event['extras']['tag_id'] !==null) {
                    features1[0][1] = `${event['extras']['tag_id']} | ${event['extras']['tag_ear']}`;
                    features1[1][1] = event['extras']['punch'];
                }
                break;
            case 'assign_cage':
                formal_name = `Moved to cage ${event['extras']['cage_number']} (${event['extras']['room_number']})`;
                if (features2[0][1] === 'None') {
                    features2[0][1] = `${event['extras']['cage_number']} | ${event['extras']['room_number']}`;
                }
                break;
            case 'assign_protocol':
                formal_name = `Assigned to the '${event['extras']['protocol_name']}' protocol`;
                if (features2[1][1] === 'None') {
                    features2[1][1] = event['extras']['protocol_name'];
                    //TODO: abbreviate the name if it's too long?
                }
                break;
            case 'reserved_for_project':
                formal_name = `Assigned to the '${event['extras']['project_name']}' project`;
                if (features2[2][1] === 'None') {
                    features2[2][1] = event['extras']['project_name'];
                    //TODO: want to also parse breeding, set retired/behavior done/no event as 'available' ?
                }
                break;
            case 'reserved_for_session':
                formal_name = `${event['extras']['rig_name']} experiment`;
                if (features2[3][1] === 'None') {
                    features2[3][1] = `${event['date'].substring(5,10)} | ${event['extras']['rig_name']}`;
                    //TODO: if the date has already past, maybe we show it differently / not at all?
                }
                break;
            default:
                formal_name = event['event_type'];
        }
        return (
            <ListGroup.Item key={i} style={{textOverflow:'ellipsis',overflow:'hidden',whiteSpace:'nowrap','backgroundColor':'#EEEEEE',lineHeight:'100%', fontSize:'.7rem'}}>
                <img style={{minHeight:20, minWidth:20, backgroundColor:'red'}}/> {formal_name} on {event.date}
            </ListGroup.Item>
        );

    });

    return (
    
    <div className='expand-wrapper' ref={ref}>
        <Card style={{flex: 1}}>
            {/* <Card.Title>DJID {props.data.animal_id}</Card.Title> */}
            <Card.Body>
                <div className='expand-container'>
                    <Image style={{flex: '5 1 auto', minHeight:'50px', minWidth:'100px', maxHeight:'6.3rem', maxWidth:'200px',backgroundColor:'#333333',margin:'0px 4px'}}/>

                    <Col style={{flex: '1 6 15%', margin:'0px 4px'}}>
                        {features1.map(makeFeatureRow)}
                    </Col>
                    <Col style={{flex: '1 6 10rem', minWidth:'10rem', margin:'0px 4px'}}>
                        {features2.map(makeFeatureRow)}
                    </Col>
                    <Col style={{flex: '6 1 25%', minWidth: '12rem', maxHeight:'6.3rem', overflow: 'auto', margin:'0px 4px'}}>
                        <ListGroup as="ul">
                            {list_group}
                        </ListGroup>
                    </Col>
                </div>
            </Card.Body>
            <Card.Footer>
                <Container className='bg-container'>
                    <ButtonGroup><IconContext.Provider value={{'color':'white',size:30}}>
                        <Button><GiCage/></Button>
                        <Button><AiOutlineTag/></Button>
                        <Button><BsClipboardPlus/></Button>
                        <Button><BsPerson/></Button>
                        <Button><AiOutlineExperiment/></Button>
                        <Button><BiBone/></Button>
                    </IconContext.Provider></ButtonGroup>
                </Container>
            </Card.Footer>
        </Card>
    </div>
    );
}

export default function Animals() {
    const params = useParams();

    const animal_id = parseInt(params.animal_id);
    return <SQLTable
        route={`${process.env.REACT_APP_SERVER_ADDRESS}/animals`}
        primaryKey = 'animal_id'
        preExpand={animal_id}
        expandComponent = {Animal}//{({data}) => <Animal data={data}/>}
    >
    </SQLTable>
};

const event_sorter = (a,b) => {
    let year = parseInt(b['date'].substring(0,4)) - parseInt(a['date'].substring(0,4))
    if (year !== 0) {
        return year;
    }
    let month = parseInt(b['date'].substring(5,7)) - parseInt(a['date'].substring(5,7));
    if (month !== 0) {
        return month;
    }
    let date = parseInt(b['date'].substring(8,10)) - parseInt(a['date'].substring(8,10));
    if (date !== 0) {
        return date;
    }
    if (a['time'] !== null && b['time'] !== null) {
        let time = (parseInt(b['time'].substring(0,2)) - parseInt(a['time'].substring(0,2))) * 3600 +
            (parseInt(b['time'].substring(3,5)) - parseInt(a['time'].substring(3,5))) * 60 +
            (parseInt(b['time'].substring(6,8)) - parseInt(a['time'].substring(6,8)));
        if (time !== 0) {
            return time;
        }
    }
    let entry_year = parseInt(b['entry_time'].substring(0,4)) - parseInt(a['entry_time'].substring(0,4))
    if (year !== 0) {
        return entry_year;
    }
    let entry_month = parseInt(b['entry_time'].substring(5,7)) - parseInt(a['entry_time'].substring(5,7));
    if (month !== 0) {
        return entry_month;
    }
    let entry_date = parseInt(b['entry_time'].substring(8,10)) - parseInt(a['entry_time'].substring(8,10));
    if (entry_date !== 0) {
        return entry_date;
    }

    let entry_time = (parseInt(b['entry_time'].substring(11,13)) - parseInt(a['entry_time'].substring(11,13))) * 3600 +
        (parseInt(b['entry_time'].substring(14,16)) - parseInt(a['entry_time'].substring(14,16))) * 60 +
        (parseInt(b['entry_time'].substring(17,19)) - parseInt(a['entry_time'].substring(17,19)));
    
    return entry_time;
};
import { Form, InputGroup, Card, Row, Col, DropdownButton, Dropdown, Button } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import './insert.css';

function toTitleCase(snakeCase) {
    const words = snakeCase.split('_');
    const title = words.map(word => {
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    });
    return title.join(' ');
}

function toSnakeCase(titleCase) {
    const words = titleCase.split(' ');
    const snake = words.map(word => {
        return word.toLowerCase()
    });
    return snake.join('_');
}


export default function Insert() {
    // const navigate = useNavigate();
    // const location = useLocation();
    const [eventData, setEventData] = useState([]);
    const [eventType, setEventType] = useState('');

    useEffect(() => {
        fetch(`${process.env.REACT_APP_SERVER_ADDRESS}/data/events`)
            .then(resp=>resp.json())
            .then(resp => {
                console.log(resp);
                setEventData(resp.data);
                setEventType(toTitleCase(resp.data[0].event_type))
        });
    },[]);

    const [insertType, setInsertType] = useState('Animal event');

    const currFields = ((eventData.filter(event => {
        return event.event_type === toSnakeCase(eventType);
    })[0] || {}).fields || []);

    return (
            <div className='holder'>
                <Card style={{maxWidth:'25rem', left:'50%', top:'50%', transform:'translate(-50%,-50%)'}}>
                    <Card.Title>Add to database</Card.Title>
                    <Form>
                        <Form.Group as={Col}>
                            <Form.Label>What would you like to insert?</Form.Label>
                            <Form.Select onChange={(e) => setInsertType(e.target.value)} value={insertType}>
                                <option>Animal event</option>
                                <option>Animal</option>
                                <option>Genotype</option>
                                <option>Substance</option>
                                <option>Brain area</option>
                                <option>Project</option>
                                <option>Behavior experiment type</option>
                            </Form.Select>
                        </Form.Group>
                        {/* following should be conditional on animal event */}
                        <Form.Group as={Col}>
                            <Form.Label>Event type</Form.Label>
                            <Form.Select onChange={(e) => setEventType(e.target.value)} value={eventType}>
                                {eventData.map(event => {
                                    return <option key={event.event_type}>{toTitleCase(event.event_type)}</option>
                                })}
                            </Form.Select>
                        </Form.Group>
                        <Row>
                            <Form.Group as={Col}>
                                <Form.Label>Animal</Form.Label>
                                <InputGroup>
                                    <InputGroup.Text>DJID</InputGroup.Text>
                                    <Form.Control type='number' placeholder='0000' min='0'/>
                                </InputGroup>
                            </Form.Group>
                            <Form.Group as={Col}>
                                <Form.Label>User</Form.Label>
                                <InputGroup>
                                    <Form.Control type='text' value='me'/>
                                </InputGroup>
                            </Form.Group>
                        </Row>
                        <Row>
                            <Form.Group as={Col}>
                                <Form.Label>Date</Form.Label>
                                <InputGroup>
                                    {/* <Button className='input-btn' variant='outline-secondary'>today</Button> */}
                                    <DropdownButton variant='outline-secondary' title=''>
                                        <Dropdown.Item>Today</Dropdown.Item>
                                        <Dropdown.Item>Yesterday</Dropdown.Item>
                                        <Dropdown.Item>Tomorrow</Dropdown.Item>                                    
                                    </DropdownButton>
                                    <Form.Control className='input-date' type='date'/>
                                </InputGroup>
                            </Form.Group>
                            <Form.Group as={Col}>
                                <Form.Label>Time</Form.Label>
                                <InputGroup>
                                    <InputGroup.Checkbox/>
                                    <Form.Control type='time'/>
                                </InputGroup>
                                <Form.Text>(optional)</Form.Text>
                            </Form.Group>
                        </Row>
                        <Form.Group>
                            <Form.Label>Notes</Form.Label>
                            <Form.Control as="textarea" rows={5}/>
                        </Form.Group>

                        {/* event-specific entries */}
                            {currFields.filter(field => field.field !== 'event_id').map(field => {
                                let group = null;
                                if (field.type.startsWith('enum(')) {
                                    group = field.type.slice(5,-1).split(',').map(opt => {
                                        let id = toSnakeCase(eventType) + '-' + opt.slice(1,-1);
                                        return <Form.Check type='radio' id={id} key={id} name={toSnakeCase(eventType)} label={opt.slice(1,-1)}/>;
                                    });
                                } else if (field.type.includes('int unsigned')) {
                                    group = <Form.Control/>;
                                }

                                return (<Form.Group>
                                    <Form.Label key={field.field}>{toTitleCase(field.field)}</Form.Label>
                                    {group}
                                </Form.Group>
                            )})}
                    </Form>
                    <Card.Footer>
                        <Button type="submit" className="float-end">Submit</Button>
                    </Card.Footer>
                </Card>
            </div>
    );
};


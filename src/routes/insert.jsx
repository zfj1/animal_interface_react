import { Form, InputGroup, Card, Row, Col, DropdownButton, Dropdown, Button } from 'react-bootstrap';
import { useState } from 'react';
import './insert.css';

export default function Insert() {
    // const navigate = useNavigate();
    // const location = useLocation();
    const [insertType, setInsertType] = useState('Animal event');

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
                        {/* Following will need to be refactored out... just here to get the creative juices flowing */}
                        <Form.Group as={Col}>
                            <Form.Label>Event type</Form.Label>
                            <Form.Select>
                                <option>Assign cage</option>
                                <option>Tag</option>
                                <option>Genotype</option>
                                <option>Social behavior session</option>
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
                                    <DropdownButton variant='outline-secondary'>
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
                    </Form>
                    <Card.Footer>
                        <Button type="submit" className="float-end">Submit</Button>
                    </Card.Footer>
                </Card>
            </div>
    );
};


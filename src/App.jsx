import './App.css';

import {Navbar, Button, Container, Row, Col} from 'react-bootstrap';
import { MdQrCode } from 'react-icons/md';
import {GiSeatedMouse, GiCage} from 'react-icons/gi';
import {useNavigate, Link, Routes, Route} from 'react-router-dom';

import Animals from './routes/animals';
import Scanner from './routes/scanner';
import Cages from './routes/cages';


function NavButton(props) {
  return (
    <Col><Link to={props.route}><Button className='nav-button'>{props.icon}</Button></Link></Col>
  );
}

export default function App() {
  const navigate = useNavigate;  
  return (
    <div className="App">
      <Routes>
        <Route path="animals" element={<Animals/>}/>
        <Route path="scanner" element={<Scanner/>}/>
        <Route path="cages" element={<Cages/>}>
          <Route path=":cage_number" element={<Cages/>}/>  
        </Route>      
      </Routes>   
      <Navbar fixed="bottom" bg="dark">
        <Navbar.Collapse>
          <Container><Row>
            <NavButton route="/animals" icon={<GiSeatedMouse/>}/>
            <NavButton route="/scanner" icon={<MdQrCode/>}/>
            <NavButton route="/cages" icon={<GiCage/>}/>
          </Row></Container>
        </Navbar.Collapse>
      </Navbar>
    </div>
  );
}

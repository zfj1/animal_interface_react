import './App.css';

import {Navbar, Button, Container, Row, Col} from 'react-bootstrap';
import { IconContext } from 'react-icons';
import { MdQrCode } from 'react-icons/md';
import { AiOutlinePlusCircle } from 'react-icons/ai';
import {GiSeatedMouse, GiCage} from 'react-icons/gi';
import {Link, Routes, Route} from 'react-router-dom';

import Animals from './routes/animals';
import Breeders from './routes/breeders';
import Scanner from './routes/scanner';
import Cages from './routes/cages';
import Insert from './routes/insert';


function NavButton(props) {
  return (
    <Col><Link to={props.route} className='nav-link'><Button className='nav-button'>{props.icon}</Button></Link></Col>
  );
}

export default function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="animals" element={<Animals/>}>
          <Route path=":animal_id" element ={<Animals />} />
        </Route>
        <Route path="breeders" element={<Breeders/>}>
          <Route path=":breeder_id" element ={<Breeders />} />
        </Route>
        <Route path="scanner" element={<Scanner/>}/>
        <Route path="insert" element={<Insert/>}/>
        <Route path="cages" element={<Cages/>}>
          <Route path=":cage_number" element={<Cages/>}/>  
        </Route>      
      </Routes>   
      <Navbar fixed="bottom" bg="dark">
        <Navbar.Collapse>
          <Container><Row>
            <IconContext.Provider value={{size:40}}>
              <NavButton route="/animals" icon={<GiSeatedMouse/>}/>
              <NavButton route="/breeders" icon={<GiSeatedMouse/>}/>
              <NavButton route="/scanner" icon={<MdQrCode/>}/>
              <NavButton route="/insert" icon={<AiOutlinePlusCircle/>}/>
              <NavButton route="/cages" icon={<GiCage/>}/>
            </IconContext.Provider>
          </Row></Container>
        </Navbar.Collapse>
      </Navbar>
    </div>
  );
}

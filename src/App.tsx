import React from "react";
// import { BrowserRouter as Router, Route} from "react-router-dom";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Mint from './pages/Mint';
import Sorry from './pages/Sorry';


function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Mint />} />
      <Route path='/sorry' element={<Sorry />} />
    </Routes>
  </BrowserRouter>
  );
}

export default App;
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import Inventory from './Inventory'
import PlayGround from './Playground'

export default function App() {

  return (
    <Router>
      <Routes>
        <Route exact path="/"
          element={<Inventory />}
        />
        <Route path="/playground"
          element={<PlayGround />}
        />
      </Routes>
    </Router>
  );
}



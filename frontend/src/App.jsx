import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import your page components based on your file structure
import Home from './pages/Home';
import Donate from './pages/Donate';
import Request from './pages/Request';
import Dashboard from './pages/Dashboard';
import Collection from './pages/Collection';

function App() {
  return (
    <Router>
      <div className="App">
        {/* You could add a persistent Navbar here if needed */}
        <Routes>
          {/* Awareness Stage: Home Screen [cite: 66] */}
          <Route path="/" element={<Home />} />
          
          {/* Donation Stage: AI Photo Upload & Grading [cite: 66, 129] */}
          <Route path="/donate" element={<Donate />} />
          
          {/* Consideration/Matching Stage: Item Discovery [cite: 66, 67, 130] */}
          <Route path="/request" element={<Request />} />
          
          {/* Impact Stage: Visualizing CO2 and Savings [cite: 66, 131] */}
          <Route path="/dashboard" element={<Dashboard />} />
          
          {/* Collection Stage: QR Code for Private Pickup [cite: 67, 132] */}
          <Route path="/collection" element={<Collection />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
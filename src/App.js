import logo from './logo.svg';
import './App.css';

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PickTemplate from './pages/PickTemplate';
import Matching from './pages/Matching';
import Grouping from './pages/Grouping'; 
import Index from './pages/MatchingPage';

function App() {
  return (
    // <div className="App">
    //   <PickTemplate/>
    // </div>

    <Router>
    <Routes>
      <Route path="/" element={<PickTemplate />} />
      <Route path="/matching" element={<Matching />} />
      <Route path="/matching/:activityTitle" element={<Index />} />
      <Route path="/grouping" element={<Grouping />} />
    </Routes>
  </Router>
  );
}

export default App;

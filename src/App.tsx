import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'jotai';
import './App.css';
import HomePage from './components/HomePage';
import PacingTest from './components/PacingTest';
import COPTest from './components/COPTest';

function App() {
  return (
    <Provider>
      <Router>
        <div className="min-h-screen bg-black text-white">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/pacing" element={<PacingTest />} />
            <Route path="/cop" element={<COPTest />} />
          </Routes>
        </div>
      </Router>
    </Provider>
  );
}

export default App;

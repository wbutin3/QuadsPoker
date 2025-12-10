import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Learn from './pages/Learn';
import HandRanking from './pages/lessons/HandRanking';
import Betting from './pages/lessons/Betting';
import Train from './pages/Train';
import WhatsTheNuts from './pages/training/WhatsTheNuts';
import EVCalculation from './pages/training/EVCalculation';
import Solver from './pages/training/Solver';
import Play from './pages/Play';
import GameRoom from './pages/GameRoom';
import Profile from './pages/Profile';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-b from-[#0a1628] to-[#1a2942]">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/learn" element={<Learn />} />
            <Route path="/learn/hand-ranking" element={<HandRanking />} />
            <Route path="/learn/betting" element={<Betting />} />
            <Route path="/train" element={<Train />} />
            <Route path="/train/whats-the-nuts" element={<WhatsTheNuts />} />
            <Route path="/train/ev-calculation" element={<EVCalculation />} />
            <Route path="/train/solver" element={<Solver />} />
            <Route path="/play" element={<Play />} />
            <Route path="/play/game/:gameCode" element={<GameRoom />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

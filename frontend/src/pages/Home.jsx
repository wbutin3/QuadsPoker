import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col text-white">
      <div className="flex flex-col items-center px-4 pt-24 pb-16">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-black mb-6 text-[#4169e1] uppercase tracking-wider" style={{ fontFamily: "'Exo 2', 'Rajdhani', sans-serif" }}>
            Welcome to Quads Poker
          </h1>
          <p className="text-2xl text-[#4169e1] font-semibold tracking-wide" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
            Poker is for everyone
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto mb-20">
          <Link
            to="/learn"
            className="group relative bg-gradient-to-br from-[#0f1f3d] to-[#0a1628] rounded-2xl p-12 transition-all duration-300 hover:shadow-[0_0_30px_rgba(65,105,225,0.3)] hover:-translate-y-2"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#4169e1] to-transparent opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-300"></div>
            <div className="relative">
              <div className="text-6xl mb-4 text-center">📚</div>
              <h2 className="text-2xl font-bold text-[#4169e1] text-center group-hover:text-[#5a7fef] transition-colors">Learn</h2>
              <p className="text-gray-400 text-center text-sm mt-3">
                Learn the basics of the game with tutorials
              </p>
            </div>
          </Link>

          <Link
            to="/train"
            className="group relative bg-gradient-to-br from-[#0f1f3d] to-[#0a1628] rounded-2xl p-12 transition-all duration-300 hover:shadow-[0_0_30px_rgba(65,105,225,0.3)] hover:-translate-y-2"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#4169e1] to-transparent opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-300"></div>
            <div className="relative">
              <div className="text-6xl mb-4 text-center">🏋️</div>
              <h2 className="text-2xl font-bold text-[#4169e1] text-center group-hover:text-[#5a7fef] transition-colors">Train</h2>
              <p className="text-gray-400 text-center text-sm mt-3">
                Train with interactive exercises and solvers
              </p>
            </div>
          </Link>

          <Link
            to="/play"
            className="group relative bg-gradient-to-br from-[#0f1f3d] to-[#0a1628] rounded-2xl p-12 transition-all duration-300 hover:shadow-[0_0_30px_rgba(65,105,225,0.3)] hover:-translate-y-2"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#4169e1] to-transparent opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-300"></div>
            <div className="relative">
              <div className="text-6xl mb-4 text-center">🃏</div>
              <h2 className="text-2xl font-bold text-[#4169e1] text-center group-hover:text-[#5a7fef] transition-colors">Play</h2>
              <p className="text-gray-400 text-center text-sm mt-3">
                Play with friends or join a group!
              </p>
            </div>
          </Link>
        </div>
      </div>

      {!user && (
        <div className="text-center bg-[#0a1628] border-t-2 border-[#4169e1] border-opacity-30 py-12 px-4">
          <h3 className="text-3xl font-bold mb-6 text-[#4169e1]">Ready to get started?</h3>
          <div className="space-x-4">
            <Link
              to="/register"
              className="inline-block bg-[#4169e1] hover:bg-[#5a7fef] px-8 py-4 rounded-lg font-semibold transition text-white text-lg"
            >
              Create Account
            </Link>
            <Link
              to="/login"
              className="inline-block bg-[#1a2942] hover:bg-[#2a3952] px-8 py-4 rounded-lg font-semibold transition text-[#4169e1] text-lg"
            >
              Sign In
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;

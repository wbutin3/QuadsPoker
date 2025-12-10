import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-[#030712] text-[#4169e1] shadow-lg border-b border-[#0a1628]">
      <div className="px-6">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-2xl font-black tracking-wider uppercase text-[#4169e1] hover:text-[#5a7fef] transition" style={{ fontFamily: "'Exo 2', 'Rajdhani', sans-serif" }}>
              Quads Poker
            </Link>
            <div className="hidden md:flex space-x-4">
              <Link
                to="/learn"
                className="text-[#4169e1] hover:bg-[#1a2942] px-3 py-2 rounded-md transition font-semibold"
              >
                Learn
              </Link>
              <Link
                to="/train"
                className="text-[#4169e1] hover:bg-[#1a2942] px-3 py-2 rounded-md transition font-semibold"
              >
                Train
              </Link>
              <Link
                to="/play"
                className="text-[#4169e1] hover:bg-[#1a2942] px-3 py-2 rounded-md transition font-semibold"
              >
                Play
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link
                  to="/profile"
                  className="text-[#4169e1] hover:bg-[#1a2942] px-3 py-2 rounded-md transition font-semibold"
                >
                  Profile
                </Link>
                <button
                  onClick={logout}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition font-semibold"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-[#4169e1] hover:bg-[#1a2942] px-3 py-2 rounded-md transition font-semibold"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-[#4169e1] hover:bg-[#5a7fef] text-white px-4 py-2 rounded-md transition font-semibold"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

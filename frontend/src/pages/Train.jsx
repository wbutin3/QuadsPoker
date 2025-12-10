import { Link } from 'react-router-dom';

const Train = () => {
  return (
    <div className="min-h-screen text-white">
      <div className="flex flex-col items-center px-4 pt-24 pb-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="text-6xl mb-4">🏋️</div>
          <h1 className="text-6xl font-black text-[#4169e1] mb-6 uppercase tracking-wider" style={{ fontFamily: "'Exo 2', 'Rajdhani', sans-serif" }}>
            Training
          </h1>
          <p className="text-2xl text-[#4169e1] font-semibold tracking-wide" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
            Choose a training exercise to improve your poker skills
          </p>
        </div>

        {/* Training Module Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-20">
          {/* What's the Nuts */}
          <Link
            to="/train/whats-the-nuts"
            className="group relative bg-gradient-to-br from-[#0f1f3d] to-[#0a1628] rounded-2xl p-10 transition-all duration-300 hover:shadow-[0_0_30px_rgba(65,105,225,0.3)] hover:-translate-y-2"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#4169e1] to-transparent opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-300"></div>
            <div className="relative">
              <div className="text-6xl mb-4 text-center">🎯</div>
              <h2 className="text-2xl font-bold text-[#4169e1] text-center group-hover:text-[#5a7fef] transition-colors">What's the Nuts?</h2>
              <p className="text-gray-400 text-center text-sm mt-3">
                Practice identifying the best possible hand given the board
              </p>
            </div>
          </Link>

          {/* EV Calculation */}
          <Link
            to="/train/ev-calculation"
            className="group relative bg-gradient-to-br from-[#0f1f3d] to-[#0a1628] rounded-2xl p-10 transition-all duration-300 hover:shadow-[0_0_30px_rgba(65,105,225,0.3)] hover:-translate-y-2"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#4169e1] to-transparent opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-300"></div>
            <div className="relative">
              <div className="text-6xl mb-4 text-center">📊</div>
              <h2 className="text-2xl font-bold text-[#4169e1] text-center group-hover:text-[#5a7fef] transition-colors">EV Calculation</h2>
              <p className="text-gray-400 text-center text-sm mt-3">
                Learn to calculate expected value and make optimal decisions
              </p>
            </div>
          </Link>

          {/* Solver */}
          <Link
            to="/train/solver"
            className="group relative bg-gradient-to-br from-[#0f1f3d] to-[#0a1628] rounded-2xl p-10 transition-all duration-300 hover:shadow-[0_0_30px_rgba(65,105,225,0.3)] hover:-translate-y-2"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#4169e1] to-transparent opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-300"></div>
            <div className="relative">
              <div className="text-6xl mb-4 text-center">🧮</div>
              <h2 className="text-2xl font-bold text-[#4169e1] text-center group-hover:text-[#5a7fef] transition-colors">Solver</h2>
              <p className="text-gray-400 text-center text-sm mt-3">
                Train with game theory optimal (GTO) strategies
              </p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Train;

import { Link } from 'react-router-dom';

const Learn = () => {
  return (
    <div className="min-h-screen text-white">
      <div className="flex flex-col items-center px-4 pt-24 pb-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="text-6xl mb-4">📚</div>
          <h1 className="text-6xl font-black text-[#4169e1] mb-6 uppercase tracking-wider" style={{ fontFamily: "'Exo 2', 'Rajdhani', sans-serif" }}>
            Learn
          </h1>
          <p className="text-2xl text-[#4169e1] font-semibold tracking-wide" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
            Master poker fundamentals with interactive lessons
          </p>
        </div>

        {/* Lesson Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-20">
          {/* Hand Rankings */}
          <Link
            to="/learn/hand-ranking"
            className="group relative bg-gradient-to-br from-[#0f1f3d] to-[#0a1628] rounded-2xl p-10 transition-all duration-300 hover:shadow-[0_0_30px_rgba(65,105,225,0.3)] hover:-translate-y-2"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#4169e1] to-transparent opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-300"></div>
            <div className="relative">
              <div className="text-6xl mb-4 text-center">🃏</div>
              <h2 className="text-2xl font-bold text-[#4169e1] text-center group-hover:text-[#5a7fef] transition-colors">Hand Rankings</h2>
              <p className="text-gray-400 text-center text-sm mt-3">
                Learn the order of poker hands from high card to royal flush
              </p>
            </div>
          </Link>

        

          {/* Betting */}
          <Link
            to="/learn/betting"
            className="group relative bg-gradient-to-br from-[#0f1f3d] to-[#0a1628] rounded-2xl p-10 transition-all duration-300 hover:shadow-[0_0_30px_rgba(65,105,225,0.3)] hover:-translate-y-2"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#4169e1] to-transparent opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-300"></div>
            <div className="relative">
              <div className="text-6xl mb-4 text-center">💰</div>
              <h2 className="text-2xl font-bold text-[#4169e1] text-center group-hover:text-[#5a7fef] transition-colors">Betting</h2>
              <p className="text-gray-400 text-center text-sm mt-3">
                Learn table positions and when to bet, call, or fold
              </p>
            </div>
          </Link>

          {/* Position Play - Coming Soon */}
          <div className="group relative bg-gradient-to-br from-[#0f1f3d] to-[#0a1628] rounded-2xl p-10 opacity-60 cursor-not-allowed">
            <div className="relative">
              <div className="text-6xl mb-4 text-center">🎯</div>
              <h2 className="text-2xl font-bold text-[#4169e1] text-center">Position Play</h2>
              <p className="text-gray-400 text-center text-sm mt-3">
                Understanding the importance of position at the table
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Learn;

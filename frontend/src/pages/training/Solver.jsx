import { Link } from 'react-router-dom';

const Solver = () => {
  return (
    <div className="min-h-screen text-white py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <Link
            to="/train"
            className="inline-block mb-6 text-[#4169e1] hover:text-[#5a7fef] font-semibold"
          >
            ← Back to Training
          </Link>
          <div className="text-6xl mb-4">🧮</div>
          <h1 className="text-5xl font-black text-[#4169e1] mb-4 uppercase tracking-wider" style={{ fontFamily: "'Exo 2', 'Rajdhani', sans-serif" }}>
            Solver
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-12">
            Coming soon! Train with game theory optimal (GTO) strategies.
          </p>

          <div className="bg-[#0a1628] rounded-xl p-12 max-w-2xl mx-auto border-2 border-[#4169e1] border-opacity-30">
            <p className="text-gray-400 text-lg">
              This training module is under development.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Solver;

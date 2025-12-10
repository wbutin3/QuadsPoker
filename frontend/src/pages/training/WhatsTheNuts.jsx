import { useState } from 'react';
import Level1 from '../../components/training/Level1';
import Level2 from '../../components/training/Level2';
import { Link } from 'react-router-dom';

const WhatsTheNuts = () => {
  const [selectedLevel, setSelectedLevel] = useState(null);

  if (selectedLevel === 1) {
    return (
      <div className="min-h-screen text-white py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Level1 onBack={() => setSelectedLevel(null)} />
        </div>
      </div>
    );
  }

  if (selectedLevel === 2) {
    return (
      <div className="min-h-screen text-white py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Level2 onBack={() => setSelectedLevel(null)} />
        </div>
      </div>
    );
  }

  // Level Selection Screen
  return (
    <div className="min-h-screen text-white py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <Link
            to="/train"
            className="inline-block mb-6 text-[#4169e1] hover:text-[#5a7fef] font-semibold"
          >
            ← Back to Training
          </Link>
          <div className="text-6xl mb-4">🎯</div>
          <h1 className="text-5xl font-black text-[#4169e1] mb-4 uppercase tracking-wider" style={{ fontFamily: "'Exo 2', 'Rajdhani', sans-serif" }}>
            What's the Nuts?
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Practice identifying the best hand given a runout. An essential skill.
          </p>
        </div>

        {/* Level Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12">
          {/* Level 1 */}
          <button
            onClick={() => setSelectedLevel(1)}
            className="bg-[#0a1628] hover:bg-[#1a2942] rounded-xl p-8 transition transform hover:scale-105 text-left border-2 border-[#4169e1] border-opacity-30 hover:border-opacity-100"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-3xl font-bold text-[#4169e1]">Level 1</h2>
              {/*}
              <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                Beginner
              </span>
              */}
            </div>
            <h3 className="text-xl font-semibold mb-3 text-white">Find the Best Hand</h3>
            <p className="text-gray-300 mb-4">
              Choose the best hand from 4 hole card selections.
            </p>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>✓ Great for beginners learning hand strength</li>
            </ul>
          </button>

          {/* Level 2 */}
          <button
            onClick={() => setSelectedLevel(2)}
            className="bg-[#0a1628] hover:bg-[#1a2942] rounded-xl p-8 transition transform hover:scale-105 text-left border-2 border-[#4169e1] border-opacity-30 hover:border-opacity-100"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-3xl font-bold text-[#4169e1]">Level 2</h2>
              {/*<span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                Expert
              </span>
              */}
            </div>
            <h3 className="text-xl font-semibold mb-3 text-white">Find the Nuts</h3>
            <p className="text-gray-300 mb-4">
              Choose the best possible hand (the "nuts") from 4 strong hole card selections.
            </p>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>✓ Great for distinguishing between strong hands</li>
            </ul>
          </button>
        </div>

        {/* Info Section 
        <div className="bg-[#0a1628] rounded-lg p-6 max-w-3xl mx-auto border-2 border-[#4169e1] border-opacity-30">
          <h3 className="text-2xl font-semibold mb-4 text-[#4169e1] text-center">
            How It Works
          </h3>
          <div className="grid md:grid-cols-2 gap-6 text-gray-300">
            <div>
              <h4 className="font-semibold text-white mb-2">The Goal</h4>
              <p className="text-sm">
                Identify which hole cards make the absolute best hand (the "nuts")
                given the community cards on the board.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-2">Why This Matters</h4>
              <p className="text-sm">
                Knowing when you have the nuts is crucial for maximizing value and
                understanding your equity in a hand.
              </p>
            </div>
          </div>
        
        </div>
        */}
      </div>
    </div>
  );
};

export default WhatsTheNuts;

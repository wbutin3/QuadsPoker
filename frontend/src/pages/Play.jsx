import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Play = () => {
  const navigate = useNavigate();
  const [showCreateGame, setShowCreateGame] = useState(false);
  const [gameCode, setGameCode] = useState('');

  // Generate random game code
  const generateGameCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const handleCreateGame = () => {
    const code = generateGameCode();
    setGameCode(code);
    setShowCreateGame(true);
  };

  const handleStartGame = () => {
    // Navigate to game room with the game code
    navigate(`/play/game/${gameCode}`);
  };

  const copyGameLink = () => {
    const link = `${window.location.origin}/play/game/${gameCode}`;
    navigator.clipboard.writeText(link);
    alert('Game link copied to clipboard!');
  };

  return (
    <div className="min-h-screen text-white py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="text-6xl mb-4">🎮</div>
          <h1 className="text-5xl font-black text-[#4169e1] mb-4 uppercase tracking-wider" style={{ fontFamily: "'Exo 2', 'Rajdhani', sans-serif" }}>
            Play Poker
          </h1>
          <p className="text-xl text-gray-300">
            Start a game or join a group
          </p>
        </div>

        {!showCreateGame ? (
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Start Game Card */}
            <button
              onClick={handleCreateGame}
              className="group relative bg-gradient-to-br from-[#0f1f3d] to-[#0a1628] rounded-2xl p-10 transition-all duration-300 hover:shadow-[0_0_30px_rgba(65,105,225,0.3)] hover:-translate-y-2"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#4169e1] to-transparent opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-300"></div>
              <div className="relative">
                <div className="text-6xl mb-4 text-center">🃏</div>
                <h2 className="text-2xl font-bold text-[#4169e1] text-center group-hover:text-[#5a7fef] transition-colors">Start Game</h2>
                <p className="text-gray-400 text-center text-sm mt-3">
                  Create a new poker game and invite friends
                </p>
              </div>
            </button>

            {/* Join Group Card - Coming Soon */}
            <div className="group relative bg-gradient-to-br from-[#0f1f3d] to-[#0a1628] rounded-2xl p-10 opacity-60 cursor-not-allowed">
              <div className="relative">
                <div className="text-6xl mb-4 text-center">👥</div>
                <h2 className="text-2xl font-bold text-[#4169e1] text-center">Join Group</h2>
                <p className="text-gray-400 text-center text-sm mt-3">
                  Join leagues and play regularly with others
                </p>
                <p className="text-yellow-500 text-xs text-center mt-2">Coming Soon</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-gradient-to-br from-[#0f1f3d] to-[#0a1628] rounded-2xl p-8 max-w-2xl mx-auto border-2 border-[#4169e1] border-opacity-30">
            <h2 className="text-3xl font-bold text-[#4169e1] mb-6 text-center">Game Created!</h2>

            <div className="space-y-6">
              <div className="bg-gray-900 bg-opacity-50 rounded-lg p-6">
                <label className="block text-sm text-gray-400 mb-2">Game Link</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value={`${window.location.origin}/play/game/${gameCode}`}
                    className="flex-1 bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700"
                  />
                  <button
                    onClick={copyGameLink}
                    className="bg-[#4169e1] hover:bg-[#5a7fef] px-4 py-2 rounded-lg font-semibold transition"
                  >
                    Copy
                  </button>
                </div>
              </div>

              <div className="bg-gray-900 bg-opacity-50 rounded-lg p-6">
                <label className="block text-sm text-gray-400 mb-2">Game Code</label>
                <div className="bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700 text-center font-mono text-2xl font-bold">
                  {gameCode}
                </div>
                <p className="text-gray-400 text-sm mt-2 text-center">Share this link with players to join</p>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setShowCreateGame(false)}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 px-6 py-3 rounded-lg font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleStartGame}
                  className="flex-1 bg-[#4169e1] hover:bg-[#5a7fef] px-6 py-3 rounded-lg font-semibold transition"
                >
                  Enter Game →
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Play;

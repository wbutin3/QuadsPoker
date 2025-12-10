import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import { createDeck, shuffle, dealCards, burnCard } from '../utils/pokerUtils';
import { findFirstPlayerToAct, findNextOccupiedSeat, getPlayersInHand, getNextPlayerToAct, isBettingRoundComplete } from '../utils/gameFlowUtils';
import { processPlayerAction, calculateCallAmount, formatActionMessage } from '../utils/bettingUtils';

const GameRoom = () => {
  const { gameCode } = useParams();
  const navigate = useNavigate();

  // Join seat UI state
  const [username, setUsername] = useState('');
  const [chipStack, setChipStack] = useState('1000');
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [showUsernamePrompt, setShowUsernamePrompt] = useState(false);

  // Seats array - 10 seats, null = empty
  // Each seat: { username, chipCount, cards, status, isDealer, isSmallBlind, isBigBlind }
  const [seats, setSeats] = useState(Array(10).fill(null));

  // Game configuration
  const [gameConfig, setGameConfig] = useState({
    smallBlind: 5,
    bigBlind: 10
  });

  // Game phase
  const [gamePhase, setGamePhase] = useState('WAITING');
  // Values: 'WAITING' | 'PREFLOP' | 'FLOP' | 'TURN' | 'RIVER' | 'SHOWDOWN' | 'HAND_COMPLETE'

  // Deck and cards
  const [deck, setDeck] = useState([]);
  const [communityCards, setCommunityCards] = useState([]);

  // Betting state
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(null);
  const [dealerButtonPosition, setDealerButtonPosition] = useState(0);
  const [currentBet, setCurrentBet] = useState(0);
  const [playerBets, setPlayerBets] = useState({}); // {seatIndex: amount}
  const [playerActionsThisRound, setPlayerActionsThisRound] = useState({});
  const [pots, setPots] = useState([]); // [{amount, eligiblePlayers: [indices]}]

  // UI state
  const [actionMessage, setActionMessage] = useState('');
  const [showdown, setShowdown] = useState(null);
  const [showRaiseSlider, setShowRaiseSlider] = useState(false);
  const [raiseAmount, setRaiseAmount] = useState(0);

  const handleSeatClick = (seatIndex) => {
    // Only allow clicking empty seats
    if (seats[seatIndex] === null) {
      setSelectedSeat(seatIndex);
      setShowUsernamePrompt(true);
    }
  };

  const handleUsernameSubmit = (e) => {
    e.preventDefault();
    if (username.trim() && selectedSeat !== null) {
      const newSeats = [...seats];
      newSeats[selectedSeat] = {
        username: username.trim(),
        chipCount: parseInt(chipStack) || 1000,
        cards: null
      };
      setSeats(newSeats);
      setShowUsernamePrompt(false);
      setUsername('');
      setChipStack('1000');
      setSelectedSeat(null);
    }
  };

  const handleCancelUsername = () => {
    setShowUsernamePrompt(false);
    setUsername('');
    setChipStack('1000');
    setSelectedSeat(null);
  };

  // Game control handlers
  const handleStartGame = () => {
    // Validate at least 2 players seated
    const seatedPlayers = seats.filter(s => s !== null);
    if (seatedPlayers.length < 2) {
      setActionMessage('Need at least 2 players to start!');
      setTimeout(() => setActionMessage(''), 3000);
      return;
    }

    // Find first occupied seat for dealer button
    let firstOccupiedSeat = seats.findIndex(s => s !== null);
    if (firstOccupiedSeat === -1) firstOccupiedSeat = 0;

    setDealerButtonPosition(firstOccupiedSeat);
    setGamePhase('DEALING');

    // Initialize and shuffle deck
    const newDeck = shuffle(createDeck());
    setDeck(newDeck);

    // Initialize all seats with 'active' status
    const initializedSeats = seats.map(seat =>
      seat ? { ...seat, status: 'active', cards: null, isDealer: false, isSmallBlind: false, isBigBlind: false } : null
    );
    setSeats(initializedSeats);

    // Clear all game state
    setCommunityCards([]);
    setCurrentBet(0);
    setPlayerBets({});
    setPlayerActionsThisRound({});
    setPots([]);
    setActionMessage('Starting game...');

    // Start first hand
    setTimeout(() => {
      handleStartNewHand();
    }, 500);
  };

  const handleStartNewHand = () => {
    // Reset community cards and game state
    setCommunityCards([]);
    setPlayerBets({});
    setPlayerActionsThisRound({});
    setPots([]);
    setCurrentBet(0);
    setShowdown(null);

    // Shuffle deck
    const newDeck = shuffle(createDeck());

    // Find small blind and big blind positions
    const sbIndex = findNextOccupiedSeat(seats, dealerButtonPosition);
    const bbIndex = findNextOccupiedSeat(seats, sbIndex);

    // Deal 2 cards to each seated player
    let currentDeck = newDeck;
    const updatedSeats = seats.map((seat, index) => {
      if (seat && seat.status !== 'out') {
        const { cards, remainingDeck } = dealCards(currentDeck, 2);
        currentDeck = remainingDeck;
        return {
          ...seat,
          cards,
          status: 'active',
          isDealer: index === dealerButtonPosition,
          isSmallBlind: index === sbIndex,
          isBigBlind: index === bbIndex
        };
      }
      return seat;
    });

    setSeats(updatedSeats);
    setDeck(currentDeck);

    // Post blinds
    const newSeats = [...updatedSeats];
    const sbAmount = Math.min(gameConfig.smallBlind, newSeats[sbIndex].chipCount);
    const bbAmount = Math.min(gameConfig.bigBlind, newSeats[bbIndex].chipCount);

    newSeats[sbIndex] = {
      ...newSeats[sbIndex],
      chipCount: newSeats[sbIndex].chipCount - sbAmount,
      status: sbAmount === newSeats[sbIndex].chipCount + sbAmount ? 'allin' : 'active'
    };

    newSeats[bbIndex] = {
      ...newSeats[bbIndex],
      chipCount: newSeats[bbIndex].chipCount - bbAmount,
      status: bbAmount === newSeats[bbIndex].chipCount + bbAmount ? 'allin' : 'active'
    };

    setSeats(newSeats);

    // Set initial bets
    setPlayerBets({
      [sbIndex]: sbAmount,
      [bbIndex]: bbAmount
    });

    setCurrentBet(bbAmount);

    // Set phase to PREFLOP
    setGamePhase('PREFLOP');

    // Find first player to act (left of big blind)
    const firstPlayer = findFirstPlayerToAct(newSeats, dealerButtonPosition, 'PREFLOP');
    setCurrentPlayerIndex(firstPlayer);

    setActionMessage(`${newSeats[dealerButtonPosition]?.username} is the dealer. Blinds posted: $${sbAmount}/$${bbAmount}`);
    setTimeout(() => setActionMessage(''), 3000);
  };

  // Player action handlers
  const handlePlayerAction = (action, amount = null) => {
    if (currentPlayerIndex === null) return;

    const playerCurrentBet = playerBets[currentPlayerIndex] || 0;
    const playerChips = seats[currentPlayerIndex].chipCount;
    const username = seats[currentPlayerIndex].username;

    // Process the action
    const result = processPlayerAction(action, amount, playerChips, currentBet, playerCurrentBet);

    // Update seat
    const newSeats = [...seats];
    newSeats[currentPlayerIndex] = {
      ...newSeats[currentPlayerIndex],
      chipCount: newSeats[currentPlayerIndex].chipCount - result.chipChange,
      status: result.status
    };
    setSeats(newSeats);

    // Update player bets
    const newPlayerBets = {
      ...playerBets,
      [currentPlayerIndex]: result.betAmount
    };
    setPlayerBets(newPlayerBets);

    // Update current bet if this was a raise
    if (result.actualAction === 'raise' || (result.actualAction === 'allin' && result.betAmount > currentBet)) {
      setCurrentBet(result.betAmount);
    }

    // Mark player as having acted
    const newPlayerActions = {
      ...playerActionsThisRound,
      [currentPlayerIndex]: result.actualAction
    };
    setPlayerActionsThisRound(newPlayerActions);

    // Set action message
    const message = formatActionMessage(username, result.actualAction, result.betAmount, currentBet);
    setActionMessage(message);
    setTimeout(() => setActionMessage(''), 3000);

    // Check if betting round is complete
    const roundComplete = isBettingRoundComplete(newSeats, newPlayerBets, currentBet, newPlayerActions);

    if (roundComplete.complete) {
      // Betting round done - will implement phase transition in Phase 5
      setTimeout(() => {
        setActionMessage('Betting round complete!');
        setTimeout(() => setActionMessage(''), 2000);
      }, 1000);
    } else {
      // Move to next player
      const nextPlayer = getNextPlayerToAct(newSeats, currentPlayerIndex, currentBet, newPlayerBets, newPlayerActions);
      setCurrentPlayerIndex(nextPlayer);
    }
  };

  const handleFold = () => {
    handlePlayerAction('fold');
  };

  const handleCheck = () => {
    handlePlayerAction('check');
  };

  const handleCall = () => {
    handlePlayerAction('call');
  };

  // Positioning for 10 seats around a wide oval table (outside the border)
  const getSeatPosition = (index) => {
    const angleStep = 360 / 10;
    const angle = (index * angleStep - 90) * (Math.PI / 180); // Start from top

    // Wide oval dimensions - positioned outside the table
    const radiusX = 52; // Horizontal radius % (wider, outside border)
    const radiusY = 40; // Vertical radius % (shorter, outside border)

    const x = 50 + radiusX * Math.cos(angle);
    const y = 50 + radiusY * Math.sin(angle);

    return {
      left: `${x}%`,
      top: `${y}%`,
      transform: 'translate(-50%, -50%)'
    };
  };

  return (
    <div className="min-h-screen text-white py-8">
      {/* Username Prompt Modal */}
      {showUsernamePrompt && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-gradient-to-br from-[#0f1f3d] to-[#0a1628] rounded-2xl p-8 max-w-md w-full mx-4 border-2 border-[#4169e1]">
            <h2 className="text-2xl font-bold text-[#4169e1] mb-4 text-center">Join Seat {selectedSeat + 1}</h2>

            <form onSubmit={handleUsernameSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Enter Your Name</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700 focus:border-[#4169e1] focus:outline-none"
                  placeholder="Enter your name"
                  maxLength={15}
                  required
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Starting Stack</label>
                <input
                  type="number"
                  value={chipStack}
                  onChange={(e) => setChipStack(e.target.value)}
                  className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700 focus:border-[#4169e1] focus:outline-none"
                  placeholder="Enter chip amount"
                  min="100"
                  max="1000000"
                  step="100"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Choose your starting chip stack</p>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleCancelUsername}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 px-6 py-3 rounded-lg font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-[#4169e1] hover:bg-[#5a7fef] px-6 py-3 rounded-lg font-semibold transition"
                >
                  Join
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Header - Fixed to Left Side of Screen */}
      <div className="fixed top-24 left-4 z-10">
        <h1 className="text-3xl font-bold text-[#4169e1]">Game: {gameCode}</h1>
        <p className="text-gray-400 text-base mb-3">Seats Taken: {seats.filter(s => s !== null).length}/10</p>
        <button
          onClick={() => navigate('/play')}
          className="bg-gray-700 hover:bg-gray-600 px-6 py-2 rounded-lg font-semibold transition"
        >
          Leave Game
        </button>
      </div>

      {/* Game Setup Panel - Top Right (when WAITING) */}
      {gamePhase === 'WAITING' && (
        <div className="fixed top-24 right-4 z-10">
          <div className="bg-gradient-to-br from-[#0f1f3d] to-[#0a1628] rounded-2xl p-6 border-2 border-[#4169e1]">
            <h3 className="text-xl font-bold text-[#4169e1] mb-4 text-center">Game Setup</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Small Blind</label>
                <input
                  type="number"
                  value={gameConfig.smallBlind}
                  onChange={(e) => setGameConfig({...gameConfig, smallBlind: parseInt(e.target.value) || 0})}
                  className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:border-[#4169e1] focus:outline-none"
                  min="1"
                  max="1000"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Big Blind</label>
                <input
                  type="number"
                  value={gameConfig.bigBlind}
                  onChange={(e) => setGameConfig({...gameConfig, bigBlind: parseInt(e.target.value) || 0})}
                  className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:border-[#4169e1] focus:outline-none"
                  min="2"
                  max="2000"
                />
              </div>

              <button
                onClick={handleStartGame}
                disabled={seats.filter(s => s !== null).length < 2}
                className="w-full bg-[#4169e1] hover:bg-[#5a7fef] disabled:bg-gray-600 disabled:cursor-not-allowed px-6 py-3 rounded-lg font-semibold transition"
              >
                Start Game
              </button>

              <p className="text-xs text-gray-500 text-center">
                {seats.filter(s => s !== null).length < 2 ? 'Need 2+ players to start' : 'Ready to start!'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Action Message Display */}
      {actionMessage && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-20">
          <div className="bg-gray-900 bg-opacity-90 px-6 py-3 rounded-lg border-2 border-[#4169e1]">
            <p className="text-white font-semibold">{actionMessage}</p>
          </div>
        </div>
      )}

      {/* Action Buttons Panel */}
      {gamePhase !== 'WAITING' && gamePhase !== 'HAND_COMPLETE' && currentPlayerIndex !== null && seats[currentPlayerIndex] && (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-20">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 border-2 border-[#4169e1] shadow-2xl">
            <p className="text-center mb-4 text-lg font-semibold">
              Your Action: <span className="text-[#4169e1]">{seats[currentPlayerIndex].username}</span>
            </p>

            <div className="flex gap-3">
              <button
                onClick={handleFold}
                className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg font-semibold transition"
              >
                Fold
              </button>

              {(playerBets[currentPlayerIndex] || 0) >= currentBet ? (
                <button
                  onClick={handleCheck}
                  className="bg-gray-700 hover:bg-gray-600 px-6 py-3 rounded-lg font-semibold transition"
                >
                  Check
                </button>
              ) : (
                <button
                  onClick={handleCall}
                  className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg font-semibold transition"
                >
                  Call ${calculateCallAmount(currentBet, playerBets[currentPlayerIndex] || 0)}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="relative max-w-7xl mx-auto px-4">

        {/* Poker Table - Wider, bigger, and more 3D with black edge and blue highlights */}
        <div className="relative border-[22px] mx-auto mt-20"
          style={{
            width: '100%',
            paddingBottom: '60%',
            borderRadius: '50%',
            borderColor: '#000000',
            background: 'linear-gradient(to bottom, #1a4d1a, #0d3d0d, #0a2f0a)',
            boxShadow: `
              0 20px 50px rgba(0,0,0,0.8),
              0 35px 90px rgba(0,0,0,0.6),
              0 50px 120px rgba(0,0,0,0.4),
              0 65px 150px rgba(0,0,0,0.2),
              inset 0 6px 25px rgba(255,255,255,0.25),
              inset 0 -15px 40px rgba(0,0,0,0.6),
              inset 0 0 50px rgba(0,0,0,0.3),
              inset 2px 2px 8px rgba(65,105,225,0.3),
              0 0 0 2px rgba(65,105,225,0.8),
              0 0 0 4px #0a0a0a,
              0 0 0 6px rgba(65,105,225,0.5),
              0 0 0 8px #1a1a1a,
              0 0 0 10px #000000,
              0 0 0 14px #0a0a0a,
              0 0 0 18px #000000,
              0 0 0 22px #1a1a1a,
              0 0 20px 22px rgba(65,105,225,0.5),
              0 0 40px 24px rgba(65,105,225,0.3)
            `
          }}>
          {/* Table felt inner border with 3D effect */}
          <div className="absolute inset-12 border-2 border-green-600 opacity-20" style={{
            borderRadius: '50%',
            boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.3)'
          }}></div>

          {/* Inner glow for depth */}
          <div className="absolute inset-0 rounded-[50%] bg-gradient-radial from-transparent via-transparent to-black opacity-10"></div>

          {/* Community Cards (center) */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="flex gap-2">
              {/* Placeholder for community cards */}
              <div className="w-16 h-24 bg-gray-800 rounded-lg border-2 border-gray-700"></div>
              <div className="w-16 h-24 bg-gray-800 rounded-lg border-2 border-gray-700"></div>
              <div className="w-16 h-24 bg-gray-800 rounded-lg border-2 border-gray-700"></div>
              <div className="w-16 h-24 bg-gray-800 rounded-lg border-2 border-gray-700"></div>
              <div className="w-16 h-24 bg-gray-800 rounded-lg border-2 border-gray-700"></div>
            </div>
          </div>

          {/* Pot */}
          <div className="absolute top-[35%] left-1/2 transform -translate-x-1/2">
            <div className="bg-gray-900 bg-opacity-70 px-4 py-2 rounded-lg">
              <p className="text-yellow-400 font-semibold">💰 Pot: $0</p>
            </div>
          </div>

          {/* Seats */}
          {seats.map((seat, index) => {
            const position = getSeatPosition(index);

            return (
              <div
                key={index}
                className="absolute cursor-pointer"
                style={position}
                onClick={() => handleSeatClick(index)}
              >
                {seat === null ? (
                  // Empty seat - clickable transparent div
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-32 h-24 bg-gray-800 bg-opacity-20 border-2 border-dashed border-gray-500 rounded-lg flex items-center justify-center hover:bg-opacity-40 hover:border-[#4169e1] transition">
                      <p className="text-gray-400 text-sm">Seat {index + 1}</p>
                    </div>
                  </div>
                ) : (
                  // Occupied seat - show player
                  <div className="flex flex-col items-center gap-2">
                    {/* Player cards */}
                    <div className="flex gap-1">
                      {seat.cards ? (
                        <>
                          <Card card={seat.cards[0]} size="sm" />
                          <Card card={seat.cards[1]} size="sm" />
                        </>
                      ) : (
                        <>
                          <div className="w-12 h-16 bg-blue-900 rounded border-2 border-blue-700"></div>
                          <div className="w-12 h-16 bg-blue-900 rounded border-2 border-blue-700"></div>
                        </>
                      )}
                    </div>

                    {/* Player info box */}
                    <div className="bg-gray-900 bg-opacity-90 px-4 py-2 rounded-lg border-2 border-[#4169e1] min-w-[120px]">
                      <p className="text-white font-semibold text-center text-sm">{seat.username}</p>
                      <p className="text-yellow-400 text-center text-xs">${seat.chipCount}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default GameRoom;

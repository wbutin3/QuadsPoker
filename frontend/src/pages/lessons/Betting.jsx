import { useState } from 'react';
import { Link } from 'react-router-dom';
import Card from '../../components/Card';

const Betting = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [playerAction, setPlayerAction] = useState(null);
  const [potAmount, setPotAmount] = useState(3);
  const [showFlop, setShowFlop] = useState(false);
  const [secondAction, setSecondAction] = useState(null);
  const [flopBetAction, setFlopBetAction] = useState(null);
  const [flopCallAction, setFlopCallAction] = useState(null);
  const [turnCheckAction, setTurnCheckAction] = useState(null);
  const [turnAllInAction, setTurnAllInAction] = useState(null);

  // Card back component for face-down cards
  const CardBack = ({ size = 'sm' }) => {
    const sizes = {
      sm: 'w-12 h-16',
      md: 'w-16 h-24',
      lg: 'w-20 h-28'
    };

    return (
      <div className={`${sizes[size]} rounded-lg border-2 border-gray-300 shadow-md overflow-hidden`}>
        <div className="w-full h-full" style={{
          background: 'repeating-conic-gradient(#1e3a8a 0% 25%, #000000 0% 50%) 50% / 8px 8px'
        }}></div>
      </div>
    );
  };

  // Position information for 6-handed table
  const positions = [
    { name: 'UTG', fullName: 'Under The Gun', description: 'Acts first after the blinds are paid.' },
    { name: 'MP', fullName: 'Middle Position', description: 'Acts second after the blinds are paid.' },
    { name: 'CO', fullName: 'Cutoff', description: 'Acts third, one position before the Button.' },
    { name: 'BTN', fullName: 'Button (Dealer)', description: 'Acts last on all post-flop streets. The best position.' },
    { name: 'SB', fullName: 'Small Blind', description: 'Posts a forced bet of $1. Acts first after the flop.' },
    { name: 'BB', fullName: 'Big Blind', description: 'Posts a forced bet of $2. Acts second after the flop.' }
  ];

  const steps = [
    {
      title: 'Table Positions',
      description: 'In a 6-handed poker game, there are six positions at the table. Each position has strategic importance based on when you act.',
      showTable: true,
      highlightAll: true
    },
    ...positions.map((pos, idx) => ({
      title: `Position: ${pos.name}`,
      description: pos.description,
      showTable: true,
      highlightPosition: idx,
      positionName: pos.fullName
    })),
    {
      title: 'Blinds Rotate',
      description: 'After each hand, the dealer button moves one position clockwise. The Small Blind and Big Blind move with it, ensuring everyone pays the blinds equally.',
      showTable: true,
      showRotation: true
    },
    {
      title: 'Your Action: Pre-Flop',
      description: 'You are in the UTG position with K♥8♥. You have three options: RAISE (put more money in), FOLD (quit the hand), or CALL (match the current bet). Press Call for now.',
      showTable: true,
      playerPosition: 0,
      playerCards: ['Kh', '8h'],
      actionRequired: 'first',
      promptAction: 'call'
    },
    {
      title: 'Middle Position Folds',
      description: 'You called $2. Action moves to Middle Position (MP). MP decides to fold their hand.',
      showTable: true,
      playerPosition: 0,
      playerCards: ['Kh', '8h']
    },
    {
      title: 'Cutoff Folds',
      description: 'Action moves to the Cutoff (CO). CO also folds their hand.',
      showTable: true,
      playerPosition: 0,
      playerCards: ['Kh', '8h']
    },
    {
      title: 'Button Raises',
      description: 'Action moves to the Button (BTN). The Button raises to $8!',
      showTable: true,
      playerPosition: 0,
      playerCards: ['Kh', '8h']
    },
    {
      title: 'Small Blind Folds',
      description: 'The Small Blind (SB) folds to the raise.',
      showTable: true,
      playerPosition: 0,
      playerCards: ['Kh', '8h']
    },
    {
      title: 'Big Blind Folds',
      description: 'The Big Blind (BB) also folds to the raise.',
      showTable: true,
      playerPosition: 0,
      playerCards: ['Kh', '8h']
    },
    {
      title: 'Your Turn Again',
      description: 'Action is back to you. The Button raised to $8. You need to call $6 more to stay in the hand. Press Call to see the flop.',
      showTable: true,
      playerPosition: 0,
      playerCards: ['Kh', '8h'],
      actionRequired: 'second',
      promptAction: 'call',
      dealerAction: 'raise'
    },
    {
      title: 'Flop Action',
      description: 'You act first since you are to the left of the button. You have a strong flush draw with K♥8♥. You can CHECK (pass the action) or BET $10. With this strong draw, bet $10.',
      showTable: true,
      showFlop: true,
      playerPosition: 0,
      playerCards: ['Kh', '8h'],
      actionRequired: 'flopBet',
      promptAction: 'bet'
    },
    {
      title: 'Button Raises',
      description: 'The Button raises to $20! You can CALL $10 more or RAISE again. With a flush draw, call to see the turn.',
      showTable: true,
      showFlop: true,
      playerPosition: 0,
      playerCards: ['Kh', '8h'],
      actionRequired: 'flopCall',
      promptAction: 'call'
    },
    {
      title: 'The Turn',
      description: 'The turn card is revealed: 7♣. You still have your flush draw. You can CHECK or BET. Check to see what the Button does.',
      showTable: true,
      showTurn: true,
      playerPosition: 0,
      playerCards: ['Kh', '8h'],
      actionRequired: 'turnCheck',
      promptAction: 'check'
    },
    {
      title: 'Button Bets',
      description: 'The Button bets $20. You still have your flush draw. You can CALL, RAISE, or go ALL IN. Go all in to put maximum pressure!',
      showTable: true,
      showTurn: true,
      playerPosition: 0,
      playerCards: ['Kh', '8h'],
      actionRequired: 'turnAllIn',
      promptAction: 'allin'
    },
    {
      title: 'Button Calls',
      description: 'The Button calls your all-in and reveals Q♣Q♦ - a set of queens! You need a heart on the river to win.',
      showTable: true,
      showTurn: true,
      showOpponentCards: true,
      playerPosition: 0,
      playerCards: ['Kh', '8h'],
      opponentCards: ['Qc', 'Qd']
    },
    {
      title: 'The River',
      description: 'The river is A♦. You missed your flush draw. The Button wins with three queens.',
      showTable: true,
      showRiver: true,
      showOpponentCards: true,
      playerPosition: 0,
      playerCards: ['Kh', '8h'],
      opponentCards: ['Qc', 'Qd'],
      showdown: true,
      winner: 'opponent'
    }
  ];

  const currentStepData = steps[currentStep];
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;

  const nextStep = () => {
    if (!isLastStep) {
      const nextStepNum = currentStep + 1;
      setCurrentStep(nextStepNum);
      setPlayerAction(null);
      setSecondAction(null);
      setFlopBetAction(null);
      setFlopCallAction(null);
      setTurnCheckAction(null);
      setTurnAllInAction(null);

      // Update pot and showFlop based on next step
      // Step 8: First action (player calls) - pot stays at $3
      // Steps 9-10: MP and CO fold - pot is $5 (includes player's $2)
      // Step 11: BTN raises - pot becomes $13
      // Steps 12-14: SB/BB fold and second action - pot stays at $13
      // Step 15: Flop action (player bets $10) - pot becomes $29 ($19 + $10)
      // Step 16: BTN raises to $20 - pot becomes $49
      // Step 17: Turn revealed - pot stays at $49
      // Steps 18+: All in - pot becomes all chips

      if (nextStepNum >= 9 && nextStepNum <= 10) {
        setPotAmount(5); // After player calls
      } else if (nextStepNum >= 11 && nextStepNum <= 14) {
        setPotAmount(13); // After BTN raises
      } else if (nextStepNum === 15) {
        setPotAmount(29); // After player bets $10 on flop
      } else if (nextStepNum >= 16 && nextStepNum <= 17) {
        setPotAmount(49); // After BTN raises to $20
      } else if (nextStepNum >= 18) {
        setPotAmount(49); // Keep pot at $49 for all-in scenarios
      } else {
        setPotAmount(3); // Initial pot
      }

      // Show flop from step 15 onwards
      if (nextStepNum >= 15) {
        setShowFlop(true);
      } else {
        setShowFlop(false);
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      const prevStepNum = currentStep - 1;
      setCurrentStep(prevStepNum);
      setPlayerAction(null);
      setSecondAction(null);
      setFlopBetAction(null);
      setFlopCallAction(null);
      setTurnCheckAction(null);
      setTurnAllInAction(null);

      // Update pot based on the step we're moving to
      if (prevStepNum >= 9 && prevStepNum <= 10) {
        setPotAmount(5);
      } else if (prevStepNum >= 11 && prevStepNum <= 14) {
        setPotAmount(13);
      } else if (prevStepNum === 15) {
        setPotAmount(29);
      } else if (prevStepNum >= 16 && prevStepNum <= 17) {
        setPotAmount(49);
      } else if (prevStepNum >= 18) {
        setPotAmount(49);
      } else {
        setPotAmount(3);
      }

      // Show flop based on step
      if (prevStepNum >= 15) {
        setShowFlop(true);
      } else {
        setShowFlop(false);
      }
    }
  };

  const handleAction = (action) => {
    if (currentStepData.actionRequired === 'first') {
      setPlayerAction(action);
    } else if (currentStepData.actionRequired === 'second') {
      setSecondAction(action);
      if (action === 'call') {
        setPotAmount(19); // Player calls $6 more, pot becomes $19
      }
    } else if (currentStepData.actionRequired === 'flopBet') {
      setFlopBetAction(action);
      if (action === 'bet') {
        setPotAmount(29); // Player bets $10, pot becomes $29
      }
    } else if (currentStepData.actionRequired === 'flopCall') {
      setFlopCallAction(action);
      if (action === 'call') {
        setPotAmount(49); // Player calls $10 more, pot becomes $49
      }
    } else if (currentStepData.actionRequired === 'turnCheck') {
      setTurnCheckAction(action);
    } else if (currentStepData.actionRequired === 'turnAllIn') {
      setTurnAllInAction(action);
    }
  };

  // Position coordinates for 6-handed table (moved outward to make room for community cards)
  const getPositionStyle = (index) => {
    const positions = [
      { top: '50%', left: '2%', transform: 'translateY(-50%)' }, // UTG (left middle)
      { top: '3%', left: '25%' }, // MP (top left, moved out)
      { top: '3%', right: '25%' }, // CO (top right, moved out)
      { top: '50%', right: '2%', transform: 'translateY(-50%)' }, // BTN (right middle)
      { bottom: '1.5%', right: '25%' }, // SB (bottom right, moved out)
      { bottom: '1.5%', left: '25%' } // BB (bottom left, moved out)
    ];
    return positions[index];
  };

  // Get bet amount for each player - only show temporarily when bet is made
  const getPlayerBet = (index) => {
    // Initial blinds (only show at the start before any action)
    if (currentStep === 8 && playerAction === null) {
      if (index === 4) return 1; // SB posts $1
      if (index === 5) return 2; // BB posts $2
    }

    // Show player's call only on step 8 (when they call) and step 9 (immediately after)
    if (currentStep === 8 && playerAction === 'call' && index === 0) return 2; // UTG calling
    if (currentStep === 9 && index === 0) return 2; // UTG's call shown briefly

    // Show BTN's raise only on steps 11 and 12
    if (currentStep === 11 && index === 3) return 8; // BTN raising
    if (currentStep === 12 && index === 3) return 8; // BTN's raise shown briefly

    // Post-flop bets - show only on the step where they're made
    if (currentStep === 15 && flopBetAction === 'bet' && index === 0) return 10; // Player bets $10
    if (currentStep === 16 && index === 0) return 10; // Player's bet shown briefly
    if (currentStep === 16 && index === 3) return 20; // BTN raises to $20
    if (currentStep === 17 && index === 3) return 20; // BTN's raise shown briefly

    return null;
  };

  const renderTable = () => {
    return (
      <div className="relative bg-gradient-to-br from-green-800 to-green-900 rounded-[200px] p-16 border-4 border-gray-900 ring-2 ring-[#4169e1] shadow-[0_0_60px_rgba(65,105,225,0.4)] min-h-[500px]">
        {/* Position markers */}
        {positions.map((pos, idx) => {
          const isHighlighted = currentStepData.highlightAll || currentStepData.highlightPosition === idx;
          // Check if this player has folded based on current step
          const hasFolded =
            (idx === 1 && currentStep >= 9) ||  // MP folded at step 9
            (idx === 2 && currentStep >= 10) || // CO folded at step 10
            (idx === 4 && currentStep >= 12) || // SB folded at step 12
            (idx === 5 && currentStep >= 13);   // BB folded at step 13

          return (
            <div
              key={idx}
              style={getPositionStyle(idx)}
              className={`absolute transition-all duration-500 ${
                isHighlighted ? 'opacity-100' : hasFolded ? 'opacity-20' : 'opacity-40'
              }`}
            >
              <div className={`flex flex-col items-center gap-2 ${
                isHighlighted ? 'scale-110' : ''
              }`}>
                {/* Position label */}
                <div className={`px-4 py-2 rounded-lg font-bold ${
                  isHighlighted
                    ? 'bg-[#4169e1] text-white shadow-[0_0_20px_rgba(65,105,225,0.6)]'
                    : 'bg-gray-700 text-gray-300'
                }`}>
                  {pos.name}
                </div>

                {/* Player cards - show K8 at UTG, face-down for others */}
                <div className="flex gap-2 mt-2">
                  {idx === 0 ? (
                    // UTG position - show K8 cards
                    <>
                      <Card card="Kh" size="sm" />
                      <Card card="8h" size="sm" />
                    </>
                  ) : (
                    // All other positions - show face-down cards
                    <>
                      <CardBack size="sm" />
                      <CardBack size="sm" />
                    </>
                  )}
                </div>

                {/* Dealer button */}
                {idx === 3 && (
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-black font-bold text-sm">
                    D
                  </div>
                )}

                {/* Blind indicators */}
                {idx === 4 && (
                  <div className="text-white text-xs bg-gray-800 px-2 py-1 rounded">SB: $1</div>
                )}
                {idx === 5 && (
                  <div className="text-white text-xs bg-gray-800 px-2 py-1 rounded">BB: $2</div>
                )}

                {/* Player bet amount */}
                {getPlayerBet(idx) !== null && (
                  <div className="text-yellow-400 text-sm font-semibold bg-gray-800 bg-opacity-40 px-3 py-1 rounded">
                    💰 ${getPlayerBet(idx)}
                  </div>
                )}

                {/* Folded indicator */}
                {hasFolded && (
                  <div className="text-red-500 text-xs font-bold bg-gray-900 px-2 py-1 rounded">FOLDED</div>
                )}
              </div>
            </div>
          );
        })}

        {/* Community Cards - always visible */}
        <div className="absolute top-[34%] left-1/2 transform -translate-x-1/2">
          <div className="text-center">
            <div className="flex justify-center gap-3 mb-3">
              {showFlop || currentStepData.showFlop ? (
                <>
                  {/* Flop cards - 3 hearts revealed */}
                  <Card card="6h" size="md" />
                  <Card card="2h" size="md" />
                  <Card card="Qh" size="md" />
                  {/* Turn card */}
                  {currentStepData.showTurn || currentStepData.showRiver ? (
                    <Card card="7c" size="md" />
                  ) : (
                    <CardBack size="md" />
                  )}
                  {/* River card */}
                  {currentStepData.showRiver ? (
                    <Card card="Ad" size="md" />
                  ) : (
                    <CardBack size="md" />
                  )}
                </>
              ) : (
                <>
                  {/* All 5 community cards face down */}
                  <CardBack size="md" />
                  <CardBack size="md" />
                  <CardBack size="md" />
                  <CardBack size="md" />
                  <CardBack size="md" />
                </>
              )}
            </div>
            {/* Pot below community cards */}
            <div className="bg-gray-900 bg-opacity-70 px-5 py-2 rounded-lg inline-block">
              <p className="text-xl text-yellow-400">💰 Pot: ${potAmount}</p>
            </div>

            {/* Opponent cards - show when revealed */}
            {currentStepData.showOpponentCards && currentStepData.opponentCards && (
              <div className="mt-4">
                <p className="text-sm text-gray-300 mb-2">Button shows:</p>
                <div className="flex justify-center gap-2">
                  {currentStepData.opponentCards.map((card, idx) => (
                    <Card key={idx} card={card} size="sm" />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen text-white py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Link
            to="/learn"
            className="inline-block mb-6 text-[#4169e1] hover:text-[#5a7fef] font-semibold"
          >
            ← Back to Lessons
          </Link>
          <h1 className="text-5xl font-black text-[#4169e1] mb-4 uppercase tracking-wider" style={{ fontFamily: "'Exo 2', 'Rajdhani', sans-serif" }}>
            Lesson 2: Betting
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Learn how betting works and the importance of position
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            <span className="text-sm text-gray-400">Step {currentStep + 1} of {steps.length}</span>
            <span className="text-sm text-[#4169e1]">{Math.round(((currentStep + 1) / steps.length) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className="bg-[#4169e1] h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Lesson Content */}
        <div className="bg-gradient-to-br from-[#0f1f3d] to-[#0a1628] rounded-2xl p-8 mb-8 border-2 border-[#4169e1] border-opacity-30">
          <h2 className="text-3xl font-bold text-[#4169e1] mb-2">{currentStepData.title}</h2>
          {currentStepData.positionName && (
            <p className="text-sm text-yellow-400 mb-4">{currentStepData.positionName}</p>
          )}
          <p className="text-xl text-gray-300 mb-8">{currentStepData.description}</p>

          {/* Poker Table */}
          {currentStepData.showTable && renderTable()}

          {/* Action Buttons */}
          {currentStepData.actionRequired === 'first' && (
            <div className="mt-8 flex justify-center gap-4">
              <button
                onClick={() => handleAction('fold')}
                disabled={playerAction !== null}
                className={`px-8 py-4 rounded-lg font-semibold transition ${
                  playerAction === 'fold'
                    ? 'bg-red-600 text-white'
                    : playerAction
                    ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                    : 'bg-gray-700 hover:bg-red-600 text-white'
                }`}
              >
                Fold
              </button>
              <button
                onClick={() => handleAction('call')}
                disabled={playerAction !== null}
                className={`px-8 py-4 rounded-lg font-semibold transition ${
                  playerAction === 'call'
                    ? 'bg-green-600 text-white ring-4 ring-green-400'
                    : playerAction
                    ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                    : 'bg-[#4169e1] hover:bg-[#5a7fef] text-white'
                }`}
              >
                Call $2
              </button>
              <button
                onClick={() => handleAction('raise')}
                disabled={playerAction !== null}
                className={`px-8 py-4 rounded-lg font-semibold transition ${
                  playerAction === 'raise'
                    ? 'bg-yellow-600 text-white'
                    : playerAction
                    ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                    : 'bg-gray-700 hover:bg-yellow-600 text-white'
                }`}
              >
                Raise
              </button>
            </div>
          )}

          {/* Feedback for first action */}
          {playerAction && currentStepData.actionRequired === 'first' && (
            <div className={`mt-6 p-4 rounded border-l-4 ${
              playerAction === currentStepData.promptAction
                ? 'bg-green-900 bg-opacity-20 border-green-500'
                : 'bg-yellow-900 bg-opacity-20 border-yellow-500'
            }`}>
              <p className="text-lg font-semibold mb-2">
                {playerAction === currentStepData.promptAction
                  ? '✓ Good choice! Click Next to continue.'
                  : 'Not quite - try calling with this hand'}
              </p>
            </div>
          )}

          {/* Action Buttons - Second Decision */}
          {currentStepData.actionRequired === 'second' && !showFlop && (
            <div className="mt-8 flex justify-center gap-4">
              <button
                onClick={() => handleAction('fold')}
                disabled={secondAction !== null}
                className={`px-8 py-4 rounded-lg font-semibold transition ${
                  secondAction === 'fold'
                    ? 'bg-red-600 text-white ring-4 ring-red-400'
                    : secondAction
                    ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                    : 'bg-gray-700 hover:bg-red-600 text-white'
                }`}
              >
                Fold
              </button>
              <button
                onClick={() => handleAction('call')}
                disabled={secondAction !== null}
                className={`px-8 py-4 rounded-lg font-semibold transition ${
                  secondAction === 'call'
                    ? 'bg-green-600 text-white ring-4 ring-green-400'
                    : secondAction
                    ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                    : 'bg-[#4169e1] hover:bg-[#5a7fef] text-white'
                }`}
              >
                Call $6
              </button>
              <button
                onClick={() => handleAction('raise')}
                disabled={secondAction !== null}
                className={`px-8 py-4 rounded-lg font-semibold transition ${
                  secondAction === 'raise'
                    ? 'bg-yellow-600 text-white'
                    : secondAction
                    ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                    : 'bg-gray-700 hover:bg-yellow-600 text-white'
                }`}
              >
                Re-Raise
              </button>
            </div>
          )}


          {/* Flop Bet Action Buttons */}
          {currentStepData.actionRequired === 'flopBet' && (
            <div className="mt-8 flex justify-center gap-4">
              <button
                onClick={() => handleAction('check')}
                disabled={flopBetAction !== null}
                className={`px-8 py-4 rounded-lg font-semibold transition ${
                  flopBetAction === 'check'
                    ? 'bg-gray-600 text-white'
                    : flopBetAction
                    ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                    : 'bg-gray-700 hover:bg-gray-600 text-white'
                }`}
              >
                Check
              </button>
              <button
                onClick={() => handleAction('bet')}
                disabled={flopBetAction !== null}
                className={`px-8 py-4 rounded-lg font-semibold transition ${
                  flopBetAction === 'bet'
                    ? 'bg-green-600 text-white ring-4 ring-green-400'
                    : flopBetAction
                    ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                    : 'bg-[#4169e1] hover:bg-[#5a7fef] text-white'
                }`}
              >
                Bet $10
              </button>
            </div>
          )}

          {/* Flop Call Action Buttons */}
          {currentStepData.actionRequired === 'flopCall' && (
            <div className="mt-8 flex justify-center gap-4">
              <button
                onClick={() => handleAction('fold')}
                disabled={flopCallAction !== null}
                className={`px-8 py-4 rounded-lg font-semibold transition ${
                  flopCallAction === 'fold'
                    ? 'bg-red-600 text-white'
                    : flopCallAction
                    ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                    : 'bg-gray-700 hover:bg-red-600 text-white'
                }`}
              >
                Fold
              </button>
              <button
                onClick={() => handleAction('call')}
                disabled={flopCallAction !== null}
                className={`px-8 py-4 rounded-lg font-semibold transition ${
                  flopCallAction === 'call'
                    ? 'bg-green-600 text-white ring-4 ring-green-400'
                    : flopCallAction
                    ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                    : 'bg-[#4169e1] hover:bg-[#5a7fef] text-white'
                }`}
              >
                Call $10
              </button>
              <button
                onClick={() => handleAction('raise')}
                disabled={flopCallAction !== null}
                className={`px-8 py-4 rounded-lg font-semibold transition ${
                  flopCallAction === 'raise'
                    ? 'bg-yellow-600 text-white'
                    : flopCallAction
                    ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                    : 'bg-gray-700 hover:bg-yellow-600 text-white'
                }`}
              >
                Raise
              </button>
            </div>
          )}

          {/* Turn Check Action Buttons */}
          {currentStepData.actionRequired === 'turnCheck' && (
            <div className="mt-8 flex justify-center gap-4">
              <button
                onClick={() => handleAction('check')}
                disabled={turnCheckAction !== null}
                className={`px-8 py-4 rounded-lg font-semibold transition ${
                  turnCheckAction === 'check'
                    ? 'bg-green-600 text-white ring-4 ring-green-400'
                    : turnCheckAction
                    ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                    : 'bg-[#4169e1] hover:bg-[#5a7fef] text-white'
                }`}
              >
                Check
              </button>
              <button
                onClick={() => handleAction('bet')}
                disabled={turnCheckAction !== null}
                className={`px-8 py-4 rounded-lg font-semibold transition ${
                  turnCheckAction === 'bet'
                    ? 'bg-gray-600 text-white'
                    : turnCheckAction
                    ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                    : 'bg-gray-700 hover:bg-gray-600 text-white'
                }`}
              >
                Bet
              </button>
            </div>
          )}

          {/* Turn All-In Action Buttons */}
          {currentStepData.actionRequired === 'turnAllIn' && (
            <div className="mt-8 flex justify-center gap-4">
              <button
                onClick={() => handleAction('fold')}
                disabled={turnAllInAction !== null}
                className={`px-8 py-4 rounded-lg font-semibold transition ${
                  turnAllInAction === 'fold'
                    ? 'bg-red-600 text-white'
                    : turnAllInAction
                    ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                    : 'bg-gray-700 hover:bg-red-600 text-white'
                }`}
              >
                Fold
              </button>
              <button
                onClick={() => handleAction('call')}
                disabled={turnAllInAction !== null}
                className={`px-8 py-4 rounded-lg font-semibold transition ${
                  turnAllInAction === 'call'
                    ? 'bg-gray-600 text-white'
                    : turnAllInAction
                    ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                    : 'bg-gray-700 hover:bg-gray-600 text-white'
                }`}
              >
                Call $20
              </button>
              <button
                onClick={() => handleAction('raise')}
                disabled={turnAllInAction !== null}
                className={`px-8 py-4 rounded-lg font-semibold transition ${
                  turnAllInAction === 'raise'
                    ? 'bg-yellow-600 text-white'
                    : turnAllInAction
                    ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                    : 'bg-gray-700 hover:bg-yellow-600 text-white'
                }`}
              >
                Raise
              </button>
              <button
                onClick={() => handleAction('allin')}
                disabled={turnAllInAction !== null}
                className={`px-8 py-4 rounded-lg font-semibold transition ${
                  turnAllInAction === 'allin'
                    ? 'bg-red-700 text-white ring-4 ring-red-400'
                    : turnAllInAction
                    ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                    : 'bg-red-600 hover:bg-red-700 text-white'
                }`}
              >
                All In!
              </button>
            </div>
          )}

          {/* Feedback messages for actions */}
          {(flopBetAction || flopCallAction || turnCheckAction || turnAllInAction) && (
            <div className={`mt-6 p-4 rounded border-l-4 ${
              (flopBetAction === currentStepData.promptAction ||
               flopCallAction === currentStepData.promptAction ||
               turnCheckAction === currentStepData.promptAction ||
               turnAllInAction === currentStepData.promptAction)
                ? 'bg-green-900 bg-opacity-20 border-green-500'
                : 'bg-yellow-900 bg-opacity-20 border-yellow-500'
            }`}>
              <p className="text-lg font-semibold mb-2">
                {(flopBetAction === currentStepData.promptAction ||
                  flopCallAction === currentStepData.promptAction ||
                  turnCheckAction === currentStepData.promptAction ||
                  turnAllInAction === currentStepData.promptAction)
                  ? '✓ Good choice! Click Next to continue.'
                  : 'Try a different action'}
              </p>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center">
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              currentStep === 0
                ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                : 'bg-gray-700 hover:bg-gray-600 text-white'
            }`}
          >
            ← Previous
          </button>

          {isLastStep ? (
            <Link
              to="/learn"
              className="bg-[#4169e1] hover:bg-[#5a7fef] px-8 py-3 rounded-lg font-semibold transition"
            >
              Complete Lesson ✓
            </Link>
          ) : (
            <button
              onClick={nextStep}
              disabled={
                (currentStepData.actionRequired === 'first' && !playerAction) ||
                (currentStepData.actionRequired === 'second' && !secondAction) ||
                (currentStepData.actionRequired === 'flopBet' && !flopBetAction) ||
                (currentStepData.actionRequired === 'flopCall' && !flopCallAction) ||
                (currentStepData.actionRequired === 'turnCheck' && !turnCheckAction) ||
                (currentStepData.actionRequired === 'turnAllIn' && !turnAllInAction)
              }
              className={`px-6 py-3 rounded-lg font-semibold transition ${
                (currentStepData.actionRequired === 'first' && !playerAction) ||
                (currentStepData.actionRequired === 'second' && !secondAction) ||
                (currentStepData.actionRequired === 'flopBet' && !flopBetAction) ||
                (currentStepData.actionRequired === 'flopCall' && !flopCallAction) ||
                (currentStepData.actionRequired === 'turnCheck' && !turnCheckAction) ||
                (currentStepData.actionRequired === 'turnAllIn' && !turnAllInAction)
                  ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                  : 'bg-[#4169e1] hover:bg-[#5a7fef]'
              }`}
            >
              Next →
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Betting;

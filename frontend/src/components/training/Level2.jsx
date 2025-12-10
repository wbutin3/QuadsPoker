import { useState, useEffect, useRef } from 'react';
import GameBoard from './GameBoard';
import {
  generateCommunityCards,
  generateTop10HoleCards,
  findNuts,
  evaluateHand
} from '../../utils/pokerUtils';

const Level2 = ({ onBack }) => {
  const [communityCards, setCommunityCards] = useState([]);
  const [holeCardsOptions, setHoleCardsOptions] = useState([]);
  const [nutsIndex, setNutsIndex] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [loading, setLoading] = useState(false);

  // Timed round state
  const [timedMode, setTimedMode] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [roundActive, setRoundActive] = useState(false);
  const [roundResults, setRoundResults] = useState(null);
  const timerRef = useRef(null);

  const startNewQuestion = () => {
    setLoading(true);
    setTimeout(() => {
      const community = generateCommunityCards();
      const options = generateTop10HoleCards(community);
      const nuts = findNuts(options, community);

      setCommunityCards(community);
      setHoleCardsOptions(options);
      setNutsIndex(nuts);
      setSelectedIndex(null);
      setFeedback(null);
      setLoading(false);
    }, 100);
  };

  const handleSelect = (index) => {
    if (selectedIndex !== null) return;

    setSelectedIndex(index);
    const isCorrect = index === nutsIndex;

    setFeedback({
      isCorrect,
      message: isCorrect
        ? 'Excellent! You found the nuts among strong hands!'
        : 'Close! All options were strong hands. The nuts were highlighted.',
      selectedHand: evaluateHand(holeCardsOptions[index], communityCards).descr,
      nutsHand: evaluateHand(holeCardsOptions[nutsIndex], communityCards).descr
    });

    const newScore = {
      correct: score.correct + (isCorrect ? 1 : 0),
      total: score.total + 1
    };
    setScore(newScore);

    // In timed mode, auto-advance after 1.5 seconds
    if (timedMode && roundActive) {
      setTimeout(() => {
        startNewQuestion();
      }, 1500);
    }
  };

  // Start timed round
  const startTimedRound = () => {
    setTimedMode(true);
    setRoundActive(true);
    setTimeLeft(60);
    setScore({ correct: 0, total: 0 });
    setRoundResults(null);
    startNewQuestion();
  };

  // Timer effect
  useEffect(() => {
    if (roundActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setRoundActive(false);
            setRoundResults(score);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [roundActive, timeLeft]);

  // Exit timed mode
  const exitTimedMode = () => {
    setTimedMode(false);
    setRoundActive(false);
    setRoundResults(null);
    setScore({ correct: 0, total: 0 });
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    startNewQuestion();
  };

  useEffect(() => {
    startNewQuestion();
  }, []);

  if (loading && !roundActive) {
    return (
      <div className="text-center py-20">
        <div className="text-poker-blue-400 text-xl">Loading...</div>
      </div>
    );
  }

  // Show round results
  if (roundResults) {
    const percentage = roundResults.total > 0
      ? Math.round((roundResults.correct / roundResults.total) * 100)
      : 0;

    return (
      <div>
        <div className="text-center mb-8">
          <button
            onClick={onBack}
            className="mb-4 text-poker-blue-400 hover:text-poker-blue-300 flex items-center justify-center mx-auto"
          >
            ← Back to Levels
          </button>
        </div>

        <div className="max-w-2xl mx-auto bg-gray-800 rounded-xl p-8 text-center">
          <h2 className="text-4xl font-bold text-poker-blue-400 mb-4">Expert Round Complete!</h2>
          <p className="text-yellow-400 text-sm mb-6">Level 2 - Top 10 Hands Mode</p>

          <div className="grid grid-cols-3 gap-6 mb-8">
            <div className="bg-gray-700 rounded-lg p-6">
              <div className="text-4xl font-bold text-poker-blue-400">{roundResults.correct}</div>
              <div className="text-sm text-gray-400 mt-2">Correct</div>
            </div>
            <div className="bg-gray-700 rounded-lg p-6">
              <div className="text-4xl font-bold text-white">{roundResults.total}</div>
              <div className="text-sm text-gray-400 mt-2">Total</div>
            </div>
            <div className="bg-gray-700 rounded-lg p-6">
              <div className="text-4xl font-bold text-yellow-400">{percentage}%</div>
              <div className="text-sm text-gray-400 mt-2">Accuracy</div>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={startTimedRound}
              className="w-full bg-poker-blue-600 hover:bg-poker-blue-700 px-8 py-3 rounded-lg font-semibold text-lg transition"
            >
              Play Again
            </button>
            <button
              onClick={exitTimedMode}
              className="w-full bg-gray-700 hover:bg-gray-600 px-8 py-3 rounded-lg font-semibold text-lg transition"
            >
              Practice Mode
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Mode selection screen
  if (!timedMode) {
    return (
      <div>
        <div className="text-center mb-8">
          <button
            onClick={onBack}
            className="mb-4 text-poker-blue-400 hover:text-poker-blue-300 flex items-center justify-center mx-auto"
          >
            ← Back to Levels
          </button>
          <h1 className="text-4xl font-bold text-poker-blue-400 mb-2">
            Level 2: Expert Mode
          </h1>
          <p className="text-sm text-yellow-400 mb-4">
            ⚠️ All 4 options are from the TOP 10 strongest hands
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4 max-w-5xl mx-auto mb-8">
          <button
            onClick={() => setTimedMode(true)}
            className="bg-gray-800 hover:bg-gray-700 rounded-lg p-4 transition transform hover:scale-105 flex items-center gap-4 border-2 border-transparent hover:border-poker-blue-500"
          >
            <div className="text-3xl">⏱️</div>
            <div className="flex-1 text-left">
              <h2 className="text-lg font-bold text-poker-blue-400 mb-1">Timed Round</h2>
              <p className="text-sm text-gray-400">60 seconds - Top 10 hands only</p>
            </div>
          </button>

          <div className="bg-gray-800 rounded-lg p-4 flex items-center gap-4">
            <div className="text-3xl">🎯</div>
            <div className="flex-1 text-left">
              <h2 className="text-lg font-bold text-poker-blue-400 mb-1">Practice Mode</h2>
              <p className="text-sm text-gray-400">
                Score: <span className="text-poker-blue-400 font-bold">{score.correct}</span> / {score.total}
                {score.total > 0 && (
                  <span className="text-gray-400 text-xs ml-2">
                    ({Math.round((score.correct / score.total) * 100)}%)
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Game Board for Practice Mode */}
        {!loading && (
          <>
            <GameBoard
              communityCards={communityCards}
              holeCardsOptions={holeCardsOptions}
              selectedIndex={selectedIndex}
              nutsIndex={nutsIndex}
              onSelect={handleSelect}
              levelNumber={2}
            />

            {feedback && (
              <div className={`
                text-center p-6 rounded-lg mb-6
                ${feedback.isCorrect ? 'bg-poker-blue-900 border-2 border-poker-blue-500' : 'bg-red-900 border-2 border-red-500'}
              `}>
                <p className="text-2xl font-bold mb-3">{feedback.message}</p>
                <div className="text-sm space-y-1">
                  <p>
                    <span className="text-gray-300">Your selection:</span>{' '}
                    <span className="font-semibold">{feedback.selectedHand}</span>
                  </p>
                  {!feedback.isCorrect && (
                    <p>
                      <span className="text-gray-300">The nuts:</span>{' '}
                      <span className="font-semibold text-poker-blue-300">{feedback.nutsHand}</span>
                    </p>
                  )}
                </div>
              </div>
            )}

            {selectedIndex !== null && (
              <div className="text-center">
                <button
                  onClick={startNewQuestion}
                  className="bg-poker-blue-600 hover:bg-poker-blue-700 px-8 py-3 rounded-lg font-semibold text-lg transition"
                >
                  Next Question
                </button>
              </div>
            )}
          </>
        )}
      </div>
    );
  }

  // Timed mode game screen
  return (
    <div>
      <div className="text-center mb-8">
        <button
          onClick={() => {
            if (timerRef.current) clearInterval(timerRef.current);
            exitTimedMode();
          }}
          className="mb-4 text-poker-blue-400 hover:text-poker-blue-300 flex items-center justify-center mx-auto"
        >
          ← Exit Timed Round
        </button>

        <div className="flex items-center justify-center gap-8 mb-4">
          <div className="text-center">
            <div className="text-5xl font-bold text-poker-blue-400">{timeLeft}s</div>
            <div className="text-sm text-gray-400">Time Left</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white">
              {score.correct} / {score.total}
            </div>
            <div className="text-sm text-gray-400">Score</div>
          </div>
        </div>

        {!roundActive && (
          <button
            onClick={startTimedRound}
            className="bg-poker-blue-600 hover:bg-poker-blue-700 px-8 py-3 rounded-lg font-semibold text-lg transition mb-4"
          >
            Start Round
          </button>
        )}
      </div>

      {roundActive && !loading && (
        <>
          <GameBoard
            communityCards={communityCards}
            holeCardsOptions={holeCardsOptions}
            selectedIndex={selectedIndex}
            nutsIndex={nutsIndex}
            onSelect={handleSelect}
            levelNumber={2}
          />

          {feedback && (
            <div className={`
              text-center p-4 rounded-lg mb-6
              ${feedback.isCorrect ? 'bg-poker-blue-900 border-2 border-poker-blue-500' : 'bg-red-900 border-2 border-red-500'}
            `}>
              <p className="text-xl font-bold">
                {feedback.isCorrect ? '✓ Correct!' : '✗ Incorrect'}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Level2;

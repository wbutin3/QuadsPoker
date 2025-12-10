import { useState } from 'react';
import { Link } from 'react-router-dom';
import Card from '../../components/Card';

const HandRanking = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [quizRound, setQuizRound] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);

  // Steps for the lesson
  const steps = [
    {
      title: "Best 5 Cards Play",
      description: "In poker, you make the best possible 5-card hand from your 2 hole cards and the 5 community cards. Here are the different ways to make your hand:",
      examples: [
        {
          label: "All 5 Community Cards",
          holeCards: ['Kh', '2c'],
          communityCards: ['As', 'Ks', 'Qs', 'Js', 'Ts'],
          playingCards: { hole: [], community: [0, 1, 2, 3, 4] },
          explanation: "Royal Flush using all 5 community cards (your hole cards don't play)"
        },
        {
          label: "3 Community + 2 Hole Cards",
          holeCards: ['Ah', 'Ad'],
          communityCards: ['Ac', 'Kh', 'Kd', '7s', '3c'],
          playingCards: { hole: [0, 1], community: [0, 1, 2] },
          explanation: "Full House: AAA-KK using both your hole cards and 3 community cards"
        },
        {
          label: "4 Community + 1 Hole Card",
          holeCards: ['9h', '2c'],
          communityCards: ['Jc', 'Th', '8h', '7d', '3s'],
          playingCards: { hole: [0], community: [0, 1, 2, 3] },
          explanation: "Straight using J-T-9-8-7 (using one of your hole cards)"
        }
      ]
    },
    {
      title: "1. Royal Flush",
      rank: "BEST HAND!",
      description: "A-K-Q-J-T all of the same suit. The unbeatable hand!",
      holeCards: ['Ah', 'Kh'],
      communityCards: ['Qh', 'Jh', 'Th', '7c', '3d'],
      playingCards: { hole: [0, 1], community: [0, 1, 2] },
      explanation: "Royal Flush in hearts - The nuts!"
    },
    {
      title: "2. Straight Flush",
      rank: "2nd Best",
      description: "Five cards in sequential order, all the same suit.",
      holeCards: ['Th', '9h'],
      communityCards: ['Kh', 'Qh', 'Jh', '7c', '3d'],
      playingCards: { hole: [0, 1], community: [0, 1, 2] },
      explanation: "King-high Straight Flush"
    },
    {
      title: "3. Four of a Kind",
      rank: "3rd Best",
      description: "Four cards of the same rank.",
      holeCards: ['Kh', 'Kd'],
      communityCards: ['Kc', 'Ks', 'Ah', '7c', '3d'],
      playingCards: { hole: [0, 1], community: [0, 1, 2] },
      explanation: "Four Kings with Ace kicker"
    },
    {
      title: "4. Full House",
      rank: "4th Best",
      description: "Three of a kind plus a pair.",
      holeCards: ['Kh', 'Kd'],
      communityCards: ['Kc', 'Js', 'Jh', '7c', '3d'],
      playingCards: { hole: [0, 1], community: [0, 1, 2] },
      explanation: "Full House: Kings full of Jacks"
    },
    {
      title: "5. Flush",
      rank: "5th Best",
      description: "Five cards of the same suit (any order).",
      holeCards: ['Ah', 'Kh'],
      communityCards: ['Qh', 'Jh', '9h', '7c', '3d'],
      playingCards: { hole: [0, 1], community: [0, 1, 2] },
      explanation: "Ace-high Flush in hearts (A-K-Q-J-9)"
    },
    {
      title: "6. Straight",
      rank: "6th Best",
      description: "Five cards in sequential order (any suit).",
      holeCards: ['Th', '9d'],
      communityCards: ['Kc', 'Qh', 'Js', '7c', '3d'],
      playingCards: { hole: [0, 1], community: [0, 1, 2] },
      explanation: "King-high Straight (K-Q-J-T-9)"
    },
    {
      title: "7. Three of a Kind",
      rank: "7th Best",
      description: "Three cards of the same rank.",
      holeCards: ['Kh', 'Kd'],
      communityCards: ['Kc', 'Js', '9h', '7c', '3d'],
      playingCards: { hole: [0, 1], community: [0, 1, 2] },
      explanation: "Three Kings with J-9 kickers"
    },
    {
      title: "8. Two Pair",
      rank: "8th Best",
      description: "Two different pairs.",
      holeCards: ['Kh', 'Jd'],
      communityCards: ['Kc', 'Js', '9h', '7c', '3d'],
      playingCards: { hole: [0, 1], community: [0, 1, 2] },
      explanation: "Two Pair: Kings and Jacks with 9 kicker"
    },
    {
      title: "9. One Pair",
      rank: "9th Best",
      description: "Two cards of the same rank.",
      holeCards: ['Kh', 'Kd'],
      communityCards: ['Ac', 'Js', '9h', '7c', '3d'],
      playingCards: { hole: [0, 1], community: [0, 1, 2] },
      explanation: "Pair of Kings with A-J-9 kickers"
    },
    {
      title: "10. High Card",
      rank: "Lowest",
      description: "When you don't make any pair or better, your highest card plays.",
      holeCards: ['Ah', 'Kd'],
      communityCards: ['Qc', 'Js', '9h', '7c', '3d'],
      playingCards: { hole: [0, 1], community: [0, 1, 2] },
      explanation: "A-K-Q-J-9 (Ace high)"
    },
    {
      title: "Quiz Time!",
      description: "Pick which hole cards make a stronger hand",
      isQuiz: true,
      quizQuestions: [
        {
          communityCards: ['Kh', 'Qd', 'Jc', 'Ts', '3h'],
          option1: { holeCards: ['Ah', '9s'], hand: "Straight (A-K-Q-J-T)" },
          option2: { holeCards: ['Kc', 'Kd'], hand: "Three of a Kind (K-K-K)" },
          correctAnswer: 0,
          explanation: "Straight beats Three of a Kind"
        },
        {
          communityCards: ['As', 'Ah', 'Ad', '7c', '2d'],
          option1: { holeCards: ['Ac', 'Ks'], hand: "Four of a Kind (A-A-A-A)" },
          option2: { holeCards: ['7h', '7d'], hand: "Full House (7-7-7-A-A)" },
          correctAnswer: 0,
          explanation: "Four of a Kind beats Full House"
        },
        {
          communityCards: ['9h', '8h', '5h', '3h', '2c'],
          option1: { holeCards: ['Ah', '4h'], hand: "Flush (A-9-8-5-4)" },
          option2: { holeCards: ['7h', '6h'], hand: "Straight Flush (9-8-7-6-5)" },
          correctAnswer: 1,
          explanation: "Straight Flush beats Flush"
        }
      ]
    }
  ];

  const currentStepData = steps[currentStep];
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;

  const nextStep = () => {
    if (!isLastStep) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const handleQuizAnswer = (answerIndex) => {
    setSelectedAnswer(answerIndex);
    setShowResult(true);
  };

  const nextQuizRound = () => {
    if (quizRound < currentStepData.quizQuestions.length - 1) {
      setQuizRound(quizRound + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    }
  };

  const currentQuizQuestion = currentStepData.isQuiz ? currentStepData.quizQuestions[quizRound] : null;

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
            Lesson 1: Hand Rankings
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Learn how poker hands are ranked, going from strongest to weakest
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
          {currentStepData.rank && (
            <p className="text-sm text-yellow-400 mb-4">{currentStepData.rank}</p>
          )}
          <p className="text-xl text-gray-300 mb-8">{currentStepData.description}</p>

          {/* Best 5 Cards Examples (Step 0) */}
          {isFirstStep && currentStepData.examples && (
            <div className="space-y-8">
              {currentStepData.examples.map((example, idx) => (
                <div key={idx}>
                  <h3 className="text-lg font-semibold text-[#4169e1] mb-4 text-center">{example.label}</h3>

                  {/* Poker Table */}
                  <div className="bg-gradient-to-br from-green-800 to-green-900 rounded-[200px] p-12 border-4 border-gray-900 ring-2 ring-[#4169e1] shadow-[0_0_60px_rgba(65,105,225,0.4)]">
                    {/* Community Cards */}
                    <div className="text-center mb-16">
                      <p className="text-lg font-semibold mb-4 text-gray-200">Community Cards</p>
                      <div className="flex justify-center gap-3">
                        {example.communityCards.map((card, i) => (
                          <div
                            key={i}
                            className={`transition-all duration-500 ${example.playingCards.community.includes(i) ? '-translate-y-4 shadow-[0_0_30px_rgba(65,105,225,0.8)]' : 'opacity-50'}`}
                          >
                            <Card card={card} size="lg" />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Hole Cards */}
                    <div className="text-center">
                      <p className="text-lg font-semibold mb-4 text-gray-200">Your Hole Cards</p>
                      <div className="flex justify-center gap-3">
                        {example.holeCards.map((card, i) => (
                          <div
                            key={i}
                            className={`transition-all duration-500 ${example.playingCards.hole.includes(i) ? '-translate-y-4 shadow-[0_0_30px_rgba(65,105,225,0.8)]' : 'opacity-50'}`}
                          >
                            <Card card={card} size="lg" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 bg-[#4169e1] bg-opacity-10 border-l-4 border-[#4169e1] p-4 rounded">
                    <p className="text-lg text-white font-semibold">{example.explanation}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Hand Ranking Examples (Steps 1-10) */}
          {!isFirstStep && !currentStepData.isQuiz && (
            <div>
              {/* Poker Table */}
              <div className="bg-gradient-to-br from-green-800 to-green-900 rounded-[200px] p-12 border-4 border-gray-900 ring-2 ring-[#4169e1] shadow-[0_0_60px_rgba(65,105,225,0.4)]">
                {/* Community Cards */}
                <div className="text-center mb-16">
                  <p className="text-lg font-semibold mb-4 text-gray-200">Community Cards</p>
                  <div className="flex justify-center gap-3">
                    {currentStepData.communityCards.map((card, i) => (
                      <div
                        key={i}
                        className={`transition-all duration-500 ${currentStepData.playingCards.community.includes(i) ? '-translate-y-4 shadow-[0_0_30px_rgba(65,105,225,0.8)]' : 'opacity-50'}`}
                      >
                        <Card card={card} size="lg" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Hole Cards */}
                <div className="text-center">
                  <p className="text-lg font-semibold mb-4 text-gray-200">Your Hole Cards</p>
                  <div className="flex justify-center gap-3">
                    {currentStepData.holeCards.map((card, i) => (
                      <div
                        key={i}
                        className={`transition-all duration-500 ${currentStepData.playingCards.hole.includes(i) ? '-translate-y-4 shadow-[0_0_30px_rgba(65,105,225,0.8)]' : 'opacity-50'}`}
                      >
                        <Card card={card} size="lg" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 bg-[#4169e1] bg-opacity-10 border-l-4 border-[#4169e1] p-4 rounded">
                <p className="text-lg text-white font-semibold">{currentStepData.explanation}</p>
              </div>
            </div>
          )}

          {/* Quiz */}
          {currentStepData.isQuiz && currentQuizQuestion && (
            <div>
              <p className="text-center text-lg text-gray-300 mb-6">Round {quizRound + 1} of {currentStepData.quizQuestions.length}</p>

              {/* Community Cards */}
              <div className="bg-gradient-to-br from-green-800 to-green-900 rounded-[200px] p-12 mb-8 border-4 border-gray-900 ring-2 ring-[#4169e1] shadow-[0_0_60px_rgba(65,105,225,0.4)]">
                <div className="text-center">
                  <p className="text-lg font-semibold mb-4 text-gray-200">Community Cards</p>
                  <div className="flex justify-center gap-3">
                    {currentQuizQuestion.communityCards.map((card, i) => (
                      <div key={i}>
                        <Card card={card} size="lg" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Quiz Options */}
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                {/* Option 1 */}
                <button
                  onClick={() => handleQuizAnswer(0)}
                  disabled={showResult}
                  className={`p-6 rounded-xl border-2 transition-all ${
                    showResult
                      ? selectedAnswer === 0
                        ? currentQuizQuestion.correctAnswer === 0
                          ? 'border-green-500 bg-green-900 bg-opacity-30'
                          : 'border-red-500 bg-red-900 bg-opacity-30'
                        : currentQuizQuestion.correctAnswer === 0
                        ? 'border-green-500 bg-green-900 bg-opacity-30'
                        : 'border-gray-600 opacity-50'
                      : 'border-[#4169e1] hover:border-[#5a7fef] hover:bg-[#4169e1] hover:bg-opacity-10 cursor-pointer'
                  }`}
                >
                  <div className="flex justify-center gap-3 mb-3">
                    {currentQuizQuestion.option1.holeCards.map((card, i) => (
                      <Card key={i} card={card} size="md" />
                    ))}
                  </div>
                  <p className="text-gray-300 text-sm">{currentQuizQuestion.option1.hand}</p>
                </button>

                {/* Option 2 */}
                <button
                  onClick={() => handleQuizAnswer(1)}
                  disabled={showResult}
                  className={`p-6 rounded-xl border-2 transition-all ${
                    showResult
                      ? selectedAnswer === 1
                        ? currentQuizQuestion.correctAnswer === 1
                          ? 'border-green-500 bg-green-900 bg-opacity-30'
                          : 'border-red-500 bg-red-900 bg-opacity-30'
                        : currentQuizQuestion.correctAnswer === 1
                        ? 'border-green-500 bg-green-900 bg-opacity-30'
                        : 'border-gray-600 opacity-50'
                      : 'border-[#4169e1] hover:border-[#5a7fef] hover:bg-[#4169e1] hover:bg-opacity-10 cursor-pointer'
                  }`}
                >
                  <div className="flex justify-center gap-3 mb-3">
                    {currentQuizQuestion.option2.holeCards.map((card, i) => (
                      <Card key={i} card={card} size="md" />
                    ))}
                  </div>
                  <p className="text-gray-300 text-sm">{currentQuizQuestion.option2.hand}</p>
                </button>
              </div>

              {/* Result Feedback */}
              {showResult && (
                <div className={`p-4 rounded border-l-4 mb-6 ${
                  selectedAnswer === currentQuizQuestion.correctAnswer
                    ? 'bg-green-900 bg-opacity-20 border-green-500'
                    : 'bg-red-900 bg-opacity-20 border-red-500'
                }`}>
                  <p className="text-lg font-semibold mb-2">
                    {selectedAnswer === currentQuizQuestion.correctAnswer ? '✓ Correct!' : '✗ Incorrect'}
                  </p>
                  <p className="text-gray-300">{currentQuizQuestion.explanation}</p>
                </div>
              )}

              {/* Next Round Button */}
              {showResult && quizRound < currentStepData.quizQuestions.length - 1 && (
                <div className="text-center">
                  <button
                    onClick={nextQuizRound}
                    className="bg-[#4169e1] hover:bg-[#5a7fef] px-6 py-3 rounded-lg font-semibold transition"
                  >
                    Next Round →
                  </button>
                </div>
              )}
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

          {isLastStep && showResult && quizRound === currentStepData.quizQuestions.length - 1 ? (
            <Link
              to="/learn"
              className="bg-[#4169e1] hover:bg-[#5a7fef] px-8 py-3 rounded-lg font-semibold transition"
            >
              Complete Lesson ✓
            </Link>
          ) : (
            <button
              onClick={nextStep}
              disabled={isLastStep}
              className={`px-6 py-3 rounded-lg font-semibold transition ${
                isLastStep
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

export default HandRanking;

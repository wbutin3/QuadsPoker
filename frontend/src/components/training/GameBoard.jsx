import Card from '../Card';

const GameBoard = ({
  communityCards,
  holeCardsOptions,
  selectedIndex,
  nutsIndex,
  onSelect,
  levelNumber
}) => {
  return (
    <div className="relative bg-gradient-to-br from-green-800 to-green-900 rounded-[300px] p-16 mb-8 border-4 border-gray-900 ring-2 ring-poker-blue-400 shadow-[0_0_60px_rgba(59,130,246,0.4)] max-w-[90rem] mx-auto">
      {/* Community Cards */}
      <div className="text-center mb-16">
        <div className="flex justify-center gap-4">
          {communityCards.map((card, index) => (
            <Card key={index} card={card} size="lg" />
          ))}
        </div>
      </div>

      {/* Hole Cards Options */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {holeCardsOptions.map((holeCards, index) => {
          const isNuts = selectedIndex !== null && index === nutsIndex;
          const isWrong = selectedIndex === index && index !== nutsIndex;

          return (
            <button
              key={index}
              onClick={() => onSelect(index)}
              disabled={selectedIndex !== null}
              className={`
                relative p-6 rounded-xl transition-all transform hover:scale-105
                ${selectedIndex === null ? 'cursor-pointer' : 'cursor-default'}
                ${isNuts ? 'bg-green-600 ring-4 ring-poker-blue-400' : ''}
                ${isWrong ? 'bg-red-900 ring-4 ring-red-500' : ''}
              `}
            >
              <div className="flex justify-center gap-3 mb-3">
                {holeCards.map((card, cardIndex) => (
                  <Card key={cardIndex} card={card} size="lg" />
                ))}
              </div>
              <div className="text-center text-sm font-semibold">
                {isNuts && selectedIndex !== null && (
                  <span className="text-poker-blue-300">✓ The Nuts</span>
                )}
                {isWrong && (
                  <span className="text-red-300">✗ Not the Nuts</span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default GameBoard;

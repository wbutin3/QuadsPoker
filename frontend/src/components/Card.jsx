import { cardToDisplay } from '../utils/pokerUtils';

const Card = ({ card, size = 'md' }) => {
  const { rank, suit } = cardToDisplay(card);

  const sizeClasses = {
    sm: {
      container: 'w-16 h-24',
      cornerRank: 'text-xl',
      cornerSuit: 'text-base',
      centerSuit: 'text-4xl',
      padding: 'p-1.5'
    },
    md: {
      container: 'w-20 h-32',
      cornerRank: 'text-2xl',
      cornerSuit: 'text-lg',
      centerSuit: 'text-5xl',
      padding: 'p-2'
    },
    lg: {
      container: 'w-24 h-36',
      cornerRank: 'text-3xl',
      cornerSuit: 'text-xl',
      centerSuit: 'text-6xl',
      padding: 'p-2.5'
    }
  };

  // 4-color deck: hearts=red, diamonds=blue, clubs=green, spades=black
  const colorMap = {
    '♥': 'text-red-500',
    '♦': 'text-blue-500',
    '♣': 'text-green-500',
    '♠': 'text-gray-900'
  };

  const sizes = sizeClasses[size];
  const color = colorMap[suit] || 'text-gray-900';

  return (
    <div
      className={`${sizes.container} ${sizes.padding} bg-[#f5f5f0] rounded-xl border border-gray-300 shadow-md relative flex items-center justify-center`}
    >
      {/* Top-left corner: Rank only */}
      <div className={`absolute top-1 left-1.5 ${sizes.cornerRank} ${color} font-bold leading-none`} style={{ fontFamily: "Georgia, serif" }}>
        {rank}
      </div>

      {/* Center: Large suit symbol */}
      <div className={`${sizes.centerSuit} ${color}`}>
        {suit}
      </div>

      {/* Bottom-right corner: Rank only (rotated 180°) */}
      <div className={`absolute bottom-1 right-1.5 ${sizes.cornerRank} ${color} font-bold leading-none rotate-180`} style={{ fontFamily: "Georgia, serif" }}>
        {rank}
      </div>
    </div>
  );
};

export default Card;

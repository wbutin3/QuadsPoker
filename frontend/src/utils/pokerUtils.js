import { Hand } from 'pokersolver';

// Card ranks and suits
const RANKS = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'];
const SUITS = ['h', 'd', 'c', 's']; // hearts, diamonds, clubs, spades

// Create a full deck
export const createDeck = () => {
  const deck = [];
  for (const suit of SUITS) {
    for (const rank of RANKS) {
      deck.push(`${rank}${suit}`);
    }
  }
  return deck;
};

// Shuffle array
export const shuffle = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Generate random community cards
export const generateCommunityCards = () => {
  const deck = shuffle(createDeck());
  return deck.slice(0, 5);
};

// Generate hole cards options (4 different pairs)
export const generateHoleCardsOptions = (communityCards) => {
  const deck = shuffle(createDeck().filter(card => !communityCards.includes(card)));
  const options = [];

  for (let i = 0; i < 4; i++) {
    options.push([deck[i * 2], deck[i * 2 + 1]]);
  }

  return options;
};

// Evaluate hand strength using pokersolver
export const evaluateHand = (holeCards, communityCards) => {
  const allCards = [...holeCards, ...communityCards];
  return Hand.solve(allCards);
};

// Find the nuts (best possible hand)
export const findNuts = (holeCardsOptions, communityCards) => {
  let bestHandIndex = 0;
  let bestHand = evaluateHand(holeCardsOptions[0], communityCards);

  for (let i = 1; i < holeCardsOptions.length; i++) {
    const currentHand = evaluateHand(holeCardsOptions[i], communityCards);
    const winner = Hand.winners([bestHand, currentHand]);

    if (winner[0] === currentHand) {
      bestHand = currentHand;
      bestHandIndex = i;
    }
  }

  return bestHandIndex;
};

// Generate all possible 2-card combinations from remaining deck
const getAllPossibleHoleCards = (communityCards) => {
  const availableCards = createDeck().filter(card => !communityCards.includes(card));
  const combinations = [];

  for (let i = 0; i < availableCards.length; i++) {
    for (let j = i + 1; j < availableCards.length; j++) {
      combinations.push([availableCards[i], availableCards[j]]);
    }
  }

  return combinations;
};

// Evaluate all possible hole cards and return sorted by strength
export const evaluateAllHands = (communityCards) => {
  const allCombinations = getAllPossibleHoleCards(communityCards);

  const evaluatedHands = allCombinations.map(holeCards => ({
    holeCards,
    hand: evaluateHand(holeCards, communityCards),
    rank: evaluateHand(holeCards, communityCards).rank
  }));

  // Sort by hand strength (lower rank number = stronger hand)
  evaluatedHands.sort((a, b) => {
    const winner = Hand.winners([a.hand, b.hand]);
    if (winner[0] === a.hand && winner.length === 1) return -1;
    if (winner[0] === b.hand && winner.length === 1) return 1;
    return 0;
  });

  return evaluatedHands;
};

// Generate hole cards from top 10 hands (Level 2 - harder)
export const generateTop10HoleCards = (communityCards) => {
  const allHands = evaluateAllHands(communityCards);

  // Group hands by their description (e.g., "Straight, Seven to Jack")
  // Only keep one representative of each unique hand value
  const uniqueHands = [];
  const seenDescriptions = new Set();

  for (const handObj of allHands) {
    const desc = handObj.hand.descr;
    if (!seenDescriptions.has(desc)) {
      seenDescriptions.add(desc);
      uniqueHands.push(handObj);
    }
  }

  // Take top 10 unique hand values
  const top10Unique = uniqueHands.slice(0, 10);

  // If we have less than 4 unique hand values, take all we have
  const numToSample = Math.min(4, top10Unique.length);

  // Randomly sample 4 (or fewer) from the top 10 unique hands
  const shuffled = shuffle(top10Unique);
  return shuffled.slice(0, numToSample).map(h => h.holeCards);
};

// Convert card code to display format
export const cardToDisplay = (card) => {
  const rankMap = {
    'T': '10',
    'J': 'J',
    'Q': 'Q',
    'K': 'K',
    'A': 'A'
  };

  const suitMap = {
    'h': '♥',
    'd': '♦',
    'c': '♣',
    's': '♠'
  };

  const rank = card[0];
  const suit = card[1];

  return {
    rank: rankMap[rank] || rank,
    suit: suitMap[suit],
    suitColor: (suit === 'h' || suit === 'd') ? 'red' : 'black'
  };
};

// Deal cards from deck
// Returns {cards: [...], remainingDeck: [...]}
export const dealCards = (deck, numCards) => {
  const cards = deck.slice(0, numCards);
  const remainingDeck = deck.slice(numCards);
  return { cards, remainingDeck };
};

// Burn a card from the deck (remove top card)
// Returns the remaining deck
export const burnCard = (deck) => {
  return deck.slice(1);
};

// Game flow and player navigation utilities for poker game

/**
 * Get array of seat indices for players still in the hand (not folded or out)
 */
export const getActivePlayers = (seats) => {
  return seats
    .map((seat, index) => (seat && seat.status !== 'folded' && seat.status !== 'out' ? index : null))
    .filter(index => index !== null);
};

/**
 * Get array of seat indices for players who are in the hand (including all-in)
 */
export const getPlayersInHand = (seats) => {
  return seats
    .map((seat, index) => (seat && seat.status !== 'folded' && seat.status !== 'out' ? index : null))
    .filter(index => index !== null);
};

/**
 * Find the next player who needs to act
 * Returns null if betting round is complete
 */
export const getNextPlayerToAct = (seats, currentPlayerIndex, currentBet, playerBets, playerActionsThisRound) => {
  if (currentPlayerIndex === null) return null;

  let nextIndex = (currentPlayerIndex + 1) % seats.length;
  let iterations = 0;

  while (iterations < seats.length) {
    const seat = seats[nextIndex];

    // Skip empty seats and players who can't act
    if (seat !== null &&
        seat.status !== 'folded' &&
        seat.status !== 'allin' &&
        seat.status !== 'out') {

      const playerCurrentBet = playerBets[nextIndex] || 0;
      const hasActedThisRound = playerActionsThisRound[nextIndex];

      // Player needs to act if:
      // 1. They have a bet to match (their bet is less than current bet)
      // 2. OR they haven't acted this round yet
      const hasBetToMatch = playerCurrentBet < currentBet;
      const needsToAct = hasBetToMatch || !hasActedThisRound;

      if (needsToAct) {
        return nextIndex;
      }
    }

    nextIndex = (nextIndex + 1) % seats.length;
    iterations++;
  }

  return null; // Betting round complete
};

/**
 * Check if the current betting round is complete
 * Returns {complete: boolean, reason: string}
 */
export const isBettingRoundComplete = (seats, playerBets, currentBet, playerActionsThisRound) => {
  const playersInHand = getPlayersInHand(seats);

  // Only one player left (all others folded)
  if (playersInHand.length === 1) {
    return { complete: true, reason: 'allFolded' };
  }

  // Check if all active (non-allin) players have acted and matched the current bet
  const activePlayers = playersInHand.filter(index => seats[index].status !== 'allin');

  // If all active players are all-in or folded, round is complete
  if (activePlayers.length === 0) {
    return { complete: true, reason: 'allAllin' };
  }

  // Check if all active players have acted and their bets match
  for (const playerIndex of activePlayers) {
    const hasActed = playerActionsThisRound[playerIndex];
    const playerCurrentBet = playerBets[playerIndex] || 0;

    // Player hasn't acted yet
    if (!hasActed) {
      return { complete: false, reason: null };
    }

    // Player's bet doesn't match current bet
    if (playerCurrentBet < currentBet) {
      return { complete: false, reason: null };
    }
  }

  return { complete: true, reason: 'betsEqual' };
};

/**
 * Get the next game phase
 */
export const getNextPhase = (currentPhase) => {
  const phases = ['PREFLOP', 'FLOP', 'TURN', 'RIVER', 'SHOWDOWN'];
  const currentIndex = phases.indexOf(currentPhase);

  if (currentIndex === -1 || currentIndex === phases.length - 1) {
    return 'SHOWDOWN';
  }

  return phases[currentIndex + 1];
};

/**
 * Find the first player to act in a new betting round
 * Preflop: left of big blind
 * Postflop: left of dealer button
 */
export const findFirstPlayerToAct = (seats, dealerButtonPosition, phase) => {
  let startPosition;

  if (phase === 'PREFLOP') {
    // Preflop: first to act is left of big blind (3 seats from dealer)
    startPosition = (dealerButtonPosition + 3) % seats.length;
  } else {
    // Postflop: first to act is left of dealer button
    startPosition = (dealerButtonPosition + 1) % seats.length;
  }

  // Find first active player starting from startPosition
  let index = startPosition;
  let iterations = 0;

  while (iterations < seats.length) {
    const seat = seats[index];

    if (seat !== null &&
        seat.status !== 'folded' &&
        seat.status !== 'allin' &&
        seat.status !== 'out') {
      return index;
    }

    index = (index + 1) % seats.length;
    iterations++;
  }

  return null; // No active players found
};

/**
 * Find the next occupied seat (for dealer button rotation)
 */
export const findNextOccupiedSeat = (seats, currentPosition) => {
  let nextPosition = (currentPosition + 1) % seats.length;
  let iterations = 0;

  while (iterations < seats.length) {
    if (seats[nextPosition] !== null && seats[nextPosition].status !== 'out') {
      return nextPosition;
    }
    nextPosition = (nextPosition + 1) % seats.length;
    iterations++;
  }

  return currentPosition; // Fallback to current position if no other seat found
};

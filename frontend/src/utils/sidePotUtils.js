import { Hand } from 'pokersolver';
import { evaluateHand } from './pokerUtils';

/**
 * Calculate side pots from player bets
 * Returns array of {amount, eligiblePlayers: [seatIndices]}
 *
 * Algorithm:
 * 1. Get all non-folded players with their bets
 * 2. Sort by bet amount ascending
 * 3. For each unique bet level:
 *    - Calculate pot at that level
 *    - Track eligible players (all who bet at least that much)
 *    - Subtract matched amounts from remaining bets
 * 4. Return array of pots
 */
export const calculateSidePots = (playerBets, seats) => {
  // Build array of {seatIndex, betAmount, status}
  const players = Object.entries(playerBets)
    .map(([seatIndex, betAmount]) => ({
      seatIndex: parseInt(seatIndex),
      betAmount,
      status: seats[seatIndex]?.status || 'active'
    }))
    .filter(p => p.status !== 'folded' && p.betAmount > 0);

  // If no players or all folded, return empty pots
  if (players.length === 0) {
    return [];
  }

  // Sort by bet amount ascending
  players.sort((a, b) => a.betAmount - b.betAmount);

  // Calculate pots
  const pots = [];
  let remainingPlayers = [...players];

  while (remainingPlayers.length > 0) {
    const lowestBet = remainingPlayers[0].betAmount;
    let potAmount = 0;
    const eligiblePlayers = [];

    // Collect from all remaining players up to lowest bet
    remainingPlayers = remainingPlayers.map(p => {
      const contribution = Math.min(p.betAmount, lowestBet);
      potAmount += contribution;
      eligiblePlayers.push(p.seatIndex);
      return {
        ...p,
        betAmount: p.betAmount - contribution
      };
    }).filter(p => p.betAmount > 0); // Remove players with 0 remaining

    // Only add pot if amount > 0
    if (potAmount > 0) {
      pots.push({
        amount: potAmount,
        eligiblePlayers
      });
    }
  }

  return pots;
};

/**
 * Merge new side pots into existing pots array
 */
export const mergePots = (existingPots, newPots) => {
  if (existingPots.length === 0) {
    return newPots;
  }

  // For simplicity, just add new pots to existing
  // In a more complex implementation, you might merge pots with same eligible players
  return [...existingPots, ...newPots];
};

/**
 * Award pots to winners
 * For each pot:
 *   - Evaluate hands of eligible players
 *   - Find winner(s) using pokersolver
 *   - Split pot if tie
 *   - Update chip counts
 *
 * Returns {winners: [{seatIndex, amount, hand}], updatedSeats}
 */
export const awardPots = (pots, seats, communityCards) => {
  const updatedSeats = [...seats];
  const allWinners = [];

  for (const pot of pots) {
    const { amount, eligiblePlayers } = pot;

    // Evaluate hands for eligible players
    const playerHands = eligiblePlayers
      .filter(seatIndex => {
        const seat = updatedSeats[seatIndex];
        return seat && seat.cards && seat.cards.length === 2;
      })
      .map(seatIndex => {
        const seat = updatedSeats[seatIndex];
        const hand = evaluateHand(seat.cards, communityCards);
        return {
          seatIndex,
          hand,
          username: seat.username
        };
      });

    // If no valid hands, skip this pot (shouldn't happen)
    if (playerHands.length === 0) {
      continue;
    }

    // Find winner(s) using pokersolver
    const hands = playerHands.map(ph => ph.hand);
    const winningHands = Hand.winners(hands);

    // Determine which players have winning hands
    const winners = playerHands.filter(ph =>
      winningHands.some(wh => wh.descr === ph.hand.descr && wh.rank === ph.hand.rank)
    );

    // Split pot among winners
    const amountPerWinner = Math.floor(amount / winners.length);
    const remainder = amount % winners.length;

    winners.forEach((winner, index) => {
      // First winner gets any remainder from rounding
      const winAmount = amountPerWinner + (index === 0 ? remainder : 0);

      // Update chip count
      if (updatedSeats[winner.seatIndex]) {
        updatedSeats[winner.seatIndex] = {
          ...updatedSeats[winner.seatIndex],
          chipCount: updatedSeats[winner.seatIndex].chipCount + winAmount
        };

        allWinners.push({
          seatIndex: winner.seatIndex,
          amount: winAmount,
          hand: winner.hand.descr,
          username: winner.username
        });
      }
    });
  }

  return {
    winners: allWinners,
    updatedSeats
  };
};

/**
 * Award all pots to a single winner (when all others fold)
 */
export const awardPotsToWinner = (pots, winnerIndex, seats) => {
  const totalPot = pots.reduce((sum, pot) => sum + pot.amount, 0);
  const updatedSeats = [...seats];

  if (updatedSeats[winnerIndex]) {
    updatedSeats[winnerIndex] = {
      ...updatedSeats[winnerIndex],
      chipCount: updatedSeats[winnerIndex].chipCount + totalPot
    };
  }

  return {
    winners: [{
      seatIndex: winnerIndex,
      amount: totalPot,
      hand: 'All others folded',
      username: updatedSeats[winnerIndex]?.username || 'Unknown'
    }],
    updatedSeats
  };
};

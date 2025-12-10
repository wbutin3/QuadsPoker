// Betting action validation and processing utilities

/**
 * Calculate the amount needed to call
 */
export const calculateCallAmount = (currentBet, playerCurrentBet) => {
  return Math.max(0, currentBet - (playerCurrentBet || 0));
};

/**
 * Calculate minimum raise amount
 * Min raise = current bet + at least one big blind
 */
export const calculateMinRaise = (currentBet, bigBlind) => {
  return currentBet + bigBlind;
};

/**
 * Validate if a player action is legal
 * Returns {valid: boolean, reason: string}
 */
export const validateAction = (action, playerChips, currentBet, playerCurrentBet, bigBlind) => {
  playerCurrentBet = playerCurrentBet || 0;

  switch (action) {
    case 'fold':
      // Can always fold
      return { valid: true, reason: '' };

    case 'check':
      // Can only check if there's no bet to call
      if (playerCurrentBet < currentBet) {
        return { valid: false, reason: 'Cannot check - there is a bet to call' };
      }
      return { valid: true, reason: '' };

    case 'call':
      // Can only call if there's a bet to match
      if (playerCurrentBet >= currentBet) {
        return { valid: false, reason: 'Cannot call - no bet to match' };
      }
      // Must have chips to call (or will be all-in)
      return { valid: true, reason: '' };

    case 'raise':
      // Must have enough chips to at least min-raise
      // (This will be checked with the amount parameter in processPlayerAction)
      return { valid: true, reason: '' };

    case 'allin':
      // Can always go all-in
      return { valid: true, reason: '' };

    default:
      return { valid: false, reason: 'Invalid action' };
  }
};

/**
 * Process a player action and return the updated state
 * Returns {
 *   chipChange: number,  // Amount to deduct from chips
 *   betAmount: number,   // Total bet amount for this round
 *   status: string,      // New player status
 *   actualAction: string // Actual action taken (might differ from requested)
 * }
 */
export const processPlayerAction = (action, amount, playerChips, currentBet, playerCurrentBet) => {
  playerCurrentBet = playerCurrentBet || 0;

  switch (action) {
    case 'fold':
      return {
        chipChange: 0,
        betAmount: playerCurrentBet,
        status: 'folded',
        actualAction: 'fold'
      };

    case 'check':
      return {
        chipChange: 0,
        betAmount: playerCurrentBet,
        status: 'active',
        actualAction: 'check'
      };

    case 'call': {
      const callAmount = calculateCallAmount(currentBet, playerCurrentBet);

      // If player doesn't have enough to call, they go all-in
      if (callAmount >= playerChips) {
        return {
          chipChange: playerChips,
          betAmount: playerCurrentBet + playerChips,
          status: 'allin',
          actualAction: 'allin'
        };
      }

      return {
        chipChange: callAmount,
        betAmount: currentBet,
        status: 'active',
        actualAction: 'call'
      };
    }

    case 'raise': {
      // Amount is the total bet amount (not the raise amount)
      const totalBetAmount = amount;
      const additionalChips = totalBetAmount - playerCurrentBet;

      // If player doesn't have enough chips for the raise, they go all-in
      if (additionalChips >= playerChips) {
        return {
          chipChange: playerChips,
          betAmount: playerCurrentBet + playerChips,
          status: 'allin',
          actualAction: 'allin'
        };
      }

      return {
        chipChange: additionalChips,
        betAmount: totalBetAmount,
        status: 'active',
        actualAction: 'raise'
      };
    }

    case 'allin':
      return {
        chipChange: playerChips,
        betAmount: playerCurrentBet + playerChips,
        status: 'allin',
        actualAction: 'allin'
      };

    default:
      // Invalid action, return no change
      return {
        chipChange: 0,
        betAmount: playerCurrentBet,
        status: 'active',
        actualAction: 'check'
      };
  }
};

/**
 * Format action message for display
 */
export const formatActionMessage = (username, action, amount, currentBet) => {
  switch (action) {
    case 'fold':
      return `${username} folds`;
    case 'check':
      return `${username} checks`;
    case 'call':
      return `${username} calls $${amount}`;
    case 'raise':
      return `${username} raises to $${amount}`;
    case 'allin':
      return `${username} is all-in for $${amount}`;
    default:
      return `${username} acts`;
  }
};

/**
 * Helper functions for formatting Telegram messages
 */

export interface LPPosition {
  pair: string;
  amount: string;
  value?: string;
}

export interface PortfolioAnalytics {
  totalLiquidity: string;
  feesEarned: string;
  mockIL: string;
}

/**
 * Format LP positions for Telegram display
 */
export const formatPositions = (positions: LPPosition[]): string => {
  if (positions.length === 0) {
    return '📊 *No LP positions found.*\n\nAdd your wallet address to start tracking positions!';
  }

  let message = '📊 *Your LP Positions:*\n\n';
  positions.forEach((pos, index) => {
    message += `• **${pos.pair}** → ${pos.amount}`;
    if (pos.value) {
      message += ` (${pos.value})`;
    }
    message += '\n';
  });
  
  return message;
};

/**
 * Format portfolio analytics for Telegram display
 */
export const formatAnalytics = (analytics: PortfolioAnalytics | null): string => {
  if (!analytics) {
    return '📈 *No portfolio analytics available.*\n\nAdd your wallet address to start tracking analytics!';
  }

  return `📈 *Portfolio Analytics:*\n\n` +
         `• **Total Liquidity:** ${analytics.totalLiquidity}\n` +
         `• **Fees Earned:** ${analytics.feesEarned}\n` +
         `• **Mock IL:** ${analytics.mockIL}`;
};

/**
 * Format error messages for Telegram display
 */
export const formatError = (error: string): string => {
  return `❌ *Error:* ${error}\n\nPlease try again or contact support if the issue persists.`;
};

/**
 * Format success messages for Telegram display
 */
export const formatSuccess = (message: string): string => {
  return `✅ ${message}`;
};

/**
 * Format help message for Telegram display
 */
export const formatHelp = (): string => {
  return `🤖 *Available Commands:*\n\n` +
         `• /positions → View your LP positions\n` +
         `• /analytics → Portfolio analytics\n` +
         `• /rebalance → Rebalance your LP bins (demo)\n` +
         `• /help → Show this menu\n\n` +
         `*Note:* This is a demo bot. Add your wallet address to see real data!`;
};

/**
 * Format welcome message for Telegram display
 */
export const formatWelcome = (): string => {
  return `👋 *Welcome to the Saros DLMM Bot!*\n\n` +
         `Use /help to see available commands.\n\n` +
         `*Features:*\n` +
         `• View your liquidity positions\n` +
         `• Track portfolio analytics\n` +
         `• Simulate rebalancing (demo)\n\n` +
         `*Note:* This is a demo version with mock data.`;
};

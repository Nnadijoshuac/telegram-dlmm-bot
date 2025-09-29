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
  realSOLPrice?: string;
  realReserves?: string;
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

  let message = `📈 *Portfolio Analytics:*\n\n` +
         `• **Total Liquidity:** ${analytics.totalLiquidity}\n` +
         `• **Fees Earned:** ${analytics.feesEarned}\n` +
         `• **Mock IL:** ${analytics.mockIL}`;
  
  // Add real data if available
  if (analytics.realSOLPrice) {
    message += `\n\n🔴 *Live Data (SOL/USDC):*`;
    message += `\n• **SOL Price:** ${analytics.realSOLPrice}`;
    if (analytics.realReserves) {
      message += `\n• **Pool Reserves:** ${analytics.realReserves}`;
    }
  }
  
  return message;
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
  return `🤖 *Saros Hackathon Bot - Command Center*\n\n` +
         `🏊 *Pool Commands*\n` +
         `• /positions → View your liquidity positions\n` +
         `• /analytics → Check portfolio analytics and live data\n` +
         `• /rebalance → Simulate pool rebalancing (demo mode)\n\n` +
         `ℹ️ *Info Commands*\n` +
         `• /status → Check bot status and connection\n` +
         `• /help → Show this command center\n\n` +
         `🔧 *Utility Commands*\n` +
         `• /wallet → Set or view your Solana wallet address\n` +
         `• /start → Show the onboarding dashboard\n\n` +
         `🚀 *Powered by Saros DLMM | Hackathon Edition*`;
};

/**
 * Format welcome message for Telegram display
 */
export const formatWelcome = (): string => {
  return `🎉 *Welcome to Saros Hackathon Bot!*\n\n` +
         `Your gateway to advanced DeFi liquidity management on Solana! 🚀\n\n` +
         `*📋 Onboarding Dashboard:*\n\n` +
         `*Step 1: Connect Wallet* 🔗\n` +
         `Set up your Solana wallet to start managing positions\n` +
         `→ Use \`/wallet <your_address>\`\n\n` +
         `*Step 2: Create Pool* 🏗️\n` +
         `View and manage your liquidity positions\n` +
         `→ Use \`/positions\` to see your pools\n\n` +
         `*Step 3: Join Pool* 📈\n` +
         `Monitor analytics and track performance\n` +
         `→ Use \`/analytics\` for live data\n\n` +
         `*Step 4: Learn More* 📚\n` +
         `Explore all available commands and features\n` +
         `→ Use \`/help\` for the command center\n\n` +
         `*Ready to begin?* Let's start your DeFi journey! 🌟`;
};

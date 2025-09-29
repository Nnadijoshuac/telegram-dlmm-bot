/**
 * Telegram Bot for Saros DLMM DeFi Positions
 * Main entry point for the bot
 */

import { Bot, Context } from 'grammy';
import dotenv from 'dotenv';
import { 
  getLPPositions, 
  getPortfolioAnalytics, 
  simulateRebalance,
  setUserWallet,
  getUserWallet,
  isValidWalletAddress,
  getConnectionStatus
} from './dlmm';
import { 
  formatPositions, 
  formatAnalytics, 
  formatError, 
  formatSuccess, 
  formatHelp, 
  formatWelcome 
} from './format';

// Load environment variables
dotenv.config();

// Initialize bot
const bot = new Bot(process.env.TELEGRAM_BOT_TOKEN || '');

// Global error handler for maximum stability
bot.catch((err) => {
  console.error('Bot error:', err);
  // Don't let the bot crash - just log the error
});

// Additional error handling middleware
bot.use(async (ctx, next) => {
  try {
    await next();
  } catch (error) {
    console.error('Middleware error:', error);
    try {
      await ctx.reply(formatError('An unexpected error occurred. Please try again.'));
    } catch (replyError) {
      console.error('Error sending error message:', replyError);
    }
  }
});

// Command: /start
bot.command('start', async (ctx: Context) => {
  try {
    const message = formatWelcome();
    await ctx.reply(message, { parse_mode: 'Markdown' });
  } catch (error) {
    console.error('Error in start command:', error);
    await ctx.reply(formatError('Failed to start the bot. Please try again.'));
  }
});

// Command: /help
bot.command('help', async (ctx: Context) => {
  try {
    const message = formatHelp();
    await ctx.reply(message, { parse_mode: 'Markdown' });
  } catch (error) {
    console.error('Error in help command:', error);
    await ctx.reply(formatError('Failed to show help. Please try again.'));
  }
});

// Command: /positions
bot.command('positions', async (ctx: Context) => {
  try {
    if (!ctx.from) {
      await ctx.reply(formatError('Unable to identify user.'));
      return;
    }

    const positions = await getLPPositions(ctx.from.id);
    const message = formatPositions(positions);
    await ctx.reply(message, { parse_mode: 'Markdown' });
  } catch (error) {
    console.error('Error in positions command:', error);
    await ctx.reply(formatError('Failed to fetch positions. Please try again.'));
  }
});

// Command: /analytics
bot.command('analytics', async (ctx: Context) => {
  try {
    if (!ctx.from) {
      await ctx.reply(formatError('Unable to identify user.'));
      return;
    }

    // Show loading message for real-time data
    const loadingMessage = await ctx.reply('🔄 *Fetching live pool data...*', { parse_mode: 'Markdown' });
    
    try {
      const analytics = await getPortfolioAnalytics(ctx.from.id);
      const message = formatAnalytics(analytics);
      
      // Edit the loading message with the results
      await ctx.api.editMessageText(ctx.chat.id, loadingMessage.message_id, message, { parse_mode: 'Markdown' });
    } catch (analyticsError) {
      console.error('Error fetching analytics:', analyticsError);
      
      // Fallback to mock data if real data fails
      const fallbackAnalytics = {
        totalLiquidity: '$200',
        feesEarned: '$12.50',
        mockIL: '-2.1%',
        realSOLPrice: 'Data unavailable',
        dataSource: 'Error'
      };
      
      const fallbackMessage = formatAnalytics(fallbackAnalytics);
      await ctx.api.editMessageText(ctx.chat.id, loadingMessage.message_id, fallbackMessage, { parse_mode: 'Markdown' });
    }
  } catch (error) {
    console.error('Error in analytics command:', error);
    await ctx.reply(formatError('Failed to fetch analytics. Please try again.'));
  }
});

// Command: /rebalance
bot.command('rebalance', async (ctx: Context) => {
  try {
    if (!ctx.from) {
      await ctx.reply(formatError('Unable to identify user.'));
      return;
    }

    simulateRebalance(ctx.from.id);
    await ctx.reply('🔄 *Rebalancing simulated! (Demo mode)*', { parse_mode: 'Markdown' });
  } catch (error) {
    console.error('Error in rebalance command:', error);
    await ctx.reply(formatError('Failed to simulate rebalancing. Please try again.'));
  }
});

// Command: /wallet - Set user wallet address
bot.command('wallet', async (ctx: Context) => {
  try {
    if (!ctx.from) {
      await ctx.reply(formatError('Unable to identify user.'));
      return;
    }

    const message = ctx.message?.text || '';
    const walletAddress = message.replace('/wallet', '').trim();

    if (!walletAddress) {
      const currentWallet = await getUserWallet(ctx.from.id);
      const statusMessage = currentWallet 
        ? `📝 *Current wallet:* \`${currentWallet}\`\n\nTo update, send: /wallet <new_address>`
        : '📝 *No wallet set.*\n\nTo set your wallet, send: /wallet <your_solana_address>';
      
      await ctx.reply(statusMessage, { parse_mode: 'Markdown' });
      return;
    }

    if (!isValidWalletAddress(walletAddress)) {
      await ctx.reply(formatError('Invalid Solana wallet address. Please check and try again.'));
      return;
    }

    await setUserWallet(ctx.from.id, walletAddress);
    await ctx.reply(formatSuccess(`Wallet address set to: \`${walletAddress}\``), { parse_mode: 'Markdown' });
  } catch (error) {
    console.error('Error in wallet command:', error);
    await ctx.reply(formatError('Failed to set wallet address. Please try again.'));
  }
});

// Command: /status - Check bot and connection status
bot.command('status', async (ctx: Context) => {
  try {
    const connectionStatus = await getConnectionStatus();
    const walletAddress = ctx.from ? await getUserWallet(ctx.from.id) : null;
    
    let statusMessage = '🔍 *Bot Status:*\n\n';
    statusMessage += `• **Connection:** ${connectionStatus ? '✅ Connected' : '❌ Disconnected'}\n`;
    statusMessage += `• **Wallet:** ${walletAddress ? `✅ Set (${walletAddress.slice(0, 8)}...)` : '❌ Not set'}\n`;
    statusMessage += `• **Mode:** Demo (Mock data)\n\n`;
    statusMessage += `Use /wallet to set your Solana address for real data.`;
    
    await ctx.reply(statusMessage, { parse_mode: 'Markdown' });
  } catch (error) {
    console.error('Error in status command:', error);
    await ctx.reply(formatError('Failed to check status. Please try again.'));
  }
});

// Handle unknown commands
bot.on('message', async (ctx: Context) => {
  try {
    const message = ctx.message?.text;
    if (message && message.startsWith('/')) {
      await ctx.reply('❓ *Unknown command.*\n\nUse /help to see available commands.', { parse_mode: 'Markdown' });
    }
  } catch (error) {
    console.error('Error handling unknown command:', error);
  }
});

// Start the bot
const startBot = async () => {
  try {
    console.log('🚀 Starting Saros DLMM Bot...');
    
    // Check if bot token is provided
    if (!process.env.TELEGRAM_BOT_TOKEN) {
      console.error('❌ TELEGRAM_BOT_TOKEN is not set in environment variables');
      process.exit(1);
    }

    // Check connection status
    const connectionStatus = await getConnectionStatus();
    console.log(`🔗 Solana connection: ${connectionStatus ? 'Connected' : 'Disconnected'}`);

    // Start the bot
    await bot.start();
    console.log('✅ Bot started successfully!');
    console.log('📱 Bot is ready to receive messages...');
  } catch (error) {
    console.error('❌ Failed to start bot:', error);
    process.exit(1);
  }
};

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down bot...');
  await bot.stop();
  console.log('✅ Bot stopped successfully');
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 Shutting down bot...');
  await bot.stop();
  console.log('✅ Bot stopped successfully');
  process.exit(0);
});

// Start the bot
startBot();

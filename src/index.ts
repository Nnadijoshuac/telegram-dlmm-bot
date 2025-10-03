/**
 * Saros DLMM Telegram Bot
 * 
 * A professional Telegram bot for managing DeFi liquidity positions.
 * Features interactive menus, real-time price alerts, and persistent storage.
 */

import { Bot, Context, InlineKeyboard } from 'grammy';
import dotenv from 'dotenv';
import { 
  getLPPositions, 
  getPortfolioAnalytics, 
  simulateRebalance,
  setUserWallet,
  getUserWallet,
  isValidWalletAddress,
  getConnectionStatus,
  setPriceAlert,
  getUserPriceAlert,
  removePriceAlert,
  getAllUsersWithAlerts,
  getCurrentSOLPrice
} from './dlmm';
import { 
  formatPositions, 
  formatAnalytics, 
  formatError, 
  formatSuccess, 
  formatHelp, 
  formatWelcome,
  formatAlertSet,
  formatPriceAlert,
  formatAlertsMenu,
  formatAlertRemoved
} from './format';

// Load environment variables
dotenv.config();

// Initialize bot
const bot = new Bot(process.env.TELEGRAM_BOT_TOKEN || '');

// Global error handler - prevents bot crashes
bot.catch((err) => {
  console.error('Bot error:', err);
});

// Background price monitoring for alerts
let priceCheckerInterval: ReturnType<typeof setInterval> | null = null;

const startPriceChecker = () => {
  if (priceCheckerInterval) {
    clearInterval(priceCheckerInterval);
  }
  
  // Check prices every 5 minutes
  priceCheckerInterval = setInterval(async () => {
    try {
      const currentPrice = await getCurrentSOLPrice();
      if (!currentPrice) return;
      
      const userAlerts = await getAllUsersWithAlerts();
      
      // Check each user's alert
      for (const [userId, targetPrice] of Object.entries(userAlerts)) {
        const userIdNum = parseInt(userId);
        const targetPriceNum = parseFloat(targetPrice.toString());
        
        // Send alert if price crossed target
        if (currentPrice >= targetPriceNum) {
          try {
            await bot.api.sendMessage(userIdNum, formatPriceAlert(currentPrice, targetPriceNum), { parse_mode: 'Markdown' });
            await removePriceAlert(userIdNum); // Remove after triggering
          } catch (error) {
            console.error(`Error sending alert to user ${userIdNum}:`, error);
          }
        }
      }
    } catch (error) {
      console.error('Error in price checker:', error);
    }
  }, 5 * 60 * 1000);
};

const stopPriceChecker = () => {
  if (priceCheckerInterval) {
    clearInterval(priceCheckerInterval);
    priceCheckerInterval = null;
  }
};

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
      if (ctx.chat) {
        await ctx.api.editMessageText(ctx.chat.id, loadingMessage.message_id, message, { parse_mode: 'Markdown' });
      }
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
      if (ctx.chat) {
        await ctx.api.editMessageText(ctx.chat.id, loadingMessage.message_id, fallbackMessage, { parse_mode: 'Markdown' });
      }
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

// Command: /menu - Show inline keyboard menu
bot.command('menu', async (ctx: Context) => {
  try {
    if (!ctx.from) {
      await ctx.reply(formatError('Unable to identify user.'));
      return;
    }

    const keyboard = new InlineKeyboard()
      .text('📊 Positions', 'menu_positions')
      .text('📈 Analytics', 'menu_analytics').row()
      .text('🔔 Alerts', 'menu_alerts')
      .text('ℹ️ Status', 'menu_status').row()
      .text('🔄 Refresh', 'menu_refresh');

    await ctx.reply('🎛️ *Main Menu*\n\nChoose an option below:', { 
      parse_mode: 'Markdown',
      reply_markup: keyboard
    });
  } catch (error) {
    console.error('Error in menu command:', error);
    await ctx.reply(formatError('Failed to show menu. Please try again.'));
  }
});

// Command: /alert - Set price alert
bot.command('alert', async (ctx: Context) => {
  try {
    if (!ctx.from) {
      await ctx.reply(formatError('Unable to identify user.'));
      return;
    }

    const message = ctx.message?.text || '';
    const args = message.replace('/alert', '').trim();

    if (!args) {
      // Show current alert status
      const currentAlert = await getUserPriceAlert(ctx.from.id);
      const currentPrice = await getCurrentSOLPrice();
      const alertMessage = formatAlertsMenu(currentAlert, currentPrice);
      await ctx.reply(alertMessage, { parse_mode: 'Markdown' });
      return;
    }

    if (args.toLowerCase() === 'off') {
      // Remove alert
      await removePriceAlert(ctx.from.id);
      await ctx.reply(formatAlertRemoved(), { parse_mode: 'Markdown' });
      return;
    }

    const price = parseFloat(args);
    if (isNaN(price) || price <= 0) {
      await ctx.reply(formatError('Invalid price. Please enter a valid number (e.g., /alert 30)'));
      return;
    }

    // Set alert
    await setPriceAlert(ctx.from.id, price);
    await ctx.reply(formatAlertSet(price), { parse_mode: 'Markdown' });
  } catch (error) {
    console.error('Error in alert command:', error);
    await ctx.reply(formatError('Failed to set alert. Please try again.'));
  }
});

// Command: /alerts - Show alerts menu (alias for /alert)
bot.command('alerts', async (ctx: Context) => {
  try {
    if (!ctx.from) {
      await ctx.reply(formatError('Unable to identify user.'));
      return;
    }

    const currentAlert = await getUserPriceAlert(ctx.from.id);
    const currentPrice = await getCurrentSOLPrice();
    const alertMessage = formatAlertsMenu(currentAlert, currentPrice);
    await ctx.reply(alertMessage, { parse_mode: 'Markdown' });
  } catch (error) {
    console.error('Error in alerts command:', error);
    await ctx.reply(formatError('Failed to fetch alerts. Please try again.'));
  }
});

// Inline button callbacks
bot.callbackQuery('menu_positions', async (ctx: Context) => {
  try {
    if (!ctx.from) {
      await ctx.answerCallbackQuery('Unable to identify user.');
      return;
    }

    const positions = await getLPPositions(ctx.from.id);
    const message = formatPositions(positions);
    await ctx.editMessageText(message, { parse_mode: 'Markdown' });
    await ctx.answerCallbackQuery('📊 Positions loaded');
  } catch (error) {
    console.error('Error in positions callback:', error);
    await ctx.answerCallbackQuery('Failed to load positions');
  }
});

bot.callbackQuery('menu_analytics', async (ctx: Context) => {
  try {
    if (!ctx.from) {
      await ctx.answerCallbackQuery('Unable to identify user.');
      return;
    }

    // Show loading message
    await ctx.editMessageText('🔄 *Fetching live pool data...*', { parse_mode: 'Markdown' });
    
    try {
      const analytics = await getPortfolioAnalytics(ctx.from.id);
      const message = formatAnalytics(analytics);
      await ctx.editMessageText(message, { parse_mode: 'Markdown' });
      await ctx.answerCallbackQuery('📈 Analytics loaded');
    } catch (analyticsError) {
      console.error('Error fetching analytics:', analyticsError);
      await ctx.editMessageText('❌ *Failed to load analytics*\n\nPlease try again later.', { parse_mode: 'Markdown' });
      await ctx.answerCallbackQuery('Failed to load analytics');
    }
  } catch (error) {
    console.error('Error in analytics callback:', error);
    await ctx.answerCallbackQuery('Failed to load analytics');
  }
});

bot.callbackQuery('menu_alerts', async (ctx: Context) => {
  try {
    if (!ctx.from) {
      await ctx.answerCallbackQuery('Unable to identify user.');
      return;
    }

    const currentAlert = await getUserPriceAlert(ctx.from.id);
    const currentPrice = await getCurrentSOLPrice();
    const alertMessage = formatAlertsMenu(currentAlert, currentPrice);
    await ctx.editMessageText(alertMessage, { parse_mode: 'Markdown' });
    await ctx.answerCallbackQuery('🔔 Alerts loaded');
  } catch (error) {
    console.error('Error in alerts callback:', error);
    await ctx.answerCallbackQuery('Failed to load alerts');
  }
});

bot.callbackQuery('menu_status', async (ctx: Context) => {
  try {
    if (!ctx.from) {
      await ctx.answerCallbackQuery('Unable to identify user.');
      return;
    }

    const connectionStatus = await getConnectionStatus();
    const walletAddress = await getUserWallet(ctx.from.id);
    const currentAlert = await getUserPriceAlert(ctx.from.id);
    
    let statusMessage = '🔍 *Bot Status:*\n\n';
    statusMessage += `• **Connection:** ${connectionStatus ? '✅ Connected' : '❌ Disconnected'}\n`;
    statusMessage += `• **Wallet:** ${walletAddress ? `✅ Set (${walletAddress.slice(0, 8)}...)` : '❌ Not set'}\n`;
    statusMessage += `• **Alert:** ${currentAlert ? `✅ Set ($${currentAlert})` : '❌ Not set'}\n`;
    statusMessage += `• **Storage:** ✅ Persistent (node-persist)\n`;
    statusMessage += `• **Mode:** Demo (Mock data + Live SOL price)\n\n`;
    statusMessage += `Use /wallet to set your Solana address for real data.`;
    
    await ctx.editMessageText(statusMessage, { parse_mode: 'Markdown' });
    await ctx.answerCallbackQuery('ℹ️ Status loaded');
  } catch (error) {
    console.error('Error in status callback:', error);
    await ctx.answerCallbackQuery('Failed to load status');
  }
});

bot.callbackQuery('menu_refresh', async (ctx: Context) => {
  try {
    const keyboard = new InlineKeyboard()
      .text('📊 Positions', 'menu_positions')
      .text('📈 Analytics', 'menu_analytics').row()
      .text('🔔 Alerts', 'menu_alerts')
      .text('ℹ️ Status', 'menu_status').row()
      .text('🔄 Refresh', 'menu_refresh');

    await ctx.editMessageText('🎛️ *Main Menu*\n\nChoose an option below:', { 
      parse_mode: 'Markdown',
      reply_markup: keyboard
    });
    await ctx.answerCallbackQuery('🔄 Menu refreshed');
  } catch (error) {
    console.error('Error in refresh callback:', error);
    await ctx.answerCallbackQuery('Failed to refresh menu');
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
    
    // Start background price checker
    startPriceChecker();
    console.log('🔔 Price alert checker started (5-minute intervals)');
  } catch (error) {
    console.error('❌ Failed to start bot:', error);
    process.exit(1);
  }
};

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down bot...');
  stopPriceChecker();
  await bot.stop();
  console.log('✅ Bot stopped successfully');
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 Shutting down bot...');
  stopPriceChecker();
  await bot.stop();
  console.log('✅ Bot stopped successfully');
  process.exit(0);
});

// Start the bot
startBot();

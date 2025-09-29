# Saros Hackathon Bot

A Telegram bot built with TypeScript that integrates with the Saros DLMM SDK to provide users with advanced DeFi liquidity position management, real-time analytics, and intelligent rebalancing capabilities - all from the comfort of Telegram.

## Installation & Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and add your `TELEGRAM_BOT_TOKEN` and `RPC_URL`.

3. **Run locally:**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm run build && npm start
   ```

## Available Commands

🤖 **Saros Hackathon Bot - Command Center**

🏊 **Pool Commands**
• /positions → View your liquidity positions
• /analytics → Check portfolio analytics and live data
• /rebalance → Simulate pool rebalancing (demo mode)

ℹ️ **Info Commands**
• /status → Check bot status and connection
• /help → Show this command center

🔧 **Utility Commands**
• /wallet → Set or view your Solana wallet address
• /start → Show the onboarding dashboard

🚀 **Powered by Saros DLMM | Hackathon Edition**

## Documentation

- **[PLAN.md](PLAN.md)** - Initial design and implementation plan
- **[UPDATE.md](UPDATE.md)** - Progress log and feature updates
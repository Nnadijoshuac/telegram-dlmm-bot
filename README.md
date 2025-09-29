# Saros DLMM Telegram Bot

> ⚡ Built for Hackathon – Demo-ready Telegram Bot for Saros DLMM

A Telegram bot that brings DeFi liquidity management to your fingertips. Set up alerts, monitor positions, and manage your Saros DLMM pools through simple, interactive conversations.

## The Problem

DeFi interfaces are complex and fragmented. Users need to juggle multiple tabs, wallet connections, and complex UIs just to check their positions or set up price alerts. Most DeFi bots are basic text-only interfaces that don't provide a smooth user experience.

## Our Solution

A professional Telegram bot with interactive menus, real-time price alerts, and persistent storage. Everything you need for DeFi management in one conversation.

## Features

- **Interactive Menu System** - Click buttons instead of typing commands
- **Real-time Price Alerts** - Get notified when SOL crosses your target price
- **Persistent Storage** - Your wallet and alerts survive bot restarts
- **Live Data Integration** - Real SOL price from CoinGecko API
- **Professional UX** - Loading states, error handling, and clean formatting
- **Crash-proof Design** - Comprehensive error handling prevents bot crashes

## Quick Start

### Prerequisites
- Node.js 18+
- Telegram Bot Token (get from [@BotFather](https://t.me/botfather))
- Solana RPC URL (optional, defaults to mainnet)

### Installation

1. **Clone and install dependencies:**
   ```bash
   git clone <your-repo-url>
   cd telegram-dlmm-bot
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and add your `TELEGRAM_BOT_TOKEN` and `RPC_URL`.

3. **Run the bot:**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm run build && npm start
   ```

### Demo Instructions

1. **Start a conversation** with your bot
2. **Send `/start`** to see the onboarding dashboard
3. **Send `/menu`** to access the interactive menu
4. **Set a wallet** with `/wallet <your_solana_address>`
5. **Set a price alert** with `/alert 30`
6. **Explore features** using the menu buttons

## Example Commands

### Basic Commands
- `/start` - Welcome dashboard and onboarding
- `/help` - Show all available commands
- `/menu` - Interactive button menu
- `/status` - Check bot and connection status

### Wallet Management
- `/wallet <address>` - Set your Solana wallet address
- `/wallet` - View current wallet (if set)

### Position Management
- `/positions` - View your liquidity positions
- `/analytics` - Portfolio analytics with live data
- `/rebalance` - Simulate pool rebalancing (demo mode)

### Price Alerts
- `/alert <price>` - Set SOL price alert (e.g., `/alert 30`)
- `/alert off` - Remove current alert
- `/alerts` - View current alert status

## Project Structure

```
src/
├── index.ts          # Bot entry point and command handlers
├── dlmm.ts           # SDK integration and storage functions
└── format.ts         # Message formatting utilities

data/                 # Persistent storage
├── user_wallets.json # User wallet addresses
└── user_alerts.json  # User price alerts
```

## Project Documentation

- **[PLAN.md](PLAN.md)** - Initial concept and technical vision
- **[UPDATE.md](UPDATE.md)** - Development progress and feature updates
- **[HACKATHON_PITCH.md](HACKATHON_PITCH.md)** - Hackathon presentation document

## What's Real vs Mock

### Real Features
- ✅ Interactive menu system with buttons
- ✅ Price alert storage and background monitoring
- ✅ Live SOL price from CoinGecko API
- ✅ Persistent wallet and alert storage
- ✅ Professional error handling and UX

### Mock Features (Demo Mode)
- 📊 LP positions data (simulated)
- 📈 Portfolio analytics (simulated)
- 🔄 Rebalancing (simulation only)
- 🏊 Pool reserves (calculated from real SOL price)

## Next Steps

This is a solid MVP that demonstrates the core concepts. Post-hackathon, we could:

- **Real SDK Integration** - Connect to actual Saros DLMM pools
- **Transaction Execution** - Enable real rebalancing and trading
- **Advanced Analytics** - Add charts, historical data, and predictions
- **Multi-wallet Support** - Allow users to manage multiple wallets
- **Notification System** - Email/SMS alerts in addition to Telegram
- **Web Dashboard** - Complement the bot with a web interface

## Development

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Build for production
npm run build

# Start production build
npm start
```

## Contributing

This is a hackathon project, but feel free to:
- Report bugs or issues
- Suggest new features
- Submit pull requests for improvements

## License

MIT License - feel free to use this code for your own projects.

---

*Built with TypeScript, Grammy, and a lot of hackathon passion* ⚡
# Saros DLMM Telegram Bot

A Telegram bot built with TypeScript that integrates with the Saros DLMM SDK to help users view and manage their DeFi liquidity positions.

## 🚀 Features

- **View LP Positions**: Check your current liquidity positions across different pools
- **Portfolio Analytics**: Track total liquidity, fees earned, and impermanent loss
- **Rebalancing Simulation**: Demo rebalancing functionality (simulated)
- **Wallet Management**: Set and manage your Solana wallet address
- **Real-time Status**: Check bot and connection status

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Telegram Bot Token (from [@BotFather](https://t.me/botfather))
- Solana RPC URL (optional, defaults to mainnet)

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd telegram-dlmm-bot
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your configuration:
   ```env
   TELEGRAM_BOT_TOKEN=your_telegram_bot_token_here
   RPC_URL=https://api.mainnet-beta.solana.com
   ```

4. **Build the project**
   ```bash
   npm run build
   ```

## 🚀 Usage

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

## 🤖 Bot Commands

| Command | Description | Example Output |
|---------|-------------|----------------|
| `/start` | Welcome message and introduction | 👋 Welcome to the Saros DLMM Bot! |
| `/help` | Show available commands | 🤖 Available Commands: • /positions → View your LP positions |
| `/positions` | View your LP positions | 📊 Your LP Positions: • SOL/USDC → 150 USDC + 0.05 SOL |
| `/analytics` | Portfolio analytics | 📈 Portfolio Analytics: • Total Liquidity: $200 |
| `/rebalance` | Simulate rebalancing (demo) | 🔄 Rebalancing simulated! (Demo mode) |
| `/wallet` | Set or view wallet address | 📝 Current wallet: 1A2B3C4D... |
| `/status` | Check bot and connection status | 🔍 Bot Status: • Connection: ✅ Connected |

## 📁 Project Structure

```
telegram-dlmm-bot/
├── src/
│   ├── index.ts          # Main bot entry point
│   ├── dlmm.ts           # Saros DLMM SDK wrapper
│   └── format.ts         # Message formatting helpers
├── dist/                 # Compiled JavaScript (generated)
├── .env.example          # Environment variables template
├── .env                  # Your environment variables (create this)
├── package.json          # Project dependencies and scripts
├── tsconfig.json         # TypeScript configuration
└── README.md             # This file
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `TELEGRAM_BOT_TOKEN` | Your Telegram bot token from @BotFather | Yes | - |
| `RPC_URL` | Solana RPC endpoint | No | `https://api.mainnet-beta.solana.com` |

### TypeScript Configuration

The project uses TypeScript with strict mode enabled. Configuration is in `tsconfig.json`:

- Target: ES2020
- Module: CommonJS
- Strict type checking enabled
- Source maps for debugging

## 📦 Dependencies

### Production Dependencies
- `grammy` - Telegram bot framework
- `dotenv` - Environment variable management
- `@saros-finance/dlmm-sdk` - Saros DLMM SDK integration
- `@solana/web3.js` - Solana blockchain interaction

### Development Dependencies
- `typescript` - TypeScript compiler
- `ts-node` - TypeScript execution for Node.js
- `nodemon` - Development server with auto-restart
- `@types/node` - Node.js type definitions

## 🚨 Important Notes

### Demo Mode
This bot currently runs in **demo mode** with mock data. To enable real data:

1. Set your wallet address using `/wallet <your_solana_address>`
2. The bot will attempt to fetch real data (implementation pending)
3. Currently shows sample data for demonstration purposes

### Limitations
- Real Saros DLMM SDK integration is partially implemented
- Wallet address storage is in-memory (not persistent)
- Rebalancing is simulated only
- No transaction signing or execution

## 🔍 Troubleshooting

### Common Issues

1. **Bot not responding**
   - Check if `TELEGRAM_BOT_TOKEN` is correctly set
   - Verify the bot token is valid
   - Check console for error messages

2. **Connection issues**
   - Verify `RPC_URL` is accessible
   - Check network connectivity
   - Try using a different RPC endpoint

3. **Build errors**
   - Ensure all dependencies are installed: `npm install`
   - Check TypeScript configuration
   - Verify Node.js version compatibility

### Debug Mode

Run with debug logging:
```bash
DEBUG=* npm run dev
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the troubleshooting section
- Review the PLAN.md for implementation details

## 🔮 Roadmap

- [ ] Complete Saros DLMM SDK integration
- [ ] Persistent wallet storage
- [ ] Real transaction execution
- [ ] Advanced analytics
- [ ] Multi-wallet support
- [ ] Price alerts
- [ ] Historical data tracking

---

**Note**: This is a demo project. Always verify code and test thoroughly before using in production.

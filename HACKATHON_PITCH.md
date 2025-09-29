# Telegram DLMM Trading Bot

A hackathon prototype that feels like a startup MVP

## The Problem

DeFi is fragmented and intimidating.

Too many UIs. Too much jargon.

Retail users want quick answers, not dashboards.

Professional traders need automation, not extra clicks.

💡 Stat: 90% of new DeFi users drop off in their first week because onboarding is too complex.

##The Solution

A Telegram bot that makes DLMM trading feel like chatting with a friend.

Instant answers: pool positions, wallet status, analytics.

Pro UX in Telegram: menus, emojis, confirmations.

Alerts & persistence: bot “remembers” you and notifies in real-time.

In 30 seconds, a user can check their wallet, rebalance, and set alerts.

What Makes It Different

Most bots:

Static commands, clunky replies.

Forget user state after restart.

No real SDK integration.

Our bot:

Interactive menus + inline buttons.

Lightweight persistence (remembers wallets).

SDK-backed pool data (SOL/USDC, more later).

Clean UX (loading states, emoji feedback).

## How It Works
User (Telegram) → Bot Command (/positions) → Bot Backend
→ Calls Saros DLMM SDK → Fetch Pool Data
→ Formats response + interactive menu → Back to Telegram
→ Persists wallet locally (node-persist/JSON) for continuity

Demo Flow (Judge-Friendly)

/start → friendly intro, emoji menus, “Connect Wallet” option.

/wallet add <address> → bot remembers wallet.

/positions → shows positions with ✅ / ❌ status icons.

/analytics → live SDK data for SOL/USDC pool.

/rebalance → interactive confirm, mock action.

/alert 25 → background watcher → price alert fires → Telegram ping.

Why This Wins

Feels real → SDK data + persistence hack.

Impresses instantly → judges see live responses.

User-first design → onboarding flow, friendly UX.

Scalable vision → starts with SOL/USDC → expands into full DeFi assistant across Solana and beyond.

## Vision Beyond Hackathon

This isn’t just a weekend demo.
We see this evolving into a cross-chain DeFi assistant that helps retail traders navigate liquidity, yield, and alerts directly from their daily chat app — no dashboards, no barriers.

In short: It’s not “just another Telegram bot.”
It’s the start of the most accessible DLMM trading experience.
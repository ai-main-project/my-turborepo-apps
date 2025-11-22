# Texas Hold'em Poker

A real-time, bilingual (English/Chinese) Texas Hold'em Poker application built with Next.js, Node.js, Socket.IO, and Tailwind CSS.

## Features

- **Real-time Gameplay**: WebSocket-based communication for instant updates.
- **Bilingual UI**: Switch between English and Chinese.
- **Responsive Design**: Works on mobile, tablet, and desktop.
- **Game Logic**: Full Texas Hold'em rules (Pre-flop, Flop, Turn, River, Showdown).
- **Lobby System**: Join tables and play with others.

## Tech Stack

- **Frontend**: Next.js 14, Tailwind CSS, Zustand, next-intl.
- **Backend**: Node.js, Express, Socket.IO.
- **Shared**: TypeScript monorepo structure.

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Build shared packages:
   ```bash
   npm run build --filter=poker-shared
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```
   This will start both the web app (localhost:3000) and the server (localhost:3001).

### Docker

Build and run with Docker:

```bash
# Server
docker build -f Dockerfile.server -t texas-poker-server .
docker run -p 3001:3001 texas-poker-server

# Web
docker build -f Dockerfile.web -t texas-poker-web .
docker run -p 3000:3000 texas-poker-web
```

## Acceptance Tests

1. **Lobby**:
   - Open http://localhost:3000/en
   - Enter name and see list of tables.
   - Click "Join" to enter a table.

2. **Game**:
   - Verify you see the table, pot, and your avatar.
   - Open a second browser window (incognito) to join as a second player.
   - Click "Start Game" (if available) or wait for game to start.
   - Verify cards are dealt.
   - Verify betting actions (Check, Call, Raise, Fold) work and update state for both players.

3. **Localization**:
   - Switch URL to `/zh` and verify Chinese text.

import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { GameManager } from './GameManager';

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // Allow all origins for dev
    methods: ['GET', 'POST'],
  },
});

const gameManager = new GameManager();

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Send list of tables on connection
  socket.emit('tables_list', gameManager.getAllTables());

  socket.on('join_table', ({ tableId, name }) => {
    const player = gameManager.addPlayer(tableId, name, socket.id);
    if (player) {
      socket.join(tableId);
      io.to(tableId).emit('player_joined', player);
      
      // Send current table state to the joining player
      const table = gameManager.getTable(tableId);
      socket.emit('table_state', table);
    } else {
      socket.emit('error', { message: 'Could not join table' });
    }
  });

  socket.on('start_game', ({ tableId }) => {
    console.log('Starting game:', tableId);
    gameManager.startGame(tableId);
    const table = gameManager.getTable(tableId);
    if (table) {
      io.to(tableId).emit('table_state', table);
    }
  });

  socket.on('player_action', ({ tableId, action }) => {
    console.log('Player action:', action);
    gameManager.handleAction(tableId, { ...action, playerId: socket.id });
    const table = gameManager.getTable(tableId);
    if (table) {
      io.to(tableId).emit('table_state', table);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    gameManager.removePlayer(socket.id);
    // TODO: Notify table
  });
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

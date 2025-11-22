import { create } from 'zustand';
import { io, Socket } from 'socket.io-client';
import { ITable, IPlayer } from 'poker-shared';

interface GameState {
  socket: Socket | null;
  isConnected: boolean;
  tables: { id: string; playerCount: number }[];
  currentTable: ITable | null;
  currentPlayer: IPlayer | null;
  connect: () => void;
  createTable: (name: string) => void; // name is unused in backend for now but good for UI
  joinTable: (tableId: string, name: string) => void;
  leaveTable: () => void;
  startGame: (tableId: string) => void;
  performAction: (tableId: string, action: { type: string; amount?: number }) => void;
}

export const useGameStore = create<GameState>((set, get) => ({
  socket: null,
  isConnected: false,
  tables: [],
  currentTable: null,
  currentPlayer: null,

  connect: () => {
    if (get().socket) return;

    const socket = io('http://localhost:3001');

    socket.on('connect', () => {
      set({ isConnected: true });
    });

    socket.on('disconnect', () => {
      set({ isConnected: false });
    });

    socket.on('tables_list', (tables) => {
      set({ tables });
    });

    socket.on('table_state', (table) => {
      set({ currentTable: table });
    });

    socket.on('player_joined', (player) => {
      // If it's us, set currentPlayer
      if (player.id === socket.id) {
        set({ currentPlayer: player });
      }
    });

    set({ socket });
  },

  createTable: (name: string) => {
    // Backend doesn't support creating tables via socket yet, it has a default one.
    // We can add a socket event for this later.
    // For now, we just join the default one or list existing ones.
    console.log('Create table not implemented yet');
  },

  joinTable: (tableId: string, name: string) => {
    const socket = get().socket;
    if (socket) {
      socket.emit('join_table', { tableId, name });
    }
  },

  leaveTable: () => {
    const socket = get().socket;
    if (socket) {
      socket.disconnect();
      get().connect(); // Reconnect to get fresh state/lobby
      set({ currentTable: null, currentPlayer: null });
    }
  },

  startGame: (tableId: string) => {
    const socket = get().socket;
    if (socket) {
      socket.emit('start_game', { tableId });
    }
  },

  performAction: (tableId: string, action: { type: string; amount?: number }) => {
    const socket = get().socket;
    if (socket) {
      socket.emit('player_action', { tableId, action });
    }
  },
}));

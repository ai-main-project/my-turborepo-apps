import { create } from 'zustand';
import { ElevatorState, Direction, Request, ElevatorStore } from './types';
import { FLOORS, TRAVEL_TIME_PER_FLOOR, DOOR_OPEN_TIME, DOOR_CLOSE_TIME, WAIT_TIME } from './constants';
import { soundManager } from './sound';

interface ElevatorStoreState extends ElevatorStore {
  travelTimer: number;
  doorTimer: number;
}

export const useElevatorStore = create<ElevatorStoreState>((set, get) => ({
  currentFloor: 0,
  targetFloor: null,
  direction: 'IDLE',
  state: 'IDLE',
  requests: [],
  doorProgress: 0,
  travelTimer: 0,
  doorTimer: 0,

  addRequest: (request: Request) => {
    const { requests, currentFloor, state } = get();
    
    // Avoid duplicate requests
    const exists = requests.some(r => r.floor === request.floor && r.direction === request.direction);
    if (exists) return;

    // If request is for current floor and door is open/opening, just reset timer
    if (request.floor === currentFloor && (state === 'DOOR_OPEN' || state === 'DOOR_OPENING')) {
       set({ doorTimer: 0 });
       return;
    }

    set({ requests: [...requests, request] });
  },

  reset: () => {
    set({
      currentFloor: 0,
      targetFloor: null,
      direction: 'IDLE',
      state: 'IDLE',
      requests: [],
      doorProgress: 0,
      travelTimer: 0,
      doorTimer: 0,
    });
  },

  updateElevator: (dt: number) => {
    const { 
      state, 
      currentFloor, 
      direction, 
      requests, 
      travelTimer, 
      doorTimer,
    } = get();

    // Helper to check if we should stop at a floor
    const shouldStopAtFloor = (floor: number, currentDir: Direction) => {
      const hasRequestHere = requests.some(r => r.floor === floor);
      if (!hasRequestHere) return false;
      if (requests.some(r => r.floor === floor && r.type === 'INTERNAL')) return true;
      if (requests.some(r => r.floor === floor && r.direction === currentDir)) return true;
      const hasMoreInDirection = requests.some(r => {
        if (currentDir === 'UP') return r.floor > floor;
        if (currentDir === 'DOWN') return r.floor < floor;
        return false;
      });
      if (!hasMoreInDirection) return true;
      return false;
    };

    switch (state) {
      case 'IDLE': {
        if (requests.length === 0) return;
        const nextRequest = requests[0];
        let targetDir: Direction = nextRequest.floor > currentFloor ? 'UP' : 'DOWN';
        if (nextRequest.floor === currentFloor) targetDir = 'IDLE'; 

        set({ 
          state: nextRequest.floor === currentFloor ? 'DOOR_OPENING' : 'MOVING', 
          direction: targetDir,
          targetFloor: nextRequest.floor 
        });
        break;
      }

      case 'MOVING': {
        const newTimer = travelTimer + dt;
        if (newTimer >= TRAVEL_TIME_PER_FLOOR) {
          const nextFloor = direction === 'UP' ? currentFloor + 1 : currentFloor - 1;
          if (nextFloor < 0 || nextFloor >= FLOORS) {
             set({ direction: direction === 'UP' ? 'DOWN' : 'UP', travelTimer: 0 });
             return;
          }
          set({ currentFloor: nextFloor, travelTimer: 0 });
          if (shouldStopAtFloor(nextFloor, direction)) {
            set({ state: 'DOOR_OPENING', travelTimer: 0 });
          }
        } else {
          set({ travelTimer: newTimer });
        }
        break;
      }

      case 'DOOR_OPENING': {
        const newTimer = doorTimer + dt;
        const progress = Math.min(newTimer / DOOR_OPEN_TIME, 1);
        set({ doorProgress: progress, doorTimer: newTimer });
        
        if (newTimer >= DOOR_OPEN_TIME) {
          set({ state: 'DOOR_OPEN', doorTimer: 0, doorProgress: 1 });
          
          // Remove processed requests
          const remainingRequests = requests.filter(r => {
             if (r.floor === currentFloor && r.type === 'INTERNAL') return false;
             if (r.floor === currentFloor) {
                // For external, only remove if direction matches or if we have no other requests
                // Simplified: remove all requests for this floor when we open doors
                return false;
             }
             return true;
          });
          set({ requests: remainingRequests });
          soundManager.playDing();
        }
        break;
      }

      case 'DOOR_OPEN': {
        const newTimer = doorTimer + dt;
        if (newTimer >= WAIT_TIME) {
          set({ state: 'DOOR_CLOSING', doorTimer: 0 });
        } else {
          set({ doorTimer: newTimer });
        }
        break;
      }

      case 'DOOR_CLOSING': {
        const newTimer = doorTimer + dt;
        const progress = 1 - Math.min(newTimer / DOOR_CLOSE_TIME, 1);
        set({ doorProgress: progress, doorTimer: newTimer });

        if (newTimer >= DOOR_CLOSE_TIME) {
          set({ doorProgress: 0, doorTimer: 0 });
          
          if (requests.length === 0) {
            set({ state: 'IDLE', direction: 'IDLE' });
          } else {
            const hasMoreInDirection = requests.some(r => {
              if (direction === 'UP') return r.floor > currentFloor;
              if (direction === 'DOWN') return r.floor < currentFloor;
              return false;
            });

            if (hasMoreInDirection) {
              set({ state: 'MOVING' }); 
            } else {
              const hasAny = requests.length > 0;
              if (hasAny) {
                 set({ 
                   direction: direction === 'UP' ? 'DOWN' : 'UP',
                   state: 'MOVING' 
                 });
              } else {
                 set({ state: 'IDLE', direction: 'IDLE' });
              }
            }
          }
        }
        break;
      }
    }
  }
}));

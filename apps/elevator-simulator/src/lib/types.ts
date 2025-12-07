export type Direction = 'UP' | 'DOWN' | 'IDLE';

export type ElevatorState = 'IDLE' | 'MOVING' | 'DOOR_OPENING' | 'DOOR_OPEN' | 'DOOR_CLOSING';

export interface Request {
  floor: number;
  direction: Direction; // 'IDLE' for internal requests
  type: 'INTERNAL' | 'EXTERNAL';
}

export interface ElevatorStore {
  currentFloor: number;
  targetFloor: number | null;
  direction: Direction;
  state: ElevatorState;
  requests: Request[];
  doorProgress: number; // 0 to 1
  
  // Actions
  addRequest: (request: Request) => void;
  updateElevator: (dt: number) => void; 
  reset: () => void;
}

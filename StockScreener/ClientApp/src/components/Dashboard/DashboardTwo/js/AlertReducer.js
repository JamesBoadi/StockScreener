import { AlertStates } from './AlertStates.js';

/* change to match notificationa */ // Default states: 2, -1
export function AlertReducer(action) {
    switch (action) {
        case 2:
            return AlertStates.hitTP;
        case -1:
            return AlertStates.bearishSignal;
        case -2:
            return AlertStates.bearishSignalTwo;
        default:
            return AlertStates.noChange;
    }
}


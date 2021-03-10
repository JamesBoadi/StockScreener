import { AlertStates } from './AlertStates.js';

export function AlertReducer(action) {
    switch (action) {
        case 1:
            return AlertStates.hitTP;
        case -1:
            return AlertStates.bearishSignal;
        case -2:
            return AlertStates.bearishSignalTwo;
        default:
            return AlertStates.noChange;
    }
}


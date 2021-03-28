import { ADDREMINDER, EDITREMINDER, DELETEREMINDER, DELETEALLREMINDERS,  actions } from "../actions/reminder.actions";
import { Reminder } from '../classes/reminder';


export function reminderReducer(state: Reminder[] = JSON.parse(localStorage.getItem('reminders')) || [], action: actions) {
  let localState;
  switch (action.type) {
    case ADDREMINDER:
      localState = [...state, action.payload];
      localStorage.setItem('reminders', JSON.stringify(localState));
      return localState;
    case EDITREMINDER:
      localState = state.map(reminder =>
        reminder.id === action.payload.id ? action.payload : reminder);
      localStorage.setItem('reminders', JSON.stringify(localState));
      return localState
    case DELETEREMINDER:
      localState = state.filter(reminder => reminder.id !== action.payload.id);
      localStorage.setItem('reminders', JSON.stringify(localState));
      return localState;
    case DELETEALLREMINDERS:
      localState = [];
      localStorage.setItem('reminders', JSON.stringify(localState));
      return localState;
    default:
      localState = state
      localStorage.setItem('reminders', JSON.stringify(localState));
      return localState;
  }
}

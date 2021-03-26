import { ADDREMINDER, EDITREMINDER, DELETEREMINDER, actions } from "../actions/reminder.actions";
import { Reminder } from '../classes/reminder';


export function reminderReducer(state: Reminder[] = [], action: actions) {
  switch (action.type) {
    case ADDREMINDER:
      return [...state, action.payload];
    case EDITREMINDER:
      return state;
    case DELETEREMINDER:
      return state;
    default:
      return state;
  }
}

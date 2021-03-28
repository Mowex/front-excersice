import { ADDREMINDER, EDITREMINDER, DELETEREMINDER, DELETEALLREMINDERS,  actions } from "../actions/reminder.actions";
import { Reminder } from '../classes/reminder';


export function reminderReducer(state: Reminder[] = [], action: actions) {
  switch (action.type) {
    case ADDREMINDER:
      return [...state, action.payload]
    case EDITREMINDER:
      return state.map(reminder =>
        reminder.id === action.payload.id ? action.payload : reminder)
    case DELETEREMINDER:
      return state.filter(reminder => reminder.id !== action.payload.id)
    case DELETEALLREMINDERS:
      return []
    default:
      return state;
  }
}

import { Action } from "@ngrx/store";
import { Reminder } from "../classes/reminder";

export const ADDREMINDER = '[Reminder] Add';
export const EDITREMINDER = '[Reminder] Edit';
export const DELETEREMINDER = '[Reminder] Delete';

export class AddReminder implements Action {
  readonly type = ADDREMINDER;
  public payload: Reminder;
  constructor(payload: Reminder) {
    this.payload = payload;
  }
}

export class EditReminder implements Action {
  readonly type = EDITREMINDER;
  public payload: Reminder;
  constructor(payload: Reminder) {
    this.payload = payload;
  }
}

export class DeleteReminder implements Action {
  readonly type = DELETEREMINDER;
  public payload: Reminder;
  constructor(payload: Reminder) {
    this.payload = payload;
  }
}

export type actions = AddReminder | EditReminder | DeleteReminder;
